<script setup>
import Collapse from '@/components/CollapseAside.vue';
import { RouterView } from 'vue-router';

</script>
<template>
  <div class="dashboard">
    <div class="common-layout" style="height: 100%">
      <el-container>
        <!-- 侧边 -->
        <el-aside class="aside">
          <Collapse></Collapse>
        </el-aside>
        <el-container>
          <!-- 顶栏 -->
          <el-header class="header">
            Dashboard
            <hr>
          </el-header>
          <!-- 主栏 -->
          <el-main class="main">

            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<style scoped>
.dashboard,
.common-layout {
  width: 100%;
  height: 100%;
}

.aside,
.header,
.main {
  float: left;
}

.aside {
  width: auto;
}

.header,
.main {
  width: 100%;
}

.header {
  height: 5vh;
}

.main {
  height: 95vh;
  margin: 0;
  padding: 0;
}

.title {
  font-size: 20px;
  font-style: bold;
}
</style>
