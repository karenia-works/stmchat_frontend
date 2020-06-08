import { Subject, BehaviorSubject, Observable } from "rxjs";
import { ServerChatMessage, ServerChatMsg } from "@/types/types";
import { WsMessageService } from "./websocket";
import { TYPES } from "./dependencyInjection";
import { singleton } from "tsyringe";

@singleton()
export class ChatMessageService {
  public constructor(private wss: WsMessageService) {
    var chatSubject = wss.chatMessageSubject;
    chatSubject.subscribe({
      next: this.onNextMessage,
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
}
