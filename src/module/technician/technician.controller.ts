import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { technicianService } from "./technician.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await technicianService.updateProfile(id as string, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician Profile Updated successfully",
      data: result,
    });
  },
);
const updateAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const { availability } = req.body;

    const result = await technicianService.updateAvailability(
      id as string,
      availability,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician Availability Updated successfully",
      data: result,
    });
  },
);
const getTechnicianBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;

    const result = await technicianService.getTechnicianBooking(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician Bookings Retrieved successfully",
      data: result,
    });
  },
);

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const { status } = req.body;
    const result = await technicianService.updateBookingStatus(
      id as string,
      userId as string,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking Status Updated successfully Done",
      data: result,
    });
  },
);

export const technicianController = {
  updateAvailability,
  updateProfile,
  getTechnicianBooking,
  updateBookingStatus
};
