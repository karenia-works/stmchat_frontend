<template>
    <div id="app">
        <el-container style="height: 700px; border: 1px solid #eee">
            <el-aside width="300px" style="background-color:white;" padding="0" >

                <el-input v-model="input" placeholder="search" >
                    <el-dropdown slot="prepend"  @command="handleCommand">
                    <span class="el-dropdown-link " >
                      <i style="font-size: 20px;color:dimgray"  class="el-icon-s-unfold el-icon--center"></i>
                    </span>

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">
                                <i style="font-size: 20px " class="el-icon-user-solid"></i>
                                New group
                            </el-dropdown-item>
                            <el-dropdown-item command="b">
                                <i style="font-size: 20px " class="el-icon-s-custom"></i>
                                Contacts
                            </el-dropdown-item>
                            <el-dropdown-item command="c">
                                <i style="font-size: 20px " class="el-icon-setting"></i>
                                Settings
                            </el-dropdown-item>
                            <el-dropdown-item command="d">
                                <i style="font-size: 20px " class="el-icon-question"></i>
                                STM FAQ
                            </el-dropdown-item>
                            <el-dropdown-item command="e">
                                <i style="font-size: 20px " class="el-icon-s-promotion"></i>
                                About
                            </el-dropdown-item>
                        </el-dropdown-menu>

                    </el-dropdown>

                </el-input>

                <!-- <el-card class="box-card " style="margin-left: 0px"> -->
                <div v-for="(o,index) in tableData" v-bind:key="o" @click="handleclick(index),o.unread=0" :class = "active == index ? 'addclass' : ''" >
                    <!-- <el-card body-style="{ padding: '0' }" style="height:100px"> -->
                    <el-row type="flex" style="height:65px" align="middle">

                        <el-col span="6" offset="2" >
                            <img :src="o.head_pic" style="width: 45px;height:45px"  class=" round_icon"/></el-col>
                        <el-col span="12">
                            <div style="padding-bottom:10px;font-size: 16px">
                                <span>{{o.name}}</span></div>
                            <div class="bottom clearfix margin-bottom:5px" style="font-size:12px;color: dimgray" >
<!--                                <div >{{o.chat| ellipsis}}</div>-->
                                <template>
                                    <span>{{o.chat | ellipsis}}</span>
                                </template>

                            </div>
                        </el-col>
                        <el-col span="5">
                            <div style="height:50px;font-size:12px;color:dimgray;">{{o.time}}
                            <el-badge :value="o.unread" class="item" style="margin-top:15px ;padding-left:10px;" v-show="o.unread>0"  ></el-badge></div>
                        </el-col>
                    </el-row>
                    <!-- </el-card> -->
                </div>
                <!-- </el-card> -->
            </el-aside>


            <el-container>
            </el-container>
        </el-container>
    </div>
</template>
<style>


    .round_icon {
        width: 34px;
        height: 34px;
        display: flex;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
    .addclass{
        background-color:deepskyblue;
        color: #eeeeee;
    }


</style>

<script>
    export default {
        data() {
            const item = {
                name: '軒',
                head_pic: require("../assets/sample/avatar/pic_001.jpg"),
                chat: '假装@所有人\\n据可靠消息，不填文档的今晚六点将会被拉群\\n【腾讯文档】1721冯如杯项目统计https://docs.qq.com/sheet/DRU93eHZieUJFaHV4?c=E4A0A0',
                time: '上午10:32',
                unread:15}
           const item1 = {
                name: 'Yelza',
                head_pic: require("../assets/sample/avatar/pic_002.jpg"),
                chat: '教育部思政司拟于5月4日（明天）9:00在人民网新媒体平台推出“我们都是收信人”',
                time: '下午8:31',
                unread:1}
           const item2 = {
                name: '如余得水',
                head_pic: require("../assets/sample/avatar/pic_003.jpg"),
                chat: '温馨提醒：\\n拉小黑屋的时间提前到22:00点了，参加',
                time: '下午6:03',
                unread:0
            }
            const item3 = {
                name: 'Rynco Li',
                head_pic: require("../assets/sample/avatar/pic_004.jpg"),
                chat: '2020全国大学生计算机系统能力大赛 —— 编译系统设计赛（华为毕昇杯）\\n主办单位',
                time: '下午1:32',
                unread:0}
            const item4 = {
                name: 'AlvinZH',
                head_pic: require("../assets/sample/avatar/pic_005.jpg"),
                chat: '在本学期上书院党校的同学请私戳我一下',
                time: '下午8:37',
                unread:0}
            const item6 = {
                name: '逆光下的微笑',
                head_pic: require("../assets/sample/avatar/pic_006.jpg"),
                chat: '我们也是改几幅图的错',
                time: '下午2:38',
                unread:0
            }
            return {
                input:'',
                tableData:[item,item1,item2,item3,item4,item6],
        //: Array(20).fill(item),
                hiddenTableHeader: false,
                aaa: '',
                currentDate: new Date(),
                active: -1
            }
        },
        methods: {

            handleCommand(command) {
                console.log("111")
                console.log(this.aaa)

                if (command == "a") {
                    this.$router.push({path: '/New Group'})
                }else if(command=="b"){
                    this.$router.push({path: '/Contacts'})
                } else if(command=="c"){
                    this.$router.push({path: '/Settings'})
                }else if(command=="d"){
                    this.$router.push({path: '/STM FAQ'})
                }else if(command=="e"){
                    this.$router.push({path: '/About'})
                }
            },
            handleclick(index){
               this.active=index;
               this.unread=0;
            },
            handleleave(){

            }


        },   filters: {
            ellipsis (value) {
                if (!value) return ''
                if (value.length > 11) {
                    return value.slice(0,11) + '...'
                }
                return value
            }
        }
    }

</script>


