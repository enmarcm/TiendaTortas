import midCors from "./midCors.js";
import midNotFound from "./midNotFound.js";
import midAuthLogin from "./midAuthLogin.js";
import midNotProfile from "./midNotProfile.js";
import midJson from "./midJson.js";
import cors from "cors";

/**
 * Middleware para permitir el acceso a recursos de diferentes orígenes.
 * @type {Function}
 */
export { midCors };

/**
 * Middleware para manejar solicitudes a rutas no encontradas.
 * @type {Function}
 */
export { midNotFound };

/**
 * Middleware para la autenticación de inicio de sesión.
 * @type {Function}
 */
export { midAuthLogin };

/**
 * Middleware para manejar solicitudes de usuarios sin perfil.
 * @type {Function}
 */
export { midNotProfile };

/**
 * Middleware para permitir el acceso a recursos de diferentes orígenes.
 * @type {Function}
 */
export { cors };

/**
 * Middleware para verificar el schema de los JSON en el body.
 * @type {Function}
 */
export { midJson };