const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function chatWithGroq(messages, { model = 'llama-3.3-70b-versatile', temperature = 0.7, maxTokens = 1024 } = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export function buildTutorSystemPrompt(subject) {
  return `You are NextGen Tutors AI — a world-class ${subject || ''} tutor for South African students (Grade 8-12 and university).
Guidelines:
- Be encouraging, patient, and clear.
- Explain concepts step-by-step with examples relevant to the South African CAPS curriculum.
- Use Socratic questioning to help students think critically.
- If a student is stuck, give hints before full answers.
- Format math with clear notation. Use markdown for structure.
- Keep responses concise but thorough.
- When appropriate, suggest practice problems.
- Always motivate the student.`;
}

export function buildStudyPlanPrompt(subject, level, weakAreas, hoursPerWeek) {
  return `Create a personalized 4-week study plan for a ${level} student studying ${subject}.
Weak areas: ${weakAreas || 'general improvement needed'}.
Available study time: ${hoursPerWeek || 5} hours per week.
Format the plan as a structured weekly schedule with:
- Specific topics to cover each day
- Recommended resources (textbooks, videos, practice problems)
- Milestones and self-assessment checkpoints
- Tips for the South African CAPS curriculum
Return the plan as structured JSON with weeks array, each containing days with tasks.`;
}
