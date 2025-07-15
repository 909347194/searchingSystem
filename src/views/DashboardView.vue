<script setup>
import Collapse from '@/components/CollapseAside.vue';

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
          <el-header class="header">Header</el-header>
          <!-- 主栏 -->
          <el-main class="main">Main</el-main>
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
.aside,.header,.main{
  float: left;
}
.aside{
  width: auto;
}
</style>
