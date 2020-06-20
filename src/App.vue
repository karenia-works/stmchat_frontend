<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import { serviceProvider } from "./services/dependencyInjection";
import registerDI from "./services/registerDI";
@Component({
  components: {
    HelloWorld,
  },
  beforeCreate() {
    registerDI();
  },
})
export default class App extends Vue {}
</script>

<style lang="stylus">
#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'San Francisco UI', 'Helvetica Neue', Arial
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  // text-align: center
  // color: #2c3e50
  // margin-top: 60px
}
</style>
