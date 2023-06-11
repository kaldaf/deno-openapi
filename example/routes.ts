import { RouteControllers } from "../mod.ts";
import { Application } from "./deps.ts";
import userRouter from "./routes/user.router.ts";

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