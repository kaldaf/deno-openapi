import { Router, Middleware } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { RouteControllers } from "../swagger.model.ts";
export async function routerMapper(
  routers: RouteControllers[],
  mappingPaths: string[]
) {
  const endpointFolders: string[] = mappingPaths;

  for (const router of routers) {
    const operations = router.router as Router;
    for (const route of operations) {
      try {
        for (const endpointFolder of endpointFolders) {
          for await (const controller of Deno.readDir(endpointFolder)) {
            const methodNameRegex = /(?:function|async\s*function)?\s*(\w+)\s*\(.*?\)\s*\{/;
            const match = route.middleware.toString().match(methodNameRegex);
            if (match) {
              const methodName = match[1];
              const filePath = `${endpointFolder}/${controller.name}`;
              const methodMiddleware = route.middleware.toString();

              // Pass the methodName and methodMiddleware variables to parseControllerFile
              const decorators = await parseControllerFile(filePath, methodName, methodMiddleware);
              console.log(`Decorators in ${filePath} for method ${methodName}:`, decorators);
            }
          }
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }
}
function getDecorators(fileContent: string): { [key: string]: any[] } {
  const decoratorRegex = /@(\w+)\s*\(.*?[\s\S]*?\)(?=\s*(?:@|\s*$))/g;
  const decorators: { [key: string]: any[] } = {};

  let match;
  while ((match = decoratorRegex.exec(fileContent))) {
    const decorator = match[0];
    const decoratorName = match[1];
    const decoratorValue = parseDecoratorValue(decorator);

    if (!decorators[decoratorName]) {
      decorators[decoratorName] = [];
    }
    decorators[decoratorName].push({ name: decoratorName, value: decoratorValue.replace(/\r?\n\s*/g, '') });
  }

  return decorators;
}


function parseDecoratorValue(value: string): any {
  try {
    return JSON.parse(value);
  } catch {
    return value.trim();
  }
}

async function parseControllerFile(filePath: string, methodName: string, middleware: string): Promise<any[]> {
  const fileContent = await Deno.readTextFile(filePath);
  const decorators = getDecorators(fileContent);
  const methodRegex = new RegExp(`\\b${methodName}\\s*\\(`);
  const methodStartIndex = fileContent.search(methodRegex);

  if (methodStartIndex === -1) {
    throw new Error(`Method '<span class="math-inline">\{methodName\}\' not found in file \'</span>{filePath}'`);
  }

  const methodEndIndex = findMethodEndIndex(fileContent, methodStartIndex);
  const methodContent = fileContent.slice(methodStartIndex, methodEndIndex);
  const methodDecorators = getDecorators(methodContent);

  const middlewareNames = Object.keys(decorators);
  const result: any[] = [];

  console.log(methodDecorators)

  for (const middlewareName of middlewareNames) {
    const middlewareDecorators = JSON.parse(JSON.stringify(methodDecorators[middlewareName] || []));
    const endpointDefinition = extractEndpointDefinition(middlewareDecorators);
    endpointDefinition.method = middlewareName; // Set the method name
    result.push(endpointDefinition);
  }

  return result;
}

function extractEndpointDefinition(decorators: any[]): any {
  const endpointDefinition: {
    method: string;
    responses: { status: number; description: string; example?: string }[];
  } = {
    method: "",
    responses: [],
  };

  for (const decorator of decorators) {
    if (decorator.name === "Response") {
      const response = JSON.parse(decorator.value);
      const status = Object.keys(response)[0];
      const description = response[status].description;
      const example = response[status].example;

      endpointDefinition.responses.push({
        status: parseInt(status),
        description,
        example,
      });
    } else {
      endpointDefinition.method = decorator.name;
    }
  }

  return endpointDefinition;
}




function findMethodEndIndex(content: string, methodStartIndex: number) {
  let bracketCount = 1;
  let index = methodStartIndex;

  while (bracketCount > 0 && index < content.length) {
    index++;
    if (content[index] === '{') bracketCount++;
    if (content[index] === '}') bracketCount--;
  }

  return index;
}
