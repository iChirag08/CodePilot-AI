# CodePilot AI — AI Code Review & Debugging Assistant

> **Production-Quality Full-Stack AI Developer Tool & Portfolio Project**  
> *Built with React.js, Express.js, Monaco Editor, Tailwind CSS, and Google Gemini API.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v24+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-cyan.svg)](https://react.dev/)
[![Gemini API](https://img.shields.io/badge/AI-Google_Gemini_2.5_Flash-purple.svg)](https://ai.google.dev/)

---

## 🌟 Overview & Problem Statement

Modern software development demands rapid iteration, high code quality, and proactive security. However, traditional code reviews are manual and time-consuming, while generic chatbot interfaces lack deep code-editor integration, structured diagnostic outputs, and side-by-side diffing capabilities.

**CodePilot AI** bridges this gap by acting as an embedded, context-aware AI pairing assistant. Developers can write or paste code in a full-featured Monaco editor and perform instant static reviews, bug detection with single-click fixes, Big-O algorithm optimization, automated unit test generation, and contextual AI discussions.

---

## ⚡ Key AI Capabilities

### 1. 🔍 Automated Code Review
- **0–100 Quality Score Gauge**: Instant code health assessment.
- **Severity Classification**: Categorizes issues as `Critical`, `High`, `Medium`, or `Low`.
- **Categorized Diagnostics**: Analyzes performance bottlenecks, security vulnerabilities, memory leaks, and code style.
- **Actionable Recommendations**: Clear technical fixes paired with line numbers.

### 2. 🐛 Bug Detection & Debugging
- **Compiler/Runtime Error Ingestion**: Pass stack traces alongside source code.
- **Root Cause Identification**: Explains exact failure points.
- **Interactive Fixed Code Panel**: Embedded Monaco panel with `Copy Code`, `Apply Fix to Editor`, and `Clear` controls.

### 3. ⚡ Code Optimization & Refactoring
- **Big-O Complexity Metrics**: Before vs. After comparison for Time ($O(N^2) \rightarrow O(N)$) and Space complexity.
- **Side-by-Side Diff View**: Visual comparison between original and refactored code.
- **One-Click Replacement**: Seamlessly replace main editor code with optimized output.

### 4. 🧪 Automated Test Suite Generator
- **Multi-Category Coverage**: Normal execution, Edge cases, Boundary conditions, and Invalid input handling.
- **Framework Support**: Generates formatted test suites (Jest for JS/TS, PyTest for Python, JUnit for Java, GoogleTest for C++).
- **Executable Export**: Full executable test file viewer with copy functionality.

### 5. 💬 Contextual "Ask CodePilot" Assistant
- **Editor-Aware Chat**: Directly references active Monaco editor code context.
- **Quick Action Chips**: Instant prompts like *"Why is this code slow?"*, *"Explain this function"*, and *"Convert to TypeScript"*.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, JavaScript (ES6+), Tailwind CSS v4, Monaco Editor (`@monaco-editor/react`), Lucide React icons.
- **Backend**: Node.js, Express.js, CORS, Helmet security headers, Express Rate Limiter (`express-rate-limit`).
- **AI Service**: Google Gemini API (`@google/generative-ai`), fallback demo generators, structured JSON enforcement mode.
- **Tools**: Vite, npm, Git.

---

## 🏗️ System Architecture

```
                               ┌──────────────────────────────────┐
                               │   React + Tailwind CSS Client    │
                               │        (Monaco Code Editor)      │
                               └────────────────┬─────────────────┘
                                                │
                                                │ REST API (JSON)
                                                ▼
                               ┌──────────────────────────────────┐
                               │   Node.js + Express REST API     │
                               │   (Helmet, Rate Limits, CORS)    │
                               └────────────────┬─────────────────┘
                                                │
                                                │ Modular Service Abstraction
                                                ▼
                               ┌──────────────────────────────────┐
                               │        AI Engine Service         │
                               │    (Structured JSON Prompts)    │
                               └────────────────┬─────────────────┘
                                                │
                                                │ HTTPS REST / SDK Call
                                                ▼
                               ┌──────────────────────────────────┐
                               │       Google Gemini API          │
                               │    (gemini-2.5-flash LLM)        │
                               └──────────────────────────────────┘
```

---

## 📂 Project Structure

```
CodePilot-AI/
├── client/                     # Vite + React + Tailwind CSS frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Header.jsx      # Top navbar with sample code loader
│   │   │   ├── EditorPanel.jsx # Monaco editor & action toolbar
│   │   │   ├── StatusBar.jsx   # Real-time network & language status
│   │   │   ├── EmptyState.jsx  # Landing grid with feature cards
│   │   │   ├── Toast.jsx       # Floating notifications
│   │   │   └── tabs/           # AI analysis views
│   │   │       ├── ReviewTab.jsx
│   │   │       ├── DebugTab.jsx
│   │   │       ├── OptimizeTab.jsx
│   │   │       ├── TestsTab.jsx
│   │   │       └── ChatTab.jsx
│   │   ├── samples/            # Intentional bug code presets
│   │   │   └── codeSamples.js
│   │   ├── services/           # Frontend REST API client
│   │   │   └── api.js
│   │   ├── App.jsx             # Main workspace orchestration
│   │   ├── index.css           # Tailwind CSS imports & styles
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express backend
│   ├── controllers/            # Endpoint handlers & validation
│   │   └── aiController.js
│   ├── middleware/             # Rate limiters & global error handlers
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── routes/                 # Express API router
│   │   └── apiRoutes.js
│   ├── services/               # Gemini AI engine integration
│   │   └── aiService.js
│   ├── utils/                  # Structured JSON prompt templates
│   │   └── promptTemplates.js
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express application entry point
│
├── .gitignore
├── package.json                # Workspace script management
└── README.md                   # Complete documentation
```

---

## 🔌 API Endpoints (Postman Compatible)

All API endpoints accept JSON payloads and enforce rate limits.

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/review` | Generates quality review score & issue cards | `{ "code": "...", "language": "javascript" }` |
| `POST` | `/api/debug` | Analyzes bugs & generates fixed code | `{ "code": "...", "language": "python", "errorMessage": "..." }` |
| `POST` | `/api/optimize` | Computes Big-O complexity & returns refactored code | `{ "code": "...", "language": "cpp" }` |
| `POST` | `/api/tests` | Generates unit tests for Jest / PyTest / JUnit | `{ "code": "...", "language": "java" }` |
| `POST` | `/api/chat` | Contextual Q&A on active code | `{ "code": "...", "language": "sql", "userQuestion": "..." }` |
| `GET` | `/api/health` | Health check & Gemini API key status | *None* |

---

## 🚀 Quick Start / Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/iChirag08/CodePilot-AI.git
cd CodePilot-AI

# Install all root, server, and client dependencies
npm run install:all
```

### 2. Configure Environment Variables
Create a `.env` file in the `server/` folder:
```bash
cp server/.env.example server/.env
```
Edit `server/.env` and insert your Gemini API Key:
```env
PORT=5000
GEMINI_API_KEY=AIzaSy...your_actual_gemini_api_key
NODE_ENV=development
```

*(Note: If no API key is provided, CodePilot AI automatically runs in Demo Mode with fallback structured mock analytics so you can test all features immediately).*

### 3. Run Development Servers
Open two terminal windows or run using root scripts:

**Terminal 1 (Backend Server):**
```bash
npm run server
```
*Server starts on `http://localhost:5000`*

**Terminal 2 (Frontend Client):**
```bash
npm run client
```
*Vite Dev Server starts on `http://localhost:5173`*

---

## 🌐 Deployment Instructions

### Deploy Backend to Render / Railway / Heroku
1. Push project repository to GitHub.
2. Create a new **Web Service** on Render pointing to the `server/` directory.
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add Environment Variable: `GEMINI_API_KEY = your_key`

### Deploy Frontend to Vercel / Netlify
1. Create a new project on Vercel importing the repository.
2. Set Root Directory to `client`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variable or configure proxy URL if connecting to production backend.

---

## 🔮 Future Improvements
- [ ] Add Multi-file workspace support.
- [ ] Support custom user system prompt rules.
- [ ] Integration with GitHub Actions for automated pull request code reviews.
- [ ] Support local LLM backends via Ollama/LM Studio.

---

## 📝 License
Distributed under the **MIT License**. Free for personal, commercial, and educational portfolio use.
