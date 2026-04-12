<template>
  <view class="page">
    <view class="hero">
      <text class="kicker">Emotion Analysis</text>
      <text class="title">从日常记录走向深度理解</text>
      <text class="subtitle">先记录，再识别，再慢慢看见自己为什么会空、为什么会麻木、为什么会停住。</text>
    </view>

    <view v-if="step === 'welcome'" class="section">
      <view class="section-title">选择一个入口</view>
      <view
        v-for="topic in topics"
        :key="topic.id"
        class="topic-card"
        :class="{ active: selectedTopicId === topic.id }"
        @tap="selectTopic(topic.id)"
      >
        <view class="topic-head">
          <text class="topic-icon">{{ topic.icon }}</text>
          <view class="topic-meta">
            <text class="topic-title">{{ topic.title }}</text>
            <text class="topic-subtitle">{{ topic.subtitle }}</text>
          </view>
        </view>
        <text class="topic-intro">{{ topic.intro }}</text>
      </view>

      <button class="primary-btn" :disabled="!selectedTopic" @tap="startTopic">
        开始深度引导
      </button>
      <button class="ghost-btn secondary-action" @tap="openHistory">查看记录</button>
    </view>

    <view v-else-if="step === 'question'" class="section">
      <view class="topic-badge">{{ selectedTopic.category }}</view>
      <view class="progress">
        <view class="progress-bar" :style="{ width: progress + '%' }"></view>
      </view>
      <view class="counter">{{ currentIndex + 1 }} / {{ selectedTopic.questions.length }}</view>

      <view class="question-card">
        <text class="question-text">{{ currentQuestion.question }}</text>
      </view>

      <view v-if="currentQuestion.type === 'choice'" class="option-list">
        <view
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="option-item"
          :class="{ selected: selectedOptionIndex === index }"
          @tap="chooseOption(index)"
        >
          {{ option }}
        </view>
      </view>

      <view v-else class="input-box">
        <textarea
          v-model="inputValue"
          class="textarea"
          :placeholder="currentQuestion.placeholder || '写下你真实的想法'"
          maxlength="240"
        />
        <text class="count">{{ inputValue.length }}/240</text>
      </view>

      <view class="nav">
        <button class="ghost-btn" :disabled="currentIndex === 0" @tap="prevQuestion">上一题</button>
        <button class="primary-btn" :disabled="!canContinue" @tap="nextQuestion">
          {{ isLastQuestion ? '查看结果' : '下一题' }}
        </button>
      </view>
    </view>

    <view v-else class="section">
      <view class="topic-badge">确认一下</view>
      <view class="question-card">
        <text class="question-text">{{ selectedTopic.title }}</text>
      </view>

      <view class="summary-block">
        <view class="summary-title">你刚刚给出的线索</view>
        <view v-for="(item, index) in answerDigest" :key="index" class="summary-item">
          {{ item }}
        </view>
      </view>

      <view class="nav">
        <button class="ghost-btn" @tap="backToQuestions">返回修改</button>
        <button class="primary-btn" @tap="generateResult">生成分析</button>
      </view>
    </view>
  </view>
</template>

<script>
import { useTopicAnalysisStore } from '@/stores/topic-analysis'
import { buildTopicReport, formatAnswer, getTopicById, topicCatalog } from '@/data/topic-catalog'

export default {
  data() {
    return {
      step: 'welcome',
      topics: topicCatalog,
      selectedTopicId: '',
      currentIndex: 0,
      selectedOptionIndex: null,
      inputValue: '',
      answers: []
    }
  },

  onLoad() {
    this.analysisStore = useTopicAnalysisStore()
  },

  computed: {
    selectedTopic() {
      return getTopicById(this.selectedTopicId)
    },
    currentQuestion() {
      return this.selectedTopic?.questions?.[this.currentIndex] || {}
    },
    progress() {
      if (!this.selectedTopic || !this.selectedTopic.questions.length) {
        return 0
      }

      return ((this.currentIndex + 1) / this.selectedTopic.questions.length) * 100
    },
    isLastQuestion() {
      return this.selectedTopic ? this.currentIndex === this.selectedTopic.questions.length - 1 : false
    },
    canContinue() {
      if (!this.currentQuestion) {
        return false
      }

      if (this.currentQuestion.type === 'choice') {
        return this.selectedOptionIndex !== null
      }

      return !!this.inputValue.trim()
    },
    answerDigest() {
      if (!this.selectedTopic) {
        return []
      }

      return this.selectedTopic.questions.map((question, index) =>
        formatAnswer(question, this.answers[index])
      )
    }
  },

  methods: {
    selectTopic(topicId) {
      this.selectedTopicId = topicId
    },

    startTopic() {
      if (!this.selectedTopic) {
        return
      }

      this.step = 'question'
      this.currentIndex = 0
      this.answers = []
      this.selectedOptionIndex = null
      this.inputValue = ''
    },

    chooseOption(index) {
      this.selectedOptionIndex = index
    },

    prevQuestion() {
      if (this.currentIndex === 0) {
        return
      }

      this.currentIndex -= 1
      this.restoreCurrentAnswer()
    },

    nextQuestion() {
      const question = this.currentQuestion
      if (!question) {
        return
      }

      const answer =
        question.type === 'choice'
          ? question.options[this.selectedOptionIndex]
          : this.inputValue.trim()

      this.answers[this.currentIndex] = answer

      if (this.isLastQuestion) {
        this.step = 'summary'
        return
      }

      this.currentIndex += 1
      this.selectedOptionIndex = null
      this.inputValue = ''
      this.restoreCurrentAnswer()
    },

    restoreCurrentAnswer() {
      const answer = this.answers[this.currentIndex]
      const question = this.currentQuestion

      if (!question) {
        return
      }

      if (question.type === 'choice') {
        this.selectedOptionIndex = answer ? question.options.indexOf(answer) : null
        this.inputValue = ''
      } else {
        this.inputValue = answer || ''
        this.selectedOptionIndex = null
      }
    },

    backToQuestions() {
      this.step = 'question'
    },

    generateResult() {
      const result = buildTopicReport(this.selectedTopicId, this.answers)

      if (!result) {
        uni.showToast({
          title: '无法生成结果',
          icon: 'none'
        })
        return
      }

      this.analysisStore.publishResult(result)
      uni.navigateTo({
        url: '/pages/deep/result'
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
  padding: 40rpx 32rpx 48rpx;
  background:
    radial-gradient(circle at top left, rgba(255, 180, 122, 0.22), transparent 32%),
    radial-gradient(circle at top right, rgba(255, 109, 109, 0.18), transparent 28%),
    linear-gradient(180deg, #fffaf5 0%, #fff 100%);
}

.hero {
  margin-bottom: 36rpx;

  .kicker {
    display: block;
    font-size: 22rpx;
    color: #a07a5a;
    letter-spacing: 3rpx;
    margin-bottom: 14rpx;
  }

  .title {
    display: block;
    font-size: 48rpx;
    line-height: 1.25;
    font-weight: 700;
    color: #2d2420;
    margin-bottom: 16rpx;
  }

  .subtitle {
    display: block;
    font-size: 28rpx;
    line-height: 1.8;
    color: #6f5c52;
  }
}

.section {
  background: rgba(255, 255, 255, 0.86);
  border: 1rpx solid rgba(255, 165, 122, 0.18);
  border-radius: 28rpx;
  padding: 28rpx;
  box-shadow: 0 16rpx 40rpx rgba(162, 112, 78, 0.08);
  backdrop-filter: blur(10px);
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2d2420;
  margin-bottom: 22rpx;
}

.topic-card {
  border: 1rpx solid rgba(255, 165, 122, 0.16);
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  background: linear-gradient(135deg, rgba(255, 248, 242, 0.92), rgba(255, 255, 255, 0.98));

  &.active {
    border-color: rgba(255, 109, 109, 0.45);
    box-shadow: 0 10rpx 26rpx rgba(255, 109, 109, 0.12);
    transform: translateY(-2rpx);
  }
}

.topic-head {
  display: flex;
  gap: 18rpx;
  align-items: flex-start;
  margin-bottom: 12rpx;
}

.topic-icon {
  font-size: 42rpx;
}

.topic-meta {
  flex: 1;
}

.topic-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #2d2420;
  margin-bottom: 6rpx;
}

.topic-subtitle,
.topic-intro {
  display: block;
  font-size: 26rpx;
  line-height: 1.7;
  color: #73635a;
}

.topic-badge {
  display: inline-block;
  margin-bottom: 18rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: #a75c3a;
  background: rgba(255, 165, 122, 0.16);
}

.progress {
  height: 10rpx;
  background: rgba(255, 165, 122, 0.16);
  border-radius: 999rpx;
  overflow: hidden;
  margin-bottom: 14rpx;
}

.progress-bar {
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #ff8a65 0%, #ff6d6d 100%);
}

.counter {
  font-size: 24rpx;
  color: #a07a5a;
  margin-bottom: 18rpx;
}

.question-card {
  padding: 28rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #fff6ef 0%, #fff 100%);
  border: 1rpx solid rgba(255, 165, 122, 0.18);
  margin-bottom: 24rpx;
}

.question-text {
  font-size: 34rpx;
  line-height: 1.6;
  color: #332824;
  font-weight: 600;
}

.option-list {
  display: grid;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.option-item {
  padding: 24rpx;
  border-radius: 20rpx;
  background: #fff;
  border: 1rpx solid rgba(121, 90, 76, 0.12);
  color: #4c3b35;
  font-size: 28rpx;

  &.selected {
    border-color: rgba(255, 109, 109, 0.5);
    background: rgba(255, 109, 109, 0.08);
    color: #2d2420;
  }
}

.input-box {
  margin-bottom: 24rpx;

  .textarea {
    width: 100%;
    min-height: 280rpx;
    padding: 24rpx;
    border-radius: 20rpx;
    background: #fff;
    border: 1rpx solid rgba(121, 90, 76, 0.12);
    font-size: 28rpx;
    line-height: 1.8;
    color: #2d2420;
    box-sizing: border-box;
  }

  .count {
    display: block;
    margin-top: 10rpx;
    text-align: right;
    font-size: 22rpx;
    color: #a07a5a;
  }
}

.summary-block {
  margin-bottom: 24rpx;

  .summary-title {
    font-size: 28rpx;
    font-weight: 700;
    color: #2d2420;
    margin-bottom: 16rpx;
  }

  .summary-item {
    padding: 18rpx 20rpx;
    border-radius: 18rpx;
    background: rgba(255, 165, 122, 0.08);
    color: #4c3b35;
    font-size: 26rpx;
    line-height: 1.7;
    margin-bottom: 12rpx;
  }
}

.nav {
  display: flex;
  gap: 16rpx;
}

.primary-btn,
.ghost-btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 20rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.primary-btn {
  color: #fff;
  background: linear-gradient(135deg, #ff8a65 0%, #ff6d6d 100%);
  border: none;
}

.ghost-btn {
  color: #8a5d49;
  background: rgba(255, 255, 255, 0.8);
  border: 1rpx solid rgba(255, 165, 122, 0.28);
}

.secondary-action {
  margin-top: 16rpx;
}
</style>
