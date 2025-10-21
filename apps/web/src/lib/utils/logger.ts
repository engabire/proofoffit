type LogArgs = unknown[];

const shouldLog =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_RUNTIME === "edge";

const emit = (level: "info" | "warn" | "error", args: LogArgs) => {
  if (!shouldLog) return;

  switch (level) {
    case "info":
      // eslint-disable-next-line no-console
      console.info(...args);
      break;
    case "warn":
      // eslint-disable-next-line no-console
      console.warn(...args);
      break;
    case "error":
      // eslint-disable-next-line no-console
      console.error(...args);
      break;
  }
};

export const logger = {
  info: (...args: LogArgs) => emit("info", args),
  warn: (...args: LogArgs) => emit("warn", args),
  error: (...args: LogArgs) => emit("error", args),
};
