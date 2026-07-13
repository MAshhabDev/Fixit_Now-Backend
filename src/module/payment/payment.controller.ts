import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createCheckOutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await paymentService.createCheckOutSession;

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category Created successfully",
      data: result,
    });
  },
);

export const paymentController = { createCheckOutSession };
