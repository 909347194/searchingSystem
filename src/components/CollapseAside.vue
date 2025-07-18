<script lang="ts" setup>
import { ref } from 'vue'
import { Document, Menu as IconMenu, Setting, View, Hide } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const isCollapse = ref(false)
const changeSwitch = () => {
    isCollapse.value = !isCollapse.value
    if (isCollapse.value) {
         ElMessage({
            message: '边栏收起！',
            type: 'success',
            duration: 800,
            offset: 10,
            plain:true

        })
    } else {
        ElMessage({
            message: '边栏已展开！',
            type: 'success',
            duration: 800,
            offset: 10,
            plain:true
        })
    }
}
// 参数说明：
// key: 被折叠的子菜单的索引（index）。
// keyPath: 一个数组，表示从根菜单到当前子菜单的索引路径。
// 功能：目前只是将 key 和 keyPath 打印到控制台，用于调试或验证菜单的折叠行为。
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
    switch (keyPath[0]) {
        case '2':
            console.log('点击了AI查询')
            break
        case '3':
            console.log('点击了文档管理')
            break
        case '4':
            console.log('点击了系统配置')
            break
        default:
            break
    }
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>
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
                <span>
                    <router-link to="/dashboard/userinfo" class="button">用户</router-link>
                </span>
            </template>
            <el-menu-item-group>
                <template #title><span>Group One</span></template>
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
                <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>


        </el-sub-menu>
        <!-- 第二组 -->
        <el-menu-item index="2">

            <el-icon>
                <icon-menu />
            </el-icon>
            <span>
                <router-link to="/dashboard/query" class="button">AI查询</router-link>
            </span>

        </el-menu-item>
        <el-menu-item index="3">
            <el-icon>
                <document />
            </el-icon>
            <span><router-link to="/dashboard/filemanagement" class="button">文档管理</router-link></span>

        </el-menu-item>
        <el-menu-item index="4">
            <el-icon>
                <setting />
            </el-icon>
            <span>
                <router-link to="/dashboard/settings" class="button">系统配置</router-link>
            </span>
        </el-menu-item>
        <el-menu-item index="5">
            <el-icon @click="changeSwitch">
                <Hide class="switch" v-if="isCollapse"></Hide>
                <View class="switch" v-else></View>
            </el-icon>
            <template #title>
                <div @click="changeSwitch" class="button">边栏控制</div>
            </template>
        </el-menu-item>
    </el-menu>
</template>



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
.button {
  display: inline-block;
}

.button:hover {
    font-style:oblique;
}

.button:active {
  transform: translateY(1px);
}
</style>
