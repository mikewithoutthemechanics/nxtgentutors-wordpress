import { NextResponse } from 'next/server';

const MOCK_SESSIONS = [
  { id: 1, subject: 'Mathematics - Calculus', tutor: 'Dr. Sarah K.', student: 'Jane Doe', time: 'Tomorrow at 14:00', status: 'upcoming', joinUrl: '/dashboard/student/lessons/1' },
  { id: 2, subject: 'Physics - Mechanics', tutor: 'David M.', student: 'Jason L.', time: 'Today at 16:00', status: 'upcoming', joinUrl: '/dashboard/tutor/lessons/2' }
];

export async function GET(request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/ngt/v1';
    
    try {
      const response = await fetch(`${baseUrl}/sessions`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.warn('Sessions backend unavailable, using mocks');
    }

    return NextResponse.json(MOCK_SESSIONS);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/ngt/v1';

    try {
      const response = await fetch(`${baseUrl}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.warn('Sessions backend unavailable, creating mock session');
    }

    return NextResponse.json({ success: true, message: 'Mock session created successfully' });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
