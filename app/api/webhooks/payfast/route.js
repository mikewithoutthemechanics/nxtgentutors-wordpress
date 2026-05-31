import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Read ITN payload from PayFast
    const body = await request.text();
    
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/ngt/v1';

    // Forward ITN payload to WordPress backend
    const response = await fetch(`${baseUrl}/webhooks/payfast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to process webhook' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
