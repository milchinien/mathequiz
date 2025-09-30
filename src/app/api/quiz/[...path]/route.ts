import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Quiz } from '@/types/quiz';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathParts } = await params;
    if (pathParts.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid path format' },
        { status: 400 }
      );
    }

    const [category, subcategory, filename] = pathParts;
    const filePath = path.join(
      process.cwd(),
      'public',
      'quizzes',
      category,
      subcategory,
      filename
    );

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const quiz: Quiz = JSON.parse(fileContent);

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error reading quiz file:', error);
    return NextResponse.json(
      { error: 'Failed to read quiz file' },
      { status: 500 }
    );
  }
}