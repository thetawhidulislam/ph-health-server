import dotenv from "dotenv";
import AppError from "../app/errorHelper/AppError";
import status from "http-status";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string;

  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
  EMAIL_SENDER: {
    STMP_HOST: string;
    STMP_PORT: string;
    STMP_USER: string;
    STMP_PASS: string;
  };
}
const loadEnvVariables = (): EnvConfig => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_STMP_HOST",
    "EMAIL_SENDER_STMP_PORT",
    "EMAIL_SENDER_STMP_USER",
    "EMAIL_SENDER_STMP_PASS",
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      // throw new Error(
      //   `Environment variable ${variable} is required but not set it .env file`,
      // );
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set it .env file`,
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env
      .BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env
      .BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
    EMAIL_SENDER: {
      STMP_HOST: process.env.EMAIL_SENDER_STMP_HOST as string,
      STMP_PORT: process.env.EMAIL_SENDER_STMP_PORT as string,
      STMP_USER: process.env.EMAIL_SENDER_STMP_USER as string,
      STMP_PASS: process.env.EMAIL_SENDER_STMP_PASS as string,
    },
  };
};

export const envVars = loadEnvVariables();
