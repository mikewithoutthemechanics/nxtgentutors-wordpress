import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'student', 'tutor', 'admin'

    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/ngt/v1';

    // Try fetching from WordPress backend
    try {
      const response = await fetch(`${baseUrl}/dashboard?role=${role}`, {
        headers: {
          'Content-Type': 'application/json',
          // Authorization would go here
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.warn('Backend unavailable, falling back to mock dashboard data');
    }

    // Fallback Mock Data for Headless operation without WordPress running
    if (role === 'student') {
      return NextResponse.json({
        success: true,
        stats: { upcomingSessions: 3, totalHours: 24.5, credits: 'R1,200', achievements: 12 },
        nextSession: { subject: 'Mathematics - Calculus', tutor: 'Dr. Sarah K.', time: 'Tomorrow at 14:00', joinUrl: '/dashboard/student/lessons/1' },
        badges: ['🎓', '🔥', '✨', '🌟']
      });
    } else if (role === 'tutor') {
      return NextResponse.json({
        success: true,
        stats: { earnings: 'R5,650', sessionsCompleted: 15, avgRating: 4.8, activeStudents: 8 },
        nextSession: { subject: 'Physics - Mechanics', student: 'Jason L.', time: 'Today at 16:00', joinUrl: '/dashboard/tutor/lessons/1' },
        pendingPayout: 'R5,650'
      });
    } else if (role === 'admin') {
      return NextResponse.json({
        success: true,
        stats: { monthlyRevenue: 'R125,000', activeUsers: 1450, avgSatisfaction: '96%', activeTutors: 45 },
        systemHealth: { status: 'Optimal', pendingVerifications: 5, activeDisputes: 0 }
      });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
