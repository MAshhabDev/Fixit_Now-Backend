import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth("TECHNICIAN"), serviceController.createService);
router.get("/", serviceController.getAllService);

router.put("/:id", auth("TECHNICIAN"), serviceController.updateService);
router.delete("/:id", auth("TECHNICIAN"), serviceController.deleteService);

export const serviceRoute = router;
