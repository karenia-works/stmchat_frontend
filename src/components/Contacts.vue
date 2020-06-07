<template>
  <el-card class="box-card dark_midium_bg">
    <el-container>
      <el-header height="15px" class="dark_main_text">
        <span>Contacts</span>
      </el-header>
      <el-main height="600px">
        <user></user>
      </el-main>
      <el-footer height="30px">
        <el-button style="float: left" type="text" class="dark_main_text">ADD CONTACT</el-button>
        <el-button style="float: right" type="text" class="dark_main_text">CLOSE</el-button>
      </el-footer>
    </el-container>
  </el-card>
</template>

<script>
export default {
  name: "Contacts",
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
    background-color: #606266;
    border-color: #44474E;
  }

  .dark_midium_bg {
    background-color: #44474E;
    border-color: #606266;
  }

  .dark_deep_bg {
    background-color: #303133;
  }

  .dark_sub_text {
    color: #909399;
  }

  .dark_main_text {
    color: #E4E7ED;
  }
}
</style>
