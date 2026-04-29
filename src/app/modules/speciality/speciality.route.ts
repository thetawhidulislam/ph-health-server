import { NextFunction, Request, Response, Router } from "express";
import { SpecialityController } from "./speciality.controller";
import { CookieUtils } from "../../utils/cookie";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { checkAuth } from "../../middlewere/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { validateRequest } from "../../middlewere/validateRequest";
import { specialityZodValidation } from "./speciality.validation";

const router = Router();

router.post(
  "/",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(specialityZodValidation.createSpecialityZodSchema),
  SpecialityController.createSpeciality,
);
router.get("/", SpecialityController.getAllSpeciality);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SpecialityController.deleteSpeciality,
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SpecialityController.updateSpeciality,
);

export const SpecialityRoutes = router;
