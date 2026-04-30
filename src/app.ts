import express, { Application, NextFunction, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";

import { IndexRoutes } from "./app/routes";
import { success } from "better-auth";
import { globarErrorHandler } from "./app/middlewere/globerErrorHandler";
import { notFound } from "./app/middlewere/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import { envVars } from "./config/env";
import qs from "qs";

const app: Application = express();

app.set("query parser", (string: string) => qs.parse(string));
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL || envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // allowHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api/auth", toNodeHandler(auth));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", IndexRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
  const specialty = await prisma.speciality.create({
    data: {
      title: "updated",
    },
  });
  res.status(201).json({
    success: true,
    message: "Api is Working",
    data: specialty,
  });
});

app.use(globarErrorHandler);
app.use(notFound);
export default app;
