# 02. Trigger And Routing

## Goal

`emotion-analysis` should not interrupt users too early.

Deep guidance works best when the system detects a meaningful pattern and offers a gentle invitation instead of forcing analysis every day.

## Trigger Logic

The first version can use simple rules from `mood-diary`.

### Signal Types

- repeated mood tags: `empty`, `numb`, `tired`, `lost`, `low`, `confused`
- repeated free-text keywords: "没意思", "空", "麻木", "懒得", "没感觉", "不想动"
- repeated mismatch pattern: user reports stable life but low felt meaning
- repeated diary rhythm: multiple low-energy entries across several days

### First Trigger Rules

Offer deep guidance when one of these happens:

1. the same low-feeling tag appears 3 times within 7 days
2. free-text contains numbness or emptiness keywords 2 times within 7 days
3. the user manually taps "I want to understand this feeling more"

## Invitation Style

The invitation must feel warm and optional.

Good examples:

- "你最近几次都提到一种‘没感觉’的状态，要不要花 3 分钟看看它后面是什么？"
- "这不一定说明你出了问题，也可能只是生活开始自动化了。要不要继续往下看看？"
- "如果你愿意，我们可以一起把这种说不清的感觉拆开。"

Avoid:

- diagnosis tone
- forced urgency
- moral pressure

## Routing Model

The route should be:

1. user records in `mood-diary`
2. system notices a pattern
3. user sees a gentle invitation card
4. user enters a matched `emotion-analysis` topic
5. the analysis result returns one reflection and one small action
6. result can optionally link back to a future diary prompt

## Return Loop

The deep-analysis result should not end with abstract insight only.

It should feed back into daily life:

- one sentence the user can bring into tomorrow
- one small experiment
- one diary prompt for the next check-in
