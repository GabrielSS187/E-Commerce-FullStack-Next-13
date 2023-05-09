import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { Multer } from "multer";

export abstract class AwsS3Contract {
	abstract saveFile: Multer;
	abstract deleteFile: (filename: string) => Promise<void>;
	abstract getFile: (
		filename: string,
	) => Promise<GetObjectCommandOutput | null>;
}
