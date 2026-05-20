import { Router, type IRouter } from "express";
import healthRouter from "./health";
import documentsRouter from "./documents";
import agentRouter from "./agent";

const router: IRouter = Router();

router.use(healthRouter);
router.use(documentsRouter);
router.use(agentRouter);

export default router;
