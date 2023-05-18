import { Request, Response, NextFunction } from "express";
import { app } from "./infra/config/server";
import "express-async-errors";

import { userRouter } from "./modules/routes/User-routes";
import { CustomError } from "./modules/errors/CustomError";

app.use("/user", userRouter);

//* Errors assíncronos ===================================================
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	return error instanceof CustomError
		? res.status(error.statusCode).json(error.message)
		: res.status(500).send(error.message);
});
