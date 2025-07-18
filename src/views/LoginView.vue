<script setup>
/* 登录页面 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
//局部注册的组件RegisterForm；只能在当前的组件中使用。
import RegisterForm from '@/components/RegisterForm.vue'
import request from '@/api/index'
// -------------
let fatherData = '这是父组件中的数据'
// -------------

// 路由实例
const router = useRouter()
// 表单数据
const loginForm = ref({
  username: '',
  password: '',
})

//登录表单验证
const loginFormRef = ref() // 用于获取表单实例
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
// 控制注册对话框显示
const showRegisterDialog = ref(false)

// 处理登录逻辑
const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      // 表单验证通过，调用登录接口
      request
        .post('/login', loginForm.value)
        .then((response) => {
          //检验状态码
          if (response.code === 200) {
            // 登录成功：保存 token
            localStorage.setItem('token', response.data.token)
            // 跳转页面
            router.push('/dashboard')
            ElMessage.success('登录成功')
          } else {
            ElMessage.error(response.message || '登录失败')
          }
        })
        .catch((error) => {
          console.error('登录请求失败:', error)
          ElMessage.error('网络异常，请稍后再试')
        })
    } else {
      ElMessage.error('请填正确写用户名和密码')
      return false
    }
  })
}
/* 
 总结
    步骤	内容
    ✅ 1. 获取输入	username, password
    ✅ 2. 表单验证	非空、格式等
    ✅ 3. 发起 API 请求	POST /login
    ✅ 4. 处理响应	成功/失败分别处理
    ✅ 5. 存储 Token	localStorage / Vuex
    ✅ 6. 页面跳转	router.push()
    ✅ 7. 错误提示	ElMessage 显示友好提示
*/

// 处理注册成功事件；理注册成功后的逻辑，比如关闭对话框、自动填充登录表单等。
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
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="full-width">登录</el-button>
          <el-button @click="showRegisterDialog = true" class="full-width">注册</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 注册对话框 -->
    <el-dialog v-model="showRegisterDialog" title="用户注册">
      <!-- 在当前父组件中可以在被使用的子组件的标签上采用属性方式来传递props值，":"或"v-bind:" 
            属性值是对该数据在子组件中的命名； 就是将某一标签属性绑定上父组件中的数据
            -->
      <RegisterForm @register-success="handleRegisterSuccess" :testProps="fatherData"></RegisterForm>
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
