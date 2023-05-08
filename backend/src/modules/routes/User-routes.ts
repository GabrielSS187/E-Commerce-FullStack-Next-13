import { Router } from "express";
import { UserControllers } from "../controllers/User-controllers";
import { authMiddleware } from "../../infra/middlewares/auth-middleware";

export const userRouter = Router();

const userController = new UserControllers();

userRouter.post("/", userController.create);
userRouter.put("/", authMiddleware, userController.edit);
