import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Create category or subcategory
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

// Update/rename category or subcategory
export async function PUT(request: NextRequest) {
  try {
    const { oldName, newName, type, category } = await request.json();

    if (!oldName || !newName || !type) {
      return NextResponse.json(
        { error: 'Fehlende Parameter' },
        { status: 400 }
      );
    }

    const quizzesDir = path.join(process.cwd(), 'public', 'quizzes');

    if (type === 'category') {
      const oldPath = path.join(quizzesDir, oldName);
      const newPath = path.join(quizzesDir, newName);

      try {
        await fs.rename(oldPath, newPath);
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error renaming category:', error);
        return NextResponse.json(
          { error: 'Fehler beim Umbenennen der Kategorie' },
          { status: 500 }
        );
      }
    } else if (type === 'subcategory' && category) {
      const oldPath = path.join(quizzesDir, category, oldName);
      const newPath = path.join(quizzesDir, category, newName);

      try {
        await fs.rename(oldPath, newPath);
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error renaming subcategory:', error);
        return NextResponse.json(
          { error: 'Fehler beim Umbenennen der Unterkategorie' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Ungültiger Typ oder fehlende Kategorie' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren' },
      { status: 500 }
    );
  }
}

// Delete category or subcategory
export async function DELETE(request: NextRequest) {
  try {
    const { name, type, category } = await request.json();

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Fehlende Parameter' },
        { status: 400 }
      );
    }

    const quizzesDir = path.join(process.cwd(), 'public', 'quizzes');

    if (type === 'category') {
      const categoryPath = path.join(quizzesDir, name);

      try {
        await fs.rm(categoryPath, { recursive: true });
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
          { error: 'Fehler beim Löschen der Kategorie' },
          { status: 500 }
        );
      }
    } else if (type === 'subcategory' && category) {
      const subcategoryPath = path.join(quizzesDir, category, name);

      try {
        await fs.rm(subcategoryPath, { recursive: true });
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        return NextResponse.json(
          { error: 'Fehler beim Löschen der Unterkategorie' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Ungültiger Typ oder fehlende Kategorie' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error deleting:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen' },
      { status: 500 }
    );
  }
}