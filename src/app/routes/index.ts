import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.route";
import { DoctorRouter } from "../modules/doctor/doctor.route";

const router = Router();


router.use("/auth", AuthRoutes);
router.use("/specialties", SpecialityRoutes);
router.use("/users", UserRouter);
router.use("/doctors", DoctorRouter);

export const IndexRoutes = router;
