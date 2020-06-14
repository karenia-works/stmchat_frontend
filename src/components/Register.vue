<template>
  <el-container style="padding: 10px; height: 755px; border: 1px solid #eee;">
    <el-header class="dark_light_bg dark_main_text"
      >STM-Chat---STM for Lighter Communication</el-header
    >
    <el-main class="dark_deep_bg">
      <el-row>
        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card dark_medium_bg" shadow="always">
            <div slot="header" class="dark_main_text">
              Welcome to STM-Chat
              <el-link
                :underline="false"
                style="float: right;"
                v-on:click="ToLogin"
                class="dark_main_text"
                >已有账户？即刻登录</el-link
              >
            </div>
            <el-row>
              <el-col :span="5">
                <div class="grid-content"></div>
              </el-col>
              <el-col :span="12">
                <div class="demo-input-suffix">
                  <el-input
                    placeholder="用户名"
                    prefix-icon="el-icon-user-solid"
                    clearable
                    v-model="userID"
                  ></el-input>

                  <el-input
                    placeholder="密码"
                    prefix-icon="el-icon-key"
                    v-model="userPasswd"
                    show-password
                  ></el-input>

                  <el-button
                    type="primary"
                    v-on:click="register"
                    class="dark_light_bg"
                    >注册</el-button
                  >
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content"></div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style lang="stylus" scoped>
.el-header, .el-footer {
  background-color: colors.theme-green;
  color :colors.theme-black
  text-align: left;
  line-height: 60px;
}

.el-main {
  background-color: colors.theme-light-green;
  color :colors.theme-black
  text-align: center;
  line-height: 70px;
}

.box-card {
  width: 700px;
  align: center;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
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

<script>
export default {
  methods: {
    register() {
      if (this.userName == "" || this.userPasswd == "") {
        alert("基本信息不得为空");
      } else {
        let data = { username: this.userName, password: this.userPasswd };
        this.$http.post("", data).then((res) => {
          console.log(res);
          if (res.data == "ok") {
            //
          }
        });
      }
    },
    ToLogin() {
      this.$router.push({ path: "/Login" });
    },
    succeed() {
      this.$message({
        message: "注册成功",
        type: "success",
      });
      this.$router.push({ path: "/Login" });
    },
    warning() {
      this.$message({
        message: "用户名重复",
        type: "warning",
      });
    },
  },
  data() {
    return {
      userID: "",
      userPasswd: "",
    };
  },
};
</script>
