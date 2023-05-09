import { env } from "process";
import { config } from "dotenv";
import multerS3 from "multer-s3";
import multer from "multer";
import { S3 } from "@aws-sdk/client-s3";

import { AwsS3Contract } from "../AwsS3-contract";
import { CustomError } from "../../../modules/errors/CustomError";

config();

if (!env.AWS_ACCESS_KEY) {
	throw new Error("A variável de ambiente AWS_ACCESS_KEY não foi definida.");
}
if (!env.AWS_SECRET_ACCESS_KEY) {
	throw new Error(
		"A variável de ambiente AWS_SECRET_ACCESS_KEY não foi definida.",
	);
}
if (!env.AWS_S3_BUCKET) {
	throw new Error("A variável de ambiente AWS_S3_BUCKET não foi definida.");
}

const s3 = new S3({
	region: "us-east-1",
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	},
});

export class AwsS3Adapter implements AwsS3Contract {
	saveFile = multer({
		storage: multerS3({
			s3,
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			bucket: env.AWS_S3_BUCKET!,
			acl: "public-read",
			contentType: multerS3.AUTO_CONTENT_TYPE,
			key: (
				req: Express.Request,
				file: Express.Multer.File,
				cb: (error: Error | null, key?: string) => void,
			) => {
				cb(null, `${Date.now()}-${file.originalname}`);
			},
		}),
		limits: { fileSize: 1024 * 1024 * 5 }, //* Limite de 5MB
	});

	async getFile(filename: Express.Multer.File) {
		try {
			const getParams = {
				Bucket: env.AWS_S3_BUCKET,
				Key: filename.filename,
			};

			const fileFound = await s3.getObject(getParams);
			return fileFound;
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			throw new CustomError(error.message, 400);
		}
	}

	async deleteFile(filename: Express.Multer.File) {
		try {
			const deleteParams = {
				Bucket: env.AWS_S3_BUCKET,
				Key: filename.filename,
			};

			await s3.deleteObject(deleteParams);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			throw new CustomError(error.message, 406);
		}
	}
}
