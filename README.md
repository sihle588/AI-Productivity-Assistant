#  AI Workplace Productivity Hub

An AI-powered productivity web app that helps professionals, teams and small businesses automate routine workplace tasks: writing emails, summarising meetings, planning work, researching topics and drafting business documents.

**Live app:** https://claude.ai/artifact/PGgeYpaLejWpJ7HTE8Nw1A
**Source file:** `ai-workplace-hub.html` (single self-contained file)

---

## Features

### Core tools
| Tool | What it does |
|---|---|
|  Smart Email Generator | Recipient, subject, key points and tone (Formal, Friendly, Persuasive, Executive, Customer Support) produce an editable email with copy, download, share and print |
|  Meeting Notes Summarizer | Extracts summary, key decisions, action items, owners and deadlines into cards |
|  AI Smart Task Planner | Builds a daily schedule, weekly planner and priority matrix, with High/Medium/Low categories, task tick-off and a productivity score |
|  AI Research Assistant | Executive summary, key insights, recommendations, risks and opportunities in dashboard widgets |
|  Workplace AI Chatbot | Chat with suggested prompts; history kept for the session; voice input and read-aloud |

### Premium features
- **Home page** with hero section, live metrics, dashboard preview, feature cards and sample testimonials
- **Executive dashboard:** AI requests, tasks completed, productivity score, 7-day trend, time saved, most-used feature, recent activity
- **Insights & Impact:** level system (up to AI Power User), day streak, achievement badges, AI-generated weekly productivity report, Business Impact Calculator
- **Document Studio:** Resume Builder, Report Writer, Presentation Generator, SWOT Analysis, Business Plan
- **Team Hub:** shared task board, task assignment, progress bar, discussion area
- **Innovation Lab:** future AI integrations, trends and automation opportunities
- **Work History:** save, search and delete past outputs
- **Other:** dark/light mode, notifications bell, user profile, one-click example inputs, thinking indicator

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

The app includes a visible notice on every tool page and a dedicated page with a **Data Privacy Notice**, **Transparency Statement** and **AI Usage Guidelines**.

---

## How to use

1. Open the live link and sign in to Claude when asked.
2. The first AI action asks for permission; allow it.
3. Pick a tool in the sidebar, enter your details (or click an example) and generate.
4. Find saved work under **Work History**; track progress on the **Dashboard** and **Insights & Impact**.
5. Voice features need browser microphone permission. Saying "add task ..." in the chat adds it to the Team Hub.

---

## Technical notes

- Single HTML file: vanilla HTML, CSS and JavaScript; no external libraries or images
- AI via the Claude artifact "sample" capability; file saving via the "downloads" capability
- Data (history, profile, team board, progress) is stored in the browser's `localStorage` on your device only
- Responsive layout for mobile and desktop; automatic dark mode support
- Palette: Primary `#2563EB`, Secondary `#0F172A`, Accent `#06B6D4`, Background `#F8FAFC`

---

## Known limitations

- **Not yet built:** calendar view, secure login page, permissions dashboard, history filters by date and category, deadline-based notifications
- PDF output uses the browser's Print dialog ("Save as PDF")
- Team Hub data is local to one browser, not shared between users; team member names are placeholders
- Testimonials are illustrative samples, not real customer quotes
- "Time saved" and impact figures are estimates based on assumed minutes per task
- Voice features depend on browser support and permissions

---

## Roadmap

Calendar integration, real authentication and roles, shared team data, history filters and exports, deadline reminders.
