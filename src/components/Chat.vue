<template>
  <div class="chat">
    <!-- <div class="wrapper">
      <div v-for="msg in list" :key="msg.msg.id">{{ msg }}</div>
    </div>-->
    <div class="chat-top-bar dark_main_text dark_light_bg">
      <div :class="'chatinfo ' + chatinfo.type">
        <template v-if="chatinfo.type == 'private'">
          <span>{{ chatinfo.user.name }}</span>
          <span :class="'info ' + chatinfo.user.status">{{ chatinfo.user.status }}</span>
        </template>
        <template v-if="chatinfo.type == 'group'">
          <span>{{ chatinfo.group.name }}</span>
          <span class="info">{{ chatinfo.group.member }} members</span>
        </template>
      </div>
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
      <vuescroll :ops="scrollOption" ref="chat-messages" @handle-scroll="handleScroll">
        <div
          v-for="data in messages"
          :key="data.msg.id"
          :class="
            'msg ' + (data.msg.sender.name == me.name ? 'self' : 'others')
          "
        >
          <el-avatar :src="data.msg.sender.avatar" v-if="showAvatar"></el-avatar>

          <div :class="'msgbody type-' + data.msg._t">
            <div class="sendername" v-if="showSender">{{ data.msg.sender.name }}</div>

            <div v-if="data.msg._t == 'text'" class="msg-text">
              <span>{{ data.msg.text }}</span>
              <span class="time info" type="info">
                {{
                data.msg.time | msgTime
                }}
              </span>
            </div>

            <div
              v-else-if="data.msg._t == 'image'"
              :class="data.msg.caption ? 'msg-image' : 'image-only'"
            >
              <el-image
                :src="data.msg.image"
                :preview-src-list="[data.msg.image]"
                :class="showSender ? '' : 'noSender'"
                lazy
              ></el-image>
              <div class="msg-text" v-if="data.msg.caption">
                <span>{{ data.msg.caption }}</span>
                <span class="time info" type="info">
                  {{
                  data.msg.time | msgTime
                  }}
                </span>
              </div>
              <div v-else class="time">{{ data.msg.time | msgTime }}</div>
            </div>
          </div>
        </div>
      </vuescroll>
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
        <div :class="'emptyWarning ' + (showEmptyWarning ? 'show' : '')">不能发送空消息</div>
        <i
          class="el-icon-s-promotion dark_main_text"
          :class="sendMessage.length > 0 ? '' : 'iconforbid'"
          @click="send()"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
// switch hotkey
// send empty warning
// online/offline

//todo: foward/qoute style
//todo: style for file
//todo: upload image/ file
//todo: bottom-bar height
//todo: desktop notifiction; notice sound

//todo: color variable
//todo: dark mode

//todo: unread amount
//todo: jump to message

import { WsMessageService } from "../services/websocket";
import { ChatMessages } from "../assets/sample/wsSample";

import vuescroll from "vuescroll/dist/vuescroll-native";
import moment from "moment";
import { serviceProvider, TYPES } from "../services/dependencyInjection.ts";

export default {
  components: {
    vuescroll,
  },
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
      const { v, h } = this.$refs["chat-messages"].getScrollProcess();
      // console.log(v);
      return v;
    },
    jumpToMessage(id) {
      let vs = this.$refs["chat-messages"];
      if (id < 0) {
        //jump to bottom
        vs.scrollTo({
          y: "200%",
        });
      }
    },
    handleScroll(vertical) {
      let vp = vertical.process;
      if (vp < 1 && vp > this.messageProcess) this.showGoDown = true;
      else this.showGoDown = false;
      this.messageProcess = vp;
    },
    enterInput(e) {
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
      scrollOption: {
        rail: {
          gutterOfEnds: "5px",
          gutterOfSide: "5px",
        },
        bar: { background: "colors.theme-blue" },
      },
      messages: ChatMessages,
    };
  },
  filters: {
    msgTime(time) {
      let m = moment(time);
      if (m.isBefore(moment(), "year"))
        return moment(time).format("YYYY/M/D H:mm");
      else if (m.isBefore(moment(), "day"))
        return moment(time).format("M/D H:mm");
      else return moment(time).format("H:mm");
    },
  },
};
</script>

<style lang="stylus">
$color-highlight-text = #409EFF
$color-info-text = #909399

.chat-bottom-bar {
  .sendopt {
    width: 60px

    & i:first-child {
      margin-right: 12px
    }
  }

  .el-textarea {
    width: auto
    flex-grow: 1
    margin: 0 12px

    ::-webkit-scrollbar {
      display: none
    }
  }

  .icon24 {
    height: 33px
    line-height: 33px
    position: relative
  }
}

.goBtn {
  position: absolute
  z-index: 99
  right: 16px
  bottom: 16px
}

.emptyWarning {
  position: absolute
  bottom: 50px
  right: 0
  border: 1px colors.dark-sub-text solid
  color: colors.dark-sub-text
  font-size: 14px
  width: 100px
  line-height: 14px
  padding: 10px 15px
  border-radius: 7px 7px 0 7px
  background-color: rgba(68, 71, 78, 0.5)
  opacity: 0
  transition: opacity 0.3s ease-in

  &.show {
    opacity: 1
  }
}

.info {
  color: colors.dark-sub-text
  font-size: 12px
}

.chatinfo {
  display: flex
  flex-direction: column
  justify-content: center

  span {
    line-height: 14px
  }

  .info {
    margin-top: 5px

    &.online {
      color: $color-highlight-text
    }
  }
}

.chat-messages {
  position: relative

  .msg {
    display: flex
    margin: 6px 20px

    .el-avatar {
      margin-left: 0
      margin-right: 12px
    }

    .msgbody {
      background-color: white
      padding: 6px 10px
      border-radius: 7px
      max-width: 400px

      .sendername {
        color: colors.theme-blue
        font-weight: bold
        margin-bottom: 2px
      }

      .msg-text {
        white-space: pre-wrap
        word-wrap: break-word
        text-align: justify

        .time {
          margin-left: 8px
          float: right
          line-height: 12px
          padding-top: 7px
        }
      }

      &.type-image {
        padding: 0
        position: relative

        .sendername {
          margin: 6px 10px 2px
        }

        .msg-text {
          margin: 0 10px 6px
        }

        .el-image {
          max-width: 400px
          max-height: 250px
          fit: cover

          &.noSender {
            border-top-left-radius: 7px
            border-top-right-radius: 7px
          }
        }
      }

      .image-only {
        .el-image {
          border-bottom-left-radius: 7px
          border-bottom-right-radius: 7px
          margin-bottom: -5px
        }

        .time {
          position: absolute
          font-size: 12px
          padding: 3px 10px
          right: 8px
          bottom: 8px
          border-radius: 7px
          color: white
          background-color: rgba(0, 0, 0, 0.3)
          opacity: 0
          transition: opacity 0.1s ease-in
        }

        &:hover {
          .time {
            opacity: 1
          }
        }
      }
    }

    &.self {
      align-self: flex-end
      flex-direction: row-reverse

      .el-avatar {
        margin-right: 0
        margin-left: 12px
      }
    }
  }
}

.icon24 {
  font-size: 24px
  cursor: pointer
  display: flex
  align-items: center
}

.iconforbid {
  color: gray
  cursor: default
}

.chat {
  display: flex
  flex-direction: column
  max-width: 750px
  height: 400px

  .chat-top-bar {
    flex-basis: 55px
    display: flex
    justify-content: space-between
    padding: 0 20px
    flex-shrink: 0
  }

  .chat-messages {
    padding: 0
    height: 500px
    flex-shrink: 1
  }

  .chat-bottom-bar {
    padding: 6px 20px
    display: flex
    align-items: flex-end
    flex-shrink: 0
  }
}

.chat-top-bar,
.chat-bottom-bar {
  background-color: colors.theme-grey
}

.chat-messages {
  background-color: colors.theme-light-grey
}

@media (prefers-color-scheme: dark) {
  .dark_light_bg {
    background-color: colors.dark-light
    border-color: colors.dark-medium
  }

  .dark_medium_bg {
    background-color: colors.dark-medium
    border-color: colors.dark-light
  }

  .dark_deep_bg {
    background-color: colors.dark-deep
  }

  .dark_sub_text {
    color: colors.dark-sub-text
  }

  .dark_main_text {
    color: colors.dark-main-text
  }

  .chat-messages {
    .msg {
      .msgbody {
        background-color: colors.dark-medium

        .sendername {
          color: colors.theme-blue
        }

        .msg-text {
          color: colors.dark-main-text

          .time {
            color: colors.dark-sub-text
          }
        }
      }
    }
  }

  .el-textarea__inner {
    color: colors.dark-main-text
    background-color: colors.dark-light
  }
}
</style>
