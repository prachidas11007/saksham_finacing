---
trigger: glob
globs: "src/context/**, src/utils/storage.ts, src/utils/id.ts, src/data/**"
description: Storage, state and data-file rules (D-05, D-06, D-09, D-17, D-21)
---
- Contexts: FinanceContext and PreferencesContext are the only sources of truth. Each has a `ready` flag. NEVER write to AsyncStorage before the first load finishes. Wrap storage in try/catch, validate loaded data, fall back to defaults on bad data; the app must never crash on missing or corrupt storage.
- Storage keys are versioned: saksham:v1:<name>. Totals are never stored in state.
D-05 Reset Demo Data clears transactions, budgets, goals, lesson progress, quiz scores. It KEEPS language, Simple Mode, Large Text. Ask for confirmation first.
D-06 Budget = {id, category, limit}. One per category, applies to every month. Spent = expenses of that category in the viewed month (default current).
D-09 One combined quiz, id `core`, 5 questions. Correct-answer index lives in data/quizzes.ts (not translated). Store last and best score.
D-17 Transactions can be deleted (trash button + confirmation). No edit in the MVP.
D-21 Profile has "Load sample demo data" (confirm first, marked DEMO) using src/data/demoData.ts. That file is the only place for sample data.
