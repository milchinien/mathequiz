'use client';

import { Question, Answer } from '@/types/quiz';
import { useState, useEffect, useMemo } from 'react';
import FeedbackToast from './FeedbackToast';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  mode: 'immediate' | 'summary';
  onAnswer: (selectedAnswers: number[], isCorrect: boolean, feedbackMessage?: string) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

interface ShuffledAnswer extends Answer {
  originalIndex: number;
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  mode,
  onAnswer,
  onNext,
  isLastQuestion
}: QuizQuestionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastIsCorrect, setToastIsCorrect] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastKey, setToastKey] = useState(0);

  // Shuffle answers once per question
  const shuffledAnswers = useMemo<ShuffledAnswer[]>(() => {
    const answersWithIndex = question.Antworten.map((answer, index) => ({
      ...answer,
      originalIndex: index
    }));

    // Fisher-Yates shuffle algorithm
    const shuffled = [...answersWithIndex];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, [question, questionNumber]); // Re-shuffle when question changes

  useEffect(() => {
    setSelectedAnswers([]);
    setSubmitted(false);
    setShowToast(false);
    setToastKey(prev => prev + 1);
  }, [questionNumber]);

  const handleAnswerSelect = (index: number) => {
    if (submitted) return;

    if (question.Typ === 'SingleAnswer') {
      setSelectedAnswers([index]);
    } else {
      if (selectedAnswers.includes(index)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== index));
      } else {
        setSelectedAnswers([...selectedAnswers, index]);
      }
    }
  };

  const checkAnswer = () => {
    // Convert shuffled indices back to original indices for checking correctness
    const originalSelectedIndices = selectedAnswers.map(shuffledIndex =>
      shuffledAnswers[shuffledIndex].originalIndex
    );

    const isCorrect = originalSelectedIndices.every(index =>
      question.Antworten[index].Richtig
    ) && originalSelectedIndices.length === question.Antworten.filter(a => a.Richtig).length;

    return isCorrect;
  };

  const handleSubmit = () => {
    if (selectedAnswers.length === 0) return;

    const isCorrect = checkAnswer();
    setSubmitted(true);

    if (mode === 'immediate') {
      // Convert shuffled indices back to original indices
      const originalSelectedIndices = selectedAnswers.map(shuffledIndex =>
        shuffledAnswers[shuffledIndex].originalIndex
      );

      const wrongAnswers = selectedAnswers.filter(shuffledIndex =>
        !shuffledAnswers[shuffledIndex].Richtig
      );

      const feedbackMessage = wrongAnswers.length > 0
        ? shuffledAnswers[wrongAnswers[0]].Kommentar
        : selectedAnswers.length > 0
        ? shuffledAnswers[selectedAnswers[0]].Kommentar
        : '';

      setToastIsCorrect(isCorrect);
      setToastMessage(feedbackMessage);
      setShowToast(true);

      // Pass original indices to maintain compatibility with existing system
      onAnswer(originalSelectedIndices, isCorrect, feedbackMessage);
    } else {
      // Convert shuffled indices back to original indices
      const originalSelectedIndices = selectedAnswers.map(shuffledIndex =>
        shuffledAnswers[shuffledIndex].originalIndex
      );
      onAnswer(originalSelectedIndices, isCorrect);
    }
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            Frage {questionNumber} von {totalQuestions}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {question.Typ === 'SingleAnswer' ? 'Eine Antwort' : 'Mehrere Antworten möglich'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">{question.Frage}</h2>

      <div className="space-y-3 mb-6">
        {shuffledAnswers.map((answer, index) => (
          <div
            key={`${answer.originalIndex}-${index}`}
            onClick={() => handleAnswerSelect(index)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedAnswers.includes(index)
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            } ${submitted ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center">
              <div className={`mr-3 ${question.Typ === 'SingleAnswer' ? 'rounded-full' : 'rounded'} w-5 h-5 border-2 ${
                selectedAnswers.includes(index)
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-400'
              }`}>
                {selectedAnswers.includes(index) && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="flex-1">{answer.Antwort}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswers.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Antwort überprüfen
          </button>
        )}
      </div>

      <FeedbackToast
        key={toastKey}
        show={showToast}
        isCorrect={toastIsCorrect}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}