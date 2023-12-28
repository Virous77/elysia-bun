import { Elysia } from "elysia";
import mongoose from "mongoose";
import { UserController } from "./controller/user-controller";
import { bearer } from "@elysiajs/bearer";

const app = new Elysia();

app.use(bearer()).onBeforeHandle(async ({ bearer }) => {
  if (!bearer) throw new Error("Unauthorized");
  const isAuthorized = bearer === "12345678";
  if (!isAuthorized) {
    throw new Error("Unauthorized");
  }
});
app.use(UserController);

const PORT = process.env.PORT || 4001;

mongoose
  .connect("mongodb://localhost:27017/elysia")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
