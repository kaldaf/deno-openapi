## Deno OpenAPI
> ⚠ Under development
Add decorators to the controllers and generate the [Swagger](https://swagger.io/) specification. Oak HTTP server-based library.

### List of tasks
- [ ] Parse controllers & decorators & models
    - [ ] Convert decorators & routes to swagger definition
    - [ ] Serve final yaml / json file
- [ ] Not important
    - [ ] Coverage of all scenarios
    - [ ] Request cookies & headers
    - [ ] Response cookies & headers
    - [ ] Disable / enable serve on [Deno Deploy](https://deno.com/deploy)

### Workflow structure
```
├── your_application
│   ├── controllers
│   │   ├── *.ts
│   ├── routes
│   │   ├── *.router.ts
│   ├── routes.ts
└───└── app.ts (setup your specification)
```

### App.ts
```typescript
import { Application } from "./deps.ts";
import { allowedRouters, initRoutes } from "./routes.ts";
import { SwaggerSpecification } from "../lib/swagger.model.ts";
import { denoOpenapi } from "../mod.ts";

export class App {
  public app = new Application();
  public port: number;
  public startTime: number = new Date().getTime();

  constructor(port: number) {
    this.port = port || 8000;
    this.initializeApp().then(
      async () => await this.listen()
    );
    this.initializeRoutes();
  }

  private initializeRoutes() {
    initRoutes(this.app);
  }

  public async initializeApp() {
    // Here setup your swagger specification, mapping paths and so on
    const swagger: SwaggerSpecification = {
      openapi: "v3",
      info: {
        version: "0.4",
        title: "Deno OpenApi"
      },
      mappingPaths: ['./controller', './services'],
      routes: allowedRouters,
    }
    const specification = denoOpenapi(swagger); // (.json file ready to serve)
  }

  public async listen() {
    console.info(
      `⚡ Listening on port ${this.port} at ${new Date()
        .toLocaleString()
        .replaceAll(". ", "/")} ⌛ ${new Date().getTime()- this.startTime}ms \n`
    );
    return await this.app.listen({ port: this.port });
  }
}

const _app = new App(8000);
```

### Routes for controllers
```typescript
import { UserController } from "../controllers/user.ts";
import { Router } from "../deps.ts";

const userRouter = new Router({ prefix: "/api/user" });
const userController = new UserController();

userRouter
.get("/", userController.get)
.post("/", userController.post);

export default { router: userRouter, middlewares: [userController], summary: "User endpoint" };
```

### Main "router"
```typescript
import { RouteControllers } from "../lib/swagger.model.ts";
import { Application } from "./deps.ts";
import userRouter from "./routes/user.router.ts";

// here allow all your desired routers
export const allowedRouters: RouteControllers[] = [userRouter];

export const initRoutes = (app: Application) => {
    try {
        console.info("✅ Routes was succesfully initialized.");
        for (let i = 0; i < allowedRouters.length; i++) {
        const router = allowedRouters[i];
        app.use(router.router.routes());
        app.use(router.router.allowedMethods());
        }
    } catch (error) {
        console.info("❌ Routes have not been initialized. ");
        console.warn(`📢 Error: \n\n ${error} \n`);
        Deno.exit(1);
    }
};
```

### Controllers
Decorators available to specify the endpoint directly in the controller:
- Request decorators
    - Get
    - Post
    - Patch
    - Put
    - Delete
- Response decorators
    - Response

```typescript
import { Get, Post, Response } from "../../mod.ts";
import { Context, Status } from "../deps.ts";

class Login {
  email!: string;
  password!: string;
}

export class UserController {
  @Get({
    description: "Get response from your name.",
    queryParams: [{ name: "name", type: "string" }],
  })
  @Response(200, { example: "Hello {name}!", description: "Successful request" },)
  @Response(400, { description: "Missing {name} param from URL." })
  get(ctx: Context) {
    const params = ctx.request.url.searchParams;
    const name = params.get("name");

    if (!name) ctx.throw(Status.BadRequest, "MissingParams");

    ctx.response.body = `Hello ${name}!`;
  }

  @Post({
    description: "Get response from your name.",
    requestBody: Login
  })
  @Response(200, { description: "Successful request, returned JWT token" },)
  @Response(400, { description: "User was not found" })
  @Response(500, { description: "Internal server error" })
  async post(ctx: Context) {
    if (!ctx.request.hasBody) ctx.throw(Status.InternalServerError, "InternalServerError");

    const model: Login = await ctx.request.body().value;
    if(!model) ctx.throw(Status.BadRequest, "UserNotFound");

    if(model.password === "admin" && model.email=== "admin@admin.com"){
      ctx.response.body = "..."
    } else {
      ctx.throw(Status.BadRequest, "UserNotFound");
    }
  }
}
```

## Contacts 
- [LinkedIn](https://www.linkedin.com/in/kalousek/)
- [Twitter](https://twitter.com/kalousekf)
- [Web](https://filipkalousek.cz)
- [Blog](https://blog.filipkalousek.cz)