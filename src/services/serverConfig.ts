export interface IServerConfig {
  wsEndpoint: string;
  apiBaseUrl: string;
  apiEndpoints: {
    userProfile: {
      get: string;
    };
    groupProfile: {
      get: string;
    };
  };
}

export const serverConfig: IServerConfig = {
  wsEndpoint: "ws://localhost:8089",
  apiBaseUrl: "example.com/api/v1",
  apiEndpoints: {
    userProfile: {
      get: "/user",
    },
    groupProfile: {
      get: "/group",
    },
  },
};
