import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/enums";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;

    const result = await bookingService.createBooking(id as string, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking Created successfully",
      data: {
        result,
      },
    });
  },
);
const getCustomerBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;

    const result = await bookingService.getCustomerBooking(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Customers Booking Retrieved successfully",
      data: {
        result,
      },
    });
  },
);
const getBookingDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await bookingService.getBookingDetails(
      id as string,
      userId as string,
      role as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking Details Retrieved successfully",
      data: result,
    });
  },
);

export const bookingController = { createBooking, getCustomerBooking,getBookingDetails };
