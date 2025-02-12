import express from "express";
import {
  getTotalAnalytics,
  getAliasAnalytics,
  getTopicAnalytics,
} from "../controllers/analyticsController";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.get("/overall", getTotalAnalytics);
router.get("/topic/:topic", getTopicAnalytics);
router.get("/:alias", getAliasAnalytics);

export default router;
