import { User } from "@/types/types";
import axios from "axios";
import { Lru } from "tiny-lru";

export interface IProfileCache<T> {
  getData(id: string): Promise<T>;
  refreshData(id: string): Promise<void>;
  updateData(id: string, data: T): Promise<void>;
}

export class UserProfileCache implements IProfileCache<User> {
  public constructor(private limit: number) {
    this.cache = new Lru(limit);
  }
  cache: Lru<User>;

  private async lookUpUser(id: string): Promise<User> {
    throw new Error("Not implemented: Look up user in server");
    let user = axios.get<User>("todo: link");
    this.cache.set(id, user);
  }

  public async getData(id: string, force: boolean = false): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public async refreshData(id: string): Promise<void> {
    this.getData(id, true);
  }

  public updateData(id: string, data: User): Promise<void> {
    this.cache.set(id, data);
    return Promise.resolve();
  }
}
