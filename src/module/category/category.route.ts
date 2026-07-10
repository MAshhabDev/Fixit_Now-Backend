import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const adminRouter = Router();

const publicRouter = Router();

adminRouter.post("/", auth("ADMIN"), categoryController.createCategory);
adminRouter.get("/", auth("ADMIN"), categoryController.getAllCategory);
publicRouter.get("/", categoryController.getAllCategories);

export const adminCategoryRoute = adminRouter;
export const publicCategoryRoute = publicRouter;
