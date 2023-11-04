import HomeController from "../controllers/homeController.js";
import { Router } from "express";

const homeRouter = Router();

homeRouter.get("/", HomeController.getHome);

export default homeRouter;
