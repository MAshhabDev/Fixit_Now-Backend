import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { config } from "../config";
import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import type { Role } from "../../generated/prisma/enums";

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Invalid Token");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { id, name, email, role } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new Error("Forbidden");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (user.status === "BLOCKED") {
      throw new Error("Your Account Has Been Blocked");
    }

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();
  });
};
