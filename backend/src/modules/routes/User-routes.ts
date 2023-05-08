import { Router } from "express";
import { UserControllers } from "../controllers/User-controllers";
import { authMiddleware } from "../../infra/middlewares/auth-middleware";

export const userRouter = Router();

const userController = new UserControllers();

//* Pegar usuário através do token.
userRouter.get("/", authMiddleware, userController.findByToken);

userRouter.post("/create", userController.create);
userRouter.post("/login", userController.login);

userRouter.put("/create-more-info/:idUser", userController.createMoreInfo);

userRouter.patch("/edit", authMiddleware, userController.edit);

userRouter.delete("/delete", authMiddleware, () => {});
