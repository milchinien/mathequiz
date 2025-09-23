'use client';

import { useEffect, useState } from 'react';

interface FeedbackToastProps {
  show: boolean;
  isCorrect: boolean;
  message?: string;
  onClose?: () => void;
}

export default function FeedbackToast({ show, isCorrect, message, onClose }: FeedbackToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setShouldRender(false);
          onClose?.();
        }, 300);
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setShouldRender(false);
    }
  }, [show, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div
        className={`px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3 ${
          isCorrect
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
            : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
        }`}
      >
        <div className="text-3xl">
          {isCorrect ? '✓' : '✗'}
        </div>
        <div>
          <div className="font-bold text-lg">
            {isCorrect ? 'Richtig!' : 'Leider falsch!'}
          </div>
          {message && (
            <div className="text-sm mt-1 opacity-90">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}