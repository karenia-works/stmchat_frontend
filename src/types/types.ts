/** 聊天消息 */
export interface ChatMsg {
  /** 消息类型 */
  _t: "text" | "image" | "file";
  id: string;
  sender: string;
  time: string;

  /** 转发信息 */
  forwardFrom?: ForwardProperty;
  /** 回复信息 */
  replyTo?: ChatMsg;

  [propName: string]: any;
}

export interface TextChatMsg extends ChatMsg {
  _t: "text";
  text: string;
}

export interface ImageChatMsg extends ChatMsg {
  _t: "image";
  image: string;
  caption?: string;
}

export interface FileChatMsg extends ChatMsg {
  _t: "file";
  file: string;
  filename: string;
  caption?: string;
  size: number;
}

export interface ForwardProperty {
  userId: string;
  username: string;
  chatId: string;
  msgId: string;
}

export interface ClientChatMsg {
  _t: "text" | "image" | "file" | "forward";
  /** 回复给聊天内的消息 ID */
  replyTo?: string;
  [propName: string]: any;
}

export interface ClientTextChatMsg extends ClientChatMsg {
  _t: "text";
  text: string;
}

export interface ClientImageChatMsg extends ClientChatMsg {
  _t: "image";
  image: string;
  caption?: string;
}

export interface ClientFileChatMsg extends ClientChatMsg {
  _t: "file";
  file: string;
  filename: string;
  caption?: string;
  size: number;
}

export interface ClientForwardMsg extends ClientChatMsg {
  _t: "forward";
  fromChatId: string;
  fromMessageId: string;
}

/** WebSocket 中传递的消息 */
export interface Message {
  /** 消息类型 */
  _t: "chat" | "unread";
  [propName: string]: any;
}

export interface ChatMessage extends Message {
  _t: "chat";
  chatId: string;
  msg: ChatMsg;
}

export interface UnreadCountMessage extends Message {
  _t: "unread";
  /** 未读信息：<聊天名称, 未读数> */
  items: Map<string, number>;
}

export interface ClientMessage {
  _t: "chat" | "read_position";
  [propName: string]: any;
}

export interface ClientChatMessage extends ClientMessage {
  _t: "chat";
  chatId: string;
  msg: ClientChatMsg;
}

export interface ClientReadPositionMessage extends ClientMessage {
  _t: "read_position";
  chatId: string;
  msgId: string;
}

export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  avatarUrl: string;
  friends: string[];
  groups: string[];
}

export interface GroupProfile {
  id: string;
  name: string;
  desc: string;
  members: string[];
}

let a: TextChatMsg = {
  _t: "text",
  id: "0066778899aa",
  sender: "001122334455",
  time: "2020-02-01T17:22Z",
  text: "MyText",
};

let my_msg: ChatMessage = {
  _t: "chat",
  chatId: "abcdef123456",
  msg: a,
};
