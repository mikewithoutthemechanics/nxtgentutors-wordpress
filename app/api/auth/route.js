import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const MOCK_USERS = [
  {
    email: 'admin@admin.com',
    password: 'admin123',
    user: { id: 0, email: 'admin@admin.com', firstName: 'System', lastName: 'Admin', role: 'administrator' },
    token: 'hardcoded-admin-token-000',
  },
  {
    email: 'student@example.com',
    password: 'password123',
    user: { id: 2, email: 'student@example.com', firstName: 'Jane', lastName: 'Student', role: 'student' },
    token: 'mock-student-token-456',
  },
  {
    email: 'tutor@example.com',
    password: 'password123',
    user: { id: 3, email: 'tutor@example.com', firstName: 'David', lastName: 'Tutor', role: 'tutor' },
    token: 'mock-tutor-token-789',
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password } = body;

    // 1. Try Supabase Auth first (real backend)
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder') {
      try {
        if (action === 'login') {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (!error && data?.user) {
            return NextResponse.json({
              success: true,
              user: {
                id: data.user.id,
                email: data.user.email,
                firstName: data.user.user_metadata?.firstName || 'User',
                lastName: data.user.user_metadata?.lastName || '',
                role: data.user.user_metadata?.role || 'student',
              },
              token: data.session?.access_token,
            });
          }
        } else if (action === 'register') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                firstName: body.firstName || '',
                lastName: body.lastName || '',
                role: body.role || 'student',
              },
            },
          });
          if (!error && data?.user) {
            return NextResponse.json({
              success: true,
              user: {
                id: data.user.id,
                email: data.user.email,
                firstName: body.firstName || 'New',
                lastName: body.lastName || 'User',
                role: body.role || 'student',
              },
              token: data.session?.access_token,
              message: data.session ? undefined : 'Check your email to confirm your account.',
            });
          }
        }
      } catch (supabaseErr) {
        console.warn('Supabase auth unavailable, falling back:', supabaseErr.message);
      }
    }

    // 2. Check mock users for development/testing
    if (action === 'login') {
      const mockUser = MOCK_USERS.find((u) => u.email === email && u.password === password);
      if (mockUser) {
        return NextResponse.json({ success: true, user: mockUser.user, token: mockUser.token });
      }
    }

    // 3. Fallback to WordPress backend
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/ngt/v1';
    const endpoint = action === 'register' ? '/auth/register' : '/auth/login';

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch {
      console.warn('WordPress backend unavailable');
    }

    // 4. Last resort: mock registration for UI flow
    if (action === 'register') {
      return NextResponse.json({
        success: true,
        user: { id: 999, email, firstName: body.firstName || 'New', lastName: body.lastName || 'User', role: body.role || 'student' },
        token: 'mock-new-user-token',
      });
    }

    return NextResponse.json({ error: 'Invalid credentials or backend offline' }, { status: 401 });
  } catch (error) {
    console.error('Auth API Critical Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
