<template>
  <el-card class="box-card">
    <el-container>
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
        <el-row  type="flex" align="middle">
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
      <el-footer height="30px"></el-footer>
    </el-container>
  </el-card>
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

.el-card__body {
  background-color: #409EFF;
}

.top_btn {
  font-weight: bolder;
}

.set_title {
  disabled = 'disabled';
}

.func_btn {
  // font-color:
}

.ava{
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.name_part{
    .name{
        font-weight:bolder
    }
}
</style>
