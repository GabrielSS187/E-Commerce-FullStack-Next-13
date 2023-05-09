import mongoose from "mongoose";
import { config } from "dotenv";
import { env } from "process";
import logger from "pino";

config();

const loggerInstance = logger();

export const databaseConnection = async (): Promise<void> => {
	try {
		if (env.NODE_ENV === "production") {
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			await mongoose.connect(env.DATABASE_URL!);
			loggerInstance.info("successful connection to mongoDB => P 🎉");
		}

		if (env.NODE_ENV === "development") {
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			await mongoose.connect(env.DATABASE_URL!);
			loggerInstance.info("successful connection to mongoDB => D 🎉");
		}
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		loggerInstance.error(`Error: ${error.message}`);
		process.exit(1);
	}
};
