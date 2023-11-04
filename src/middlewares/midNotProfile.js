/**
 * Middleware para manejar solicitudes de usuarios sin perfil.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función para pasar el control al siguiente middleware.
 * @returns {void} No devuelve nada.
 */
const midNotProfile = (req, res, next) => {
    if(req.session.profile){
        return next()
    }
    return res.json({error: "No tienes un perfil agregado"})
}

export default midNotProfile;