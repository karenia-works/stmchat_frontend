export interface IServerConfig {
  environment: "development" | "production" | "test";
  wsEndpoint: string;
  auth: {
    clientId: string;
    clientSecret: string;
    tokenEndpoint: string;
  };
  apiBaseUrl: string;
  apiEndpoints: {
    userProfile: {
      get: string;
      register: string;
      getMine: string;
      single: string;
    };
    groupProfile: {
      get: string;
      make: string;
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
  wsEndpoint: "ws://yuuna.srv.karenia.cc/ws/li",
  apiBaseUrl: "/api/v1",
  auth: {
    clientId: "",
    clientSecret: "",
    tokenEndpoint: "/connect/token",
  },
  apiEndpoints: {
    userProfile: {
      get: "/profile",
      register: "/register",
      getMine: "/profile/mine",
      single: "/profile/{id}",
    },
    groupProfile: {
      get: "/group",
      make: "/group",
      single: "/group/{id}",
    },
    file: { post: "/file", get: "/file/id" },
  },
  getFile: "{name}",
};

if (environment == "development") {
  _cfg.wsEndpoint = "ws://yuuna.srv.karenia.cc/ws/li";
  _cfg.apiBaseUrl = "http://yuuna.srv.karenia.cc/api/v1";
  _cfg.getFile = "http://yuuna.srv.karenia.cc{name}";
}

export const serverConfig: IServerConfig = _cfg;
