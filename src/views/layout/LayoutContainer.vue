<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
    userStore.getUser()
})

const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })

    // 清除本地的数据 (token + user信息)
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  } else {
    // 跳转操作
    router.push(`/user/${key}`)
  }
}

</script>

<template>
    <!-- 
    el-menu 整个菜单组件
      :default-active="$route.path"  配置默认高亮的菜单项
      router  router选项开启，el-menu-item 的 index 就是点击跳转的路径

    el-menu-item 菜单项
      index="/article/channel" 配置的是访问的跳转路径，配合default-active的值，实现高亮
  -->
    <el-container class="layout-container">
        <el-aside width="200px">
            <el-menu 
            class="el-menu-vertical-demo" 
            active-text-color="#ffd04b"
            background-color="#232323"
            :default-active="$route.path"
            text-color="#fff"
            router>
                <!-- <el-menu-item index="1">
                        <el-icon><icon-menu /></el-icon>
                        <span>去登录</span>
                    </el-menu-item> -->
                <el-menu-item index="/article/channel">
                    <el-icon>
                        <document />
                    </el-icon>
                    <span>文章分类</span>
                </el-menu-item>
                <el-menu-item index="/article/manage">
                    <el-icon>
                        <setting />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item>
                <el-sub-menu index="/user">
                    <template #title>
                        <el-icon>
                            <location />
                        </el-icon>
                        <span>个人中心</span>
                    </template>

                    <!-- 展开的内容 - 默认插槽 -->
                    <el-menu-item index="/user/profile">
                        <el-icon><User /></el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon><Crop /></el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/password">
                        <el-icon><EditPen /></el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="flex-text-middle">
                <strong>{{ userStore.user.username }}</strong>
                <el-dropdown class="header-user" placement="bottom-end" @command="handleCommand">
                    <!-- 展示给用户，默认看到的 -->
                    <span class="el-dropdown__box">
                        <el-avatar :src="userStore.user.user_pic || avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>

                    <!-- 折叠的下拉部分 -->
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-main class="layout-main"><router-view></router-view></el-main>
            <el-footer class="flex-text-middle flex-text-center">大事件 ©2024 Created by PanLiJun</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-menu {
        height: 100%;
    }

    .layout-main {
        background-color: #f5f5f5;
    }

    .header-user {
        margin-left: auto;
    }

    .flex-text-middle {
        display: flex;
        align-items: center;
    }

    .flex-text-center {
        justify-content: center;
    }
}
</style>
