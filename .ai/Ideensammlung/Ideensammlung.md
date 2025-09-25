# 📋 Ideensammlung - MathEquiz

## 🎯 Priorität 1: Bug Fixes
- [ ] Alle aktuellen Bugs in der Anwendung identifizieren und beheben
- [ ] Stabilität der Anwendung sicherstellen

## 🎲 Priorität 2: Dynamische Quiz-Abfrage
### Zufällige Fragenauswahl
- [ ] **Feature**: Bei Quiz-Start Anzahl der abzufragenden Fragen wählbar machen
  - Quiz kann z.B. 20 Fragen haben
  - Nutzer wählt aus: 5, 10 oder n Fragen für diese Session
  - System wählt zufällig aus dem Fragenpool aus
  - **Vorteil**: Große Quizze werden variabel und nicht repetitiv

### Implementierungsdetails
- [ ] UI-Element für Fragenanzahl-Auswahl beim Quiz-Start
- [ ] Zufallsalgorithmus für Fragenauswahl
- [ ] Sicherstellen, dass keine Frage doppelt kommt

## 👥 Priorität 3: Benutzer & Tracking System

### Mini-Benutzerverwaltung
- [ ] **Einfache Nutzer-Identifikation**
  - Nur Name erforderlich (kein Passwort)
  - Beispiel: "Michel", "Test", etc.
  - Zweck: Trennung von echten Versuchen und Test-Durchläufen

### Historie & Tracking
- [ ] **Zu speichernde Daten pro Quiz-Durchlauf:**
  - Benutzername
  - Datum & Uhrzeit
  - Quiz-Bezeichnung
  - Für jede beantwortete Frage:
    - Fragestellung (vollständig)
    - Gegebene Antwort(en)
    - Korrekte Antwort(en)
    - Ergebnis (richtig/falsch)

### Datenstruktur-Überlegungen
```javascript
{
  user: "Michel",
  timestamp: "2024-09-25T14:30:00",
  quiz: {
    category: "Mathematik",
    subcategory: "9. Klasse",
    name: "Binomische Formeln"
  },
  results: [
    {
      question: "Was ist (a+b)²?",
      userAnswer: "a² + b²",
      correctAnswer: "a² + 2ab + b²",
      isCorrect: false
    },
    // ...
  ],
  score: {
    correct: 7,
    total: 10,
    percentage: 70
  }
}
```

## 🤖 Priorität 4: KI-gestützte Lernanalyse

### Langfristige Ziele
- [ ] **LLM-Integration für Lernfortschritt**
  - Analyse der Historie durch KI
  - Bewertung: Welcher Stoff wird beherrscht?
  - Identifikation von Schwachstellen
  - Fortschrittsverfolgung über Zeit

### Mögliche Analysen
- [ ] Stoffbeherrschung pro Themengebiet
- [ ] Lernkurven und Trends
- [ ] Wiederholungsempfehlungen
- [ ] Personalisierte Lernpfade

## 🏗️ Technische Anforderungen

### Frontend-Komponenten
- [ ] **Anmeldeseite**
  - Einfaches Formular mit Namenseingabe
  - Optional: Nutzer-Dropdown für wiederkehrende User

- [ ] **Quiz-Konfiguration**
  - Fragenanzahl-Selektor
  - Zufallsmodus-Toggle

- [ ] **Historie-Ansicht**
  - Übersicht aller Durchläufe
  - Filterung nach Nutzer/Datum/Quiz
  - Detailansicht einzelner Durchläufe

### Backend/Datenspeicherung
- [ ] **Persistente Speicherung**
  - LocalStorage für MVP
  - Später: Datenbank-Integration

- [ ] **API-Endpoints**
  - `/api/users` - Nutzerverwaltung
  - `/api/history` - Historie speichern/abrufen
  - `/api/analytics` - Auswertungen

## 📊 Auswertungsmöglichkeiten

### Kurzfristig
- [ ] Einfache Statistiken (Erfolgsquote, Anzahl Versuche)
- [ ] Verlauf pro Nutzer

### Langfristig
- [ ] Lernfortschrittsgraphen
- [ ] Vergleich zwischen Nutzern
- [ ] Schwierigkeitsgrad-Anpassung basierend auf Performance

## 🔄 Implementierungsreihenfolge

1. **Phase 1**: Bug Fixes
2. **Phase 2**: Dynamische Fragenauswahl
3. **Phase 3**: Mini-Benutzerverwaltung
4. **Phase 4**: Historie-Tracking
5. **Phase 5**: Erste Auswertungen
6. **Phase 6**: KI-Integration (optional/zukunft)

## 💡 Zusätzliche Überlegungen

- **Datenschutz**: Keine sensiblen Daten speichern
- **Performance**: Effiziente Speicherung bei vielen Durchläufen
- **Export**: Möglichkeit, Historie zu exportieren (CSV/JSON)
- **Backup**: Regelmäßige Sicherung der Historie-Daten