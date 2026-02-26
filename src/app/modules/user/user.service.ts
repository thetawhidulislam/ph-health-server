import { notFound } from "./../../middlewere/notFound";
import { Role, Speciality } from "../../../generated/prisma/client";
import AppError from "../../errorHelper/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreatedDoctorPayload } from "./user.interface";
import status from "http-status";

const createUser = async (payload: ICreatedDoctorPayload) => {
  const Specialities: Speciality[] = [];
  for (const SpecialityId of payload.specialities) {
    const speciality = await prisma.speciality.findUnique({
      where: {
        id: SpecialityId,
      },
    });
    if (!speciality) {
      throw new AppError(
        status.NOT_FOUND,
        `Specialty with id ${SpecialityId} not found`,
      );
    }
    Specialities.push(speciality);
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });
  if (userExists) {
    throw new AppError(status.CONFLICT, "User With This Email Already Exists");
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      needPasswordChange: true,
    },
  });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });
      const doctorSpecialtyData = Specialities.map((speciality) => {
        return {
          doctorId: doctorData.id,
          specialtyId: speciality.id,
        };
      });
      await tx.doctorSpeciality.createMany({
        data: doctorSpecialtyData,
      });
      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          gender: true,
          qualification: true,
          createdAt: true,
          updatedAt: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              image: true,
              deletedAT: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          specialities: {
            select: {
              specialty: {
                select: {
                  title: true,
                  id: true,
                },
              },
            },
          },
        },
      });
      return doctor;
    });
    return result;
  } catch (error) {
    console.log("Transation Error:", error);
    await prisma.user.delete({
      where: { id: userData.user.id },
    });
    throw error;
  }
};

export const DoctorService = {
  createUser,
};
