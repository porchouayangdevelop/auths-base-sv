import { config } from "dotenv";

config();

import cors from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import fastify from "fastify";

import path, { dirname } from "path";

import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";

import { fileURLToPath } from "url";
import { appConfig } from "./config/appConfig.js";
import { init } from "./config/database.js";
import httpsRedirect from "./middlewares/httpsRedirect.js";
import logger from "./utils/logger.js";
import { getSwaggerHostConfig } from "./utils/networUtil.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildApp = async (options = {}) => {
  const defaultOptions = {
    disableRequestLogging: true,
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
      serializers: {
        req(request) {
          return {
            method: request.method,
            url: request.url,
            path: request.routerPath,
            parameters: request.params,
            headers: request.headers,
            body: request.body,
            hostname: request.hostname,
            remoteAddress: request.ip,
            remotePort: request.socket ? request.socket.remotePort : undefined,
          };
        },
        res(reply) {
          return {
            statusCode: reply.statusCode,
            headers:
              typeof reply.getHeaders === "function" ? reply.getHeaders() : {},
          };
        },
      },
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  const app = fastify(finalOptions);

  // register upload file with multipart data
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: appConfig.max_file_size || 1048576 * 10, // 10 MB
    },
  });

  if (process.env.NODE_ENV === "production") app.register(httpsRedirect);

  // register cors
  await app.register(cors, {
    origin: appConfig.server.CORS.origin,
    methods: appConfig.server.CORS.methods,
  });

  // register real time with websocket
  await app.register(fastifyWebsocket, {
    options: {
      maxPayload: 1046576,
    },
  });

  // register path with upload by static
  await app.register(fastifyStatic, {
    root: path.join(__dirname, "../resources/uploads"),
    prefix: "/resources",
  });

  //register swgger and scalar api reference
  const httpPort = parseInt(appConfig.server.PORT);
  const httsPort = parseInt(appConfig.server.HTTPS_PORT);

  const swaggerOptions = getSwaggerHostConfig({
    useHttps: options.useHttps,
    httpsPort: httsPort,
    httpPort: httpPort,
    preferedIP: options.swaggerHost || appConfig.server.HOST,
  });

  // register swgger
  await app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Real Time APB Auths API",
        description: `API for authentication and authorization service with JavaScript and Scalar API Reference. ${swaggerOptions.description}`,
        version: "1.0.0",
      },
      host: swaggerOptions.host,
      schemes: swaggerOptions.schemes,
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });

  // register scalar
  await app.register(scalar, {
    routePrefix: "/docs",
    configuration: {
      title: "Power by Fastify API service documentation",
      theme: "bluePlanet",
    },
  });

  // register router
  await app.register(import("./routes/index.js"), { prefix: "/api/v1" });

  // regiser database connection
  await app.register(init);

  // check error
  app.setErrorHandler((error, req, reply) => {
    logger.error("Internal Server Error", new Error("Something went wrong"));
    reply.status(error.statusCode || 500).send({
      statusCode: error.statusCode || 500,
      error: error.name || "Internal Server Error",
      message: error.message || "Something went wrong",
    });
  });

  app.setNotFoundHandler((req, reply) => {
    logger.error(
      "Not Found",
      new Error("The requested resource could not be found")
    );

    reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: "The requested resource could not be found",
    });
  });

  return app;
};

export default buildApp;
