import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRouter from "./routes/userRoute.js";
import gameRouter from "./routes/gameRoute.js";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import "dotenv/config";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.route("/api/users", userRouter);
app.route("/api/game", gameRouter);

app.get("/", (c) => {
  return c.text("Hello world!");
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
