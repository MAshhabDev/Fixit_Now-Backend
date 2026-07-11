import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth("CUSTOMER"), bookingController.createBooking);
router.get("/", auth("CUSTOMER"), bookingController.getCustomerBooking);
router.get(
  "/:id",
  auth("CUSTOMER", "ADMIN", "TECHNICIAN"),
  bookingController.getBookingDetails,
);

export const bookingRoute = router;
