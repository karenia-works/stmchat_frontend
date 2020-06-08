<template>
  <div class="chat">
    <!-- <div class="wrapper">
      <div v-for="msg in list" :key="msg.msg.id">{{ msg }}</div>
    </div>-->
    <div class="chat-top-bar dark_main_text dark_light_bg">
      <div class="chatinfo">{{ chatinfo.name }}</div>
      <div class="chatopt icon24">
        <i class="el-icon-more"></i>
      </div>
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
              <span class="time" type="info">{{ data.msg.time | msgTime }}</span>
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
                <span class="time" type="info">{{ data.msg.time | msgTime }}</span>
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
      <div class="sendicon icon24">
        <i
          class="el-icon-s-promotion dark_main_text"
          :class="sendMessage.length > 0 ? '' : 'iconforbid'"
          @click="send()"
        ></i>
      </div>
    </div>
  </div>
</template>

<script >
//todo: upload image/ file
//todo: style for file
//todo: bottom-bar height
//todo: jump to message
//todo: send empty warning
//todo: foward/qoute style

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
      if (this.sendMessage.length == 0) return;
      this.messages.push({
        msg: {
          _t: "text",
          id: new Date().getTime(),
          sender: {
            name: "skuld",
            avatar:
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          },
          time: new Date(),
          text: this.sendMessage,
        },
      });
      this.sendMessage = "";
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
      if (e.keyCode == 13 && e.ctrlKey) {
        this.sendMessage += "\n";
      } else if (e.keyCode == 13) {
        this.send();
        e.preventDefault();
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
      list: [],
      sendMessage: "",
      me: {
        name: "skuld",
      },
      chatinfo: {
        type: "private",
        name: "lynz",
      },
      scrollOption: {
        rail: {
          gutterOfEnds: "5px",
          gutterOfSide: "5px",
        },
        bar: { background: "#409EFF" },
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
  }

  .icon24 {
    height: 33px
    line-height: 33px
  }
}

.goBtn {
  position: absolute
  z-index: 99
  right: 16px
  bottom: 16px
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
        color: #409EFF
        font-weight: bold
        margin-bottom: 2px
      }

      .msg-text {
        white-space: pre-wrap
        word-wrap: break-word
        text-align: justify

        .time {
          margin-left: 8px
          color: #909399
          font-size: 12px
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
          opacity: 0
          position: absolute
          font-size: 12px
          padding: 3px 10px
          right: 8px
          bottom: 8px
          border-radius: 7px
          color: white
          background-color: rgba(0, 0, 0, 0.3)
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
    flex-basis: 50px
    line-height: 50px
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
  background-color: #b3c0d1
}

.chat-messages {
  background-color: #e9eef3
}

@media (prefers-color-scheme: dark) {
  .dark_light_bg {
    background-color: #606266
    border-color: #44474E
  }

  .dark_midium_bg {
    background-color: #44474E
    border-color: #606266
  }

  .dark_deep_bg {
    background-color: #303133
  }

  .dark_sub_text {
    color: #909399
  }

  .dark_main_text {
    color: #E4E7ED
  }

  .chat-messages {
    .msg {
      .msgbody {
        background-color: #44474E

        .sendername {
          color: #409EFF
        }

        .msg-text {
          color: #E4E7ED

          .time {
            color: #909399
          }
        }
      }
    }
  }

  .el-textarea__inner {
    color: #e4e7ed
    background-color: #606266
  }
}
</style>
