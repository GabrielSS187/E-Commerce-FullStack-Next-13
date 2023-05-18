import { Router } from "express";
import { UserControllers } from "../controllers/User-controllers";
import { authMiddleware } from "../../infra/middlewares/auth-middleware";
import { AwsS3Adapter } from "../../infra/adapters/AwsS3-adapter/AwsS3-adapter";

export const userRouter = Router();

const userControllers = new UserControllers();
const upload = new AwsS3Adapter();

//* Pegar usuário através do token.
userRouter.get("/", authMiddleware, userControllers.findByToken);

userRouter.post("/create", userControllers.create);
userRouter.post("/login", userControllers.login);

userRouter.patch(
	"/edit",
	authMiddleware,
	upload.saveFile.single("photo_url"),
	userControllers.edit,
);

userRouter.delete("/delete", authMiddleware, userControllers.delete);
