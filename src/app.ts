import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoute } from "./module/auth/auth.route";
import {
  adminCategoryRoute,
  publicCategoryRoute,
} from "./module/category/category.route";
import { technicianRoute } from "./module/technician/technician.route";
import { serviceRoute } from "./module/service/service.route";
import { bookingRoute } from "./module/booking/booking.route";
import { reviewRoute } from "./module/review/review.route";
import { adminRoute } from "./module/admin/admin.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { paymentRoute } from "./module/payment/payment.route";

export const app: Application = express();

app.use(cors({ origin: true, credentials: true }));

app.use("/api/subscription/webhook", express.raw({ type: 'application/json' }))


app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoute);

app.use("/api/categories", publicCategoryRoute);
app.use("/api/admin/categories", adminCategoryRoute);

app.use("/api/technician", technicianRoute);
app.use("/api/services", serviceRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/review", reviewRoute);
app.use("/api/admin", adminRoute);
app.use("/api/payment", paymentRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome To The Fixit Now Server");
});

app.use(globalErrorHandler);
app.use(notFound);
