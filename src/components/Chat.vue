<template>
  <div class="wrapper">
    <div>Chat</div>
    <div v-for="msg in list" :key="msg.msg.id">{{msg}}</div>
  </div>
</template>

<script lang="ts">
import { WsMessageService } from "../services/websocket";
import { Message } from "../types/types";
export default {
  beforeMount: function() {
    let connector = new WsMessageService("ws://localhost:8089");
    connector.msg.subscribe({
      next: msg => {
        console.log(msg);
        this.list.push(msg);
      },
    });
    this.connector = connector;
  },
  data() {
    return {
      connector: undefined as WsMessageService | undefined,
      list: [] as Message[],
    };
  },
};
</script>

<style lang="scss" scoped></style>
