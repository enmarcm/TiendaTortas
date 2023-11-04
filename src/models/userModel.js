/**
 * @file Modelo de usuarios de la aplicación.
 * @name UserModel.js
 */
import iPgHandler from "../data/pg-handler-data/iPgHandler.js";
import CryptManager from "../components/CryptManager.js";

/**
 * Clase que representa el modelo de manejo de usuarios de la aplicación.
 * @class
 */
class UserModel {
  /**
   * Método estático que verifica si un usuario existe en la base de datos.
   * @static
   * @async
   * @function
   * @param {Object} params - Los parámetros de entrada del método.
   * @param {string} params.user - El nombre de usuario del usuario.
   * @returns {Promise<Object|boolean>} Una promesa que resuelve con el resultado de la consulta a la base de datos.
   */
  static verifyUser = async ({ user }) => {
    try {
      const resultado = await iPgHandler.executeQuery({
        key: "verifyUser",
        params: [user],
      });

      return resultado.length > 0 ? resultado[0] : false;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Método estático que verifica si un usuario está bloqueado o ha excedido el número de intentos de inicio de sesión fallidos.
   * @static
   * @async
   * @function
   * @param {Object} params - Los parámetros de entrada del método.
   * @param {string} params.user - El nombre de usuario del usuario.
   * @returns {Promise<boolean>} Una promesa que resuelve con un valor booleano que indica si el usuario está desbloqueado o no.
   */
  static verifyBlock = async ({ user }) => {
    try {
      const [resultBlock] = await iPgHandler.executeQuery({
        key: "verifyBlock",
        params: [user],
      });

      const [resultAttemps] = await iPgHandler.executeQuery({
        key: "verifyAttempts",
        params: [user],
      });

      const isBlock = resultBlock.bl_user_web;
      const attempts = resultAttemps.at_user_web;

      return isBlock || attempts <= 0 ? true : false;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Método estático que verifica si la contraseña de un usuario es correcta.
   * @static
   * @async
   * @function
   * @param {Object} params - Los parámetros de entrada del método.
   * @param {string} params.user - El nombre de usuario del usuario.
   * @param {string} params.password - La contraseña del usuario.
   * @returns {Promise<boolean>} Una promesa que resuelve con un valor booleano que indica si la contraseña es correcta o no.
   */
  static verifyPassword = async ({ user, password }) => {
    try {
      const [resultPass] = await iPgHandler.executeQuery({
        key: "selectPassUser",
        params: [user],
      });

      const pass = resultPass.pa_user_web;

      const result = await CryptManager.compararEncriptado({
        dato: password.toString(),
        hash: pass,
      });

      return result;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Método estático que restaura el número de intentos de inicio de sesión fallidos de un usuario.
   * @static
   * @async
   * @function
   * @param {Object} params - Los parámetros de entrada del método.
   * @param {string} params.user - El nombre de usuario del usuario.
   * @returns {Promise<Object[]>} Una promesa que resuelve con el resultado de la consulta a la base de datos.
   */
  static restoreIntentos = async ({ user }) => {
    try {
      const result = await iPgHandler.executeQuery({
        key: "restoreIntentos",
        params: [user],
      });

      return result;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Método estático que verifica el número de intentos de inicio de sesión fallidos de un usuario.
   * @static
   * @async
   * @function
   * @param {Object} params - Los parámetros de entrada del método.
   * @param {string} params.user - El nombre de usuario del usuario.
   * @returns {Promise<Object>} Una promesa que resuelve con el número de intentos de inicio de sesión fallidos de un usuario.
   */
  static verifyIntentos = async ({ user }) => {
    try {
      const [result] = await iPgHandler.executeQuery({
        key: "verifyIntentos",
        params: [user],
      });

      return result;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Método estático que disminuye el número de intentos de inicio de sesión fallidos de un usuario.
   * @static
   * @async
   * @function
   * @param {Object} params - Los parámetros de entrada del método.
   * @param {string} params.user - El nombre de usuario del usuario.
   * @returns {Promise} Una promesa que resuelve con el resultado de la consulta a la base de datos.
   */
  static disminuirIntentos = async ({ user }) => {
    try {
      const intentos = await this.verifyIntentos({ user });
      if (intentos.at_user_web <= 0) return;

      const result = await iPgHandler.executeQuery({
        key: "disminuirIntentos",
        params: [user],
      });
      return result;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Método estático que desbloquea el acceso de un usuario a la aplicación.
   * @static
   * @async
   * @function
   * @param {Object} params - Los parámetros de entrada del método.
   * @param {string} params.user - El nombre de usuario del usuario.
   * @returns {Promise} Una promesa que resuelve con el resultado de la consulta a la base de datos.
   */
  static desbloquear = async ({ user }) => {
    try {
      const result = await iPgHandler.executeQuery({
        key: "desbloquear",
        params: [user],
      });
      return result;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Método estático que bloquea el acceso de un usuario a la aplicación.
   * @static
   * @async
   * @function
   * @param {Object} params - Los parámetros de entrada del método.
   * @param {string} params.user - El nombre de usuario del usuario.
   * @returns {Promise} Una promesa que resuelve con el resultado de la consulta a la base de datos.
   */
  static bloquear = async ({ user }) => {
    try {
      const result = await iPgHandler.executeQuery({
        key: "bloquear",
        params: [user],
      });
      return result;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Método estático que retorna los datos de sesión de un usuario.
   * @static
   * @async
   * @function
   * @param {Object} params - Los parámetros de entrada del método.
   * @param {string} params.user - El nombre de usuario del usuario.
   * @param {string} params.password - La contraseña del usuario.
   * @returns {Promise} Una promesa que resuelve con los datos de sesión de un usuario.
   */
  static retornarDatos = async ({ user, password }) => {
    try {
      if (!(await this.verifyPassword({ user, password }))) return false;

      const [result] = await iPgHandler.executeQuery({
        key: "getDataSession",
        params: [user],
      });
      const data = {
        idUser: result.id_user_web,
        user: result.us_user_web,
        email: result.em_user_web,
      };

      return data;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Carga todas las preguntas de un usuario.
   * @async
   * @static
   * @param {Object} options - Opciones de la consulta.
   * @param {string} options.user - Nombre de usuario.
   * @returns {Promise<Array>} - Promesa que resuelve en un array de preguntas.
   */
  static cargarPreguntas = async ({ user }) => {
    try {
      const preguntas = await iPgHandler.executeQuery({
        key: "cargarTodasPreguntas",
        params: [user],
      });

      return preguntas;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Obtiene las respuestas de dos preguntas.
   * @async
   * @static
   * @param {Object} options - Opciones de la consulta.
   * @param {Array<number>} options.index - Índices de las preguntas.
   * @returns {Promise<Array>} - Promesa que resuelve en un array de respuestas.
   */
  static obtenerRespuestas = async ({ index = [] }) => {
    try {
      const respuestas = await iPgHandler.executeQuery({
        key: "obtenerDosRespuestas",
        params: [...index],
      });

      return respuestas;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Actualiza la contraseña de un usuario.
   * @async
   * @static
   * @param {Object} options - Opciones de la consulta.
   * @param {string} options.user - Nombre de usuario.
   * @param {string} options.password - Nueva contraseña.
   * @returns {Promise<Object>} - Promesa que resuelve en un objeto con el resultado de la consulta.
   */
  static updatePassword = async ({ user, password }) => {
    try {
      const hashedPass = await CryptManager.encriptar({ dato: password });
      const result = await iPgHandler.executeQuery({
        key: "updatePassword",
        params: [hashedPass, user],
      });

      return result;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Obtiene el correo electrónico de un usuario.
   * @async
   * @static
   * @param {Object} options - Opciones de la consulta.
   * @param {string} options.user - Nombre de usuario.
   * @returns {Promise<string>} - Promesa que resuelve en el correo electrónico del usuario.
   */
  static getMail = async ({ user }) => {
    try {
      const [mail] = await iPgHandler.executeQuery({
        key: "getMail",
        params: [user],
      });

      return mail.em_user_web;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Obtiene los perfiles de un usuario.
   * @async
   * @static
   * @param {Object} options - Opciones de la consulta.
   * @param {string} options.user - Nombre de usuario.
   * @returns {Promise<Array>} - Promesa que resuelve en un array de perfiles.
   */
  static getProfiles = async ({ user }) => {
    try {
      const profiles = await iPgHandler.executeQuery({
        key: "getProfiles",
        params: [user],
      });

      return profiles;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Verifica si un usuario tiene un perfil específico.
   * @async
   * @static
   * @param {Object} options - Opciones de la consulta.
   * @param {string} options.user - Nombre de usuario.
   * @param {string} options.profile - Nombre del perfil.
   * @returns {Promise<boolean>} - Promesa que resuelve en un booleano que indica si el usuario tiene el perfil.
   */
  static hasProfile = async ({ user, profile }) => {
    try {
      const result = await iPgHandler.executeQuery({
        key: "hasProfile",
        params: [user, profile],
      });
      return result;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Ejecuta un query de la clase `iPgHandler` con los parámetros especificados.
   * @async
   * @static
   * @param {Object} options - Opciones de la consulta.
   * @param {string} options.method - Nombre del método a ejecutar.
   * @param {Object} options.params - Parámetros del método.
   * @returns {Promise<Object>} - Promesa que resuelve en el resultado de la consulta.
   */
  static executeMethod = async ({ method, params }) => {
    //*Importante, los params deben estar ordenados, tal cual como estan en el archivo de querys para que funcione
    //*El query debe llamarse igual al metodo para que funcione
    try {
      const parametros = [];
      for (const key in params) {
        parametros.push(params[key]);
      }
      const result = await iPgHandler.executeQuery({
        key: method,
        params: parametros,
      });
      return result;
    } catch (error) {
      return { error };
    }
  };
}

export default UserModel;
