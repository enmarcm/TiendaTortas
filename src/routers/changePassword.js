import changePasswordController from "../controllers/changePasswordController.js";
import { Router } from "express";

const changePasswordRouter = Router();

changePasswordRouter.get("/", changePasswordController.getChangePassword);
changePasswordRouter.post("/", changePasswordController.postChangePassword);
changePasswordRouter.get(
  "/newPassword",
  changePasswordController.getNewPassword
);
changePasswordRouter.post(
  "/newPassword",
  changePasswordController.postNewPassword
);

export default changePasswordRouter;
