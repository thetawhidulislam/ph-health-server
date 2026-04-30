import { Response } from "express";

interface Iresponse<T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const sendResponse = <T>(res: Response, responseData: Iresponse<T>) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta,
  });
};
