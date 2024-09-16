<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 1.获取路由对象 useRouter
//  const router = useRouter();
// 2.获取路由参数，useRoute
//  const route = useRoute()
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from '@/stores'
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// const goList = () => {
//   router.push('/list')
// }

</script>

<template>
  <div>
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>

  <!-- <test-demo></test-demo>
  <el-button type="info" @click="$router.push('/home')">跳到首页 </el-button>
  <el-button type="success" @click="goList">跳到列表 </el-button>

  <p>{{ userStore.token }}</p>
  <el-button @click="userStore.setToken('111111111111111')">登录</el-button>
  <el-button @click="userStore.removeToken()">退出</el-button> -->

</template>

<style scoped></style>
