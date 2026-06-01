import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, messages: [], note: 'Message persistence not configured yet. Add Supabase or WordPress endpoint to enable storage.' });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({ ok: true, message: { ...body, id: `msg_${Date.now()}`, createdAt: new Date().toISOString() } });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
