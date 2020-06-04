<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  data: () => {
    return {
      data: [],
      ws: (() => {
        let ws = new WebSocket("ws://localhost:8089/");
        ws.onmessage = function(ev) {
          console.log(ev.data);
          this.data.push(ev.data);
        };
        return ws;
      })()
    };
  },
  methods: {
    x: function() {
      this.ws;
    }
  }
};
</script>
