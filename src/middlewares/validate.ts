import type { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export type ValidationRule = {
  type: "string" | "number" | "boolean" | "email";
  required?: boolean;
  min?: number;
  max?: number;
};

export type ValidationRules = {
  [key: string]: ValidationRule;
};

export const validateInput = (rules: ValidationRules) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const errors: string[] = [];
    const body = req.body || {};

    for (const [field, rule] of Object.entries(rules)) {
      const val = body[field];

      if (rule.required && (val === undefined || val === null || val === "")) {
        errors.push(`${field} is required`);
        continue;
      }

      if (val !== undefined && val !== null && val !== "") {
        if (rule.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof val !== "string" || !emailRegex.test(val)) {
            errors.push(`${field} must be a valid email address`);
          }
        }
        else if (rule.type === "number") {
          const num = Number(val);
          if (isNaN(num)) {
            errors.push(`${field} must be a valid number`);
          } else {
            if (rule.min !== undefined && num < rule.min) {
              errors.push(`${field} must be at least ${rule.min}`);
            }
            if (rule.max !== undefined && num > rule.max) {
              errors.push(`${field} must be at most ${rule.max}`);
            }
          }
        }
        else if (typeof val !== rule.type) {
          errors.push(`${field} must be of type ${rule.type}`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation Error",
        errors,
      });
    }

    next();
  };
};
