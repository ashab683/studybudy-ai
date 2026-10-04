# Contributing to StudyBuddy AI 🤝

Thank you for your interest in contributing to StudyBuddy AI! We welcome contributions to make learning more accessible, interactive, and effective for students worldwide using open-weight local AI.

---

## 🛠️ Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/studybuddy-ai.git
   cd studybuddy-ai
   ```
3. **Install Ollama** and ensure `gemma3:4b` is pulled:
   ```bash
   ollama pull gemma3:4b
   ```
4. **Install dependencies**:
   ```bash
   # Server
   cd server
   npm install

   # Client
   cd ../client
   npm install
   ```

---

## 🚀 Development Guidelines

- **Keep it student-friendly:** Code should remain clean, understandable, and free of unnecessary frameworks.
- **Local AI only:** Do NOT integrate proprietary cloud APIs. Open-weight inference is the foundation of this project.
- **Configurable:** Do not hardcode model names or API paths; use environment variables.
- **Commit Messages:** Use clear, descriptive conventional commits (`feat: ...`, `fix: ...`, `docs: ...`).

---

## 🧪 Testing Your Changes

Before submitting a Pull Request:
1. Verify `GET /api/health` succeeds.
2. Test a sample query through `/api/ai/ask` with your local Ollama instance.
3. Test edge cases: empty input, long input, Ollama offline state.
4. Verify responsive design on both mobile and desktop viewports.

Thank you for building for students! 🎓
