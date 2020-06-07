<template>
  <el-container>
    <el-col>
      <el-card class="box-card up_card">
        <el-header height="15px">
          <el-row>
            <el-col :span="4">
              <div>
                <el-button disabled="disabled" class="set_title top_btn" type="text">Settings</el-button>
              </div>
            </el-col>
            <el-col :span="4" :offset="12">
              <div>
                <el-button class="func_btn top_btn" type="text">Edit</el-button>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-button class="func_btn top_btn" type="text">Close</el-button>
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
                  <img class="ava" src="https://i.loli.net/2020/06/05/Ym1yW5dCfaH2AnU.jpg" />
                </a>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part" type="justify" align="start">
                <div class="name">Skuld</div>
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
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">+86 13918128942</div>
                <div class="comment">phone number</div>
              </div>
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">@skuld_yi</div>
                <div class="comment">username</div>
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
                <el-row class="top_pad" type="flex" justify="space-between" align="middle">
                  <div class="content">Desktop Notifications</div>
                  <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-row>
                <el-row class="top_pad" type="flex" justify="space-between" align="middle">
                  <div class="content">Background Notifications</div>
                  <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-row>
                <el-row class="top_pad" type="flex" justify="space-between" align="middle">
                  <div class="content">Message preview</div>
                  <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-row>
                <el-col>
                  <el-row class="top_pad" type="flex" justify="space-between" align="middle">
                    <div class="content">Sound</div>
                    <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                  </el-row>
                  <div class="block">
                    <el-slider v-model="value2"></el-slider>
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
              <el-row class="top_pad" type="flex" justify="space-between" align="middle">
                <div class="content">Sound</div>
                <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </el-row>
            </el-col>
          </el-row>

          <hr />

          <!-- 登出 -->

          <div>
            <el-button class="top_btn" type="text">Log Out</el-button>
          </div>

          <!-- main结束 -->
        </el-main>
        <el-footer height="30px"></el-footer>
      </el-card>
    </el-col>
  </el-container>
</template>

<script>
export default {
  name: "Setting",
};
</script>

<style lang="stylus" scoped>
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
  disabled = 'disabled';
  color: white;
}

.set_title:hover {
  color: white;
}

.func_btn {
  color: #dde8f1;

  :hover {
    color: white;
  }
}

.up_card {
  background-color: #409EFF;
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
    background-color: #606266;
  }

  .down_card {
    background-color: #303133;

    .comment {
      color: #909399;
    }

    .content {
      color: #E4E7ED;
    }
  }

  .icon_part {
    color: #E4E7ED;
  }
}

// @media (prefers-color-scheme: light) {
// }
</style>

<script>
export default {
  data() {
    return {
      value: true,
      value2: 50,
    };
  },
  methods: {
    formatTooltip(val) {
      return val / 100;
    },
  },
};
</script>