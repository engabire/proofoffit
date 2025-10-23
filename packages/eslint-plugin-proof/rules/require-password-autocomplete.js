"use strict";

const ALLOWED_AUTOCOMPLETE_VALUES = new Set([
  "current-password",
  "new-password",
  "one-time-code",
]);

const ALLOWED_TYPE_VALUES = new Set(["password"]);

function getElementName(node) {
  if (node.name.type === "JSXIdentifier") {
    return node.name.name;
  }

  if (
    node.name.type === "JSXMemberExpression" &&
    node.name.property &&
    node.name.property.type === "JSXIdentifier"
  ) {
    return node.name.property.name;
  }

  return null;
}

function isPasswordLikeComponent(name) {
  return name === "input" || name === "Input";
}

function getAttribute(node, attributeName) {
  return node.attributes.find((attribute) => {
    if (!attribute || attribute.type !== "JSXAttribute") {
      return false;
    }

    if (attribute.name.type === "JSXIdentifier") {
      return attribute.name.name === attributeName;
    }

    if (attribute.name.type === "JSXNamespacedName") {
      return (
        `${attribute.name.namespace.name}:${attribute.name.name.name}` ===
        attributeName
      );
    }

    return false;
  });
}

function extractStringValues(node) {
  if (!node) return { type: "unknown", values: [] };

  switch (node.type) {
    case "Literal":
    case "StringLiteral": {
      if (typeof node.value === "string") {
        return { type: "literal", values: [node.value] };
      }
      return { type: "unknown", values: [] };
    }
    case "TemplateLiteral": {
      if (node.expressions.length === 0 && node.quasis.length === 1) {
        return {
          type: "literal",
          values: [node.quasis[0].value.cooked || ""],
        };
      }
      return { type: "unknown", values: [] };
    }
    case "ConditionalExpression": {
      const consequent = extractStringValues(node.consequent);
      const alternate = extractStringValues(node.alternate);

      if (
        consequent.type === "unknown" ||
        alternate.type === "unknown" ||
        !consequent.values.length ||
        !alternate.values.length
      ) {
        return { type: "unknown", values: [] };
      }

      return {
        type: "conditional",
        values: [...new Set([...consequent.values, ...alternate.values])],
      };
    }
    case "LogicalExpression": {
      const left = extractStringValues(node.left);
      const right = extractStringValues(node.right);
      if (left.type === "unknown" && right.type === "unknown") {
        return { type: "unknown", values: [] };
      }
      return {
        type: "logical",
        values: [...new Set([...left.values, ...right.values])],
      };
    }
    case "JSXExpressionContainer":
      return extractStringValues(node.expression);
    default:
      return { type: "unknown", values: [] };
  }
}

function hasPasswordType(openingElement) {
  const typeAttribute =
    getAttribute(openingElement, "type") ||
    getAttribute(openingElement, "Type");

  if (!typeAttribute) return false;

  if (!typeAttribute.value) {
    return false;
  }

  const { values, type } = extractStringValues(typeAttribute.value);
  if (type === "unknown") {
    return false;
  }

  return values.some((value) => ALLOWED_TYPE_VALUES.has(value));
}

function evaluateAutoComplete(openingElement) {
  const autoCompleteAttribute =
    getAttribute(openingElement, "autoComplete") ||
    getAttribute(openingElement, "autocomplete");

  if (!autoCompleteAttribute) {
    return { status: "missing", attribute: null };
  }

  const attributeNode = autoCompleteAttribute.value;

  if (!attributeNode) {
    return {
      status: "invalid",
      attribute: autoCompleteAttribute,
      value: null,
      reason: "Boolean shorthand is not supported for autoComplete.",
    };
  }

  const { values, type } = extractStringValues(attributeNode);

  if (type === "unknown" || values.length === 0) {
    return {
      status: "unknown",
      attribute: autoCompleteAttribute,
    };
  }

  const invalidValue = values.find(
    (value) => !ALLOWED_AUTOCOMPLETE_VALUES.has(value),
  );

  if (invalidValue) {
    return {
      status: "invalid",
      attribute: autoCompleteAttribute,
      value: invalidValue,
      reason: `Unexpected value "${invalidValue}"`,
    };
  }

  return {
    status: "valid",
    attribute: autoCompleteAttribute,
    values,
  };
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure password inputs include an autoComplete hint with an allowed value.",
      category: "Best Practices",
      recommended: false,
    },
    schema: [],
    messages: {
      missing:
        "Password inputs must include autoComplete with one of: {{allowedValues}}.",
      invalid:
        "Password autoComplete value is invalid. {{reason}} Allowed: {{allowedValues}}.",
      unknown:
        "Unable to verify autoComplete. Use literal strings from: {{allowedValues}}.",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementName = getElementName(node);
        if (!elementName || !isPasswordLikeComponent(elementName)) {
          return;
        }

        if (!hasPasswordType(node)) {
          return;
        }

        const evaluation = evaluateAutoComplete(node);
        const allowedValues = Array.from(ALLOWED_AUTOCOMPLETE_VALUES).join(
          ", ",
        );

        if (evaluation.status === "missing") {
          context.report({
            node,
            messageId: "missing",
            data: { allowedValues },
          });
          return;
        }

        if (evaluation.status === "invalid") {
          context.report({
            node: evaluation.attribute,
            messageId: "invalid",
            data: {
              allowedValues,
              reason: evaluation.reason || "Invalid value provided",
            },
          });
          return;
        }

        if (evaluation.status === "unknown") {
          context.report({
            node: evaluation.attribute || node,
            messageId: "unknown",
            data: { allowedValues },
          });
        }
      },
    };
  },
};
