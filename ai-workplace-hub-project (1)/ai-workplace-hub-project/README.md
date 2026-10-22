# 🚀 AI Workplace Productivity Hub

An AI-powered productivity web app that helps professionals, teams and small businesses automate routine workplace tasks: writing emails, summarising meetings, planning work, researching topics and drafting business documents.

**Live app:** https://claude.ai/artifact/PGgeYpaLejWpJ7HTE8Nw1A


---

## Features

### Core tools
| Tool | What it does |
|---|---|
| ✉️ Smart Email Generator | Recipient, subject, key points and tone (Formal, Friendly, Persuasive, Executive, Customer Support) produce an editable email with copy, download, share and print |
| 📝 Meeting Notes Summarizer | Extracts summary, key decisions, action items, owners and deadlines into cards |
| 📅 AI Smart Task Planner | Builds a daily schedule, weekly planner and priority matrix, with High/Medium/Low categories, task tick-off and a productivity score |
| 🔍 AI Research Assistant | Executive summary, key insights, recommendations, risks and opportunities in dashboard widgets |
| 🤖 Workplace AI Chatbot | Chat with suggested prompts; history kept for the session |

### Advanced features
- **Dashboard overview:** tasks completed, emails generated, research reports, meeting summaries, AI productivity score, charts and recent activity feed
- **Work History:** save, manage and search past AI outputs (top-bar search)
- **Output actions:** copy to clipboard, download, print / save as PDF
- **Notifications** bell and **user profile** section
- **Dark / light mode** toggle, responsive sidebar layout, smooth transitions

---

## Prompt engineering

Each tool sends a role-based system prompt plus the user's input to the AI model. Structured tools request JSON so results render as cards.

| Tool | Role prompt |
|---|---|
| Email | "You are an expert corporate communication specialist. Generate a professional, concise, well-structured email based on user requirements." |
| Meeting | "You are a business analyst. Summarize meeting notes and extract actionable outcomes, decisions, owners, and deadlines." |
| Planner | "You are a productivity consultant. Prioritize tasks using urgency and importance frameworks." |
| Research | "You are a workplace research analyst. Provide concise insights, recommendations, and executive summaries." |

---

## Responsible AI

> AI-generated content may contain inaccuracies. Users should verify all outputs before making business decisions. This system is intended to assist, not replace, human judgment.

The app includes a dedicated Responsible AI page with a **Data Privacy Notice**, **Transparency Statement** and **AI Usage Guidelines**.

---

## How to use

1. Open the live link.
2. The first AI action asks for permission; allow it.
3. Pick a tool in the sidebar, enter your details (or click an example) and generate.
4. Find saved work under **Work History**; track progress on the **Dashboard** and **Insights & Impact**.

---

## Technical notes

- Single HTML file: vanilla HTML, CSS and JavaScript; no external libraries or images
- AI via the Claude artifact "sample" capability; file saving via the "downloads" capability
- Data (history, profile, team board, progress) is stored in the browser's `localStorage` on your device only
- Responsive layout for mobile and desktop; automatic dark mode support
- Palette: Primary `#7C3AED`, Secondary `#0F172A`, Accent `#C084FC`, Background `#FAF8FF`

---

## Known limitations

- PDF output uses the browser's Print dialog ("Save as PDF")

---

## Roadmap

Planned: calendar view, authentication, shared team data, history filters.

---

## Project structure

```
ai-workplace-hub-project/
├── index.html
├── css/styles.css
├── js/config.js     (AI provider hook)
├── js/app.js        (app logic)
├── assets/favicon.svg
├── docs/
└── README.md
```

Open `index.html` in a browser to run it. To enable AI outside Claude, edit `js/config.js` to call your own backend endpoint. For GitHub Pages: Settings > Pages > Deploy from a branch > `main` / root.
