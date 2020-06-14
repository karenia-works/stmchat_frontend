<template>
  <el-card class="box-card dark_medium_bg">
    <el-container class="contacts-container">
      <el-header style="height:20%" class="dark_main_text">
        <span>通讯录</span>
      </el-header>
      <el-main style="height:60%">
        <user></user>
      </el-main>
      <el-footer style="height:20%">
        <el-button
          style="float: left"
          type="text"
          class="dark_main_text"
          @click="addContacts"
          >添加新联系人</el-button
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
  methods: {
    close() {
      this.$emit("contactClose");
    },
    addContacts() {
      this.$emit("addContacts");
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
  width: 100%
  border-radius: 0px;
  max-height: 650px;
  margin-left: 0px;
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
