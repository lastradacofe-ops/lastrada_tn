import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import router from "./routes";
import { logger } from "./lib/logger";
import { corsOptions } from "./lib/cors-options";
import { MenuValidationError } from "./menu/menu-store";

const app: Express = express();

app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);
app.disable("x-powered-by");

app.use((_request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "no-referrer");
  if (process.env.NODE_ENV === "production") {
    response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "8mb" }));

app.use("/api", router);

app.use((error: unknown, _request: express.Request, response: express.Response, next: express.NextFunction) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const parserError = error && typeof error === "object" && "type" in error ? error.type : undefined;
  if (error instanceof MenuValidationError || parserError === "entity.parse.failed") {
    response.status(400).json({ error: error instanceof MenuValidationError ? error.message : "Request body contains invalid JSON." });
    return;
  }
  if (parserError === "entity.too.large") {
    response.status(413).json({ error: "Request body is too large." });
    return;
  }

  if (error instanceof Error) logger.error({ err: { name: error.name, message: error.message, stack: error.stack } }, "Request failed");
  else logger.error("Request failed with an unknown error");
  response.status(500).json({ error: "The request could not be completed." });
});

export default app;
