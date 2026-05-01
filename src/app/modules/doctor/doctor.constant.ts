import { Prisma } from "../../../generated/prisma/client";

export const doctorSearchableFields = [
  "name",
  "email",
  "qualification",
  "designation",
  "currentWorkingPlace",
  "registrationNumber",
  "specialities.specialty.title",
];

export const doctorFilterableFields = [
  "gender",
  "isDeleted",
  "appointmentFee",
  "experience",
  "registrationNumber",
  "specialities.specialtyId",
  "currentWorkingPlace",
  "designation",
  "qualification",
  "specialities.specialty.title",
  "user.role",
];

export const doctorIncludeConfig: Partial<
  Record<
    keyof Prisma.DoctorInclude,
    Prisma.DoctorInclude[keyof Prisma.DoctorInclude]
  >
> = {
  user: true,
  specialities: {
    include: {
      specialty: true,
    },
  },
  appointments: {
    include: {
      patient: true,
      doctor: true,
    },
  },
  doctorSchedules: {
    include: {
      schedule: true,
    },
  },
  prescriptions: true,
  reviews: true,
};
