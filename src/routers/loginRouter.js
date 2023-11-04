import { Router } from "express";
import LoginController from "../controllers/loginController.js";

const loginRouter = Router();
loginRouter.get("/", LoginController.loginGet);
loginRouter.post("/", LoginController.loginPost);

export default loginRouter;
