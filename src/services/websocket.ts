import {
  Message,
  ChatMessage,
  ClientMessage,
  UnreadCountMessage,
} from "../types/types";
import "rxjs";
import { Subject } from "rxjs";

export class WsMessageService {
  public constructor(private dest: string) {
    this.connectWebsocket(dest);
  }

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
  readonly msg: Subject<Message> = new Subject();
  readonly chat_msg: Subject<ChatMessage> = new Subject();
  readonly unread_count_msg: Subject<UnreadCountMessage> = new Subject();
  readonly connection_state: Subject<boolean> = new Subject();
  readonly errors: Subject<Error> = new Subject();

  public get messageSubject() {
    return this.msg;
  }
  public get chatMessageSubject() {
    return this.chat_msg;
  }
  public get connectionState(): Subject<boolean> {
    return this.connection_state;
  }
  public get unreadMessageCount(): Subject<UnreadCountMessage> {
    return this.unread_count_msg;
  }

  public sendMessage(msg: ClientMessage) {
    this.ws_connection.send(JSON.stringify(msg));
  }

  protected onWebsocketOpen(ws: WebSocket, err: Event) {
    this.connection_state.next(true);
  }

  protected onWebsocketClose(ws: WebSocket, err: CloseEvent) {
    this.connection_state.next(false);
    this.connectWebsocket(this.dest);
  }

  protected onWebsocketMessage(ws: WebSocket, ev: MessageEvent) {
    try {
      let raw_msg = ev.data;
      let msg = JSON.parse(raw_msg) as Message;
      this.msg.next(msg);
      switch (msg._t) {
        case "chat":
          this.chat_msg.next(msg as ChatMessage);
          break;
        case "unread":
          this.unread_count_msg.next(msg as UnreadCountMessage);
          break;
        default:
          throw new Error(`Unknown Message type ${msg._t}`);
      }
    } catch (e) {
      this.chat_msg.error(e);
      this.errors.next(e);
    }
  }

  protected onWebsocketError(ws: WebSocket, err: Event) {
    this.connection_state.next(false);
    this.chat_msg.error(err);

    this.connectWebsocket(this.dest);
  }
}
