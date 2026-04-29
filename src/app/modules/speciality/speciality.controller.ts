import { NextFunction, Request, RequestHandler, Response } from "express";
import { SpecialityService } from "./speciality.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    icon: req.file?.path,
  };
  // console.log(payload);
  const result = await SpecialityService.createSpeciality(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Speciality Created Sucessfully",
    data: result,
  });
});

const getAllSpeciality = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialityService.getAllSpeciality();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "specialty fetched successfully",
    data: result,
  });
});

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialityService.deleteSpeciality(id as string);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Speciality delete Sucessfully",
    data: result,
  });
});

const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await SpecialityService.updateSpeciality(
    id as string,
    payload,
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Speciality update Sucessfully",
    data: result,
  });
});

export const SpecialityController = {
  createSpeciality,
  getAllSpeciality,
  deleteSpeciality,
  updateSpeciality,
};
