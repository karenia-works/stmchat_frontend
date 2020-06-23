<template>
  <el-card class="box-card dark_medium_bg">
    <el-container>
      <el-header height="15px" class="dark_main_text">
        <span>联系人列表</span>
      </el-header>
      <el-main style="height:550px">
        <user @selectUser="getMsgFormSon" :items="list"></user>
      </el-main>
      <el-footer height="30px">
        <el-button
          style="float: left"
          type="text"
          class="dark_main_text"
          @click="addContacts"
          >添加联系人</el-button
        >
        <el-button
          style="float: right"
          type="text"
          class="dark_main_text"
          @click="close"
          >关闭</el-button>
      </el-footer>
    </el-container>
  </el-card>
</template>

<script>
import axios from "axios"
import { serviceProvider , TYPES } from "@/services/dependencyInjection";
import { LoginService } from "@/services/loginService";
export default {
  name: "Contacts",
  data() {
    return {
       list: [],
       avatarUrl:"",
    };
  },
  beforeMount:function(){
    this.getList()
   },
  methods: {
    addContacts() {
      this.$emit("addContacts");
    },
    close() {
      this.$emit("contactClose");
    },
    getMsgFormSon(data) {
      console.log(data);
    },
    getList(){
      let loginService = serviceProvider.resolve(LoginService);
      let state = loginService.getLoginState();
      let name = state.getUsername();
      console.log("login state: ", state.getUsername());
      axios({
        url:'http://yuuna.srv.karenia.cc/api/v1/profile/'+name+'/friends',
        method:'get',
      }).then(data=>{
          this.list=data.data
        });
     },
  },
};
</script>

<style lang="stylus" scoped>
.item {
  padding: 18px 0;
}

.el-header {
  text-align: center;
}

.el-footer {
  text-align: center;
}

.el-main {
  text-align: center;
}

.box-card {
  border-radius: 0px;
  height: 650px;
  margin-left: 0px;
}
</style>
