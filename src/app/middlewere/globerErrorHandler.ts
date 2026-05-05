import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interfaces";
import { handleZodError } from "../errorHelper/handleZodError";
import AppError from "../errorHelper/AppError";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";
import { deleteUploadedFilesFromGlobalErrorHandler } from "../utils/deleteUploadedFilesFromGlobalErrorHandler";

export const globarErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error From Globar error handler", err);
  }
  // if (req.file) {
  //   await deleteFileFromCloudinary(req.file.path);
  // }
  // if(req.files && Array.isArray(req.files) && req.files.length > 0){
  //   const imageUrls = req.files.map((file) => file.path);
  //   await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
  // }
  await deleteUploadedFilesFromGlobalErrorHandler(req);
  let errorSources: TErrorSources[] = [];
  let stack: string | undefined = undefined;
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "internal Server Error";

  if (err instanceof z.ZodError) {
    const simplifiendError = handleZodError(err);
    statusCode = simplifiendError.statusCode as number;
    message = simplifiendError.message;
    errorSources = [...simplifiendError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? stack : undefined,
    error: envVars.NODE_ENV === "development" ? err : undefined,
  };
  res.status(statusCode).json(errorResponse);
};
