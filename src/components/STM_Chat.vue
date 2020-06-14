<template>
  <el-container class="home-container">
    <el-header class="home-header dark_light_bg dark_main_text">
      STM-Chat---STM for Lighter Communication</el-header
    >
    <el-main class="home-main dark_deep_bg">
      <el-dialog
        title="调整设置"
        :visible.sync="dialogTableVisible"
        :append-to-body="true"
        :lock-scroll="true"
        width="35%"
      >
        <Setting></Setting>
      </el-dialog>
      <el-row>
        <el-col :span="3"><div class="grid-content-home"></div></el-col>
        <el-col :span="16" class="home-col"
          ><el-container width="50%">
            <el-aside width="35%">
              <Setting
                v-show="showSetting"
                v-on:closed="closed"
                v-on:saved="saved"
              >
              </Setting>
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
            <el-main background-color=red>
              <Chat></Chat>
            </el-main>
          </el-container
        ></el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style lang="stylus" scoped>
.home-header {
  background-color: #5edaa2;
  color: #333;
  text-align: left;
  line-height: 60px;
}
.home-container {
  height: 755px;
  border: 1px solid #eee;
}
.home-main {
  background-color: #a9f1e8;
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
  background-color:white;
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
</style>

<script>
import Chat from "@/components/Chat.vue";
import ChatList from "@/components/ChatList.vue";
import Contacts from "@/components/Contacts.vue";
import Setting from "@/components/Setting.vue";
import Addmember from "@/components/Addmember.vue";

export default {
  components: {
    Setting: Setting,
    ChatList: ChatList,
    Chat: Chat,
    Contacts: Contacts,
    Addmember: Addmember,
  },
  methods: {
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
    closed() {
      this.showSetting = false;
      this.showChatList = true;
    },
    saved() {
      this.$message({
        message: "个人设置更新成功",
        type: "success",
      });
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
        this.dialogTableVisible = true;
      }
    },
  },
  data() {
    return {
      showChatList: true,
      showSetting: false,
      showContacts: false,
      showMember: false,
      dialogTableVisible: false,
    };
  },
};
</script>
