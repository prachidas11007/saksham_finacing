# Translation review list

## Task 5: Initial Setup & Core Groups
- `common`: Core action verbs (Save, Cancel, Back, Delete, Yes, OK, Loading), app name, offline status message, external official link notice, and welcome line.
- `languages`: Language selection header, subtitle, and language names (en, hi, mr).
- `tabs`: Navigation tab labels for all 5 primary areas (home, myMoney, learn, access, profile).
- `errors`: Input validation error messages (empty, invalid, notPositive, tooManyDecimals, tooLarge, generic).
- `disclaimer`: Regulatory disclaimers (student prototype, not a bank, tracked demo amount, not connected to your bank).
- `a11y`: Screen reader accessibility labels for navigation actions and tabs.

## Task 6: Tabs, Profile and About
- `tabs`: Shortened the access label so all five tab labels fit on one line on a small phone.
- `profile`: Language selector, display settings (Simple Mode, Large Text), About link, reset confirmation, and reset success messages.
- `placeholders`: Titles and messages for the My Money, Learn and Access placeholder screens.
- `about`: Student prototype, not-a-bank, local demo data, storage safety and official-source verification statements.

## Task 7: Financial Access Guide & Official Links
- `common`: Added `offlineLinkError` (alert when opening external link without internet), `lastReviewed` (review date stamp for official links), and `stepNumber` (ordered step prefix).
- `officialLinks`: Official resource titles for PMJDY, RBI education & literacy, NPCI fraud awareness & UPI FAQ, Cyber Crime portal, RBI complaint portals, and Jan Suraksha schemes.
- `guides`: Screen headers, verification banner ("Verify current terms with your bank or provider"), section headings, Simple Mode toggle controls, calculator navigation label, not-found fallback, and complete structured guide content (title, summary, who it helps, ordered steps, provider questions, and caution) for bank-account, digital-payments, borrowing, savings-protection, and emergency help.
- `placeholders`: Added safetyHelp and calculator placeholder titles and descriptions.

## Task 8: Safety & Help
- `safety`: Danger banner, urgent fraud steps (bank contact, 1930 helpline, cyber crime portal, keeping evidence, official channels, RBI complaint path), "Never share" card list (UPI PIN/OTP/password/card PIN, unknown QR/collect requests, unknown apps/screen sharing), Saksham-never-asks statement, call button and dialer-failure message with the helpline number, official links heading, and the Profile row helper text.

## Task 9: Learn, Read Aloud, Quiz
- `learn`: Screen titles, subtitles, "Completed" and "Not started" status indicators, Read Aloud/Stop controls, reading-in-progress indicator, missing voice error notice, summary/details/takeaways headings, Show more/less toggles, and quiz summary card labels.
- `lessons`: Six comprehensive financial literacy lessons (`banking`, `savings`, `upi`, `fraud`, `borrowing`, `help`) with titles, summaries, 5 short one-idea paragraphs explaining KYC, Bank Mitra, UPI PIN, OTP, EMI, and interest, and 4 practical takeaways per lesson, adhering to plain language and D-19 (no numbers, no promises).
- `quiz`: 5-question core financial literacy quiz covering UPI PIN/OTP secrecy, UPI payment authorization, KYC purpose, loan EMI meaning, and immediate fraud response steps; question prompts, 3 options per question, plain-language explanations, double-tap protected submission, icon+text correctness feedback, scoring, retry, and best score tracking.

## Task 10: My Money, Transactions
- `categories`: Fixed category keys from D-07 for expenses (food, transport, home, bills, health, education, shopping, other) and income (salary, business, farming, gift, other).
- `myMoney`: Section tab labels (Transactions, Budgets, Goals, More tools), viewed month summary labels (income, expenses, net tracked amount, disclaimer: "Tracked demo amount. Not your bank balance."), month navigation controls, add entry actions, empty state messages for transactions, budgets and goals, delete confirmation dialog and a11y labels, and transaction add form controls (type toggle, amount, category, date picker, optional note, D-23 banking detail caution, and save).

## Task 11: Budgets and savings goals
- `myMoney`: Added budget and savings goal translations across en, hi, mr: budget cards (spent, limit, remaining, status words: On track, Near limit, Exceeded, Budget not set), warning banner, over by amount, edit and delete confirmations; goal cards (saved, target, remaining, goal reached indicator, create goal form with name, target, optional starting saved, and D-23 warning), and goal detail screen (add money, edit, delete confirmation).

## Task 12: EMI calculator and lender checklist
- `calculator`: Screen subtitle, principal/rate/tenure input labels and placeholders, calculate action, result labels (Monthly EMI, Total Repayment, Total Interest), estimate-only banner excluding lender fees, insurance, taxes, penalties and other charges, lender question checklist (8 items read through `tList`), a note to compare total cost and never pay an agent for guaranteed approval, and field-specific validation errors (empty, invalid, too small, too large, too many decimals, tenure not whole).

## Task 13: Home dashboard
- `home`: Translated greeting, visible profile shortcut, tracked demo amount primary card label and note ("Based on entries you add. Not linked to your bank."), compact cards for income and expenses this month, primary CTA button for accessing services, quick actions (Add Expense, Add Income, Savings Goal, EMI Calculator), featured lesson and stay safe shortcuts, empty state title and guidance message, and four Simple Mode big button labels (Access Guide, Add Expense, Learn, Safety & Help).

## Task 15: Full Audit & Fixes
- `en.json`: Updated `guides.bank-account.questions[2]` to "Are there minimum amount requirements or maintenance fees?" removing the standalone word "balance" to comply with the strict rule that "balance" only appears when disclaiming a bank balance.
- `mr.json`: Replaced all 6 occurrences of Devanagari numerals (`१९३०` and `५`) in `guides.help.steps[1]`, `learn.quizCardDescription`, `lessons.help.paragraphs[1]`, `lessons.help.takeaways[1]`, `quiz.core.q5.options[0]`, and `quiz.core.q5.explanation` with Western digits (`1930` and `5`) per Rule D-13.

## Task 16: Demo data and release prep
- `profile`: Added `demoSectionTitle`, `demoBadge` ("DEMO"), `loadDemo`, `loadDemoHelp`, `loadDemoDialogTitle`, `loadDemoDialogMessage`, `loadDemoConfirm`, `loadDemoSuccessTitle`, and `loadDemoSuccessMessage` across en, hi, mr for the "Load sample demo data" action with explicit DEMO labelling and confirmation.
- `demoData`: Added `emergencyGoal` ("Emergency Fund", "आपातकालीन फंड", "आपत्कालीन निधी") for the seeded demo savings goal.

## Cross-Platform UI Fixes (Web & Mobile)
- `common`: Added `today` ("Today", "आज", "आज") for quick date selection across web and mobile date pickers.

## Needs fluent review
- `guides.borrowing.caution` (mr): Currently uses "सावकाराच्या अधिकाराची" ("moneylender's authorisation"). In Marathi, "सावकार" traditionally refers to private/informal moneylenders. Recommend fluent review to determine if "अधिकृत कर्ज देणाऱ्या संस्थेच्या" or "बँक/वित्तीय संस्थेच्या" is clearer for registered formal institutions.
- `guides.bank-account.questions[3]` (mr): Currently uses "मोबाइल बँकिंग प्रवेश मिळतो का?" ("mobile banking access"). Recommend fluent review for "मोबाइल बँकिंग सुविधा मिळते का?" which is the more natural colloquial Marathi term for banking services.
- `guides.savings-protection.summary` (mr): Currently uses "सुरक्षितता आणि संरक्षण" for savings and protection. Recommend reviewing whether "आर्थिक सुरक्षा आणि विमा" or "बचत आणि विमा संरक्षण" resonates better with semi-urban and rural speakers.
- `myMoney.budgetNearLimit` (mr): Currently "मर्यादेच्या जवळ". Recommend fluent review whether adding "बजेट" ("बजेट मर्यादेच्या जवळ") provides clearer stand-alone context on badges.
- `common.trackedDemoNotice` (mr): Currently "ट्रॅक केलेली डेमो रक्कम. तुमच्या बँक खात्याशी जोडलेली नाही." Recommend reviewing whether "लिंक केलेली नाही" is more intuitive to users familiar with common banking SMS terminology than "जोडलेली नाही".
- `safety.neverShareList[2]` (mr): Currently "अनोळखी ॲप्स किंवा स्क्रीन शेअरिंग". Recommend reviewing whether an explanatory gloss like "स्क्रीन शेअरिंग (इतरांना मोबाईल स्क्रीन दाखवणारे ॲप)" is needed for first-time smartphone users.
- `calculator.checklistNote` (hi): "हमेशा कुल चुकाई जाने वाली राशि (मूलधन + कुल ब्याज + शुल्क) की तुलना करें, केवल मासिक किस्त की नहीं।" Check whether "कुल वापस की जाने वाली रकम" is more accessible to first-generation learners than "चुकाई जाने वाली राशि".




