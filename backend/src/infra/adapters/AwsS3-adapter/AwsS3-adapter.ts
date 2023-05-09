import { env } from "process";
import multerS3 from "multer-s3";
import multer from "multer";
import { S3 } from "@aws-sdk/client-s3";

import { AwsS3Contract } from "../AwsS3-contract";

const s3 = new S3({
	region: "us-east-1",
	credentials: {
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		accessKeyId: env.AWS_ACCESS_KEY_ID!,
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
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

	async getFile(filename: string) {
		const getParams = {
			Bucket: env.AWS_S3_BUCKET,
			Key: filename,
		};

		const fileFound = await s3.getObject(getParams);
		return fileFound;
	}

	async deleteFile(filename: string) {
		const deleteParams = {
			Bucket: env.AWS_S3_BUCKET,
			Key: filename,
		};

		await s3.deleteObject(deleteParams);
	}
}
