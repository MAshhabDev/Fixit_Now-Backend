import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import httpStatus from "http-status";

const createCheckOutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.body;
    const userId = req.user?.id;

    const result = await paymentService.createCheckOutSession(
      bookingId,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment session created successfully done",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"] as string;
    const payload = (req as any).rawBody; 

    await paymentService.handleWebhook(payload, signature);

    res.status(httpStatus.OK).json({ received: true });
  },
);

const getPaymentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await paymentService.getPaymentHistory(
      userId as string,
      role as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully done",
      data: result,
    });
  },
);

const getPaymentDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await paymentService.getPaymentDetails(
      id as string,
      userId as string,
      role as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully done",
      data: result,
    });
  },
);

export const paymentController = {
  createCheckOutSession,
  handleWebhook,
  getPaymentHistory,
  getPaymentDetails,
};
