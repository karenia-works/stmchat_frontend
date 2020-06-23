<template>
  <el-container>
    <!-- <div>
    <div class="background">
      <img :src="imgSrc" width="100%" height="100%" alt="" />
    </div> -->

    <el-main class="home-main dark_medium_bg">
      <el-row>
        <el-col :span="3"><div class="grid-content-home"></div></el-col>
        <el-col :span="18" class="home-col">
          <el-container class="main-container">
            <el-aside width="35%">
              <ChatList
                v-show="showChatList"
                @chatListCommand="chatListCommand($event)"
              >
              </ChatList>
              <Contacts
                v-show="showContacts"
                @contactClose="contactClose"
                @addContacts="addContacts"
              >
              </Contacts>
            </el-aside>
            <el-main width="65%" style="padding: 0">
              <Chat :chatId="openChat"></Chat>
            </el-main>
          </el-container>
        </el-col>
        <el-col :span="3"></el-col>
      </el-row>

      <!-- setting dialog -->
      <el-dialog
        :visible.sync="settingLayer"
        :show-close="false"
        class="cpn-dia"
        width="400px"
        top="5vh"
      >
        <Setting @closed="closed" @saved="saved"> </Setting>
      </el-dialog>

      <!-- groupInfo dialog -->
      <el-dialog
        :visible.sync="groupinfoLayer"
        :show-close="false"
        class="cpn-dia"
        width="600px"
        top="5vh"
      >
        <Groupinfo @closeInfo="closeInfo"> </Groupinfo>
      </el-dialog>

      <!-- createGroup dialog -->
      <el-dialog
        :visible.sync="createGroupLayer"
        :show-close="false"
        class="cpn-dia"
        width="500px"
        top="5vh"
      >
        <CreateGroup  @cancelGroup="cancelGroup">
        </CreateGroup>
      </el-dialog>
    </el-main>
    <el-footer class="home-header dark_medium_bg dark_sub_text info">
      STM Chat @ 2020</el-footer
    >
    <!-- </div> -->
  </el-container>
</template>

<style lang="stylus" scoped>
.cpn-dia {
  /deep/ .el-dialog__header, /deep/ .el-dialog__body {
    padding: 0;
    border-radius: 3px;
  }
}

.ctn-wrapper {
  width: 80%;
}

// .background {
// background-size: cover;
// width: 100%;
// height: 100%; /* *宽高100%是为了图片铺满屏幕 */
// z-index: -1;
// position: fixed;
// top: 0px;
// left: 0px;
// right: 0px;
// bottom: 0px;
// }
.home-header {
  text-align: center;
  line-height: 60px;
  font-size: 14px;
  padding-bottom: 10px;
}

.home-main {
  color: #333;
  padding: 72px 0 36px;
}

.home-row {
  &:last-child {
    margin-bottom: 0;
  }
}

.home-col {
  max-width: 900px;
  min-width: 500px;
  align-items: center;
  justify-content: center;
}

.grid-content-home {
  border-radius: 4px;
  min-height: 36px;
}
</style>

<script>
import Chat from "@/components/Chat.vue";
import ChatList from "@/components/ChatList.vue";
import Contacts from "@/components/Contacts.vue";
import Setting from "@/components/Setting.vue";
import Groupinfo from "@/components/Groupinf.vue";
import CreateGroup from "@/components/Creatgroup.vue";
import { serviceProvider, TYPES } from "../services/dependencyInjection";
import { LoginState } from "../services/loginService";

export default {
  components: {
    ChatList: ChatList,
    Chat: Chat,
    Contacts: Contacts,
    Setting: Setting,
    Groupinfo: Groupinfo,
    CreateGroup: CreateGroup,
  },
   beforeMount: function() {
    let loginService = serviceProvider.resolve(LoginState);
    let state = loginService.isLoggedIn();
    console.log(state);
    if(state == false)
      this.$router.push({ path: "Login" });
  },
  methods: {
    closeInfo() {
      this.groupinfoLayer = false;
    },
    cancelGroup() {
      this.createGroupLayer = false;
    },
    closed() {
      this.settingLayer = false;
    },
    saved() {
      this.$message({
        message: "个人设置更新成功",
        type: "success",
      });
    },
    open() {
      this.settingLayer = true;
    },
    contactClose() {
      this.showContacts = false;
      this.showChatList = true;
    },
    addContacts() {
      this.$prompt("输入新联系人用户名", "添加联系人", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          this.$message("已向" + value + "发送申请");
        })
        .catch(() => {});
    },
    chatListCommand(arg) {
      if (arg == "a") {
        this.createGroupLayer = true;
      } else if (arg == "b") {
        this.showChatList = false;
        this.showContacts = true;
      } else if (arg == "c") {
        this.settingLayer = true;
      } else if (arg == "d") {
        this.groupinfoLayer = true;
      } else if (arg == "e") {
        this.$message("已成功退出账户");
        this.$router.push({ path: "Login" });
      }
    },
  },
  data() {
    return {
      showChatList: true,
      showContacts: false,
      showMember: false,
      dialogTableVisible: false,
      settingLayer: false,
      groupinfoLayer: false,
      createGroupLayer: false,
      openChat: "family",
      imgSrc:
        "http://pic.51yuansu.com/backgd/cover/00/06/10/5b6510370f849.jpg%21/fw/780/quality/90/unsharp/true/compress/true",
    };
  },
};
</script>
