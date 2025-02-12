import express from 'express'
import * as shortenController from '../controllers/shortenController'
import { authMiddleware } from "../middlewares/auth";
import limiter from '../middlewares/rateLimiter';

const router = express.Router()

router.post("/", authMiddleware, limiter,shortenController.urlShortener);
router.get('/:alias', shortenController.urlRedirecter)

export default router;