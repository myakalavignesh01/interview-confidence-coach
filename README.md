<div align="center">

# 🎤 Interview Confidence Coach
### Your Mirror Before the Real Room

**Practice out loud. Get scored like a real interviewer is listening. Walk in ready.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-222222?style=for-the-badge&logo=googlechrome&logoColor=white)](https://myakalavignesh01.github.io/interview-confidence-coach/)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#-technologies-used)
[![Zero Dependencies](https://img.shields.io/badge/Backend-None%20Needed-10b981?style=for-the-badge)](#-privacy-first-by-design)
[![License](https://img.shields.io/badge/License-Open%20Source-6366f1?style=for-the-badge)](#-license)

[🌐 Try It Live](https://myakalavignesh01.github.io/interview-confidence-coach/) · [🐛 Report Bug](https://github.com/myakalavignesh01/interview-confidence-coach/issues) · [✨ Request Feature](https://github.com/myakalavignesh01/interview-confidence-coach/issues)

</div>

---

## 🪞 The Idea

Everyone rehearses interviews the same broken way — muttering answers in the shower, or worse, *not rehearsing at all* until they're already sitting across from the panel.

**Interview Confidence Coach is the room before the room.** You get asked real questions, you answer out loud (or type), and instead of vague self-doubt, you get an actual **score, a breakdown of *why***, and a chart that proves you're getting sharper session over session — all running entirely in your browser, with nobody watching but you.

> *No servers. No sign-ups. No data leaving your machine. Just you, the questions, and the truth about how you're doing.*

---

## 🎬 What Happens When You Open It

```
  YOU                        THE COACH
   │                              │
   ├── Enter your name ─────────▶│
   │                              │
   ├── "Start New Interview" ───▶│  serves a real question
   │                              │
   ├── Speak / type your answer ─▶│  captures it live
   │                              │
   │◀──── scores in real time ────┤  Length + Quality + Clarity
   │                              │
   ├── "Next Question" ──────────▶│  repeats for the full set
   │                              │
   │◀── results + chart + tips ───┤  session logged permanently
```

By the end, you're not left with a vague feeling — you're left with a **number**, a **trend line**, and specific notes on what to fix before the real thing.

---

## ✨ What's Inside

### 🎯 Core Practice Loop
- **Interactive interview sessions** with realistic, role-agnostic questions
- **Real-time performance scoring** — no waiting, no guessing
- **Instant, specific feedback** on every single answer
- **Video recording mode** so you can watch your own body language back
- **Session history** that persists across visits (privately, on your device)

### 🧠 The Scoring Engine — How It Actually Judges You

Every answer is broken into three graded dimensions:

| Dimension | Points | What It's Really Measuring |
|---|---|---|
| 📏 **Length & Completeness** | 0–30 | Did you actually answer, or just say three words and freeze? |
| 💎 **Quality Signals** | 0–40 | Achievement language — did you show impact, not just describe a task? |
| 🧩 **Clarity & Structure** | 0–30 | Is this a coherent story, or a run-on ramble? |
| **Total Confidence Score** | **/100** | Your real-time interview readiness |

It also actively catches the small things that quietly sink real interviews — answers that are too short, filler words like *"um," "uh," "like"* creeping in, and structure that needs tightening — then turns each one into a specific, actionable suggestion instead of just a number.

### 📊 Your Progress, Visualized
- Session-by-session **line chart** (Chart.js) showing your score climbing over time
- Live stats: total sessions run, average score, personal best
- A results screen that reads less like a report card and more like a coach's notes

### 🔐 Privacy-First by Design
- Everything is stored in **LocalStorage** — your browser, your device, your data
- **Zero external API calls**, zero tracking, zero accounts to create
- Export your entire history as a CSV whenever you want it
- One-click "Clear All Data" when you're ready for a clean slate

---

## 🛠️ Technologies Used

<div align="center">

| Layer | Stack |
|---|---|
| **Structure** | HTML5 (semantic, accessible markup) |
| **Styling** | CSS3 — Grid, Flexbox, custom keyframe animations, CSS-variable theming |
| **Logic** | Vanilla JavaScript (ES6+), object-oriented, zero framework overhead |
| **Charts** | Chart.js |
| **UI Kit** | Bootstrap 5.3 + Font Awesome 6.4 |
| **Typography** | Google Fonts — Poppins & Inter |
| **Persistence** | Browser LocalStorage API |
| **Media** | Custom video-recorder module for self-review playback |

</div>

**Bundle size: 0KB of dependencies shipped as build output.** This runs anywhere a browser does — no install, no build step, no backend to keep alive.

---

## 🚀 Getting Started

```bash
# Clone it
git clone https://github.com/myakalavignesh01/interview-confidence-coach.git
cd interview-confidence-coach

# Option 1 — just open it
open index.html

# Option 2 — serve it locally (recommended for video/mic permissions)
python -m http.server 8000
# then visit http://localhost:8000
```

**Or skip all of that** and go straight to the [live version](https://myakalavignesh01.github.io/interview-confidence-coach/) — it's already deployed on GitHub Pages.

### Your First Session
1. Enter your name
2. Hit **Start New Interview**
3. Read the question, answer like it's the real thing
4. Watch your score build in real time
5. Move through the full set, then read your results
6. Check the chart — that's your proof you're improving

---

## 🎓 The Question Set

Four foundational questions every interview eventually circles back to:

1. *Tell me about yourself and your professional background*
2. *What motivates you to apply for this position?*
3. *Describe a challenging project and how you overcame it*
4. *Where do you see yourself in 5 years?*

Fully customizable in `script.js` — swap in role-specific or technical questions in minutes.

---

## 📂 Project Structure

```
interview-confidence-coach/
├── index.html          # Semantic layout, accessible forms, Bootstrap grid
├── styles.css          # 700+ lines — animations, theming, responsive breakpoints
├── script.js           # Scoring engine, state management, LocalStorage handling
├── video-recorder.js    # Self-recording & playback module
├── video-styles.css     # Styling for the recording UI
├── json                 # Question / config data
└── README.md
```

---

## 🎯 Who It's For

- 📌 Students prepping for placement season
- 🎓 First-time job seekers building baseline confidence
- 💼 Career switchers rehearsing a new pitch
- 🚀 Founders practicing their story before investor calls
- 🎤 Anyone who freezes up the moment a real question lands

---

## 🚧 What's Next

- [ ] Speech-to-text so you can *actually* talk instead of typing
- [ ] AI-generated feedback via API for deeper, contextual coaching
- [ ] Role-specific and technical question banks
- [ ] Dark mode toggle
- [ ] Cloud sync (opt-in) for practicing across devices
- [ ] Shareable results for mentors/mock-interview partners

---

## 👤 Author

**Vignesh Myakala**
B.Tech CSE (Data Science), Malla Reddy University

[![GitHub](https://img.shields.io/badge/GitHub-myakalavignesh01-181717?style=flat-square&logo=github)](https://github.com/myakalavignesh01)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/myakala-vignesh-5218a9319)

---

## 📄 License

Open source — use it, fork it, make it your own practice room.

---

<div align="center">

**🎤 The best time to fix a shaky answer is now, not in front of the panel.**
### [Start practicing →](https://myakalavignesh01.github.io/interview-confidence-coach/)

</div>
