import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.route";
import { DoctorRouter } from "../modules/doctor/doctor.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.route";
import { AppointmentRoutes } from "../modules/appointment/appointment.router";
import { PatientRoutes } from "../modules/patient/patient.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { PrescriptionRoutes } from "../modules/prescription/prescription.route";
import { StatsRoutes } from "../modules/stats/stats.route";
import { PaymentRoutes } from "../modules/payment/payment.router";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/specialties", SpecialityRoutes);
router.use("/users", UserRouter);
router.use("/patients", PatientRoutes);
router.use("/doctors", DoctorRouter);
router.use("/schedules", scheduleRoutes);
router.use("/doctor-schedules", DoctorScheduleRoutes);
router.use("/appointments", AppointmentRoutes);
router.use("/review", ReviewRoutes);
router.use("/prescription", PrescriptionRoutes);
router.use("/payment", PaymentRoutes);
router.use("/stats", StatsRoutes);

export const IndexRoutes = router;
