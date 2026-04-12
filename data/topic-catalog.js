export const topicCatalog = [
  {
    id: 'meaning-gap',
    title: '生活变好后，我为什么还是不快乐',
    subtitle: '条件改善了，感受却没有一起跟上',
    icon: '🏠',
    category: '意义落差',
    intro: '你以为抵达会带来快乐，但真正难的是让生活重新变得有感觉。',
    questions: [
      {
        id: 'q1',
        type: 'choice',
        question: '你现在更接近哪一种状态？',
        options: ['条件真的变好了', '只是更方便了', '感觉没有一起变好', '说不清']
      },
      {
        id: 'q2',
        type: 'text',
        question: '最近一次让你突然有点空的瞬间，是什么场景？',
        placeholder: '例如：搬进来之后、忙完之后、吃完之后...'
      },
      {
        id: 'q3',
        type: 'choice',
        question: '你最怀念的，其实是结果，还是结果带来的那种感觉？',
        options: ['结果', '感觉', '两者都有', '说不清']
      },
      {
        id: 'q4',
        type: 'text',
        question: '如果只做一件能让你重新“有感觉”的小事，你会选什么？',
        placeholder: '例如：出门跑步、见一个人、去一个熟悉的地方'
      }
    ],
    report: {
      emotion: '条件改善后的空',
      overview: [
        '你更像是经历了期待兑现，但感受没有同步更新。',
        '这通常不是不知足，而是“默认背景”把新鲜感很快磨平了。'
      ],
      mechanism:
        '适应会让得到变平常。便利减少了摩擦，也可能顺手减少了参与感和触感。',
      question: '如果快乐不是来自“拥有”，那它最近可能藏在什么行动里？',
      action: '今天出门做 20 分钟的真实移动，不带效率目标，只让身体重新接触世界。',
      diaryPrompt: '明天在日记里写一句：今天哪一个瞬间让我真的有一点感觉？',
      suggestions: [
        '把“方便”和“有感觉”分开记录',
        '找回一件需要出门完成的小事',
        '别急着判断自己，先观察连续 7 天的变化'
      ]
    }
  },
  {
    id: 'rest-or-avoidance',
    title: '我是在休息，还是在逃避',
    subtitle: '停下来以后，你真的更轻松了吗',
    icon: '🕊️',
    category: '休息边界',
    intro: '有些停下不是恢复，而是把不想面对的东西先放到一边。',
    questions: [
      {
        id: 'q1',
        type: 'choice',
        question: '你最近的“停下来”，更像哪一种？',
        options: ['真的在恢复', '有点在逃避', '两者都有', '说不清']
      },
      {
        id: 'q2',
        type: 'text',
        question: '如果继续往前走，你最不想碰到的是什么？',
        placeholder: '写下最真实的一句就好'
      },
      {
        id: 'q3',
        type: 'choice',
        question: '你现在最需要的是哪一种支持？',
        options: ['睡一觉', '把事情拆小', '找人聊一聊', '先别逼自己']
      }
    ],
    report: {
      emotion: '休息与回避的交界',
      overview: [
        '你可能不是单纯懒，而是系统已经在用“停住”保护你。',
        '真正的问题不只是累，而是你停下来后并没有恢复。'
      ],
      mechanism: '休息会让人回到自己，逃避只会暂时关闭感受，事后反而更重。',
      question: '你现在需要的，是补能量，还是补面对现实的勇气？',
      action: '今晚只做一件没有压力的小恢复动作，比如散步 10 分钟、洗一个热水澡、早点睡。',
      diaryPrompt: '明天记录：我今天的停下来，是更接近恢复，还是更接近逃避？',
      suggestions: [
        '把“休息”和“躲开”分开写',
        '先恢复身体，再谈处理问题',
        '如果一直停住，可能需要更小的下一步'
      ]
    }
  },
  {
    id: 'vitality-gap',
    title: '为什么更容易活，不等于更想活',
    subtitle: '少了麻烦，不一定会多了生命感',
    icon: '🌊',
    category: '生命感',
    intro: '生活优化之后，人也可能悄悄失去一点真实的参与感。',
    questions: [
      {
        id: 'q1',
        type: 'choice',
        question: '你最近更明显感到的是哪一种？',
        options: ['更省事了', '更无聊了', '更空了', '说不清']
      },
      {
        id: 'q2',
        type: 'text',
        question: '最近哪件事让你觉得“这不是我想要的生活感”？',
        placeholder: '例如：一直在家、只剩便利、没什么期待'
      },
      {
        id: 'q3',
        type: 'choice',
        question: '如果想把感觉找回来，你更愿意先从哪种动作开始？',
        options: ['出门', '运动', '见人', '做一件没效率的小事']
      }
    ],
    report: {
      emotion: '便利与生命感的断层',
      overview: [
        '你得到的是更低摩擦的生活，但不一定是更高密度的体验。',
        '有些“更容易”，会悄悄换走一点“更像活着”的感觉。'
      ],
      mechanism: '生活变顺常常意味着阻力变少，但阻力变少不等于触感、对比和参与感变多。',
      question: '你最近最缺的，是效率，还是那种“我真的在场”的感觉？',
      action: '今天安排一次需要身体出门的动作，让自己在现实里待一会儿，不靠屏幕完成全部生活。',
      diaryPrompt: '明天写下：今天哪一个动作让我重新感觉自己在生活里？',
      suggestions: [
        '别只追求舒服，也观察有没有被触动',
        '把“生活顺了”与“生活活了”分开看',
        '刻意制造一点对比，感觉才更容易回来'
      ]
    }
  }
]

export function getTopicById(topicId) {
  return topicCatalog.find((topic) => topic.id === topicId) || null
}

export function formatAnswer(question, answer) {
  if (!question) {
    return ''
  }

  if (question.type === 'choice') {
    return `${question.question}：${answer || '未作答'}`
  }

  const value = (answer || '').trim()
  return `${question.question}：${value || '未作答'}`
}

export function buildTopicReport(topicId, answers = []) {
  const topic = getTopicById(topicId)

  if (!topic) {
    return null
  }

  const answerDigest = topic.questions.map((question, index) =>
    formatAnswer(question, answers[index])
  )

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    topicSubtitle: topic.subtitle,
    topicCategory: topic.category,
    emotion: topic.report.emotion,
    emotion_icon: topic.icon,
    title: topic.title,
    timestamp: new Date().toLocaleString('zh-CN'),
    overview: topic.report.overview,
    analysis: topic.report.mechanism,
    mechanism: topic.report.mechanism,
    guidingQuestion: topic.report.question,
    smallAction: topic.report.action,
    diaryPrompt: topic.report.diaryPrompt,
    suggestions: topic.report.suggestions,
    answerDigest,
    answers,
    reportVersion: 'topic-v1'
  }
}
