import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { QuizStructure } from '@/types/quiz';

export async function GET() {
  try {
    const quizzesDir = path.join(process.cwd(), 'public', 'quizzes');
    const structure: QuizStructure = {};

    const categories = await fs.readdir(quizzesDir);

    for (const category of categories) {
      const categoryPath = path.join(quizzesDir, category);
      const stat = await fs.stat(categoryPath);

      if (stat.isDirectory()) {
        structure[category] = {};
        const subcategories = await fs.readdir(categoryPath);

        for (const subcategory of subcategories) {
          const subcategoryPath = path.join(categoryPath, subcategory);
          const subcategoryStat = await fs.stat(subcategoryPath);

          if (subcategoryStat.isDirectory()) {
            const files = await fs.readdir(subcategoryPath);
            const jsonFiles = files.filter(file => file.endsWith('.json'));
            structure[category][subcategory] = jsonFiles;
          }
        }
      }
    }

    return NextResponse.json(structure);
  } catch (error) {
    console.error('Error reading quiz structure:', error);
    return NextResponse.json(
      { error: 'Failed to read quiz structure' },
      { status: 500 }
    );
  }
}