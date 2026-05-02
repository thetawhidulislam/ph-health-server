import app from "./app";
import { seedSuperAdmin } from "./app/utils/seed";
import { envVars } from "./config/env";

const bootstrap = async () => {
  try {
    await seedSuperAdmin();
    app.listen(envVars.PORT, () => {
      console.log(`server is running on ${envVars.PORT}`);
    });
  } catch (error) {
    console.log("Failed To Start Server");
  }
};

bootstrap();
