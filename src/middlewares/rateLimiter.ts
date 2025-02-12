import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1000 * 60 * 5,
  limit: 10,
  message: {
    error: "Entering cooldown, please wait before sending anymore requests.",
  },
  legacyHeaders: true,
});

export default limiter;
