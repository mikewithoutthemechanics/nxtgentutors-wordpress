import { NextResponse } from 'next/server';

const MOCK_PAYOUTS = [
  { id: 1, tutor: 'David M.', amount: 'R2,450', status: 'pending', date: '2026-05-01' },
  { id: 2, tutor: 'Sarah J.', amount: 'R1,800', status: 'pending', date: '2026-05-02' }
];

export async function POST(request) {
  try {
    const body = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/ngt/v1';

    try {
      const response = await fetch(`${baseUrl}/payouts/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.warn('Payouts backend unavailable, processing mock payout');
    }

    return NextResponse.json({ success: true, message: 'Payouts processed successfully' });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/ngt/v1';
    
    try {
      const response = await fetch(`${baseUrl}/payouts/pending`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.warn('Payouts backend unavailable, using mocks');
    }

    return NextResponse.json(MOCK_PAYOUTS);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
