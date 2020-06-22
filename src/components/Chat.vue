<template>
  <div class="chat" @click="showMsgMenu = false">
    <template v-if="!chatinfo">
      <div class="non-chat chat-messages dark_deep_bg">
        <div class="notice dark_main_text">选择一个联系人或群聊开始聊天</div>
      </div>
    </template>
    <template v-else>
      <div class="chat-top-bar dark_main_text dark_light_bg">
        <template v-if="!MultiOn">
          <div class="chatinfo">
            <template v-if="chatinfo.isFriend">
              <span>{{ chatname }}</span>
              <span class="info online">online</span>
            </template>
            <template v-else>
              <span>{{ chatname }}</span>
              <span class="info">{{ chatinfo.members.length }} members</span>
            </template>
          </div>
        </template>

        <!-- 多选框功能栏 -->
        <template v-else>
          <div class="multi_row">
            <el-button
              type="primary"
              class="multi_button"
              @click="handleDelete"
            >
              删除
              <span class="multi_num">{{ checkedNumber }}</span>
            </el-button>
            <el-button
              type="primary"
              class="multi_button"
              @click="showForward = true"
            >
              转发
              <span class="multi_num">{{ checkedNumber }}</span>
            </el-button>
            <el-button class="multi_cancel" type="text" @click="CancelMulti"
              >取消</el-button
            >
          </div>
        </template>
        <!-- <div class="chatopt icon24">
        <i class="el-icon-more"></i>
        </div>-->
      </div>

      <div class="chat-messages dark_deep_bg">
        <!-- 置底按钮 -->
        <el-button
          type="primary"
          icon="el-icon-arrow-down"
          circle
          v-show="showGoDown"
          class="goBtn"
          @click="jumpToMessage(-1)"
        ></el-button>

        <vueScroll ref="chat-messages" @handle-scroll="handleScroll">
          <div v-for="msg in msgList" :key="msg.id">
            <!-- 多选框 -->
            <el-col :span="1" v-if="MultiOn">
              <el-checkbox
                @change="checked => checkMulti(checked, msg)"
              ></el-checkbox>
            </el-col>

            <div class="msg" :class="{ self: msg.sender == me.username }">
              <template v-if="showAvatar">
                <el-avatar
                  v-if="name2avatar[msg.sender]"
                  :src="name2avatar[msg.sender]"
                ></el-avatar>
                <el-avatar v-else>{{ msg.sender[0].toUpperCase() }}</el-avatar>
              </template>

              <Message
                :msg="msg"
                :showSender="showSender"
                @contextmenu.native.prevent="
                  () => {
                    if (!MultiOn) openMenu($event, msg);
                  }
                "
              ></Message>
            </div>
          </div>
        </vueScroll>
      </div>

      <div class="chat-bottom-bar dark_light_bg dark_main_text">
        <!-- 回复引用条 -->
        <div v-if="quoteMsg" class="quote-bar">
          <div class="quote">
            <el-image
              v-if="quoteMsg._t == 'image'"
              :src="quoteMsg.image"
            ></el-image>
            <div>
              <div class="sendername">{{ quoteMsg.sender }}</div>
              <div class="quote-text">
                <template v-if="quoteMsg._t == 'text'">{{
                  quoteMsg.text
                }}</template>
                <template v-else-if="quoteMsg._t == 'image'">
                  [图片]
                  <span v-if="quoteMsg.caption">, {{ quoteMsg.caption }}</span>
                </template>
                <template v-else-if="quoteMsg._t == 'file'">
                  {{ quoteMsg.filename }}
                  <span v-if="quoteMsg.caption">, {{ quoteMsg.caption }}</span>
                </template>
              </div>
            </div>
          </div>
          <i class="el-icon-close" @click="quoteMsg = null"></i>
        </div>

        <!-- 输入 -->
        <div class="input-bar">
          <div class="sendopt icon24">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :accept="uploadType == 'image' ? 'image/png, image/jpeg' : ''"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="handleUpload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
            >
              <i class="el-icon-paperclip" @click="uploadType = 'file'"></i>
              <i
                class="el-icon-picture-outline"
                @click="uploadType = 'image'"
              ></i>
            </el-upload>
          </div>
          <el-input
            type="textarea"
            :autosize="{ maxRows: 8 }"
            placeholder="请输入内容"
            v-model="sendMessage"
            resize="none"
            @keydown.native="enterInput"
          ></el-input>
          <div class="sendicon icon24" slot="reference">
            <div class="emptyWarning" :class="{ show: showEmptyWarning }">
              不能发送空消息
            </div>
            <i
              class="el-icon-s-promotion"
              :class="{ iconforbid: sendMessage.length == 0 }"
              @click="send()"
            ></i>
          </div>
        </div>

        <!-- upload dialog -->
        <el-dialog :visible="showUpload" width="40%" class="up-dialog">
          <div class="image-wrapper" v-if="uploadType == 'image'">
            <el-image :src="upUrl" fit="cover">
              <div slot="error" class="icon24">
                <i class="el-icon-loading"></i>
              </div>
            </el-image>
          </div>
          <div v-else-if="showUpload && uploadType == 'file'" class="file">
            <div class="file-icon icon24">
              <i class="el-icon-loading" v-if="uploading"></i>
              <i class="el-icon-document" v-else></i>
            </div>
            <div class="file-info">
              <div class="file-name">{{ fileInfo.name }}</div>
              <div class="info">{{ fileInfo.size | fileSize }}</div>
            </div>
          </div>

          <el-input
            placeholder="请输入内容"
            v-model="sendMessage"
            @keydown.native="enterInput"
          ></el-input>

          <span slot="footer" class="dialog-footer">
            <el-button
              @click="showUpload = false"
              type="text"
              style="margin-right: 10px;"
              >取消</el-button
            >
            <el-button type="primary" @click="send" :disabled="uploading"
              >发送</el-button
            >
          </span>
        </el-dialog>

        <!-- forward dialog -->
        <el-dialog
          title="转发消息"
          :visible.sync="showForward"
          width="50%"
          top="10vh"
          class="forward-dia"
          :append-to-body="true"
        >
          <user
            @selectUser="handleForward"
            :items="contacts"
            style="height: 300px;"
          />
        </el-dialog>
      </div>

      <!-- 右键菜单 -->
      <el-card
        v-if="menuMsg"
        class="msg-menu"
        :class="{ open: showMsgMenu }"
        :style="{ left: msgMenuPos.x + 'px', top: msgMenuPos.y + 'px' }"
        :body-style="{ padding: '0' }"
      >
        <div class="menu-item" @click="quoteMsg = menuMsg">回复</div>
        <div class="menu-item" @click="showForward = true">转发</div>
        <div class="menu-item" @click="MultiOn = true">多选</div>
        <div class="menu-item delete" @click="handleDelete">删除</div>
      </el-card>
    </template>
  </div>
</template>

<script lang="ts">
//// pass items into <user>
//// without chat info template
//todo: quote text / jump to message
// ? download file: in same site
// * 处理消息数据：格式和字段名；转发消息从对象中移出

import Vue from "vue";
// import axios from "axios";

import { serviceProvider, TYPES } from "../services/dependencyInjection";
import { WsMessageService } from "../services/websocket";
import { LoginService } from "../services/loginService";
import { FileUploader, getFileUri } from "../services/fileUploader";
import { UserProfilePool, GroupProfilePool } from "../services/cachingService";
import { ChatMessageService } from "../services/messageService";

import { ChatMsgs } from "../assets/sample/wsChat";
import Message from "./Message.vue";

import {
  ServerChatMsg,
  GroupProfile,
  UserProfile,
  ClientChatMsg,
} from "@/types/types";

export default Vue.extend({
  // props: {
  //   showSender: Boolean,
  //   showAvatar: Boolean,
  // },
  components: {
    Message,
  },
  watch: {
    messages(val) {
      let pos = this.chatPosition();
      if (pos == 1) this.jumpToMessage(-1);
      else this.messageProcess = pos;
    },
  },
  beforeMount: function() {
    try {
      this.getServices();
      // let loginService = serviceProvider.resolve<LoginService>(LoginService);
      // let state = loginService.loginState;
      // console.log("login state: ", state.getUsername());

      this.msgSub = this.chatMsgService.getObservable(this.chatId).subscribe({
        next: msg => {
          this.msgList = msg;
        },
      });

      this.getChatInfo();
      this.getProfile();
    } catch (err) {
      console.log(err);
    }
  },

  data() {
    return {
      //props
      chatId: "wang+li",

      // style config
      showSender: true,
      showAvatar: true,
      showGoDown: false,
      showEmptyWarning: false,
      showForward: false,
      messageProcess: 0,
      quoteMsg: null as ServerChatMsg | null,

      // chat messages
      // connector: null,
      msgSub: null,
      msgList: null as ServerChatMsg[] | null,
      list: ChatMsgs as ServerChatMsg[],
      sendMessage: "",

      // right click menu
      showMsgMenu: false,
      menuMsg: null as ServerChatMsg | null,
      msgMenuPos: {
        x: 0,
        y: 0,
      },

      //upload
      showUpload: false,
      uploadType: "image" as "image" | "file",
      upUrl: "",
      fileInfo: null as null | { name: string; size: number },
      uploading: false,

      // data cache
      me: null as UserProfile | null,
      chatinfo: null as GroupProfile | null,
      name2avatar: {} as { [propName: string]: string }[],
      contacts: [] as {
        username: string;
        avatarUrl: string;
        state?: boolean;
      }[],
      configs: {
        hotKey: "enterSend", //"enterNewline"
      },

      // multi select
      MultiOn: false,
      checkedMessage: [] as ServerChatMsg[],

      // services
      endpoint: " http://yuuna.srv.karenia.cc/api/v1",
      userProfilePool: null,
      groupProfilePool: null,
      chatMsgService: null as ChatMessageService,
      // loginService: null,
    };
  },
  methods: {
    getServices() {
      this.userProfilePool = serviceProvider.resolve<UserProfilePool>(
        UserProfilePool,
      );
      this.groupProfilePool = serviceProvider.resolve<GroupProfilePool>(
        GroupProfilePool,
      );
      this.chatMsgService = serviceProvider.resolve<ChatMessageService>(
        ChatMessageService,
      );
    },
    async send() {
      let msg: ClientChatMsg = { _t: "text" };

      if (this.quoteMsg) {
        msg.replyTo = this.quoteMsg.id;
        this.quoteMsg = null;
      }

      // file of image
      if (this.showUpload) {
        if (!this.upUrl) return; // throw error
        msg._t = this.uploadType;
        msg.caption = this.sendMessage;

        switch (this.uploadType) {
          case "image":
            msg.image = this.upUrl;
            break;
          case "file":
            msg.file = this.upUrl;
            msg.filename = this.fileInfo ? this.fileInfo.name : "";
            msg.size = this.fileInfo ? this.fileInfo.size : 0;
            break;
        }

        this.sendMessage = "";
        this.upUrl = "";
        this.fileInfo = null;
        this.showUpload = false;
      } else {
        // test msg
        if (this.sendMessage.length == 0) {
          this.showEmptyWarning = true;
          setTimeout(() => {
            this.showEmptyWarning = false;
          }, 1500);
          return;
        } else {
          msg.text = this.sendMessage;
          this.sendMessage = "";
        }
      }
      this.sendToClient(msg, this.chatId);
      await this.chatMsgService.sendMessage(msg, this.chatId);
      this.jumpToMessage(-1);
    },

    sendToClient(msg: ClientChatMsg, id: string) {
      // todo: convey private chatId
      console.log({
        chatId: id,
        msg: msg,
      });
    },

    // forward message
    handleForward(id: string) {
      this.$confirm("确认将信息转发给" + id + "？")
        .then(() => {
          // single forward
          if (!this.MultiOn) {
            if (this.menuMsg) {
              this.forwardMsg(this.menuMsg.id, id);
            } else {
              this.$message({
                type: "error",
                message: "转发失败",
              });
            }
            this.showForward = false;

            // multi forward
          } else {
            this.checkedMessage.forEach(msg => {
              this.forwardMsg(msg.id, id);
            });
            this.CancelMulti();
          }
        })
        .catch(() => {});
    },

    forwardMsg(msgId: string, chatId: string) {
      let msg: ClientChatMsg = {
        _t: "forward",
        fromChatId: this.chatId,
        fromMessageId: msgId,
      };
      this.sendToClient(msg, chatId);
      this.chatMsgService.sendMessage(msg, this.chatId);
    },

    // delete message
    handleDelete() {
      this.$confirm(this.MultiOn ? "是否删除所选消息？" : "是否删除此条消息？")
        .then(() => {
          // single forward
          if (!this.MultiOn) {
            if (this.menuMsg) this.deleteMsg(this.menuMsg.id);

            // multi forward
          } else {
            this.checkedMessage.forEach(msg => {
              this.deleteMsg(msg.id);
            });
            this.CancelMulti();
          }
        })
        .catch(() => {});
    },
    deleteMsg(id: string) {
      console.log("delete msg", id);
    },

    chatPosition() {
      let vs: any = this.$refs["chat-messages"];
      const { v, h } = vs.getScrollProcess();
      return v;
    },
    jumpToMessage(id: number) {
      let vs: any = this.$refs["chat-messages"];
      if (id < 0) {
        //jump to bottom
        vs.scrollTo({
          y: "200%",
        });
      }
    },
    handleScroll(vertical: any) {
      let vp: number = vertical.process;
      if (vp < 1 && vp > this.messageProcess) this.showGoDown = true;
      else this.showGoDown = false;
      this.messageProcess = vp;
    },
    enterInput(e: any) {
      if (this.configs.hotKey == "enterSend") {
        if (e.keyCode == 13 && e.ctrlKey) {
          this.sendMessage += "\n";
        } else if (e.keyCode == 13) {
          this.send();
          e.preventDefault();
        }
      } else if (this.configs.hotKey == "enterNewline") {
        if (e.keyCode == 13 && e.ctrlKey) {
          this.send();
        }
      }
    },

    openMenu(e: any, msg: ServerChatMsg) {
      this.msgMenuPos.x = e.clientX;
      this.msgMenuPos.y = e.clientY - 50;
      this.showMsgMenu = true;
      this.menuMsg = msg;
    },

    // upload image
    beforeUpload(file: any) {
      this.fileInfo = {
        name: file.name,
        size: file.size,
      };
      this.showUpload = true;
      this.uploading = true;
    },
    async handleUpload(options: any) {
      // console.log(options);
      let uploader = serviceProvider.resolve<FileUploader>(FileUploader);
      let res = await uploader.uploadFile([options.file]);
      // console.log("onHandleUpload", res);
      // options.onSuccess(res[0]);
      return res[0];
    },
    handleUploadError() {
      // ProgressEvent 找不着错误消息提示
      this.$message.error("图片或文件上传失败");
      this.showUpload = false;
    },
    handleUploadSuccess(res: string, file: { raw: File }) {
      // console.log("uploadSuccess", res);
      this.uploading = false;
      this.upUrl = getFileUri(res);
    },

    // 多选框方法
    checkMulti(checked: boolean, msg: ServerChatMsg) {
      if (checked) {
        this.checkedMessage.push(msg);
      } else {
        let index = this.checkedMessage.findIndex(o => o.id === msg.id);
        this.checkedMessage.splice(index, 1);
      }
    },
    CancelMulti() {
      this.MultiOn = false;
      this.checkedMessage = [];
    },

    func() {
      console.log("hi");
    },

    // get data
    async getUser(id: string) {
      try {
        return await this.userProfilePool.getData(id);
      } catch (err) {
        console.log("getUser err: ", err);
      }
    },

    async getGroup(id: string) {
      try {
        return await this.groupProfilePool.getData(id);
      } catch (err) {
        console.log("getGroup err: ", err);
      }
    },

    async getChatInfo() {
      try {
        this.chatinfo = await this.getGroup(this.chatId);
        if (this.chatinfo) {
          this.getAvatars(this.chatinfo.members);
          if (this.chatinfo.isFriend) {
            this.showSender = false;
          }
        }
      } catch (err) {
        console.log("get chatInfo err: ", err);
      }

      // this.chatinfo = {
      //   id: "wang+li",
      //   name: "wang+li",
      //   isFriend: true,
      //   members: ["wang", "li"],
      //   owner: "wang",
      //   chatlog: "",
      // };
    },
    async getAvatars(ids: string[]) {
      for (let id of ids) {
        let pf = await this.getUser(id);
        this.$set(this.name2avatar, id, pf.avatarUrl);
      }
    },

    async getProfile() {
      // try {
      //   this.me = await this.userProfilePool.getMyProfile();
      //   console.log("get me: ", this.me);
      // } catch (err) {
      //   console.log("getProfile err: ", err);
      // }
      this.me = {
        id: "5eec7cd9c1e7520001d26e79",
        username: "wang",
        avatarUrl:
          "https://www.gx8899.com/uploads/allimg/180118/3-1P11P92057.jpg",
        friends: ["li", "yang"],
        groups: ["family"],
        state: true,
      };
      this.getContacts();
    },

    async getContacts() {
      try {
        for (let id of this.me.friends) {
          let pf = await this.getUser(id);
          this.contacts.push({
            username: id,
            avatarUrl: pf.avatarUrl,
            state: pf.state,
          });
        }

        for (let id of this.me.groups) {
          let pf = await this.getGroup(id);
          this.contacts.push({
            username: id,
            avatarUrl: pf.avatarUrl,
          });
        }
      } catch (err) {
        console.log("get contact err: ", err);
      }
    },
  },
  computed: {
    checkedNumber(): number {
      return (this as any).checkedMessage.length;
    },
    chatname(): string {
      if (!this.chatinfo || !this.me) return "";

      if (!this.chatinfo.isFriend) return this.chatinfo.name;

      // private chat
      let names = this.chatinfo.name.split("+");
      if (names[0] == this.me.username) return names[1];
      else return names[0];
    },
  },

  filters: {
    fileSize(size: number): string {
      if (size < 1000) {
        return size + " B";
      } else if ((size /= 1024) < 1000) {
        return size.toFixed(2) + " KiB";
      } else if ((size /= 1024) < 1000) {
        return size.toFixed(2) + " MiB";
      } else {
        return size.toFixed(2) + " GiB";
      }
    },
  },
});
</script>

<style lang="stylus" scoped>
.input-bar {
  padding: 6px 0;
  display: flex;
  align-items: flex-end;

  .sendopt {
    width: 60px;

    & i:first-child {
      margin-right: 12px;
    }
  }

  .el-textarea {
    width: auto;
    flex-grow: 1;
    margin: 0 12px;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  .icon24 {
    height: 33px;
    line-height: 33px;
    position: relative;
  }
}

.quote {
  border-left: 3px colors.theme-blue solid;
  padding-left: 8px;
  margin: 3px 0 5px;
  color: colors.dark-sub-text;
  display: flex;
  font-size: 14px;

  .el-image {
    height: 43px;
    width: 43px;
    border-radius: 3px;
    margin-right: 5px;
    opacity: 0.8;
  }

  .quote-text {
    // todo: quote width definited by message
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.quote-bar {
  padding-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  i {
    z-index: 99;
  }

  .quote-text {
    width: 400px;
  }
}

.up-dialog {
  /deep/ .el-dialog__header, /deep/ .el-dialog__body {
    padding-bottom: 0;
  }

  .image-wrapper {
    background-color: colors.theme-light-grey;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-height: 300px;
    min-height: 100px;
    overflow: hidden;
    border-radius: 4px;
  }

  .file {
    // color: colors.theme-black;
    .file-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 250px;
    }

    .file-info {
      height: 44px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .file-icon {
      float: left;
      width: 44px;
      height: 44px;
      border-radius: 50px;
      background-color: colors.theme-blue;
      margin-right: 12px;
      color: colors.theme-light-grey;

      i {
        position: relative;
        left: 10px;
      }
    }
  }

  .el-input {
    margin-top: 16px;
  }
}

/deep/ .forward-dia .el-dialog__body {
  padding-top: 10px;
}

.goBtn {
  position: absolute;
  z-index: 99;
  right: 16px;
  bottom: 16px;
}

.msg-menu {
  height: 0;
  overflow: hidden;
  position: absolute;
  transition: height 0.1s ease-out;
  z-index: 100;

  .menu-item {
    width: 80px;
    text-align: center;
    font-size: 14px;
    line-height: 30px;
    transition: background-color 0.2s ease-out;

    &.delete {
      border-top: 1px solid colors.theme-light-grey;
    }

    &:hover {
      background-color: rgba(64, 158, 255, 0.2);
    }
  }

  &.open {
    height: 121px;
  }
}

.emptyWarning {
  position: absolute;
  bottom: 50px;
  right: 0;
  border: 1px colors.dark-sub-text solid;
  color: colors.dark-sub-text;
  font-size: 14px;
  width: 100px;
  line-height: 14px;
  padding: 10px 15px;
  border-radius: 7px 7px 0 7px;
  background-color: rgba(68, 71, 78, 0.5);
  cursor: default;
  opacity: 0;
  transition: opacity 0.3s ease-in;
  z-index: 10;

  &.show {
    opacity: 1;
  }
}

.chatinfo {
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    line-height: 14px;
  }

  .info {
    margin-top: 5px;

    &.online {
      color: colors.theme-blue;
    }
  }
}

.sendername {
  color: colors.theme-blue;
  font-weight: bold;
}

.chat-messages {
  position: relative;

  .msg {
    display: flex;
    margin: 6px 20px;

    .el-avatar {
      margin-left: 0;
      margin-right: 12px;
    }

    &.self {
      align-self: flex-end;
      flex-direction: row-reverse;

      .el-avatar {
        margin-right: 0;
        margin-left: 12px;
      }
    }
  }
}

.info {
  color: colors.dark-sub-text;
  font-size: 12px;
}

.icon24 {
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.iconforbid {
  color: gray;
  cursor: default;
}

.chat {
  display: flex;
  flex-direction: column;
  width: 850px;
  height: 650px;

  .chat-top-bar {
    flex-basis: 55px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    flex-shrink: 0;
  }

  .chat-messages {
    padding: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 600px;
  }

  .chat-bottom-bar {
    padding: 0 20px;
  }

  .non-chat {
    // height: 650px;
    align-items: center;
    justify-content: center;

    .notice {
      width: 250px;
      text-align: center;
      background-color: rgba(128, 128, 128, 0.3);
      border-radius: 20px;
      font-size: 14px;
      line-height: 28px;
    }
  }
}

.chat-top-bar, .chat-bottom-bar {
  background-color: colors.theme-grey;
}

.chat-messages {
  background-color: colors.theme-light-grey;
}

@media (prefers-color-scheme: dark) {
  .dark_light_bg {
    background-color: colors.dark-light;
    border-color: colors.dark-medium;
  }

  .dark_medium_bg {
    background-color: colors.dark-medium;
    border-color: colors.dark-light;
  }

  .dark_deep_bg {
    background-color: colors.dark-deep;
  }

  .dark_sub_text {
    color: colors.dark-sub-text;
  }

  .dark_main_text {
    color: colors.dark-main-text;
  }

  .chat-messages {
    .msgbody {
      background-color: colors.dark-medium;

      .sendername {
        color: colors.theme-blue;
      }

      .msg-text {
        color: colors.dark-main-text;

        .time {
          color: colors.dark-sub-text;
        }
      }
    }
  }

  /deep/ .el-textarea__inner {
    color: colors.dark-main-text;
    background-color: colors.dark-light;
  }
}

// 多选框样式
.el-col {
  margin-left: 20px;
}

.multi_row {
  padding: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .multi_button {
    padding: 8px 20px;

    .multi_num {
      margin-left: 5px;
      color: colors.theme-grey;
    }
  }

  .multi_cancel {
    margin-left: auto;
  }
}
</style>
