<template>
  <el-container style="width=100%">
    <el-col>
      <el-card class="box-card up_card">
        <el-main>
          <!-- main开始 -->
          <el-row type="flex">
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
                <span v-show="!editmode" class="name">{{ me.name }} </span>
                <el-divider direction="vertical"></el-divider>
                <span class="state">{{ me.members.length }} members </span>
              </div>
            </el-col>
            <el-col :span="2" :offset="6">
              <div>
                <el-button
                  class="func_btn top_btn"
                  type="text"
                  icon="el-icon-close"
                  v-on:click="close"
                ></el-button>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-card>

      <el-card class="box-card down_card">
        <el-container>
          <el-aside>
            <!-- 群描述 -->

            <el-row type="flex" align="top">
              <el-col :span="3">
                <div class="icon_part icon_pad">
                  <i class="el-icon-warning-outline"></i>
                </div>
              </el-col>
              <el-col :span="12" :offset="2">
                <div class="name_part top_pad" type="justify" align="start">
                  <div class="content">{{ me.describe }}</div>
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
                  <el-row
                    class="top_pad"
                    type="flex"
                    justify="space-between"
                    align="middle"
                  >
                    <div class="content">Desktop Notifications</div>
                    <el-switch
                      v-model="value1"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                    ></el-switch>
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
                  <div class="content">{{ photonum }} phono</div>
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
                  <div class="content">{{ videonum }} video</div>
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
                  <div class="content">{{ filenum }} file</div>
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
                  <div class="content">{{ audionum }} audio file</div>
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
                  <div class="content">{{ sharenum }} shared link</div>
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
                  <div class="content">{{ voicenum }} voice message</div>
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
                  <div class="content">{{ groupnum }} members</div>
                </div>
              </el-col>
              <el-col :span="4" :offset="6">
                <div>
                  <el-button class="add_btn" type="text">Add</el-button>
                </div>
              </el-col>
            </el-row>
          </el-aside>
          <div
            style="height:450px; width:1px; margin-left:10px;border-left:1px solid"
          ></div>
          <el-main>
            <el-row type="flex" align="top">
              <div class="usrlist">
                <user @selectUser="getMsgFormSon" :items="contacts"></user>
              </div>
            </el-row>
          </el-main>
        </el-container>
      </el-card>
    </el-col>
  </el-container>
</template>

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

.top_btn {
  font-weight: bolder;
  text-align: left;
}

.set_title {
  disabled = 'disabled';
  color: white;
}

.set_title:hover {
  color: white;
}

.add_btn {
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
  width:600px;
  height:90px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.down_card {
  width:600px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.el-card {
  border-top: 0px;
  border-bottom: 0px;
}

.ava {
  width: 40%;
  height: 40%;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.name_part {
  .name {
    font-weight: bolder;
    font-size:20px;
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
  font-size: 20px;
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

.usrlist {
  width: 100%;
  // height:80px;
}
</style>

<script>
import axios from "axios";
export default {
  data() {
    return {
      groupname: "BUAA",
      groupdes: "BUAA-CHAT",
      groupnum: "42",
      photonum: "1204",
      videonum: "12",
      filenum: "28",
      audionum: "1",
      sharenum: "404",
      voicenum: "1",
      editmode: false,
      value1: true,
      me: [],
      contacts: [],
      endpoint: " http://yuuna.srv.karenia.cc/api/v1",
    };
  },
  beforeMount: function() {
    this.getProfile();
  },
  methods: {
    getMsgFormSon(data) {
      this.msgFormSon = data;
      console.log(this.msgFormSon);
    },
    getProfile() {
      this.me = {
        id: "5eec7cd9c1e7520001d26e82",
        name: "family",
        isFriend: false,
        owner: "wang",
        describe: "wei are family",
        members: ["wang", "he", "li"],
        chatlog: "5eec7cd9c1e7520001d26e81",
      };
      this.getContacts();
    },
    getContacts() {
      if (!this.me) return;
      this.me.members.forEach(id => {
        axios
          .get(this.endpoint + "/profile/" + id)
          .then(res => {
            let pf = res.data;
            this.contacts.push({
              username: id,
              avatarUrl: pf.avatarUrl,
              state: pf.state,
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    close() {
      this.$emit("closeInfo");
    },
  },
};
</script>
