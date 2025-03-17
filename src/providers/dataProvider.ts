import { DataProvider } from "@refinedev/core";
import { RequestMethod, EndpointOptions } from '@octokit/types'; // OctokitResponse, Endpoints
import { request } from "@octokit/request";

class CustomError extends Error {
  constructor(name: string, message: string, cause?: any) {
    super(message);
    this.name = name;
    this.cause = cause;
  }
}

const parseErrors = (errors: any) => {
  let errs: any = {
    statusCode: errors?.status
  };

  for(let key in errors){
    errs[key] = errors[key];
  }

  return errs;
}

const requestWithAuth = request.defaults({
  headers: {
    authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN,
  },
});

const ERROR_UNSPECIFIC = "Something went wrong";

export const dataProvider = (httpClient = requestWithAuth): DataProvider => ({
  getList: async ({ resource, pagination, meta }) => { // , filters, sorters
    const {
      current = 1,
      pageSize = 10,
      mode = "server",
    } = pagination ?? {};

    const { method, queryContext, ...requestOptions } = meta ?? {};
    const requestMethod = (method as RequestMethod) ?? "GET";

    try {
      const options: EndpointOptions = {
        ...requestOptions,
        method: requestMethod,
        url: resource,
        request: {
          signal: queryContext?.signal,
        },
      };

      if(mode !== "off"){
        options.page = current;
        options.per_page = pageSize;
      }

      const result: any = await httpClient(options);

      if(result){
        return result.data;
      }

      throw new CustomError(
        'ReadError', 
        result?.errors?.message || ERROR_UNSPECIFIC, 
        result
      );
    } catch(err: any) {
      throw parseErrors(err);
    }
  },

  getMany: async ({ resource, ids, meta }) => {
    const { method, queryContext, ...requestOptions } = meta ?? {};
    const requestMethod = (method as RequestMethod) ?? "GET";

    try {
      const result: any = await httpClient({ 
        ...requestOptions,
        method: requestMethod,
        url: resource,
        request: {
          signal: queryContext?.signal,
        },
        id: ids,
      });
      
      if(result){
        return result.data;
      }
      
      throw new CustomError(
        'ReadError', 
        result?.errors?.message || ERROR_UNSPECIFIC, 
        result
      );
    } catch(err) {
      throw parseErrors(err);
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const { method, queryContext, ...requestOptions } = meta ?? {};
    const requestMethod = (method as RequestMethod) ?? "GET";

    try {
      const result: any = await httpClient({
        method: requestMethod,
        url: resource + (id ? '/' + id : ''),
        request: {
          signal: queryContext?.signal,
        },
        ...requestOptions
      });

      if(result){
        return result;
      }
      
      throw new CustomError(
        'ReadError', 
        result?.errors?.message || ERROR_UNSPECIFIC, 
        result
      );
    } catch(err) {
      throw parseErrors(err);
    }
  },

  create: async ({ resource, variables, meta }) => {
    const { method, signal, ...requestOptions } = meta ?? {};
    const requestMethod = (method as RequestMethod) ?? "POST";

    try {
      const options: EndpointOptions = {
        ...requestOptions,
        method: requestMethod,
        url: resource,
        request: {
          signal,
        },
      };

      if(requestMethod === "POST"){
        options.data = variables;
      }

      const result: any = await httpClient(options);

      if(result){
        return result;
      }
      
      throw new CustomError(
        'CreateError', 
        result?.errors?.message || ERROR_UNSPECIFIC, 
        result
      );
    } catch(err) {
      throw parseErrors(err);
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    const { method, ...requestOptions } = meta ?? {};
    const requestMethod = (method as RequestMethod) ?? "PUT";

    try {
      const result: any = await httpClient({
        ...requestOptions,
        method: requestMethod,
        url: resource + (id ? '/' + id : ''),
        data: variables,
      });

      if(result){
        return result;
      }
      
      throw new CustomError(
        'UpdateError', 
        result?.errors?.message || ERROR_UNSPECIFIC, 
        result
      );
    } catch(err) {
      throw parseErrors(err);
    }
  },

  // @ts-ignore
  custom: async () => {},
});
