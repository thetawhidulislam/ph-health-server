import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { validateRequest } from "../../middlewere/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";
import { checkAuth } from "../../middlewere/checkAuth";
import { Role } from "../../../generated/prisma/browser";

const router = Router();

router.get(
  "/",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.getAllDoctors,
);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.getDoctorById,
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDoctorZodSchema),
  DoctorController.updateDoctor,
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.deleteDoctor,
);

export const DoctorRouter = router;
