<template>
  <div id="q-app">
    <div class="head" v-if="platform === 'win32'">
      <AppHead />
    </div>

    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppHead from 'src/layouts/MainHeader.vue';
import { rest } from 'lodash';

export default {
  name: 'App',
  provide: {},
  components: { AppHead },
  data() {
    return { platform: window.variable?.platform };
  },
  mounted() {
    window.renderingOnce.log(this.log);
    window.renderingOnce.notify(this.notify);
  },
  beforeUnmount() {},
  methods: {
    log(rest) {
      console.log(rest);
    },
    notify({ message, type, ...rest }) {
      this.$q.notify({
        type,
        message,
        position: 'center',
        ...rest,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#q-app {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #d6dbe3 0%, #ebedf1 100%);

  .head {
    position: absolute;
    top: -10px;
    left: 0;
    width: 100%;
    height: 20px;
  }

  .main {
    width: 100vw;
    height: 100vh;
    // padding-top: 20px;
  }
}
</style>
