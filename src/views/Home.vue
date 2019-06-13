<style lang="scss" scoped>
@import "../assets/style/init";

.home-container {
  width: 100%;
  height: 100%;
  .home-header {
    background-color: #545c64;
    color: #fff;
    h1 {
      display: inline-block;
      float: left;
      width: 300px;
      height: 100%;
      line-height: 60px;
    }
    .header-right {
      display: inline-block;
      float: right;
      line-height: 60px;
    }
  }
  .home-aside {
    background-color: #545c64;
    .left-home-icon {
      margin-right: 10px;
    }
  }
  .home-main {
    background-color: #aaa;
    .main-card {
      width: 100%;
      height: calc(100% - 4px);
    }
  }
  .loginout {
    color: cornflowerblue;
    cursor: pointer;
  }
}
</style>

<template>
  <el-container class="home-container">
    <el-header class="home-header">
      <h1>思龙食品后台管理系统</h1>
      <div class="header-right">
        <span @click="loginout" class="loginout">退出{{ loginData.username }}账号</span>
      </div>
    </el-header>
    <el-container>
      <el-aside class="home-aside" width="240px">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
            >
              <el-submenu v-for="item in submenu" :key="item.id" :index="item.id">
                <template slot="title">
                  <i :class="item.icon" :style="item.color"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="child in item.children" :key="child.id" :index="child.id">
                    <router-link tag="li" :to="child.to">{{child.title}}</router-link>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main class="home-main">
        <el-card class="box-card main-card" style="text-align: center;" v-show="isShow">
          <h1>你好 {{ loginData.username }}</h1>
          <p>欢迎使用思龙食品有限公司后台管理 OA系统</p>
          <a href="http://bz.cfsa.net.cn/db" target="_black">食品国家平台数据检索中心</a>
        </el-card>
        <el-card class="box-card main-card" v-show="!isShow">
          <router-view/>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
// import http from "../utils/http";

@Component({
  components: {},
})

export default class Home extends Vue {
  @Provide() private isShow: boolean = true;
  @Provide() private loginData: object = {};
  @Provide() private submenu: object = [
    {
      id: "1",
      key: 2,
      title: "产品",
      icon: "iconfont icon-chanpin left-home-icon",
      color: "#5f87e3",
      children: [
        {
          id: "1-1",
          key: 2,
          title: "产品总览",
          to: "/home/product",
        },
      ],
    },
    {
      id: "2",
      key: 2,
      title: "库存",
      icon: "iconfont icon-kucun left-home-icon",
      color: "color:#ffb012",
      children: [
        {
          id: "2-1",
          key: 2,
          title: "存货",
          to: "/home/warehouse",
        },
        {
          id: "2-2",
          key: 2,
          title: "原料",
          to: "/home/material",
        },
        {
          id: "2-3",
          key: 2,
          title: "退货",
          to: "/home/return",
        },
      ],
    },
    {
      id: "3",
      key: 2,
      title: "记工",
      icon: "iconfont icon-weibiaoti2fuzhi17 left-home-icon",
      color: "color:#f8778f",
      children: [
        {
          id: "3-1",
          key: 2,
          title: "记工总览",
          to: "/home/overview",
        },
        {
          id: "3-2",
          key: 2,
          title: "机器工记工",
          to: "/home/machine",
        },
        {
          id: "3-3",
          key: 2,
          title: "包装袋工人记工",
          to: "/home/bagging",
        },
      ],
    },
    {
      id: "4",
      key: 1,
      title: "花销",
      icon: "iconfont icon-zaixianchuzhang left-home-icon",
      color: "color:#64aed0",
      children: [
        {
          id: "4-1",
          key: 2,
          title: "花销总览",
          to: "/home/product",
        },
      ],
    },
    {
      id: "5",
      key: 1,
      title: "发货",
      icon: "iconfont icon-fahuo left-home-icon",
      color: "color:skyblue",
      children: [
        {
          id: "5-1",
          key: 2,
          title: "发货总览",
          to: "/home/product",
        },
      ],
    },
    {
      id: "6",
      key: 1,
      title: "流水",
      icon: "iconfont icon-baobiao left-home-icon",
      color: "color:#9870f9",
      children: [
        {
          id: "6-1",
          key: 2,
          title: "流水总览",
          to: "/home/product",
        },
      ],
    },
    {
      id: "7",
      key: 2,
      title: "设置",
      icon: "iconfont icon-shezhi left-home-icon",
      color: "color:#fff",
      children: [
        {
          id: "7-1",
          key: 2,
          title: "设置总览",
          to: "/home/product",
        },
      ],
    },
  ];

  private butclick(data: number): number {
    return data;
  }
  private handleOpen(key: string, keyPath: string) {
    this.isShow = false;
    // console.log(key, keyPath);
  }
  private handleClose(key: string, keyPath: string) {
    // console.log(key, keyPath);
  }
  // 退出账号
  private loginout() {
    document.cookie = "";
    this.$router.push({name: "login"});
  }
  private created() {
    if (localStorage.login) {
      this.loginData = JSON.parse(localStorage.login);
    } else {
      this.loginData = JSON.parse(this.$route.params.data);
    }
  }
}
</script>
