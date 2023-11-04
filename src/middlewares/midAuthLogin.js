import LoginController from "../controllers/loginController.js";

/**
 * Middleware para la autenticación de inicio de sesión.
 * @async
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Una promesa que resuelve si el middleware se ejecuta correctamente o rechaza con un error.
 */
const midAuthLogin = async (req, res, next) => await LoginController.midAuth(req, res, next);

export default midAuthLogin;