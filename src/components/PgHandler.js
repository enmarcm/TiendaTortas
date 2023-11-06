import Pool from "pg-pool";

/**
 * Clase que maneja la conexión y ejecución de consultas a una base de datos PostgreSQLv usando Pg-Pool.
 */
class PgHandler {
  /**
   * Crea una instancia de PgHandler.
   * @param {Object} options - Opciones para la configuración y consultas de la base de datos.
   * @param {Object} options.config - Configuración de la conexión a la base de datos.
   * @param {Object} options.querys - Consultas predefinidas para la base de datos.
   */
  constructor({ config, querys }) {
    /**
     * Configuración de la conexión a la base de datos.
     * @type {Object}
     */
    this.config = config;
    /**
     * Consultas predefinidas para la base de datos.
     * @type {Object}
     */
    this.querys = querys;
    /**
     * Pool de conexiones a la base de datos.
     * @type {Pool}
     */
    this.pool = new Pool(this.config);
  }

  /**
   * Ejecuta una consulta a la base de datos.
   * @async
   * @param {Object} options - Opciones para la ejecución de la consulta.
   * @param {string} options.key - Clave de la consulta predefinida a ejecutar.
   * @param {Array} [options.params=[]] - Parámetros para la consulta.
   * @returns {Promise<Array|Error>} - Resultado de la consulta o un objeto Error si ocurre un error.
   */
  executeQuery = async ({ key, params = [] }) => {
    try {
      const query = this.querys[key];
      const { rows } = await this.pool.query(query, params);
      return rows;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Conecta a la base de datos.
   * @async
   * @returns {Promise<import('pg').Client>} - Cliente de la conexión a la base de datos.
   */
  connect = async () => {
    try {
      return await this.pool.connect();
    } catch (error) {
      return { error };
    }
  };

  /**
   * Libera la conexión a la base de datos.
   * @async
   * @returns {Promise<void>}
   */
  release = async () => {
    try {
      await this.pool.release();
    } catch (error) {
      return { error };
    }
  };

  /**
   * Ejecuta una transacción de base de datos utilizando una serie de consultas.
   * @async
   * @param {Object} options - Objeto con las opciones para la transacción.
   * @param {Array<Object>} options.querys - Un array de objetos que contienen la clave de la consulta y los parámetros de la consulta.
   * @param {String} options.querys.key - Clave de la consulta predefinida a ejecutar.
   * @param {Array} [options.querys.params=[]] - Parámetros para la consulta.
   * @param {Boolean} [options.querys.insertResult=false] - Indica si la consulta es un insert y se debe almacenar el resultado para usarlo en la siguiente consulta.
   * @returns {Promise<Object>} - Una promesa que se resuelve con el resultado de la transacción o se rechaza con un error.
   * @example
   * const querys = [
   * {key: "insert1", params: [12313,12313], insertResult: true}
   * {key: "insert2", params: [12313,12313], insertResult: false},
   * {key: "insert3", params: [12313,12313}
   * ];
   * const result = await transaction({querys});
   */
  transaction = async ({ querys = [] }) => {
    const client = await this.connect();
    let resultAlmacenado;
    try {
      await client.query("BEGIN");
      for (const elemento of querys) {
        const { key, params, insertResult } = elemento;
        const finalParams = resultAlmacenado
          ? [...params, resultAlmacenado]
          : params;
        const result = await client.query(this.querys[key], finalParams);
        if (insertResult) {
          const rows = result.rows.length === 1 ? result.rows[0] : result.rows;
          resultAlmacenado =
            typeof rows === "object" && Object.keys(rows).length === 1
              ? Object.values(rows)[0]
              : rows;
        }
      }
      const result = await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      return { error };
    } finally {
      await client.release();
    }
  };
}

export default PgHandler;
