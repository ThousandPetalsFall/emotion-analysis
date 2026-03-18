<template>
  <view class="container">
    <!-- 结果卡片 -->
    <view class="result-card">
      <view class="emotion-header">
        <text class="emotion-icon">{{ result.emotion_icon || '😊' }}</text>
        <text class="emotion-name">{{ result.emotion || '未知情绪' }}</text>
      </view>

      <!-- 情绪分布 -->
      <view class="emotion-distribution">
        <view class="distribution-title">情绪分布</view>
        <view
          v-for="(item, index) in emotionList"
          :key="index"
          class="distribution-item"
        >
          <text class="emotion-label">{{ item.label }}</text>
          <view class="progress-bar">
            <view
              class="progress-fill"
              :style="{ width: (item.confidence * 100) + '%' }"
              :style="{ backgroundColor: item.color }"
            ></view>
          </view>
          <text class="progress-value">{{ (item.confidence * 100).toFixed(1) }}%</text>
        </view>
      </view>

      <!-- AI 分析结果 -->
      <view class="ai-analysis">
        <view class="analysis-title">
          <text class="ai-icon">🤖</text>
          <text>AI 分析</text>
        </view>
        <text class="analysis-content">{{ result.analysis || '暂无分析结果' }}</text>
      </view>

      <!-- 建议 -->
      <view class="suggestions" v-if="result.suggestions && result.suggestions.length > 0">
        <view class="suggestions-title">💡 小建议</view>
        <view
          v-for="(suggestion, index) in result.suggestions"
          :key="index"
          class="suggestion-item"
        >
          <text class="suggestion-index">{{ index + 1 }}</text>
          <text class="suggestion-text">{{ suggestion }}</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="btn-secondary" @tap="handleAgain">再测一次</button>
      <button class="btn-primary" @tap="handleSave">保存记录</button>
    </view>
  </view>
</template>

<script>
import { useAnalysisStore } from '@/stores/analysis'

export default {
  data() {
    return {
      result: {
        emotion: '',
        emotion_icon: '',
        analysis: '',
        suggestions: [],
        emotions: {}
      },
      emotionList: []
    }
  },

  onLoad() {
    this.analysisStore = useAnalysisStore()
    this.loadResult()
  },

  methods: {
    loadResult() {
      const result = this.analysisStore.result
      if (!result) {
        uni.showToast({
          title: '没有分析结果',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }

      this.result = result

      // 处理情绪分布数据
      const emotionColors = {
        happy: '#52c41a',
        sad: '#1890ff',
        angry: '#ff4d4f',
        anxious: '#faad14',
        calm: '#13c2c2',
        neutral: '#8c8c8c'
      }

      const emotionLabels = {
        happy: '开心',
        sad: '悲伤',
        angry: '愤怒',
        anxious: '焦虑',
        calm: '平静',
        neutral: '中性'
      }

      this.emotionList = Object.entries(result.emotions || {})
        .map(([key, value]) => ({
          key,
          label: emotionLabels[key] || key,
          confidence: value,
          color: emotionColors[key] || '#ccc'
        }))
        .sort((a, b) => b.confidence - a.confidence)
    },

    handleAgain() {
      this.analysisStore.clearResult()
      uni.navigateBack()
    },

    handleSave() {
      uni.showToast({
        title: '已自动保存',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: #f5f5f5;
}

.result-card {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

  .emotion-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 48rpx;

    .emotion-icon {
      font-size: 120rpx;
      margin-bottom: 16rpx;
    }

    .emotion-name {
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .emotion-distribution {
    margin-bottom: 40rpx;

    .distribution-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 24rpx;
    }

    .distribution-item {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .emotion-label {
        width: 100rpx;
        font-size: 28rpx;
        color: #666;
      }

      .progress-bar {
        flex: 1;
        height: 16rpx;
        background: #f0f0f0;
        border-radius: 8rpx;
        margin: 0 16rpx;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          border-radius: 8rpx;
          transition: width 0.3s ease;
        }
      }

      .progress-value {
        width: 100rpx;
        font-size: 24rpx;
        color: #999;
        text-align: right;
      }
    }
  }

  .ai-analysis {
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;

    .analysis-title {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .ai-icon {
        font-size: 32rpx;
        margin-right: 12rpx;
      }

      text {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
      }
    }

    .analysis-content {
      font-size: 28rpx;
      line-height: 1.8;
      color: #666;
    }
  }

  .suggestions {
    .suggestions-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 16rpx;
    }

    .suggestion-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16rpx;

      .suggestion-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40rpx;
        height: 40rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 24rpx;
        border-radius: 50%;
        margin-right: 12rpx;
        flex-shrink: 0;
      }

      .suggestion-text {
        flex: 1;
        font-size: 28rpx;
        line-height: 1.6;
        color: #666;
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 24rpx;

  button {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: 600;
    border: none;

    &:active {
      opacity: 0.8;
    }
  }

  .btn-secondary {
    background: white;
    color: #667eea;
    border: 2rpx solid #667eea;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
  }
}
</style>
