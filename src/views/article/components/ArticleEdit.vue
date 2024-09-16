<script setup>
import { ref } from 'vue'
import ArticleSelectCat from './ArticleSelectCat.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
// 默认数据
const defaultForm = {
  title: '', // 标题
  cate_id: '', // 分类id
  cover_img: '', // 封面图片 file 对象
  content: '', // string 内容
  state: '' // 状态
}

// 准备数据
const formModel = ref({ ...defaultForm })

// const rules = {
//     title: [{
//         required: true, message: '请输入文章标题', trigger: 'blur'
//     }],
//     cat_id: [{
//         required: true, message: '请选择分类', trigger: 'change'
//     }],
// }


const imgUrl=ref(null)
//选择封面
const onSelectFile = (uploadFile)=>{
    imgUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片
    // 立刻将图片对象，存入 formModel.value.cover_img 将来用于提交
    formModel.value.cover_img = uploadFile.raw
}


const emit = defineEmits(['success'])
const onPublish = async (state)=>{
    formModel .value.state= state

  // 注意：当前接口，需要的是 formData 对象
  // 将普通对象 => 转换成 => formData对象
  const fd = new FormData()
  for (let key in formModel .value) {
    fd.append(key, formModel .value[key])
  }

  // 发请求
  if (formModel .value.id) {
    // 编辑操作
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 通知到父组件，添加成功了
    emit('success', 'add')
  }

}


const open = async (row) => {
    visibleDrawer.value = true

    if(row.id){ //编辑
        //获取文章详情，回显数据
        const detail = await artGetDetailService(row.id)
        formModel.value=detail.data.data
        console.log(detail)
        // 图片需要单独处理回显
        imgUrl.value = baseURL + formModel.value.cover_img
        // 注意：提交给后台，需要的数据格式，是file对象格式
        // 需要将网络图片地址 => 转换成 file对象，存储起来, 将来便于提交
        const file = await imageUrlToFileObject(
        imgUrl.value,
        formModel.value.cover_img
        )
        formModel.value.cover_img = file
    }else{
        formModel.value = { ...defaultForm } // 基于默认的数据，重置form数据
        // 这里重置了表单的数据，但是图片上传img地址，富文本编辑器内容 => 需要手动重置
        imgUrl.value = ''
        editorRef.value.setHTML('')
    }
}

// 将网络图片地址转换为 File 对象的函数
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}

//暴露方法给父亲调用
defineExpose({
    open
})

</script>
<template>
    <!-- 新增 || 编辑框 -->
    <el-drawer v-model="visibleDrawer" direction="rtl" size="50%">
        <template #header>
            <h4>{{formModel.id?'编辑文章':'新增文章'}}</h4>
        </template>
        <template #default="{ row }">
            <el-form ref="formRef" :model="formModel">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="formModel.title" placeholder="请输入文章标题" />
                </el-form-item>
                <el-form-item label="文章分类" prop="cat_id">
                    <article-select-cat v-model="formModel.cate_id" width="100%"></article-select-cat>
                </el-form-item>
                <el-form-item label="文章封面" prop="cover_img">
                    <!-- 此处需要关闭 element-plus 的自动上传，不需要配置 action 等参数
                        只需要做前端的本地预览图片即可，无需在提交前上传图标
                        语法：URL.createObjectURL(...) 创建本地预览的地址，来预览
                    -->
                    <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="onSelectFile"
                    >
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <div class="editor">
                    <quill-editor
                        ref="editorRef"
                        v-model:content="formModel.content"
                        content-type="html"
                        theme="snow"
                    ></quill-editor>
                    </div>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
                <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
            </div>
        </template>
    </el-drawer>
</template>


<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
