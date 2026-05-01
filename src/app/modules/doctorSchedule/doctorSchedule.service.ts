import { DoctorSchedules, Prisma } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interfaces/query.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";

const createMyDoctorSchedule = async () => {};

const getAllDoctorSchedules = async () => {};

const getMyDoctorSchedules = async () => {};

const getDoctorScheduleById = async () => {};

const updateMyDoctorSchedule = async () => {};

const deleteMyDoctorSchedule = async (id: string, user: IRequestUser) => {};

export const DoctorScheduleService = {
  createMyDoctorSchedule,
  getAllDoctorSchedules,
  getDoctorScheduleById,
  updateMyDoctorSchedule,
  deleteMyDoctorSchedule,
  getMyDoctorSchedules,
};
