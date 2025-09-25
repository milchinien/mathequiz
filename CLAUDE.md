# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

From the `src/` directory:

- **Development**: `npm run dev` - Starts Next.js development server at http://localhost:3000
- **Build**: `npm run build` - Creates production build
- **Production**: `npm run start` - Starts production server
- **Linting**: `npm run lint` - Runs ESLint

## Architecture

This is a **Next.js 15** quiz application with TypeScript and Tailwind CSS v3. The application serves math quizzes from JSON files with two feedback modes: immediate and summary. Features **AI-powered quiz generation** using OpenAI, dynamic content shuffling, **comprehensive dark mode support**, and **full user authentication with quiz history tracking**.

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
   - `/api/users` - User management and authentication endpoints
   - `/api/history` - Quiz session history management

3. **Core Pages**:
   - Home page (`/`) - Protected quiz selector interface with user welcome message and adaptive column sizing
   - Quiz page (`/quiz/[...path]`) - Protected dynamic quiz player with history tracking and shuffled questions/answers
   - Generate page (`/generate`) - Protected AI-powered creation interface with type selection (Category/Subcategory/Quiz)
   - Edit page (`/edit`) - Protected page for quiz editing and management
   - Login page (`/login`) - User authentication with recent users and new user creation
   - History page (`/history`) - Personal quiz session history and performance tracking
   - Profile page (`/profile`) - User profile management and statistics

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

6. **User Authentication & History System**:
   - **Context-Based Authentication**: React Context (`UserContext`) with localStorage persistence
   - **Session Management**: 4-hour sessions with automatic expiry and periodic validation
   - **Multi-User Support**: Multiple user profiles with quick switching capability
   - **Protected Routes**: `useProtectedRoute` hook for automatic login redirection
   - **Quiz History Tracking**: Comprehensive session recording with `HistoryContext`
   - **Performance Analytics**: Score tracking, duration measurement, and question-level analysis
   - **User Management**: Add, remove, and switch between user profiles

7. **Type System**: Central TypeScript definitions including:
   - `src/types/quiz.ts` - Quiz, Question, Answer, and UserAnswer structures
   - `src/types/user.ts` - User, UserSession, QuizSession, and SessionQuestion interfaces

8. **Component Architecture**: React components in `src/components/` handle quiz display, generation UI, questions, results, feedback toasts, user authentication, and CRUD operations.

9. **Dark Mode System**:
   - **Context-Based**: React Context (`DarkModeContext`) with localStorage persistence
   - **System Detection**: Automatic detection of user's system color scheme preference
   - **Navigation Toggle**: Dark mode toggle integrated into TaskBar options dropdown
   - **Comprehensive Styling**: All components support light/dark themes using Tailwind CSS class-based dark mode
   - **Form Compatibility**: All input fields, text areas, and form elements properly styled for dark mode
   - **Smooth Transitions**: CSS transitions for seamless theme switching

10. **Navigation System**:
    - **TaskBar**: Main navigation with "Lernen", "Quiz erstellen", and "Quiz bearbeiten" tabs
    - **Options Dropdown**: Three-dots menu with user management, dark mode toggle, and logout functionality
    - **User Profile**: Integrated user display with profile access and switching options
    - **Adaptive Layout**: Responsive design with mobile-friendly navigation
    - **Active States**: Visual indicators for current page/section

11. **CRUD Operations**:
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

## User Authentication Features

- **Simple Login System**: No passwords required - users identify themselves by username
- **Multi-User Support**: Support for multiple users on the same device with quick switching
- **Session Management**: Automatic 4-hour sessions with periodic validation and auto-logout
- **Recent Users**: Quick access to recently used accounts on login screen
- **Protected Routes**: All main application features require authentication
- **User Switching**: Easy switching between different user accounts without full logout

## Quiz History & Analytics

- **Comprehensive Session Tracking**: Every quiz attempt is automatically recorded with detailed metadata
- **Performance Analytics**: Track correct answers, total questions, percentage scores, and completion time
- **Question-Level Analysis**: Individual question tracking with user answers vs. correct answers
- **User-Specific History**: Each user maintains their own separate quiz history
- **Session Persistence**: History stored in localStorage with 1000-session limit for performance
- **Timeline View**: Chronological history with quiz details, scores, and replay capability

## UI/UX Features

- **Adaptive Quiz Selector**: Dynamic column sizing that expands the active selection step
- **Edit/Delete Actions**: Inline buttons for managing all categories, subcategories, and quizzes
- **Comprehensive Dark Mode**: Full dark mode support across all components and form elements
- **Enhanced Navigation**: TaskBar with three main sections and integrated options menu
- **User Profile Integration**: Welcome messages and user avatars throughout the interface
- **Mobile Responsive**: Fully responsive design that works on all screen sizes
- **Visual Feedback**: Hover effects, transitions, and clear visual states for all interactive elements
- **Loading States**: Proper loading indicators during authentication and page transitions