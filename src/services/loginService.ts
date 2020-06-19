import Axios, { AxiosRequestConfig } from "axios";
import { singleton, inject } from "tsyringe";
import { TYPES } from "./dependencyInjection";
import { IServerConfig } from "./serverConfig";
import { Subject } from "rxjs";

export function interceptAuthorizationData(
  getToken: () => string | undefined,
  cfg: AxiosRequestConfig,
): AxiosRequestConfig {
  let token = getToken();
  if (token !== undefined) {
    cfg.headers["Authorization"] = `Bearer ${token}`;
  }
  return cfg;
}

const LOCAL_STORAGE_ACCESS_TOKEN_KEY: string = "access_token";

export class LoginState extends Subject<boolean> {
  public constructor() {
    super();
    this.setupInterceptor();
  }

  public storeToken() {
    if (this.token !== undefined)
      window.localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, this.token);
  }

  public loadToken() {
    let token = window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    if (token !== null) this.setToken(token);
  }

  private token?: string;

  public setupInterceptor() {
    Axios.interceptors.request.use(cfg =>
      interceptAuthorizationData(() => this.token, cfg),
    );
  }

  public setToken(token: string) {
    this.token = token;
    this.next(true);
  }

  public clearToken() {
    this.token = undefined;
    this.next(false);
  }

  public isLoggedIn() {
    return this.token !== null;
  }
}

interface TokenContext {
  client_id: string;
  client_secret: string;
  grant_type:
    | "authorization_code"
    | "client_credentials"
    | "password"
    | "refresh_token"
    | "urn:ietf:params:oauth:grant-type:device_code"
    | "hashed_password";
  scope?: string;
  redirect_uri?: string;
  username?: string;
  password?: string;
  refresh_token?: string;
  device_code?: string;
}

interface UserLoginData {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

@singleton()
export class LoginService {
  public constructor(@inject("server_config") private config: IServerConfig) {}

  private _loginState: LoginState = new LoginState();

  public get loginState() {
    return this._loginState;
  }

  public async login(username: string, password: string): Promise<boolean> {
    let url = this.config.auth.tokenEndpoint;

    let tokenCtx: TokenContext = {
      client_id: this.config.auth.clientId,
      client_secret: this.config.auth.clientSecret,
      grant_type: "password",
      username,
      password,
    };

    let result = await Axios.post<UserLoginData>(url, tokenCtx);
    let success = result.status >= 200 && result.status < 300;

    this._loginState.setToken(result.data.access_token);

    return success;
  }

  public async logout() {
    this._loginState.clearToken();
  }
}
