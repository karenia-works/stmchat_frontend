import Axios, { AxiosRequestConfig } from "axios";
import { singleton, inject } from "tsyringe";
import { TYPES } from "./dependencyInjection";
import { IServerConfig } from "./serverConfig";
import { Subject } from "rxjs";
import qs from "qs";

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
const LOCAL_STORAGE_USERNAME_KEY: string = "username";

export class LoginState extends Subject<boolean> {
  public constructor() {
    super();
    this.setupInterceptor();
  }

  public storeToken() {
    if (this.token !== undefined && this.username !== undefined) {
      window.localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, this.token);
      window.localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, this.username);
    }
  }

  public loadToken() {
    let token = window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    let username = window.localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
    if (token !== null && username !== null) this.setToken(username, token);
  }

  private token?: string;
  private username?: string;

  public setupInterceptor() {
    Axios.interceptors.request.use(cfg =>
      interceptAuthorizationData(() => this.token, cfg),
    );
  }

  public setToken(username: string, token: string) {
    this.token = token;
    this.username = username;
    this.next(true);
  }

  public clearToken() {
    this.token = undefined;
    this.username = undefined;
    this.next(false);
  }

  public isLoggedIn() {
    return this.token !== null;
  }

  public getUsername(): string | undefined {
    return this.username;
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

export interface User {
  id: string;
  name: string;
  password: string;
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
      scope: this.config.auth.scope,
    };

    let result = await Axios.post<UserLoginData>(url, qs.stringify(tokenCtx));
    let success = result.status >= 200 && result.status < 300;

    this._loginState.setToken(username, result.data.access_token);

    return success;
  }

  public async logout() {
    this._loginState.clearToken();
  }

  public async register(username: string, password: string): Promise<boolean> {
    let result = await Axios.post(
      this.config.apiBaseUrl + this.config.apiEndpoints.userProfile.register,
      {
        name: username,
        password: password,
      } as User,
      {
        validateStatus(status) {
          return true;
        },
      },
    );
    return result.status < 300;
  }
}
