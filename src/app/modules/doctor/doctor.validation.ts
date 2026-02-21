import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const updateDoctorZodSchema = z
  .object({
    name: z
      .string("Name is Required")
      .min(5, "name must be at least 5 characters")
      .max(30, "name must be at least 30 characters")
      .optional(),
    contactNumber: z
      .string("Contact Number is required")
      .min(11, "contact number must be at least 11 characters")
      .max(14, "contact number musts be at most 15 characters")
      .optional(),
    address: z
      .string("Address is required")
      .min(10, "Address must be at least 10 characster")
      .max(100, "address must be at most 100 characters")
      .optional(),
    registrationNumber: z.string("Registration number is required").optional(),
    experience: z
      .int("Experience is required")
      .nonnegative("experience can't negative number")
      .optional(),
    gender: z
      .enum(
        [Gender.FEMALE, Gender.MALE],
        "Gender must be either male or female",
      )
      .optional(),
    appointmentFee: z
      .number("Appointment Fee must be a number ")
      .nonnegative("Appointment Fee can't negative number")
      .optional(),
    qualification: z
      .string("qualification is required")
      .min(2, "qualification is must be at least 2 character")
      .max(50, "qualification is must be at most 50 character")
      .optional(),
    currentWorkingPlace: z
      .string("Currect working place is required")
      .min(2, "qualification is must be at least 2 character")
      .max(50, "qualification is must be at most 50 character")
      .optional(),
    designation: z
      .string("Designation is requied")
      .min(2, "must be at least 2 characters")
      .max(50, "Designation must be at most 50 characters")
      .optional(),

    specialities: z
      .array(z.uuid(), "specialities must be an array of string ")
      .min(1, "at last on to specialty is requird")
      .optional(),
  })
  .partial();
