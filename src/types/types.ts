/** 聊天消息 */
export interface ChatMsg {
  /** 消息类型 */
  _t: "text" | "image" | "file";
  id: string;
  sender: string;
  time: string;
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
  _t: "image";
  file: string;
  filename: string;
  caption?: string;
}

/** WebSocket 中传递的消息 */
export interface Message {
  /** 消息类型 */
  _t: "chat";
  [propName: string]: any;
}

export interface ChatMessage extends Message {
  _t: "chat";
  from: string;
  msg: ChatMsg;
}

export interface User {}

let a: TextChatMsg = {
  _t: "text",
  id: "0066778899aa",
  sender: "001122334455",
  time: "2020-02-01T17:22Z",
  text: "MyText",
};

let my_msg: ChatMessage = {
  _t: "chat",
  from: "abcdef123456",
  msg: a,
};
