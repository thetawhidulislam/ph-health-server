import { Request, Response } from "express";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";
import { sendResponse } from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import catchAsync from "../../shared/catchAsync";

const createMyDoctorSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const doctorSchedule = "";
    sendResponse(res, {
      success: true,
      httpStatusCode: status.CREATED,
      message: "Doctor schedule created successfully",
      data: doctorSchedule,
    });
  },
);

const getMyDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const query = req.query;
  const result = "";
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Doctor schedules retrieved successfully",
  });
});

const getAllDoctorSchedules = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;
    const result = "";
    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "All doctor schedules retrieved successfully",
      data: result,
    });
  },
);

const getDoctorScheduleById = catchAsync(
  async (req: Request, res: Response) => {
    const doctorId = req.params.doctorId;
    const scheduleId = req.params.scheduleId;
    const doctorSchedule = "";
    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "Doctor schedule retrieved successfully",
      data: doctorSchedule,
    });
  },
);

const updateMyDoctorSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const updatedDoctorSchedule = "";
    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "Doctor schedule updated successfully",
      data: updatedDoctorSchedule,
    });
  },
);

const deleteMyDoctorSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = req.user;

    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "Doctor schedule deleted successfully",
    });
  },
);

export const DoctorScheduleController = {
  createMyDoctorSchedule,
  getMyDoctorSchedules,
  getAllDoctorSchedules,
  getDoctorScheduleById,
  updateMyDoctorSchedule,
  deleteMyDoctorSchedule,
};
