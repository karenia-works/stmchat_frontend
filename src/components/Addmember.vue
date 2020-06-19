<template>
  <el-card class="box-card dark_medium_bg">
    <el-container>
      <el-header height="15px">
        <span class="dark_main_text">Add Members</span>
        <span class="mem-num dark_sub_text">1/200000</span>
      </el-header>
      <el-main height="600px">
        <user @selectUser="getMsgFormSon"></user>
      </el-main>
      <el-footer height="30px">
        <el-button
          style="float: right"
          type="text"
          class="dark_main_text"
          @click="cancel"
          >CANCEL</el-button
        >
        <el-button
          style="float: right;margin-right:20px"
          type="text"
          class="dark_main_text"
          @click="create"
          >CREATE</el-button
        >
      </el-footer>
    </el-container>
  </el-card>
</template>

<script>
export default {
  name: "Addmember",
  data() {
    return {
      msgFormSon: "this is msg",
    };
  },
  methods: {
    create() {
      this.$emit("create");
    },
    cancel() {
      this.$emit("cancel");
    },
    getMsgFormSon(data) {
      this.msgFormSon = data;
      console.log(this.msgFormSon);
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
