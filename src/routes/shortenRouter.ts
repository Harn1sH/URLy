import express from 'express'
import * as shortenController from '../controllers/shortenController'
import { authMiddleware } from "../middlewares/auth";

const router = express.Router()

router.post("/", authMiddleware, shortenController.urlShortener);
router.get('/:alias', shortenController.urlRedirecter)

export default router;