import { Get, Post, Response } from "../../mod.ts";
import { Context, Status } from "../deps.ts";

class Login {
  email!: string;
  password!: string;
}

export class UserController {
  @Get({ description: "Get response from your name.", queryParams: [{ name: "name", type: "string" }] })
  @Response(200, { example: "Hello {name}!", description: "Successful request"})
  @Response(400, { description: "Missing {name} param from URL." })
  get(ctx: Context) {
    const params = ctx.request.url.searchParams;
    const name = params.get("name");

    if (!name) ctx.throw(Status.BadRequest, "MissingParams");

    ctx.response.body = `Hello ${name}!`;
  }

  @Post({ description: "Get response from your name.", requestBody: Login})
  @Response(200, { description: "Successful request, returned JWT token" })
  @Response(400, { description: "User was not found" })
  @Response(500, { description: "Internal server error" })
  async post(ctx: Context) {
    if (!ctx.request.hasBody)
      ctx.throw(Status.InternalServerError, "InternalServerError");

    const model: Login = await ctx.request.body().value;
    if (!model) ctx.throw(Status.BadRequest, "UserNotFound");

    if (model.password === "admin" && model.email === "admin@admin.com") {
      ctx.response.body = "...";
    } else {
      ctx.throw(Status.BadRequest, "UserNotFound");
    }
  }
}
