import Axios, { AxiosRequestConfig } from "axios";
import { singleton } from "tsyringe";

export function interceptAuthorizationData(
  token: string | undefined,
  cfg: AxiosRequestConfig,
): AxiosRequestConfig {
  if (token !== undefined) {
    cfg.headers["Authorization"] = `Bearer ${token}`;
  }
  return cfg;
}

export class LoginState {
  token?: string;

  public setupInterceptor() {
    Axios.interceptors.request.use(cfg =>
      ((self, cfg) => interceptAuthorizationData(self.token, cfg))(this, cfg),
    );
  }

  public setToken(token: string) {
    this.token = token;
  }

  public clearToken() {
    this.token = undefined;
  }
}

@singleton()
export class LoginService {
  state: LoginState = new LoginState();
}
