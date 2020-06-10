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
import { ChatMessageService, MessageListService } from "./messageService";

// webpack-include
var TYPES = {
  WebsocketService: "websocket_service",
  UserProfilePool: "user_profile_pool",
  GroupProfilePool: "group_profile_pool",
  UserProfilePoolInterface: "user_profile_pool_interface",
  GroupProfilePoolInterface: "group_profile_pool_interface",
  LoginService: "login_service",
  ServerConfig: "server_config",
  ChatMessageService: "chat_message_service",
  MessageListService: "message_list_service",
  types: "types",
};

const serviceProvider = container;

export { TYPES, serviceProvider };

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
container.register(TYPES.types, { useValue: TYPES });
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
container.register<MessageListService>(MessageListService, {
  useClass: MessageListService,
});
container.register<MessageListService>(TYPES.MessageListService, {
  useToken: MessageListService,
});
