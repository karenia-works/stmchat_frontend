import { Container } from "inversify";
import { WsMessageService } from "./websocket";
import {
  UserProfilePool,
  ProfilePool,
  GroupProfilePool,
} from "./cachingService";
import { UserProfile, GroupProfile } from "@/types/types";
import { LoginService } from "./loginService";
import { serverConfig, IServerConfig } from "./serverConfig";

export const TYPES = {
  WebsocketService: "websocket_service",
  UserProfilePool: "user_profile_pool",
  GroupProfilePool: "group_profile_pool",
  LoginService: "login_service",
  ServerConfig: "server_config",
};

export const serviceProvider = new Container({ defaultScope: "Singleton" });

serviceProvider
  .bind<IServerConfig>(TYPES.ServerConfig)
  .toConstantValue(serverConfig);

serviceProvider.bind<WsMessageService>(TYPES.WebsocketService).toSelf();

serviceProvider.bind<UserProfilePool>(TYPES.UserProfilePool).toSelf();

serviceProvider
  .bind<ProfilePool<UserProfile>>(TYPES.UserProfilePool)
  .to(UserProfilePool);

serviceProvider.bind<GroupProfilePool>(TYPES.GroupProfilePool).toSelf();

serviceProvider
  .bind<ProfilePool<GroupProfile>>(TYPES.GroupProfilePool)
  .to(GroupProfilePool);

serviceProvider.bind<LoginService>(TYPES.LoginService).to(LoginService);
