---
trigger: glob
globs: "src/app/**, src/components/**, src/i18n/**, scripts/**"
description: UI, language, accessibility, content and link rules (D-03, D-04, D-10, D-11, D-18 to D-20, D-23)
---
D-03 "Get help" in the Access list opens /safety-help. One help screen only.
D-04 In Hindi and Marathi keep UPI, EMI, KYC, OTP, PIN, PMJDY, RBI, NPCI in Latin letters. Explain each in the chosen language where it first appears.
D-10 Simple Mode: (a) Home = tracked amount card + 4 big buttons (Access Guide, Add Expense, Learn, Safety Help). (b) Lesson and Access detail: summary and steps/takeaways first, rest behind "Show more". (c) My Money: transactions + Add; Budgets and Goals behind "More tools". (d) Buttons min 56dp (normal 48dp).
D-11 Large Text: multiplier 1.25 applied only inside AppText, on top of phone font size. AppText caps phone scaling with maxFontMultiplier 1.4. No fixed-width or fixed-height text containers.
D-18 i18n: bundled JSON, started before first render, fallbackLng 'en'. `npm run check:i18n` must pass (same keys, same array lengths, no empty strings). Read arrays only through tList(); never .map on t(..., {returnObjects:true}). Avoid plurals.
D-19 Lessons and guides contain NO scheme numbers (limits, premiums, ages, rates, fees) and no promises ("free", "guaranteed", "you are eligible", "approved"). Say: ask the bank or the official site for current details.
D-20 Every official link shows "External official website, needs internet" and its lastReviewedAt date. Check NetInfo before opening; offline: show a translated message, do nothing else.
D-23 No text inputs on Safety & Help or Access screens. Under note and goal-name boxes show a translated "Do not type bank details here."
Also: Hindi/Marathi in short simple sentences. Core icons always have a visible text label and a translated accessibilityLabel/accessibilityRole. Safe areas from react-native-safe-area-context. Amount fields use decimal-pad; forms are keyboard-safe. Stop speech when leaving a screen; check a voice exists before speaking.
