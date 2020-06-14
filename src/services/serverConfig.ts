export interface IServerConfig {
  environment: "development" | "production" | "test";
  wsEndpoint: string;
  apiBaseUrl: string;
  apiEndpoints: {
    userProfile: {
      get: string;
      single: string;
    };
    groupProfile: {
      get: string;
      single: string;
    };
    file: {
      post: string;
      get: string;
    };
  };
  getFile: string;
}

let environment = process.env.NODE_ENV;

let _cfg: IServerConfig = {
  environment: environment,
  wsEndpoint: "/ws",
  apiBaseUrl: "/api/v1",
  apiEndpoints: {
    userProfile: {
      get: "/user",
      single: "/user/{id}",
    },
    groupProfile: {
      get: "/group",
      single: "/group/{id}",
    },
    file: { post: "/file", get: "/file/id" },
  },
  getFile: "/file/{name}",
};

export const serverConfig: IServerConfig = _cfg;
