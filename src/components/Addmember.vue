<template>
  <el-card class="box-card">
    <el-container>
      <el-header height="15px">
        <span>Add Members</span>
        <span class="mem-num">1/200000</span>
      </el-header>
      <el-main heitght="600px"><user></user></el-main>
      <el-footer height="30px">
        <el-button style="float: right" type="text">CANCEL</el-button>
        <el-button style="float: right;margin-right:20px" type="text"
          >CREAT</el-button
        >
      </el-footer>
    </el-container>
  </el-card>
</template>

<script>
export default {
  name: "Addmember",
};
</script>
<style>
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
  color: #999;
  margin-left: 20px;
}
.text {
  font-size: 15px;
}
</style>
