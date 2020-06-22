<template>
  <el-card class="box-card dark_medium_bg">
    <el-container>
      <el-header height="15px">
        <span class="dark_main_text">添加成员</span>
        <span class="mem-num dark_sub_text">1/200000</span>
      </el-header>
      <el-main style="height:550px">
        <user @selectUser="getMsgFormSon" :items="list"></user>
      </el-main>
      <el-footer height="30px">
        <el-button
          style="float: right"
          type="text"
          class="dark_main_text"
          @click="cancel"
          >取消</el-button
        >
        <el-button
          style="float: right;margin-right:20px"
          type="text"
          class="dark_main_text"
          @click="create"
          >创建</el-button
        >
      </el-footer>
    </el-container>
  </el-card>
</template>

<script lang="ts">
import axios from "axios"
import { serviceProvider , TYPES } from "@/services/dependencyInjection";
import { GroupProfilePool } from "@/services/cachingService";
export default {
  name: "Addmember",
  data() {
    return {
      username:"",
       list: [
      ],
      avatarUrl:"",
      groupname:"test",
      members:[],
    };
  },
  beforeMount:function(){
    this.getList()
   },
  methods: {
    create(){
      this.$emit('Groupmem',this.members);
      this.$emit("create");
    },
    cancel() {
      this.$emit("cancel");
    },
    getMsgFormSon(data) {
      this.username=data;
      console.log(this.username);
      this.members.push(this.username);
      this.list.forEach((item,i)=>{
          if (item.username == this.username){
               this.list.splice(i,1);
                return true;
           }
       });
    },
    getList(){
      axios({
        url:'http://yuuna.srv.karenia.cc/api/v1/profile/wang/friends',
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
  width: 100%;
  border-radius: 0px;
  height: 650px;
  margin-left: 0px;
}

.mem-num {
  font-size: 13px;
  color: colors.theme-grey;
  margin-left: 20px;
}

.text {
  font-size: 15px;
}
</style>
