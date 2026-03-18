<template>
  <view class="container">
    <!-- 顶部欢迎区域 -->
    <view class="header">
      <text class="title">今天心情如何？</text>
      <text class="subtitle">拍张照片，让 AI 读懂你的情绪</text>
    </view>

    <!-- 图片预览区域 -->
    <view class="preview-area" @tap="chooseImage">
      <image
        v-if="imagePath"
        :src="imagePath"
        mode="aspectFill"
        class="preview-image"
      />
      <view v-else class="upload-placeholder">
        <view class="iconfont">📷</view>
        <text class="upload-text">点击拍照或选择图片</text>
      </view>
    </view>

    <!-- 分析按钮 -->
    <view class="btn-wrapper">
      <button
        class="btn-analyze"
        :disabled="!imagePath || analyzing"
        @tap="handleAnalyze"
      >
        {{ analyzing ? '分析中...' : '开始分析' }}
      </button>
    </view>

    <!-- 功能说明 -->
    <view class="features">
      <view class="feature-item">
        <text class="feature-icon">🎯</text>
        <text class="feature-text">精准识别</text>
      </view>
      <view class="feature-item">
        <text class="feature-icon">⚡</text>
        <text class="feature-text">快速分析</text>
      </view>
      <view class="feature-item">
        <text class="feature-icon">🔒</text>
        <text class="feature-text">隐私保护</text>
      </view>
    </view>
  </view>
</template>

<script>
import { useAnalysisStore } from '@/stores/analysis'

export default {
  data() {
    return {
      imagePath: '',
      analyzing: false
    }
  },

  onLoad() {
    this.analysisStore = useAnalysisStore()
  },

  methods: {
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.imagePath = res.tempFilePaths[0]
        },
        fail: (error) => {
          console.error('选择图片失败:', error)
        }
      })
    },

    // 开始分析
    async handleAnalyze() {
      if (!this.imagePath) {
        uni.showToast({
          title: '请先选择图片',
          icon: 'none'
        })
        return
      }

      this.analyzing = true

      try {
        await this.analysisStore.analyzeImage(this.imagePath)
      } catch (error) {
        console.error('分析失败:', error)
        uni.showToast({
          title: '分析失败，请重试',
          icon: 'none'
        })
      } finally {
        this.analyzing = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #f5f5f5 100%);
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
  padding-top: 40rpx;

  .title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }

  .subtitle {
    display: block;
    font-size: 28rpx;
    color: #666;
  }
}

.preview-area {
  width: 100%;
  height: 600rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background: white;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
  margin-bottom: 40rpx;

  .preview-image {
    width: 100%;
    height: 100%;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    .iconfont {
      font-size: 100rpx;
      margin-bottom: 24rpx;
    }

    .upload-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}

.btn-wrapper {
  margin-bottom: 40rpx;

  .btn-analyze {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 48rpx;
    font-size: 36rpx;
    font-weight: 600;
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);

    &:active {
      opacity: 0.8;
      transform: scale(0.98);
    }

    &[disabled] {
      background: #ccc;
      box-shadow: none;
    }
  }
}

.features {
  display: flex;
  justify-content: space-around;
  padding: 32rpx;
  background: white;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .feature-icon {
      font-size: 48rpx;
      margin-bottom: 12rpx;
    }

    .feature-text {
      font-size: 24rpx;
      color: #666;
    }
  }
}
</style>
