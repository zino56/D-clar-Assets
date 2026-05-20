import { Router, type IRouter } from "express";
import {
  agentActivity,
  getAgentOverview,
  getInboxSummary,
  skillsRegistry,
  toolsRegistry,
} from "../data/store";

const router: IRouter = Router();

router.get("/inbox/summary", (_req, res) => {
  res.json(getInboxSummary());
});

router.get("/agent-activity", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  res.json({ items: agentActivity.slice(0, limit) });
});

router.get("/skills", (_req, res) => {
  res.json({ items: skillsRegistry });
});

router.get("/tools", (_req, res) => {
  res.json({ items: toolsRegistry });
});

router.get("/agent/overview", (_req, res) => {
  res.json(getAgentOverview());
});

export default router;
