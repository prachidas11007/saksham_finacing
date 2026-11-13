# Saksham: agent rules (always on, keep short)
Android-first, English/Hindi/Marathi financial-literacy guide + demo money planner. Expo + TypeScript + Expo Router. NOT a bank or payment app. No login, backend, chatbot or real money.

## Work
- Truth order: task file > .agents/rules/* > docs/PRD.md. Gap or conflict: STOP and ask. Never guess.
- Do only the named task. No extra features, screens, packages or refactors. Never delete or "simplify" working code.
- Search the repo before creating a util or component. Read only files you will touch.
- Never open all of docs/PRD.md. Search for the section the task cites; read only that part.
- Plan in 8 bullets max, then build. Package not allowed (rule 8): ask.
- Rules by file type live in .agents/rules/. If one applies and is not in context, open it before editing.
- Finish with `npm run verify` (before it exists: `npx tsc --noEmit`). Fix errors. No TODO hiding missing work. After 3 failed fixes: stop and report.

## Hard rules
1. No visible text in code. Use t('key'); add keys to en.json, hi.json, mr.json in the same change; log new key groups in docs/TRANSLATION_REVIEW.md.
2. No colours/sizes in screens (constants/theme.ts), no magic numbers (constants/limits.ts), no hand-made ₹/%/dates (src/utils), no URL or phone outside src/data/officialLinks.ts, no demo data outside src/data/demoData.ts, no secrets.
3. Money is a number in rupees; round2() after each calculation. Store keys and numbers, never labels or formatted text. Dates are local 'YYYY-MM-DD'; never toISOString().
4. Totals come only from selector hooks. Screens do no maths.
5. Never show fake states ("approved", "eligible", "account opened", "balance"). Say "tracked demo amount". Never ask for or store PIN, OTP, password, card or account number, UPI ID, Aadhaar, PAN, contacts, location.
6. No empty catch; no console.log as handling; await or .catch every async call. Load storage before saving; validate; fall back to defaults.
7. Tests use real inputs and outputs. Never change an expected value, skip or delete a test, or special-case a test answer. If a test looks wrong: STOP and show the maths.
8. Install with `npx expo install <pkg>`. Allowed: expo-router, @react-native-async-storage/async-storage, expo-speech, @react-native-community/netinfo, @react-native-community/datetimepicker, i18next, react-i18next, @expo/vector-icons, expo-splash-screen, react-native-safe-area-context; dev: jest, jest-expo, @types/jest. Never --force or --legacy-peer-deps. Your Expo knowledge may be old (new templates use src/app): check docs.expo.dev when unsure.
9. Mobile only: no div, span, window, localStorage, CSS files. One routes folder (src/app). FlatList for lists. Text wraps, no fixed text widths. Touch targets 48dp or more. Status never by colour alone.
10. No git commands unless asked. Never reset --hard, push --force, clean -fd, or rm -rf. Never touch node_modules or .env.

## Final message (15 lines max)
Files changed. Each command: PASS or FAIL + last 5 lines (full text only for failures). NOT TESTED: phone, sound, internet, airplane mode (you cannot see a phone; never write "tested on device"). Assumptions. No code dumps.
