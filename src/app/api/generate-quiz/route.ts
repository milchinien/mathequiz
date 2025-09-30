import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { Quiz } from '@/types/quiz';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const content = formData.get('content') as string | null;
    const configString = formData.get('config') as string;

    if (!configString) {
      return NextResponse.json(
        { error: 'Konfiguration fehlt' },
        { status: 400 }
      );
    }

    const config = JSON.parse(configString);

    if (!content && !file) {
      return NextResponse.json(
        { error: 'Kein Inhalt bereitgestellt' },
        { status: 400 }
      );
    }

    // Determine how many questions to generate (use poolSize if > 0, otherwise questionCount)
    const questionsToGenerate = config.poolSize && config.poolSize > 0 ? config.poolSize : config.questionCount;

    // Load prompt template
    const promptTemplatePath = path.join(process.cwd(), 'prompts', 'quiz-generation.txt');
    let promptTemplate = await fs.readFile(promptTemplatePath, 'utf-8');

    // Replace placeholders (use questionsToGenerate for actual generation)
    promptTemplate = promptTemplate
      .replace('{{TARGET_AUDIENCE}}', config.targetAudience)
      .replace('{{QUESTION_COUNT}}', questionsToGenerate.toString())
      .replace(/{{ANSWERS_PER_QUESTION}}/g, config.answersPerQuestion.toString())
      .replace('{{ANSWER_TYPE}}', config.allowMultipleAnswers ? 'MultipleAnswer (Mehrfachauswahl möglich)' : 'SingleAnswer (nur eine richtige Antwort)')
      .replace(/{{QUIZ_TITLE}}/g, config.quizTitle);

    let finalContent = content || '';

    // If file is provided, we'll handle it for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (file) {
      // Convert file to base64 for OpenAI
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (file.type === 'application/pdf') {
        // For PDFs, we'll use OpenAI's file handling
        // Note: This requires using the Assistants API or vision for images
        // For now, we'll send as text if possible
        return NextResponse.json(
          { error: 'PDF-Direktverarbeitung wird in Kürze implementiert. Bitte verwenden Sie vorerst Text oder URL.' },
          { status: 400 }
        );
      } else {
        // For text files, read content
        finalContent = buffer.toString('utf-8');
      }
    }

    // Replace content placeholder
    promptTemplate = promptTemplate.replace('{{CONTENT}}', finalContent);

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Du bist ein Experte für die Erstellung von Lernquizzes. Antworte NUR mit validem JSON, ohne zusätzlichen Text."
        },
        {
          role: "user",
          content: promptTemplate
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const quizContent = completion.choices[0]?.message?.content;

    if (!quizContent) {
      throw new Error('Keine Antwort von OpenAI erhalten');
    }

    // Parse and validate JSON
    const quiz: Quiz = JSON.parse(quizContent);

    // Basic validation
    if (!quiz.Thema || !quiz.Fragen || !Array.isArray(quiz.Fragen)) {
      throw new Error('Ungültiges Quiz-Format');
    }

    // Add pool configuration if poolSize is set
    if (config.poolSize && config.poolSize > 0) {
      quiz.PoolConfig = {
        poolSize: config.poolSize,
        questionsPerGame: config.questionCount
      };
    }

    // Validate question count (should match questionsToGenerate, not questionCount)
    if (quiz.Fragen.length !== questionsToGenerate) {
      // Adjust if needed
      if (quiz.Fragen.length > questionsToGenerate) {
        quiz.Fragen = quiz.Fragen.slice(0, questionsToGenerate);
      }
    }

    // Validate answer count and types
    for (const frage of quiz.Fragen) {
      if (frage.Antworten.length !== config.answersPerQuestion) {
        // Adjust if needed
        if (frage.Antworten.length > config.answersPerQuestion) {
          frage.Antworten = frage.Antworten.slice(0, config.answersPerQuestion);
        }
      }

      // Set correct type
      frage.Typ = config.allowMultipleAnswers ? 'MultipleAnswer' : 'SingleAnswer';

      // Ensure at least one correct answer
      const hasCorrect = frage.Antworten.some(a => a.Richtig);
      if (!hasCorrect && frage.Antworten.length > 0) {
        frage.Antworten[0].Richtig = true;
        frage.Antworten[0].Kommentar = "Dies ist die richtige Antwort.";
      }

      // For SingleAnswer, ensure only one correct answer
      if (frage.Typ === 'SingleAnswer') {
        let foundFirst = false;
        for (const antwort of frage.Antworten) {
          if (antwort.Richtig) {
            if (foundFirst) {
              antwort.Richtig = false;
            } else {
              foundFirst = true;
            }
          }
        }
      }
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Quiz-Generierung fehlgeschlagen' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';