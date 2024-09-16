<!-- 选择文章分类下拉菜单 -->
<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '@/api/article'
const emit = defineEmits(['update:cate_id'])

defineProps({
    cat_id:{
        type:[Number, String],
    },
    width:{
        type:String
    }
})

// 获取分类列表
const catLlist = ref([])
const getCatList = async () => {
    const res = await artGetChannelsService()
    catLlist.value = res.data.data
}
getCatList();

</script>
<template>
    <el-select 
    :cid="cate_id" 
    @update:cid="emit('update:cate_id', $event)"
    placeholder="请选择" 
    :style="{ width }">
        <el-option 
        v-for="item in catLlist" 
        :key="item.id" 
        :label="item.cate_name" 
        :value="item.id" />
    </el-select>
</template>