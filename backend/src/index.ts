import { Request, Response, NextFunction } from "express";
import { app } from "./config/server";
import "express-async-errors";

import { CustomError } from "./errors/CustomError";

app.get("/", (req: Request, res: Response) => {
	return res.status(200).send("AAAAAAAA");
});

//* Errors assíncronos ===================================================
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	return error instanceof CustomError
		? res.status(error.statusCode).send(error.message)
		: res.status(500).send(error.message || error.pgMessage);
});
