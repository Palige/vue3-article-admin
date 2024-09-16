<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artGetListService,artDelService } from '@/api/article'
import ArticleSelectCat from './components/ArticleSelectCat.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { formatTime } from '@/utils/format.js'
import { Delete, Edit } from '@element-plus/icons-vue'

// 获取分类列表
const catLlist = ref([])
const getCatList = async () => {
    const res = await artGetChannelsService()
    catLlist.value = res.data.data
}
getCatList();

// 定义请求参数对象
const params = ref({
    pagenum: 1, // 当前页
    pagesize: 10, // 当前生效的每页条数
    cate_id: '',
    state: ''
})

//获取文章列表
const total = ref(0)
const articleList = ref([])
const getArticleList = async () => {
    const res = await artGetListService(params.value)
    articleList.value = res.data.data
    total.value = res.data.total
}
getArticleList();

// 处理分页逻辑
const onSizeChange = (size) => {
    // console.log('当前每页条数', size)
    // 只要是每页条数变化了，那么原本正在访问的当前页意义不大了，数据大概率已经不在原来那一页了
    // 重新从第一页渲染即可
    params.value.pagenum = 1
    params.value.pagesize = size
    // 基于最新的当前页 和 每页条数，渲染数据
    getArticleList()
}
const onCurrentChange = (page) => {
    // 更新当前页
    params.value.pagenum = page
    // 基于最新的当前页，渲染数据
    getArticleList()
}

// 搜索逻辑 => 按照最新的条件，重新检索，从第一页开始展示
const onSearch = () => {
    params.value.pagenum = 1 // 重置页面
    getArticleList()
}

// 重置逻辑 => 将筛选条件清空，重新检索，从第一页开始展示
const onReset = () => {
    params.value.pagenum = 1 // 重置页面
    params.value.cate_id = ''
    params.value.state = ''
    getArticleList()
}

const articleEditRef = ref()
const onAddArticle = () => {
    articleEditRef.value.open({})
}

//编辑
const onEditArticle = (row) => {
    articleEditRef.value.open(row)
}


//新增 || 编辑文章成功回调
const onSuccess = (type) => {
    if (type === 'add') {
        // 如果是添加，最好渲染最后一页
        const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
        // 更新成最大页码数，再渲染
        params.value.pagenum = lastPage
    }
    getArticleList()
}


//删除
const onDeleteArticle = async (row) => {
    await ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
    })
    const result = await artDelService(row.id)
    if (result.data.code === 0) {
        ElMessage.success(result.data.message)
        getArticleList();

    } else {
        ElMessage.error(result.data.message)
    }
}


</script>


<template>
    <page-container title="文章管理">
        <template #page-header-right>
            <el-button type="primary" @click="onAddArticle">添加文章</el-button>
        </template>

        <template #page-content>
            <!-- 筛选区域 -->
            <el-form inline>
                <el-form-item label="选择分类：">
                    <!-- Vue2 => v-model :value 和 @input 的简写 -->
                    <!-- Vue3 => v-model :cate_id 和 @update:cate_id 的简写 -->
                    <article-select-cat v-model="params.cate_id" width="180px"></article-select-cat>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <el-select v-model="params.state" style="width: 120px;">
                        <el-option label="已发布" value="已发布"></el-option>
                        <el-option label="草稿" value="草稿"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                    <el-button type="default" @click="onReset">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 表格区域 -->
            <el-table :data="articleList" v-loading="loading">
                <el-table-column label="文章标题" prop="title">
                    <template #default="{ row }">
                        <el-link type="primary" :underline="false">{{ row.title }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="分类" prop="cate_name"></el-table-column>
                <el-table-column label="发表时间" prop="pub_date">
                    <template #default="{ row }">
                        {{ formatTime(row.pub_date) }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="state"></el-table-column>
                <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button circle plain type="primary" :icon="Edit" @click="onEditArticle(row)"></el-button>
                        <el-button circle plain type="danger" :icon="Delete" @click="onDeleteArticle(row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
                :page-sizes="[2, 3, 5, 10]" :background="true" layout="jumper, total, sizes, prev, pager, next"
                :total="total" @size-change="onSizeChange" @current-change="onCurrentChange"
                style="margin-top: 20px; justify-content: flex-end" />
        </template>
    </page-container>

    <!-- 添加编辑的抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>

</template>