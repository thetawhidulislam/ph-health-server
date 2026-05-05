import status from "http-status";
import { PaymentStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const giveReview = async (
  user: IRequestUser,
  payload: ICreateReviewPayload,
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });
  if (appointmentData.paymentStatus !== PaymentStatus.PAID) {
    throw new AppError(status.BAD_REQUEST, "You can only review after payment");
  }
  if (appointmentData.patientId !== patientData.id) {
    throw new AppError(
      status.BAD_REQUEST,
      "You can only review your appointments",
    );
  }
  const isReviewd = await prisma.review.findFirst({
    where: {
      appointmentId: payload.appointmentId,
    },
  });
  if (isReviewd) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already reviewed this appointment",
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        ...payload,
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
      },
    });
    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: appointmentData.doctorId,
      },
      _avg: {
        rating: true,
      },
    });
    await tx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });
    return review;
  });
  return result;
};
const getAllReviews = async () => {};
const myReviews = async () => {};
const updateReview = async () => {};
const deleteReview = async () => {};
export const ReviewService = {
  giveReview,
  getAllReviews,
  myReviews,
  updateReview,
  deleteReview,
};
