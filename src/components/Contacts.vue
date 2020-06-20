<template>
  <el-card class="box-card dark_medium_bg">
    <el-container>
      <el-header height="15px" class="dark_main_text">
        <span>联系人列表</span>
      </el-header>
      <el-main height="600px">
        <user @selectUser="getMsgFormSon" :items="list"></user>
      </el-main>
      <el-footer height="30px">
        <el-button style="float: left" type="text" class="dark_main_text"
          >添加联系人</el-button
        >
        <el-button
          style="float: right"
          type="text"
          class="dark_main_text"
          @click="close"
          >关闭</el-button
        >
      </el-footer>
    </el-container>
  </el-card>
</template>

<script>
export default {
  name: "Contacts",
  data() {
    return {
      list: [
        {
          avatarUrl:
            "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
          username: "li",
          state: true,
        },
        {
          avatarUrl:
            "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
          username: "wang",
          state: false,
        },
      ],
    };
  },
  methods: {
    close() {
      this.$emit("contactClose");
    },
    getMsgFormSon(data) {
      console.log(data);
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
