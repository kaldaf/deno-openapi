type HttpMethod = "POST" | "GET" | "PATCH" | "DELETE" | "PUT";

type QueryType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "date"
  | "dateTime"
  | "binary"
  | "array"
  | "string[]"
  | "number[]"
  | "integer[]"
  | "boolean[]"
  | "object"
  | "object[]"
  | "file";

interface QueryParam {
  name: string;
  type: QueryType;
}

class ApiEndpointMetadata {
  protected method!: HttpMethod;
  queryParams?: QueryParam[];
  description?: string;
  requestBody?: unknown;
}

const setHttpMethodDecorator =
  (method: HttpMethod) =>
  (
    metadata?:
      | ApiEndpointMetadata
      | { queryParams?: QueryParam[]; description?: string; requestBody?: unknown }
  ) =>
  (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (!(metadata instanceof ApiEndpointMetadata)) {
      const newMetadata = new ApiEndpointMetadata();
      (newMetadata as any).method = method;
      newMetadata.queryParams = metadata?.queryParams;
      newMetadata.description = metadata?.description;
      newMetadata.requestBody = metadata?.requestBody;
      metadata = newMetadata;
    }
  };

export const Post = setHttpMethodDecorator("POST");
export const Get = setHttpMethodDecorator("GET");
export const Patch = setHttpMethodDecorator("PATCH");
export const Delete = setHttpMethodDecorator("DELETE");
export const Put = setHttpMethodDecorator("PUT");

type StatusCode =
  | 100 | 101 | 102
  | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
  | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308
  | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 426 | 428 | 429 | 431 | 451
  | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

export const Response = (
  statusCode: StatusCode,
  metadata?: { description?: string; example?: string }
) => {
  return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    descriptor.value.metadata = {
      ...descriptor.value.metadata,
      status: {
        statusCode,
        description: metadata?.description,
        example: metadata?.example,
      },
    };

    return descriptor;
  };
};
