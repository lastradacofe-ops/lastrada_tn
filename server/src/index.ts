import app from "./app";
import { logger } from "./lib/logger";
import { fileURLToPath } from "node:url";
import path from "node:path";

const envFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env");
try {
  process.loadEnvFile(envFile);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}
const port = Number(process.env["API_PORT"] || process.env["PORT"] || 3001);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid API_PORT value: "${process.env["API_PORT"]}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
