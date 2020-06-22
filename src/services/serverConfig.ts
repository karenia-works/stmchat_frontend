export interface IServerConfig {
  environment: "development" | "production" | "test";
  wsEndpoint: string;
  auth: {
    clientId: string;
    clientSecret: string;
    scope: string;
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
    chat: {
      messages: string;
    };
  };
  getFile: string;
  debug?: {
    /** 无视用户登陆状态强行连接到下面的 websocket 端口 */
    wsEndpointOverride?: string;
  };
}

let environment = process.env.NODE_ENV;

let _cfg: IServerConfig = {
  environment: environment,
  wsEndpoint: "ws://yuuna.srv.karenia.cc/ws/{name}",
  apiBaseUrl: "/api/v1",
  auth: {
    clientId: "client",
    clientSecret: "client",
    scope: "IdentityServerApi",
    tokenEndpoint: "/connect/token",
  },
  apiEndpoints: {
    userProfile: {
      get: "/profile/test",
      register: "/register",
      getMine: "/profile/me",
      single: "/profile/test/{id}",
    },
    groupProfile: {
      get: "/group",
      make: "/group",
      single: "/group/{id}",
    },
    chat: {
      messages: "/chat/{id}",
    },
    file: { post: "/file", get: "/file/id" },
  },
  getFile: "{name}",
};

if (environment == "development") {
  _cfg.apiBaseUrl = "http://yuuna.srv.karenia.cc/api/v1";
  _cfg.getFile = "http://yuuna.srv.karenia.cc{name}";
  _cfg.auth.tokenEndpoint = "http://yuuna.srv.karenia.cc/connect/token";
  _cfg.debug = { wsEndpointOverride: "ws://yuuna.srv.karenia.cc/ws/li" };
}

export const serverConfig: IServerConfig = _cfg;
