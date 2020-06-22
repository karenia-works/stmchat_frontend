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
const TYPES = {
  WsMessageService: "ws_message_service",
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
