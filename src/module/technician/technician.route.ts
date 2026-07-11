import { Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.put("/profile", auth("TECHNICIAN"), technicianController.updateProfile);

router.get("/", technicianController.getAllTechnician);
router.get("/:id", technicianController.getSingleTechnician);

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
router.patch(
  "/bookings/:id",
  auth("TECHNICIAN"),
  technicianController.updateBookingStatus,
);

export const technicianRoute = router;
