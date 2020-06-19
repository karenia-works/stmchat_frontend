import { UserProfile, GroupProfile } from "@/types/types";
import axios from "axios";
import { Lru } from "tiny-lru";
import { injectable, inject, singleton } from "tsyringe";
import { WsMessageService } from "./websocket";
import { TYPES } from "./dependencyInjection";
import { IServerConfig } from "./serverConfig";
import { LoginService } from "./loginService";
import { Subject } from "rxjs";

/**
 * Represents an async data caching service of type `T`, which
 */
export interface ICachingDataPool<T> {
  getData(id: string): Promise<T | undefined>;
  refreshData(id: string): Promise<void>;
  updateData(id: string, data: T): Promise<void>;
  removeData(id: string): Promise<void>;
}

export class ProfilePool<T> implements ICachingDataPool<T> {
  public constructor(
    protected limit: number,
    protected baseDataEndpoint: string,
    protected singleDataEndpoint: (id: string) => string,
  ) {
    this.cache = new Map();
  }

  cache: Map<string, T>;
  pending: Map<string, Subject<T>> = new Map();

  private async lookUpUser(id: string): Promise<T | undefined> {
    if (this.pending.has(id)) {
      let pending = this.pending.get(id);
      let t = await pending.toPromise();
      return t;
    } else {
      let pending = new Subject<T>();
      let pendingRequest = axios.get<T>(this.singleDataEndpoint(id));
      this.pending.set(id, pending);
      let userResp = await pendingRequest;
      let user = userResp.data;
      this.cache.set(id, user);
      pending.next(user);
      this.pending.delete(id);
      return user;
    }
  }

  public async getData(
    id: string,
    force: boolean = false,
  ): Promise<T | undefined> {
    let data = this.cache.get(id);
    if (data !== undefined && !force) {
      return data;
    } else {
      return this.lookUpUser(id);
    }
  }

  public async refreshData(id: string): Promise<void> {
    this.getData(id, true);
  }

  public async updateData(
    id: string,
    data: T,
    writeThrough: boolean = true,
  ): Promise<void> {
    this.cache.set(id, data);
    if (writeThrough) {
      await axios.post(this.singleDataEndpoint(id), data);
    }
  }

  public removeData(id: string): Promise<void> {
    this.cache.delete(id);
    return Promise.resolve();
  }
}

@singleton()
export class UserProfilePool extends ProfilePool<UserProfile> {
  public constructor(
    @inject("server_config") private serverConfig: IServerConfig,
    ws: WsMessageService,
    private loginService: LoginService,
  ) {
    super(
      1024,
      serverConfig.apiBaseUrl + serverConfig.apiEndpoints.userProfile.get,
      id =>
        serverConfig.apiBaseUrl +
        serverConfig.apiEndpoints.userProfile.single.replace("{id}", id),
    );
    ws.userOnlineState.subscribe({
      next: msg => {
        this.updateUserOnlineStatus(msg.userId, msg.online);
      },
    });
  }

  public updateUserOnlineStatus(id: string, online: boolean) {
    let result = this.cache.get(id);
    if (result !== undefined) {
      result.state = online;
    }
  }

  public async getMyProfile(refresh: boolean): Promise<UserProfile | null> {
    if (!this.loginService.loginState.isLoggedIn()) {
      return null;
    } else {
      let result = await axios.get<UserProfile>(
        this.serverConfig.apiBaseUrl +
          this.serverConfig.apiEndpoints.userProfile.getMine,
        {},
      );
      return result.data;
    }
  }

  public async register(profile: UserProfile): Promise<UserProfile> {
    if (this.loginService.loginState.isLoggedIn()) {
      throw new Error("User is already logged in");
    } else {
      let result = await axios.post<UserProfile>(
        this.serverConfig.apiBaseUrl +
          this.serverConfig.apiEndpoints.userProfile.register,
        profile,
      );
      if (result.status == 400) {
        throw new Error("Username taken");
      } else if (result.status >= 300) {
        throw new Error("Register error");
      }
      this.updateData(result.data.id, result.data);
      return result.data;
    }
  }
}

@singleton()
export class GroupProfilePool extends ProfilePool<GroupProfile> {
  public constructor(
    @inject("server_config") private serverConfig: IServerConfig,
  ) {
    super(
      1024,
      serverConfig.apiBaseUrl + serverConfig.apiEndpoints.groupProfile.get,
      id =>
        serverConfig.apiBaseUrl +
        serverConfig.apiEndpoints.groupProfile.single.replace("{name}", id),
    );
  }

  public async makeGroup(profile: GroupProfile): Promise<GroupProfile> {
    let result = await axios.post<GroupProfile>(
      this.serverConfig.apiBaseUrl +
        this.serverConfig.apiEndpoints.groupProfile.make,
      profile,
    );
    this.updateData(result.data.id, result.data);
    return result.data;
  }
}
