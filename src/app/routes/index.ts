import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.route";
import { DoctorRouter } from "../modules/doctor/doctor.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.route";
import { AppointmentRoutes } from "../modules/appointment/appointment.router";
import { PatientRoutes } from "../modules/patient/patient.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/specialties", SpecialityRoutes);
router.use("/users", UserRouter);
router.use("/patients", PatientRoutes);
router.use("/doctors", DoctorRouter);
router.use("/schedules", scheduleRoutes);
router.use("/doctor-schedules", DoctorScheduleRoutes);
router.use("/appointments", AppointmentRoutes);

export const IndexRoutes = router;
