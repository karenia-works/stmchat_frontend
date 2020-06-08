import {
  ServerMessage,
  ServerChatMessage,
  ClientMessage,
  ServerUnreadCountMessage,
  ServerOnlineStatusMessage,
} from "../types/types";
import "rxjs";
import { Subject } from "rxjs";
import { singleton, inject } from "tsyringe";
import { IServerConfig } from "./serverConfig";

@singleton()
export class WsMessageService {
  public constructor(@inject("server_config") serverConfig: IServerConfig) {
    this.dest = serverConfig.wsEndpoint;
    this.connectWebsocket(this.dest);
  }

  private dest: string;

  protected connectWebsocket(dest: string) {
    let self = this;
    this.ws_connection = new WebSocket(dest);
    this.ws_connection.onopen = function(ev) {
      self.onWebsocketOpen(this, ev);
    };
    this.ws_connection.onclose = function(ev) {
      self.onWebsocketClose(this, ev);
    };
    this.ws_connection.onmessage = function(ev) {
      self.onWebsocketMessage(this, ev);
    };
    this.ws_connection.onerror = function(ev) {
      self.onWebsocketError(this, ev);
    };
  }

  ws_connection!: WebSocket;
  private readonly msg: Subject<ServerMessage> = new Subject();
  private readonly chat_msg: Subject<ServerChatMessage> = new Subject();
  private readonly unread_count_msg: Subject<
    ServerUnreadCountMessage
  > = new Subject();
  private readonly user_online_state: Subject<
    ServerOnlineStatusMessage
  > = new Subject();
  private readonly errors: Subject<Error> = new Subject();

  private readonly connection_state: Subject<boolean> = new Subject();

  /** 所有消息 */
  public get messageSubject() {
    return this.msg;
  }

  /** 聊天消息 */
  public get chatMessageSubject() {
    return this.chat_msg;
  }

  /** websocket 连接情况 */
  public get connectionState(): Subject<boolean> {
    return this.connection_state;
  }

  /** 未读消息数目 */
  public get unreadMessageCount(): Subject<ServerUnreadCountMessage> {
    return this.unread_count_msg;
  }

  /** 其他用户在线状态 */
  public get userOnlineState(): Subject<ServerOnlineStatusMessage> {
    return this.user_online_state;
  }

  /** 发送消息 */
  public sendMessage(msg: ClientMessage) {
    this.ws_connection.send(JSON.stringify(msg));
  }

  protected onWebsocketOpen(ws: WebSocket, err: Event) {
    this.connection_state.next(true);
  }

  protected onWebsocketClose(ws: WebSocket, err: CloseEvent) {
    this.connection_state.next(false);
    console.warn("Disconnected from websocket", ws.url);
    this.connectWebsocket(this.dest);
  }

  protected onWebsocketMessage(ws: WebSocket, ev: MessageEvent) {
    try {
      let raw_msg = ev.data;
      let msg = JSON.parse(raw_msg) as ServerMessage;
      this.msg.next(msg);
      switch (msg._t) {
        case "chat":
          this.chat_msg.next(msg as ServerChatMessage);
          break;
        case "unread":
          this.unread_count_msg.next(msg as ServerUnreadCountMessage);
          break;
        case "online_status":
          this.user_online_state.next(msg as ServerOnlineStatusMessage);
          break;
        default:
          throw new Error(`Unknown Message type ${msg._t}`);
      }
    } catch (e) {
      this.msg.error(e);
      this.errors.next(e);
    }
  }

  protected onWebsocketError(_ws: WebSocket, err: Event) {
    this.connection_state.next(false);
    this.chat_msg.error(err);
    console.error("Failed to connect to websocket", _ws.url);
    this.connectWebsocket(this.dest);
  }
}
