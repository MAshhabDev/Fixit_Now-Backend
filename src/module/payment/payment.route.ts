import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/create", auth("CUSTOMER"), paymentController.createCheckOutSession);
router.post("/webhook", paymentController.handleWebhook); 
router.get("/", auth("CUSTOMER", "TECHNICIAN", "ADMIN"), paymentController.getPaymentHistory);
router.get("/:id", auth("CUSTOMER", "TECHNICIAN", "ADMIN"), paymentController.getPaymentDetails);

export const paymentRoute = router;
