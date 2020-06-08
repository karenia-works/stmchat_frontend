import { container } from "tsyringe";
import { WsMessageService } from "./websocket";
import {
  UserProfilePool,
  ProfilePool,
  GroupProfilePool,
} from "./cachingService";
import { UserProfile, GroupProfile } from "@/types/types";
import { LoginService } from "./loginService";
import { serverConfig, IServerConfig } from "./serverConfig";
import { ChatMessageService } from "./messageService";

export var TYPES = {
  WebsocketService: "websocket_service",
  UserProfilePool: "user_profile_pool",
  GroupProfilePool: "group_profile_pool",
  UserProfilePoolInterface: "user_profile_pool_interface",
  GroupProfilePoolInterface: "group_profile_pool_interface",
  LoginService: "login_service",
  ServerConfig: "server_config",
  ChatMessageService: "chat_message_service",
};

export const serviceProvider = container;

container.register<IServerConfig>(TYPES.ServerConfig, {
  useValue: serverConfig,
});
container.register<WsMessageService>(TYPES.WebsocketService, {
  useToken: WsMessageService,
});
container.register<WsMessageService>(WsMessageService, {
  useClass: WsMessageService,
});
container.register<UserProfilePool>(TYPES.UserProfilePool, {
  useToken: UserProfilePool,
});
container.register<UserProfilePool>(UserProfilePool, {
  useClass: UserProfilePool,
});
container.register<GroupProfilePool>(TYPES.GroupProfilePool, {
  useToken: GroupProfilePool,
});
container.register<GroupProfilePool>(GroupProfilePool, {
  useClass: GroupProfilePool,
});
// container.register<ProfilePool<GroupProfile>>(GroupProfilePool, {
//   useToken: GroupProfilePool,
// });
// container.register<ProfilePool<GroupProfile>>(GroupProfilePool, {
//   useToken: GroupProfilePool,
// });
container.register<LoginService>(LoginService, { useClass: LoginService });
container.register<LoginService>(TYPES.LoginService, {
  useToken: LoginService,
});
container.register<ChatMessageService>(ChatMessageService, {
  useClass: ChatMessageService,
});
container.register<ChatMessageService>(TYPES.ChatMessageService, {
  useToken: ChatMessageService,
});

// (function() {
//   serviceProvider
//     .bind<IServerConfig>(TYPES.ServerConfig)
//     .toConstantValue(serverConfig);

//   serviceProvider
//     .bind<WsMessageService>(TYPES.WebsocketService)
//     .to(WsMessageService);

//   serviceProvider
//     .bind<UserProfilePool>(TYPES.UserProfilePool)
//     .to(UserProfilePool);

//   serviceProvider
//     .bind<ProfilePool<UserProfile>>(TYPES.UserProfilePoolInterface)
//     .toService(TYPES.UserProfilePool);

//   serviceProvider
//     .bind<GroupProfilePool>(TYPES.GroupProfilePool)
//     .to(GroupProfilePool);

//   serviceProvider
//     .bind<ProfilePool<GroupProfile>>(TYPES.GroupProfilePoolInterface)
//     .toService(TYPES.GroupProfilePool);

//   serviceProvider.bind<LoginService>(TYPES.LoginService).to(LoginService);

//   serviceProvider
//     .bind<ChatMessageService>(TYPES.ChatMessageService)
//     .to(ChatMessageService);
// })();
