'use client';

import { useState } from 'react';

interface ContentInputProps {
  content: string;
  onContentChange: (content: string) => void;
  onFileChange: (file: File | null) => void;
}

type InputMode = 'text' | 'file' | 'url';

export default function ContentInput({ content, onContentChange, onFileChange }: ContentInputProps) {
  const [mode, setMode] = useState<InputMode>('text');
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'text/markdown',
        'text/x-markdown'
      ];

      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
        alert('Bitte laden Sie nur PDF-, TXT- oder Markdown-Dateien hoch.');
        return;
      }

      setFileName(file.name);
      onFileChange(file);
      onContentChange('');
    }
  };

  const handleUrlFetch = async () => {
    if (!url.trim()) {
      setUrlError('Bitte geben Sie eine URL ein');
      return;
    }

    setIsLoadingUrl(true);
    setUrlError(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der URL');
      }

      const { content: scrapedContent } = await response.json();
      onContentChange(scrapedContent);
      onFileChange(null);
    } catch (error) {
      setUrlError('Konnte Inhalt von der URL nicht abrufen');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleModeChange = (newMode: InputMode) => {
    setMode(newMode);
    if (newMode === 'text') {
      onFileChange(null);
      setFileName(null);
    } else if (newMode === 'file') {
      onContentChange('');
    } else if (newMode === 'url') {
      onContentChange('');
      onFileChange(null);
      setFileName(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleModeChange('text')}
          className={`px-4 py-2 font-medium transition ${
            mode === 'text'
              ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Text eingeben
        </button>
        <button
          onClick={() => handleModeChange('file')}
          className={`px-4 py-2 font-medium transition ${
            mode === 'file'
              ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Datei hochladen
        </button>
        <button
          onClick={() => handleModeChange('url')}
          className={`px-4 py-2 font-medium transition ${
            mode === 'url'
              ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          URL
        </button>
      </div>

      {mode === 'text' && (
        <div>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Fügen Sie hier den Text ein, auf dessen Basis das Quiz erstellt werden soll..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      )}

      {mode === 'file' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              accept=".pdf,.txt,.md"
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              {fileName ? (
                <div>
                  <svg className="mx-auto h-12 w-12 text-green-500 dark:text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{fileName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Klicken Sie, um eine andere Datei auszuwählen</p>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Datei hochladen</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">PDF, TXT oder Markdown (max. 10MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>
      )}

      {mode === 'url' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/artikel"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={handleUrlFetch}
              disabled={isLoadingUrl}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                isLoadingUrl
                  ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              {isLoadingUrl ? 'Lade...' : 'Abrufen'}
            </button>
          </div>

          {urlError && (
            <p className="text-red-600 dark:text-red-400 text-sm">{urlError}</p>
          )}

          {content && mode === 'url' && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Vorschau des abgerufenen Inhalts:</p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{content.substring(0, 500)}...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}