<template>
    <div class="register-form">
        <el-form ref="form" :model="registerForm" :rules="rules" label-width="80px" @submit.prevent="handleRegister">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="registerForm.username" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email" type="email" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input v-model="registerForm.password" type="password" show-password />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="registerForm.confirmPassword" type="password" show-password />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" native-type="submit" class="full-width">
                    注册
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 注册表单数据
const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
})

// 表单验证规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 15, message: '长度在3到15个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确的邮箱格式',
            trigger: 'blur'
        }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== registerForm.value.password) {
                    callback(new Error('两次输入密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

// 提交注册
const handleRegister = () => {
    // 这里添加实际的注册逻辑，例如调用API
    console.log('提交注册:', registerForm.value)

    // 模拟API调用延迟
    setTimeout(() => {
        // 发送注册成功事件
        $emit('register-success', registerForm.value)

        // 提示用户
        ElMessage.success('注册成功')
    }, 500)
}

// 定义暴露给父组件的方法（如果需要）
defineExpose({
    handleRegister
})
</script>

<style scoped>
.register-form {
    padding: 1rem;
}

.full-width {
    width: 100%;
}
</style>