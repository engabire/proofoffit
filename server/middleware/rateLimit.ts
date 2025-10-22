import rateLimit from "express-rate-limit";

export const searchLimiter = rateLimit({
    windowMs: 60_000,
    max: Number(process.env.SEARCH_RATE_MAX ?? 60),
    standardHeaders: true,
    legacyHeaders: false,
});
