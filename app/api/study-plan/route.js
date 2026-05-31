import { NextResponse } from 'next/server';
import { chatWithGroq, buildStudyPlanPrompt } from '@/lib/groq';

export async function POST(request) {
  try {
    const { subject, level, weakAreas, hoursPerWeek } = await request.json();

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    const prompt = buildStudyPlanPrompt(subject, level, weakAreas, hoursPerWeek);
    const messages = [
      { role: 'system', content: 'You are an expert educational planner. Return valid JSON only, no markdown fences.' },
      { role: 'user', content: prompt },
    ];

    const reply = await chatWithGroq(messages, { temperature: 0.5, maxTokens: 2048 });

    let plan;
    try {
      plan = JSON.parse(reply);
    } catch {
      plan = { raw: reply };
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Study plan error:', error);
    return NextResponse.json({
      plan: {
        weeks: [
          {
            week: 1,
            title: 'Foundation Review',
            days: [
              { day: 'Monday', tasks: ['Review core concepts', 'Complete diagnostic assessment'] },
              { day: 'Wednesday', tasks: ['Practice problems set A', 'Watch tutorial videos'] },
              { day: 'Friday', tasks: ['Timed practice quiz', 'Review mistakes'] },
            ],
          },
          {
            week: 2,
            title: 'Building Depth',
            days: [
              { day: 'Monday', tasks: ['Advanced concept introduction', 'Worked examples'] },
              { day: 'Wednesday', tasks: ['Problem set B - increasing difficulty', 'Group study session'] },
              { day: 'Friday', tasks: ['Mock test section', 'Self-assessment'] },
            ],
          },
          {
            week: 3,
            title: 'Application & Analysis',
            days: [
              { day: 'Monday', tasks: ['Real-world application problems', 'Past exam questions'] },
              { day: 'Wednesday', tasks: ['Cross-topic integration exercises', 'Peer teaching'] },
              { day: 'Friday', tasks: ['Full-length practice paper', 'Mark and review'] },
            ],
          },
          {
            week: 4,
            title: 'Mastery & Exam Prep',
            days: [
              { day: 'Monday', tasks: ['Weak area intensive review', 'Speed drills'] },
              { day: 'Wednesday', tasks: ['Final mock exam under timed conditions'] },
              { day: 'Friday', tasks: ['Review all mistakes', 'Confidence-building revision'] },
            ],
          },
        ],
        note: 'This is a fallback study plan. Connect the GROQ_API_KEY for AI-personalized plans.',
      },
    });
  }
}
