import { NextRequest, NextResponse } from 'next/server';
import { QuizSession } from '@/types/user';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    const limit = parseInt(searchParams.get('limit') || '50');

    // In a real app, this would fetch from a database
    // For now, we return an empty array as the frontend uses localStorage
    const sessions: QuizSession[] = [];

    // Filter by user if provided
    const filteredSessions = user
      ? sessions.filter(session => session.user === user)
      : sessions;

    // Apply limit
    const limitedSessions = filteredSessions.slice(0, limit);

    return NextResponse.json(limitedSessions);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session: QuizSession = await request.json();

    // Validate session data
    if (!session.id || !session.user || !session.quiz) {
      return NextResponse.json({ error: 'Invalid session data' }, { status: 400 });
    }

    // In a real app, this would save to a database
    // For now, we just return success as the frontend uses localStorage

    return NextResponse.json({ success: true, id: session.id });
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}