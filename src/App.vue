<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import { serviceProvider } from "./services/dependencyInjection";
import registerDI from "./services/registerDI";
import { WsMessageService } from "./services/websocket";
import { MessageListService } from "./services/messageService";
@Component({
  components: {
    HelloWorld,
  },
  beforeCreate() {
    registerDI();
  },
})
export default class App extends Vue {}
</script>

<style lang="stylus">
#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'San Francisco UI', 'Helvetica Neue', Arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /deep/ .el-dialog {
    border-radius: 3px;
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

    .dark_hr {
      border-style: solid;
      border-radius: 1px;
      border-width: 1px;
      border-color: white;
      background-color: white;
    }

    /deep/ .el-textarea__inner, /deep/ .el-input__inner {
      color: colors.dark-main-text;
      background-color: colors.dark-light;
    }

    /deep/ .el-dialog {
      background: colors.dark-medium;

      .el-dialog__body, .el-dialog__title {
        color: colors.dark-main-text;
      }
    }
  }
}

body {
  margin: 0;
}
</style>
