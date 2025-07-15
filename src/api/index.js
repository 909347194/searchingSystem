//封装Axios提供统一请求处理：基础URL设置、请求/响应拦截器、错误处理、Token自动添加等。
import axios from 'axios'

//创建实例
const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器-添加token认证
//作用：在每个请求发送前，自动从 localStorage 中读取 token（用户登录后的认证凭证），并添加到请求头的 Authorization 字段中，
// 格式为 Bearer <token>（后端通常以此格式验证身份）。
Axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如token
    // config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error), //处理请求错误
)

//响应拦截器：处理 Token 过期与自动刷新
// 响应拦截器的核心是当后端返回 401 错误（token 过期或无效）时，自动刷新 token 并重新发送失败的请求，避免用户被迫重新登录。

// 标记是否正在刷新 token（防止重复请求刷新接口）
let isRefreshing = false
// 存储等待 token 刷新后需要重新发送的请求
let refreshSubscribers = []

// token 刷新成功后，调用所有等待的请求并传入新 token
function onTokenRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = [] // 清空队列
}

// 将等待 token 刷新的请求回调加入队列
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback)
}
Axios.interceptors.response.use(
  (res) => res, // 成功响应直接返回结果
  async (error) => {
    const originalRequest = error.config // 失败的原始请求配置
    const status = error.response?.status // 错误状态码

    // 仅处理 401 错误（未授权，通常为 token 过期），且未重复重试过
    if (status === 401 && !originalRequest._retry) {
      // 情况1：如果没有在刷新 token，则发起刷新请求
      if (!isRefreshing) {
        isRefreshing = true // 标记为正在刷新
        try {
          // 从 localStorage 读取 refresh_token（用于获取新 token 的凭证）
          const refreshToken = localStorage.getItem('refresh_token')
          // 调用后端刷新 token 的接口（注意：此处用原生 axios 而非 instance，避免触发拦截器死循环）
          const response = await axios.post('/api/auth/refresh', { refresh_token: refreshToken })
          const newToken = response.data.token // 从响应中获取新 token

          // 保存新 token 到 localStorage
          localStorage.setItem('token', newToken)
          isRefreshing = false // 刷新完成，重置标记
          onTokenRefreshed(newToken) // 通知所有等待的请求使用新 token 重新发送
        } catch (err) {
          // 刷新 token 失败（如 refresh_token 过期），清除本地存储的 token 并跳转登录页
          isRefreshing = false
          localStorage.removeItem('token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login' // 强制用户重新登录
          return Promise.reject(err)
        }
      }

      // 情况2：如果正在刷新 token，则将当前请求加入等待队列
      return new Promise((resolve) => {
        // 定义 token 刷新成功后的回调：用新 token 重新发送原始请求
        subscribeTokenRefresh((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}` // 更新请求头的 token
          originalRequest._retry = true // 标记为已重试（避免重复进入刷新流程）
          resolve(axios(originalRequest)) // 重新发送请求并返回结果
        })
      })
    }

    // 非 401 错误（如 404、500 等），直接返回错误
    return Promise.reject(error)
  },
)

export default Axios
/* 当某个请求因 token 过期返回 401 错误时：

1检查是否正在刷新 token：
  若 isRefreshing 为 false（未在刷新），则调用后端刷新接口，用 refresh_token 获取新 token。
  若 isRefreshing 为 true（正在刷新），则当前请求进入等待队列（refreshSubscribers），避免重复请求刷新接口。
2刷新 token 成功后：
  用新 token 更新 localStorage。
  调用 onTokenRefreshed 通知所有等待的请求，用新 token 重新发送原始请求（避免用户感知到 token 过期）。
3刷新 token 失败后：
  清除本地存储的 token 和 refresh_token，强制跳转至登录页，要求用户重新登录。
4. 导出实例
  export default instance

导出配置好的 Axios 实例，供前端其他模块导入使用（如 API 调用函数），确保所有请求都使用统一的拦截器和配置。
总结
这段代码通过 Axios 拦截器实现了：

统一的请求基础配置（URL、超时时间）。
自动附加认证 token，简化身份验证流程。
token 过期时自动刷新并重新发送请求，提升用户体验（避免频繁登录）。
防止重复刷新 token、处理刷新失败的边界情况（跳转登录）。

适用于需要身份验证的前后端分离项目，是前端请求层的常见最佳实践。 */
