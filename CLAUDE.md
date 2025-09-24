# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

From the `src/` directory:

- **Development**: `npm run dev` - Starts Next.js development server at http://localhost:3000
- **Build**: `npm run build` - Creates production build
- **Production**: `npm run start` - Starts production server
- **Linting**: `npm run lint` - Runs ESLint

## Architecture

This is a **Next.js 15** quiz application with TypeScript and Tailwind CSS v3. The application serves math quizzes from JSON files with two feedback modes: immediate and summary. Features **AI-powered quiz generation** using OpenAI, dynamic content shuffling, and **comprehensive dark mode support**.

### Key Components

1. **Quiz Data Structure**: Quiz JSON files stored in `src/public/quizzes/{category}/{subcategory}/` containing German-language math questions with single/multiple choice answers.

2. **API Routes**:
   - `/api/quizzes` - Returns the quiz directory structure
   - `/api/quiz/[...path]` - Fetches specific quiz JSON files
   - `/api/generate-quiz` - AI-powered quiz generation using OpenAI
   - `/api/save-quiz` - Saves generated quizzes to file system
   - `/api/categories` - Creates new quiz categories and subcategories
   - `/api/scrape` - Extracts text content from URLs for quiz generation

3. **Core Pages**:
   - Home page (`/`) - Quiz selector interface with link to quiz generation
   - Quiz page (`/quiz/[...path]`) - Dynamic quiz player with shuffled questions/answers and immediate or summary feedback modes
   - Generate page (`/generate`) - AI-powered quiz creation interface

4. **Quiz Generation System**:
   - **Content Input**: Text, file upload (TXT/MD), or URL scraping
   - **AI Integration**: OpenAI GPT-4o with structured prompts in `src/prompts/quiz-generation.txt`
   - **Category Management**: Dynamic creation of categories and subcategories
   - **Quiz Preview**: Review generated quiz before saving

5. **Dynamic Shuffling**:
   - **Question Shuffling**: Questions appear in random order each playthrough
   - **Answer Shuffling**: Answer options randomized within each question using Fisher-Yates algorithm
   - **Index Mapping**: Original indices preserved for result tracking

6. **Type System**: Central TypeScript definitions in `src/types/quiz.ts` defining Quiz, Question, Answer, and UserAnswer structures.

7. **Component Architecture**: React components in `src/components/` handle quiz display, generation UI, questions, results, and feedback toasts.

8. **Dark Mode System**:
   - **Context-Based**: React Context (`DarkModeContext`) with localStorage persistence
   - **System Detection**: Automatic detection of user's system color scheme preference
   - **Toggle Component**: Fixed-position dark mode toggle with sun/moon icons
   - **Comprehensive Styling**: All components support light/dark themes using Tailwind CSS class-based dark mode
   - **Smooth Transitions**: CSS transitions for seamless theme switching

## Project Structure

The codebase is organized within the `src/` directory as the main Next.js application:
- Working directory for all commands is `/home/tobias/src/mathequiz/src/`
- Quiz content files are in `public/quizzes/` with hierarchical category organization
- Next.js App Router structure with API routes and dynamic routing
- AI prompts stored in `prompts/` directory
- Environment variables in `.env.local` (requires OPENAI_API_KEY for quiz generation)

## Quiz Generation Features

- **AI-Powered**: Uses OpenAI GPT-4o to generate quiz questions from any text content
- **Multiple Input Methods**: Direct text input, file upload (TXT/MD), or URL scraping
- **Flexible Configuration**: Customizable question count, answer options, single/multiple choice, target audience
- **Dynamic Categories**: Create new quiz categories and subcategories on-the-fly
- **Preview System**: Review and edit generated quizzes before saving
- **Automatic Shuffling**: Both questions and answers are randomized for unpredictable quiz experiences