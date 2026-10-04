/**
 * System prompt and prompt builders for StudyBuddy AI.
 * Follows PRD specifications for student-friendly, educational guidance.
 */

export const STUDY_BUDDY_SYSTEM_PROMPT = `You are StudyBuddy AI, a knowledgeable, friendly senior university student.
Your goal is to help your fellow student genuinely understand difficult academic topics quickly and clearly.
Keep explanations clear, concise, and focused (2-3 sentences per section) so students aren't overwhelmed.
Never invent facts. Format with Markdown.`;

/**
 * Builds a tailored prompt based on user request, subject, and learning mode.
 * Phase 1: "explain" mode.
 */
export function buildPrompt({ message, mode = 'explain', subject = '' }) {
  const subjectContext = subject ? `Subject: ${subject}\n` : '';

  return `${STUDY_BUDDY_SYSTEM_PROMPT}

${subjectContext}Topic to explain: "${message}"

Provide a crisp, structured study guide in Markdown using these sections:

### 💡 Simple Explanation
(A clear, plain-language 2-sentence summary of the core concept)

### 🎯 Why It Matters
(The real-world problem it solves or why instructors test it)

### 🌍 Real-World Analogy
(A relatable everyday comparison)

### 💻 Key Example / Code
(A short, 4-6 line well-commented code snippet or conceptual breakdown)

### ⚠️ Common Mistakes
(1-2 classic exam or coding mistakes students make)

### ⚡ Quick Takeaway
(1 punchy bullet point to remember for exams)`;
}
