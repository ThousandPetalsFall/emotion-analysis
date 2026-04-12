import { defineStore } from 'pinia'

export const useTopicAnalysisStore = defineStore('topicAnalysis', {
  state: () => ({
    result: null,
    history: [],
    error: null
  }),

  getters: {
    hasResult: (state) => state.result !== null,
    analysisHistory: (state) => state.history
  },

  actions: {
    publishResult(result) {
      this.result = result
      this.addToHistory(result)
      this.saveLatestResult()
    },

    addToHistory(result) {
      const record = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...result
      }

      this.history.unshift(record)

      if (this.history.length > 50) {
        this.history = this.history.slice(0, 50)
      }

      this.saveHistory()
    },

    saveLatestResult() {
      try {
        if (this.result) {
          uni.setStorageSync('topic_analysis_latest_result', JSON.stringify(this.result))
        }
      } catch (error) {
        console.error('保存最新结果失败:', error)
      }
    },

    loadLatestResult() {
      try {
        const latest = uni.getStorageSync('topic_analysis_latest_result')
        if (latest) {
          this.result = JSON.parse(latest)
        }
      } catch (error) {
        console.error('加载最新结果失败:', error)
      }
    },

    saveHistory() {
      try {
        uni.setStorageSync('topic_analysis_history', JSON.stringify(this.history))
      } catch (error) {
        console.error('保存历史失败:', error)
      }
    },

    loadHistory() {
      try {
        const history = uni.getStorageSync('topic_analysis_history')
        if (history) {
          this.history = JSON.parse(history)
        }
      } catch (error) {
        console.error('加载历史失败:', error)
      }
    },

    clearHistory() {
      this.history = []
      uni.removeStorageSync('topic_analysis_history')
    },

    clearResult() {
      this.result = null
      uni.removeStorageSync('topic_analysis_latest_result')
    }
  }
})
