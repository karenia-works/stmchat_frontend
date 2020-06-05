<template>
  <el-card class="sgp-card">
    <el-container>
      <el-main height="600px">
        <el-container>
          <el-aside width="50px">
            <i style="font-size: 50px;" class="el-icon-camera"></i>
          </el-aside>
          <el-container>
            <el-header style="height:20px;margin-top:20px;margin-right:20px;"
              >Group name</el-header
            >
            <el-main>
              <el-input v-model="input" style="border:none"></el-input>
              <hr style="border:1.0px inset #303133;" />
            </el-main>
          </el-container>
        </el-container>
      </el-main>
      <el-footer height="30px">
        <el-button style="float: right" type="text">CANCEL</el-button>
        <el-button
          style="float: right;margin-right:20px"
          type="text"
          v-on:click="goadd"
          >NEXT</el-button
        >
        <router-view></router-view>
      </el-footer>
    </el-container>
  </el-card>
</template>

<script>
export default {
  name: "Setgroup",
  data() {
    return {
      input: "",
    };
  },
  methods: {
    goadd() {
      this.$router.push({ path: "/Addmember" });
    },
  },
};
</script>

<style lang="stylus" scoped>
.item {
  padding: 18px 0;
}
.el-footer {
  text-align: center;
  color: #409eff;
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
  color: #303133;
}
.el-aside {
  margin-top: 30px;
  text-align: center;
}
</style>
