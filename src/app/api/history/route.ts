import { NextRequest, NextResponse } from 'next/server';
import { QuizSession } from '@/types/user';
import fs from 'fs/promises';
import path from 'path';

const HISTORY_DIR = path.join(process.cwd(), 'public', 'data', 'history');

function getUserHistoryFile(username: string): string {
  // Create safe filename from username
  const safeUsername = username
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return path.join(HISTORY_DIR, `${safeUsername}.json`);
}

async function readUserHistory(username: string): Promise<QuizSession[]> {
  try {
    const filePath = getUserHistoryFile(username);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

async function writeUserHistory(username: string, sessions: QuizSession[]): Promise<void> {
  const filePath = getUserHistoryFile(username);
  await fs.writeFile(filePath, JSON.stringify(sessions, null, 2), 'utf-8');
}

async function getAllHistoryFiles(): Promise<string[]> {
  try {
    const files = await fs.readdir(HISTORY_DIR);
    return files.filter(file => file.endsWith('.json'));
  } catch (error) {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    const limit = parseInt(searchParams.get('limit') || '1000');

    let sessions: QuizSession[] = [];

    if (user) {
      // Get history for specific user
      sessions = await readUserHistory(user);
    } else {
      // Get all history from all users
      const historyFiles = await getAllHistoryFiles();
      for (const file of historyFiles) {
        const username = file.replace('.json', '');
        const userSessions = await readUserHistory(username);
        sessions.push(...userSessions);
      }
      // Sort by timestamp (most recent first)
      sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    // Apply limit
    const limitedSessions = sessions.slice(0, limit);

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

    // Read existing history for user
    const history = await readUserHistory(session.user);

    // Add new session at the beginning (most recent first)
    history.unshift(session);

    // Keep only the latest 1000 sessions per user
    const limitedHistory = history.slice(0, 1000);

    // Write back to file
    await writeUserHistory(session.user, limitedHistory);

    return NextResponse.json({ success: true, id: session.id });
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');
    const username = searchParams.get('user');

    if (!sessionId || !username) {
      return NextResponse.json({ error: 'Session ID and username required' }, { status: 400 });
    }

    // Read user history
    const history = await readUserHistory(username);

    // Filter out the session to delete
    const filteredHistory = history.filter(session => session.id !== sessionId);

    // Write back to file
    await writeUserHistory(username, filteredHistory);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}