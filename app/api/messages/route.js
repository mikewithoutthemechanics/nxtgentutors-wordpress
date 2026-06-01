import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(request) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');
  if (!supabase) {
    return NextResponse.json({ ok: true, messages: [], note: 'Supabase not configured; using empty fallback.' });
  }
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(200);
  if (error) {
    return NextResponse.json({ ok: true, messages: [] });
  }
  return NextResponse.json({ ok: true, messages: data || [] });
}

export async function POST(request) {
  const supabase = getSupabase();
  try {
    const body = await request.json();
    if (supabase) {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ sender_id: body.senderId || null, receiver_id: body.receiverId || null, body: body.body || '', created_at: new Date().toISOString() }])
        .select('*')
        .single();
      if (!error && data) {
        return NextResponse.json({ ok: true, message: data });
      }
    }
    return NextResponse.json({ ok: true, message: { ...body, id: `local_${Date.now()}`, createdAt: new Date().toISOString() } });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
