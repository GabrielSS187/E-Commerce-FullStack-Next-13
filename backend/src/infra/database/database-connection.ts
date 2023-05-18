import mongoose from "mongoose";
import { config } from "dotenv";
import { env } from "process";
import logger from "pino";

config();

const loggerInstance = logger();

export const databaseConnection = async (): Promise<void> => {
  try {
    const dbUrl =
      env.NODE_ENV === "production"
        ? env.DATABASE_URL_PROD!
        : env.DATABASE_URL_DEV!;
    await mongoose.connect(dbUrl);
    loggerInstance.info(`Successful connection to mongoDB => ${env.NODE_ENV}`);
  } catch (error: any) {
    loggerInstance.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
