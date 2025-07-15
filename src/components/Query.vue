<template>
    <div class="query-container">
        <!-- 对话历史 -->
        <div class="chat-history" ref="chatHistory">
            <div v-for="(message, index) in messages" :key="index" class="message-item">
                <div :class="[
                    'message-bubble',
                    message.isUser ? 'user-message' : 'assistant-message'
                ]">
                    <div class="message-header">
                        <span class="message-role">{{ message.isUser ? '用户' : 'AI助手' }}</span>
                        <span v-if="!message.isUser" class="message-typing"
                            v-show="isTyping && index === messages.length - 1"></span>
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
            <el-form @submit.prevent="handleSubmit" ref="form" label-width="0">
                <el-form-item>
                    <el-input v-model="inputText" placeholder="请向我提问吧！" :rows="3" type="textarea" resize="none"
                        @keyup.enter="handleSubmit" />
                </el-form-item>
                <el-button type="primary" native-type="submit" class="send-button" :loading="isLoading" icon="document">
                    发送
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

// 对话消息列表
const messages = ref([])

// 输入文本
const inputText = ref('')

// 加载状态
const isLoading = ref(false)

// 打字效果状态
const isTyping = ref(false)

// 聊天历史容器引用
const chatHistory = ref(null)

// 模拟发送消息
const sendMessage = (content) => {
    if (!content.trim()) return

    // 添加用户消息到对话历史
    messages.value.push({
        content: content,
        isUser: true
    })

    // 清空输入框
    inputText.value = ''

    // 显示加载状态
    isLoading.value = true
    isTyping.value = true

    // 模拟AI回复（实际应调用API）
    setTimeout(() => {
        isLoading.value = false
        isTyping.value = false

        // 添加模拟的AI回复
        messages.value.push({
            content: generateMockResponse(content),
            isUser: false
        })

        // 滚动到底部
        scrollToBottom()
    }, 1000)
}

// 生成模拟回复
const generateMockResponse = (query) => {
    const responses = [
        `您问的是 "${query}"，这是一个很好的问题...\n\n关于这个问题，我理解的是...`,
        `让我来帮您解答关于"${query}"的问题：\n\n...`,
        `这是一个模拟回复，实际应用中应该使用AI接口获取结果。\n\n更多详细信息可以参考...`,
        `关于"${query}"，我的建议是...\n\n同时您可以尝试其他相关查询如...`
    ]

    return responses[Math.floor(Math.random() * responses.length)]
}

// 处理表单提交
const handleSubmit = () => {
    sendMessage(inputText.value)
}

// 页面加载时自动聚焦输入框
onMounted(() => {
    document.querySelector('.el-textarea__inner').focus()
    scrollToBottom()
})

// 滚动到底部的方法
const scrollToBottom = () => {
    nextTick(() => {
        if (chatHistory.value) {
            // 固定显示最近的10条消息，防止滚动条出现
            if (messages.value.length > 10) {
                messages.value.shift()
            }

            // 平滑滚动到底部
            chatHistory.value.scrollTop = chatHistory.value.scrollHeight
        }
    })
}
</script>

<style scoped>
.query-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
    background-color: #f5f7fa;
}

.chat-history {
    flex: 1;
    overflow-y: hidden;
    /* 禁止垂直滚动 */
    margin-bottom: 20px;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: relative;
    max-height: calc(100vh - 400px);
    /* 根据实际情况调整最大高度 */
    overflow-y: auto;
    /* 需要时显示滚动条 */
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

.message-typing::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #999;
    border-radius: 50%;
    margin-right: 4px;
    position: absolute;
    left: -10px;
    top: 0;
    animation: typing 1.4s -0.32s infinite ease-in-out both;
}

.message-typing::after {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #999;
    border-radius: 50%;
    margin-left: 4px;
    position: absolute;
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
    background-color: #409EFF;
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

.el-textarea {
    flex: 1;
}

.send-button {
    margin-top: 10px;
    align-self: flex-end;
    float: right;
}
</style>