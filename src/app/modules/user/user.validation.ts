import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z
    .string("password is requird")
    .min(6, "password must be at least 6 characters")
    .max(20, "password must be at least 2characters"),
  doctor: z.object({
    name: z
      .string("Name is Required")
      .min(5, "name must be at least 5 characters")
      .max(30, "name must be at least 30 characters"),
    email: z.email("Invaild Email Address"),
    contactNumber: z
      .string("Contact Number is required")
      .min(11, "contact number must be at least 11 characters")
      .max(14, "contact number musts be at most 15 characters"),
    address: z
      .string("Address is required")
      .min(10, "Address must be at least 10 characster")
      .max(100, "address must be at most 100 characters")
      .optional(),
    registrationNumber: z.string("Registration number is required"),
    experience: z
      .int("Experience is required")
      .nonnegative("experience can't negative number")
      .optional(),
    gender: z.enum(
      [Gender.FEMALE, Gender.MALE],
      "Gender must be either male or female",
    ),
    appointmentFee: z
      .number("Appointment Fee must be a number ")
      .nonnegative("Appointment Fee can't negative number"),
    qualification: z
      .string("qualification is required")
      .min(2, "qualification is must be at least 2 character")
      .max(50, "qualification is must be at most 50 character"),
    currentWorkingPlace: z
      .string("Currect working place is required")
      .min(2, "qualification is must be at least 2 character")
      .max(50, "qualification is must be at most 50 character"),
    designation: z
      .string("Designation is requied")
      .min(2, "must be at least 2 characters")
      .max(50, "Designation must be at most 50 characters"),
  }),
  specialities: z
    .array(z.uuid(), "specialities must be an array of string ")
    .min(1, "at last on to specialty is requird"),
});
