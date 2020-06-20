/** 聊天消息，和在数据库中储存的是相同类型 */
export interface ServerChatMsg {
  /** 消息类型 */
  _t: "text" | "image" | "file";
  id: string;
  sender: string;
  time: string;

  /** 转发信息 */
  forwardFrom?: ForwardProperty;
  /** 回复信息 */
  replyTo?: ServerChatMsg;

  [propName: string]: any;
}

/** 文字信息 */
export interface TextChatMsg extends ServerChatMsg {
  _t: "text";
  text: string;
}

/** 图片信息 */
export interface ImageChatMsg extends ServerChatMsg {
  _t: "image";
  /** 图片链接或者 ID，未确定 */
  image: string;
  /** 图片 */
  caption?: string;
}

export interface FileChatMsg extends ServerChatMsg {
  _t: "file";
  /** 文件链接或者 ID，未确定 */
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
export interface ServerMessage {
  /** 消息类型 */
  _t: "chat" | "unread" | "online_status";
  [propName: string]: any;
}

export interface ServerChatMessage extends ServerMessage {
  _t: "chat";
  chatId: string;
  msg: ServerChatMsg;
}

export interface ServerUnreadCountMessage extends ServerMessage {
  _t: "unread";
  /** 未读信息：<聊天名称, 未读数> */
  items: Map<string, UnreadProperty>;
}

export interface UnreadProperty {
  count: number;
  maxMsgId: number;
}

export interface ServerOnlineStatusMessage extends ServerMessage {
  _t: "online_status";
  userId: string;
  online: boolean;
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
  nickname?: string;
  avatarUrl?: string;
  friends: string[];
  groups: string[];
  state: boolean;
  // desktopNotifications: boolean;
  // backgroundNotification: boolean;
  // soundOn: boolean;
  // soundDegree: number;
  // hotkey: "enterNewline" | "enterSend";
}

// export interface GroupProfile {
//   id: string;
//   name: string;
//   desc: string;
//   avatarUrl: string;
//   members: string[];
// }

export interface GroupProfile {
  id: string;
  name: string;
  isFriend: boolean;
  avatarUrl?: string;
  owner: string;
  describe?: string;
  members: string[];
  chatlog: string;
}

let a: TextChatMsg = {
  _t: "text",
  id: "0066778899aa",
  sender: "001122334455",
  time: "2020-02-01T17:22Z",
  text: "MyText",
};

let my_msg: ServerChatMessage = {
  _t: "chat",
  chatId: "abcdef123456",
  msg: a,
};
