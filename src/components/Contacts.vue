<template>
  <el-card class="box-card dark_medium_bg">
    <el-container>
      <el-header height="15px" class="dark_main_text">
        <span>Contacts</span>
      </el-header>
      <el-main height="600px">
        <user @func="getMsgFormSon"></user>
      </el-main>
      <el-footer height="30px">
        <el-button style="float: left" type="text" class="dark_main_text"
          >ADD CONTACT</el-button
        >
        <el-button
          style="float: right"
          type="text"
          class="dark_main_text"
          @click="close"
          >CLOSE</el-button
        >
      </el-footer>
    </el-container>
  </el-card>
</template>

<script>
export default {
  name: "Contacts",
  data() {
    return {
      msgFormSon: "this is msg",
    };
  },
  methods: {
    close() {
      this.$emit("contactClose");
    },
    getMsgFormSon(data) {
      this.msgFormSon = data;
      console.log(this.msgFormSon);
    },
  },
};
</script>

<style lang="stylus" scoped>
.item {
  padding: 18px 0;
}

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

@media (prefers-color-scheme: dark) {
  .dark_light_bg {
    background-color: colors.dark-light;
    border-color: colors.dark-medium;
  }

  .dark_medium_bg {
    background-color: colors.dark-medium;
    border-color: colors.dark-light;
  }

  .dark_deep_bg {
    background-color: colors.dark-deep;
  }

  .dark_sub_text {
    color: colors.dark-sub-text;
  }

  .dark_main_text {
    color: colors.dark-main-text;
  }
}
</style>
