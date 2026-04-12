<template>
  <view class="page">
    <view class="card" v-if="result">
      <view class="header">
        <text class="icon">{{ result.emotion_icon || '🌿' }}</text>
        <text class="title">{{ result.topicTitle || result.emotion || '未命名分析' }}</text>
        <text class="subtitle">{{ result.topicSubtitle || '一份更接近真实生活感的深度引导' }}</text>
      </view>

      <view class="section">
        <view class="section-title">你刚刚给出的线索</view>
        <view v-for="(item, index) in result.answerDigest || []" :key="index" class="digest-item">
          {{ item }}
        </view>
      </view>

      <view class="section">
        <view class="section-title">我看到的状态</view>
        <view v-for="(line, index) in result.overview || []" :key="index" class="text-block">
          {{ line }}
        </view>
      </view>

      <view class="section">
        <view class="section-title">背后可能发生了什么</view>
        <view class="text-block emphasis">{{ result.analysis || result.mechanism }}</view>
      </view>

      <view class="section">
        <view class="section-title">给你的一个问题</view>
        <view class="question-block">{{ result.guidingQuestion }}</view>
      </view>

      <view class="section highlight">
        <view class="section-title">接下来 24 小时</view>
        <view class="action-block">{{ result.smallAction }}</view>
      </view>

      <view class="section">
        <view class="section-title">回到日常</view>
        <view class="text-block">{{ result.diaryPrompt }}</view>
      </view>

      <view class="section">
        <view class="section-title">你可以继续记住的三件事</view>
        <view class="chip-list">
          <view v-for="(item, index) in result.suggestions || []" :key="index" class="chip">
            {{ item }}
          </view>
        </view>
      </view>
    </view>

    <view class="actions">
      <button class="secondary" @tap="handleAgain">再分析一次</button>
      <button class="primary" @tap="openHistory">查看记录</button>
    </view>
  </view>
</template>

<script>
import { useTopicAnalysisStore } from '@/stores/topic-analysis'

export default {
  data() {
    return {
      result: null
    }
  },

  onLoad() {
    this.analysisStore = useTopicAnalysisStore()
    this.loadResult()
  },

  methods: {
    loadResult() {
      if (!this.analysisStore.result) {
        this.analysisStore.loadLatestResult()
      }

      const result = this.analysisStore.result

      if (!result) {
        uni.showToast({
          title: '没有找到分析结果',
          icon: 'none'
        })
        setTimeout(() => uni.navigateBack(), 1200)
        return
      }

      this.result = result
    },

    handleAgain() {
      this.analysisStore.clearResult()
      uni.navigateBack()
    },

    handleSave() {
      uni.showToast({
        title: '已保存到历史',
        icon: 'success'
      })
    },

    openHistory() {
      uni.navigateTo({
        url: '/pages/deep/history'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 32rpx 28rpx 48rpx;
  background:
    radial-gradient(circle at top left, rgba(255, 180, 122, 0.22), transparent 28%),
    radial-gradient(circle at top right, rgba(255, 109, 109, 0.18), transparent 22%),
    linear-gradient(180deg, #fffaf5 0%, #fff 100%);
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 30rpx;
  padding: 30rpx;
  border: 1rpx solid rgba(255, 165, 122, 0.18);
  box-shadow: 0 18rpx 44rpx rgba(162, 112, 78, 0.1);
}

.header {
  text-align: center;
  padding: 10rpx 10rpx 28rpx;

  .icon {
    display: block;
    font-size: 96rpx;
    margin-bottom: 16rpx;
  }

  .title {
    display: block;
    font-size: 38rpx;
    line-height: 1.4;
    font-weight: 700;
    color: #2d2420;
    margin-bottom: 10rpx;
  }

  .subtitle {
    display: block;
    font-size: 26rpx;
    color: #7a655a;
    line-height: 1.7;
  }
}

.section {
  padding: 22rpx 0;
  border-top: 1rpx solid rgba(121, 90, 76, 0.08);
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #2d2420;
  margin-bottom: 16rpx;
}

.digest-item,
.text-block,
.question-block,
.action-block {
  font-size: 28rpx;
  line-height: 1.8;
  color: #4c3b35;
  margin-bottom: 12rpx;
}

.emphasis {
  color: #2d2420;
}

.question-block,
.action-block {
  padding: 22rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #fff6ef 0%, #fff 100%);
  border: 1rpx solid rgba(255, 165, 122, 0.18);
}

.highlight .action-block {
  background: linear-gradient(135deg, rgba(255, 138, 101, 0.14), rgba(255, 109, 109, 0.08));
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.chip {
  padding: 14rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 165, 122, 0.12);
  color: #8a5d49;
  font-size: 24rpx;
}

.actions {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.primary,
.secondary {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 20rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.primary {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #ff8a65 0%, #ff6d6d 100%);
}

.secondary {
  color: #8a5d49;
  background: rgba(255, 255, 255, 0.9);
  border: 1rpx solid rgba(255, 165, 122, 0.28);
}
</style>
