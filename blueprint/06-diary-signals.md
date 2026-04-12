# 06. Diary Signals

## Goal

`mood-diary` should provide light signals that help `emotion-analysis` know when a user may benefit from a deeper topic.

## Minimal Fields

- `moodTag`: today's main mood label
- `feltAliveScore`: optional 1-5 score for felt aliveness
- `energyType`: `rested`, `drained`, `numb`, `unclear`
- `note`: short free text
- `triggerEligible`: derived field for topic invitation

## Simple Trigger Rules

- a low-feeling tag appears 3 times in 7 days
- free text contains numbness or emptiness keywords 2 times in 7 days
- user manually taps a "deep analysis" entry

## Suggested Keywords

- `没意思`
- `空`
- `麻木`
- `没感觉`
- `懒得`
- `不想动`

## Output

When a trigger happens, `mood-diary` should not force analysis.
It should only show a soft invitation that points to one matching topic in `emotion-analysis`.
