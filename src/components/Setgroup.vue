<template>
  <el-card class="sgp-card dark_midium_bg">
    <el-container>
      <el-main height="600px">
        <el-container>
          <el-aside width="50px">
            <i style="font-size: 50px;" class="el-icon-camera dark_main_text"></i>
          </el-aside>
          <el-container>
            <el-header
              style="height:20px;margin-top:20px;margin-right:20px;"
              class="dark_main_text"
            >Group name</el-header>
            <el-main>
              <el-input v-model="input" style="border:none"></el-input>
              <hr class="hr111 dark_hr" />
            </el-main>
          </el-container>
        </el-container>
      </el-main>
      <el-footer height="30px">
        <el-button style="float: right" type="text" class="dark_main_text">CANCEL</el-button>
        <el-button
          style="float: right;margin-right:20px"
          type="text"
          v-on:click="goadd"
          class="dark_main_text"
        >NEXT</el-button>
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
.hr111 {
  border-width: 1px;
  border-style: inset;
  border-color: #333;
}

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

  .dark_hr {
    border-width: 1px;
    border-style: inset;
    border-color: white;
  }
}
</style>
