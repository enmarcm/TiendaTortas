import { Router } from "express";
import ToProcessController from "../controllers/toProcessController.js";

const toProcessRouter = Router()

toProcessRouter.get('/', ToProcessController.toProcessPost)
toProcessRouter.post('/', ToProcessController.toProcessPost)
 
export default toProcessRouter