import {  Router } from "express";
import { UserControllers } from "../controllers/User-controllers";

export const userRouter = Router();

const userController = new UserControllers();

userRouter.post("/", userController.create);
