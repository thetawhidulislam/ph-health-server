import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { CookieUtils } from "../utils/cookie";
import AppError from "../errorHelper/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorzied access! no session token provided",
        );
      }
      // Session Token
      if (sessionToken) {
        const sesionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sesionExists && sesionExists.user) {
          const user = sesionExists.user;
          const now = new Date();
          const expiresAt = new Date(sesionExists.expiresAt);
          const createdAt = new Date(sesionExists.createdAt);
          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time_Remaining", timeRemaining.toString());
            console.log("Session Expiring Soon");
          }
          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorzied access! User Is not Active",
            );
          }
          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorzied access! User Is deleted",
            );
          }
          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden Access ! You do not have permission to access this resource",
            );
          }
          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }
      }

      // access Token
      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized Access ! no access token provided",
        );
      }
      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );
      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized Access ! no access token provided",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
