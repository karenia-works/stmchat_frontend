<template>
  <el-container style="padding-top:10px">
    <el-col>
      <el-card class="box-card up_card">
        <el-header height="15px">
          <el-row>
            <el-col :span="4">
              <div>
                <el-button class="set_title top_btn" type="text"
                  >设置</el-button
                >
              </div>
            </el-col>
            <el-col :span="4" :offset="12">
              <div>
                <el-button
                  v-show="!editmode"
                  v-on:click="edit_on"
                  class="func_btn top_btn"
                  type="text"
                  >编辑</el-button
                >
                <el-button
                  v-show="editmode"
                  v-on:click="save_on"
                  class="func_btn top_btn"
                  type="text"
                  >保存</el-button
                >
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-button
                  class="func_btn top_btn"
                  type="text"
                  v-on:click="closeWindow"
                  >关闭</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-header>

        <el-main height="600px">
          <!-- main开始 -->
          <el-row type="flex" align="middle">
            <el-col :span="6">
              <div class="ava_part">
                <a href="https://sm.ms/image/Ym1yW5dCfaH2AnU" target="_blank">
                  <img
                    class="ava"
                    src="https://i.loli.net/2020/06/05/Ym1yW5dCfaH2AnU.jpg"
                  />
                </a>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part" type="justify" align="start">
                <div v-show="!editmode" class="name">{{ nickname }}</div>
                <div v-show="editmode" class="name">
                  <el-input
                    v-model="changename"
                    placeholder="Nick name"
                    style="height:35px"
                  ></el-input>
                </div>
                <div class="state">online</div>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-card>

      <el-card class="box-card down_card">
        <el-main height="600px">
          <!-- 电话号码部分 -->

          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-phone"></i>
                <i class="el-icon-user"></i>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">{{ phonenum }}</div>
              </div>
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">@{{ username }}</div>
              </div>
            </el-col>
          </el-row>

          <hr />

          <!-- 通知部分 -->

          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-bell"></i>
              </div>
            </el-col>
            <el-col :span="19" :offset="2">
              <div class="name_part" type="justify" align="start">
                <el-row
                  class="top_pad"
                  type="flex"
                  justify="space-between"
                  align="middle"
                >
                  <div class="content">全局提醒</div>
                  <el-switch
                    v-model="valueDesktopNotifications"
                    @change="changeDesktopNotifications"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </el-row>
                <el-row
                  class="top_pad"
                  type="flex"
                  justify="space-between"
                  align="middle"
                >
                  <div class="content">背景提醒</div>
                  <el-switch
                    v-model="valueBackgroundNotifications"
                    @change="changeBackgroundNotifications"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </el-row>
                <el-row
                  class="top_pad"
                  type="flex"
                  justify="space-between"
                  align="middle"
                >
                  <div class="content">消息预览</div>
                  <el-switch
                    v-model="valueMessagepreview"
                    @change="changeMessagepreview"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </el-row>
                <el-col>
                  <el-row
                    class="top_pad"
                    type="flex"
                    justify="space-between"
                    align="middle"
                  >
                    <div class="content">声音</div>
                    <el-switch
                      v-model="valueSound"
                      @change="changeSound"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                    ></el-switch>
                  </el-row>
                  <div class="block">
                    <el-slider
                      v-model="soundDegree"
                      @change="changeSoundDegree"
                    ></el-slider>
                  </div>
                </el-col>
              </div>
            </el-col>
          </el-row>

          <hr />

          <!-- 快捷键部分 -->

          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-s-operation"></i>
              </div>
            </el-col>
            <el-col :span="19" :offset="2" align="start">
              <div class="content top_pad">快捷键</div>
              <el-col :span="19" align="start">
                <el-radio
                  class="radio_pad"
                  v-model="radio"
                  @change="changeToRadio1"
                  label="1"
                >
                  <strong>Enter</strong> - 发送消息,
                  <br />
                  <strong>Shift + Enter</strong>
                  - 换行
                </el-radio>
                <el-radio
                  class="radio_pad"
                  v-model="radio"
                  @change="changeToRadio2"
                  label="2"
                >
                  <strong>Ctrl + Enter</strong> - 发送消息,
                  <br />
                  <strong>Enter</strong>
                  - 换行
                </el-radio>
              </el-col>
            </el-col>
          </el-row>

          <hr />

          <!-- main结束 -->
        </el-main>
      </el-card>
    </el-col>
  </el-container>
</template>

<script>
export default {
  name: "Setting",
};
</script>

<style lang="stylus">
@import '../styles/colors.styl';

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

.top_btn {
  font-weight: bolder;
}

.set_title {
  color: colors.theme-light-grey;
}

.set_title:hover {
  color: colors.theme-light-grey;
}

.func_btn {
  color: colors.theme-light-grey;
}

.up_card {
  background-color: colors.theme-blue;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.down_card {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.el-card {
  border-top: 0px;
  border-bottom: 0px;
}

.ava {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.name_part {
  .name {
    font-weight: bolder;
  }
}

.icon_part {
  font-size: 25px;
}

.top_pad {
  padding-top: 10px;
  padding-bottom: 10px;
}

.radio_pad {
  padding-top: 0px;
  padding-bottom: 10px;
}

.icon_pad {
  padding-top: 5px;
}

.content {
  font-weight: bolder;
}

.comment {
  padding-top: 10px;
  font-size: 15px;
}

.name {
  color: white;
  padding-bottom: 10px;
}

.state {
  font-size: 15px;
  color: white;
}

@media (prefers-color-scheme: dark) {
  .up_card {
    background-color: colors.dark-light;
  }

  .down_card {
    background-color: colors.dark-deep;

    .comment {
      color: colors.dark-sub-text;
    }

    .content {
      color: colors.dark-main-text;
    }
  }

  .icon_part {
    color: colors.dark-main-text;
  }
}
</style>

<script>
export default {
  data() {
    return {
      nickname: "Skuld",
      changename: "",
      phonenum: "+86 13918128942",
      username: "skuld_yi",
      editmode: false,
      valueDesktopNotifications: true,
      valueBackgroundNotifications: true,
      valueMessagepreview: true,
      valueSound: true,
      radio: "1",
      soundDegree: 50,
    };
  },
  methods: {
    formatTooltip(val) {
      return val / 100;
    },
    closeWindow() {
      this.$emit("closed");
    },
    logOut() {
      alert("已成功退出账户");
      this.$router.push({ path: "Login" });
    },
    edit_on() {
      this.changename = this.nickname;
      this.editmode = true;
    },
    save_on() {
      if (this.changename == "") {
        alert("昵称不能为空！");
        this.editmode = false;
      } else if (this.changename == this.nickname) {
        alert("昵称不能与之前昵称相同！");
        this.editmode = false;
      } else {
        this.nickname = this.changename;
        alert('昵称已成功变更为 "' + this.changename + '"');
        this.editmode = false;
        this.$emit("saved");
      }
    },
    changeDesktopNotifications() {
      alert(this.valueDesktopNotifications ? "全局提醒： 开" : "全局提醒： 关");
    },
    changeBackgroundNotifications() {
      alert(
        this.valueBackgroundNotifications ? "背景提醒： 开" : "背景提醒： 关",
      );
    },
    changeMessagepreview() {
      alert(this.valueMessagepreview ? "消息预览： 开" : "消息提醒： 关");
    },
    changeSound() {
      alert(this.valueSound ? "声音提醒： 开" : "声音提醒： 关");
    },
    changeSoundDegree() {
      alert("音量大小： " + this.soundDegree);
    },
    changeToRadio1() {
      alert("已改为：回车键发送消息");
    },
    changeToRadio2() {
      alert("已改为：回车键换行");
    },
  },
};
</script>
