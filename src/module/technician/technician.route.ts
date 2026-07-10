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

export const technicianRoute = router;
