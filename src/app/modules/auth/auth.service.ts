import status from "http-status";
import { Role, User, UserStatus } from "../../../generated/prisma/client";
import AppError from "../../errorHelper/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";

interface IregisterPatientPayload {
  name: string;
  email: string;
  password: string;
}
interface IloginUserPayload {
  email: string;
  password: string;
}
const resgisterPatient = async (payload: IregisterPatientPayload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
  if (!data.user) {
    throw new AppError(status.NOT_FOUND, "failed to register patient");
  }

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return patientTx;
    });
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      isDeleted: data.user.isDeleted,
      status: data.user.status,
      emailVerified: data.user.emailVerified,
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      isDeleted: data.user.isDeleted,
      status: data.user.status,
      emailVerified: data.user.emailVerified,
    });
    return { ...data, accessToken, refreshToken, patient };
  } catch (error) {
    console.log(`Transction error`, error);
    await prisma.user.delete({
      where: { id: data.user.id },
    });
    throw error;
  }
};

const loginUser = async (payload: IloginUserPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is Blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "User is deleted");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    isDeleted: data.user.isDeleted,
    status: data.user.status,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    isDeleted: data.user.isDeleted,
    status: data.user.status,
    emailVerified: data.user.emailVerified,
  });
  return { ...data, accessToken, refreshToken };
};

const getMe = async (user: IRequestUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      patient: {
        include: {
          appointments: true,
          reviews: true,
          patientHealthData: true,
          prescriptions: true,
          medicalReports: true,
        },
      },
      doctor: {
        include: {
          appointments: true,
          reviews: true,
          specialities: true,
          prescriptions: true,
        },
      },
      admin: true,
    },
  });
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  return isUserExist;
};
export const authService = {
  resgisterPatient,
  loginUser,
  getMe,
};
