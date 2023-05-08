import {  Router } from "express";
import { UserControllers } from "../controllers/User-controllers";
import { UserRepository } from "../repositories/mongoose/User-repository";
import { JwtAdapter } from "../../infra/adapters/JwtAdapter/Jwt-adapter";
import { BCryptAdapter } from "../../infra/adapters/BcryptAdapter/Bcrypt-adapter";

export const userRouter = Router();

const userRepository = new UserRepository()
const jwt = new JwtAdapter();
const bcrypt = new BCryptAdapter();

const userController = new UserControllers(
  userRepository,
  jwt,
  bcrypt,
);

userRouter.post("/", userController.create);
