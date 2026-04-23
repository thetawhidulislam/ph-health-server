import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewere/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", authController.resgisterPatient);
router.post("/login", authController.loginUser);
router.get(
  "/me",
  checkAuth(Role.SUPER_ADMIN, Role.PATIENT, Role.DOCTOR, Role.ADMIN),
  authController.getMe,
);
export const AuthRoutes = router;
