export default async function (fastify, options) {
  fastify.get("/health", async function (request, reply) {
    return {
      status: "online",
      version: "1.0.0",
      documentation: "/docs",
      apiReference: "/api-reference",
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
  });
}
