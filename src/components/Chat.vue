<template>
  <div class="chat" @click="showMsgMenu = false">
    <!-- <div class="wrapper">
      <div v-for="msg in list" :key="msg.msg.id">{{ msg }}</div>
    </div>-->
    <div class="chat-top-bar dark_main_text dark_light_bg">
      <template v-if="!MultiOn">
        <div class="chatinfo" :class="chatinfo.type">
          <template v-if="chatinfo.isFriend">
            <span>{{ chatname }}</span>
            <span class="info online">
              online
            </span>
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
            @click="showDelete = true"
          >
            删除
            <span class="multi_num">{{ checkedNumber }}</span>
          </el-button>
          <el-button type="primary" class="multi_button" @click="forwardMulti">
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

      <!-- 右键菜单 -->
      <el-card
        v-if="menuMsg"
        class="msg-menu"
        :class="{ open: showMsgMenu }"
        :style="{ left: msgMenuPos.x + 'px', top: msgMenuPos.y + 'px' }"
        :body-style="{ padding: '0' }"
      >
        <div class="menu-item" @click="quoteMsg = menuMsg">回复</div>
        <div class="menu-item" @click="forwardMsg(menuMsg.id)">转发</div>
        <div class="menu-item" @click="MultiOn = true">多选</div>
        <div class="menu-item delete" @click="showDelete = true">删除</div>
      </el-card>

      <vueScroll ref="chat-messages" @handle-scroll="handleScroll">
        <div v-for="msg in messages" :key="msg.id">
          <!-- 多选框 -->
          <el-col :span="1" v-if="MultiOn">
            <el-checkbox
              @change="checked => checkMulti(checked, msg)"
            ></el-checkbox>
          </el-col>

          <div
            class="msg"
            :class="{ self: msg.sender.username == me.username }"
          >
            <el-avatar
              :src="msg.sender.avatarUrl"
              v-if="showAvatar"
            ></el-avatar>

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

      <!-- 删除消息确认 -->
      <el-dialog title="删除消息" :visible.sync="showDelete" width="30%">
        <span v-if="!MultiOn">是否删除此条消息？</span>
        <span v-else>是否删除所选消息？</span>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="showDelete = false"
            type="text"
            style="margin-right: 10px;"
            >取消</el-button
          >
          <el-button
            v-if="!MultiOn"
            type="primary"
            @click="
              deleteMsg(menuMsg.id);
              showDelete = false;
            "
            >确定</el-button
          >
          <el-button
            v-else
            type="primary"
            @click="
              deleteMulti();
              showDelete = false;
            "
            >确定</el-button
          >
        </span>
      </el-dialog>
    </div>

    <div class="chat-bottom-bar dark_light_bg dark_main_text">
      <!-- 回复引用条 -->
      <div v-if="quoteMsg" class="quote-bar">
        <div class="quote">
          <el-image
            v-if="quoteMsg._t == 'image'"
            :src="quoteMsg.image"
            lazy
          ></el-image>
          <div>
            <div class="sendername">{{ quoteMsg.sender.username }}</div>
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
    </div>
  </div>
</template>

<script lang="ts">
//todo: uploading async
//todo: quote text / jump to message

//// upload image/ file
// ? download file: in same site
//// right click: forward, quote, copy, muti-select
//// quote input
//// bottom-bar height
//// muti-selected
//// foward style
//// quote style
//// style for file
//// online/offline
//// send empty warning
//// switch hotkey

// * 处理消息数据：格式和字段名；转发消息从对象中移出

import { WsMessageService } from "../services/websocket";
import { ChatMessages } from "../assets/sample/wsSample";

// import moment from "moment";
import { serviceProvider, TYPES } from "../services/dependencyInjection";
import { ServerChatMsg } from "@/types/types";
import Message from "./Message.vue";

import Vue from "vue";
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
  beforeMount: function() {},
  methods: {
    send() {
      if (this.showUpload && this.upUrl) {
        this.messages.push({
          _t: "image",
          id: "1" + new Date().getTime(),
          time: new Date(),
          image: this.upUrl,
          caption: this.sendMessage,
          sender: this.me,
        });
        this.sendMessage = "";
        this.upUrl = "";
        this.showUpload = false;
      } else {
        if (this.sendMessage.length == 0) {
          this.showEmptyWarning = true;
          setTimeout(() => {
            this.showEmptyWarning = false;
          }, 1500);
        } else {
          this.messages.push({
            _t: "text",
            id: "1" + new Date().getTime(),
            time: new Date(),
            text: this.sendMessage,
            sender: this.me,
          });
          this.sendMessage = "";
        }
      }
      this.jumpToMessage(-1);
    },
    chatPosition() {
      let vs: any = this.$refs["chat-messages"];
      const { v, h } = vs.getScrollProcess();
      // console.log(v);
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
      this.msgMenuPos.x = e.clientX - 5;
      this.msgMenuPos.y = e.clientY - 60;
      this.showMsgMenu = true;
      this.menuMsg = msg;
    },

    // upload image
    beforeUpload(file) {
      this.fileInfo = {
        name: file.name,
        size: file.size,
      };
      this.showUpload = true;
      this.uploading = true;
    },
    handleUploadError() {
      // ProgressEvent 找不着错误消息提示
      this.$message.error("图片上传失败");
      this.showUpload = false;
    },
    handleUploadSuccess(res, file) {
      this.uploading = false;
      this.upUrl = URL.createObjectURL(file.raw);
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
    forwardMulti() {
      this.checkedMessage.forEach(msg => {
        this.forwardMsg(msg.id);
      });
      this.CancelMulti();
    },
    forwardMsg(id: string) {
      console.log("forward msg" + id);
    },
    deleteMulti() {
      this.checkedMessage.forEach(msg => {
        this.deleteMsg(msg.id);
      });
      this.CancelMulti();
    },
    deleteMsg(id: string) {
      let index = this.messages.findIndex(o => o.msg.id === id);
      if (index > -1) {
        this.messages.splice(index, 1);
      }
    },
    func() {
      console.log("hi");
    },
  },
  computed: {
    checkedNumber(): number {
      return (this as any).checkedMessage.length;
    },
    chatname(): string {
      if (!this.chatinfo.isFriend) return this.chatinfo.name;

      // private chat
      let names = this.chatinfo.name.split("+");
      if (names[0] == this.me.username) return names[1];
      else return names[0];
    },
  },
  data() {
    return {
      messageProcess: 0,
      showSender: true,
      showAvatar: true,
      connector: null,
      showGoDown: false,
      showEmptyWarning: false,
      //menu
      showMsgMenu: false,
      menuMsg: undefined as ServerChatMsg | undefined,
      msgMenuPos: {
        x: 0,
        y: 0,
      },
      quoteMsg: null,
      showDelete: false,

      //upload
      showUpload: false,
      uploadType: "",
      upUrl:
        // "",
        "https://img11.360buyimg.com/n1/jfs/t14497/67/1017638125/136874/65c4ecc3/5a422c37N1b36f52c.jpg",
      // "https://www.spirit-animals.com/wp-content/uploads/2013/04/Dove-1-1090x380.jpg",
      fileInfo: null,
      uploading: false,

      list: [],
      sendMessage: "",
      me: {
        id: "5ee5feeeac7ecb0001782b5d",
        username: "wang",
        avatarUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSu56NCKGJ-esUMKb0jsKcm7639FoqaXJK1_sSWvhQmi6fZwNcA&usqp=CAU",
        friends: ["li", "yang"],
        groups: ["kruodis"],
      },
      chatinfo: {
        id: "5ee5feefac7ecb0001782b61",
        name: "wang+li",
        isFriend: true,
        owner: "wang",
        members: ["wang", "li"],
        chatlog: "5ee5feefac7ecb0001782b62",
      },
      configs: {
        desktopNotifictions: true,
        backgroundNotifictions: true,
        soundOn: true,
        soundDegree: 100,
        hotKey: "enterSend", //"enterNewline"
      },
      messages: ChatMessages,

      // 多选框取值
      MultiOn: false,
      checkedMessage: [] as ServerChatMsg[],
    };
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

<style lang="stylus">
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
  .el-dialog__header, .el-dialog__body {
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
  max-width: 750px;
  height: 600px;

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
  }

  .chat-bottom-bar {
    padding: 0 20px;
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
    .msg {
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
  }

  .el-textarea__inner {
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
