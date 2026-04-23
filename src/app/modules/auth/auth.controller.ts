import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelper/AppError";

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

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  console.log({ user });
  const result = await authService.getMe(user as any);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User Info Retrived Successfully",
    data: result,
  });
});

const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const sessionToken = req.cookies["better-auth.session_token"];

  if (!refreshToken || !sessionToken) {
    throw new AppError(
      status.BAD_REQUEST,
      "Refresh token and session token are required",
    );
  }
  const result = await authService.getNewToken(refreshToken, sessionToken);
  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
  tokenUtils.setBetterAuthSessionCokkie(res, result.sessionToken);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "New tokens generated successfully",
    data: result,
  });
});
export const authController = {
  resgisterPatient,
  loginUser,
  getMe,
  getNewToken,
};
