import { Server } from "http";
import app from "./app";
import { seedSuperAdmin } from "./app/utils/seed";
import { envVars } from "./config/env";

let server: Server | undefined;
const bootstrap = async () => {
  try {
    await seedSuperAdmin();
    server = app.listen(envVars.PORT, () => {
      console.log(`server is running on ${envVars.PORT}`);
    });
  } catch (error) {
    console.log("Failed To Start Server");
  }
};

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception! Shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed. Exiting process.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed. Exiting process.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
bootstrap();
