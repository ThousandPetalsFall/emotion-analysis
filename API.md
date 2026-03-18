# 情绪分析 API 文档

## 概述

情绪分析 API 提供基于 AI 的图片情绪识别服务，支持 6 种基本情绪的识别和分析。

**基础路径**: `/api/emotion-analysis`

## 认证

当前版本无需认证，所有接口可直接调用。

## 接口列表

### 1. 分析图片情绪

**POST** `/api/emotion-analysis/analyze`

分析上传图片中的情绪状态。

#### 请求参数

**Content-Type**: `multipart/form-data`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 图片文件，支持 JPG/PNG 格式 |

#### 响应示例

**状态码**: `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-03-18T10:30:00.000Z",
  "emotion": "开心",
  "emotion_key": "happy",
  "emotion_icon": "😊",
  "emotions": {
    "happy": 0.6523,
    "calm": 0.1842,
    "neutral": 0.0891,
    "sad": 0.0412,
    "anxious": 0.0234,
    "angry": 0.0098
  },
  "analysis": "从图片中检测到积极向上的情绪能量，画面传递出快乐和满足感。这种情绪状态有助于提升创造力和人际关系。",
  "suggestions": [
    "继续保持积极的心态，把这份快乐传递给身边的人",
    "记录下此刻的美好感受，日后回顾会更有力量",
    "趁着好心情，完成一些有挑战性的任务吧"
  ],
  "confidence": 0.6523
}
```

#### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 分析记录唯一 ID |
| timestamp | string | 分析时间（ISO 8601 格式） |
| emotion | string | 主情绪中文名称 |
| emotion_key | string | 主情绪英文标识 |
| emotion_icon | string | 情绪对应 emoji 图标 |
| emotions | object | 6 种情绪的置信度分布 |
| analysis | string | AI 生成的情绪分析文本 |
| suggestions | array | 建议列表（字符串数组） |
| confidence | number | 主情绪的置信度（0-1） |

#### 错误响应

**状态码**: `500 Internal Server Error`

```json
{
  "detail": "分析失败：错误描述信息"
}
```

---

### 2. 获取分析历史

**GET** `/api/emotion-analysis/history`

获取用户的历史分析记录列表。

#### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | integer | 否 | 1 | 页码（从 1 开始） |
| page_size | integer | 否 | 20 | 每页数量 |

#### 响应示例

**状态码**: `200 OK`

```json
{
  "total": 156,
  "page": 1,
  "page_size": 20,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "timestamp": "2026-03-18T10:30:00.000Z",
      "emotion": "开心",
      "emotion_key": "happy",
      "emotion_icon": "😊",
      "confidence": 0.6523
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "timestamp": "2026-03-17T15:20:00.000Z",
      "emotion": "平静",
      "emotion_key": "calm",
      "emotion_icon": "😌",
      "confidence": 0.7234
    }
  ]
}
```

---

### 3. 获取分析详情

**GET** `/api/emotion-analysis/history/{analysis_id}`

获取指定分析记录的详细信息。

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| analysis_id | string | 分析记录 ID |

#### 响应示例

**状态码**: `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-03-18T10:30:00.000Z",
  "emotion": "开心",
  "emotion_key": "happy",
  "emotion_icon": "😊",
  "emotions": {
    "happy": 0.6523,
    "calm": 0.1842,
    "neutral": 0.0891,
    "sad": 0.0412,
    "anxious": 0.0234,
    "angry": 0.0098
  },
  "analysis": "从图片中检测到积极向上的情绪能量，画面传递出快乐和满足感。这种情绪状态有助于提升创造力和人际关系。",
  "suggestions": [
    "继续保持积极的心态，把这份快乐传递给身边的人",
    "记录下此刻的美好感受，日后回顾会更有力量",
    "趁着好心情，完成一些有挑战性的任务吧"
  ],
  "confidence": 0.6523,
  "image_url": "https://example.com/uploads/550e8400.jpg"
}
```

#### 错误响应

**状态码**: `404 Not Found`

```json
{
  "detail": "记录不存在"
}
```

---

### 4. 删除分析记录

**DELETE** `/api/emotion-analysis/history/{analysis_id}`

删除指定的分析记录。

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| analysis_id | string | 分析记录 ID |

#### 响应示例

**状态码**: `200 OK`

```json
{
  "message": "删除成功"
}
```

---

## 情绪类型参考

| emotion_key | emotion (中文) | icon | 说明 |
|-------------|----------------|------|------|
| happy | 开心 | 😊 | 积极、愉悦、满足 |
| sad | 悲伤 | 😢 | 难过、失落、沮丧 |
| angry | 愤怒 | 😠 | 生气、不满、愤怒 |
| anxious | 焦虑 | 😰 | 紧张、担忧、不安 |
| calm | 平静 | 😌 | 安宁、平和、放松 |
| neutral | 中性 | 😐 | 平稳、无明显情绪 |

## 使用示例

### cURL 示例

```bash
# 分析图片
curl -X POST "http://localhost:8000/api/emotion-analysis/analyze" \
  -F "file=@/path/to/your/image.jpg"

# 获取历史记录
curl "http://localhost:8000/api/emotion-analysis/history?page=1&page_size=10"

# 获取详情
curl "http://localhost:8000/api/emotion-analysis/history/550e8400-e29b-41d4-a716-446655440000"

# 删除记录
curl -X DELETE "http://localhost:8000/api/emotion-analysis/history/550e8400-e29b-41d4-a716-446655440000"
```

### JavaScript 示例

```javascript
// 分析图片
async function analyzeImage(filePath) {
  const formData = new FormData();
  formData.append('file', filePath);

  const response = await fetch('/api/emotion-analysis/analyze', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  console.log('分析结果:', result);
}

// 获取历史记录
async function getHistory(page = 1, pageSize = 20) {
  const response = await fetch(
    `/api/emotion-analysis/history?page=${page}&page_size=${pageSize}`
  );
  return await response.json();
}
```

### Python 示例

```python
import requests

# 分析图片
def analyze_image(image_path):
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(
            'http://localhost:8000/api/emotion-analysis/analyze',
            files=files
        )
    return response.json()

# 获取历史记录
def get_history(page=1, page_size=20):
    response = requests.get(
        'http://localhost:8000/api/emotion-analysis/history',
        params={'page': page, 'page_size': page_size}
    )
    return response.json()

# 删除记录
def delete_record(analysis_id):
    response = requests.delete(
        f'http://localhost:8000/api/emotion-analysis/history/{analysis_id}'
    )
    return response.json()
```

## 注意事项

1. **图片格式**: 支持 JPG、PNG 格式，建议大小不超过 5MB
2. **请求频率**: 建议控制请求频率，避免短时间内大量请求
3. **隐私保护**: 上传的图片仅用于分析，不会被保存或用于其他用途
4. **结果参考**: AI 分析结果仅供参考，不作为专业心理诊断依据

## 更新日志

### v1.0.0 (2026-03-18)
- 初始版本发布
- 支持 6 种基本情绪识别
- 提供个性化建议
- 历史记录管理

---

**文档维护**: ThousandPetalsFall 开发团队
**最后更新**: 2026-03-18
