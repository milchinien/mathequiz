import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { category, subcategory } = await request.json();

    if (!category) {
      return NextResponse.json(
        { error: 'Kategorie fehlt' },
        { status: 400 }
      );
    }

    const quizzesDir = path.join(process.cwd(), 'public', 'quizzes');
    const categoryPath = path.join(quizzesDir, category);

    // Create category directory if it doesn't exist
    try {
      await fs.mkdir(categoryPath, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // If subcategory is provided, create it as well
    if (subcategory) {
      const subcategoryPath = path.join(categoryPath, subcategory);
      try {
        await fs.mkdir(subcategoryPath, { recursive: true });
      } catch (error) {
        // Directory might already exist, that's fine
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Kategorie' },
      { status: 500 }
    );
  }
}