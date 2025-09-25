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
   - `/api/categories` - Full CRUD operations for categories and subcategories (POST, PUT, DELETE)
   - `/api/quiz-management` - CRUD operations for quiz files (PUT, DELETE)
   - `/api/scrape` - Extracts text content from URLs for quiz generation

3. **Core Pages**:
   - Home page (`/`) - Quiz selector interface with adaptive column sizing and edit/delete buttons for all items
   - Quiz page (`/quiz/[...path]`) - Dynamic quiz player with shuffled questions/answers and immediate or summary feedback modes
   - Generate page (`/generate`) - Restructured AI-powered creation interface with type selection (Category/Subcategory/Quiz)
   - Edit page (`/edit`) - Dedicated page for quiz editing and management (placeholder tab added)

4. **Quiz Generation System**:
   - **Creation Type Selection**: Choose between creating categories, subcategories, or quizzes
   - **Content Input**: Text, file upload (TXT/MD), or URL scraping with dark mode support
   - **AI Integration**: OpenAI GPT-4o with structured prompts in `src/prompts/quiz-generation.txt`
   - **Category Management**: Dynamic creation of categories and subcategories
   - **Quiz Preview**: Review generated quiz before saving

5. **Dynamic Shuffling**:
   - **Question Shuffling**: Questions appear in random order each playthrough
   - **Answer Shuffling**: Answer options randomized within each question using Fisher-Yates algorithm
   - **Index Mapping**: Original indices preserved for result tracking

6. **Type System**: Central TypeScript definitions in `src/types/quiz.ts` defining Quiz, Question, Answer, and UserAnswer structures.

7. **Component Architecture**: React components in `src/components/` handle quiz display, generation UI, questions, results, feedback toasts, and CRUD operations.

8. **Dark Mode System**:
   - **Context-Based**: React Context (`DarkModeContext`) with localStorage persistence
   - **System Detection**: Automatic detection of user's system color scheme preference
   - **Navigation Toggle**: Dark mode toggle integrated into TaskBar options dropdown
   - **Comprehensive Styling**: All components support light/dark themes using Tailwind CSS class-based dark mode
   - **Form Compatibility**: All input fields, text areas, and form elements properly styled for dark mode
   - **Smooth Transitions**: CSS transitions for seamless theme switching

9. **Navigation System**:
   - **TaskBar**: Main navigation with "Lernen", "Quiz erstellen", and "Quiz bearbeiten" tabs
   - **Options Dropdown**: Three-dots menu positioned at screen edge with settings and dark mode toggle
   - **Adaptive Layout**: Responsive design with mobile-friendly navigation
   - **Active States**: Visual indicators for current page/section

10. **CRUD Operations**:
    - **Edit/Delete Buttons**: All quiz selector items have inline edit and delete actions
    - **Category Management**: Full CRUD operations for categories and subcategories
    - **Quiz Management**: Edit and delete individual quiz files
    - **Confirmation Dialogs**: Safe deletion with user confirmation (TODO: implement modals)
    - **Inline Editing**: Edit category/subcategory names directly in the interface (TODO: implement)

## Project Structure

The codebase is organized within the `src/` directory as the main Next.js application:
- Working directory for all commands is `/home/tobias/src/mathequiz/src/`
- Quiz content files are in `public/quizzes/` with hierarchical category organization
- Next.js App Router structure with API routes and dynamic routing
- AI prompts stored in `prompts/` directory
- Environment variables in `.env.local` (requires OPENAI_API_KEY for quiz generation)

## Quiz Generation Features

- **Creation Type Selection**: Users choose between creating categories, subcategories, or quizzes
- **AI-Powered**: Uses OpenAI GPT-4o to generate quiz questions from any text content
- **Multiple Input Methods**: Direct text input, file upload (TXT/MD), or URL scraping with full dark mode support
- **Flexible Configuration**: Customizable question count, answer options, single/multiple choice, target audience
- **Dynamic Categories**: Create new quiz categories and subcategories on-the-fly
- **Preview System**: Review and edit generated quizzes before saving
- **Automatic Shuffling**: Both questions and answers are randomized for unpredictable quiz experiences

## UI/UX Features

- **Adaptive Quiz Selector**: Dynamic column sizing that expands the active selection step
- **Edit/Delete Actions**: Inline buttons for managing all categories, subcategories, and quizzes
- **Comprehensive Dark Mode**: Full dark mode support across all components and form elements
- **Enhanced Navigation**: TaskBar with three main sections and integrated options menu
- **Mobile Responsive**: Fully responsive design that works on all screen sizes
- **Visual Feedback**: Hover effects, transitions, and clear visual states for all interactive elements