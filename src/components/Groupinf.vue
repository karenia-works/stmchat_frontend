<template>
  <el-container>
    <el-col>
      <el-card class="box-card up_card">
        <el-header height="15px">
          <el-row>
            <el-col :span="4">
              <div>
                <el-button class="set_title top_btn" type="text">Group Info</el-button>
              </div>
            </el-col>
            <el-col :span="4" :offset="12">
              <div>
                <el-button
                  class="func_btn top_btn"
                  type="text"
                >...</el-button>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-button
                  class="func_btn top_btn"
                  type="text"
                  icon="el-icon-close"
                ></el-button>
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
                <div v-show="!editmode" class="name">{{groupname}}</div>
                <div v-show="editmode" class="name">
                  <el-input v-model="changename" placeholder="Nick name" style="height:35px"></el-input>
                </div>
                <div class="state">42member</div>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-card>

      <el-card class="box-card down_card">
        <el-main height="600px">
          <!-- 群描述 -->

          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-warning-outline"></i>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">{{groupdes}}</div>
                <div class="comment"></div>
              </div>
            </el-col>
          </el-row>
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
                  <el-switch v-model="value1" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-row>   
              </div>
            </el-col>
          </el-row>

          <hr />

          <!-- 群文件部分 -->
          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">{{photonum}} phono</div>
              </div>
            </el-col>
          </el-row>
          
          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-video-camera"></i>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">{{videonum}} video</div>
              </div>
            </el-col>
          </el-row>
          
          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-folder"></i>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">{{filenum}} file</div>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-headset"></i>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">{{audionum}} audio file</div>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-link"></i>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">{{sharenum}} shared link</div>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-microphone"></i>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">{{voicenum}} voice message</div>
              </div>
            </el-col>
          </el-row>


          <hr />

          <!-- 成员信息部分 -->
          <el-row type="flex" align="top">
            <el-col :span="3">
              <div class="icon_part icon_pad">
                <i class="el-icon-s-custom"></i>
              </div>
            </el-col>
            <el-col :span="12" :offset="2">
              <div class="name_part top_pad" type="justify" align="start">
                <div class="content">{{groupnum}} members</div>
              </div>
            </el-col>
            <el-col :span="4" :offset="6">
              <div>
                <el-button
                  class="add_btn"
                  type="text"
                >Add</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="top">
            <div class="usrlist">
              <user></user>
            </div>
          </el-row>


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

<style lang="stylus" scoped="">
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
  text-align:left;
  }

  .set_title {
  disabled = 'disabled';
  color: white;
  }

  .set_title:hover {
  color: white;
  }
  .add_btn{
  color: black;
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
  .usrlist{
    width:100%;
    //height:80px;
   }
</style>

<script>
  export default {
  data() {
  return {
  groupname: "BUAA",
  groupdes:"BUAA-CHAT",
  groupnum:"42",
  photonum:"1204",
  videonum:"12",
  filenum:"28",
  audionum:"1",
  sharenum:"404",
  voicenum:"1",
  editmode: false,
  value1: true,
  };
  },
  methods: {
  formatTooltip(val) {
  return val / 100;
  },
  edit_on() {
  this.changename = this.nickname;
  this.editmode = true;
  },
  save_on() {
  if (this.changename == "") {
  alert("昵称不能为空！");
  this.editmode = false;
  } else {
  this.nickname = this.changename;
  this.editmode = false;
  }
  },
  },
  };
</script>