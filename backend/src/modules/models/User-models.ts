import mongoose, { SaveOptions, Schema } from "mongoose";
import { TCreateUserDTO, TUserMoreInfoDTO } from "../../dtos/user-dto";

const createMoreUserInfo = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
	phone: { type: String, required: true },
	zipCode: { type: String, required: true },
	address: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	country: { type: String, required: true },
});

const createUserSchema = new mongoose.Schema(
	{
		photo_url: { type: String, required: true },
		name: { type: String, required: true },
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ["admin", "normal"],
			default: "normal",
			required: true,
		},
		moreInfo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "userMoreInfos"
		},
	},
	{ timestamps: true },
);

export const UserMoreInfoSchema = mongoose.model<TUserMoreInfoDTO>(
	"userMoreInfos",
	createMoreUserInfo,
);
export const UserSchema = mongoose.model<TCreateUserDTO>(
	"users",
	createUserSchema,
);
	