<template>
  <view class="container">
    <!-- 欢迎页面 -->
    <view v-if="currentStep === 'welcome'" class="welcome-page">
      <view class="title">情绪探索之旅</view>
      <view class="subtitle">有时候，心情不好是有原因的</view>
      <view class="description">
        通过一系列问题，帮你梳理情绪背后的真实原因
        不是诊断，而是一次和自己的对话
      </view>
      <view class="stats">
        <view class="stat-item">
          <text class="stat-num">7</text>
          <text class="stat-label">初始筛查</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">6</text>
          <text class="stat-label">深度分支</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">18</text>
          <text class="stat-label">灵魂拷问</text>
        </view>
      </view>
      <button class="start-btn" @click="startJourney">开始探索</button>
      <view class="note">预计耗时 3-5 分钟 · 隐私保护 · 本地存储</view>
    </view>

    <!-- 筛查问题页面 -->
    <view v-else-if="currentStep === 'screening'" class="question-page">
      <view class="progress-bar">
        <view class="progress" :style="{ width: screeningProgress + '%' }"></view>
      </view>
      <view class="step-indicator">筛查 {{ currentScreeningIndex + 1 }} / {{ screeningQuestions.length }}</view>

      <view class="question-card">
        <text class="question-text">{{ currentScreeningQuestion.question }}</text>
      </view>

      <view class="options-container">
        <view
          v-for="(option, index) in currentScreeningQuestion.options"
          :key="index"
          class="option-btn"
          :class="{ selected: selectedOption === index }"
          @click="selectScreeningOption(index)"
        >
          {{ option }}
        </view>
      </view>

      <view class="nav-buttons">
        <button class="nav-btn prev" @click="prevScreeningQuestion" :disabled="currentScreeningIndex === 0">上一题</button>
        <button class="nav-btn next" @click="nextScreeningQuestion" :disabled="selectedOption === null">继续</button>
      </view>
    </view>

    <!-- 分支问题页面 -->
    <view v-else-if="currentStep === 'branch'" class="question-page">
      <view class="branch-tag">{{ currentBranchName }}</view>
      <view class="progress-bar">
        <view class="progress" :style="{ width: branchProgress + '%' }"></view>
      </view>
      <view class="step-indicator">深度探索 {{ currentBranchIndex + 1 }} / {{ currentBranchQuestions.length }}</view>

      <view class="question-card">
        <text class="question-text">{{ currentBranchQuestion.question }}</text>
      </view>

      <view class="options-container">
        <view
          v-for="(option, index) in currentBranchQuestion.options"
          :key="index"
          class="option-btn"
          :class="{ selected: selectedOption === index }"
          @click="selectBranchOption(index)"
        >
          {{ option }}
        </view>
      </view>

      <view class="nav-buttons">
        <button class="nav-btn prev" @click="prevBranchQuestion" :disabled="currentBranchIndex === 0">上一题</button>
        <button class="nav-btn next" @click="nextBranchQuestion" :disabled="selectedOption === null">继续</button>
      </view>
    </view>

    <!-- 输入框页面 -->
    <view v-else-if="currentStep === 'input'" class="input-page">
      <view class="question-card">
        <text class="question-text">{{ currentInputQuestion }}</text>
      </view>

      <textarea
        class="input-area"
        v-model="inputValue"
        placeholder="在这里写下你的想法..."
        maxlength="200"
        confirm-type="done"
      />
      <text class="char-count">{{ inputValue.length }}/200</text>

      <view class="nav-buttons">
        <button class="nav-btn" @click="skipInput">跳过</button>
        <button class="nav-btn next" @click="submitInput" :disabled="!inputValue.trim()">继续</button>
      </view>
    </view>

    <!-- 灵魂拷问页面 -->
    <view v-else-if="currentStep === 'ultimate'" class="ultimate-page">
      <view class="ultimate-tag">灵魂拷问</view>
      <view class="progress-bar">
        <view class="progress" :style="{ width: ultimateProgress + '%' }"></view>
      </view>
      <view class="step-indicator">{{ currentUltimateIndex + 1 }} / {{ currentUltimateQuestions.length }}</view>

      <view class="question-card ultimate">
        <text class="question-text">{{ currentUltimateQuestion.question }}</text>
      </view>

      <!-- 选择题 -->
      <view v-if="currentUltimateQuestion.options" class="options-container">
        <view
          v-for="(option, index) in currentUltimateQuestion.options"
          :key="index"
          class="option-btn ultimate"
          :class="{ selected: selectedOption === index }"
          @click="selectUltimateOption(index)"
        >
          {{ option }}
        </view>
      </view>

      <!-- 输入题 -->
      <view v-else class="input-container">
        <textarea
          class="input-area"
          v-model="inputValue"
          placeholder="在这里写下你的真实想法..."
          maxlength="200"
        />
        <text class="char-count">{{ inputValue.length }}/200</text>
      </view>

      <view class="nav-buttons">
        <button class="nav-btn prev" @click="prevUltimateQuestion" :disabled="currentUltimateIndex === 0">上一题</button>
        <button class="nav-btn next" @click="nextUltimateQuestion" :disabled="!canContinueUltimate">继续</button>
      </view>
    </view>

    <!-- 补充问题页面 -->
    <view v-else-if="currentStep === 'supplementary'" class="supplementary-page">
      <view class="step-indicator">最后几步 · {{ currentSupplementaryIndex + 1 }} / {{ supplementaryQuestions.length }}</view>

      <view class="question-card">
        <text class="question-text">{{ currentSupplementaryQuestion.question }}</text>
      </view>

      <view class="options-container">
        <view
          v-for="(option, index) in currentSupplementaryQuestion.options"
          :key="index"
          class="option-btn"
          :class="{ selected: supplementaryAnswers[currentSupplementaryIndex]?.includes(index) }"
          @click="selectSupplementaryOption(index)"
        >
          {{ option }}
        </view>
      </view>

      <view class="nav-buttons">
        <button class="nav-btn prev" @click="prevSupplementaryQuestion" :disabled="currentSupplementaryIndex === 0">上一题</button>
        <button class="nav-btn next" @click="nextSupplementaryQuestion" :disabled="!canContinueSupplementary">
          {{ currentSupplementaryIndex === supplementaryQuestions.length - 1 ? '查看报告' : '继续' }}
        </button>
      </view>
    </view>

    <!-- 报告页面 -->
    <view v-else-if="currentStep === 'report'" class="report-page">
      <view class="report-card" id="reportCard">
        <view class="report-header">
          <text class="report-title">{{ report.title }}</text>
          <text class="report-time">{{ report.timestamp }}</text>
        </view>

        <view class="report-content">
          <view class="summary-section">
            <text class="section-title">答案摘要</text>
            <view v-for="(summary, index) in report.summaries" :key="index" class="summary-item">
              <text class="summary-text">{{ summary }}</text>
            </view>
          </view>

          <view class="question-section">
            <text class="section-title">给你的一个问题</text>
            <text class="question-text-large">{{ report.guidingQuestion }}</text>
          </view>

          <view class="tags-section" v-if="report.recordTypes.length > 0">
            <text class="tag" v-for="(type, index) in report.recordTypes" :key="index">{{ type }}</text>
          </view>
        </view>

        <view class="report-footer">
          <text class="footer-text">{{ report.footer }}</text>
        </view>
      </view>

      <view class="action-buttons">
        <button class="action-btn save" @click="saveReport">保存报告</button>
        <button class="action-btn share" @click="shareReport">生成海报</button>
        <button class="action-btn restart" @click="restart">重新开始</button>
      </view>
    </view>
  </view>
</template>

<script>
import { useAnalysisStore } from '@/stores/analysis';
import questionTree from '@/data/question-tree.json';
import { generateReport } from '@/data/report-templates';

export default {
  data() {
    return {
      currentStep: 'welcome',
      currentScreeningIndex: 0,
      currentBranchIndex: 0,
      currentUltimateIndex: 0,
      currentSupplementaryIndex: 0,
      selectedOption: null,
      inputValue: '',
      answers: [],
      recordTypes: [],
      currentBranchId: null,
      report: {},
      supplementaryAnswers: [],
      screeningQuestions: questionTree.screening,
      supplementaryQuestions: questionTree.supplementary
    };
  },

  onLoad() {
    this.analysisStore = useAnalysisStore();
  },

  computed: {
    currentScreeningQuestion() {
      return this.screeningQuestions[this.currentScreeningIndex];
    },
    screeningProgress() {
      return ((this.currentScreeningIndex + 1) / this.screeningQuestions.length) * 100;
    },
    currentBranch() {
      return this.currentBranchId ? questionTree.branches[this.currentBranchId] : null;
    },
    currentBranchName() {
      return this.currentBranch?.name || '';
    },
    currentBranchQuestions() {
      return this.currentBranch?.questions || [];
    },
    currentBranchQuestion() {
      return this.currentBranchQuestions[this.currentBranchIndex];
    },
    branchProgress() {
      return ((this.currentBranchIndex + 1) / this.currentBranchQuestions.length) * 100;
    },
    currentUltimateQuestions() {
      return this.currentBranch?.ultimate || [];
    },
    currentUltimateQuestion() {
      return this.currentUltimateQuestions[this.currentUltimateIndex];
    },
    ultimateProgress() {
      return ((this.currentUltimateIndex + 1) / this.currentUltimateQuestions.length) * 100;
    },
    currentSupplementaryQuestion() {
      return this.supplementaryQuestions[this.currentSupplementaryIndex];
    },
    canContinueUltimate() {
      if (this.currentUltimateQuestion?.options) {
        return this.selectedOption !== null;
      }
      return this.inputValue.trim().length > 0;
    },
    canContinueSupplementary() {
      return this.supplementaryAnswers[this.currentSupplementaryIndex] !== undefined;
    }
  },

  methods: {
    startJourney() {
      this.currentStep = 'screening';
    },

    selectScreeningOption(index) {
      this.selectedOption = index;
    },

    nextScreeningQuestion() {
      const question = this.currentScreeningQuestion;
      const answer = question.options[this.selectedOption];

      this.answers.push({
        questionId: question.id,
        question: question.question,
        answer: answer,
        optionIndex: this.selectedOption
      });

      const nextBranch = question.nextBranch[String(this.selectedOption + 1)];

      if (nextBranch === 'end') {
        this.currentStep = 'supplementary';
      } else if (questionTree.branches[nextBranch]) {
        this.currentBranchId = nextBranch;
        this.currentStep = 'branch';
        this.currentBranchIndex = 0;
      } else {
        this.currentScreeningIndex++;
        if (this.currentScreeningIndex >= this.screeningQuestions.length) {
          this.currentStep = 'supplementary';
        }
      }

      this.selectedOption = null;
    },

    prevScreeningQuestion() {
      if (this.currentScreeningIndex > 0) {
        this.currentScreeningIndex--;
        const prevAnswer = this.answers.pop();
        this.selectedOption = prevAnswer?.optionIndex || null;
      }
    },

    selectBranchOption(index) {
      this.selectedOption = index;
    },

    nextBranchQuestion() {
      const question = this.currentBranchQuestion;
      const answer = question.options[this.selectedOption];

      if (question.recordType) {
        this.recordTypes.push(question.recordType);
      }

      this.answers.push({
        questionId: question.id,
        question: question.question,
        answer: answer,
        branch: this.currentBranchId
      });

      const nextBranch = question.nextBranch[String(this.selectedOption + 1)];

      if (nextBranch === 'ultimate') {
        this.currentStep = 'ultimate';
        this.currentUltimateIndex = 0;
      } else {
        this.currentBranchIndex++;
        if (this.currentBranchIndex >= this.currentBranchQuestions.length) {
          this.currentStep = 'ultimate';
          this.currentUltimateIndex = 0;
        }
      }

      this.selectedOption = null;
    },

    prevBranchQuestion() {
      if (this.currentBranchIndex > 0) {
        this.currentBranchIndex--;
        const prevAnswer = this.answers.pop();
        if (prevAnswer?.branch === this.currentBranchId && prevAnswer.recordType) {
          this.recordTypes.pop();
        }
        this.selectedOption = null;
      }
    },

    selectUltimateOption(index) {
      this.selectedOption = index;
    },

    nextUltimateQuestion() {
      const question = this.currentUltimateQuestion;

      if (question.options) {
        this.answers.push({
          question: question.question,
          answer: question.options[this.selectedOption],
          type: 'ultimate'
        });
        this.selectedOption = null;
      } else {
        this.answers.push({
          question: question.question,
          answer: this.inputValue,
          type: 'input'
        });
        this.inputValue = '';
      }

      this.currentUltimateIndex++;

      if (this.currentUltimateIndex >= this.currentUltimateQuestions.length) {
        this.currentStep = 'supplementary';
      }
    },

    prevUltimateQuestion() {
      if (this.currentUltimateIndex > 0) {
        this.currentUltimateIndex--;
        this.answers.pop();
        this.selectedOption = null;
        this.inputValue = '';
      }
    },

    skipInput() {
      this.inputValue = '';
      this.nextUltimateQuestion();
    },

    submitInput() {
      this.nextUltimateQuestion();
    },

    selectSupplementaryOption(index) {
      if (!this.supplementaryAnswers[this.currentSupplementaryIndex]) {
        this.supplementaryAnswers[this.currentSupplementaryIndex] = [];
      }

      const current = this.supplementaryAnswers[this.currentSupplementaryIndex];
      const question = this.currentSupplementaryQuestion;

      if (question.type === 'multiple') {
        const idx = current.indexOf(index);
        if (idx > -1) {
          current.splice(idx, 1);
        } else {
          current.push(index);
        }
      } else {
        this.supplementaryAnswers[this.currentSupplementaryIndex] = [index];
      }
    },

    nextSupplementaryQuestion() {
      const question = this.currentSupplementaryQuestion;
      const answerIndices = this.supplementaryAnswers[this.currentSupplementaryIndex];
      const answer = answerIndices.map(i => question.options[i]).join(', ');

      this.answers.push({
        questionId: question.id,
        question: question.question,
        answer: answer,
        type: 'supplementary'
      });

      this.currentSupplementaryIndex++;

      if (this.currentSupplementaryIndex >= this.supplementaryQuestions.length) {
        this.generateFinalReport();
      }
    },

    prevSupplementaryQuestion() {
      if (this.currentSupplementaryIndex > 0) {
        this.currentSupplementaryIndex--;
        this.answers.pop();
      }
    },

    generateFinalReport() {
      this.report = generateReport(this.answers, this.recordTypes);
      this.currentStep = 'report';
    },

    saveReport() {
      uni.setStorageSync('emotion_report_' + Date.now(), JSON.stringify(this.report));
      uni.showToast({
        title: '报告已保存',
        icon: 'success'
      });
    },

    shareReport() {
      uni.showLoading({ title: '生成海报中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showModal({
          title: '海报已生成',
          content: '长按保存图片或分享给朋友',
          showCancel: false
        });
      }, 1000);
    },

    restart() {
      this.currentStep = 'welcome';
      this.currentScreeningIndex = 0;
      this.currentBranchIndex = 0;
      this.currentUltimateIndex = 0;
      this.currentSupplementaryIndex = 0;
      this.answers = [];
      this.recordTypes = [];
      this.currentBranchId = null;
      this.selectedOption = null;
      this.inputValue = '';
      this.supplementaryAnswers = [];
    }
  }
};
</script>

<style lang="scss" scoped>
// ============ Ins 风暖色调色板 ============
// 珊瑚粉：#FF6B6B
// 奶油色：#FFF5E4
// 玫瑰金：#FFD7D7
// 暖橙色：#FFA07A
// 柔和桃：#FFB6C1
// 浅杏色：#FFE4C4

.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF5E4 0%, #FFE4C4 50%, #FFD7D7 100%);
  padding: 40rpx;
  position: relative;
  overflow: hidden;

  // 添加柔和的光晕背景
  &::before {
    content: '';
    position: absolute;
    top: -200rpx;
    right: -200rpx;
    width: 600rpx;
    height: 600rpx;
    background: radial-gradient(circle, rgba(255, 107, 107, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    animation: breathe 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -150rpx;
    left: -150rpx;
    width: 400rpx;
    height: 400rpx;
    background: radial-gradient(circle, rgba(255, 160, 122, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    animation: breathe 10s ease-in-out infinite reverse;
  }
}

// 呼吸动画
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

// 淡入动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 欢迎页面
.welcome-page {
  text-align: center;
  padding-top: 100rpx;
  animation: fadeInUp 0.6s ease-out;
  position: relative;
  z-index: 1;

  .title {
    font-size: 52rpx;
    font-weight: bold;
    background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20rpx;
    letter-spacing: 2rpx;
  }

  .subtitle {
    font-size: 32rpx;
    color: #8B7355;
    margin-bottom: 60rpx;
    font-weight: 300;
  }

  .description {
    font-size: 28rpx;
    color: #A08060;
    line-height: 2;
    margin-bottom: 80rpx;
    background: rgba(255, 255, 255, 0.5);
    padding: 30rpx;
    border-radius: 20rpx;
    backdrop-filter: blur(10rpx);
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 60rpx;
    margin-bottom: 80rpx;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-num {
        font-size: 56rpx;
        font-weight: bold;
        background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-label {
        font-size: 24rpx;
        color: #A08060;
        margin-top: 10rpx;
      }
    }
  }

  .start-btn {
    background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    padding: 35rpx 120rpx;
    border-radius: 50rpx;
    border: none;
    margin-bottom: 40rpx;
    box-shadow: 0 10rpx 40rpx rgba(255, 107, 107, 0.4);
    transition: all 0.3s ease;
    animation: pulse 2s ease-in-out infinite;

    &:active {
      transform: scale(0.95);
    }
  }

  .note {
    font-size: 24rpx;
    color: #B8A080;
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 10rpx 40rpx rgba(255, 107, 107, 0.4);
  }
  50% {
    box-shadow: 0 15rpx 50rpx rgba(255, 107, 107, 0.6);
  }
}

// 问题页面
.question-page {
  position: relative;
  z-index: 1;

  .progress-bar {
    width: 100%;
    height: 10rpx;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 5rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(255, 107, 107, 0.1);

    .progress {
      height: 100%;
      background: linear-gradient(90deg, #FF6B6B 0%, #FFA07A 100%);
      transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 5rpx;
    }
  }

  .step-indicator {
    font-size: 24rpx;
    color: #A08060;
    text-align: center;
    margin-bottom: 40rpx;
    font-weight: 300;
  }

  .branch-tag {
    display: inline-block;
    background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
    color: #fff;
    font-size: 24rpx;
    padding: 10rpx 30rpx;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.3);
  }

  .question-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 25rpx;
    padding: 50rpx 40rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 15rpx 40rpx rgba(255, 107, 107, 0.15);
    backdrop-filter: blur(10rpx);
    animation: fadeInUp 0.5s ease-out;

    .question-text {
      font-size: 36rpx;
      color: #4A4A4A;
      line-height: 1.8;
      text-align: center;
      font-weight: 500;
    }

    &.ultimate {
      background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
      box-shadow: 0 15rpx 40rpx rgba(255, 107, 107, 0.35);

      .question-text {
        color: #fff;
        font-weight: bold;
        font-size: 38rpx;
      }
    }
  }

  .options-container {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-bottom: 60rpx;

    .option-btn {
      background: rgba(255, 255, 255, 0.9);
      color: #4A4A4A;
      font-size: 30rpx;
      padding: 35rpx 40rpx;
      border-radius: 20rpx;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.1);
      border: 2rpx solid transparent;

      &.selected {
        background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
        color: #fff;
        font-weight: bold;
        transform: scale(1.02);
        box-shadow: 0 8rpx 25rpx rgba(255, 107, 107, 0.3);
        border-color: rgba(255, 255, 255, 0.3);
      }

      &.ultimate {
        background: rgba(255, 255, 255, 0.95);
        color: #4A4A4A;

        &.selected {
          background: linear-gradient(135deg, #FFF5E4 0%, #FFE4C4 100%);
          color: #FF6B6B;
          border-color: rgba(255, 107, 107, 0.3);
        }
      }
    }
  }

  .nav-buttons {
    display: flex;
    justify-content: space-between;
    gap: 30rpx;

    .nav-btn {
      flex: 1;
      background: rgba(255, 255, 255, 0.5);
      color: #FF6B6B;
      font-size: 28rpx;
      padding: 28rpx;
      border-radius: 20rpx;
      border: 2rpx solid rgba(255, 107, 107, 0.3);
      backdrop-filter: blur(10rpx);
      transition: all 0.3s ease;

      &.next {
        background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
        color: #fff;
        font-weight: bold;
        border: none;
        box-shadow: 0 6rpx 20rpx rgba(255, 107, 107, 0.3);
      }

      &:disabled {
        opacity: 0.5;
        transform: none;
      }

      &:not(:disabled):active {
        transform: scale(0.96);
      }
    }
  }
}

// 输入页面
.input-page {
  position: relative;
  z-index: 1;

  .question-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 25rpx;
    padding: 50rpx 40rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 15rpx 40rpx rgba(255, 107, 107, 0.15);
    backdrop-filter: blur(10rpx);
    animation: fadeInUp 0.5s ease-out;

    .question-text {
      font-size: 36rpx;
      color: #4A4A4A;
      line-height: 1.8;
      text-align: center;
      font-weight: 500;
    }
  }

  .input-area {
    width: 100%;
    min-height: 300rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20rpx;
    padding: 30rpx;
    font-size: 30rpx;
    color: #4A4A4A;
    margin-bottom: 20rpx;
    border: 2rpx solid rgba(255, 107, 107, 0.2);
    box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.1);

    &:focus {
      border-color: #FF6B6B;
      box-shadow: 0 4rpx 20rpx rgba(255, 107, 107, 0.2);
    }
  }

  .char-count {
    display: block;
    text-align: right;
    font-size: 24rpx;
    color: #B8A080;
    margin-bottom: 60rpx;
  }

  .nav-buttons {
    display: flex;
    justify-content: space-between;
    gap: 30rpx;

    .nav-btn {
      flex: 1;
      background: rgba(255, 255, 255, 0.5);
      color: #FF6B6B;
      font-size: 28rpx;
      padding: 28rpx;
      border-radius: 20rpx;
      border: 2rpx solid rgba(255, 107, 107, 0.3);
      backdrop-filter: blur(10rpx);
      transition: all 0.3s ease;

      &.next {
        background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
        color: #fff;
        font-weight: bold;
        border: none;
        box-shadow: 0 6rpx 20rpx rgba(255, 107, 107, 0.3);
      }

      &:disabled {
        opacity: 0.5;
      }

      &:not(:disabled):active {
        transform: scale(0.96);
      }
    }
  }
}

// 灵魂拷问页面
.ultimate-page {
  position: relative;
  z-index: 1;

  .ultimate-tag {
    display: inline-block;
    background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
    color: #fff;
    font-size: 24rpx;
    font-weight: bold;
    padding: 10rpx 30rpx;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.3);
    animation: pulse 3s ease-in-out infinite;
  }

  .input-container {
    margin-bottom: 60rpx;

    .input-area {
      width: 100%;
      min-height: 300rpx;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20rpx;
      padding: 30rpx;
      font-size: 30rpx;
      color: #4A4A4A;
      margin-bottom: 20rpx;
      border: 2rpx solid rgba(255, 107, 107, 0.2);
    }

    .char-count {
      display: block;
      text-align: right;
      font-size: 24rpx;
      color: #B8A080;
    }
  }
}

// 补充问题页面
.supplementary-page {
  position: relative;
  z-index: 1;

  .step-indicator {
    font-size: 24rpx;
    color: #A08060;
    text-align: center;
    margin-bottom: 40rpx;
    font-weight: 300;
  }
}

// 报告页面
.report-page {
  position: relative;
  z-index: 1;

  .report-card {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 25rpx;
    overflow: hidden;
    margin-bottom: 40rpx;
    box-shadow: 0 20rpx 60rpx rgba(255, 107, 107, 0.2);
    backdrop-filter: blur(20rpx);
    animation: fadeInUp 0.6s ease-out;

    .report-header {
      background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
      padding: 50rpx 40rpx;
      text-align: center;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30rpx;
        background: radial-gradient(circle at 50% 0, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
      }

      .report-title {
        display: block;
        font-size: 44rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 15rpx;
        letter-spacing: 2rpx;
      }

      .report-time {
        display: block;
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .report-content {
      padding: 40rpx;

      .summary-section {
        margin-bottom: 40rpx;

        .section-title {
          display: block;
          font-size: 28rpx;
          font-weight: bold;
          background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 25rpx;
        }

        .summary-item {
          margin-bottom: 20rpx;

          .summary-text {
            display: block;
            font-size: 30rpx;
            color: #4A4A4A;
            line-height: 1.8;
            padding: 25rpx;
            background: linear-gradient(135deg, #FFF5E4 0%, #FFE4C4 100%);
            border-radius: 15rpx;
            border-left: 5rpx solid #FF6B6B;
            box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.1);
          }
        }
      }

      .question-section {
        margin-bottom: 40rpx;

        .section-title {
          display: block;
          font-size: 28rpx;
          font-weight: bold;
          background: linear-gradient(135deg, #FFA07A 0%, #FF6B6B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 25rpx;
        }

        .question-text-large {
          display: block;
          font-size: 36rpx;
          color: #fff;
          line-height: 1.8;
          padding: 40rpx 30rpx;
          background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
          border-radius: 20rpx;
          font-weight: bold;
          box-shadow: 0 10rpx 30rpx rgba(255, 107, 107, 0.3);
          text-align: center;
        }
      }

      .tags-section {
        display: flex;
        flex-wrap: wrap;
        gap: 15rpx;

        .tag {
          background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
          color: #fff;
          font-size: 24rpx;
          padding: 12rpx 30rpx;
          border-radius: 25rpx;
          box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.25);
        }
      }
    }

    .report-footer {
      background: linear-gradient(135deg, #FFF5E4 0%, #FFE4C4 100%);
      padding: 35rpx 40rpx;
      text-align: center;
      border-top: 1rpx solid rgba(255, 107, 107, 0.1);

      .footer-text {
        display: block;
        font-size: 28rpx;
        color: #A08060;
        font-style: italic;
      }
    }
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 20rpx;

    .action-btn {
      background: rgba(255, 255, 255, 0.95);
      color: #FF6B6B;
      font-size: 30rpx;
      font-weight: bold;
      padding: 32rpx;
      border-radius: 20rpx;
      border: 2rpx solid rgba(255, 107, 107, 0.3);
      backdrop-filter: blur(10rpx);
      box-shadow: 0 6rpx 20rpx rgba(255, 107, 107, 0.15);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.96);
      }

      &.save {
        background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
        color: #fff;
        border: none;
        box-shadow: 0 8rpx 25rpx rgba(255, 107, 107, 0.35);
      }

      &.share {
        background: linear-gradient(135deg, #FFA07A 0%, #FFB6C1 100%);
        color: #fff;
        border: none;
        box-shadow: 0 8rpx 25rpx rgba(255, 160, 122, 0.35);
      }

      &.restart {
        background: rgba(255, 255, 255, 0.5);
        color: #FF6B6B;
        box-shadow: none;
      }
    }
  }
}
</style>
