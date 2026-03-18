# 情绪分析小程序 🧠

AI 驱动的情绪识别与分析工具，通过图片分析识别用户情绪状态，提供个性化建议。

## 📱 项目介绍

基于 uniapp 开发的微信小程序，使用 AI 技术对用户上传图片进行情绪分析，帮助用户更好地了解自己的情绪状态。

### 核心功能

- **📸 图片上传** - 支持拍照或从相册选择图片
- **🤖 AI 情绪分析** - 识别 6 种基本情绪（开心、悲伤、愤怒、焦虑、平静、中性）
- **📊 情绪分布** - 展示多种情绪的置信度分布
- **💡 个性化建议** - 根据分析结果提供针对性建议
- **📝 历史记录** - 自动保存分析记录，支持查看和删除

## 🛠️ 技术栈

### 前端
- **框架**: UniApp + Vue 3
- **状态管理**: Pinia
- **构建工具**: Vite
- **目标平台**: 微信小程序

### 后端
- **框架**: FastAPI
- **数据库**: SQLite / MySQL
- **ORM**: SQLAlchemy
- **AI 分析**: 可扩展接入多种 AI 模型

## 📁 项目结构

```
emotion-analysis/
├── pages/                 # 页面目录
│   ├── index/            # 首页（上传图片）
│   ├── result/           # 分析结果页
│   └── history/          # 历史记录页
├── stores/               # 状态管理
│   └── analysis.js       # 分析状态 store
├── utils/                # 工具函数
│   └── api.js            # API 封装
├── static/               # 静态资源
├── App.vue               # 应用配置
├── main.js               # 入口文件
├── pages.json            # 页面配置
├── manifest.config.js    # 应用 manifest
├── package.json          # 依赖配置
├── uni.scss              # 全局样式变量
└── vite.config.js        # Vite 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- HBuilderX（推荐）或 CLI
- 微信小程序开发者工具

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
# 微信小程序 - 开发模式
npm run dev:mp-weixin

# 微信小程序 - 生产构建
npm run build:mp-weixin
```

### 配置小程序 AppID

编辑 `manifest.config.js`，替换为你的小程序 AppID：

```javascript
mpWeixin: {
  appid: 'wxYOUR_APP_ID', // 替换为实际 AppID
  // ...
}
```

### 配置后端 API 地址

编辑 `utils/api.js`，修改 `API_BASE_URL` 为实际后端地址：

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api'
```

## 📖 使用说明

### 1. 上传分析

1. 打开小程序，点击拍照或选择图片
2. 选择要分析的图片
3. 点击"开始分析"按钮
4. 等待 AI 分析完成

### 2. 查看结果

- **主情绪** - 显示占比最高的情绪
- **情绪分布** - 6 种情绪的置信度对比
- **AI 分析** - 详细的情绪状态解读
- **小建议** - 针对性的情绪调节建议

### 3. 历史管理

- 所有分析记录自动保存到本地
- 点击记录可查看详情
- 支持单条删除和清空所有

## 🔌 API 接口

### POST /api/emotion-analysis/analyze

分析图片情绪

**请求参数**:
- `file`: 图片文件（multipart/form-data）

**响应示例**:
```json
{
  "id": "uuid-string",
  "timestamp": "2026-03-18T10:00:00",
  "emotion": "开心",
  "emotion_key": "happy",
  "emotion_icon": "😊",
  "emotions": {
    "happy": 0.65,
    "sad": 0.10,
    "angry": 0.05,
    "anxious": 0.08,
    "calm": 0.07,
    "neutral": 0.05
  },
  "analysis": "从图片中检测到积极向上的情绪能量...",
  "suggestions": [
    "继续保持积极的心态...",
    "记录下此刻的美好感受...",
    "趁着好心情，完成一些有挑战性的任务吧"
  ],
  "confidence": 0.65
}
```

### GET /api/emotion-analysis/history

获取历史记录列表

**请求参数**:
- `page`: 页码（默认 1）
- `page_size`: 每页数量（默认 20）

### GET /api/emotion-analysis/history/{analysis_id}

获取单次分析详情

### DELETE /api/emotion-analysis/history/{analysis_id}

删除分析记录

## 🎨 情绪类型说明

| 情绪 | 英文 | 图标 | 说明 |
|------|------|------|------|
| 开心 | happy | 😊 | 积极愉悦的情绪状态 |
| 悲伤 | sad | 😢 | 低落伤感的情绪状态 |
| 愤怒 | angry | 😠 | 生气不满的情绪状态 |
| 焦虑 | anxious | 😰 | 紧张不安的情绪状态 |
| 平静 | calm | 😌 | 安宁平和的情绪状态 |
| 中性 | neutral | 😐 | 平稳无明显的情绪状态 |

## 📝 待办事项

- [ ] 接入真实 AI 模型进行情绪分析
- [ ] 添加用户登录和云端同步
- [ ] 支持多图对比分析
- [ ] 增加情绪变化趋势图表
- [ ] 添加情绪日记功能
- [ ] 支持导出分析报告

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👥 开发团队

ThousandPetalsFall 组织

---

**最后更新**: 2026-03-18
