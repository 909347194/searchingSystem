import request from "./index"
// 登录
export function login(data) {
  return request.post('/auth/login', data)
}

// 退出登录（如果有后端接口支持）
export function logout() {
  return request.post('/auth/logout')
}

// 获取当前登录用户信息
export function getUserInfo() {
  return request.get('/auth/userinfo')
}