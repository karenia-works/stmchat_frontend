<template>
  <el-container style="padding:10px;height: 755px; border: 1px solid #eee">
    <el-header class="dark_light_bg dark_main_text">STM-Chat---STM for Lighter Communication</el-header>
    <el-main class="dark_deep_bg">
      <el-row>
        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-card class="dark_midium_bg">
              <div slot="header">
                <el-steps
                  :active="active"
                  finish-status="success"
                  simple
                  style="margin-top: 1px"
                  class="dark_light_bg"
                >
                  <el-step title="基本信息"></el-step>
                  <el-step title="验证绑定"></el-step>
                  <el-step title="获取ID"></el-step>
                </el-steps>
                <el-link
                  :underline="false"
                  style="float:right"
                  v-on:click="ToLogin"
                  class="dark_main_text"
                >已有账户？直接登录</el-link>
              </div>
              <el-row v-show="active0">
                <el-col :span="5">
                  <div class="grid-content"></div>
                </el-col>
                <el-col :span="12">
                  <el-input
                    placeholder="昵称"
                    prefix-icon="el-icon-user-solid"
                    clearable
                    v-model="userName"
                    class="a"
                  ></el-input>

                  <el-input
                    placeholder="手机号"
                    prefix-icon="el-icon-phone-outline"
                    clearable
                    v-model="userNumber"
                  ></el-input>

                  <el-input
                    placeholder="密码"
                    prefix-icon="el-icon-key"
                    v-model="userPasswd"
                    show-password
                  ></el-input>

                  <el-button
                    style="margin-top: 12px;"
                    v-on:click="next"
                    class="dark_light_bg dark_main_text"
                  >下一步</el-button>
                </el-col>
                <el-col :span="5">
                  <div class="grid-content"></div>
                </el-col>
              </el-row>

              <el-row v-show="active1">
                <el-col :span="5">
                  <div class="grid-content"></div>
                </el-col>
                <el-col :span="12">
                  <el-input
                    prefix-icon="el-icon-phone-outline"
                    :disabled="true"
                    v-model="userNumber"
                  ></el-input>

                  <el-input
                    placeholder="已发送短信验证码，请查收并输入"
                    prefix-icon="el-icon-s-promotion"
                    v-model="queryCode"
                  ></el-input>

                  <el-button
                    style="margin-top: 12px;"
                    v-on:click="next"
                    class="dark_light_bg dark_main_text"
                  >下一步</el-button>
                </el-col>
                <el-col :span="5">
                  <div class="grid-content"></div>
                </el-col>
              </el-row>

              <el-row v-show="active2">
                <el-col :span="4">
                  <div class="grid-content"></div>
                </el-col>
                <el-col :span="14">
                  <p class="dark_main_text">
                    注册成功，您可使用手机号或系统分配ID进行登录以及密码的找回。
                    <br />系统分配ID为XXXXXX
                  </p>
                  <el-button
                    style="margin-top: 12px;"
                    v-on:click="next"
                    class="dark_light_bg dark_main_text"
                  >下一步</el-button>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content"></div>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      queryCode: "",
      active: 1,
      active0: true,
      active1: false,
      active2: false,
      userName: "",
      userNumber: "",
      userPasswd: "",
      getUserNumber: this.userNumber,
    };
  },

  methods: {
    next() {
      if (this.active++ > 2) this.$router.push({ path: "/Login" });
      if (this.active == 2) {
        this.active0 = false;
        this.active1 = true;
      } else if (this.active == 3) {
        this.active1 = false;
        this.active2 = true;
      }
    },
    ToLogin() {
      this.$router.push({ path: "/Login" });
    },
    succeed() {
      this.$message({
        message: "验证码通过",
        type: "success",
      });
    },
    wrongCode() {
      this.$message({
        message: "验证码错误，请核实后再次填写",
        type: "warning",
      });
    },
    warning() {
      this.$message({
        message: "该手机号码已有绑定账户",
        type: "warning",
      });
    },

    register() {
      if (
        this.userName == "" ||
        this.userPasswd == "" ||
        this.getUserNumber == ""
      ) {
        alert("基本信息不得为空");
      } else {
        let data = { username: this.userName, password: this.userPasswd };
        this.$http.post("", data).then(res => {
          console.log(res);
          if (res.data == "ok") {
            //
          }
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-header, .el-footer {
  background-color: #5edaa2;
  color: #333;
  text-align: left;
  line-height: 60px;
}

.el-main {
  background-color: #a9f1e8;
  color: #333;
  text-align: center;
  line-height: 70px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
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

.box-card {
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
}
</style>
