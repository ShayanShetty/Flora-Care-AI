import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import scansRouter from "./scans";
import diseasesRouter from "./diseases";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(scansRouter);
router.use(diseasesRouter);

export default router;
