import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error Details: ", err);

  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
    errorName = "PrismaClientValidationError";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    errorName = "PrismaClientKnownRequestError";
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Duplicate Key Error: Record already exists.";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Foreign key constraint failed: Related record not found.";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      errorMessage =
        "Record not found: The requested operation depends on a record that does not exist.";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    errorName = "PrismaClientInitializationError";
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      errorMessage =
        "Authentication failed against database server. Please check your credentials.";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Can't reach database server. Please check connection.";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = "An unknown error occurred during database query execution.";
    errorName = "PrismaClientUnknownRequestError";
  }

  res.status(Number(statusCode)).json({
    success: false,
    statusCode,
    name: errorName,
    message: errorMessage,
    error: err.stack,
  });
};


