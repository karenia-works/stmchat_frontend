import {
  ServerMessage,
  ServerChatMessage,
  ClientMessage,
  ServerUnreadCountMessage,
  ServerOnlineStatusMessage,
} from "../types/types";
import "rxjs";
import { Subject, BehaviorSubject } from "rxjs";
import { singleton, inject } from "tsyringe";
import { IServerConfig } from "./serverConfig";
import { TYPES } from "./dependencyInjection";
import { LoginService } from "./loginService";

@singleton()
export class WsMessageService {
  public constructor(
    @inject(TYPES.ServerConfig) serverConfig: IServerConfig,
    private loginService: LoginService,
  ) {
    // console.trace("WsMessageService constructed");
    this.dest = serverConfig.wsEndpoint;

    // DEBUG: 如果设置里提出了要强制链接就强制链接
    if (serverConfig.debug?.wsEndpointOverride) {
      this.dest = serverConfig.debug.wsEndpointOverride;
      this.connectWebsocket();
    } else {
      let state = loginService.loginState;
      state.subscribe({
        next: val => {
          if (val) {
            this.dest = serverConfig.wsEndpoint.replace(
              "{name}",
              loginService.loginState.getUsername()!,
            );
            this.connectWebsocket();
          } else {
            this.disconnectWebsocket();
          }
        },
      });
    }
  }

  private dest: string;

  protected connectWebsocket() {
    console.log("Connecting to websocket", this.dest);
    this.forceDisconnect = false;
    this.ws_connection = new WebSocket(this.dest);
    this.ws_connection.onopen = ev => {
      this.ws_connection!.onclose = ev => this.onWebsocketClose(ev);
      this.onWebsocketOpen(ev);
    };
    this.ws_connection.onmessage = ev => this.onWebsocketMessage(ev);
    this.ws_connection.onerror = ev => this.onWebsocketError(ev);
  }

  protected disconnectWebsocket() {
    this.forceDisconnect = true;
    this.ws_connection?.close();
  }

  private ws_connection: WebSocket | undefined;
  private pendingMessages: ClientMessage[] = [];
  private forceDisconnect: boolean = false;

  private readonly msg: Subject<ServerMessage> = new Subject();
  private readonly chat_msg: Subject<ServerChatMessage> = new Subject();
  private readonly unread_count_msg: Subject<
    ServerUnreadCountMessage
  > = new Subject();
  private readonly user_online_state: Subject<
    ServerOnlineStatusMessage
  > = new Subject();
  private readonly errors: Subject<Error> = new Subject();

  private readonly connection_state: BehaviorSubject<
    boolean
  > = new BehaviorSubject(false as boolean);

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
    if (this.connection_state.value === false) {
      this.pendingMessages.push(msg);
    } else {
      this.ws_connection?.send(JSON.stringify(msg));
    }
  }

  protected onWebsocketOpen(err: Event) {
    console.trace("Connected to websocket");
    this.connection_state.next(true);

    // Send all pending messages
  }

  protected onWebsocketClose(err: CloseEvent) {
    console.log("Disconnected from websocket", this.ws_connection?.url);
    this.connection_state.next(false);
    this.errors.next(new Error("Websocket disconnected: " + err));
    if (!this.forceDisconnect) this.reconnectWebsocket();
  }

  protected onWebsocketMessage(ev: MessageEvent) {
    this.wait_time = 500;
    try {
      let raw_msg = ev.data;
      // console.log("Websocket: got", raw_msg);
      let msg = JSON.parse(raw_msg, (k, v) => {
        if (k == "_t" && typeof v === "string" && v.endsWith("_s")) {
          return v.substr(0, v.length - 2);
        } else {
          return v;
        }
      }) as ServerMessage;
      this.msg.next(msg);
      // console.log("ws: got", msg);
      switch (msg._t) {
        case "chat":
          this.chat_msg.next(msg as ServerChatMessage);
          break;
        case "unread":
          this.onNewUnreadMsg(msg);
          break;
        case "online_status":
          this.user_online_state.next(msg as ServerOnlineStatusMessage);
          break;
      }
      this.msg.next(msg);
    } catch (e) {
      console.warn(e);
      this.errors.next(e);
    }
  }

  private onNewUnreadMsg(msg: ServerMessage) {
    // console.trace("unread start");
    let msg_1 = msg as ServerUnreadCountMessage;
    let orig: any = msg_1.items;
    msg_1.items = new Map();
    Object.keys(orig).forEach(k => {
      msg_1.items.set(k, orig[k]);
    });
    this.unread_count_msg.next(msg_1);
    // console.trace("unread end");
  }

  protected onWebsocketError(err: Event) {
    this.connection_state.next(false);
    this.errors.next(new Error("Websocket disconnected in error: " + err));
    console.error(
      "Failed to connect to websocket",
      this.ws_connection?.url,
      err,
    );
    // this.reconnectWebsocket(this.dest);
  }

  protected reconnectWebsocket() {
    const max_wait_time = 32000;
    console.warn(
      `Reconnecting to websocket. Retrying in ${this.wait_time / 1000}s`,
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
