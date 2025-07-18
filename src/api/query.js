export function getAnswer(params) {
    return request.get('/api/ai/query', { params })
}

