import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types/user';

export async function GET(request: NextRequest) {
  try {
    // In a real app, this would fetch from a database
    // For now, we return an empty array as the frontend uses localStorage
    const users: User[] = [];

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Valid name is required' }, { status: 400 });
    }

    // In a real app, this would save to a database
    // For now, we just return success as the frontend uses localStorage
    const user: User = {
      name: name.trim(),
      lastUsed: new Date().toISOString()
    };

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}