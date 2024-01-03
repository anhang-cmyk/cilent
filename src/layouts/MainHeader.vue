<template>
  <q-bar class="app-head q-electron-drag">
    <div class="app-head-seller">
      <div class="seller" :class="companyNo ? 'online' : 'offline'">
        <i class="badge" />
        <div class="seller-name" @click="clickTopName">{{ companyNo || '登录交易中心' }}</div>
      </div>
      <div class="mode" ref="mode">
        <!-- <div class="flex flex-center" @click="clickMode">
          <div :class="['mode-btn', isAuto ? 'open' : '']"></div>
          <div class="mode-name">{{ isAuto ? '自动服务中' : '未开启自动模式' }}</div>
        </div> -->
        <!-- v-model="showProxy" -->
        <div class="popup" :style="{ display: showProxy ? 'block' : 'none' }">
          <div class="mode-confirm">
            <div class="mode-confirm__tit">{{ isAuto ? '关闭' : '开启' }}自动服务？</div>
            <div class="mode-confirm__msg">
              <span v-if="isAuto">切换后，剩余的自动服务数量为 {{ count - 1 }} 个</span>
              <span v-else>当前可用于自动服务的客户端数量为 {{ count }} 个</span>
            </div>
            <div class="mode-confirm__btns">
              <BFButton
                label="取消"
                size="small"
                @click="
                  () => {
                    this.showProxy = false;
                  }
                "
              />
              <BFButton type="primary" label="确认切换" size="small" @click="toggleMode" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="app-head-btns">
      <Icon name="bar_min" @click="clickFn('minimize')" />
      <Icon name="bar_max" @click="clickFn('toggleMaximize')" />
      <Icon name="bar_close" @click="clickFn('close')" />
    </div>

    <div class="app-head-title">
      <!-- <img class="app-head-title__icon" src="img/icon.png" /> -->
      <span class="app-head-title__name">
        <span>自动助手</span>
        <span v-if="isTesting">(开发环境)</span>
      </span>
    </div>
  </q-bar>
  <!-- <BFModal v-model:visible="showModal" title="切换失败" message="当前连接状态不可用，请进入交易中心重新登录" icon="error" okText="去登录" @ok="ready2Login" /> -->
</template>

<script>
import Icon from 'src/components/AppIcon/index.vue';

export default {
  name: 'AppHead',
  components: { Icon },
  data() {
    const isTesting = import.meta.env.DEV;
    return {
      isTesting,
      // 客户端状态
      // isAuto: false, // 是否自动模式
      isLogined: false, // 是否已登录交易中心
      // count: 0, // 当前售电公司：任务中心已注册数量
      // showProxy: false,
      // showModal: false,
      isCreateTaskWin: false,
      notif: () => {},
    };
  },
  computed: {
    companyNo() {
      return '';
      if (this.userinfo?.membersName) return `${process.env.MARKET_NAME}/${this.userinfo.membersName}`;
      return '';
    },
  },
  watch: {
    count() {
      notify({
        message: `剩余的自动服务数量为 ${this.count} 个`,
        type: 'info',
        position: 'center',
      });
    },
  },
  mounted() {
    window.renderingOnce.mainGlobal(this.onChangeSts);
  },
  beforeUnmount() {},
  methods: {
    clickFn(t) {
      /** 窗口事件 */
      if (process.env.MODE !== 'electron') return;
      const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();
      switch (t) {
        case 'minimize':
          win.minimize();
          break;
        case 'toggleMaximize':
          win.isMaximized() ? win.unmaximize() : win.maximize();
          break;
        case 'close':
          win.close();
          break;
        default:
          break;
      }
    },
    onChangeSts(a) {
      console.log(a);
      /** 状态集 */
      // this.isLogined = v.isLogined;
      // this.isAuto = v.isRegistered;
    },
    isCreatTaskFn() {
      this.isCreateTaskWin = true;
      this.notif({
        type: 'positive',
        message: '初始化完成！',
        timeout: 1000,
        position: 'top',
      });
    },
    clickMode() {
      if (!this.isCreateTaskWin && this.isLogined) {
        this.notif = this.$q.notify({
          type: 'ongoing',
          message: '正在初始化中（预计五秒完成）...',
          position: 'top',
        });
        return;
      }
      if (this.isLogined) {
        this.showProxy = true;
      } else {
        this.showModal = true;
      }
    },
    toggleMode() {
      /** 任务中心：注册/注销 */
      this.isAuto = !this.isAuto;
      this.showProxy = false;
      if (process.env.MODE === 'electron') {
      }
    },
    clickTopName() {
      /** 交易中心：登录/查看 */
      if (process.env.MODE === 'electron') {
        if (!this.isLogined) {
          this.ready2Login();
        } else {
        }
      }
    },
    ready2Login() {
      /** 准备登录交易中心 */
      this.showModal = false;
      if (process.env.MODE === 'electron') {
      }
    },
    login() {
      if (this.logined) {
        this.$q.notify({
          message: `已登录，请勿重复点击！`,
          type: 'info',
          position: 'center',
        });
      }
      window.renderingSend.loginPowerGrid();
    },
    outPowerGrid(msg) {
      console.log(msg);
      this.logined = false;
    },
    loginedPowerGrid(msg) {
      console.log(msg);
      this.logined = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-head {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px;
  height: 100%;
  background: transparent;
  width: 100%;
}

.app-head-title {
  display: flex;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;

  &__icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  &__name {
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    font-family: 'HarmonyOS Sans SC';
    color: #3c4043;
  }
}

.popup {
  display: block;
  background: white;
  position: fixed;
  top: 28px;
  left: 236.945px;
  z-index: 999;
  border-radius: 8px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.app-head-btns {
  width: 100px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    width: 24px;
    height: 24px;
    color: #3c4043;
    -webkit-app-region: no-drag;
  }
}

.app-head-seller {
  display: flex;
  align-items: center;

  .seller {
    display: flex;
    align-items: center;
    height: 16px;
    padding: 2px 6px;
    border-radius: 4px;

    &-name {
      cursor: pointer;
      -webkit-app-region: no-drag;
      font-size: 12px;
      line-height: 1;
    }

    .badge {
      display: block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      margin-right: 4px;
    }

    &.online {
      color: #00a870;
      background: #e8f8f2;

      .badge {
        background: #00a870;
      }
    }

    &.offline {
      color: #e34d59;
      background: #fdecee;

      .badge {
        background: #e34d59;
      }
    }
  }

  .mode {
    display: flex;
    align-items: center;
    margin-left: 12px;

    &-btn {
      -webkit-app-region: no-drag;
      position: relative;
      width: 28px;
      height: 16px;
      background-color: #c5c5c5;
      border-radius: 12px;
      padding: 2px;
      cursor: pointer;
      transition: background-color 0.22s cubic-bezier(0.4, 0, 0.2, 1);

      &::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        transition: left 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        background: #fff;
      }

      &.open {
        background-color: #0052d9;

        &::after {
          left: 14px;
        }
      }
    }

    &-name {
      font-size: 12px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.6);
      margin-left: 4px;
    }
  }
}
</style>

<style lang="scss">
.mode-confirm {
  padding: 16px;

  &__tit {
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 8px;
  }

  &__msg {
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 16px;
  }

  &__btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
