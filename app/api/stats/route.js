import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/ngt/v1';
    
    try {
      const response = await fetch(`${baseUrl}/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.warn('Backend unavailable, falling back to mock stats data');
    }

    // Fallback Mock Stats for landing page
    return NextResponse.json({
      tutors: "500+",
      rating: "4.9/5",
      sessions: "10k+"
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
