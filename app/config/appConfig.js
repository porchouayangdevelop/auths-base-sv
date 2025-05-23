import { config } from "dotenv";
import { getOptimalHost } from "../utils/networUtil.js";

config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.prod"
      : process.env.NODE_ENV === "development"
      ? ".env.dev"
      : undefined,
});

export const appConfig = {
  server: {
    HOST:
      process.env.HOST_IP ||
      (process.env.HOST === "true" ? getOptimalHost() : getOptimalHost()),
    PORT: process.env.PORT,
    HTTPS_PORT: process.env.HTTPS_PORT,

    CORS: {
      origin: process.env.CORS_ORIGIN,
      methods: process.env.CORS_METHODS,
      allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
      credentials: process.env.CORS_CREDENTIALS,
    },
  },

  database: {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,

    options: {
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
      waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS || true,
      queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
    },
  },

  jwt: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  },

  uploadPath: process.env.UPLOAD_PATH,
  max_file_size: process.env.MAX_FILE_SIZE,
};
