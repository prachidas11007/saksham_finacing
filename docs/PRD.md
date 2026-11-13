SAKSHAM
Financial Inclusion & Financial Literacy Mobile App
PRODUCT REQUIREMENTS DOCUMENT  +  BUILD PLAN


Document field	Decision
Project name	Saksham – Financial Inclusion & Financial Literacy
Platform	Android-first mobile application (React Native + Expo)
Delivery context	Solo college project; one-day MVP build
Required languages	English, Hindi, Marathi (all mandatory)
Product status	Build-ready MVP specification
Version / date	v1.0 / 13 November 2026
Primary output	Working demonstrable prototype; local demo data only

Product promise
Help people understand financial services, find a safe next step to access them, and manage everyday money — in a language they understand.
Critical product decision: The app must not be only an expense tracker. The handwritten problem statement is about barriers to financial-service access. Therefore, the Financial Access Guide, safe digital-payment education, and three-language experience are core MVP features. Budgeting and savings tools support the same outcome.

Prepared for a one-person college build. The document separates what the one-day prototype can genuinely demonstrate from services that would require bank, payment-provider, or government integrations.

 Document guide
Section	What it contains
1. Executive summary	Product purpose, users, and value proposition
2. Problem definition	Original problem, causes, impacts, and problem-to-feature traceability
3. Goals and success measures	Outcomes, indicators, and prototype evaluation
4. Users and journeys	Personas, needs, and end-to-end task flows
5. Product scope	MVP, priorities, exclusions, and boundaries
6. Functional requirements	Testable requirements and acceptance criteria
7. Screen and navigation specification	Information architecture and per-screen behavior
8. Multilingual and accessibility specification	English, Hindi, Marathi, simple mode, and voice support
9. Technical design	Stack, architecture, folder structure, and data model
10. Trust, safety, and privacy	Financial disclaimers, safety principles, and data handling
11. One-day delivery plan	Time-boxed sequence, prompts, and build gates
12. QA and presentation	Test plan, acceptance checklist, demo script, and pitch
13. Risks and next phase	Known constraints, mitigations, and future integrations
14. Reference sources	Official Indian financial-inclusion and safety resources

How to use this document
•	Build the P0 requirements first. Do not begin decorative polish until the Access Guide, language switching, and core finance flows work.
•	Treat each acceptance criterion as a test, not an aspiration. The feature is complete only when the test passes on the Android device.
•	Use only sample/demo financial data. Clearly label it throughout the app.
•	For official scheme, complaint, and fraud resources, link to the official source and re-check the page before the college demonstration.
1. Executive summary
Saksham is an Android-first, multilingual financial-inclusion companion for people who may be unfamiliar with formal banking, digital payments, or basic money-management concepts. The app reduces the first barrier: not knowing what a service is, why it may help, what safe steps to take, what questions to ask, and where to find authoritative information.
The MVP combines four connected capabilities: (1) a guided Financial Access Guide, (2) plain-language financial learning and digital-safety guidance, (3) a basic personal money planner for budgets and savings goals, and (4) an EMI/loan-cost explainer. English, Hindi, and Marathi are first-class languages across all screens and lesson content.
Problem-solving logic: awareness gap → short lessons; process complexity → step-by-step access checklists; digital-literacy gap → simple-mode guidance, large touch targets, and read-aloud support; money-management gap → budget and savings tools; safety concern → fraud prevention and official escalation links.

Product vision
Make the first step toward safe, informed use of formal financial services understandable and achievable for a person using a smartphone, even if that person is new to banking or prefers Hindi or Marathi.
One-line positioning
A multilingual financial-inclusion guide that explains services, shows safe next steps, and helps people plan everyday money — without pretending to be a bank.
MVP platform choice
Use React Native with Expo and Expo Router. This is appropriate for a single developer because it supports Android device testing quickly, file-based navigation, and a small local-first app. Use AsyncStorage for non-sensitive demo preferences and planner data; the app does not connect to bank accounts.
2. Problem definition and solution fit
2.1 Problem statement from the project brief
Many people, especially those from low-income and rural communities, lack access to essential financial services because of limited awareness, complex banking procedures, and low digital literacy. This restricts their ability to save money, access credit, use digital payments, and achieve financial empowerment.
How might we make financial services more accessible, affordable, safe, and easy to understand so everyone can manage their money and achieve financial independence?
2.2 Root causes and product response
Problem barrier	What the user experiences	Saksham response	Evidence in the prototype
Limited awareness	Does not know which formal services exist or what they do.	Financial Access Guide + short lessons about accounts, payments, credit, savings, insurance/pension concepts.	User opens a topic, explains it in their language, and reaches a relevant next-step checklist.
Complex procedures	Does not know where to go, what to ask, or which steps come first.	Guided checklists for basic bank-account access, UPI setup through a regulated provider, and formal-credit questions.	User completes a guided checklist and opens the official source/provider page.
Low digital literacy	Finds app terminology, forms, and digital flows confusing or intimidating.	Simple Mode, plain words, icon-plus-label navigation, large buttons, read-aloud lesson support.	User can complete core tasks without needing technical terminology.
Unsafe digital-payment behavior	May trust fake links, QR/payment requests, or share credentials.	Scam warning cards, UPI safety lessons, never-share reminders, and emergency/reporting links.	User answers safety quiz correctly and can reach the official help/report route.
Difficulty saving and planning	Cannot easily understand how much is coming in, going out, or being set aside.	Local income/expense tracker, category budgets, and savings-goal planner.	Totals and progress update correctly after entries are added.
Unclear borrowing cost	May focus only on the EMI and overlook total repayment or other charges.	EMI estimator plus a borrower checklist explaining rate, fees, tenure, total repayment, and late-payment terms.	User sees estimated EMI and total interest and is prompted to compare full costs.

2.3 What “solved” means for this one-day project
The prototype can credibly solve an information-and-navigation problem: it can help a user understand a service, identify a safe next step, prepare questions/documents to verify with an authorised provider, and find an official information or complaint channel. It can also teach safer digital habits and support personal planning.
The prototype cannot itself open a bank account, approve credit, make UPI payments, sell insurance, or guarantee financial independence. Those actions require regulated institutions, identity/KYC processes, secure integrations, eligibility checks, and/or assisted local support. Do not claim otherwise in the presentation.
Definition of done for the problem: A first-time user must be able to (a) select English, Hindi, or Marathi; (b) find a relevant financial-service guide; (c) understand the next steps and safety cautions; (d) open the official resource or know what to ask an authorised provider; and (e) use at least one practical money-management tool. A beautiful dashboard without this journey does not meet the brief.

3. Product goals and success measures
3.1 Goals
•	G1 — Improve understanding: explain common financial services in everyday language and three supported languages.
•	G2 — Reduce process confusion: turn unfamiliar procedures into short, ordered checklists with official references.
•	G3 — Promote safer digital behavior: teach users never to share UPI PINs/OTPs/passwords and provide trusted help routes.
•	G4 — Build money-management confidence: make income, expenses, budgets, and savings goals easy to track with demo/local data.
•	G5 — Demonstrate inclusion by design: provide language choice, simple navigation, readable screens, and read-aloud support.
3.2 Success metrics for a college prototype
Metric	Target for prototype evaluation	How to measure
Language completeness	100% of visible UI strings and core lesson content available in English, Hindi, and Marathi.	Switch language on every screen; record missing or untranslated text.
Access-guide task success	At least 4 of 5 test users can find the correct guide and identify the next step without coaching.	Give a task: “I do not have a bank account; where do I start?”
Safety comprehension	At least 4 of 5 test users identify that a UPI PIN/OTP must not be shared.	Short pre/post question or quiz results.
Money-tool correctness	All core test cases produce expected budget, savings-progress, and EMI outputs.	Use fixed inputs and compare against hand-calculated expected results.
Usability	At least 4 of 5 test users complete add-expense and open-a-lesson tasks.	Observe task completion and count errors.
Persistence	Language, budgets, goals, and demo transactions remain after a normal app restart.	Close/reopen app and verify stored local state.

These are prototype targets, not claims of real-world impact. A one-day college demo cannot establish increased bank-account ownership, credit access, or long-term financial independence. Those require field deployment and follow-up measurement.
4. Target users and user journeys
4.1 Primary personas
Persona	Context and barrier	Needs from Saksham
First-time formal-finance user	Lives in a small town/rural community; has a smartphone but is unsure how a basic bank account or digital payments work.	Simple explanation, local-language guidance, checklist of what to ask/verify, official route to a bank/Bank Mitra.
Student or first-job earner	Uses digital payments but has limited understanding of budgeting, safe borrowing, and fraud prevention.	Expense/budget tracker, savings goals, UPI safety lessons, EMI/total-cost explanation.
Small shop owner / micro-entrepreneur	Handles regular cash and digital receipts; wants clearer money planning and may need formal credit information.	Income/expense tracking, budget planning, basic credit comparison checklist, safe digital-payment guidance.

4.2 Core user journeys
Journey A — “I need a bank account”
•	User opens Access Guide and selects “I need a bank account”.
•	App explains a basic savings account in plain language and introduces relevant official options such as PMJDY, where applicable.
•	App displays a “before you visit” checklist: contact/visit a bank branch or authorised Bank Mitra, ask for the current account type and KYC requirements, confirm charges/limits/features, and request written details.
•	User opens the official PMJDY page or saves the checklist.
•	App clearly states that eligibility, accepted documents, and account opening are determined by the bank under current rules.
Journey B — “I want to use UPI safely”
•	User opens Access Guide → Digital Payments.
•	App explains UPI and the role of a bank-linked UPI app in beginner-friendly language.
•	App explains: never share UPI PIN/OTP; entering a UPI PIN authorises a payment; do not scan unknown QR codes or follow reward/refund links.
•	User completes a short scam-spotting quiz.
•	User can open NPCI’s official fraud-awareness and UPI FAQ pages.
Journey C — “I may need a loan”
•	User opens Access Guide → Borrowing/credit.
•	App explains formal borrowing and key terms: lender, principal, interest rate, fees, tenure, EMI, total repayment, late fees, and collateral (where applicable).
•	User uses the EMI calculator with example values.
•	App provides questions to ask the lender and a warning to compare total cost, verify the lender, and never pay an unknown agent for guaranteed approval.
•	App does not recommend a lender, make an eligibility decision, or promise loan approval.
Journey D — “I think I have been scammed”
•	User opens Safety & Help from Home or Profile.
•	App shows a short urgent instruction: contact the bank/payment app immediately and report suspected cyber financial fraud through the official national channel.
•	App displays the verified national cybercrime portal and 1930 helpline information, plus RBI complaint guidance where relevant.
•	The app tells the user not to delete messages/transaction evidence and to use official channels only.
•	The app does not collect PINs, OTPs, card details, or sensitive evidence.
5. Product scope and priorities
5.1 MVP modules and priority
Module	Priority	MVP behavior	Why it is needed
Language onboarding and settings	P0 / Must	Choose English, Hindi, or Marathi; switch instantly; persist choice.	Language is a direct inclusion requirement.
Financial Access Guide	P0 / Must	Guides for bank-account access, digital payments/UPI, borrowing basics, savings/other services, and official help routes.	Directly addresses low awareness and complex procedures.
Financial learning and safety	P0 / Must	Short lessons, read-aloud where supported, simple quiz, scam-prevention content.	Directly addresses financial and digital literacy.
Money tracker and budgets	P0 / Must	Add demo income/expenses, category budgets, remaining amount and warnings.	Helps users manage everyday money.
Savings goals	P1 / Should	Create goal, set target, update saved amount, show progress.	Supports saving behavior and motivation.
EMI and borrowing-cost explainer	P1 / Should	Calculate reducing-balance EMI and total interest; display borrower checklist.	Makes credit costs easier to understand.
Simple Mode and large text	P0 / Must	Simplified labels, larger controls, readable layouts.	Makes app usable for low digital-literacy users.
Offline access to core content	P0 / Must	Lessons, checklists, glossary and demo planner work offline; official links require internet.	Supports unreliable connectivity.
Real bank/UPI/credit integrations	Out of scope	No live accounts, payment initiation, KYC, underwriting, or loan applications.	Not safe or feasible in a one-day student prototype.

5.2 Explicit non-goals
•	No real bank login, account aggregation, UPI payment, QR payment, money transfer, or balance check.
•	No loan application submission, lender matching, credit-score retrieval, underwriting, or promise of approval.
•	No KYC document upload, Aadhaar/PAN storage, bank credentials, UPI PIN, OTP, card details, or passwords.
•	No personalized investment, insurance, tax, or loan recommendation.
•	No unverified directory of nearby agents or “guaranteed” schemes.
•	No AI chatbot that could invent scheme eligibility or financial advice.
5.3 Product boundaries
Saksham is an educational and planning companion, not a financial institution, payment service provider, lender, broker, or government portal. It can link to official sources and prepare users for a conversation with an authorised institution. All scheme terms and provider requirements must be checked against current official information at the time of use.
6. Functional requirements and acceptance criteria
6.1 Onboarding and language
ID	Requirement	Acceptance criteria
FR-01	First-launch language selection	On first launch, show English, Hindi, Marathi. User selects one and proceeds. No language is pre-assumed.
FR-02	Persist language preference	After app restart, previously selected language is restored.
FR-03	In-app language switch	Changing language from Profile updates current visible UI without restarting.
FR-04	Translation completeness	All navigation, buttons, field labels, empty states, validation, alerts, lessons, quiz text and accessibility labels are translated.
FR-05	Locale formatting	Display amounts in INR; use readable Indian number grouping; avoid broken Devanagari text or clipped labels.

6.2 Financial Access Guide
ID	Requirement	Acceptance criteria
FR-06	Access categories	Home/Access screen offers “Bank account”, “Digital payments”, “Borrowing/credit”, “Savings and protection”, and “Get help”.
FR-07	Guided service cards	Each category has a plain-language explanation, who it may help, ordered steps, safety note, and relevant official source link.
FR-08	Account-access checklist	Bank-account guide explains that user should contact a bank branch/authorised Bank Mitra and confirm current eligibility, KYC documents, charges and features. PMJDY is presented as an official scheme option, not a guaranteed entitlement.
FR-09	Digital-payment guidance	UPI guide explains basic concepts, safe PIN/OTP handling, fake QR/refund/reward risks, and how to contact the bank/payment app.
FR-10	Credit guidance	Borrowing guide teaches total-cost comparison and questions to ask; no lender recommendation or approval promise.
FR-11	Official links	Open external source pages only from the relevant guide; show “external official website” label and require internet.
FR-12	Offline fallback	When offline, the saved explanation and checklist remain readable; link action shows that internet is required.

6.3 Learning and safety
ID	Requirement	Acceptance criteria
FR-13	Lesson library	At minimum: basic banking, savings, UPI/digital payments, borrowing/interest, scam prevention, and complaint/help process.
FR-14	Read aloud	Lesson screen offers Read Aloud/Stop. If the device lacks a voice for the chosen language, show a graceful message and keep text readable.
FR-15	Knowledge quiz	At least one short quiz per core topic or a combined 5-question quiz; score and explanations are shown.
FR-16	Progress tracking	Completed lessons and quiz scores persist locally.
FR-17	Fraud response	Safety & Help screen prominently shows official fraud-reporting route and emergency contact information verified before demo.

6.4 Money management
ID	Requirement	Acceptance criteria
FR-18	Demo transactions	User can add income or expense with positive amount, category, date, and optional note.
FR-19	Cashflow summary	Income total, expense total and net tracked amount update after each transaction. Label as “tracked demo amount”, not actual bank balance.
FR-20	Budget limits	User can create/edit/delete monthly category budgets and see spent, remaining and percentage.
FR-21	Budget alerts	At 80% show warning; above 100% show exceeded state. Do not send push notifications in MVP.
FR-22	Savings goals	User can create a goal, set target, update saved amount, and see percentage/remaining amount.
FR-23	Local persistence	Transactions, budgets, goals and preferences survive normal app restart.

6.5 EMI calculator
ID	Requirement	Acceptance criteria
FR-24	EMI inputs	Accept principal amount, annual interest rate, and tenure in months; validate positive/allowed values.
FR-25	EMI outputs	Calculate monthly EMI, total repayment and total interest using reducing-balance formula; handle 0% interest separately.
FR-26	Explain estimate	Display that estimate excludes lender-specific fees, insurance, taxes, penalties, or other charges unless entered separately.

6.6 Accessibility and profile
ID	Requirement	Acceptance criteria
FR-27	Simple Mode	Simplified labels and a reduced set of choices are enabled from Profile; core tasks remain available.
FR-28	Large text	Large-text setting increases text size without clipping critical controls on the target phone.
FR-29	Touch and semantics	Core controls have accessible labels and comfortably sized touch targets; do not rely on color alone.
FR-30	Reset demo data	User can reset all local demo records after a confirmation step.

7. Screen and navigation specification
7.1 Primary navigation
Tab	Primary purpose	Key actions
Home	Orientation and quick actions	Open Access Guide, add transaction, view tracked totals, open safety help.
My Money	Budgeting and savings	Transactions, category budgets, savings goals.
Learn	Financial and digital literacy	Lessons, read aloud, quiz, completion progress.
Access	Guided route to services	Bank account, UPI, credit, savings/protection, get help.
Profile	Preferences and app information	Language, Simple Mode, large text, reset data, about/disclaimer.

7.2 Screen requirements
Screen	Required content and behavior	Key validation / states
Splash / language	Saksham identity; first launch shows English / हिंदी / मराठी cards.	Language required before entering app; choice remembered.
Home	Welcome, “tracked demo amount” summary, income/expense totals, quick actions, Access Guide and Safety shortcuts.	Empty state explains how to add demo entries; never imply live bank balance.
Access category list	Large labelled cards for bank account, digital payments, borrowing, savings/protection, help.	Offline content available; external link requires connectivity.
Access detail	What it is, when it may help, step-by-step checklist, caution, source link.	Show “verify current terms with provider” on all product/process info.
My Money	Transaction list, Add Income/Expense, budget cards, savings goals.	Invalid/zero/negative amount rejected; empty state offers clear action.
Add transaction	Amount, type, category, date, optional description, Save.	Amount numeric and > 0; transaction type/category required.
Budget detail	Limit, spent, remaining, progress, edit/delete.	Budget month and category clearly displayed; warning at 80%.
Savings goal	Name, target, saved, progress; create/update.	Target > 0; saved amount cannot be negative or exceed target without explicit design decision.
Learn list	Cards for six core subjects; lesson-completion indicator.	All lesson titles/content localized.
Lesson detail	Short paragraphs, key takeaways, Read Aloud, mark complete, Start Quiz.	Stop speech when navigating away; graceful unavailable-voice state.
Quiz	Question, options, submit, correct answer and explanation.	Prevent double submission; store score and completion.
EMI calculator	Principal, annual rate, months, calculate, outputs and cost caveat.	Handle zero rate, invalid values and very large inputs safely.
Safety & Help	UPI/OTP scam reminders, call 1930, cybercrime portal, bank/provider contact reminder, RBI grievance info.	Official destinations labelled; no collection of sensitive data.
Profile	Language, Simple Mode, large text, About, privacy note, reset demo data.	Settings persist; reset requires confirmation.

7.3 Suggested home-screen content order
•	Top: “Namaste / Hello” greeting and language-independent profile/settings icon.
•	Primary card: Tracked demo amount with explicit note “Based on entries you add; not linked to your bank”.
•	Two compact cards: Income this month and Expenses this month.
•	Primary inclusion CTA: “Need help accessing a service?” → Access Guide.
•	Quick actions: Add Expense, Add Income, Savings Goal, EMI Calculator.
•	Learning/safety card: one featured lesson plus a visible “Stay safe” shortcut.
•	Bottom tabs: Home, My Money, Learn, Access, Profile.
8. Multilingual and accessibility specification
8.1 Language policy
English, Hindi, and Marathi are mandatory product languages, not optional future enhancements. Users must be able to choose a language on first launch and change it later from Profile. Do not mix English labels into Hindi/Marathi screens except where a technical term is commonly shown in English; explain the term in the selected language.
Language code	Language	Formatting locale	Quality checks
en	English	en-IN	Natural Indian English; INR formatting; avoid unexplained financial jargon.
hi	Hindi (हिंदी)	hi-IN	Natural, simple Hindi; Devanagari renders; labels fit buttons/cards.
mr	Marathi (मराठी)	mr-IN	Natural, simple Marathi; Devanagari renders; avoid word-for-word awkward translations.

8.2 Translation implementation rules
•	Use i18next/react-i18next or equivalent and central JSON translation dictionaries.
•	Every visible string must come from a translation key: screen labels, buttons, placeholders, errors, alerts, empty states, quiz content, lessons, accessibility labels, disclaimers, and help text.
•	Keep the same key set across en.json, hi.json and mr.json. Add a missing-key check before release.
•	Switch language immediately without app restart and persist the selected code locally.
•	Use locale-aware INR formatting. Separate currency math from formatted text; calculations must always use numeric values.
•	Test long Hindi/Marathi strings on the smallest Android viewport used for the demo. Allow wrapping and avoid fixed-width labels.
•	Have a fluent Hindi and Marathi speaker review financial terminology before presentation if possible.
8.3 Accessibility / low-literacy experience
Design rule	MVP behavior
Plain language	One idea per sentence; explain “interest”, “EMI”, “UPI PIN”, “KYC”, and “Bank Mitra” in simple words.
Icon + text	Never use an icon without a visible label for core tasks.
Large controls	Aim for at least 44–48 dp touch areas; give primary actions a clear full-width button.
Simple Mode	Reduce visual density; use shorter descriptions, obvious next/Back actions, and fewer simultaneous choices.
Read aloud	Offer text-to-speech on lessons and access guides. Keep text available at all times.
Readable layout	Strong contrast, readable font size, no color-only status, dynamic height for translated text.
Offline learning	Core explanations and checklists should load without internet; official links are online-only.

Speech caveat: Expo Speech uses available device voices. Hindi or Marathi voice availability can vary by Android device and installed speech engines. Test on the actual demonstration phone. If the selected voice is missing, keep the lesson readable and show a friendly fallback message rather than pretending audio is playing.
9. Technical design and project structure
9.1 Recommended stack
Layer	Technology	Reason
Mobile UI	React Native + Expo	Fast Android prototype development; mature ecosystem.
Navigation	Expo Router	File-based routes and nested screens; easier solo development.
Language	i18next + react-i18next	Translation dictionaries and instant language switch.
Local persistence	AsyncStorage	Appropriate for non-sensitive local prototype preferences and demo records.
Read aloud	expo-speech	Uses available device text-to-speech voices.
Icons	lucide-react-native	Consistent icon set.
Graphics	Native progress bars / react-native-svg if needed	Avoid complex chart implementation in the one-day MVP.
Language and currency	Intl.NumberFormat + translation dictionaries	INR display and locale-aware output.


 9.2 Project folder structure
saksham-finance/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx                 # splash / language routing
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Home, My Money, Learn, Access, Profile
│   │   ├── home.tsx
│   │   ├── my-money.tsx
│   │   ├── learn.tsx
│   │   ├── access.tsx
│   │   └── profile.tsx
│   ├── access/[topic].tsx
│   ├── lesson/[id].tsx
│   ├── quiz/[id].tsx
│   ├── transaction/add.tsx
│   ├── budget/edit.tsx
│   ├── savings/create.tsx
│   ├── calculator.tsx
│   └── safety-help.tsx
├── components/
│   ├── AppButton.tsx
│   ├── SummaryCard.tsx
│   ├── AccessGuideCard.tsx
│   ├── BudgetProgress.tsx
│   ├── GoalProgress.tsx
│   └── EmptyState.tsx
├── context/
│   ├── FinanceContext.tsx
│   └── PreferencesContext.tsx
├── i18n/
│   ├── index.ts
│   └── locales/{en,hi,mr}.json
├── data/
│   ├── accessGuides.ts
│   ├── lessons.ts
│   ├── quizzes.ts
│   └── demoData.ts
├── utils/
│   ├── calculations.ts
│   ├── currency.ts
│   └── storage.ts
├── constants/theme.ts
├── app.json
└── package.json
9.3 Data model
Entity	Fields (minimum)	Notes
Transaction	id, amount, type(income/expense), category, date, description?	Demo-only entries; validate amount > 0.
Budget	id, category, limit, month	Spent derives from expense transactions for category and selected month.
SavingsGoal	id, name, targetAmount, savedAmount, targetDate?	No bank connection; user-entered tracking only.
LessonProgress	lessonId, completed, quizScore?, updatedAt	Stores learning completion locally.
Preferences	language(en/hi/mr), simpleMode, largeText	No personal identity needed.
AccessGuide	id, titleKey, bodyKey, stepsKey, officialSourceUrl, lastReviewedAt	Static, version-controlled content; review URLs before release.

9.4 Core calculations
Tracked cashflow = sum(income transactions) − sum(expense transactions). Always label this “tracked amount” or “demo cashflow”; it is not a bank balance or real available funds.
Budget remaining = budget limit − eligible expenses for the selected month/category. Utilization = expenses ÷ limit × 100. Avoid division by zero; a zero limit must be treated as “budget not set”.
Savings goal progress = saved amount ÷ target amount × 100, capped visually at 100% while retaining the actual saved amount if the app allows overfunding.
EMI (reducing balance): let P be principal, r be annual rate divided by 12 and 100, and n be number of monthly payments. EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1). If r = 0, EMI = P ÷ n. Total repayment = EMI × n; estimated interest = total repayment − P.
9.5 State and storage
•	Use one shared FinanceContext for transactions, budgets, savings goals and learning progress. Screens should read shared state rather than maintain duplicate financial totals.
•	Use a PreferencesContext for language, Simple Mode and large text; initialize it from AsyncStorage before rendering the main tabs.
•	Persist small JSON objects with versioned keys, for example saksham:v1:transactions.
•	Handle malformed or missing storage safely: fall back to empty/default demo state and avoid app crashes.
•	Provide Reset Demo Data with confirmation. No cloud sync is included in the one-day MVP.
10. Trust, safety, and privacy requirements
10.1 Trust principles
•	Clearly identify the application as a student prototype / educational companion.
•	Do not imply that Saksham is a bank, lender, payment app, government portal, or official representative of PMJDY/RBI/NPCI.
•	Separate general education from provider-specific terms. Use official links for scheme and complaint information.
•	Show the date an official resource was last checked in app content or in the project reference list.
•	Do not use fake “approved”, “eligible”, “account opened”, or “payment successful” states.
10.2 Safety content requirements
Topic	Required message
Credentials	Never share UPI PIN, OTP, password, card PIN, or full banking credentials with another person. Saksham must never ask for them.
QR / collect request	Do not scan a QR code or approve a collect request unless you understand who is requesting money and why. Treat unexpected refund/reward requests as suspicious.
Remote access apps	Do not install an unknown app or share screen/accessibility permissions at the request of an unknown caller.
Borrowing	Verify that the lender is authorised; compare interest, fees, tenure, total repayment, penalties, and written terms. Do not pay unknown agents promising guaranteed approval.
Suspected fraud	Contact the bank/payment app immediately and use the official national cybercrime reporting channel; preserve transaction IDs and messages.
Banking complaint	First raise the issue with the regulated entity; use the current RBI complaint mechanism if unresolved and eligible.

10.3 Privacy and local data
•	No account creation/login is required for the one-day MVP.
•	Do not collect Aadhaar, PAN, bank-account numbers, debit-card numbers, UPI IDs, UPI PINs, OTPs, phone contacts, precise location, or identity documents.
•	Use local demo data only. State this in onboarding/About and near dashboard totals.
•	AsyncStorage is not a secure vault. Do not store secrets or credentials in it.
•	Provide a reset function that deletes all local Saksham demo records and preferences.
•	If real users test the app, obtain consent, use invented data, and do not ask them to enter real financial details.
The app is educational and not a substitute for bank staff, legal advice, or personalised financial advice. Product terms, eligibility, KYC documents, interest rates and complaint processes can change; verify with the relevant official institution before acting.

11. One-day solo development plan
Recommended build window: approximately 10 focused hours. The sequence intentionally puts the problem-solving journey before cosmetic polish. If time is lost, reduce animations and chart styling; do not remove Access Guide or multilingual support.
Time box	Build task	Deliverable / gate
0:00–0:40	Create Expo TypeScript project; install Expo Router and dependencies; confirm app opens on Android.	Starter app runs on phone; no navigation setup errors.
0:40–1:30	Create theme, common buttons/cards, tab navigation and initial language screen.	Five tabs visible; UI skeleton works.
1:30–3:00	Implement i18n dictionaries and language persistence before adding lots of text.	Switch English/Hindi/Marathi on all existing screens.
3:00–4:30	Build Access Guide category list, detail template, account/UPI/credit/help content and official links.	P0 problem-solving journey can be demoed end-to-end.
4:30–5:30	Build Learn list, lesson details, quiz, and Read Aloud fallback.	At least six localized short lessons; quiz scoring works.
5:30–7:00	Build My Money, add transaction, budget and savings goal state.	Totals, budget progress and goals update and persist.
7:00–7:40	Build EMI calculator and borrower checklist.	Known test case returns expected outputs.
7:40–8:20	Implement Simple Mode, large text, empty states, and Safety & Help screen.	Accessibility and urgent-help route visible.
8:20–9:20	Run functional, translation, persistence and edge-case tests; fix blockers.	No crash; P0 acceptance criteria pass.
9:20–10:00	Prepare seeded demo data, screenshots, 2-minute walkthrough, and backup APK/build plan.	Teacher-ready presentation and test script.

11.1 Suggested dependency install
npx create-expo-app@latest saksham-finance --template
cd saksham-finance
npx expo install expo-router @react-native-async-storage/async-storage expo-speech
npm install i18next react-i18next lucide-react-native
npx expo start
Follow the Expo CLI’s recommended template and SDK compatibility prompts. Expo Router is the navigation layer; it does not implement business logic, translation, storage, or calculations by itself.
11.2 AI coding workflow
1.	Ask the coding assistant to create and run the starter app first. Do not request the whole app in one prompt.
2.	Add shared theme and navigation; run it on Android.
3.	Add all three language dictionaries and test switching immediately.
4.	Implement Access Guide content and official links before the finance tracker.
5.	Add each functional module one at a time; run after every module.
6.	After code generation, ask the assistant to list changed files, exact run commands, and tests. Do not accept “complete” without running it.
7.	Keep a last-known-good copy or Git commit before risky changes.
11.3 Development prompts
Prompt A — project foundation
Build Saksham Finance as an Android-first React Native + Expo + TypeScript app using Expo Router. Create five tabs: Home, My Money, Learn, Access, Profile. Create reusable components and a navy/white/teal theme. Make the app run on Android before adding business features. Provide complete files and exact commands.

Prompt B — multilingual foundation
Implement i18next/react-i18next with English (en), Hindi (hi), and Marathi (mr). Create matching translation dictionaries and ensure every user-facing string uses a translation key. Add first-launch language choice, instant Profile switching, and AsyncStorage persistence. Translate navigation, labels, errors, empty states, lessons, quiz content, help text, and accessibility labels. Test for missing keys and text overflow.

Prompt C — problem-solving Access Guide
Build a Financial Access Guide with five categories: bank account, digital payments/UPI, borrowing/credit, savings and protection, and get help. Each detail screen must explain the service simply, give ordered next steps, list questions to ask an authorised provider, include safety cautions, and link to official sources. Include PMJDY as an official information route where relevant, not as guaranteed eligibility. Keep content available offline and make external links clearly labelled.

Prompt D — Learn and Safety
Build six short financial-literacy lessons: basic banking, savings, UPI basics, digital fraud prevention, borrowing/interest, and complaints/help. Provide English, Hindi and Marathi versions, Read Aloud using Expo Speech with missing-voice fallback, mark-complete, five-question quiz and local progress storage.

Prompt E — money tools
Build local-only demo income/expense tracking, category budgets and savings goals. Use shared state and AsyncStorage. Compute tracked income, expenses, net tracked amount, budget used/remaining, and savings progress. Clearly label values as user-entered/demo data, not actual bank balance. Validate positive amounts and persist changes.

Prompt F — EMI and quality audit
Implement reducing-balance EMI calculation with zero-interest handling, validation, monthly EMI, total repayment and total interest. Then audit all screens for crashes, navigation, language parity, local persistence, accessibility, and calculation correctness. Fix errors without removing features. Provide a manual test checklist.

12. QA, acceptance, and presentation
12.1 Release acceptance checklist
☐  App starts on target Android phone without a crash.
☐  First-launch language choice offers English, Hindi and Marathi.
☐  Language switches instantly and persists after restart.
☐  No missing translation keys on Home, My Money, Learn, Access, Profile, forms, alerts or help.
☐  Access Guide contains bank-account, digital-payment, credit, savings/protection and help paths.
☐  Bank-account route explains next step and links to official PMJDY information; does not promise approval or eligibility.
☐  UPI route includes PIN/OTP safety and links to NPCI official safety guidance.
☐  Suspected-fraud route shows official reporting portal and 1930 contact; verified at build/demo time.
☐  Lessons load offline and are available in all three languages.
☐  Read Aloud works for available language voices or shows a fallback message.
☐  Quiz score and completion state are accurate and persist.
☐  Add income/expense updates tracked totals and transaction history.
☐  Budget used/remaining/80% warning/over-budget state calculate correctly.
☐  Savings goal progress is accurate.
☐  EMI test cases are correct for positive interest and zero interest.
☐  Simple Mode and large text are usable on the target phone.
☐  No real financial credentials or identity documents are requested or stored.
☐  All money totals are labelled as demo/tracked values, not a real account balance.
☐  Reset Demo Data clears local demo state after confirmation.
12.2 Minimum test cases
Test	Input / action	Expected result
T-01 language	Select Marathi, navigate all tabs, restart app.	All screen strings remain Marathi after restart.
T-02 income	Add income ₹10,000.	Tracked income rises by ₹10,000.
T-03 expense	Add expense ₹2,500.	Tracked expense rises; net tracked amount decreases by ₹2,500.
T-04 budget	Budget ₹3,000; add category expense ₹2,500.	Used 83.33%; ₹500 remaining; 80% warning shown.
T-05 savings	Goal target ₹5,000; saved ₹1,000.	20% progress; ₹4,000 remaining.
T-06 EMI	Principal ₹50,000; 12% annual; 12 months.	EMI approximately ₹4,442.44; total repayment approximately ₹53,309.25; interest approximately ₹3,309.25.
T-07 zero-rate EMI	Principal ₹12,000; 0%; 12 months.	EMI ₹1,000; total interest ₹0.
T-08 access offline	Turn off internet and open saved bank/UPI guide.	Guide text/checklist opens; official link explains internet required.
T-09 safety	Open fraud help and tap official report link.	Correct official portal opens; no sensitive data is requested by Saksham.
T-10 reset	Reset demo data and reopen app.	Demo transactions/budgets/goals clear; language preference behavior follows product decision (retain language).

12.3 Suggested teacher demonstration (3–4 minutes)
•	Problem (20 sec): explain that people can be excluded not only because services are absent, but also because procedures and digital terms are hard to understand.
•	Language (30 sec): switch English → Hindi → Marathi live without restarting.
•	Access (60 sec): open “I need a bank account”; show the simplified steps, Bank Mitra/bank route and official PMJDY link. Then open UPI safety and show the PIN/QR caution.
•	Practical money tool (45 sec): add a ₹500 expense and show tracked totals and a category budget update.
•	Learning (30 sec): read a lesson aloud or show the fallback; take a quiz question.
•	Borrowing (30 sec): calculate EMI and show total repayment, not only monthly EMI.
•	Close (15 sec): state that the app does not handle money; it helps users understand safe next steps and manage demo planning data.
12.4 Presentation claim — use this wording
“Saksham addresses the awareness, complexity, and digital-literacy barriers in our problem statement. It guides users to understand formal financial services, take safer next steps through official channels, learn in English/Hindi/Marathi, and practise budgeting and savings. This prototype does not replace banks or perform real transactions; it reduces the information and navigation barrier that can stop people from accessing them.”

13. Risks, mitigations, and future roadmap
Risk	Why it matters	Mitigation
Scope overload	A solo developer cannot safely complete every planned feature in one day.	Protect P0: languages, Access Guide, safety learning, money tracker. Defer animations, advanced charts and cloud sync.
Translation mistakes	Poor Hindi/Marathi wording may confuse users about money or safety.	Use simple short sentences; ask a fluent speaker to review; avoid literal/technical translation.
Stale official information	Scheme rules, complaint processes and contact routes can change.	Use official URLs; add last-reviewed date; verify sources immediately before demo; avoid hard-coded eligibility claims.
False impression of real account data	Dashboard balance could be mistaken for a bank balance.	Call it “tracked demo amount”; show “not connected to bank” beside it.
TTS voice unavailable	Device may not have installed Hindi/Marathi voice.	Test on target phone; graceful fallback to text; do not make voice a release blocker.
Unsafe data collection	A prototype could accidentally request sensitive banking credentials.	No login/KYC; block fields for PIN/OTP/account credentials; store only planner demo data.
External links fail offline	Official resources require connectivity.	Keep guide content locally bundled; show link availability separately.
Misleading loan result	EMI estimate excludes lender-specific charges.	Label as estimate; show total interest and explicit excluded-cost caveat.

13.1 Future roadmap after the college MVP
Phase	Potential enhancement	Required dependency / validation
Phase 2 — field usability	Test with 10–20 users including first-time smartphone/banking users; improve language and task flows.	Consent, safe test protocol, facilitator support, no real account credentials.
Phase 3 — verified service directory	Location-based list of bank branches, Bank Mitra outlets, financial literacy centres, and official help points.	Reliable official data source, update mechanism, location consent and data freshness.
Phase 4 — assisted access	Referral or appointment workflow with authorised banks/BCs/NGOs.	Formal partner agreement, privacy/security review, service accountability.
Phase 5 — secure integration	Possible account/payment integrations through regulated providers.	Legal/regulatory review, provider APIs, consent, security architecture, audits and support.
Phase 6 — impact measurement	Track lesson completion, task success, knowledge gains and service referrals.	Privacy-preserving analytics, consent, defined outcomes and field study design.


 14. Official reference sources
Use these official sources to seed the Access Guide and verify current information. The app should link to the source itself rather than copying large amounts of third-party content. Last checked for this document: 13 November 2026.
[1] Department of Financial Services / PMJDY — Scheme details
https://www.pmjdy.gov.in/scheme
Official PMJDY objective and scheme information, basic savings account, Bank Mitra route and stated features. The app must still direct users to verify current eligibility and terms with a bank/provider.
[2] Reserve Bank of India — Financial Education
https://www.rbi.org.in/financialeducation/
RBI financial education initiative, including consumer awareness, digital finance and multilingual learning resources.
[3] RBI — FAME financial literacy material
https://www.rbi.org.in/FinancialEducation/fame.aspx
Financial Awareness Messages covering financial competencies, basic banking, digital financial literacy and consumer protection.
[4] NPCI — Fraud awareness
https://www.npci.org.in/fraud-awareness
Official digital-payment fraud-awareness guidance, including QR-code and fake reward/refund risks.
[5] NPCI — UPI FAQs
https://www.npci.org.in/what-we-do/upi/faqs
Official UPI concepts and UPI PIN safety FAQ. Do not ask users to share their UPI PIN.
[6] National Cyber Crime Reporting Portal
https://cybercrime.gov.in/
Official portal for cybercrime reporting; the portal identifies 1930 as the national cyber financial-fraud helpline. Verify live contact/process before distribution.
[7] RBI — Complaints / grievance redressal
https://www.rbi.org.in/Scripts/Complaints.aspx
Official RBI page for grievance redressal options and complaint routes. The exact route depends on the regulated entity and current rules.
[8] RBI — CMS portal
https://cms.rbi.org.in/
RBI Complaint Management System portal; users should first follow the regulated entity’s grievance process and verify eligibility/current procedure.
Appendix A — Final build checklist
☐  Create Expo app and run it on the target Android phone.
☐  Create tabs: Home, My Money, Learn, Access, Profile.
☐  Implement and verify English/Hindi/Marathi language switching and persistence.
☐  Complete at least four Access Guide paths: bank account, UPI, credit, and get help.
☐  Add official PMJDY, RBI, NPCI, and cybercrime links; verify them before presentation.
☐  Write six short lessons in all three languages and add a small quiz.
☐  Add read-aloud with voice availability fallback.
☐  Add income/expense entry, budget progress, and savings goals using local demo data.
☐  Add EMI calculator and validate at least two test cases.
☐  Add simple mode, large text, safety disclaimer, and reset demo data.
☐  Run every test in Section 12.2 on the actual Android device.
☐  Prepare demo data and deliver the problem → access guide → language → money tool → safety walkthrough.
End of document
