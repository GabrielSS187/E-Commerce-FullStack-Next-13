import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { StorageEngine, Multer } from "multer";

export abstract class AwsS3Contract {
	abstract saveFile: Multer;
	abstract deleteFile: (filename: Express.Multer.File) => Promise<void>;
	abstract getFile: (
		filename: Express.Multer.File,
	) => Promise<GetObjectCommandOutput>;
}
