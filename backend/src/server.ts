import app from "./app";
import { connectDatabase } from "./config/database";
import { ENV } from "./config/env";
import { logger } from "./utils/logger";

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(ENV.PORT, () => {
      logger.info(`✨ Colombo Gold Covering API running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
      logger.info(`🌐 Base API URL: http://localhost:${ENV.PORT}/api/v1`);
    });

    const shutdown = async (signal: string) => {
      logger.warn(`Received ${signal}. Gracefully shutting down...`);
      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;

