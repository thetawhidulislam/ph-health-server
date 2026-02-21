import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { validateRequest } from "../../middlewere/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

router.get("/", DoctorController.getAllDoctors);
router.get("/:id", DoctorController.getDoctorById);
router.patch(
  "/:id",
  validateRequest(updateDoctorZodSchema),
  DoctorController.updateDoctor,
);
router.delete("/:id", DoctorController.deleteDoctor);

export const DoctorRouter = router;
