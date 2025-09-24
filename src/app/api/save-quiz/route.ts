import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Quiz } from '@/types/quiz';

export async function POST(request: NextRequest) {
  try {
    const { quiz, category, subcategory, filename } = await request.json();

    if (!quiz || !category || !subcategory || !filename) {
      return NextResponse.json(
        { error: 'Unvollständige Daten' },
        { status: 400 }
      );
    }

    // Validate quiz structure
    if (!quiz.Thema || !quiz.Fragen || !Array.isArray(quiz.Fragen)) {
      return NextResponse.json(
        { error: 'Ungültiges Quiz-Format' },
        { status: 400 }
      );
    }

    // Create safe filename
    let safeFilename = filename
      .toLowerCase()
      .replace(/[^a-z0-9äöüß\-\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!safeFilename) {
      safeFilename = 'quiz-' + Date.now();
    }

    if (!safeFilename.endsWith('.json')) {
      safeFilename += '.json';
    }

    // Create directory path
    const quizPath = path.join(
      process.cwd(),
      'public',
      'quizzes',
      category,
      subcategory
    );

    // Ensure directory exists
    await fs.mkdir(quizPath, { recursive: true });

    // Check if file already exists and create unique name if needed
    const fullPath = path.join(quizPath, safeFilename);
    let finalFilename = safeFilename;
    let counter = 1;

    try {
      await fs.access(fullPath);
      // File exists, create unique name
      const nameWithoutExt = safeFilename.replace('.json', '');
      while (true) {
        const testName = `${nameWithoutExt}-${counter}.json`;
        const testPath = path.join(quizPath, testName);
        try {
          await fs.access(testPath);
          counter++;
        } catch {
          finalFilename = testName;
          break;
        }
      }
    } catch {
      // File doesn't exist, use original name
    }

    const finalPath = path.join(quizPath, finalFilename);

    // Save quiz
    await fs.writeFile(finalPath, JSON.stringify(quiz, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      filename: finalFilename,
      path: `${category}/${subcategory}/${finalFilename}`
    });
  } catch (error) {
    console.error('Error saving quiz:', error);
    return NextResponse.json(
      { error: 'Fehler beim Speichern des Quiz' },
      { status: 500 }
    );
  }
}