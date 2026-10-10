import app from "./app";
import { logger } from "./lib/logger";
import { startPinger } from "./lib/pinger";
import { fileURLToPath } from "node:url";
import path from "node:path";

const envFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env");
try {
  process.loadEnvFile(envFile);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}
function parsePort(value: string | undefined): number | null {
  if (!value || value === "undefined" || value === "null") return null;
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

const port = parsePort(process.env["PORT"])
  ?? parsePort(process.env["API_PORT"])
  ?? 10000;

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening on 0.0.0.0");
  startPinger();
});


