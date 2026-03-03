/* EXPRESS */
import express from "express";
/* LIBRARIES */
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import { authHandler } from "auth/server";
import { errorHandler } from "validator";

/* APP */
import { BodyParser } from "./lib/bodyParser";
import { userRouter } from "./routes/user";
import { usersRouter } from "./routes/users";
import { productsRouter } from "./routes/products";
import { nutritionRouter } from "./routes/nutrition";
import cookieParser from "cookie-parser";

const port = process.env.PORT ?? "8080";

const app = express();

//Middlewares
app.set("trust proxy", true);
app.use(cors({ origin: process.env.FRONTEND_URL ?? "*", credentials: true }));
app.use(helmet());
app.use(cookieParser());

//https://www.better-auth.com/docs/integrations/express
app.all("/api/auth/*splat", authHandler);
// app.all("/api/auth/*splat", toNodeHandler(auth)); For ExpressJS v5
// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth

//Stripe needed
app.use(bodyParser.json(BodyParser.optionsJson));
app.use(bodyParser.urlencoded(BodyParser.optionsUrlencoded));

//Routes
app.use(userRouter);
app.use(usersRouter);
app.use(productsRouter);
app.use(nutritionRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server listen on port: " + port);
});

export default app;
