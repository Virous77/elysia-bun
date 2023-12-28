# Creating Rest API on BUN with ElysiaJS

[Elysia](https://elysiajs.com/) is built with simplicity and type-safety in mind. Highly performant and Optimized for Bun. [Bun](https://bun.sh/) is a lightweight and fast JavaScript runtime aiming to be a drop-in replacement for Node.js, resulting in performance benefits.

In this article, we will create a simple REST API using ElysiaJS and Bun. We will also use MongoDB as our database.

### Installation

```bash
curl -fsSL https://bun.sh/install | bash
```

You need to install Bun in your system so that we can use it to create our project.

### Create a new project

```bash
bun create elysia rest-api
```

This will create a new project named `rest-api` in the current directory.

### Install dependencies

```bash
cd rest-api
bun install mongoose
```

We will use `mongoose` as our database driver. You can use any other driver as well.

## Create a model

Create a new file `rest-api/models/user.model.ts` with the following content:

```typescript
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
```

Here we have created a simple model for our user. We will use this model to create, update, delete and get users from our database.

## Create a controller

Create a new file `rest-api/controllers/user.controller.ts` with the following content:

```typescript
import Elysia from "elysia";
import user from "../models/user.model";

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
```

Here we created a controller for our user model. We implemented all the CRUD operations for our user model.

Obviously for good approach you can create a separate routes file and import your controller there. also for error handling you can use `try/catch` block.

## Create a server

Create a new file `app/server.ts` with the following content:

```typescript
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { UserController } from "./controller/user.controller";

const app = new Elysia();

app.use(UserController);

const PORT = process.env.PORT || 4001;

mongoose
  .connect("mongodb://localhost:27017/elysia")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
```

Above we created a server and connected to our database. We also used our user controller and passed to Elysia middleware.

## Run the server

```bash
bun dev
```

This will start the server on port 4001. You can change the port in the `app/server.ts` file.

## Implement Authentication for our API

We will use simple key based authentication for our API. But you can use any other authentication method as well as the process will be same.

```typescript
const authenticate = (context: Record<string, string | undefined>) => {
  const isAuthorized = context.authorization?.slice(7) === "12345678";
  if (!isAuthorized) {
    throw new Error("Unauthorized");
  }
};

const commentController = (app: Elysia) => {
  app.onBeforeHandle(async (context) => {
    authenticate(context.headers);
  });
  return Promise.resolve(app);
};

app.use(commentController);
```

Here we created a simple middleware to authenticate our API. We will use this middleware in our server.

This is how our server will look like:

```typescript
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { UserController } from "./controller/user.controller";

const app = new Elysia();

const authenticate = (context: Record<string, string | undefined>) => {
  const isAuthorized = context.authorization?.slice(7) === "12345678";
  if (!isAuthorized) {
    throw new Error("Unauthorized");
  }
};

const commentController = (app: Elysia) => {
  app.onBeforeHandle(async (context) => {
    authenticate(context.headers);
  });
  return Promise.resolve(app);
};

app.use(commentController);
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
```

We used `onBeforeHandle` method to authenticate our API. This method will be called before handling any request.

We are passing `12345678` as Bearar token in our request header. and we are checking if the token is valid or not. By default, Elysia in case of invalid token will return `404` status code with `Unauthorized` message.

### Conclusion

In this article, we created a simple REST API using ElysiaJS and Bun. We also implemented authentication for our API. You can find the complete code on [Github]()

For more information about ElysiaJS, you can visit the [official website](https://elysiajs.com/). and for Bun you can visit the [official website](https://bun.sh/).
