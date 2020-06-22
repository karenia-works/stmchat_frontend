<template>
  <el-card class="box-card dark_medium_bg">
    <el-container>
      <el-header height="15px">
        <span class="dark_main_text">添加成员</span>
        <span class="mem-num dark_sub_text">1/200000</span>
      </el-header>
      <el-main height="600px">
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
          @click="$emit('Groupmem',members)"
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
  width: 400px;
  margin-left: 50px;
}

.mem-num {
  font-size: 13px;
  color: colors.theme-grey;
  margin-left: 20px;
}

.text {
  font-size: 15px;
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
}
</style>
