<template>
    <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
        @close="handleClose">
        <!-- 第一组 -->
        <el-sub-menu index="1">
            <template #title>
                <el-icon>
                    <el-avatar shape="square"
                        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </el-icon>
                <span>个人中心</span>
            </template>
            <el-menu-item-group>
                <template #title><span>Group One</span></template>
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
                <template #title><span>item four</span></template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
        </el-sub-menu>
        <!-- 第二组 -->
        <el-menu-item index="2">

            <el-icon>
                <icon-menu />
            </el-icon>
            <span>AI 查询</span>
        </el-menu-item>
        <el-menu-item index="3">
            <el-icon>
                <document />
            </el-icon>
            <template #title>文档管理</template>
        </el-menu-item>
        <el-menu-item index="4">
            <el-icon>
                <setting />
            </el-icon>
            <template #title>系统配置</template>
        </el-menu-item>
        <el-menu-item index="5">
            <el-icon @click="changeSwitch">
                <Hide class="switch" v-if="isCollapse"></Hide>
                <View class="switch" v-else></View>
            </el-icon>
            <template #title>
                <div @click="changeSwitch">边栏控制</div>
            </template>
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
    View,
    Hide
} from '@element-plus/icons-vue'

const isCollapse = ref(false)
const changeSwitch = () => {
    isCollapse.value = !isCollapse.value
}
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 100vh;
}

.el-menu-vertical-demo:is(.el-menu--collapse) {
    min-height: 100vh;
}

.switch {
    float: right;
    margin-bottom: 2px;
}
</style>
