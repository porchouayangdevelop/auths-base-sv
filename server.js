import { config } from "dotenv";
config();

import https from "https";

import buildApp from "./app/app.js";
import { appConfig } from "./app/config/appConfig.js";
import { loadSSLCertificates } from "./app/config/sslConfig.js";
import logger from "./app/utils/logger.js";
import { getServerIPs } from "./app/utils/networUtil.js";

const startServer = async () => {
  const serverIP = getServerIPs();

  const app = await buildApp({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
  });

  const port = parseInt(appConfig.server.PORT);
  const httpsPort = parseInt(appConfig.server.HTTPS_PORT);
  const host = appConfig.server.HOST;

  app.log.info(
    `Starting server with HOST : ${host}, PORT : ${port}, HTTPS_PORT : ${httpsPort}`
  );
  logger.info(
    `Starting server with HOST : ${host}, PORT : ${port}, HTTPS_PORT : ${httpsPort}`
  );

  const sslOptions = loadSSLCertificates();

  const shutdownAPP = async (signal) => {
    app.log.info(`Recieved ${signal} signal. Closing server ...`);
    logger.info(`Recieved ${signal} signal. Closing server ...`);
    try {
      await app.close();
      app.log.info(`Server closed successfully`);
      logger.info(`Server closed successfully`);
      process.exit(0);
    } catch (error) {
      app.log.error(error);
      logger.error(`Error shuting down server: ${error.message}`);
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => shutdownAPP("SIGTERM"));
  process.on("SIGINT", () => shutdownAPP("SIGINT"));

  try {
    await app.listen({ port: port, host: host, listenTextResolver: () => "" });
    app.log.info(`HTTP Sever running on ${port}`);
    logger.info(`HTTP Sever running on ${port}`);

    if (serverIP.ipv4.length > 0) {
      app.log.info(`HTTP access via IPv4:`);
      logger.info(`HTTP access via IPv4:`);

      serverIP.ipv4.forEach((v4) => {
        app.log.info(`http://${v4}:${port}`);
        logger.info(`http://${v4}:${port}`);
      });
    }

    app.log.info(
      `HTTP Swagger documentation available at : http://${host}:${port}/docs`
    );
    logger.info(
      `HTTP Swagger documentation available at : http://${host}:${port}/docs`
    );

    if (sslOptions) {
      const httpsServer = https.createServer(sslOptions);
      httpsServer.on("request", (req, reply) =>
        app.server.emit("request", req, reply)
      );

      await new Promise((_, reject) => {
        httpsServer.listen(httpsPort, (err) => (err ? reject(err) : _()));

        app.log.info(`HTTPS server running on ${httpsPort}`);
        logger.info(`HTTPS server running on ${httpsPort}`);
        if (serverIP.ipv4.length > 0) {
          app.log.info(`HTTPS access via IPv4:`);
          logger.info(`HTTPS access via IPv4:`);

          serverIP.ipv4.forEach((v4) => {
            app.log.info(`https://${v4}:${httpsPort}`);
            logger.info(`https://${v4}:${httpsPort}`);
          });
        }
      });

      app.log.info(
        `Swagger documentation available at: https://${host}:${httpsPort}/docs`
      );
      app.log.info(
        "Note: Since you're using self-signed certificates, you may need to accept the security warning in your browser."
      );

      logger.info(
        `Swagger documentation available at: https://${host}:${httpsPort}/docs`
      );
      logger.info(
        "Note: Since you're using self-signed certificates, you may need to accept the security warning in your browser."
      );
    } else {
      app.log.warn("SSL certificates not found. HTTPS server not started.");
      logger.warn("SSL certificates not found. HTTPS server not started.");
    }
  } catch (error) {
    app.log.error(error);
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

startServer().catch((err) => {
  console.error(err);
  // logger.error(`ERROR:`, new Error("Internal Server Error"));
  // throw err;
});
