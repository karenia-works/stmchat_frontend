<template>
    <div id="app">
        <el-container>
            <el-aside
                    width="300px"

                    class="dark_medium_bg demo-input-suffix"
                    style="overflow-x: hidden; overflow-y: hidden"
            >
                <vueScroll @handle-scroll="handleScroll">
                    <div class="search" @click="openSearch">
                        <el-input
                                v-model="input"
                                placeholder="search"
                                class="dark_eee_bg"
                                v-if="!searchShow"
                        >
                            <el-dropdown
                                    slot="prepend"
                                    @command="handleCommand"
                            >
                    <span class="el-dropdown-link">
                        <i
                                class="dark_main_text el-icon-s-unfold el-icon--center
                      el-icon-size el-icon-backgroud"
                        ></i>
                   </span>
                                <el-dropdown-menu
                                        slot="dropdown"
                                        class="dark_medium_bg"
                                >
                                    <el-dropdown-item command="a" class="dark_main_text">
                                        <i class="el-icon-user-solid el-icon-size"></i>
                                        New group
                                    </el-dropdown-item>
                                    <el-dropdown-item command="b" class="dark_main_text">
                                        <i class="el-icon-s-custom el-icon-size"></i>
                                        Contacts
                                    </el-dropdown-item>
                                    <el-dropdown-item command="c" class="dark_main_text">
                                        <i class="el-icon-setting el-icon-size"></i>
                                        Settings
                                    </el-dropdown-item>
                                    <el-dropdown-item command="d" class="dark_main_text">
                                        <i class="el-icon-question el-icon-size"></i>
                                        STM FAQ
                                    </el-dropdown-item>
                                    <el-dropdown-item command="e" class="dark_main_text">
                                        <i class="el-icon-s-promotion el-icon-size"></i>
                                        About
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-input>

                        <!-- 搜索-->
                    </div>
                    <!-- <el-card class="box-card " style="margin-left: 0px">  v-on:input="inputChange"-->
                    <div class="search-header" v-if="searchShow">
                        <el-input name="input"
                                  class="keyword"
                                  v-model="searchWord"
                                  v-on:input="queryData"
                                  placeholder="search"
                                  clearable
                        >
                            <el-button slot="prepend"
                                       type="primary"
                                       @click="closeSearch"
                                       class="el-button-new"
                                       size="mini"
                            >
                                <i class="el-icon-back  el-icon--center"
                                   style="font-size:18px"
                                >
                                </i>
                            </el-button>

                        </el-input>
                    </div>

                    <div
                            v-for="(o, index) in sortableData"
                            v-bind:key="o"
                            @click="handleclick(index), (o.unread = 0)"
                            :class="active == index ? 'addclass' : ''"
                            class="dark_main_text dark_deep_bg"
                            v-show="chatShow"
                    >
                        <!-- <el-card body-style="{ padding: '0' }" style="height:100px"> -->
                        <el-row type="flex" style="height:65px" align="middle">
                            <el-col span="6" offset="2">
                                <img
                                        :src="o.head_pic"
                                        class="round_icon img_size"
                                />
                            </el-col>
                            <el-col span="12">
                                <div class="name_size">
                                    <span>{{ o.name }}</span>
                                </div>
                                <div
                                        class="bottom clearfix margin-bottom:5px"
                                        style="font-size:12px;color: dimgray"
                                >
                                    <!-- <div >{{o.chat| ellipsis}}</div>-->
                                    <template>
                                    <span class="dark_sub_text" v-html="$options.filters.ellipsis(o.chat)">
                                    </span>

                                    </template>
                                </div>
                            </el-col>
                            <el-col span="5">
                                <div style="height:50px;font-size:12px;color:dimgray;">
                                    <div class="dark_sub_text">{{ o.time }}</div>
                                    <el-badge
                                            :value="o.unread"
                                            class="item"
                                            style="margin-top:15px ;padding-left:10px;"
                                            v-show="o.unread > 0"
                                    ></el-badge>
                                </div>
                            </el-col>
                        </el-row>
                        <!-- </el-card> -->
                    </div>
                    <div
                            v-for="(o, index) in selectableData"
                            v-bind:key="o"
                            @click="handleclick(index), (o.unread = 0)"
                            :class="active == index ? 'addclass' : ''"
                            class="dark_main_text dark_deep_bg"
                            v-show="selectShow"
                    >
                        <!-- <el-card body-style="{ padding: '0' }" style="height:100px"> -->
                        <el-row type="flex" style="height:65px" align="middle">
                            <el-col span="6" offset="2">
                                <img
                                        :src="o.head_pic"
                                        class="round_icon img_size"
                                />
                            </el-col>
                            <el-col span="12">
                                <div class="name_size">
                                    <span>{{ o.name }}</span>
                                </div>
                                <div
                                        class="bottom clearfix margin-bottom:5px"
                                        style="font-size:12px;color: dimgray"
                                >
                                    <!-- <div >{{o.chat| ellipsis}}</div>-->
                                    <template>
                                    <span class="dark_sub_text" v-html="$options.filters.ellipsis(o.chat)">
                                    </span>

                                    </template>
                                </div>
                            </el-col>
                        </el-row>
                        <!-- </el-card> -->
                    </div>
                </vueScroll>
                <!-- </el-card> -->
            </el-aside>

        </el-container>
    </div>
</template>

<style lang="stylus">
    .el-icon--center {
        color: dimgray;
    }

    .el-aside {
        background-color: white;
    }

    .el-container {
        height: 700px;
        solid-color: #eeeeee;
    }

    .el-icon-size {
        font-size: 20px;
    }

    .round_icon {
        width: 34px;
        height: 34px;
        display: flex;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .img_size {
        width: 45px;
        height: 45px
    }

    .name_size {
        padding-bottom: 10px;
        font-size: 16px
    }

    .addclass {
        background-color: colors.theme-blue;
        color: colors.theme-light-grey;
    }

    @media (prefers-color-scheme: dark) {
        .dark_light_bg {
            background-color: colors.dark-light;
        }

        .dark_medium_bg {
            background-color: colors.dark-medium;
        }

        .dark_deep_bg {
            background-color: colors.dark-deep;
        }

        .dark_eee_bg {
            background-color: colors.theme-light-grey;
        }


        .dark_sub_text {
            color: colors.dark-sub-text;
        }

        .dark_main_text {
            color: colors.dark-main-text;
        }

        .el-badge__content {
            color: colors.dark-main-text;
            background-color: colors.theme-blue;
        }

        .el-input__inner {
            color: colors.dark-main-text;
            background-color: colors.dark-light;
        }

        .el-input-group__prepend {
            color: colors.dark-main-text;
            background-color: colors.dark-light;
        }

        .el-icon-backgroud {
            color: colors.theme-black;
            background-color: colors.theme-grey;

        }

    }

    .el-button {
        height: 3.5rem;
        width: 4rem;
        margin-top: 0.6rem;
        border-radius: 4px;

    }

    .el-button-new {
        height: 3.5rem;
        width: 1rem;
        margin-top: 0.6rem;
        background-color: white

    }
</style>

<script>
    export default {
        data() {
            const item = {
                name: "軒",
                head_pic: require("../assets/sample/avatar/pic_001.jpg"),
                chat:
                    "假装@所有人\\n据可靠消息，不填文档的今晚六点将会被拉群\\n【腾讯文档】1721冯如杯项目统计https://docs.qq.com/sheet/DRU93eHZieUJFaHV4?c=E4A0A0",
                time: "10:32",
                unread: 15,
            };
            const item1 = {
                name: "Yelza",
                head_pic: require("../assets/sample/avatar/pic_002.jpg"),
                chat:
                    "教育部思政司拟于5月4日（明天）9:00在人民网新媒体平台推出“我们都是收信人”",
                time: "20:31",
                unread: 1,
            };
            const item2 = {
                name: "如余得水",
                head_pic: require("../assets/sample/avatar/pic_003.jpg"),
                chat: "温馨提醒：\\n拉小黑屋的时间提前到22:00点了，参加",
                time: "18:03",
                unread: 0,
            };
            const item3 = {
                name: "Rynco Li",
                head_pic: require("../assets/sample/avatar/pic_004.jpg"),
                chat:
                    "2020全国大学生计算机系统能力大赛 —— 编译系统设计赛（华为毕昇杯）\\n主办单位",
                time: "13:32",
                unread: 0,
            };
            const item4 = {
                name: "AlvinZH",
                head_pic: require("../assets/sample/avatar/pic_005.jpg"),
                chat: "在本学期上书院党校的同学请私戳我一下",
                time: "20:37",
                unread: 0,
            };
            const item6 = {
                name: "逆光下的微笑",
                head_pic: require("../assets/sample/avatar/pic_006.jpg"),
                chat: "我们也是改几幅图的错",
                time: "14:38",
                unread: 0,
            };
            const item7 = {
                name: "軒+",
                head_pic: require("../assets/sample/avatar/pic_007.jpg"),
                chat:
                    "假装@所有人\\n据可靠消息，不填文档的今晚六点将会被拉群\\n【腾讯文档】1721冯如杯项目统计https://docs.qq.com/sheet/DRU93eHZieUJFaHV4?c=E4A0A0",
                time: "12:32",
                unread: 1,
            };
            const item8 = {
                name: "Yelza+",
                head_pic: require("../assets/sample/avatar/pic_008.jpg"),
                chat:
                    "教育部思政司拟于5月4日（明天）9:00在人民网新媒体平台推出“我们都是收信人”",
                time: "23:31",
                unread: 1,
            };
            const item9 = {
                name: "如余得水+",
                head_pic: require("../assets/sample/avatar/pic_009.jpg"),
                chat: "温馨提醒：\\n拉小黑屋的时间提前到22:00点了，参加",
                time: "18:03",
                unread: 0,
            };
            const item10 = {
                name: "Rynco Li+",
                head_pic: require("../assets/sample/avatar/pic_010.jpg"),
                chat:
                    "2020全国大学生计算机系统能力大赛 —— 编译系统设计赛（华为毕昇杯）\\n主办单位",
                time: "13:32",
                unread: 0,
            };
            const item11 = {
                name: "AlvinZH+",
                head_pic: require("../assets/sample/avatar/pic_011.jpg"),
                chat: "在本学期上书院党校的同学请私戳我一下",
                time: "20:37",
                unread: 0,
            };
            const item12 = {
                name: "逆光下的微笑+",
                head_pic: require("../assets/sample/avatar/pic_012.jpg"),
                chat: "我们也是改几幅图的错",
                time: "14:38",
                unread: 0,
            };
            const itemfalse = {
                name: "无匹陪对象",
                head_pic: require("../assets/sample/avatar/pic_150.jpg"),
                chat: "",
                time: "",
                unread: 0,
            };
            return {
                input: "",
                tableData: [item, item1, item2, item3, item4, item6, item7, item8, item9, item10, item11, item12],
                hiddenTableHeader: false,
                active: -1,
                messageProcess: 0,
                searchWord: '',
                searchStatus: false,
                searchShow: false,
                chatShow: true,
                selectShow: false,
                keyword: '',
                selectableData: [],
                noselectData: [itemfalse]
            };
        },
        methods: {
            handleCommand(command) {
                console.log("111");

                if (command == "a") {
                    this.$router.push({path: "/Setgroup"});
                } else if (command == "b") {
                    this.$router.push({path: "/Contacts"});
                } else if (command == "c") {
                    this.$router.push({path: "/setting"});
                } else if (command == "d") {
                    this.$router.push({path: "/STM FAQ"});
                } else if (command == "e") {
                    this.$router.push({path: "/About"});
                }
            },
            handleclick(index) {
                this.active = index;
                this.unread = 0;
            },
            handleScroll(vertical) {
                let vp = vertical.process;
                if (vp < 1 && vp > this.messageProcess) this.showGoDown = true;
                else this.showGoDown = false;
                this.messageProcess = vp;
            },
            openSearch: function (e) {
                this.searchShow = true;
                this.chatShow = false;
                this.selectShow = false;
                //console.log(e);
            },
            closeSearch: function () {
                this.searchShow = false;
                this.chatShow = true;
                this.selectShow = false;
                this.searchWord = "";
            },
            queryData() {
                //并没有输入关键字时，就不要再搜索了
                this.selectShow = true;
                if (this.searchWord === '' || this.searchWord == null) {
                    this.selectableData = null;
                    return;
                }
                //搜索
                let list = this.tableData.filter(item => item.name.indexOf(this.searchWord) >= 0);
                if (list.length >= 1)
                    this.selectableData = list;
                else
                    this.selectableData = this.noselectData;
                this.$forceUpdate()
            }
        },
        filters: {
            ellipsis(value) {

                if (!value) return "";
                value = value.replace(/\\n/gm, " ");
                if (value.length > 11) {
                    return value.slice(0, 11) + "...";
                }
                return value;
            },
        },
        computed: {

            //最终需要显示的数组
            sortableData: function () {
                mesgNotice();
                return sortByTime(this.tableData, 'time')
            }
        }
    }

    function sortByTime(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        })
    }

    //桌面通知
    function mesgNotice() {
        if (window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission(function (status) {
                var notice_ = new Notification('新的消息', {body: '您的STM有新的消息'});
                notice_.onclick = function () {//单击消息提示框，进入浏览器页面
                    window.focus();
                }
            });
        }
    }

</script>
