import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";

const router = Router();
router.get("/users", auth("ADMIN"), adminController.getUserList);
router.get("/bookings", auth("ADMIN"), adminController.getBookingList);
router.patch("/users/:id", auth("ADMIN"), adminController.updateUserStatus);
router.patch(
  "/technician/:id/verify",
  auth("ADMIN"),
  adminController.verifyTechnician
);

export const adminRoute = router;
