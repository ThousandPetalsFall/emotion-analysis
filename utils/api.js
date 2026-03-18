/**
 * API 配置
 */
const API_BASE_URL = 'http://localhost:8000/api'

/**
 * 通用请求封装
 */
export function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: API_BASE_URL + url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error(res.data?.detail || '请求失败'))
        }
      },
      fail: (error) => {
        reject(new Error(error.errMsg || '网络错误'))
      }
    })
  })
}

/**
 * 上传文件
 */
export function uploadFile(url, filePath, formData = {}) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: API_BASE_URL + url,
      filePath,
      name: 'file',
      formData,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.data))
        } else {
          reject(new Error('上传失败'))
        }
      },
      fail: (error) => {
        reject(new Error(error.errMsg || '网络错误'))
      }
    })
  })
}

/**
 * API 接口
 */
export const emotionAnalysisApi = {
  // 分析图片
  analyze(filePath) {
    return uploadFile('/emotion-analysis/analyze', filePath)
  },

  // 获取分析历史
  getHistory(page = 1, pageSize = 20) {
    return request('/emotion-analysis/history', {
      data: { page, page_size: pageSize }
    })
  },

  // 获取单次分析详情
  getDetail(analysisId) {
    return request(`/emotion-analysis/history/${analysisId}`)
  },

  // 删除分析记录
  deleteRecord(analysisId) {
    return request(`/emotion-analysis/history/${analysisId}`, {
      method: 'DELETE'
    })
  }
}

export default {
  request,
  uploadFile,
  emotionAnalysisApi
}
