<template>
  <el-card class="sgp-card dark_medium_bg">
    <el-container>
      <el-main>
        <el-container>
          <el-aside width="50px">
            <i
              style="font-size: 50px;"
              class="el-icon-camera dark_main_text"
            ></i>
          </el-aside>
          <el-container>
            <el-header
              style="height:20px;margin-top:20px;margin-right:20px;font-size:18px"
              class="dark_main_text"
              >群组名称</el-header
            >
            <el-main>
              <el-input v-model="input" style="border:none"></el-input>
              <hr class="hr111 dark_hr" />
            </el-main>
          </el-container>
        </el-container>
      </el-main>
      <el-footer height="30px">
        <el-button
          style="float: right"
          type="text"
          class="dark_main_text"
          @click="cancelGroup"
          >取消</el-button
        >
        <el-button
          style="float: right;margin-right:20px"
          type="text"
          class="dark_main_text"
          @click="$emit('Groupname', input)"
          >下一步</el-button
        >
        <router-view></router-view>
      </el-footer>
    </el-container>
  </el-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Setgroup",

  data() {
    return {
      input: "",
    };
  },
  methods: {
    createGroup() {
      this.$emit("createGroup");
    },
    cancelGroup() {
      this.$emit("cancelGroup");
    },
  },
});
</script>

<style lang="stylus" scoped>
.hr111 {
  border-style: solid;
  border-radius: 1px;
  border-width: 1px;
  border-color: colors.theme-black;
  background-color: colors.theme-black;
}

.item {
  padding: 18px 0;
}

.el-footer {
  text-align: center;
  color: colors.theme-blue;
}

.el-header {
  text-align: center;
}

.el-main {
  text-align: center;
}

.sgp-card {
  margin-left: 0px;
  margin-right: 0px;
  width: 100%;
  height: 300px;
  margin-top: 100px;
}

.text {
  font-size: 15px;
  color: colors.dark-deep;
}

.el-aside {
  margin-top: 30px;
  text-align: center;
}
</style>
