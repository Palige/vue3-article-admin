<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user.js'
const userStore = useUserStore()
const form = ref(userStore.user)
const submitForm = async () => {
    const res = await userUpdateInfoService(form.value)
    if (res.data.code === 0) {
        await userStore.getUser();
        ElMessage.success('信息修改成功')
    } else {
        ElMessage.error('信息修改失败')
    }
}
</script>

<template>
    <page-container title="基本资料">
        <template #page-content>
            <!-- 表单部分 -->
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="登录名称">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickname">
                    <el-input v-model="form.nickname"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">提交修改</el-button>
                </el-form-item>
            </el-form>
        </template>
    </page-container>
</template>

<style lang="scss" scoped></style>