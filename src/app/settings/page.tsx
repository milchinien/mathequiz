'use client';

import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

type SettingsTab = 'general' | 'audio' | 'appearance' | 'notifications' | 'advanced';

export default function SettingsPage() {
  useProtectedRoute();

  const { pendingSettings, updatePendingSettings, saveSettings, cancelChanges, resetSettings, hasUnsavedChanges } = useSettings();
  const { isDarkMode } = useDarkMode();
  const { viewMode, setViewMode } = useViewMode();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'general', label: 'Allgemein', icon: '⚙️' },
    { id: 'audio', label: 'Audio', icon: '🔊' },
    { id: 'appearance', label: 'Darstellung', icon: '🎨' },
    { id: 'notifications', label: 'Benachrichtigungen', icon: '🔔' },
    { id: 'advanced', label: 'Erweitert', icon: '🔧' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Einstellungen
        </h1>

        <div className="flex gap-6">
          {/* Left Sidebar - Tabs */}
          <div className={`w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col gap-4">
            <div className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              {activeTab === 'general' && (
                <div>
                  <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Allgemeine Einstellungen
                  </h2>

                  {/* Menu Size Setting */}
                  <div className="mb-8">
                    <label className={`block text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Menügröße: {pendingSettings.menuSize}%
                    </label>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>50%</span>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        step="5"
                        value={pendingSettings.menuSize}
                        onChange={(e) => updatePendingSettings({ menuSize: Number(e.target.value) })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        style={{
                          background: isDarkMode
                            ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(pendingSettings.menuSize - 50) / 1.5}%, #374151 ${(pendingSettings.menuSize - 50) / 1.5}%, #374151 100%)`
                            : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(pendingSettings.menuSize - 50) / 1.5}%, #e5e7eb ${(pendingSettings.menuSize - 50) / 1.5}%, #e5e7eb 100%)`
                        }}
                      />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>200%</span>
                    </div>
                    <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Ändert die Größe aller Menüelemente und UI-Komponenten
                    </p>
                  </div>

                  {/* Auto-Save Setting */}
                  <div className="mb-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pendingSettings.autoSaveProgress}
                        onChange={(e) => updatePendingSettings({ autoSaveProgress: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Fortschritt automatisch speichern
                      </span>
                    </label>
                    <p className={`mt-2 ml-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Speichert deinen Quiz-Fortschritt automatisch
                    </p>
                  </div>

                  {/* Reset Button */}
                  <div className="pt-6 border-t border-gray-300 dark:border-gray-700">
                    <button
                      onClick={resetSettings}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        isDarkMode
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      Einstellungen zurücksetzen
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'audio' && (
                <div>
                  <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Audio-Einstellungen
                  </h2>

                  <div className="space-y-8">
                    {/* Audio aktivieren */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pendingSettings.audioEnabled}
                        onChange={(e) => updatePendingSettings({ audioEnabled: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Audio aktivieren
                      </span>
                    </label>

                    {/* Master Volume */}
                    <div className={pendingSettings.audioEnabled ? '' : 'opacity-50 pointer-events-none'}>
                      <label className={`block text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Master: {pendingSettings.masterVolume}
                      </label>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>0</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={pendingSettings.masterVolume}
                          onChange={(e) => updatePendingSettings({ masterVolume: Number(e.target.value) })}
                          disabled={!pendingSettings.audioEnabled}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          style={{
                            background: isDarkMode
                              ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pendingSettings.masterVolume}%, #374151 ${pendingSettings.masterVolume}%, #374151 100%)`
                              : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pendingSettings.masterVolume}%, #e5e7eb ${pendingSettings.masterVolume}%, #e5e7eb 100%)`
                          }}
                        />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>100</span>
                      </div>
                    </div>

                    {/* Sound Effects Volume */}
                    <div className={pendingSettings.audioEnabled ? '' : 'opacity-50 pointer-events-none'}>
                      <label className={`block text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Soundeffekte: {pendingSettings.soundEffectsVolume}
                      </label>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>0</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={pendingSettings.soundEffectsVolume}
                          onChange={(e) => updatePendingSettings({ soundEffectsVolume: Number(e.target.value) })}
                          disabled={!pendingSettings.audioEnabled}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          style={{
                            background: isDarkMode
                              ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pendingSettings.soundEffectsVolume}%, #374151 ${pendingSettings.soundEffectsVolume}%, #374151 100%)`
                              : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pendingSettings.soundEffectsVolume}%, #e5e7eb ${pendingSettings.soundEffectsVolume}%, #e5e7eb 100%)`
                          }}
                        />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>100</span>
                      </div>
                    </div>

                    {/* Music Volume */}
                    <div className={pendingSettings.audioEnabled ? '' : 'opacity-50 pointer-events-none'}>
                      <label className={`block text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Musik: {pendingSettings.musicVolume}
                      </label>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>0</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={pendingSettings.musicVolume}
                          onChange={(e) => updatePendingSettings({ musicVolume: Number(e.target.value) })}
                          disabled={!pendingSettings.audioEnabled}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          style={{
                            background: isDarkMode
                              ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pendingSettings.musicVolume}%, #374151 ${pendingSettings.musicVolume}%, #374151 100%)`
                              : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pendingSettings.musicVolume}%, #e5e7eb ${pendingSettings.musicVolume}%, #e5e7eb 100%)`
                          }}
                        />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>100</span>
                      </div>
                    </div>
                  </div>

                  <p className={`mt-8 text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Audio-Funktionen sind in Entwicklung
                  </p>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Darstellung
                  </h2>

                  {/* View Mode Setting */}
                  <div className="mb-8">
                    <label className={`block text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Menüansicht
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                          viewMode === 'grid'
                            ? isDarkMode
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-blue-500 bg-blue-50 text-blue-700'
                            : isDarkMode
                            ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          <span className="font-medium">Raster</span>
                          <span className={`text-sm ${viewMode === 'grid' ? '' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Dreispaltige Ansicht
                          </span>
                        </div>
                      </button>

                      <button
                        onClick={() => setViewMode('sidebar')}
                        className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                          viewMode === 'sidebar'
                            ? isDarkMode
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-blue-500 bg-blue-50 text-blue-700'
                            : isDarkMode
                            ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          <span className="font-medium">Seitenleiste</span>
                          <span className={`text-sm ${viewMode === 'sidebar' ? '' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Chat-ähnliche Ansicht
                          </span>
                        </div>
                      </button>
                    </div>
                    <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Wähle die bevorzugte Ansicht für die Quiz-Auswahl
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Benachrichtigungen
                  </h2>

                  <div className="space-y-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pendingSettings.notificationsEnabled}
                        onChange={(e) => updatePendingSettings({ notificationsEnabled: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Benachrichtigungen aktivieren
                      </span>
                    </label>
                  </div>

                  <p className={`mt-6 text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Benachrichtigungsfunktionen sind in Entwicklung
                  </p>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div>
                  <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Erweiterte Einstellungen
                  </h2>
                  <p className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Erweiterte Optionen werden hier hinzugefügt
                  </p>
                </div>
              )}
            </div>

            {/* Save/Cancel Buttons */}
            {hasUnsavedChanges && (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 flex items-center justify-between`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Du hast ungespeicherte Änderungen
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelChanges}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={saveSettings}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Änderungen speichern
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}