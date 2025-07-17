<template>
  <div class="query-container">
    <!-- 对话历史 -->
    <div class="chat-history" ref="chatHistory">
      <div v-for="(message, index) in messages" :key="index" class="message-item">
        <div :class="['message-bubble', message.isUser ? 'user-message' : 'assistant-message']">
          <div class="message-header">
            <span class="message-role">{{ message.isUser ? '用户' : 'AI助手' }}</span>
            <span
              v-if="!message.isUser"
              class="message-typing"
              v-show="isTyping && index === messages.length - 1"
            ></span>
          </div>
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>
      </div>

      <!-- 无对话时的提示 -->
      <div v-if="messages.length === 0" class="empty-tip">
        <h3>欢迎使用大模型检索系统</h3>
        <p>您可以提出关于系统功能、数据查询或操作指导等方面的问题</p>
      </div>
    </div>

    <!-- 输入区域 -->

    <div class="input-area">
      <el-form @submit.prevent="handleSubmit" label-width="0">
        <el-form-item>
          <el-input
            v-model="inputText"
            placeholder="请向我提问吧！"
            :rows="3"
            type="textarea"
            resize="none"
            @keyup.enter="handleSubmit"
          />
        </el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          class="send-button"
          :loading="isLoading"
          icon="document"
        >
          发送
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/index'

// ========== 状态管理 ==========
const inputText = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const messages = ref([])
const chatHistory = ref(null)

// ========== API 请求 ==========
const sendAIQuery = async () => {
  console.log('发送AI查询请求:', inputText.value)
  try {
    const response = await request.get('http://192.168.9.127:9999/api/ai/query', {
      params: {
        key: inputText.value,
      },
    })
    console.log('API Response:', response)
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('请求失败，请稍后再试')
    throw error
  }
   
}

// ========== 消息发送逻辑 ==========
const sendMessage = async (content) => {
  if (!content.trim()) return

  // 添加用户消息
  messages.value.push({ content, isUser: true })

  // 显示加载状态
  isLoading.value = true
  isTyping.value = true

  try {
    const aiResponse = await sendAIQuery()
    messages.value.push({
      content: aiResponse.data || '未获取到有效回复',
      isUser: false,
    })
  } catch (error) {
    messages.value.push({
      content: '抱歉，暂时无法回答您的问题。',
      isUser: false,
    })
    ElMessage.error('获取回复失败')
  } finally {
    isLoading.value = false
    isTyping.value = false
    scrollToBottom()
  }
}

// ========== 表单提交 ==========
const handleSubmit = () => {
  sendMessage(inputText.value)
    // 清空输入框
    inputText.value = ''
    scrollToBottom()

}

// ========== 页面初始化 & 滚动控制 ==========
onMounted(() => {
  document.querySelector('.el-textarea__inner').focus()
  scrollToBottom()
})

const scrollToBottom = () => {
  nextTick(() => {
    if (chatHistory.value) {
      if (messages.value.length > 10) messages.value.shift()
      chatHistory.value.scrollTop = chatHistory.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.query-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.chat-history {
  flex: 1;
  overflow-y: hidden;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}

.message-item {
  margin-bottom: 15px;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  position: relative;
  clear: both;
  min-height: 40px;
  display: flex;
  flex-direction: column;
}

.message-header {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-role {
  font-weight: bold;
  font-size: 13px;
  color: #666;
}

.message-typing {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  margin-left: 8px;
  position: relative;
  animation: typing 1.4s infinite ease-in-out both;
}

.message-typing::before,
.message-typing::after {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  position: absolute;
}

.message-typing::before {
  left: -10px;
  top: 0;
  animation: typing 1.4s -0.32s infinite ease-in-out both;
}

.message-typing::after {
  left: 10px;
  top: 0;
  animation: typing 1.4s -0.65s infinite ease-in-out both;
}

@keyframes typing {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

.user-message {
  background-color: #409eff;
  color: white;
  float: right;
  border-bottom-right-radius: 0;
}

.assistant-message {
  background-color: #f0f2f5;
  color: #333;
  float: left;
  border-bottom-left-radius: 0;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
  padding: 20px;
}

.input-area {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.send-button {
  margin-top: 10px;
  align-self: flex-end;
  float: right;
}
</style>