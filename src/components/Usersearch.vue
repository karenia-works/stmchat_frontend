<template>
  <div ref="out">
    <div style="height:60px">
      <el-input v-model="selectVal" placeholder="Search">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <hr />
    </div>
    <div :style="{ height: listHeight }">
      <vueScroll>
        <div v-for="item in queryList" :key="item.username">
          <el-container @click.native="$emit('selectUser', item.username)">
            <el-aside width="70px">
              <el-avatar
                v-if="item.avatarUrl"
                :src="item.avatarUrl"
                :size="50"
              ></el-avatar>
              <el-avatar v-else :size="50">{{
                item.username[0].toUpperCase()
              }}</el-avatar>
            </el-aside>
            <el-container>
              <el-header height="30px" class="dark_main_text">{{
                item.username
              }}</el-header>
              <el-footer height="20px" class="dark_sub_text">{{
                item.state ? "online" : "offline"
              }}</el-footer>
            </el-container>
          </el-container>
        </div>
      </vueScroll>
    </div>
  </div>
</template>

<script>
export default {
  name: "Usersearch",
  data() {
    return {
      selectVal: "",
      listHeight: "350px",
    };
  },

  mounted: function() {
    this.listHeight = this.$refs["out"].clientHeight - 60 + "px";
  },

  props: ["items"],
  computed: {
    queryList() {
      return this.items.filter(
        item => item.username.indexOf(this.selectVal) > -1,
      );
    },
  },
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
  border-color: colors.theme-black;
  background-color: colors.theme-black;
}
</style>
