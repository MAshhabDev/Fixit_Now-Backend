import { Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.put("/profile", auth("TECHNICIAN"), technicianController.updateProfile);
router.put(
  "/availability",
  auth("TECHNICIAN"),
  technicianController.updateAvailability,
);
router.get(
  "/bookings",
  auth("TECHNICIAN"),
  technicianController.getTechnicianBooking,
);

export const technicianRoute = router;
