import { NextResponse } from 'next/server';

const MOCK_TUTORS = [
  {
    id: 1,
    name: "David M.",
    subjects: ["Mathematics", "Physics"],
    grade: "Grade 10-12",
    rating: 5.0,
    reviews: 42,
    sessions: 150,
    rate: 450,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    province: "Gauteng"
  },
  {
    id: 2,
    name: "Sarah J.",
    subjects: ["English", "History"],
    grade: "Grade 8-12",
    rating: 4.9,
    reviews: 28,
    sessions: 85,
    rate: 400,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    province: "Western Cape"
  },
  {
    id: 3,
    name: "Michael K.",
    subjects: ["Chemistry", "Biology"],
    grade: "Grade 11-12",
    rating: 4.8,
    reviews: 35,
    sessions: 120,
    rate: 500,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    province: "KwaZulu-Natal"
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/ngt/v1';
    let fetchUrl = `${baseUrl}/tutors/search`;
    
    if (subject) {
      fetchUrl += `?subject=${encodeURIComponent(subject)}`;
    }
    
    try {
      const response = await fetch(fetchUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.warn('Backend unavailable, falling back to mock tutors data');
    }

    // Filter mocks if subject is provided
    const tutors = subject 
      ? MOCK_TUTORS.filter(t => t.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase())))
      : MOCK_TUTORS;

    return NextResponse.json(tutors);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
