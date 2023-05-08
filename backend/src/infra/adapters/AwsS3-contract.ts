import { Express } from "express";
import { StorageEngine } from "multer";

export abstract class AwsS3Contract {
	abstract saveFile: StorageEngine;
	abstract deleteFile: (filename: Express.Multer.File) => Promise<void>;
}
