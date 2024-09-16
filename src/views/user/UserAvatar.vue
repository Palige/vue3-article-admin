<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)

const onSelectFile = (uploadFile) => {
    // 基于 FileReader 读取图片做预览
    const reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw)
    reader.onload = () => {
        imgUrl.value = reader.result
    }
}

const onUpdateAvatar = async () => {
    const res = await userUpdateAvatarService(imgUrl.value)
    console.log(res);
    if (res.data.code === 0) {
        await userStore.getUser();
        ElMessage.success('头像更新成功')
    } else {
        ElMessage.error('头像更新失败')
    }
}

</script>

<template>
    <page-container title="更换头像">
        <template #page-content>
            <div class="user-avatar">
                <el-upload 
                ref="uploadRef" 
                :auto-upload="false" 
                class="avatar-uploader" 
                :show-file-list="false"
                :on-change="onSelectFile">
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
                <el-button @click="onUpdateAvatar" type="success" :icon="Upload" size="large">确认上传</el-button>
            </div>
        </template>
    </page-container>
</template>

<style lang="scss" scoped>
.user-avatar {
    .avatar {
        width: 150px;
        height: 150px;
    }

    .el-upload {
        border: 1px dashed #666;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        text-align: center;
    }
}
</style>
