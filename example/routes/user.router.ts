import { UserController } from "../controllers/user.ts";
import { Router } from "../deps.ts";

const userRouter = new Router({ prefix: "/api/user" });
const userController = new UserController();

userRouter.get("/", userController.get).post("/", userController.post);

export default { router: userRouter, middlewares: [userController], summary: "User endpoint" };
