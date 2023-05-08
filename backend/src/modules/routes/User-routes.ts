import { Router } from "express";
import { UserControllers } from "../controllers/User-controllers";
import { authMiddleware } from "../../infra/middlewares/auth-middleware";

export const userRouter = Router();

const userControllers = new UserControllers();

//* Pegar usuário através do token.
userRouter.get("/", authMiddleware, userControllers.findByToken);

userRouter.post("/create", userControllers.create);
userRouter.post("/login", userControllers.login);

userRouter.put("/create-more-info/:idUser", userControllers.createMoreInfo);

userRouter.patch("/edit", authMiddleware, userControllers.edit);

userRouter.delete("/delete", authMiddleware, userControllers.delete);
