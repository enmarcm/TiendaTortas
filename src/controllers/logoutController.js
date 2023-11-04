import iSession from "../data/session-data/iSession.js";

/**
 * Clase que representa un controlador para cerrar sesión.
 */
class LogoutController {
  /**
   * Obtiene la página para cerrar sesión.
   * @param {Object} req - El objeto de solicitud.
   * @param {Object} res - El objeto de respuesta.
   * @returns {Object} El objeto JSON con el mensaje de éxito o error.
   */
  static logoutGet = (req, res) => {
    if (!iSession.sessionExist(req))
      return res.json({ error: "No hay sesión iniciada." });

    iSession.destroySession(req)
    return res.json({ message: "Sesión cerrada." });
  };
}

export default LogoutController;