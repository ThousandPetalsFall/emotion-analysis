# 不良情绪分析 API 文档

## 概述

不良情绪分析 API 提供问答引导式情绪探索服务，通过决策树式问题帮助用户自我觉察。

**基础路径**: `/api/emotion-analysis`

## 认证

当前版本无需认证，所有接口可直接调用。

## 接口列表

### 1. 保存分析记录

**POST** `/api/emotion-analysis/analyze`

保存用户的情绪探索记录和生成的报告。

#### 请求参数

**Content-Type**: `application/json`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| answers | array | 是 | 用户答案数组 |
| recordTypes | array | 是 | 记录的情绪类型 |
| report | object | 是 | 生成的报告对象 |

#### 请求示例

```json
{
  "answers": [
    {
      "questionId": "Q1",
      "question": "你是否会说自己好累？",
      "answer": "②经常"
    },
    {
      "questionId": "Q1-1",
      "question": "你是否有身体上的劳累？",
      "answer": "③有时",
      "branch": "fatigue"
    },
    {
      "question": "你一直在忙，是真的必须忙，还是不敢停下来？",
      "answer": "②不敢停",
      "type": "ultimate"
    },
    {
      "question": "如果停下来，你害怕面对什么？",
      "answer": "害怕面对内心的空虚",
      "type": "input"
    }
  ],
  "recordTypes": ["身体疲劳", "精神疲劳"],
  "report": {
    "title": "情绪日记 · 自我觉察",
    "timestamp": "2026-03-18 12:00:00",
    "summaries": [
      "你在用忙碌填满生活，却忘了问自己为什么而忙",
      "停下来不是偷懒，是给内心一个说话的机会"
    ],
    "guidingQuestion": "如果今天必须什么都不做，你会怎么和自己相处？",
    "footer": "允许一切发生，包括自己的情绪"
  }
}
```

#### 响应示例

**状态码**: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "createdAt": "2026-03-18T12:00:00+08:00"
  }
}
```

#### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 分析记录 ID |
| createdAt | string | 创建时间（ISO 8601 格式） |

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
  "success": true,
  "data": {
    "total": 10,
    "page": 1,
    "pageSize": 20,
    "list": [
      {
        "id": 1,
        "recordTypes": ["身体疲劳", "精神疲劳"],
        "reportTitle": "情绪日记 · 自我觉察",
        "createdAt": "2026-03-18T12:00:00+08:00"
      },
      {
        "id": 2,
        "recordTypes": ["预期焦虑"],
        "reportTitle": "内心探索 · 今日记录",
        "createdAt": "2026-03-17T15:30:00+08:00"
      }
    ]
  }
}
```

---

### 3. 获取分析详情

**GET** `/api/emotion-analysis/history/{id}`

获取指定分析记录的详细信息。

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 分析记录 ID |

#### 响应示例

**状态码**: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "answers": [
      {
        "questionId": "Q1",
        "question": "你是否会说自己好累？",
        "answer": "②经常"
      },
      {
        "questionId": "Q1-1",
        "question": "你是否有身体上的劳累？",
        "answer": "③有时",
        "branch": "fatigue"
      }
    ],
    "recordTypes": ["身体疲劳", "精神疲劳"],
    "report": {
      "title": "情绪日记 · 自我觉察",
      "timestamp": "2026-03-18 12:00:00",
      "summaries": [
        "你在用忙碌填满生活，却忘了问自己为什么而忙"
      ],
      "guidingQuestion": "如果今天必须什么都不做，你会怎么和自己相处？",
      "footer": "允许一切发生，包括自己的情绪"
    },
    "createdAt": "2026-03-18T12:00:00+08:00"
  }
}
```

#### 错误响应

**状态码**: `404 Not Found`

```json
{
  "success": false,
  "error": "记录不存在"
}
```

---

### 4. 删除分析记录

**DELETE** `/api/emotion-analysis/history/{id}`

删除指定的分析记录。

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 分析记录 ID |

#### 响应示例

**状态码**: `200 OK`

```json
{
  "success": true,
  "message": "删除成功"
}
```

---

### 5. 批量删除记录

**POST** `/api/emotion-analysis/history/batch-delete`

批量删除指定的分析记录。

#### 请求参数

**Content-Type**: `application/json`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 要删除的记录 ID 数组 |

#### 请求示例

```json
{
  "ids": [1, 2, 3]
}
```

#### 响应示例

**状态码**: `200 OK`

```json
{
  "success": true,
  "message": "已删除 3 条记录"
}
```

---

## 数据模型

### Answer (答案对象)

```json
{
  "questionId": "Q1",        // 问题 ID（筛查题和分支题有，灵魂拷问无）
  "question": "问题文本",
  "answer": "用户答案",
  "optionIndex": 1,          // 选项索引（选择题）
  "branch": "fatigue",       // 所属分支
  "type": "ultimate"         // 问题类型：ultimate/input/supplementary
}
```

### Report (报告对象)

```json
{
  "title": "情绪日记 · 自我觉察",
  "timestamp": "2026-03-18 12:00:00",
  "summaries": ["摘要 1", "摘要 2"],
  "guidingQuestion": "引导问题",
  "recordTypes": ["身体疲劳", "精神疲劳"],
  "footer": "底部文案"
}
```

### AnalysisRecord (分析记录)

```json
{
  "id": 1,
  "answers": [...],
  "recordTypes": ["身体疲劳", "精神疲劳"],
  "report": {...},
  "createdAt": "2026-03-18T12:00:00+08:00"
}
```

---

## 情绪分支参考

| 分支 ID | 分支名称 | 触发问题 |
|--------|----------|----------|
| fatigue | 疲劳分支 | 你是否会说自己好累？ |
| anxiety | 焦虑分支 | 你是否感到焦虑或紧张？ |
| loneliness | 孤独分支 | 你是否感到孤独或不被理解？ |
| confusion | 迷茫分支 | 你是否对生活感到迷茫或缺乏方向？ |
| anger | 愤怒分支 | 你是否感到愤怒或烦躁？ |
| sadness | 悲伤分支 | 你是否感到悲伤或低落？ |
| unclear | 说不清分支 | 以上都不是，但就是心情不好？ |

---

## 记录类型参考

| 分支 | 记录类型 |
|------|----------|
| 疲劳 | 身体疲劳、精神疲劳、情绪疲劳、意义疲劳 |
| 焦虑 | 预期焦虑、反刍思维、现实压力、躯体化焦虑 |
| 孤独 | 物理孤独、情感孤独、存在孤独 |
| 迷茫 | 目标缺失、路径迷茫、意义危机 |
| 愤怒 | 自我愤怒、人际愤怒、系统愤怒、压抑愤怒 |
| 悲伤 | 丧失悲伤、需求缺失、习得性无助 |
| 说不清 | 生理节律、环境适应、直觉信号、周期性情绪 |

---

## 使用示例

### cURL 示例

```bash
# 保存分析记录
curl -X POST "http://localhost:8000/api/emotion-analysis/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [...],
    "recordTypes": ["身体疲劳"],
    "report": {...}
  }'

# 获取历史记录
curl "http://localhost:8000/api/emotion-analysis/history?page=1&page_size=10"

# 获取详情
curl "http://localhost:8000/api/emotion-analysis/history/1"

# 删除记录
curl -X DELETE "http://localhost:8000/api/emotion-analysis/history/1"
```

### JavaScript 示例

```javascript
// 保存分析记录
async function saveAnalysis(answers, recordTypes, report) {
  const response = await fetch('/api/emotion-analysis/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, recordTypes, report })
  });
  return await response.json();
}

// 获取历史记录
async function getHistory(page = 1, pageSize = 20) {
  const response = await fetch(
    `/api/emotion-analysis/history?page=${page}&page_size=${pageSize}`
  );
  return await response.json();
}

// 获取详情
async function getRecordDetail(id) {
  const response = await fetch(`/api/emotion-analysis/history/${id}`);
  return await response.json();
}

// 删除记录
async function deleteRecord(id) {
  const response = await fetch(`/api/emotion-analysis/history/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
}
```

### Python 示例

```python
import requests

# 保存分析记录
def save_analysis(answers, record_types, report):
    data = {
        'answers': answers,
        'recordTypes': record_types,
        'report': report
    }
    response = requests.post(
        'http://localhost:8000/api/emotion-analysis/analyze',
        json=data
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
def delete_record(record_id):
    response = requests.delete(
        f'http://localhost:8000/api/emotion-analysis/history/{record_id}'
    )
    return response.json()
```

---

## 注意事项

1. **数据隐私**: 所有记录默认本地存储，后端存储需用户授权
2. **数据导出**: 支持导出所有历史记录为 JSON 格式
3. **数据删除**: 支持单条删除和批量删除
4. **结果参考**: 分析结果仅供参考，不作为专业心理诊断依据

---

## 更新日志

### v2.0.0 (2026-03-18)
- 重构为问答引导式情绪分析 API
- 新增决策树数据结构
- 新增报告生成接口
- 新增批量删除功能

### v1.0.0
- 初始版本发布
- 图片情绪分析接口

---

**文档维护**: ThousandPetalsFall 开发团队
**最后更新**: 2026-03-18
