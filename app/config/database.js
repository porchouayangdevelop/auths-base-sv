import { createPool } from "mysql2/promise";
import logger from "../utils/logger.js";
import { appConfig } from "./appConfig.js";

export const pool = createPool({
  host: appConfig.database.DB_HOST,
  port: parseInt(appConfig.database.DB_PORT),
  user: appConfig.database.DB_USER,
  password: appConfig.database.DB_PASS,
  database: appConfig.database.DB_NAME,
  ...appConfig.database.options,
});

export const init = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.info(`init database connection successful`);
    logger.debug("init database connection successful");
  } catch (error) {
    console.error(error);
    logger.error(
      "Errro: init connection to database fail",
      new Error("Something when wrong...")
    );
    throw error;
  } finally {
    connection ? connection.release() : connection.end();
  }
};
