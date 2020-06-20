import { container } from "tsyringe";
import { IServerConfig, serverConfig } from "./serverConfig";
import { WsMessageService } from "./websocket";
import { TYPES } from "./dependencyInjection";
import { UserProfilePool, GroupProfilePool } from "./cachingService";
import { LoginService } from "./loginService";
import { ChatMessageService, MessageListService } from "./messageService";

container.register<IServerConfig>(TYPES.ServerConfig, {
  useValue: serverConfig,
});
container.register<WsMessageService>(TYPES.WsMessageService, {
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

export default "registered";
