import { CustomError } from "./CustomError";

export class UserError extends CustomError {
	constructor(public message: string, statusCode: number) {
		super(message, statusCode);
	}
}
