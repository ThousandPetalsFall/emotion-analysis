<template>
  <view class="container">
    <view v-if="history.length > 0" class="history-list">
      <view
        v-for="(item, index) in history"
        :key="item.id"
        class="history-item"
        @tap="handleViewDetail(item)"
      >
        <view class="item-left">
          <text class="emotion-icon">{{ item.emotion_icon || '🌿' }}</text>
          <view class="item-info">
            <text class="emotion-name">{{ item.topicTitle || item.emotion }}</text>
            <text class="timestamp">{{ formatTime(item.timestamp) }}</text>
            <text v-if="item.smallAction" class="preview">{{ item.smallAction }}</text>
          </view>
        </view>
        <view class="item-right">
          <text class="delete-btn" @tap.stop="handleDelete(item, index)">删除</text>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">📒</text>
      <text class="empty-text">暂无分析记录</text>
      <text class="empty-hint">先去首页选一个专题，留下一次记录。</text>
    </view>

    <view v-if="history.length > 0" class="clear-btn-wrapper">
      <button class="btn-clear" @tap="handleClearAll">清空所有记录</button>
    </view>

    <view class="home-link" @tap="goHome">返回首页</view>
  </view>
</template>

<script>
import { useTopicAnalysisStore } from '@/stores/topic-analysis'

export default {
  data() {
    return {
      history: []
    }
  },

  onLoad() {
    this.analysisStore = useTopicAnalysisStore()
    this.loadHistory()
  },

  onPullDownRefresh() {
    this.loadHistory()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 300)
  },

  methods: {
    loadHistory() {
      this.analysisStore.loadHistory()
      this.history = this.analysisStore.history
    },

    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      if (diff < 24 * 60 * 60 * 1000) {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `今天 ${hours}:${minutes}`
      }

      if (diff < 48 * 60 * 60 * 1000) {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `昨天 ${hours}:${minutes}`
      }

      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${month}-${day}`
    },

    handleViewDetail(item) {
      this.analysisStore.result = item
      this.analysisStore.saveLatestResult()
      uni.navigateTo({
        url: '/pages/deep/result'
      })
    },

    handleDelete(item, index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条分析记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.history.splice(index, 1)
            this.analysisStore.history = this.history
            this.analysisStore.saveHistory()

            uni.showToast({
              title: '已删除',
              icon: 'success'
            })
          }
        }
      })
    },

    handleClearAll() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有分析记录吗？此操作不可恢复。',
        confirmColor: '#ff4d4f',
        success: (res) => {
          if (res.confirm) {
            this.analysisStore.clearHistory()
            this.history = []

            uni.showToast({
              title: '已清空',
              icon: 'success'
            })
          }
        }
      })
    },

    goHome() {
      uni.navigateTo({
        url: '/pages/deep/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 180, 122, 0.14), transparent 28%),
    linear-gradient(180deg, #fffaf5 0%, #fff 100%);
  padding: 40rpx 32rpx 48rpx;
}

.history-list {
  margin-bottom: 40rpx;

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 18rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.05);
    border: 1rpx solid rgba(255, 165, 122, 0.12);

    &:active {
      background: #fff9f4;
    }

    .item-left {
      display: flex;
      align-items: center;
      flex: 1;

      .emotion-icon {
        font-size: 72rpx;
        margin-right: 24rpx;
      }

      .item-info {
        display: flex;
        flex-direction: column;

        .emotion-name {
          font-size: 32rpx;
          font-weight: 700;
          color: #2d2420;
          margin-bottom: 8rpx;
        }

        .timestamp {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 6rpx;
        }

        .preview {
          font-size: 24rpx;
          color: #8a5d49;
          line-height: 1.6;
        }
      }
    }

    .item-right {
      .delete-btn {
        font-size: 28rpx;
        color: #ff4d4f;
        padding: 12rpx 24rpx;
        background: #fff1f0;
        border-radius: 8rpx;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 32rpx;
  }

  .empty-text {
    font-size: 36rpx;
    color: #2d2420;
    margin-bottom: 16rpx;
  }

  .empty-hint {
    font-size: 28rpx;
    color: #999;
  }
}

.clear-btn-wrapper {
  padding: 24rpx 0;

  .btn-clear {
    width: 100%;
    height: 88rpx;
    background: white;
    color: #ff4d4f;
    border: 2rpx solid #ff4d4f;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.home-link {
  text-align: center;
  color: #8a5d49;
  font-size: 26rpx;
  padding-top: 12rpx;
}
</style>
