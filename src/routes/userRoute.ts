import { Hono } from "hono";
import { signup, signin, signout } from "../controllers/userController.js";
import authUser from "./../middleware/auth.js";

const userRouter = new Hono();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/signout", signout);

export default userRouter;
