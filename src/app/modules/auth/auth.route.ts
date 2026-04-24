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
router.post("/refresh-token", authController.getNewToken);
router.post(
  "/change-password",
  checkAuth(Role.SUPER_ADMIN, Role.PATIENT, Role.DOCTOR, Role.ADMIN),
  authController.changePassword,
);
router.post(
  "/logout",
  checkAuth(Role.SUPER_ADMIN, Role.PATIENT, Role.DOCTOR, Role.ADMIN),
  authController.logoutUser,
);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);

router.post("/email-verify", authController.verifyEmail);
export const AuthRoutes = router;
