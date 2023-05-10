import mongoose, { Schema } from "mongoose";
import { string } from "zod";
import { TCreateUserDTO, TUserMoreInfoDTO } from "../../dtos/user-dto";

const CreateUserSchema = new Schema(
	{
		photo_url: { type: String, required: true },
		name: { type: String, required: true },
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		role: {
			type: string,
			enum: ["admin", "normal"],
			default: "normal",
			required: true,
		},
	},
	{ timestamps: true },
);

const CreateMoreUserInfo = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	phone: { type: String, required: true },
	zipCode: { type: String, required: true },
	address: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	country: { type: String, required: true },
});

export const User = {
	create: mongoose.model<TCreateUserDTO>("User", CreateUserSchema),
	createMoreInfo: mongoose.model<TUserMoreInfoDTO>(
		"User_More_Info",
		CreateMoreUserInfo,
	),
};
