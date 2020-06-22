<template>
  <div v-if="stage">
    <Setgroup @Groupname="Setname" v-on:cancelGroup="cancelGroup"></Setgroup>
  </div>
  <div v-else>
    <Addmember
      @Groupmem="Dealmember"
      v-on:create="create"
      v-on:cancel="cancel"
    ></Addmember>
  </div>
</template>
<script>
import axios from "axios";
import { serviceProvider, TYPES } from "@/services/dependencyInjection";
import { GroupProfilePool } from "@/services/cachingService";
import Addmember from "./Addmember.vue";
import Setgroup from "./Setgroup.vue";
export default {
  components: { Addmember, Setgroup },
  data() {
    return {
      stage: true,
      groupname: "",
      owner: "wang",
      groupmember: [],
    };
  },
  methods: {
    cancelGroup() {
      this.$emit("cancelGroup");
      this.stage = true;
    },
    create() {
      this.$emit("create");
      this.$message({
        message: "群聊创建成功",
        type: "success",
      });
      this.stage = true;
    },
    cancel() {
      this.stage = true;
    },
    Setname(data) {
      this.stage = false;
      this.groupname = data;
      console.log(this.groupname);
    },
    Dealmember(data) {
      this.groupmember = data;
      this.groupmember.push(this.owner);
      console.log(this.groupmember);
      this.Creatgroup();
    },
    Creatgroup() {
      let group = serviceProvider.resolve(GroupProfilePool);
      group.makeGroup({
        name: this.groupname,
        id: "",
        isFriend: false,
        members: this.groupmember,
        owner: this.owner,
      });
    },
  },
};
</script>
