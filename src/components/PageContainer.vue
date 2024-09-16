<script setup>
defineProps({
    title: {
        required: true,
        type: String
    }
})

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="page-header">
                <span>{{ title }}</span>
                <slot name="page-header-right"></slot>
            </div>
        </template>
        <slot name="page-content"></slot>
        <!-- <template #footer>
            <slot name="page-footer"></slot>
        </template> -->
    </el-card>
</template>

<style lang="scss" scoped>

.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
