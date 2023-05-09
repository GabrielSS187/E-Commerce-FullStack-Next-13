import express, { Express, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import { AddressInfo } from "net";
import { config } from "dotenv";
import { databaseConnection } from "../database/Database-connection";
import logger from "pino";
import { errors as celebrateErrors } from "celebrate";

config();

export const app: Express = express();

const whitelist = [process.env.URL_APP];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
databaseConnection();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  const address = server.address() as AddressInfo;
  const loggerInstance = logger();
  loggerInstance.info(`Server is running in http://localhost:${address.port}`);
});

app.use(celebrateErrors());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const loggerInstance = logger();
  loggerInstance.error(err.message);
  res.status(500).json({ error: "Internal server error" });
});

process.on("unhandledRejection", (err) => {
  const loggerInstance = logger();
  loggerInstance.error(err);
  process.exit(1);
});
