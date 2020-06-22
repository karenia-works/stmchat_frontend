import { Subject, BehaviorSubject, Observable } from "rxjs";
import {
  ServerChatMessage,
  ServerChatMsg,
  ServerUnreadCountMessage,
  GroupProfile,
  ClientChatMessage,
  ClientChatMsg,
} from "@/types/types";
import { WsMessageService } from "./websocket";
import { TYPES } from "./dependencyInjection";
import { singleton } from "tsyringe";
import moment from "moment";
import { GroupProfilePool } from "./cachingService";

@singleton()
export class ChatMessageService {
  public constructor(private wss: WsMessageService) {
    var chatSubject = wss.chatMessageSubject;
    chatSubject.subscribe({
      next: msg => this.onNextMessage(msg),
    });
  }

  private subjects: Map<string, BehaviorSubject<ServerChatMsg[]>> = new Map();

  private onNextMessage(msg: ServerChatMessage) {
    this.createOrModifyMsgList(msg.chatId, arr => {
      arr.push(msg.msg);
    });
  }

  public createOrModifyMsgList(
    chatId: string,
    mod: (array: ServerChatMsg[]) => void,
  ) {
    var observer = this.subjects.get(chatId);
    if (observer !== undefined) {
      let val = observer.getValue();
      mod(val);
      observer.next(val);
    } else {
      const subject = new BehaviorSubject<ServerChatMsg[]>([]);
      this.subjects.set(chatId, subject);
    }
  }

  public getObservable(chatId: string): Observable<ServerChatMsg[]> {
    if (!this.subjects.has(chatId)) {
      const subject = new BehaviorSubject<ServerChatMsg[]>([]);
      this.subjects.set(chatId, subject);
      return subject;
    } else {
      return this.subjects.get(chatId)!;
    }
  }

  public prependMessages(chatId: string, messages: ServerChatMsg[]) {
    this.createOrModifyMsgList(chatId, arr => {
      arr.splice(0, 0, ...messages);
    });
  }

  public async sendMessage(msg: ClientChatMsg, chatId: string) {
    let clientMsg: ClientChatMessage = {
      _t: "chat",
      msg: msg,
      chatId: chatId,
    };
    this.wss.sendMessage(clientMsg);
  }
}

export interface MessageListItem {
  chat: GroupProfile;
  latestMessage: ServerChatMsg | undefined;
  lastTimestamp: number;
  unreadCount: number;
}

@singleton()
/**
 * 消息列表服务，订阅 `messageListSubject` 获得消息列表的所有更新
 */
export class MessageListService {
  public constructor(
    private wss: WsMessageService,
    private groupProfileService: GroupProfilePool,
  ) {
    console.log("MessageListService constructed");
    wss.chatMessageSubject.subscribe({
      next: val => this.onNewChatMessage(val).then(),
    });
    wss.unreadMessageCount.subscribe({
      next: val => this.onNewUnreadCountUpdate(val).then(),
    });
  }

  private messageMap = new Map<string, MessageListItem>();
  private _messageListSubject = new BehaviorSubject<MessageListItem[]>([]);
  private _messageList: MessageListItem[] | undefined;

  public get messageList(): MessageListItem[] {
    if (this._messageList !== undefined) {
      return this._messageList;
    } else {
      return [...this.messageMap.values()].sort((a, b) => {
        return a.lastTimestamp - b.lastTimestamp;
      });
    }
  }

  public get messageListSubject(): Observable<MessageListItem[]> {
    return this._messageListSubject;
  }

  private messageMapChanged() {
    // invalidate data
    this._messageList = undefined;
    this._messageListSubject.next(this.messageList);
  }

  private async onNewChatMessage(msg: ServerChatMessage) {
    console.log("OnNewChatMessage", msg);
    let item = this.messageMap.get(msg.chatId);
    if (item === undefined) {
      let chatProfile = await this.groupProfileService.getData(msg.chatId);
      if (chatProfile === undefined) {
        throw new Error("Cannot find chat profile!");
      }
      this.messageMap.set(msg.chatId, {
        chat: chatProfile,
        latestMessage: msg.msg,
        lastTimestamp: moment(msg.msg.time).unix(),
        unreadCount: 0,
      });
    } else {
      let time = moment(msg.msg.time).unix();
      if (time > item.lastTimestamp) {
        item.latestMessage = msg.msg;
        item.lastTimestamp = time;
        item.unreadCount += 1;
      }
    }
    this.messageMapChanged();
  }

  public setUnreadCount(id: string, count: number) {
    let item = this.messageMap.get(id);
    if (item === undefined) {
      throw new Error(`ChatID does not exist: ${id}`);
    } else {
      item.unreadCount = count;
    }
    this.messageMapChanged();
  }

  private async onNewUnreadCountUpdate(msg: ServerUnreadCountMessage) {
    for (let [id, unreadProp] of msg.items.entries()) {
      let item = this.messageMap.get(id);
      if (item === undefined) {
        let chatProfile = await this.groupProfileService.getData(id);
        if (chatProfile === undefined) {
          throw new Error("Cannot find chat profile!");
        }
        this.messageMap.set(msg.chatId, {
          chat: chatProfile,
          latestMessage: undefined,
          lastTimestamp: moment().unix(),
          unreadCount: unreadProp.count,
        });
      } else {
        item.unreadCount = unreadProp.count;
      }
    }
    this.messageMapChanged();
  }

  public async sendMessage(msg: ClientChatMsg, chatId: string) {
    let clientMsg: ClientChatMessage = {
      _t: "chat",
      msg: msg,
      chatId: chatId,
    };
    this.wss.sendMessage(clientMsg);
  }
}
