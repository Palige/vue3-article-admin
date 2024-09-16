<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artAddChannelService, artEditChannelService, artDelChannelService } from '@/api/article'

// 获取分类列表
const list = ref([])
const getList = async () => {
    const res = await artGetChannelsService()
    list.value = res.data.data
}
getList();


//添加分类
const formRef = ref()
const dialogFormVisible = ref(false)
const formModal = ref({
    cate_name: '',
    cate_alias: ''
})
const rules = {
    cate_name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是 1-10 位的非空字符',
            trigger: 'blur'
        }

    ],
    cate_alias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类名必须是 1-15 位的字母或数字',
            trigger: 'blur'
        }
    ]
}

const addItem = () => {
    formModal.value = { ...{} }
    dialogFormVisible.value = true
}


//  编辑分类
const editItem = async (row, index) => {
    formModal.value = { ...row }
    dialogFormVisible.value = true
}

const onDialogConfirm = async () => {
    await formRef.value.validate()
    const result = ref()
    if (formModal.value.id) {  //编辑
        result.value = await artEditChannelService(formModal.value)

    } else {  //新增
        result.value = await artAddChannelService(formModal.value)
    }
    if (result.value.data.code === 0) {
        ElMessage.success(result.value.data.message)
        getList();
        formRef.value.resetFields()
        dialogFormVisible.value = false

    } else {
        ElMessage.error(result.value.data.message)
    }
}



//删除分类
const delItem = async (row, index) => {
    await ElMessageBox.confirm('你确认要删除该分类么', '温馨提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
    })
    const result = await artDelChannelService(row.id)
    if (result.data.code === 0) {
        ElMessage.success(result.data.message)
        getList();

    } else {
        ElMessage.error(result.data.message)
    }
}

</script>

<template>
    <page-container title="文章分类">
        <template #page-header-right>
            <el-button type="primary" @click="addItem">添加分类</el-button>
        </template>

        <template #page-content>
            <el-table :data="list" style="width: 100%">
                <el-table-column fixed prop="id" label="序号" width="100" />
                <el-table-column prop="cate_name" label="分类名称" />
                <el-table-column prop="cate_alias" label="分类别名" />
                <el-table-column fixed="right" label="操作" min-width="120">
                    <!-- row 就是 channelList 的一项， $index 下标 -->
                    <template #default="{ row, $index }">
                        <el-button link type="primary" size="small" @click="editItem(row, $index)"><el-icon>
                                <Edit />
                            </el-icon></el-button>
                        <el-button link type="primary" size="small" @click="delItem(row, $index)"><el-icon>
                                <Delete />
                            </el-icon></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>

        <!-- <template #page-footer>底部做分页</template> -->
    </page-container>


    <!-- 添加分类 || 编辑 -->
    <el-dialog v-model="dialogFormVisible" :title="formModal.id ? '编辑分类' : '添加分类'" width="500">
        <el-form ref="formRef" :model="formModal" :rules="rules">
            <el-form-item label="分类名称" prop="cate_name">
                <el-input v-model="formModal.cate_name" placeholder="请输入分类别名" />
            </el-form-item>
            <el-form-item label="分类别名" prop="cate_alias">
                <el-input v-model="formModal.cate_alias" placeholder="请输入分类别名" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="onDialogConfirm">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<style lang="scss" scoped></style>