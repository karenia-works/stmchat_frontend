<template>
  <el-container style="padding:10px;height: 755px; border: 1px solid #eee">
    <el-header>STM-Chat---STM for Lighter Communication</el-header>
    <el-main>
      <el-row>
        <el-col :span="6"><div class="grid-content"></div></el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="always">
            <div slot="header">Welcome to STM-Chat
              <el-link :underline="false"  style="float:right" v-on:click="ToRegister">暂无账户？马上注册</el-link>
            </div>
            <el-row>
              <el-col :span="5"><div class="grid-content"></div></el-col>
              <el-col :span="12"><div class="demo-input-suffix">
                <el-input
                 placeholder="用户ID/手机号"
                 prefix-icon="el-icon-user-solid"
                 clearable
                 v-model="userID">
                </el-input>
                
                <el-input
                 placeholder="密码"
                 prefix-icon="el-icon-key"
                 v-model="userPasswd"
                 show-password>
                 </el-input>
                 
                 <el-button type="primary" v-on:click="login">登录</el-button>
                </div></el-col>
              <el-col :span="6"><div class="grid-content"></div></el-col>
            </el-row>
          </el-card>                
        </el-col>
        <el-col :span="6"><div class="grid-content"></div></el-col>
      </el-row>
    </el-main>
  </el-container>
</template>


<style>
  .el-header, .el-footer {
    background-color: #5EDAA2;
    color: #333;
    text-align: left;
    line-height: 60px;
  }
  .el-main {
    background-color: #A9F1E8;
    color: #333;
    text-align: center;
    line-height: 70px;
  }
  .box-card {
    align:center;
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
</style>

<script>
export default {
    methods: {
    login(){
				if(this.userID == "" || this.userPasswd == ""){
					alert("请输入用户名或密码")
				}else{
					let data = {'userID':this.userID,'userPasswd':this.userPasswd}
					this.$http.post('',data).then((res)=>{
						console.log(res)
						if(res.data == -1){
							this.tip = "账户不存在"
							this.showTip = true
						}else if(res.data == 0){
							this.tip = "密码输入错误"
							this.showTip = true
						}else if(res.data == 'admin'){
							this.$router.push('/main')
						}else{
							this.tip = "登录成功"
							this.showTip = true
							setCookie('username',this.username,1000*60)
							setTimeout(function(){
								this.$router.push({path:'/test'})
							}.bind(this),1000)
						}
					})
				}
			},
			ToRegister(){
				this.$router.push({path: '/Regist'});
			},
      succeed() {
        this.$message({
          message: '登录成功',
          type: 'success'
        });
      },
      warning() {
        this.$message({
          message: '登录信息有误',
          type: 'warning'
        });
      }
    },
    data() {
    return {
      userID: '',
      userPasswd: ''
    }
  }
}
</script>