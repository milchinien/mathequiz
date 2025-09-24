import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Update/rename quiz
export async function PUT(request: NextRequest) {
  try {
    const { category, subcategory, oldName, newName, quizData } = await request.json();

    if (!category || !subcategory || !oldName) {
      return NextResponse.json(
        { error: 'Fehlende Parameter' },
        { status: 400 }
      );
    }

    const quizzesDir = path.join(process.cwd(), 'public', 'quizzes');
    const subcategoryPath = path.join(quizzesDir, category, subcategory);

    if (newName && newName !== oldName) {
      // Rename quiz file
      const oldFilePath = path.join(subcategoryPath, oldName);
      const newFilePath = path.join(subcategoryPath, newName);

      try {
        await fs.rename(oldFilePath, newFilePath);
      } catch (error) {
        console.error('Error renaming quiz file:', error);
        return NextResponse.json(
          { error: 'Fehler beim Umbenennen der Quiz-Datei' },
          { status: 500 }
        );
      }
    }

    // Update quiz content if quizData is provided
    if (quizData) {
      const fileName = newName || oldName;
      const filePath = path.join(subcategoryPath, fileName);

      try {
        await fs.writeFile(filePath, JSON.stringify(quizData, null, 2));
      } catch (error) {
        console.error('Error updating quiz content:', error);
        return NextResponse.json(
          { error: 'Fehler beim Aktualisieren des Quiz-Inhalts' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Quiz' },
      { status: 500 }
    );
  }
}

// Delete quiz
export async function DELETE(request: NextRequest) {
  try {
    const { category, subcategory, filename } = await request.json();

    if (!category || !subcategory || !filename) {
      return NextResponse.json(
        { error: 'Fehlende Parameter' },
        { status: 400 }
      );
    }

    const quizzesDir = path.join(process.cwd(), 'public', 'quizzes');
    const filePath = path.join(quizzesDir, category, subcategory, filename);

    try {
      await fs.unlink(filePath);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      return NextResponse.json(
        { error: 'Fehler beim Löschen des Quiz' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Quiz' },
      { status: 500 }
    );
  }
}