import { SwaggerSpecification } from "./swagger.model.ts";
import { routerMapper } from './shared/routesMapper.ts';

export async function denoOpenapi(options: SwaggerSpecification) {
  if (!options.routes || !options.mappingPaths) {
    throw new Error('Provided options are incorrect.');
  }

  try {
    const app = await routerMapper(options.routes, options.mappingPaths);
    // ... TODO
  } catch (err) {
    console.warn(err);
    throw new Error(err);
  }
}