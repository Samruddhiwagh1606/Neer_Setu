import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import providersRouter from "./providers";
import serviceRequestsRouter from "./service-requests";
import usersRouter from "./users";
import ngosRouter from "./ngos";
import schemesRouter from "./schemes";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/providers", providersRouter);
router.use("/service-requests", serviceRequestsRouter);
router.use("/users", usersRouter);
router.use("/ngos", ngosRouter);
router.use(schemesRouter);

export default router;
