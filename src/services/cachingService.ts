import { UserProfile, GroupProfile } from "@/types/types";
import axios from "axios";
import { Lru } from "tiny-lru";
import { injectable, inject, singleton } from "tsyringe";
import { WsMessageService } from "./websocket";
import { TYPES } from "./dependencyInjection";
import { IServerConfig } from "./serverConfig";

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
  public constructor(protected limit: number, protected endpoint: string) {
    this.cache = new Lru(limit);
  }

  cache: Lru<T>;

  private async lookUpUser(id: string): Promise<T | undefined> {
    // TODO: get data from backend
    let userResp = await axios.get<T>(this.endpoint);
    let user = userResp.data;
    this.cache.set(id, user);
    return user;
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

  public updateData(id: string, data: T): Promise<void> {
    this.cache.set(id, data);
    return Promise.resolve();
  }

  public removeData(id: string): Promise<void> {
    this.cache.delete(id);
    return Promise.resolve();
  }
}

@singleton()
export class UserProfilePool extends ProfilePool<UserProfile> {
  public constructor(
    @inject(TYPES.ServerConfig) serverConfig: IServerConfig,
    ws: WsMessageService,
  ) {
    super(
      1024,
      serverConfig.apiBaseUrl + serverConfig.apiEndpoints.userProfile.get,
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
}

@singleton()
export class GroupProfilePool extends ProfilePool<GroupProfile> {
  public constructor(@inject(TYPES.ServerConfig) serverConfig: IServerConfig) {
    super(
      1024,
      serverConfig.apiBaseUrl + serverConfig.apiEndpoints.groupProfile.get,
    );
  }
}
