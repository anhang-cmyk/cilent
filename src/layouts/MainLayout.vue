<template>
  <div class="app-layout">
    <div class="loginStatus"></div>
    <aside>
      <ul class="app-menu1">
        <li v-for="(menu1, idx) in allRoutes" :key="`menu1_${idx}`">
          <div :class="['app-menu1-item', idx === menu1Idx ? 'active' : '']" @click="onClickMenu1(menu1, idx)">
            <div class="icon">
              <img :src="''" />
            </div>
            <div class="title">{{ menu1.name }}</div>
          </div>
        </li>
      </ul>
      <div class="app-settings">
        <div>
          <div class="app-settings__avatar">
            <img :src="userinfo?.avatar || ''" />
            <q-popup-proxy>
              <div class="user-popup">
                <div class="user-popup__head">
                  <div class="user-popup__avatar">
                    <img :src="userinfo?.avatar || ''" />
                  </div>
                  <div>
                    <div class="user-popup__name">{{ userinfo?.name || '-' }}</div>
                    <div class="user-popup__mobile">{{ userinfo?.mobile || '-' }}</div>
                  </div>
                </div>
                <div class="user-popup__menu">
                  <div @click="go2('个人信息')">个人信息</div>
                  <div @click="go2('修改密码')">修改密码</div>
                  <div @click="go2('软件更新')">软件更新</div>
                  <div @click="handleLogout">退出登录</div>
                </div>
              </div>
            </q-popup-proxy>
          </div>
        </div>
      </div>
    </aside>
    <main :class="platform === 'win32' ? 'winMain' : ''">
      <ul class="app-menu2" v-if="subMenus?.length > 0">
        <li v-for="(menu2, idx) in subMenus" :key="`menu2_${idx}`" :class="menu2.path === activePath ? 'active' : ''" @click="onClickMenu2(menu2)">
          <div class="icon">
            <i :class="['iconfont', menu2.icon]" />
          </div>
          {{ menu2.name }}
        </li>
      </ul>
      <div :class="['app-view', !subMenus?.length ? 'empt' : '']">
        <q-layout>
          <q-page-container style="height: 100vh; width: calc(100vw - 60px); padding: 24px">
            <router-view />
          </q-page-container>
        </q-layout>
      </div>
    </main>
  </div>
</template>

<script>
const whiteList = [
  {
    path: '/home',
    name: '首页',
    icon: 'icon-navigation_jiaoyi1',
    actIcon: 'icon-navigation_jiaoyi2',
  },
  {
    path: '/ridianliang',
    name: '日电量',
    icon: 'icon-navigation_jiaoyi1',
    actIcon: 'icon-navigation_jiaoyi2',
    children: [
      { path: '/ridianliang/addUser', name: '用户绑定', icon: 'icon-navigation_jiaoyi1', actIcon: 'icon-navigation_jiaoyi2' },
      { path: '/ridianliang/exportDetail', name: '导出明细', icon: 'icon-navigation_jiaoyi1', actIcon: 'icon-navigation_jiaoyi2' },
    ],
  },
];

export default {
  name: 'AppLayout',
  /** data */
  data() {
    return {
      platform: window.variable?.platform,
      allRoutes: whiteList, // 权限路由
      menu1Idx: 0, // 当前应用索引
      subMenus: [],
      outDialog: false,
      activePath: '',
      userinfo: {},
    };
  },
  watch: {
    activePath(v) {
      if (!v) return;
      if (v === '/setting') {
        this.menu1Idx = null;
        this.subMenus = [{ path: '/setting', name: '设置', icon: 'icon-setting' }];
      }
    },
  },
  /** lifetime */
  mounted() {
    this.$router.push({ path: '/ridianliang/addUser', query: {} });
    this.fetchMenus();
  },
  /** methods */
  methods: {
    async fetchMenus(postdata) {},
    onClickMenu1(item, idx) {
      /** 点击应用 */
      if (idx === this.menu1Idx) return;
      this.menu1Idx = idx;
      this.subMenus = this.allRoutes[idx].children;
      this.activePath = this.allRoutes[idx].children?.[0]?.path;
      this.$router.push({ path: this.activePath || this.allRoutes[idx]?.path, query: {} });
    },
    onClickMenu2({ path, code }) {
      /** 点击菜单 */
      if (path === this.activePath) return;
      this.activePath = path;
      this.$router.push({ path, query: {} });
    },
    go2(active) {
      /** 跳转路由 */
      if (this.$route.query?.active !== active) {
        this.$router.replace({ path: '/setting', query: { active } });
      }
    },
    /** 登出 */
    handleLogout() {
      this.outDialog = true;
    },
    logoutApp() {
      this.$store.dispatch('user/logout');
    },
  },
};
</script>

<style lang="scss" scoped>
.app-layout {
  width: 100%;
  height: 100%;
  display: flex;

  > aside {
    width: 60px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-top: calc(40px - 14px);
  }

  > main {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin-top: 40px;
  }

  > .winMain {
    margin-top: 40px;
  }

  .app-view {
    position: relative;
    flex: 1;
    overflow: hidden;
    // padding: 4px;
    background: white;

    &.empt {
      border-top-left-radius: 6px;
    }
  }
}

// 应用(左边)
.app-menu1 {
  width: 44px;
  padding: 2px;
  background: #fff;
  border-radius: 8px;
  > li::marker {
    content: '';
  }

  > li:not(:last-child)::after {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    margin: 2px auto;
    background: #eee;
  }

  .app-menu1-item {
    width: 40px;
    height: 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      font-size: 20px !important;
      margin-top: 6px;

      img {
        height: 18px;
      }
    }

    .title {
      font-weight: 400;
      font-size: 10px;
      line-height: 13px;
      color: #676767;
    }

    &.active {
      background: linear-gradient(180deg, #ecf2fe 0%, rgba(236, 242, 254, 0) 100%);
      border-radius: 6px;

      .title {
        font-weight: 500;
        color: #333;
      }

      .icon {
        color: #0052d9;
      }
    }
  }
}

// 菜单(顶部)
.app-menu2 {
  height: 34px;
  display: flex;
  margin-bottom: 0px;
  padding: 0px;
  margin: 0;

  > li {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px 6px 0px 0px;
    font-size: 12px;
    line-height: 18px;
    background: #fafafa;
    color: #333333;
    opacity: 0.6;
    cursor: pointer;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      font-size: 12px;
      margin-right: 4px;
    }

    &.active {
      background: #ffffff;
      opacity: 1;

      .icon {
        color: #0052d9;
      }
    }
  }
}

// 个人信息
.app-settings {
  padding-bottom: 16px;

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;

    > img {
      width: 100%;
      max-width: 100%;
      max-height: 100%;
    }
  }
}

.user-popup {
  position: fixed;
  bottom: 16px;
  left: 54px;
  width: 320px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05), 0px 4px 5px rgba(0, 0, 0, 0.08), 0px 2px 4px -1px rgba(0, 0, 0, 0.12);
  border-radius: 6px;

  &__head {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  &__avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;

    > img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  &__name {
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.9);
  }

  &__mobile {
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.6);
  }

  &__menu {
    > div {
      height: 32px;
      padding: 5px 8px;
      border-radius: 3px;
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.9);
      cursor: pointer;

      &:hover {
        background: #f3f3f3;
      }
    }

    > div + div {
      margin-top: 4px;
    }
  }
}
</style>
