# 07. Bridge Loop

## Goal

Build a loop between daily logging and deep guidance.

## Flow

1. user logs a mood in `mood-diary`
2. the app detects a repeated pattern
3. the app offers one gentle invitation
4. the user enters a matching `emotion-analysis` topic
5. the result ends with one small action and one diary prompt
6. the diary prompt returns to `mood-diary` as the next day's observation cue

## Design Rules

- the invitation must feel optional
- the deep topic should match the pattern, not feel random
- the result must feed back into daily life
- the loop should be useful even if the user only opens it occasionally

## Output Contract

The deep-analysis result should always include:

- a state summary
- a mechanism sentence
- one question
- one small action
- one diary prompt

## Future Expansion

Later we can add:

- topic-specific diary prompt suggestions
- follow-up detection from the next entry
- lightweight progress tracking on "felt alive" instead of productivity
