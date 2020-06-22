<template>
  <el-card class="sgp-card dark_medium_bg">
    <el-container>
      <el-main height="600px">
        <el-container>
          <el-aside width="50px">
            <i
              style="font-size: 50px;"
              class="el-icon-camera dark_main_text"
            ></i>
          </el-aside>
          <el-container>
            <el-header
              style="height:20px;margin-top:20px;margin-right:20px;"
              class="dark_main_text"
              >Group name</el-header
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
          >CANCEL</el-button
        >
        <el-button
          style="float: right;margin-right:20px"
          type="text"
          class="dark_main_text"
          @click="$emit('Groupname',input)"
          >NEXT</el-button
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
  width: 400px;
  margin-left: 100px;
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
}
</style>
