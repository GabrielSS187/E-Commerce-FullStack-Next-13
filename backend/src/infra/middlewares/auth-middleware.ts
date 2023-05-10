import { NextFunction, Request, Response } from "express";

import { JwtAdapter } from "../adapters/Jwt-adapter/Jwt-adapter";
import { CustomError } from "../../modules/errors/CustomError";
import { JsonWebTokenError } from "jsonwebtoken";

const jwt = new JwtAdapter();

export const authMiddleware = (
	req: Request,
	res: Response,
	nex: NextFunction,
) => {
	try {
		const { authorization } = req.headers;

		if (!authorization) {
			throw new CustomError("Não autorizado, o token é necessário", 401);
		}

		const token = authorization.replace("Bearer", "").trim();

		const decoded = jwt.getToken({ token });
		req.idUser = decoded.userId;
		req.userRole = decoded.role;

		nex();
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			throw new CustomError(error.message, 401);
		}
		if (error instanceof CustomError) {
			throw new CustomError(error.message, error.statusCode);
		}
	}
};
