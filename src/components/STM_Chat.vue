<template>
  <el-container class="container">
    <el-header class="dark_light_bg dark_main_text">STM-Chat---STM for Lighter Communication</el-header>
    <el-main class="dark_deep_bg">
    <el-row type="flex" justify="center">
        <el-col :span="6"><div>
            <Setting v-show="showSetting" v-on:closed="closed" v-on:saved="saved"></Setting>
            <ChatList v-show="showChatList" v-on:chatListCommand="chatListCommand($event)"></ChatList>
            <Contacts v-show="showContacts" v-on:contactClose="contactClose"></Contacts>
            <Addmember v-show="showMember" v-on:create="create" v-on:cancel="cancel"></Addmember>
        </div></el-col>
        <el-col :span="12"><div><Chat></Chat></div></el-col>
    </el-row>
    </el-main>
  </el-container>
</template>

<style lang="stylus" scoped>
.el-header, .el-footer {
  background-color: #5edaa2;
  color: #333;
  text-align: left;
  line-height: 60px;
}
.container{
  height: 755px;
  border: 1px solid #eee;
}
.el-main {
  background-color: #a9f1e8;
  color: #333;
  text-align: center;
  line-height: 70px;
}

.box-card {
  align: center;
}

.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.grid-content {
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
    'Setting': Setting,
    'ChatList': ChatList,
    'Chat': Chat,
    'Contacts': Contacts,
    'Addmember': Addmember,
  },
  methods: {
    create(){
        this.showMember=false;
        this.showChatList=true;
        this.$message({
          message: 'Group Created',
          type: 'success'
        });
    },
    cancel(){
        this.showMember=false;
        this.showChatList=true;
    },
    contactClose(){
        this.showContacts=false;
        this.showChatList=true;
    },
    closed() {
      this.showSetting = false;
      this.showChatList=true;
    },
    saved(){
        this.$message({
          message: 'Settings Updated',
          type: 'success'
        });
    },
    chatListCommand(arg){
        if(arg=='a'){
        this.$prompt('Group Name', 'Create a Group', {
          confirmButtonText: 'Next',
          cancelButtonText: 'Cancel',
        }).then(({ value }) => {
          this.$message('Add Group Members');
          this.showChatList=false;
          this.showMember=true;
        }).catch(() => {
            this.showChatList=true;
            this.showMember=false;
        });
        
        }else if(arg=='b'){
            this.showChatList=false;
            this.showContacts=true;
        }else if(arg=='c'){
            this.showChatList=false;
            this.showSetting=true;
        }
    },
  },
  data() {
      return {
      showChatList: true,
      showSetting: false,
      showContacts: false,
      showMember: false,
    };
  },
};
</script>
