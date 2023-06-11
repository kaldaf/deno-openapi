import { SwaggerSpecification } from "../swagger.model.ts";

export function createSpecification(specification: SwaggerSpecification): SwaggerSpecification {
  if (!specification.openapi) {
    specification.openapi = '3.0.0';
  }

  specification.paths = specification.paths || {};
  specification.components = specification.components || {};
  specification.components.schemas = specification.components.schemas || {};
  specification.components.responses = specification.components.responses || {};
  specification.components.parameters = specification.components.parameters || {};
  specification.components.examples = specification.components.examples || {};
  specification.components.requestBodies = specification.components.requestBodies || {};
  specification.components.headers = specification.components.headers || {};
  specification.components.securitySchemes = specification.components.securitySchemes || {};
  specification.components.links = specification.components.links || {};
  specification.components.callbacks = specification.components.callbacks || {};
  specification.tags = specification.tags || [];
  specification.externalDocs = specification.externalDocs || { url: '' };

  return specification;
}
