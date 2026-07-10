import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { serviceServices } from "./service.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await serviceServices.createService(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Service Created successfully",
      data: result,
    });
  },
);

const getAllService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await serviceServices.getAllService(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      data: result,
    });
  },
);

const updateService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { id: serviceId } = req.params;
    const payload = req.body;

    const result = await serviceServices.updateService(
      serviceId as string,
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service Updated successfully",
      data: result,
    });
  },
);

const deleteService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await serviceServices.deleteService(
      id as string,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service Deleted successfully",
      data: result,
    });
  },
);

export const serviceController = {
  createService,
  getAllService,
  updateService,
  deleteService,
};
