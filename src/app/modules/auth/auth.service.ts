import status from "http-status";
import { Role, User, UserStatus } from "../../../generated/prisma/client";
import AppError from "../../errorHelper/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import {
  IChangePasswordPayload,
  IloginUserPayload,
  IregisterPatientPayload,
} from "./auth.interface";

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

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExist = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: { user: true },
  });
  if (!isSessionTokenExist) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data as JwtPayload;
  console.log({ data });
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    email: data.email,
    name: data.name,
    isDeleted: data.isDeleted,
    status: data.status,
    emailVerified: data.emailVerified,
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    email: data.email,
    name: data.name,
    isDeleted: data.isDeleted,
    status: data.status,
    emailVerified: data.emailVerified,
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000), // 1 days
      updatedAt: new Date(),
    },
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};

const changePassword = async (
  payload: IChangePasswordPayload,
  sessionToken: string,
) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });
  if (!session) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        needPasswordChange: false,
      },
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    isDeleted: session.user.isDeleted,
    status: session.user.status,
    emailVerified: session.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    isDeleted: session.user.isDeleted,
    status: session.user.status,
    emailVerified: session.user.emailVerified,
  });
  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
  });
  return result;
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });
  }
  return result;
};

const forgetPassword = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email is not verified");
  }
  if (isUserExist.isDeleted && isUserExist.status === UserStatus.DELETED) {
    throw new AppError(status.BAD_REQUEST, "User not Found ");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};
const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email is not verified");
  }
  if (isUserExist.isDeleted && isUserExist.status === UserStatus.DELETED) {
    throw new AppError(status.BAD_REQUEST, "User not Found ");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });
  if (isUserExist.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExist.id,
      },
      data: {
        needPasswordChange: false,
      },
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id,
    },
  });
};

const googleLoginSuccess = async (session: Record<string, any>) => {
  const isPatientExist = await prisma.patient.findUnique({
    where: {
      userId: session.user.id,
    },
  });
  if (!isPatientExist) {
    await prisma.patient.create({
      data: {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
  });
  return {
    accessToken,
    refreshToken,
  };
};
export const authService = {
  resgisterPatient,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess,
};
