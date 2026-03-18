import { defineStore } from 'pinia'

export const useAnalysisStore = defineStore('analysis', {
  state: () => ({
    analyzing: false,
    result: null,
    history: [],
    error: null
  }),

  getters: {
    hasResult: (state) => state.result !== null,
    analysisHistory: (state) => state.history
  },

  actions: {
    async analyzeImage(imagePath) {
      this.analyzing = true
      this.error = null

      try {
        // 上传文件
        const uploadResult = await uni.uploadFile({
          url: 'http://localhost:8000/api/emotion-analysis/analyze',
          filePath: imagePath,
          name: 'file',
          formData: {}
        })

        if (uploadResult.statusCode === 200) {
          const data = JSON.parse(uploadResult.data)
          this.result = data

          // 添加到历史记录
          this.addToHistory(data)

          // 跳转到结果页
          uni.navigateTo({
            url: '/pages/result/result'
          })
        } else {
          throw new Error('分析失败')
        }
      } catch (error) {
        this.error = error.message
        uni.showToast({
          title: '分析失败，请重试',
          icon: 'none'
        })
      } finally {
        this.analyzing = false
      }
    },

    addToHistory(result) {
      const record = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...result
      }
      this.history.unshift(record)

      // 只保留最近 50 条记录
      if (this.history.length > 50) {
        this.history = this.history.slice(0, 50)
      }

      // 保存到本地存储
      this.saveHistory()
    },

    saveHistory() {
      try {
        uni.setStorageSync('analysis_history', JSON.stringify(this.history))
      } catch (error) {
        console.error('保存历史记录失败:', error)
      }
    },

    loadHistory() {
      try {
        const history = uni.getStorageSync('analysis_history')
        if (history) {
          this.history = JSON.parse(history)
        }
      } catch (error) {
        console.error('加载历史记录失败:', error)
      }
    },

    clearHistory() {
      this.history = []
      uni.removeStorageSync('analysis_history')
    },

    clearResult() {
      this.result = null
    }
  }
})
