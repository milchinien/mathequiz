import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types/user';
import fs from 'fs/promises';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'public', 'data', 'users.json');

async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function GET(request: NextRequest) {
  try {
    const users = await readUsers();
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

    const trimmedName = name.trim();
    const users = await readUsers();

    // Check if user already exists
    const existingUserIndex = users.findIndex(u => u.name === trimmedName);

    if (existingUserIndex >= 0) {
      // Update lastUsed timestamp for existing user
      users[existingUserIndex].lastUsed = new Date().toISOString();
    } else {
      // Add new user
      const newUser: User = {
        name: trimmedName,
        lastUsed: new Date().toISOString()
      };
      users.push(newUser);
    }

    // Sort by lastUsed (most recent first)
    users.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());

    await writeUsers(users);

    const user = users.find(u => u.name === trimmedName)!;
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Valid name is required' }, { status: 400 });
    }

    const users = await readUsers();
    const filteredUsers = users.filter(u => u.name !== name.trim());

    await writeUsers(filteredUsers);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}