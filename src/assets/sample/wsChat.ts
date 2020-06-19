import { ServerChatMsg, ServerChatMessage } from "@/types/types";

export const ChatMsgs: ServerChatMsg[] = [
  {
    _t: "text",
    id: "12340",
    sender: "li",
    time: "" + new Date(),
    text:
      "hello hello hello hello hello hello hello hello hello hello hello hello hello hello ",
  },
  {
    _t: "file",
    id: "12341",
    sender: "wang",
    time: "" + new Date(),
    file:
      "https://karenia-space-nano.sfo2.digitaloceanspaces.com/att/%E7%94%B5%E8%B7%AF%E5%88%86%E6%9E%90%E7%AC%AC1%E7%AB%A0%EF%BC%88%E7%94%B5%E8%B7%AF%E6%A8%A1%E5%9E%8B%E3%80%81%E7%94%B5%E8%B7%AF%E5%AE%9A%E5%BE%8B%EF%BC%8920_01E2A9JWW2RQQ060M93MVSJQ0C.pdf",
    filename: "电路分析第1章（电路模型、电路定律）20.pdf",
    caption: "here is a file",
    size: 1936990,
  },
  {
    _t: "image",
    id: "12342",
    sender: "li",
    time: "" + new Date(),
    image:
      "https://img11.360buyimg.com/n1/jfs/t14497/67/1017638125/136874/65c4ecc3/5a422c37N1b36f52c.jpg",
    caption: "gugugu",
  },
  {
    _t: "text",
    id: "12343",
    sender: "li",
    time: "" + new Date(),
    replyTo: {
      _t: "text",
      id: "12340",
      sender: "li",
      time: "" + new Date(),
      text:
        "hello hello hello hello hello hello hello hello hello hello hello hello hello hello ",
    },
    text: "hello",
  },
  {
    _t: "text",
    id: "12344",
    sender: "li",
    time: "" + new Date(),
    replyTo: {
      _t: "image",
      id: "12342",
      sender: "li",
      time: "" + new Date(),
      image:
        "https://img11.360buyimg.com/n1/jfs/t14497/67/1017638125/136874/65c4ecc3/5a422c37N1b36f52c.jpg",
      caption: "gugugu",
    },
    text: "hello",
  },
  {
    _t: "text",
    id: "12345",
    sender: "li",
    time: "" + new Date(),
    forwardFrom: {
      userId: "wang",
      username: "wang",
      chatId: "wang+li",
      msgId: "12340",
    },
    text: "hello",
  },
];
