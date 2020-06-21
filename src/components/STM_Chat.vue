<template>
  <div>
    <div class="background">
      <img :src="imgSrc" width="100%" height="100%" alt="" />
    </div>
    <div class="front">
      <template>
        <el-header class="home-header dark_light_bg dark_main_text">
          STM-Chat---STM for Lighter Communication</el-header
        >
        <el-main class="home-main dark_deep_bg">
          <template>
            <div class="layermbox" v-show="settingLayer">
              <div class="laymshade" style="height:100%">
                <el-row :gutter="20">
                  <el-col :span="8"
                    ><div class="setting-placeholder"></div
                  ></el-col>
                  <el-col :span="8"
                    ><Setting v-on:closed="closed" v-on:saved="saved"> </Setting
                  ></el-col>
                  <el-col :span="8"
                    ><div class="setting-placeholder"></div
                  ></el-col>
                </el-row>
              </div>
            </div>
          </template>
          <template>
            <div class="layermbox" v-show="groupinfoLayer">
              <div class="laymshade" style="height:100%;padding-top:100px;">
                <el-row :gutter="20">
                  <el-col :span="6"
                    ><div class="setting-placeholder"></div
                  ></el-col>
                  <el-col :span="10"
                    ><Groupinfo v-on:closeInfo="closeInfo"> </Groupinfo
                  ></el-col>
                  <el-col :span="8"
                    ><div class="setting-placeholder"></div
                  ></el-col>
                </el-row>
              </div>
            </div>
          </template>
          <el-row class="home-row">
            <el-col :span="4"><div class="grid-content-home"></div></el-col>
            <el-col :span="16" class="home-col"
              ><el-container width="50%">
                <el-aside width="35%" style="overflow-x: hidden;">
                  <ChatList
                    v-show="showChatList"
                    v-on:chatListCommand="chatListCommand($event)"
                  >
                  </ChatList>
                  <Contacts
                    v-show="showContacts"
                    v-on:contactClose="contactClose"
                    v-on:addContacts="addContacts"
                  >
                  </Contacts>
                  <Addmember
                    v-show="showMember"
                    v-on:create="create"
                    v-on:cancel="cancel"
                  >
                  </Addmember>
                </el-aside>
                <el-container width="65%">
                  <Chat></Chat>
                </el-container> </el-container
            ></el-col>
            <el-col :span="4"></el-col>
          </el-row>
        </el-main>
      </template>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.background{
    background-size: cover;
    width:100%;
    height:100%;  /**宽高100%是为了图片铺满屏幕 */
    z-index:-1;
    position: fixed;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
}

.front{
    z-index:1;
     top:0px;
    left:0px;
    right:0px;
    bottom:0px;
    position: fixed;
    width:100%;
    height:100%;
}
.setting-placeholder {
    border-radius: 4px;
    min-height: 36px;
  }
.home-header {
  text-align: left;
  line-height: 60px;
  padding-top: 10px;
}

.home-main {
  color: #333;
  text-align: center;
}
.home-row {
  &:last-child {
    margin-bottom: 0;
  }
}
.home-col {
  border-radius: 4px;
  min-height=36px;
}
.grid-content-home {
  border-radius: 4px;
  min-height: 36px;
}


@media (prefers-color-scheme: dark) {
  .dark_light_bg {
    background-color: #606266;
    border-color: #44474E;
  }

  .dark_midium_bg {
    background-color: #44474E;
    border-color: #606266;
  }

  .dark_deep_bg {
    background-color: #303133;
  }

  .dark_sub_text {
    color: #909399;
  }

  .dark_main_text {
    color: #E4E7ED;
  }
}

.layermbox{
  position:fixed
  left: 0
  top: 0
  z-index:2
  right: 0
  bottom: 0
}
.laymshade{
  position: relative
  width: 100%
  height: 100%
  background: rgba(0,0,0,0.3)
}
</style>

<script>
import Chat from "@/components/Chat.vue";
import ChatList from "@/components/ChatList.vue";
import Contacts from "@/components/Contacts.vue";
import Addmember from "@/components/Addmember.vue";
import Setting from "@/components/Setting.vue";
import Groupinfo from "@/components/Groupinf.vue";
export default {
  components: {
    ChatList: ChatList,
    Chat: Chat,
    Contacts: Contacts,
    Addmember: Addmember,
    Setting: Setting,
    Groupinfo: Groupinfo,
  },
  methods: {
    closeInfo() {
      this.groupinfoLayer = false;
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
    create() {
      this.showMember = false;
      this.showChatList = true;
      this.$message({
        message: "群聊创建成功",
        type: "success",
      });
    },
    cancel() {
      this.showMember = false;
      this.showChatList = true;
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
        this.$prompt("输入群组名称", "新建群聊", {
          confirmButtonText: "下一步",
          cancelButtonText: "取消",
        })

          .then(({ value }) => {
            this.$message("为" + value + "添加成员");
            this.showChatList = false;
            this.showMember = true;
          })
          .catch(() => {
            this.showChatList = true;
            this.showMember = false;
          });
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
      imgSrc:
        "http://pic.51yuansu.com/backgd/cover/00/06/10/5b6510370f849.jpg%21/fw/780/quality/90/unsharp/true/compress/true",
    };
  },
};
</script>
