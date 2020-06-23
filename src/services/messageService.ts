import { Subject, BehaviorSubject, Observable } from "rxjs";
import {
  ServerChatMessage,
  ServerChatMsg,
  ServerUnreadCountMessage,
  GroupProfile,
  ClientChatMessage,
  ClientChatMsg,
  ClientReadPositionMessage,
} from "@/types/types";
import { WsMessageService } from "./websocket";
import { TYPES } from "./dependencyInjection";
import { singleton, inject } from "tsyringe";
import moment from "moment";
import { GroupProfilePool, UserProfilePool } from "./cachingService";
import { IServerConfig } from "./serverConfig";
import { set } from "vue/types/umd";
import Axios from "axios";
import { LoginService } from "./loginService";

@singleton()
export class ChatMessageService {
  public constructor(
    @inject(TYPES.ServerConfig) private serverConfig: IServerConfig,
    private wss: WsMessageService,
  ) {
    var chatSubject = wss.chatMessageSubject;
    chatSubject.subscribe({
      next: msg => this.onNextMessage(msg),
    });
  }

  /** 在当前查看的不是最新消息的时候储存最新消息 */
  private secondaryMessageStorage: Map<string, ServerChatMsg[]> = new Map();
  private subjects: Map<string, BehaviorSubject<ServerChatMsg[]>> = new Map();

  private onNextMessage(msg: ServerChatMessage) {
    if (this.secondaryMessageStorage.has(msg.chatId)) {
      let msgStorage = this.secondaryMessageStorage.get(msg.chatId);
      msgStorage!.push(msg.msg);
    } else {
      this.createOrModifyMsgList(msg.chatId, arr => {
        arr.push(msg.msg);
        return arr;
      });
    }
  }

  public createOrModifyMsgList(
    chatId: string,
    mod: (array: ServerChatMsg[]) => ServerChatMsg[],
  ) {
    var observer = this.subjects.get(chatId);
    if (observer !== undefined) {
      let val = observer.getValue();

      observer.next(mod(val));
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
      console.log(messages);
      arr.splice(0, 0, ...messages);
      return arr;
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

  public async fetchMessages(
    chatId: string,
    startId: string,
    limit: number,
    reverse: boolean,
  ): Promise<ServerChatMsg[]> {
    return (
      await Axios.get<ServerChatMsg[]>(
        this.serverConfig.apiBaseUrl +
          this.serverConfig.apiEndpoints.chat.messages,
        {
          params: {
            groupName: chatId,
            start_id: startId,
            limit: limit,
            reverse: reverse,
          },
          transformResponse: [
            resp =>
              JSON.parse(resp, (k, v) => {
                if (k == "_t" && typeof v == "string" && v.endsWith("_s"))
                  return v.slice(0, v.length - 2);
                else return v;
              }),
            resp => {
              console.log(resp);
              return resp.map((x: any) => x.msg);
            },
          ],
        },
      )
    ).data;
  }

  /**
   * 跳转到某条消息（或者最接近它的消息）的上下文。
   * 如果返回 false 则上下文与最新消息没有交集。
   */
  public async jumpToContextOfMessage(
    chatId: string,
    msgId: string,
  ): Promise<boolean> {
    if (this.subjects.has(chatId)) {
      // check primary storage has message
      let messages = this.subjects.get(chatId)!.value;

      let shouldCheckSecondary = true;
      // no primary message
      if (messages.length == 0) shouldCheckSecondary = true;
      else if (
        messages[0].id <= msgId &&
        messages[messages.length - 1].id >= msgId
      )
        // primary message contains target
        shouldCheckSecondary = false;

      if (shouldCheckSecondary) {
        // check secondary storage
        let shouldFetch = true;
        let secondaryMsgs = this.secondaryMessageStorage.get(chatId);
        if (secondaryMsgs !== undefined) {
          if (secondaryMsgs.length == 0) shouldFetch = true;
          else if (
            secondaryMsgs[0].id <= msgId &&
            secondaryMsgs[secondaryMsgs.length - 1].id >= msgId
          )
            shouldFetch = false;
        } else {
          shouldFetch = true;
        }

        if (shouldFetch) {
          // discard primary storage, fetch message
          let messages = await this.fetchMessages(chatId, msgId, 30, false);

          // if no secondary storage, put primary into seconday
          if (secondaryMsgs === undefined)
            this.secondaryMessageStorage.set(chatId, messages);

          this.createOrModifyMsgList(chatId, arr => {
            return messages;
          });

          return false;
        } else {
          // discard primary storage, return secondary storage
          this.secondaryMessageStorage.delete(chatId);
          this.createOrModifyMsgList(chatId, arr => {
            return secondaryMsgs!;
          });
          return false;
        }
      } else {
        // check primary storage
        return true;
      }
    } else {
      this.createOrModifyMsgList(chatId, v => v);
      return true;
    }
  }

  /**
   * 获取某个群当前消息之前一段时间的消息，如果到头了返回 false。
   *
   * 只会在没到头的时候更新消息列表。
   */
  public async fetchPreviousMessageOfGroup(chatId: string): Promise<boolean> {
    let chat = this.subjects.get(chatId)?.value;
    if (chat === undefined) {
      this.createOrModifyMsgList(chatId, v => v);
      return true;
    }
    let minMessageId = chat.length === 0 ? OBJECT_ID_MAX : chat[0].id;
    let previousMessages = await this.fetchMessages(
      chatId,
      minMessageId,
      30,
      true,
    );

    if (previousMessages.length == 0) return false;
    else {
      this.prependMessages(chatId, previousMessages);
      return true;
    }
  }

  /**
   * 获取某个群当前消息之后一段时间的消息，如果到头了返回 false
   */
  public async fetchNextMessageOfGroup(chatId: string): Promise<boolean> {
    let chat = this.subjects.get(chatId)?.value;
    if (chat === undefined) {
      this.createOrModifyMsgList(chatId, v => v);
      return true;
    }
    let minMessageId =
      chat.length === 0 ? OBJECT_ID_MIN : chat[chat.length - 1].id;

    let nextMessages = await this.fetchMessages(
      chatId,
      minMessageId,
      30,
      false,
    );

    if (nextMessages.length == 0) return false;

    // If secondary message exist and intersects with nextMessages
    let intersection = this.secondaryMessageStorage
      .get(chatId)
      ?.findIndex(msg => msg.id == nextMessages[nextMessages.length - 1].id);
    if (intersection !== undefined && intersection !== -1) {
      let secondary = this.secondaryMessageStorage.get(chatId)!;
      this.secondaryMessageStorage.delete(chatId);
      secondary.splice(0, intersection);
      this.createOrModifyMsgList(chatId, arr => {
        arr.push(...secondary);
        return arr;
      });
      return false;
    } else {
      this.createOrModifyMsgList(chatId, arr => {
        arr.push(...nextMessages);
        return arr;
      });
      return true;
    }
  }

  /** 返回聊天的底部上下文 */
  public returnToBottomOfChat(chatId: string): boolean {
    let secondary = this.secondaryMessageStorage.get(chatId);
    if (secondary !== undefined) {
      this.secondaryMessageStorage.delete(chatId);
      this.createOrModifyMsgList(chatId, arr => secondary!);
      return true;
    } else {
      return false;
    }
  }

  public sendReadPosition(chatId: string, msgId: string) {
    let msg: ClientReadPositionMessage = {
      _t: "read_position",
      chatId,
      msgId,
    };
    this.wss.sendMessage(msg);
  }
}

const OBJECT_ID_MAX = "f".repeat(24);
const OBJECT_ID_MIN = "0".repeat(24);

export interface MessageListItem {
  chat: GroupProfile;
  latestMessage: ServerChatMsg | undefined;
  avatar: string | undefined;
  lastTimestamp: number;
  unreadCount: number;
}

@singleton()
/**
 * 消息列表服务，订阅 `messageListSubject` 获得消息列表的所有更新
 */
export class MessageListService {
  public constructor(
    private loginService: LoginService,
    private wss: WsMessageService,
    private groupProfileService: GroupProfilePool,
    private userProfilePool: UserProfilePool,
  ) {
    wss.chatMessageSubject.subscribe({
      next: val => this.onNewChatMessage(val),
    });
    wss.unreadMessageCount.subscribe({
      next: val => this.onNewUnreadCountUpdate(val),
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

  private async getAvatar(chatInfo: GroupProfile): Promise<string | undefined> {
    if (chatInfo.isFriend) {
      let myUsername = this.loginService.loginState.getUsername();
      let otherUsername =
        myUsername === undefined
          ? chatInfo.members[0]
          : myUsername === chatInfo.members[0]
          ? chatInfo.members[1]
          : chatInfo.members[0];
      return (await this.userProfilePool.getData(otherUsername))?.avatarUrl;
    } else {
      return chatInfo.avatarUrl;
    }
  }

  private async onNewChatMessage(msg: ServerChatMessage) {
    let item = this.messageMap.get(msg.chatId);
    if (item === undefined) {
      let chatProfile = await this.groupProfileService.getData(msg.chatId);
      if (chatProfile === undefined) {
        throw new Error("Cannot find chat profile!");
      }
      let avatar = await this.getAvatar(chatProfile);
      this.messageMap.set(msg.chatId, {
        chat: chatProfile,
        latestMessage: msg.msg,
        avatar,
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
    for (let [id, unreadProp] of msg.items) {
      let item = this.messageMap.get(id);
      if (item === undefined) {
        let chatProfile = await this.groupProfileService.getData(msg.chatId);
        if (chatProfile === undefined) {
          throw new Error("Cannot find chat profile!");
        }
        let avatar = await this.getAvatar(chatProfile);
        this.messageMap.set(msg.chatId, {
          chat: chatProfile,
          latestMessage: undefined,
          avatar,
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
