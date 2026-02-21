import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";

import { validateRequest } from "../../middlewere/validateRequest";
import { createDoctorZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/create-doctor",
  validateRequest(createDoctorZodSchema),
  UserController.createUser,
);

export const UserRouter = router;
