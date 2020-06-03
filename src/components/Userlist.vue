<template>
  <el-container>
    <el-aside width="70px">
      <el-avatar :size="50" :src="circleUrl"></el-avatar>
    </el-aside>
    <el-container>
      <el-header height="30px">Header</el-header>
      <el-footer height="20px">Footer</el-footer>
    </el-container>
  </el-container>
</template>
<script>
  export default {
     name: "Userlist",
    data () {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      }
    }
  }
</script>
<style>
  .el-header{
    text-align: left;
  }
  .el-footer{
    text-align:left;
    font-size: 13px;
    color: #999;
    }
  .el-aside {
    text-align: center;
    justify-content: center;
    height: 70px;
  }
</style>