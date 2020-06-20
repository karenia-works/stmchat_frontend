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
import { TYPES } from "./dependencyInjection";

@singleton()
export class WsMessageService {
  public constructor(@inject(TYPES.ServerConfig) serverConfig: IServerConfig) {
    this.dest = serverConfig.wsEndpoint;
    this.connectWebsocket();
  }

  private dest: string;

  protected connectWebsocket() {
    console.log("Connecting to websocket", this.dest);
    this.ws_connection = new WebSocket(this.dest);
    this.ws_connection.onopen = ev => this.onWebsocketOpen(ev);
    this.ws_connection.onclose = ev => this.onWebsocketClose(ev);
    this.ws_connection.onmessage = ev => this.onWebsocketMessage(ev);
    this.ws_connection.onerror = ev => this.onWebsocketError(ev);
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

  private wait_time: number = 500;

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

  protected onWebsocketOpen(err: Event) {
    this.connection_state.next(true);
    this.wait_time = 500;
    console.log("Connected to websocket");
  }

  protected onWebsocketClose(err: CloseEvent) {
    this.connection_state.next(false);
    console.warn("Disconnected from websocket", this.ws_connection.url);
    this.reconnectWebsocket();
  }

  protected onWebsocketMessage(ev: MessageEvent) {
    try {
      let raw_msg = ev.data;
      let msg = JSON.parse(raw_msg, (k, v) => {
        if (k == "_t" && v instanceof String && v.endsWith("_s")) {
          return v.substr(0, v.length - 2);
        } else {
          return v;
        }
      }) as ServerMessage;
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

  protected onWebsocketError(err: Event) {
    this.connection_state.next(false);
    this.chat_msg.error(err);
    console.error(
      "Failed to connect to websocket",
      this.ws_connection.url,
      err,
    );
    // this.reconnectWebsocket(this.dest);
  }

  protected reconnectWebsocket() {
    const max_wait_time = 32000;
    console.warn(
      `Cannot connect to websocket. Retrying in ${this.wait_time / 1000}s`,
    );
    setTimeout(() => {
      this.connectWebsocket();
    }, this.wait_time);
    if (this.wait_time < max_wait_time) {
      this.wait_time = Math.min(this.wait_time * 2, max_wait_time);
    } else {
      this.wait_time = max_wait_time;
    }
  }
}
