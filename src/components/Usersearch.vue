<template>
  <el-row style="height:500px">
    <div>
      <el-input v-model="input" placeholder="Search" style="height:35px">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <hr class="hr111 dark_hr" />
    <userlist></userlist>
    <userlist></userlist>
    <userlist></userlist>
    <userlist></userlist>
    <userlist></userlist>
    <userlist></userlist>
    <userlist></userlist>
  </el-row>
</template>
<script>
export default {
  name: "Usersearch",
  data() {
    return {
      input: "",
    };
  },
};
</script>

<style lang="stylus" scoped>
.el-input input {
  border: none;
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
