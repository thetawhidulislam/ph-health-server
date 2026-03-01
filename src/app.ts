import express, { Application, NextFunction, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";

import { IndexRoutes } from "./app/routes";
import { success } from "better-auth";
import { globarErrorHandler } from "./app/middlewere/globerErrorHandler";
import { notFound } from "./app/middlewere/notFound";
import cookieParser from "cookie-parser";

const app: Application = express();
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
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
