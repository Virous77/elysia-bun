import Elysia from "elysia";
import user from "../models/user-model";

type TUser = {
  name: string;
  email: string;
  password: string;
};

export const UserController = (app: Elysia) => {
  app.post("/user", async (context) => {
    const { name, email, password } = context.body as TUser;
    const newUser = await user.create({
      name,
      email,
      password,
    });

    return newUser;
  });

  app.get("/user", async () => {
    const users = await user.find();
    return users;
  });

  app.put("/user/:id", async (context) => {
    const { id } = context.params;
    const { name, email, password } = context.body as TUser;
    const updatedUser = await user.findByIdAndUpdate(
      id,
      {
        name,
        email,
        password,
      },
      { new: true }
    );
    return updatedUser;
  });

  app.delete("/user/:id", async (context) => {
    const { id } = context.params;
    await user.findByIdAndDelete(id, { new: true });
    return "User deleted";
  });

  return Promise.resolve(app);
};
