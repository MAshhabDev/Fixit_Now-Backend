import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import httpStatus from "http-status";

const getUserList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User List Retrieved successfully",
      data: result,
    });
  },
);
const getBookingList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllBookings();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking List Retrieved successfully",
      data: result,
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await adminService.updateUserStatus(id as string, status);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully done",
      data: result,
    });
  },
);

const verifyTechnician = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; 
    const { isVerified } = req.body; 

    const result = await adminService.verifyTechnician(
      id as string,
      isVerified,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician verification status updated successfully done",
      data: result,
    });
  },
);

export const adminController = {
  getBookingList,
  getUserList,
  updateUserStatus,
  verifyTechnician
};
