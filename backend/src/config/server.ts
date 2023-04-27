import express, { Express, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import { AddressInfo } from "net";
import { env } from "process";

export const app: Express = express();

//* Definir as origens permitidas
const whitelist = [env.URL_APP];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET","PUT","POST","DELETE"],
  credentials: true
};

//* Usar o middleware CORS
app.use(cors(corsOptions)),
app.use(express.json());

//* Definir o tempo de vida máximo das solicitações CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Max-Age", "86400") //* 24h;
  next();
});

//* Definir os cabeçalhos permitidos
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const PORT = 8000;
const server = app.listen(process.env.PORT || PORT, () => {
   if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Server is running in http://localhost:${address.port}`);
   } else {
      console.error("Failure upon starting server.");
   };
});