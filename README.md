# StudyBuddy AI 🎓

> **Learn smarter. Understand better.**  
> A local, student-first AI study companion powered by open-weight AI running directly on your computer via Ollama and Gemma.

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026%20Weekend%20Challenge%20%231-blue.svg)](https://hacktoberfest.com/)
[![Local AI](https://img.shields.io/badge/Local%20AI-Ollama%20%2B%20Gemma-emerald.svg)](https://ollama.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)

---

## 1. What is StudyBuddy?

**StudyBuddy AI** is an open-source, student-focused educational companion designed to help learners understand difficult academic concepts without needing to master prompt engineering. 

Instead of generating superficial answers, StudyBuddy follows a foundational principle:

> **"Don't just give the student the answer. Help the student understand it."**

By taking any topic, question, or pasted notes, StudyBuddy acts like a patient, knowledgeable classmate or senior student, breaking down complex topics step-by-step with real-world analogies, code walkthroughs, exam pitfalls, and revision points.

---

## 2. Why I Built It

Students often don't struggle because study materials are unavailable. They struggle because standard textbook explanations and online articles are either too dense, overly academic, or assume prerequisites they haven't mastered yet.

When students turn to generic AI chatbots, they often get overwhelming, generic text dumps or raw answers that encourage passive copying rather than genuine comprehension.

StudyBuddy was created for a real friend preparing for upcoming exams: to turn academic confusion into structured, intuitive understanding, followed by targeted practice and high-yield revision.

---

## 3. Hacktoberfest 2026

- **Event:** Hacktoberfest 2026 Weekend Challenge #1
- **Theme:** *Build for a Friend*
- **Core Requirement:** Real open-weight local AI running on the user's hardware without proprietary hosted AI APIs.

StudyBuddy uses genuine local inference:
```
React Frontend (Port 5173) 
  ↓
Express Backend (Port 3001) 
  ↓
Ollama Local API (Port 11434) 
  ↓
Gemma Open-Weight Model (Local Weights)
```

---

## 4. Key Features (Phase 1 MVP)

- 🧠 **AI Study Assistant (Explain Mode)**: Deep, structured conceptual breakdowns (Simple Explanation, Why It Matters, Real-World Analogy, Step-by-Step Breakdown, Code Examples, Exam Pitfalls, Quick Revision).
- ⚡ **Local Open-Weight Inference**: Driven by Google's Gemma model running locally via Ollama.
- 🔌 **Dynamic Ollama Health & Status**: Live connection badge detecting whether Ollama is running and whether the target model is installed.
- 🛡️ **Actionable Error & Offline Recovery**: Clear terminal commands and retry controls if Ollama is paused or the model is missing.
- 🕒 **Recent Sessions**: Local session history saved safely in the browser (`localStorage`) for quick topic resumption.
- 💡 **Interactive Follow-Up Prompts**: Contextual follow-up suggestions (*"Give me another analogy"*, *"Explain more simply"*, *"What are common exam questions?"*).
- 📱 **Responsive Student-Centric UI**: Clean, accessible layout built with Tailwind CSS, supporting both desktop and mobile devices.

---

## 5. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons | Responsive, fast student interface |
| **Backend** | Node.js, Express, CORS, Dotenv | Secure local API layer and prompt engine |
| **Local AI Engine** | Ollama (`http://localhost:11434`) | Local model serving and inference runtime |
| **Open Model** | `gemma3:4b` | Open-weight instruction-tuned model |
| **Storage** | Browser `localStorage` | Client-side session and topic persistence |

---

## 6. Architecture & Pipeline

```
+-------------------------------------------------------------+
|                      User Browser                           |
|      React 18 + Vite (http://localhost:5173)                |
+------------------------------+------------------------------+
                               |  POST /api/ai/ask
                               |  GET  /api/health
                               v
+-------------------------------------------------------------+
|                  Express Backend API                        |
|             (http://localhost:3001)                         |
|   - Input validation & prompt construction                  |
|   - Health & model verification                             |
+------------------------------+------------------------------+
                               |  POST /api/generate
                               |  GET  /api/tags
                               v
+-------------------------------------------------------------+
|                     Local Ollama Engine                     |
|             (http://localhost:11434)                        |
+------------------------------+------------------------------+
                               |  Model weights execution
                               v
+-------------------------------------------------------------+
|               Gemma Open-Weight Model                       |
|           (gemma3:4b running on local CPU/GPU)              |
+-------------------------------------------------------------+
```

---

## 7. Prerequisites

Before installing StudyBuddy, ensure you have:

1. **Node.js** (v18.0.0 or higher) — [Download Node.js](https://nodejs.org/)
2. **Ollama** installed on your system — [Download Ollama](https://ollama.com/download)
3. **RAM / Hardware:** At least 8 GB of system RAM recommended for `gemma3:4b`.

---

## 8. Installing Ollama & Pulling the Model

### Step 1: Install Ollama
Download and run the installer for your OS:
- **Windows:** Download and run `OllamaSetup.exe` from [ollama.com](https://ollama.com/download/windows).
- **macOS:** Download the macOS `.zip` package.
- **Linux:**
  ```bash
  curl -fsSL https://ollama.com/install.sh | sh
  ```

Verify your installation in a terminal:
```bash
ollama --version
```

### Step 2: Pull the Gemma Model
Pull the recommended open-weight model:
```bash
ollama pull gemma3:4b
```

To verify the model is installed locally:
```bash
ollama list
```

---

## 9. Running StudyBuddy AI Locally

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/studybuddy-ai.git
cd studybuddy-ai
```

### Step 2: Set Up & Start the Backend Server
```bash
cd server
npm install
npm run dev
```
*The Express server will start on `http://localhost:3001`.*

### Step 3: Set Up & Start the Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
*The Vite development server will open on `http://localhost:5173`.*

---

## 10. Environment Variables

### Backend (`server/.env`)
Copy `server/.env.example` to `server/.env`:

```env
# Ollama local endpoint
OLLAMA_URL=http://localhost:11434

# Configurable model name
OLLAMA_MODEL=gemma3:4b

# Server port and client CORS origin
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
REQUEST_TIMEOUT_MS=120000
```

---

## 11. API Documentation

### 1. Health & Status Check
`GET /api/health`

**Response (Connected):**
```json
{
  "status": "ok",
  "localAi": {
    "connected": true,
    "model": "gemma3:4b",
    "modelInstalled": true,
    "availableModels": ["gemma3:4b"],
    "url": "http://localhost:11434",
    "error": null
  }
}
```

### 2. Study Assistant Explanation
`POST /api/ai/ask`

**Request Body:**
```json
{
  "message": "Explain recursion in C like I am a beginner",
  "mode": "explain",
  "subject": "Data Structures"
}
```

**Response:**
```json
{
  "success": true,
  "response": "### 💡 Simple Explanation\nRecursion is a programming technique...",
  "mode": "explain",
  "subject": "Data Structures",
  "model": "gemma3:4b"
}
```

---

## 12. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| **Local AI Offline (Red badge)** | Ollama background process isn't running | Start Ollama with `ollama serve` or open the Ollama desktop app. |
| **Model Not Installed (Amber badge)** | `gemma3:4b` has not been downloaded | Run `ollama pull gemma3:4b` in your terminal. |
| **Timeout on first request** | Model is loading into system RAM/VRAM | Local models take a few seconds on cold start. Subsequent queries are faster. |
| **Port in use error** | Another process is on 3001 or 5173 | Set `PORT=3002` in `server/.env` or check running tasks. |

---

## 13. Why Open Innovation Matters

1. **Student Accessibility:** Cloud AI services often require credit cards, monthly subscriptions, and strict API rate limits. Local open-weight models are freely accessible to students anywhere.
2. **Privacy:** Student study notes, homework drafts, and questions remain on their personal machine.
3. **Auditability & Customization:** Open weights allow the community to understand, inspect, benchmark, and fine-tune models specifically for academic subjects without vendor lock-in.

---

## 14. License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more details.
