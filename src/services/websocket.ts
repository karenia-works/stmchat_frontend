import { Message, ChatMessage } from "../types/types";
import "rxjs";
import { Subject } from "rxjs";

export class WsMessageService {
  public constructor(private dest: string) {
    this.msg = new Subject();
    this.chat_msg = new Subject();
    this.connection_state = new Subject();
    this.errors = new Subject();
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
  readonly msg: Subject<Message>;
  readonly chat_msg: Subject<ChatMessage>;
  readonly connection_state: Subject<boolean>;
  readonly errors: Subject<Error>;

  public get messageSubject() {
    return this.msg;
  }
  public get chatMessageSubject() {
    return this.chat_msg;
  }
  public get connectionState(): Subject<boolean> {
    return this.connectionState;
  }

  public sendMessage(msg: Message) {
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
