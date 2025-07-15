<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/RegisterForm.vue'
import request from "@/api/index"

// 路由实例
const router = useRouter()

// 表单数据
const loginForm = ref({
    username: '',
    password: ''
})

// 控制注册对话框显示
const showRegisterDialog = ref(false)

// 处理登录逻辑
const handleLogin = () => {
    console.log('登录提交:', loginForm.value)
    // 调用API进行登录验证
    request.post("/userManagement", loginForm.value)
    // 模拟登录成功跳转
    router.push('/dashboard')
}

// 处理注册成功事件
const handleRegisterSuccess = (userData) => {
    console.log('注册成功:', userData)
    showRegisterDialog.value = false

    // 可以自动填充登录表单
    loginForm.value.username = userData.username
}
</script>
<template>
    <div class="login-container">
        <div class="login-card">
            <h2>用户登录</h2>

            <div class="form-group">
                <label>用户名</label>
                <el-input v-model="loginForm.username" placeholder="请输入用户名" />
            </div>

            <div class="form-group">
                <label>密码</label>
                <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" show-password />
            </div>

            <div class="form-actions">
                <el-button type="primary" @click="handleLogin" class="full-width">登录</el-button>
                <el-button @click="showRegisterDialog = true" class="full-width">注册</el-button>
            </div>
        </div>

        <!-- 注册对话框 -->
        <el-dialog v-model="showRegisterDialog" title="用户注册">
            <register-form @register-success="handleRegisterSuccess" />
        </el-dialog>
    </div>
</template>
<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.8);
}

.login-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.full-width {
    width: 100%;
}
</style>