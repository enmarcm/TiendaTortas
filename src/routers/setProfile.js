import { Router } from "express";
import setProfileController from "../controllers/setProfileController.js";

const setProfileRouter = Router();

setProfileRouter.get("/", setProfileController.getProfiles);
setProfileRouter.post('/', setProfileController.setProfile)

export default setProfileRouter;
