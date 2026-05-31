import { NextResponse } from 'next/server';
import { chatWithGroq, buildTutorSystemPrompt } from '@/lib/groq';

export async function POST(request) {
  try {
    const { messages, subject } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const systemPrompt = buildTutorSystemPrompt(subject);
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const reply = await chatWithGroq(fullMessages);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI Chat error:', error);

    if (error.message?.includes('GROQ_API_KEY')) {
      return NextResponse.json({
        reply: "I'm currently in demo mode. To enable the full AI tutor, configure the GROQ_API_KEY. In the meantime, I can still help you navigate the platform!",
      });
    }

    return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 500 });
  }
}
