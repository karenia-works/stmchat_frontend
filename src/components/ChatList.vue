<template>
    <div>
        <el-container
                class="dark_medium_bg demo-input-suffix el-aside-container"
                style="overflow-x: hidden; overflow-y: hidden; width: 100%;"
        >
            <vueScroll @handle-scroll="handleScroll">
                <!--                导航栏-->
                <div class="search" @click="openSearch">
                    <el-input
                            v-model="input"
                            placeholder="搜索"
                            class="dark_eee_bg"
                            v-if="!searchShow"
                    >
                        <div slot="prepend" @click.stop="clicktry">
                            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <i
                          class="dark_main_text el-icon-s-unfold el-icon--center el-icon-size el-icon-backgroud"
                  ></i>
                </span>
                                <el-dropdown-menu slot="dropdown" class="dark_medium_bg">
                                    <el-dropdown-item command="a" class="dark_main_text">
                                        <i class="el-icon-user-solid el-icon-size"></i>
                                        新群组
                                    </el-dropdown-item>
                                    <el-dropdown-item command="b" class="dark_main_text">
                                        <i class="el-icon-s-custom el-icon-size"></i>
                                        添加好友
                                    </el-dropdown-item>
                                    <el-dropdown-item command="c" class="dark_main_text">
                                        <i class="el-icon-setting el-icon-size"></i>
                                        设置
                                    </el-dropdown-item>
                                    <el-dropdown-item command="d" class="dark_main_text">
                                        <i class="el-icon-question el-icon-size"></i>
                                        常见问题
                                    </el-dropdown-item>
                                    <el-dropdown-item command="e" class="dark_main_text">
                                        <i class="el-icon-s-promotion el-icon-size"></i>
                                        关于
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-input>

                    <!-- 搜索-->
                </div>
                <!-- <el-card class="box-card " style="margin-left: 0px">  v-on:input="inputChange"-->
                <!--                搜索栏-->
                <div class="search-header" v-if="searchShow">
                    <el-input
                            name="input"
                            class="keyword"
                            v-model="searchWord"
                            v-on:input="queryData"
                            placeholder="搜索"
                            clearable
                            autofocus="true"
                    >
                        <el-button
                                slot="prepend"
                                type="primary"
                                @click="closeSearch"
                                class="el-button-new"
                                size="mini"
                        >
                            返回
                        </el-button>
                    </el-input>
                </div>
<!--                <botton @click="beforeCreate">test</botton>-->
                <!--                聊天列表-->
                <div
                        v-for="(o, index) in sortableData"
                        v-bind:key="o"
                        @click="handleclick(index, o), (o.unreadCount = 0),$emit(chat-people,o.chat.name)"
                        :class="active == index ? 'addclass' : ''"
                        class="dark_main_text dark_deep_bg"
                        v-show="chatShow"
                >
                    <!-- <el-card body-style="{ padding: '0' }" style="height:100px"> -->
                    <el-row type="flex" style="height: 65px;" align="middle">
                        <el-col span="6" offset="2">
                            <img :src="o.chat.avartarUrl" class="round_icon img_size"/>
                        </el-col>
                        <el-col span="12">
                            <div class="name_size">
                                <span>{{ o.chat.name }}</span>
                            </div>
                            <div
                                    class="bottom clearfix margin-bottom:5px"
                                    style="font-size: 12px; color: dimgray;"
                            >
                                <!-- <div >{{o.chat| ellipsis}}</div>-->
                                <template>
                                    <div v-if="o.latestMessage!=undefined">
                                        <div v-if="o.latestMessage._t == 'text'">
                    <span
                            class="dark_sub_text"
                            v-html="$options.filters.ellipsis(o.latestMessage.text)"
                    >
                    </span>
                                        </div>
                                        <div v-if="o.latestMessage._t == 'image'">
                                            <span class="dark_sub_text" v-html="image"> </span>
                                        </div>
                                        <div v-if="o.latestMessage._t == 'file'">
                                            <span class="dark_sub_text" v-html="file"> </span>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </el-col>
                        <el-col span="5">
                            <div style="height: 50px; font-size: 12px; color: dimgray;">

                                <div class="dark_sub_text">{{Date(o.lastTimestamp) | dat }}</div>
                                <el-badge
                                        :value="o.unreadCount"
                                        class="item"
                                        style="margin-top: 15px; padding-left: 10px;"
                                        v-show="o.unreadCount > 0"
                                ></el-badge>
                            </div>
                        </el-col>
                    </el-row>
                    <!-- </el-card> -->
                </div>
                <!--                搜索结果-->
                <div
                        v-for="(o, index) in selectableData"
                        v-bind:key="o"
                        @click="handleclick(index, o, 'Wang'), (o.unreadCount = 0),$emit(chat-people,o.chat.name)"
                        :class="active == index ? 'addclass' : ''"
                        class="dark_main_text dark_deep_bg"
                        v-show="selectShow"
                >
                    <!-- <el-card body-style="{ padding: '0' }" style="height:100px"> -->
                    <el-row type="flex" style="height: 65px;" align="middle">
                        <el-col span="6" offset="2">
                            <img :src="o.chat.avartarUrl" class="round_icon img_size"/>
                        </el-col>
                        <el-col span="12">
                            <div class="name_size">
                                <span>{{ o.chat.name }}</span>
                            </div>
                            <div
                                    class="bottom clearfix margin-bottom:5px"
                                    style="font-size: 12px; color: dimgray;"
                            ></div>
                        </el-col>
                    </el-row>
                    <!-- </el-card> -->
                </div>
            </vueScroll>
            <!-- </el-card> -->
        </el-container>
    </div>
</template>

<style lang="stylus" scoped>
    .el-icon--center {
        color: dimgray;
    }

    .el-aside-container {
        background-color: white;
    }

    .el-container {
        height: 650px;
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
        height: 45px;
    }

    .name_size {
        padding-bottom: 10px;
        font-size: 16px;
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

    .el-button-new {
        height: 0.5rem;
        width: 3.8rem;
        margin-top: 0rem;
        background-color: white;
    }
</style>

<script lang="ts">
    import {WsMessageService} from "@/services/websocket";
    import {MessageListItem, MessageListService} from "../services/messageService";
    import {serviceProvider} from "../services/dependencyInjection";
    import {Vue} from "vue-property-decorator";
    import {UserProfilePool} from "@/services/cachingService";
    import moment from "moment";
    import Vuex from "vuex"

    export default Vue.extend({
        beforeMount: function () {
            try {
                var datalist = [];
                let mls = serviceProvider.resolve<MessageListService>(MessageListService);
                mls.messageListSubject.subscribe({
                    next: v => {
                        mesgNotice();
                        datalist = v;
                        // this.tableData = v;
                        console.log("ChatList", v);
                        this.tableData = datalist;
                        //console.log("sss",this.tableData);
                    }
                })

            } catch (err) {
                console.log(err);
            }
        },

        data() {
            const itemgroup = {
                name: 'Li',
                isFriend: true,
                avartarUrl: "https://www.gx8899.com/uploads/allimg/180118/3-1P11P92057.jpg",
            }
            const chatmsg = {
                _t: "text",
                text: "hello hello hello hello hello hello hello hello hello hello hello hello hello hello ",
            }
            const item = {
                chat: itemgroup,
                latestMessage: chatmsg,
                lastTimestamp: 1426,
                unreadCount: 15,
            };
            const itemgroupfalse = {
                name: '无匹配对象',
                isFriend: true,
                avartarUrl: require("../assets/sample/avatar/pic_150.jpg"),
            }

            const itemfalse = {
                chat: itemgroupfalse,
                latestMessage: null
            };
            return {
                input: "",
                tableData: [],
                hiddenTableHeader: false,
                active: -1,
                messageProcess: 0,
                searchWord: "",
                searchStatus: false,
                searchShow: false,
                chatShow: true,
                selectShow: false,
                keyword: "",
                selectableData: [],
                noselectData: [itemfalse],
                endpoint: " http://yuuna.srv.karenia.cc/api/v1",
                image: "[图片]",
                file: "[文件]",
                username: ""
            };
        },
        methods: {
            handleCommand(command) {
                console.log("111");

                if (command == "a") {
                    this.$emit("chatListCommand", "a");
                } else if (command == "b") {
                    this.$emit("chatListCommand", "b");
                } else if (command == "c") {
                    this.$emit("chatListCommand", "c");
                } else if (command == "d") {
                    this.$emit("chatListCommand", "d");
                } else if (command == "e") {
                    this.$emit("chatListCommand", "e");
                }
            },
            handleclick(index, o: MessageListItem) {
                this.active = index;
                this.getUserID();
                console.log(o.chat.name)
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
                this.active = -1;
                //console.log(e);
            },
            closeSearch: function () {
                this.searchShow = false;
                this.chatShow = true;
                this.selectShow = false;
                this.searchWord = "";
                this.active = -1;
            },
            queryData() {
                //并没有输入关键字时，就不要再搜索了
                this.selectShow = true;
                if (this.searchWord === "" || this.searchWord == null) {
                    this.selectableData = null;
                    return;
                }
                //搜索
                if (this.tableData != null) {
                    let list = this.tableData.filter(
                        item => item.chat.name.indexOf(this.searchWord) >= 0,
                    );
                    if (list.length >= 1) this.selectableData = list;
                    else this.selectableData = this.noselectData;
                    this.$forceUpdate();
                }
            },
            beforeCreate() {
                var datalist = []
                let mls = serviceProvider.resolve<MessageListService>(MessageListService);
                mls.messageListSubject.subscribe({
                    next: v => {
                        //mesgNotice();
                        datalist = v;
                        // this.tableData = v;
                        console.log("ChatList", v);
                        //console.log("sss",this.tableData);
                    }
                })
                console.log("datalist", datalist);
                this.tableData = datalist;
                console.log("sss", this.tableData);
            },
            clicktry() {
            },
            getUserID() {
                this.userID = this.$store.state.UserID;
                console.log(this.UserID);
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
            dat(time) {
                let m = moment(time);
                if (m.isBefore(moment(), "year"))
                    return moment(time).format("YYYY/M/D H:mm");
                else if (m.isBefore(moment(), "day"))
                    return moment(time).format("M/D H:mm");
                else return moment(time).format("H:mm");
            }
        },
        computed: {
            //最终需要显示的数组
            sortableData: function () {
                return sortByTime(this.tableData, "lastTimestamp");
            },
        },
    })

    //按照时间排序
    function sortByTime(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return x > y ? -1 : x < y ? 1 : 0;
        });
    }

    //桌面通知
    function mesgNotice() {
        if (window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission(function (status) {
                var notice_ = new Notification("新的消息", {body: "您的STM有新的消息"});
                notice_.onclick = function () {
                    //单击消息提示框，进入浏览器页面
                    window.focus();
                };
            });
        }
    }
</script>
