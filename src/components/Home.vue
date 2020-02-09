<template>
  <el-container class="main-container">
    <el-header>
      <div class="header-left">
        <el-avatar :size="40" :src="squareUrl"></el-avatar>
        <span class="header-user-name">HoNRean_</span>
      </div>
      <el-button size="small" type="info" @click="logOut">退出</el-button>
    </el-header>
    <el-container class="aside-main-container">
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <h5 class="drop-menu" @click="dropMenu">|||</h5>
        <el-menu
          :collapse="isCollapse"
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          :unique-opened="true"
          :router="true"
          :collapse-transition="false"
          active-text-color="#409eff"
        >
          <el-submenu :index="'/'+item.path" v-for="item in menus" :key="JSON.stringify(item)">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+i.path" v-for="i in item.children" :key="JSON.stringify(i)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{i.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Index",
  components: {},
  data() {
    return {
      squareUrl:
        "https://c-ssl.duitang.com/uploads/item/201801/05/20180105104510_TGJQj.jpeg",
      isCollapse: false,
      menus: [],
      icons: {
        "125": "el-icon-s-custom",
        "103": "el-icon-s-check",
        "101": "el-icon-s-shop",
        "102": "el-icon-s-order",
        "145": "el-icon-s-data"
      }
    };
  },
  created() {
    this.getMenus();
  },
  mounted() {},
  methods: {
    logOut() {
      sessionStorage.removeItem("token");
      this.$router.push("/");
    },
    dropMenu() {
      this.isCollapse = !this.isCollapse;
    },
    getMenus() {
      const _this = this;
      this.$axios.get("/menus").then(res => {
        const { data } = res;
        if (data.meta.status == 200) {
          _this.menus = data.data;
        }
      });
    }
  }
};
</script>
<style lang="less" scope>
.el-header {
  background: #373d41;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-left {
  display: flex;
  align-items: center;
  color: #fff;
  .header-user-name {
    margin-left: 10px;
  }
}
.el-aside {
  background-color: #333744;
  overflow: hidden;
}
.main-container {
  height: 100%;
}
.drop-menu {
  color: #fff;
  text-align: center;
  letter-spacing: 1px;
  border-bottom:1px solid #373d41;
  margin: 0;
  padding:10px;
  cursor: pointer;
}
.el-menu {
  border: none;
}
.el-main {
  background-color: #eaedf1;
}
</style>