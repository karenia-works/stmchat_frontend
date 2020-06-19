<template>
  <el-container>
    <el-aside width="70px">
      <el-avatar :size="50" :src=dataList.circleUrl></el-avatar>
    </el-aside>
    <el-container>
      <el-header height="30px" class="dark_main_text">{{dataList.usrId}}</el-header>
      <el-footer height="20px" class="dark_sub_text">Footer</el-footer>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "Userlist",
  props: {
    dataList: {
      type: [Object],
    },
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
