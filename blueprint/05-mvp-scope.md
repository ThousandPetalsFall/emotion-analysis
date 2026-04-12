# 05. MVP Scope

## MVP Goal

Do not try to rebuild both products completely in the first phase.

The first MVP should prove one thing:

Can a lightweight daily log lead users into a meaningful deep-guidance flow at the right time?

## MVP Changes In `mood-diary`

### New Fields

Add or reserve these daily signals:

- `moodTag`: today's main state
- `feltAliveScore`: optional 1-5 score for "how alive did I feel today"
- `energyType`: `rested`, `drained`, `numb`, `unclear`
- `note`: short free text
- `guidanceEligible`: derived field, not necessarily user-facing

### New Interaction

- after saving a diary, optionally show a lightweight reflection card
- when trigger rules are met, show an invitation card into deep analysis

## MVP Changes In `emotion-analysis`

### New Capability

Add a topic-based entry mode, not only one general decision tree.

First support:

- `生活变好后，我为什么还是不快乐`
- `我是在休息，还是在逃避`
- `为什么更容易活，不等于更想活`

### Result Shape

Each topic result should output:

- current-state summary
- likely mechanism
- one reflection question
- one small action for the next 24 hours
- one suggested diary prompt to continue the loop

## Page-Level Suggestions

For `emotion-analysis`, the first pages to evolve are:

- [pages/deep/index.vue](C:/Users/Administrator/Desktop/work/emotion-analysis/pages/deep/index.vue)
- [pages/deep/result.vue](C:/Users/Administrator/Desktop/work/emotion-analysis/pages/deep/result.vue)
- [pages/deep/history.vue](C:/Users/Administrator/Desktop/work/emotion-analysis/pages/deep/history.vue)
- [stores/topic-analysis.js](C:/Users/Administrator/Desktop/work/emotion-analysis/stores/topic-analysis.js)
- [data/topic-catalog.js](C:/Users/Administrator/Desktop/work/emotion-analysis/data/topic-catalog.js)

For `mood-diary`, the first likely pages and modules are:

- `pages/index`
- the diary create flow
- state store
- API layer and diary schema

## Implementation Order

1. define shared state and trigger fields in `mood-diary`
2. define topic entry model in `emotion-analysis`
3. add one complete topic flow first
4. generate a clearer result page
5. connect diary prompt return loop

## Non-Goals For MVP

- no heavy social features
- no overly smart AI layer in the first version
- no giant philosophy content library
- no attempt to solve all emotional states at once
