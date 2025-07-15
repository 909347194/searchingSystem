<script setup>
</script>

<template>
  <main>
    <h1>大模型检索</h1>
    <router-link to="/login">
      <el-button type="success">
        Start
      </el-button>
    </router-link>

  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  margin: 0 auto;
  background-image: url('@/assets/background.png');
  /* 假设背景图放在 assets 目录下 */
  background-size: cover;
  /* 让背景图覆盖整个页面 */
  background-position: center;
  /* 图片居中显示 */
  background-repeat: no-repeat;
  /* 防止图片重复 */
}
</style>
