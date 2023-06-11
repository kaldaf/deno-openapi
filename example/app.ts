import { Application } from "./deps.ts";
import { allowedRouters, initRoutes } from "./routes.ts";
import { denoOpenapi, SwaggerSpecification } from "../mod.ts";

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
    const swagger: SwaggerSpecification = {
      openapi: "v3",
      info: {
        version: "0.4",
        title: "Deno OpenApi"
      },
      mappingPaths: ['./controller', './services'],
      routes: allowedRouters,
    }
    const _specification = denoOpenapi(swagger);
    // ...TO DO
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