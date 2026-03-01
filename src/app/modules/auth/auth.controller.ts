import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const resgisterPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.resgisterPatient(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCokkie(res, token as string);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "patient Resgiters successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      rest,
    },
  });
});
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCokkie(res, token);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "patient login successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      rest,
    },
  });
});

export const authController = {
  resgisterPatient,
  loginUser,
};
