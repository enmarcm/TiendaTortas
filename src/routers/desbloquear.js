import { Router } from "express";
import olvidoDatosController from "../controllers/olvidoDatosController.js";

const desbloquearRouter = Router();


desbloquearRouter.get("/", olvidoDatosController.getDesbloquear)
desbloquearRouter.post("/", olvidoDatosController.postDesbloquear)
desbloquearRouter.post("/cargarPreguntas", olvidoDatosController.postDesbloquearCargarPreguntas)



export default desbloquearRouter