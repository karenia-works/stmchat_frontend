<template>
  <div class="chat">
    <!-- <div class="wrapper">
      <div v-for="msg in list" :key="msg.msg.id">{{ msg }}</div>
    </div>-->
    <div class="chat-top-bar dark_main_text dark_light_bg">
      <div class="chatinfo" :class="chatinfo.type">
        <template v-if="chatinfo.type == 'private' && !MultiOn">
          <span>{{ chatinfo.user.name }}</span>
          <span class="info" :class="chatinfo.user.status">{{
            chatinfo.user.status
          }}</span>
        </template>
        <template v-if="chatinfo.type == 'group' && !MultiOn">
          <span>{{ chatinfo.group.name }}</span>
          <span class="info">{{ chatinfo.group.member }} members</span>
        </template>
      </div>
      <!-- 多选框 - 功能栏 -->
      <template v-if="MultiOn">
        <div class="multi_row">
          <el-button class="multi_delete" @click="deleteMulti"
            ><div class="multi_button">
              删除
              <div class="multi_num">{{ checkedNumber }}</div>
            </div></el-button
          >
          <el-button class="multi_delete" @click="forwardMulti"
            ><div class="multi_button">
              转发
              <div class="multi_num">{{ checkedNumber }}</div>
            </div></el-button
          >
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
      <el-button
        type="primary"
        icon="el-icon-arrow-down"
        circle
        v-show="showGoDown"
        class="goBtn"
        @click="jumpToMessage(-1)"
      ></el-button>
      <vueScroll ref="chat-messages" @handle-scroll="handleScroll">
        <div
          v-for="data in messages"
          :key="data.msg.id"
          class="msg"
          :class="{ self: data.msg.sender.name == me.name }"
        >
          <!-- 多选框-对方 -->
          <el-col :span="1" v-if="data.msg.sender.name != me.name && MultiOn">
            <el-checkbox
              class="oppo_multi"
              v-if="data.msg.sender.name != me.name"
              @change="checked => checkMulti(checked, data.msg)"
            ></el-checkbox
          ></el-col>
          <el-avatar
            :src="data.msg.sender.avatar"
            v-if="showAvatar"
          ></el-avatar>

          <div class="msgbody dark_main_text" :class="'type-' + data.msg._t">
            <!-- forwardFrom -->

            <div class="bodytop">
              <div class="sendername" v-if="showSender">
                {{ data.msg.sender.name }}
              </div>
              <!-- replyTo -->
              <div v-if="data.msg.replyTo" class="quote">
                <el-image
                  v-if="data.msg.replyTo._t == 'image'"
                  :src="data.msg.replyTo.image"
                ></el-image>
                <div>
                  <div class="sendername">
                    {{ data.msg.replyTo.sender.name }}
                  </div>
                  <div class="quote-text">
                    <template v-if="data.msg.replyTo._t == 'text'">
                      {{ data.msg.replyTo.text }}
                    </template>
                    <template v-else-if="data.msg.replyTo._t == 'image'">
                      [图片]
                      <span v-if="data.msg.replyTo.caption"
                        >, {{ data.msg.replyTo.caption }}</span
                      >
                    </template>
                    <template v-else-if="data.msg.replyTo._t == 'file'">
                      {{ data.msg.replyTo.filename }}
                      <span v-if="data.msg.replyTo.caption"
                        >, {{ data.msg.replyTo.caption }}</span
                      >
                    </template>
                  </div>
                </div>
              </div>

              <!-- forwardFrom -->
              <div class="sendername" v-if="data.msg.forwardFrom">
                Forwarded from {{ data.msg.forwardFrom.sender.name }}
              </div>
            </div>

            <!-- message body -->
            <!-- text message -->
            <div v-if="data.msg._t == 'text'" class="msg-text">
              <span>{{ data.msg.text }}</span>
              <span class="time info">
                {{ data.msg.time | msgTime }}
              </span>
            </div>

            <!-- image message -->
            <div
              v-else-if="data.msg._t == 'image'"
              :class="{ 'image-only': !data.msg.caption }"
            >
              <el-image
                :src="data.msg.image"
                :preview-src-list="[data.msg.image]"
                :class="{
                  noSender:
                    !showSender && !data.msg.forwardFrom && !data.msg.replyTo,
                }"
                lazy
              ></el-image>
              <div class="msg-text" v-if="data.msg.caption">
                <span>{{ data.msg.caption }}</span>
                <span class="time info">
                  {{ data.msg.time | msgTime }}
                </span>
              </div>
              <div v-else class="time">{{ data.msg.time | msgTime }}</div>
            </div>

            <!-- file message -->
            <div v-else-if="data.msg._t == 'file'">
              <div :href="data.msg.file" class="file">
                <div class="file-icon icon24">
                  <i class="el-icon-document"></i>
                </div>
                <div>
                  <div class="file-name">{{ data.msg.filename }}</div>
                  <div class="info">{{ data.msg.size | fileSize }}</div>
                </div>
              </div>

              <div class="msg-text" v-if="data.msg.caption">
                <span>{{ data.msg.caption }}</span>
                <span class="time info">
                  {{ data.msg.time | msgTime }}
                </span>
              </div>

              <span class="time1 info" v-else>
                {{ data.msg.time | msgTime }}
              </span>
            </div>
          </div>

          <!-- 多选框-自己 -->
          <div class="self_multi">
            <el-checkbox
              v-if="data.msg.sender.name == me.name && MultiOn"
              @change="checked => checkMulti(checked, data.msg)"
            ></el-checkbox>
          </div>
        </div>
      </vueScroll>
    </div>
    <div class="chat-bottom-bar dark_light_bg dark_main_text">
      <div class="sendopt icon24">
        <i class="el-icon-paperclip"></i>
        <i class="el-icon-picture-outline"></i>
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
    <!-- 多选框调试 -->
    <el-button @click="openMulti">多选键（菜单实现以后删除）</el-button>
  </div>
</template>

<script lang="ts">
//todo: upload image/ file
//todo: bottom-bar height
//todo: desktop notifiction; notice sound

//todo: unread amount
//todo: jump to message

// switch hotkey
// send empty warning
// online/offline
// quote
// style for file
// foward

// * 处理消息数据：格式和字段名；转发消息从对象中移出

import { WsMessageService } from "../services/websocket";
import { ChatMessages } from "../assets/sample/wsSample";

import moment from "moment";
import { serviceProvider, TYPES } from "../services/dependencyInjection";

export default {
  // props: {
  //   showSender: Boolean,
  //   showAvatar: Boolean,
  // },
  watch: {
    messages(val) {
      let pos = this.chatPosition();
      if (pos == 1) this.jumpToMessage(-1);
      else this.messageProcess = pos;
    },
  },
  beforeMount: function() {
    //   let connector = new WsMessageService("ws://localhost:8089");
    //   connector.msg.subscribe({
    //     next: msg => {
    //       console.log(msg);
    //       this.list.push(msg);
    //     },
    //   });
    //   this.connector = connector;
  },
  methods: {
    send() {
      if (this.sendMessage.length == 0) {
        this.showEmptyWarning = true;
        setTimeout(() => {
          this.showEmptyWarning = false;
        }, 1500);
      } else {
        this.messages.push({
          msg: {
            _t: "text",
            id: new Date().getTime(),
            time: new Date(),
            text: this.sendMessage,
            sender: this.me,
          },
        });
        this.sendMessage = "";
      }
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
      let vp = vertical.process;
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
    // 多选框方法
    checkMulti(checked, msg) {
      if (checked) {
        // alert(msg.text);
        this.checkedMessage[this.checkedNumber] = msg;
        this.checkedNumber = this.checkedNumber + 1;

        // alert(this.checkedMessage[this.checkedNumber - 1].text);
      } else {
        this.checkedNumber = this.checkedNumber - 1;
      }
    },
    CancelMulti() {
      this.MultiOn = false;
      this.checkedNumber = 0;
    },
    openMulti() {
      this.MultiOn = !this.MultiOn;
      this.checkedNumber = 0;
    },
    forwardMulti() {
      if (this.MultiOn && this.checkedNumber != 0) {
        alert("Undone");
      }
      this.MultiOn = false;
      this.checkedNumber = 0;
    },
    deleteMulti() {
      if (this.MultiOn && this.checkedNumber != 0) {
        while (this.checkedNumber) {
          var index = this.findMessageIndex(
            this.messages,
            this.checkedMessage[this.checkedNumber - 1],
          );
          // alert(this.checkedMessage[this.checkedNumber - 1].text);
          // alert(index);
          if (index > -1) {
            this.messages.splice(index, 1);
          } else {
            alert("delete error!");
          }
          this.checkedNumber = this.checkedNumber - 1;
        }
      }
      this.MultiOn = false;
      this.checkedNumber = 0;
    },
    findMessageIndex(msglist, msg) {
      for (let i in msglist) {
        if (msglist[i].msg.id == msg.id) {
          return i;
        }
      }
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
      list: [],
      sendMessage: "",
      me: {
        name: "skuld",
        avatar:
          "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      },
      chatinfo: {
        type: "private",
        user: {
          name: "咕咕咕",
          status: "online",
        },
        group: {
          name: "kaiche",
          member: 10,
        },
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
      checkedNumber: 0,
      checkedMessageLength: 40, // 多选长度
      checkedMessage: new Array<object>(this.checkedMessageLength),
    };
  },
  filters: {
    msgTime(time: number) {
      let m = moment(time);
      if (m.isBefore(moment(), "year"))
        return moment(time).format("YYYY/M/D H:mm");
      else if (m.isBefore(moment(), "day"))
        return moment(time).format("M/D H:mm");
      else return moment(time).format("H:mm");
    },
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
};
</script>

<style lang="stylus">
$color-highlight-text = #409EFF;
$color-info-text = #909399;

.chat-bottom-bar {
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

.goBtn {
  position: absolute;
  z-index: 99;
  right: 16px;
  bottom: 16px;
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
  opacity: 0;
  transition: opacity 0.3s ease-in;

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
      color: $color-highlight-text;
    }
  }
}

.msgbody {
  background-color: white;
  border-radius: 7px;
  max-width: 400px;
  font-size: 14px;

  .sendername {
    color: colors.theme-blue;
    font-weight: bold;
  }

  .msg-text {
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: justify;
    line-height: 24px;

    .time {
      margin-left: 8px;
      float: right;
      line-height: 12px;
      padding-top: 7px;
    }
  }
}

.msgbody.type-text {
  padding: 7px 10px;
}

.msgbody.type-image {
  position: relative;

  .bodytop {
    margin: 7px 10px 3px;
  }

  .msg-text {
    margin: 0 10px 7px;
  }

  .el-image {
    max-width: 400px;
    max-height: 250px;

    &.noSender {
      border-top-left-radius: 7px;
      border-top-right-radius: 7px;
      margin-top: -6px;
    }
  }

  .image-only {
    .el-image {
      border-bottom-left-radius: 7px;
      border-bottom-right-radius: 7px;
      margin-bottom: -4px;
    }

    .time {
      position: absolute;
      font-size: 12px;
      padding: 3px 10px;
      right: 8px;
      bottom: 8px;
      border-radius: 7px;
      color: white;
      background-color: rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: opacity 0.1s ease-in;
    }

    &:hover {
      .time {
        opacity: 1;
      }
    }
  }
}

.msgbody.type-file {
  padding: 7px 10px;

  .bodytop {
    margin-bottom: -3px;
  }

  .file {
    display: flex;
    margin-top: 11px;

    .file-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 180px;
      margin-bottom: 5px;
    }
  }

  .time1 {
    float: right;
    margin-top: -6px;
  }

  .msg-text {
    margin-top: 6px;
  }

  .file-icon {
    width: 44px;
    height: 44px;
    border-radius: 50px;
    background-color: colors.theme-blue;
    margin-right: 8px;
    color: colors.theme-light-grey;

    i {
      position: relative;
      left: 10px;
    }
  }
}

.quote {
  border-left: 3px colors.theme-blue solid;
  padding-left: 8px;
  margin: 3px 0 5px;
  color: colors.dark-sub-text;
  display: flex;

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
    max-width: 200px;
  }
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
  height: 400px;

  .chat-top-bar {
    flex-basis: 55px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    flex-shrink: 0;
  }

  .chat-messages {
    padding: 0;
    height: 500px;
    flex-shrink: 1;
  }

  .chat-bottom-bar {
    padding: 6px 20px;
    display: flex;
    align-items: flex-end;
    flex-shrink: 0;
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
.self_multi{
  margin-right : auto;
}
.oppo_multi{
}
.multi_row{
  padding: 5px
  display:flex;
  justify-content: flex-start;
  width:100%
  align-items: center;

  .multi_delete{
    padding-top:8px
    padding-bottom:8px
    border:none
    background-color : colors.theme-blue
    color: white
    .multi_button{
      display:flex;
      flex-direction: row;
      .multi_num{
        margin-left:5px
        color:colors.theme-grey
      }
    }
  }

  .multi_cancel{
    margin-left : auto;
  }

}
</style>
