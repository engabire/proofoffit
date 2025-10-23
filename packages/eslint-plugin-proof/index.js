"use strict";

const requirePasswordAutocompleteRule = require("./rules/require-password-autocomplete");

module.exports = {
  rules: {
    "require-password-autocomplete": requirePasswordAutocompleteRule,
  },
  configs: {
    recommended: {
      plugins: ["proof"],
      rules: {
        "proof/require-password-autocomplete": "error",
      },
    },
  },
};
