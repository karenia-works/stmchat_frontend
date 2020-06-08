<template>
  <el-row style="height:500px">
    <div>
      <el-input 
        v-model="selectVal" 
        placeholder="Search" 
        @blur="queryData" 
        @input="queryData" 
        style="height:35px" >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <hr />
    <div v-if="searchData.length>0">
      <div v-for="item in searchData" :key="item">
        <el-container >
          <el-aside width="70px">
            <el-avatar :size="50" :src="item.circleUrl"></el-avatar>
          </el-aside>
          <el-container>
            <el-header height="30px" class="dark_main_text">{{item.usrId}}</el-header>
            <el-footer height="20px" class="dark_sub_text">Footer</el-footer>
          </el-container>
        </el-container>
      </div>
    </div>
    <div v-else="">
      <div v-for="item in items" :key="item">
        <el-container >
          <el-aside width="70px">
            <el-avatar :size="50" :src="item.circleUrl"></el-avatar>
          </el-aside>
          <el-container>
            <el-header height="30px" class="dark_main_text">{{item.usrId}}</el-header>
            <el-footer height="20px" class="dark_sub_text">Footer</el-footer>
          </el-container>
        </el-container>
      </div>
    </div>
  </el-row>
</template>
<script>
export default {
  name: "Usersearch",
  data() {
    return {
      selectVal: "",
      items:[
      {
        "circleUrl": "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        "usrId":"name1",
      },
      {
        "circleUrl": "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        "usrId":"name2",
      },
      ],
      searchData:[],
    };
  },
  
  methods:{
      queryData(){
            if(this.selectVal===''||this.selectVal==null){
                  this.searchData=[];
                        return;
                    }
            let list=this.items.filter(item=>item.usrId.indexOf(this.selectVal)>=0);
            this.searchData=list;
                    
       },
   }
};
</script>

<style lang="stylus" scoped>
.el-input input {
  border: none;
}
.el-header {
  text-align: left;
}

.el-footer {
  text-align: left;
  font-size: 13px;
  color: #999;
}

.el-aside {
  text-align: center;
  justify-content: center;
  height: 70px;
}

.hr111 {
  margin-top: 15px;
  margin-bottom: 15px;
  border-style: solid;
  border-radius: 1px;
  border-width: 1px;
  border-color: #333;
  background-color: #333;
}


@media (prefers-color-scheme: dark) {
  .dark_hr {
    border-style: solid;
    border-radius: 1px;
    border-width: 1px;
    border-color: white;
    background-color: white;
  }
}
</style>
