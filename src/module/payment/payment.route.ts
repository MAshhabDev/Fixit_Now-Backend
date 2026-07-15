import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/create", auth("CUSTOMER"), paymentController.createCheckOutSession);
router.post("/webhook", paymentController.createCheckOutSession);

export const paymentRoute = router;
