<template>
  <el-container>
    <el-aside width="70px">
      <el-avatar :size="50" :src="circleUrl"></el-avatar>
    </el-aside>
    <el-container>
      <el-header height="30px" class="dark_main_text">Header</el-header>
      <el-footer height="20px" class="dark_sub_text">Footer</el-footer>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "Userlist",
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    };
  },
};
</script>
<style lang="stylus" scoped>
.el-header {
  text-align: left;
}

.el-footer {
  text-align: left;
  font-size: 13px;
  color: #999;
}

.el-aside {
  text-align: center;
  justify-content: center;
  height: 70px;
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
