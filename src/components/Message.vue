<template>
  <div class="msgbody dark_main_text" :class="'type-' + msg._t">
    <!-- forwardFrom -->

    <div class="bodytop">
      <div class="sendername" v-if="showSender">
        {{ msg.sender }}
      </div>
      <!-- replyTo -->
      <div
        v-if="msg.replyTo"
        class="quote"
        @click="$emit('checkQuote', msg.replyTo.id)"
      >
        <el-image
          v-if="msg.replyTo._t == 'image'"
          :src="msg.replyTo.image ? msg.replyTo.image : imageph"
        ></el-image>
        <div>
          <div class="sendername">
            {{ msg.replyTo.sender }}
          </div>
          <div class="quote-text">
            <template v-if="msg.replyTo._t == 'text'">
              {{ msg.replyTo.text }}
            </template>
            <template v-else-if="msg.replyTo._t == 'image'">
              [图片]
              <span v-if="msg.replyTo.caption"
                >, {{ msg.replyTo.caption }}</span
              >
            </template>
            <template v-else-if="msg.replyTo._t == 'file'">
              {{ msg.replyTo.filename }}
              <span v-if="msg.replyTo.caption"
                >, {{ msg.replyTo.caption }}</span
              >
            </template>
          </div>
        </div>
      </div>

      <!-- forwardFrom -->
      <div class="sendername" v-if="msg.forwardFrom">
        Forwarded from {{ msg.forwardFrom.username }}
      </div>
    </div>

    <!-- message body -->
    <!-- text message -->
    <div v-if="msg._t == 'text'" class="msg-text">
      <span>{{ msg.text }}</span>
      <span class="time info">
        {{ msg.time | msgTime }}
      </span>
    </div>

    <!-- image message -->
    <div v-else-if="msg._t == 'image'" :class="{ 'image-only': !msg.caption }">
      <el-image
        :src="msg.image ? msg.image : imageph"
        :preview-src-list="[msg.image]"
        :class="{
          noSender: !showSender && !msg.forwardFrom && !msg.replyTo,
        }"
      ></el-image>
      <div class="msg-text" v-if="msg.caption">
        <span>{{ msg.caption }}</span>
        <span class="time info">
          {{ msg.time | msgTime }}
        </span>
      </div>
      <div v-else class="time">{{ msg.time | msgTime }}</div>
    </div>

    <!-- file message -->
    <div v-else-if="msg._t == 'file'">
      <a :href="msg.file" class="file dark_main_text" :download="msg.filename">
        <div class="file-icon icon24">
          <i class="el-icon-document"></i>
        </div>
        <div>
          <div class="file-name">{{ msg.filename }}</div>
          <div class="info">{{ msg.size | fileSize }}</div>
        </div>
      </a>

      <div class="msg-text" v-if="msg.caption">
        <span>{{ msg.caption }}</span>
        <span class="time info">
          {{ msg.time | msgTime }}
        </span>
      </div>

      <span class="time1 info" v-else>
        {{ msg.time | msgTime }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { ServerChatMsg } from "@/types/types";
import moment from "moment";

import Vue from "vue";
export default Vue.extend({
  props: {
    msg: Object,
    showSender: Boolean,
  },
  data() {
    return {
      imageph:
        "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
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
});
</script>

<style lang="stylus" scoped>
.sendername {
  color: colors.theme-blue;
  font-weight: bold;
}

.msgbody {
  background-color: white;
  border-radius: 7px;
  max-width: 400px;
  font-size: 14px;

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
    align-self: center;

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
    text-decoration: none;

    // color: colors.theme-black;
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
  font-size: 14px;

  .el-image {
    height: 43px;
    width: 43px;
    border-radius: 3px;
    margin-right: 5px;
    opacity: 0.8;
  }

  .quote-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
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
</style>
