import { Subject } from "rxjs";
import { ServerChatMessage } from "@/types/types";

export class ChatMessageService {
  public constructor(private chatMessageSubject: Subject<ServerChatMessage>) {}
}
