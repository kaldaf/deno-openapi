import { Router, Middleware } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { RouteControllers } from "../swagger.model.ts";

export async function routerMapper(routers: RouteControllers[], mappingPaths: string[]) {
  // todo load from definition
  const endpointFolders: string[] = mappingPaths;

  for (const router of routers) {
    const operations = router.router as Router;
    for (const route of operations) {
      // Process routes
    }
    for (const middleware of router.middlewares) {
      try {
        for (const endpointFolder of endpointFolders) {
          for await (const controller of Deno.readDir(endpointFolder)) {
            const filePath = `${endpointFolder}/${controller.name}`;
            const decorators = await parseControllerFile(filePath);
            console.log(`Decorators in ${filePath}:`, decorators);
          }
        }
      } catch (err) {
        //console.log(err)
      }
    }
  }
}

function getDecorators(fileContent: string): { name: string; value?: any }[] {
  const decoratorRegex = /@(\w+)\(([^)]*)\)/g;
  const decorators: { name: string; value?: any }[] = [];
  let match;
  while ((match = decoratorRegex.exec(fileContent))) {
    const decoratorName = match[1];
    const decoratorValue = match[2] ? eval(`(${match[2]})`) : undefined;
    decorators.push({ name: decoratorName, value: decoratorValue });
  }

  return decorators;
}

async function parseControllerFile(filePath: string): Promise<any> {
  const fileContent = await Deno.readTextFile(filePath);
  return getDecorators(fileContent);
}
