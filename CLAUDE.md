# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

From the `src/` directory:

- **Development**: `npm run dev` - Starts Next.js development server with Turbopack at http://localhost:3000
- **Build**: `npm run build` - Creates production build with Turbopack
- **Production**: `npm run start` - Starts production server
- **Linting**: `npm run lint` - Runs ESLint

## Architecture

This is a **Next.js 15** quiz application with TypeScript and Tailwind CSS v4. The application serves math quizzes from JSON files with two feedback modes: immediate and summary.

### Key Components

1. **Quiz Data Structure**: Quiz JSON files stored in `src/public/quizzes/{category}/{subcategory}/` containing German-language math questions with single/multiple choice answers.

2. **API Routes**:
   - `/api/quizzes` - Returns the quiz directory structure
   - `/api/quiz/[...path]` - Fetches specific quiz JSON files

3. **Core Pages**:
   - Home page (`/`) - Quiz selector interface
   - Quiz page (`/quiz/[...path]`) - Dynamic quiz player with immediate or summary feedback modes

4. **Type System**: Central TypeScript definitions in `src/types/quiz.ts` defining Quiz, Question, Answer, and UserAnswer structures.

5. **Component Architecture**: React components in `src/components/` handle quiz display, questions, results, and feedback toasts.

## Project Structure

The codebase is organized within the `src/` directory as the main Next.js application:
- Working directory for all commands is `/home/tobias/src/mathequiz/src/`
- Quiz content files are in `public/quizzes/` with hierarchical category organization
- Next.js App Router structure with API routes and dynamic routing