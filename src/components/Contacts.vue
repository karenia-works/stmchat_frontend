<template>
  <el-card class="box-card">
    <el-container>
      <el-header height="15px"><span>Contacts</span></el-header>
      <el-main height="600px"><user></user></el-main>
      <el-footer height="30px">
        <el-button style="float: left" type="text">ADD CONTACT</el-button>
        <el-button style="float: right" type="text">CLOSE</el-button>
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
</style>
