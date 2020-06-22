import { container } from "tsyringe";
import { IServerConfig, serverConfig } from "./serverConfig";
import { WsMessageService } from "./websocket";
import { TYPES } from "./dependencyInjection";
import { UserProfilePool, GroupProfilePool } from "./cachingService";
import { LoginService } from "./loginService";
import { ChatMessageService, MessageListService } from "./messageService";

var registered = false;
function registerAll() {
  if (registered) return;
  registered = true;
  container.register<IServerConfig>(TYPES.ServerConfig, {
    useValue: serverConfig,
  });
  container.register<WsMessageService>(TYPES.WsMessageService, {
    useToken: WsMessageService,
  });

  container.register<UserProfilePool>(TYPES.UserProfilePool, {
    useToken: UserProfilePool,
  });

  container.register<GroupProfilePool>(TYPES.GroupProfilePool, {
    useToken: GroupProfilePool,
  });

  container.register(TYPES.types, { useValue: TYPES });
  // container.register<ProfilePool<GroupProfile>>(GroupProfilePool, {
  //   useToken: GroupProfilePool,
  // });
  // container.register<ProfilePool<GroupProfile>>(GroupProfilePool, {
  //   useToken: GroupProfilePool,
  // });

  container.register<ChatMessageService>(TYPES.ChatMessageService, {
    useToken: ChatMessageService,
  });
  container.register<MessageListService>(TYPES.MessageListService, {
    useToken: MessageListService,
  });
}

export default registerAll;
