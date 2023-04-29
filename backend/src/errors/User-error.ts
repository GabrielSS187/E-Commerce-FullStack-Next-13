import { CustomError } from "./CustomError";

export class UserError extends CustomError {
	constructor(public error: string, statusCode: number) {
		super(error, statusCode);
	}
}
