<script setup>
/* 登录页面的注册组件 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/index' // 已有封装好的 axios 实例
//---------------------------------------
/* 声明接收父组件中传递的属性值；自定义属性
defineProps(['testProps']);
视图模板中可以直接使用testProps
let props = defineProps(['testProps'])
JS中需要通过defineProps返回的的对象来访问props；并且props是只读的，只能在父组件中修改
还可以使用对象形式进行props声明，可以对父组件传来的值进行校验；
*/
//--------------------------------------- 
let props = defineProps({
    testProps: {
        type: String,
        required: true
    }
})



//获取表单实例
const form = ref()

// 注册表单数据
const registerForm = ref({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '', // 新增手机号字段
    email: '',
})

// 表单验证规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 15, message: '长度在3到15个字符', trigger: 'blur' }
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
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
            pattern: /^1[3-9]\d{9}$/, // 简单匹配中国大陆手机号格式
            message: '请输入正确的手机号',
            trigger: 'blur'
        }
    ],
    email: [
        { required: false, message: '请输入邮箱地址', trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确的邮箱格式',
            trigger: 'blur'
        }
    ],
}


// 1. 定义 emit；声明自定义事件；进行子组件向父组件中传值
const emit = defineEmits(['register-success'])//字符串形式；同样有对象形式的定义

// 提交注册
const handleRegister = () => {
    form.value.validate((valid) => {
        if (valid) {
            console.log('验证通过，提交数据:', registerForm.value)

            // 发起真实 API 请求
            request.post('/userManagement', registerForm.value)
                .then(res => {
                    if (res.status === 201) {
                        emit('register-success', registerForm.value)//成功时触发自定义事件
                        ElMessage.success('注册成功')
                    } else {
                        ElMessage.error(res.message || '注册失败')
                    }
                })
                .catch(error => {
                    console.error('注册失败:', error)
                    ElMessage.error('注册失败，请重试')
                })
            /* 
            2. 后端 API 通常会做以下事情
                功能	描述
                ✅ 校验用户名、邮箱是否已存在	防止重复注册
                ✅ 加密密码（如使用 bcrypt）	安全存储用户密码
                ✅ 存储用户信息到数据库	如 MongoDB、MySQL 等
                ✅ 返回成功状态码和用户信息	如 { code: 200, data: user }

                补充建议
                使用 Token 认证时，注册成功后可以跳转登录页或直接登录。
                可以添加加载动画：在请求期间设置按钮为 loading 状态。
                对敏感字段进行脱敏处理（如不返回原始密码）。

                ✅ 小结
                步骤	内容
                ✅ 1. 替换 setTimeout	改为调用 request.post() 接口
                ✅ 2. 接口功能	注册校验 + 密码加密 + 数据库存储
                ✅ 3. 响应处理	成功/失败分别提示，并触发事件
                ✅ 4. 安全性	不明文传输密码，使用 HTTPS
            */
        } else {
            console.log("表单验证失败，请检查输入");
            ElMessage.error('表单验证失败，请检查输入')
            // 导致函数提前退出，ElMessage 来不及渲染
            return false
        }
    })
}


// 定义暴露给父组件的方法（如果需要）
defineExpose({
    handleRegister
})
</script>
<template>
    <div class="register-form">
        <el-form ref="form" :model="registerForm" :rules="rules" label-width="80px" @submit.prevent="handleRegister">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="registerForm.username" />
            </el-form-item>


            <el-form-item label="密码" prop="password">
                <el-input v-model="registerForm.password" type="password" show-password />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="registerForm.confirmPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="registerForm.phone" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email" type="email" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit" class="full-width">
                    注册
                </el-button>

            </el-form-item>
        </el-form>
        <div>
            {{ props.testProps }}

        </div>
    </div>
</template>
<style scoped>
.register-form {
    padding: 1rem;
}

.full-width {
    width: 100%;
}
</style>