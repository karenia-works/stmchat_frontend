<template>
  <div>
    <div class="background">
      <img :src="imgSrc" width="100%" height="100%" alt="" />
    </div>
    <div class="front" width="100%" height="100%">
      <el-container style="padding-top: 10px; height: 755px;">
        <el-header class="dark_light_bg dark_main_text"></el-header>
        <el-main class="dark_deep_bg">
          <el-row>
            <el-col :span="6">
              <div class="grid-content"></div>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card dark_medium_bg" shadow="always">
                <div slot="header" class="dark_main_text">
                  <div style="font-size:25px;text-align:center">
                    Welcome to STM-Chat
                  </div>
                  <div>
                    <el-link
                      :underline="false"
                      style="float: right;font-size:18px;color:black"
                      v-on:click="ToRegister"
                      class="dark_main_text"
                      >暂无账户？马上注册</el-link
                    >
                  </div>
                </div>
                <el-row>
                  <el-col :span="5">
                    <div class="grid-content"></div>
                  </el-col>
                  <el-col :span="15">
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
                        v-on:click="login"
                        class="dark_light_bg"
                        >登录</el-button
                      >
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content"></div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="3">
              <div class="grid-content"></div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.el-header, .el-footer {
  color :colors.theme-black
  text-align: left;
  line-height: 60px;
}

.el-main {
  color :colors.theme-black
  text-align: center;
  line-height: 70px;
}

.box-card {
  width: 700px;
  background: rgba(255,255,255,0.5);
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
.background{
  background-size: cover;
  width:100%;
  height:100%;
  z-index:-1;
  position: fixed;
  top:0px;
  left:0px;
  right:0px;
  bottom:0px;
}

.front{
  z-index:1;
  top:0px;
  left:0px;
  right:0px;
  bottom:0px;
  position: fixed;
  width:100%;
  height:100%;
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
import { serviceProvider, TYPES } from "../services/dependencyInjection.ts";
import { LoginService } from "../services/loginService.ts";

export default {
  methods: {
    async login() {
      if (this.userID == "" || this.userPasswd == "") {
        this.warning("登录信息不得为空");
      } else {
        let userLogin = serviceProvider.resolve(LoginService);
        try {
          let res = await userLogin.login(this.userID, this.userPasswd);
          console.log(res);
          if (res == true) {
            this.succeed();
            this.$store.state.userID = this.userID;
            console.log(this.$store.state.userID);
            this.$router.push({ path: "/" });
          } else {
            this.warning("登录信息错误");
          }
        } catch (err) {
          this.warning("登录信息错误");
        }
      }
    },
    ToRegister() {
      this.$router.push({ path: "/Regist" });
    },
    succeed() {
      this.$message({
        message: "登录成功",
        type: "success",
      });
    },
    warning(text) {
      this.$message({
        message: text,
        type: "warning",
      });
    },
  },
  data() {
    return {
      imgSrc:
        "http://img.pptjia.com/image/20180720/62b5f21d96b6b0c2c72baa7e72b7926f.png",
      userID: "",
      userPasswd: "",
    };
  },
};
</script>
