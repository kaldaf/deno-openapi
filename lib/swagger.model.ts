export class RouteControllers{
  router!: any;
  middlewares!: any[];
}

export interface SwaggerSpecification {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths?: PathsObject;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
  routes: RouteControllers[];
  mappingPaths: string[];
  [key: string]: any;
}

export interface InfoObject {
  title: string;
  description?: string;
  version: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;
}

export interface ContactObject {
  name?: string;
  url?: string;
  email?: string;
}

export interface LicenseObject {
  name: string;
  url?: string;
}

export interface ServerObject {
  url: string;
  description?: string;
  variables?: { [name: string]: ServerVariableObject };
}

export interface ServerVariableObject {
  enum?: string[];
  default: string;
  description?: string;
}

export interface PathsObject {
  [path: string]: PathItemObject;
}

export interface PathItemObject {
  $ref?: string;
  summary?: string;
  description?: string;
  servers?: ServerObject[];
  parameters?: ParameterObject[];
  method: OperationObject | undefined;
}

export interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses: ResponsesObject;
  security?: SecurityRequirementObject[];
  deprecated?: boolean;
  servers?: ServerObject[];
}

export interface ParameterObject {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  schema?: SchemaObject;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  example?: any;
  examples?: { [name: string]: ExampleObject };
}

export interface RequestBodyObject {
  description?: string;
  content: { [contentType: string]: MediaTypeObject };
  required?: boolean;
}

export interface MediaTypeObject {
  schema?: SchemaObject;
  example?: any;
  examples?: { [name: string]: ExampleObject };
}

export interface ResponsesObject {
  [statusCode: string]: ResponseObject;
}

export interface ResponseObject {
  description: string;
  headers?: { [name: string]: HeaderObject };
  content?: { [contentType: string]: MediaTypeObject };
  links?: { [name: string]: LinkObject };
}

export interface ComponentsObject {
  schemas?: { [name: string]: SchemaObject };
  responses?: { [name: string]: ResponseObject };
  parameters?: { [name: string]: ParameterObject };
  examples?: { [name: string]: ExampleObject };
  requestBodies?: { [name: string]: RequestBodyObject };
  headers?: { [name: string]: HeaderObject };
  securitySchemes?: { [name: string]: SecuritySchemeObject };
  links?: { [name: string]: LinkObject };
  callbacks?: { [name: string]: CallbackObject };
}

export interface SecuritySchemeObject {
  type: string;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
  bearerFormat?: string;
  flows?: OAuthFlowsObject;
  openIdConnectUrl?: string;
}

export interface OAuthFlowsObject {
  implicit?: OAuthFlowObject;
  password?: OAuthFlowObject;
  clientCredentials?: OAuthFlowObject;
  authorizationCode?: OAuthFlowObject;
}

export interface OAuthFlowObject {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes?: { [name: string]: string };
}

export interface SchemaObject {
  $ref?: string;
  title?: string;
  description?: string;
  type?: string;
  required?: string[];
  properties?: { [name: string]: SchemaObject };
  items?: SchemaObject;
  enum?: any[];
  example?: any;
}

export interface HeaderObject {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: SchemaObject;
  example?: any;
  examples?: { [name: string]: ExampleObject };
}

export interface ExampleObject {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

export interface LinkObject {
  operationRef?: string;
  operationId?: string;
  parameters?: { [name: string]: any };
  requestBody?: any;
  description?: string;
  server?: ServerObject;
}

export interface CallbackObject {
  [name: string]: PathItemObject;
}

export interface SecurityRequirementObject {
  [name: string]: string[];
}

export interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
}

export interface ExternalDocumentationObject {
  description?: string;
  url: string;
}
