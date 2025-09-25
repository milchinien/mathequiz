# Ziel

Implementierung einer KI-gestützten Quiz-Generierungsfunktion, die es Nutzern ermöglicht, aus verschiedenen Content-Quellen (Text, PDF, URL) automatisch neue Quizzes im bestehenden JSON-Format zu erstellen und in die richtige Ordnerstruktur einzuordnen.

# Schritte:

- [ ] OpenAI API Integration einrichten (API Key in .env.local, OpenAI Client initialisieren)
- [ ] Neue Route `/generate` mit UI-Seite für Quiz-Generierung erstellen
- [ ] Kategorie-Auswahl-Komponente implementieren (Dropdown für bestehende Kategorien + Option für neue Kategorie/Unterkategorie)
- [ ] Content-Input-Komponente erstellen (Tabs für: Text-Eingabe via Textarea, File-Upload für PDF/TXT/MD, URL-Eingabe)
- [ ] File-Upload Handler implementieren (PDF-Parsing mit pdf-parse, Text/Markdown direkt lesen)
- [ ] URL-Scraping Funktion implementieren (Webpage fetchen und Text extrahieren)
- [ ] Quiz-Konfigurationsformular erstellen (Anzahl Fragen, Antworten pro Frage, Single/Multiple Choice, Zielgruppe-Textfeld)
- [ ] Prompt-Template in separater Datei erstellen (prompts/quiz-generation.txt)
- [ ] API-Route `/api/generate-quiz` implementieren (Content + Konfiguration → OpenAI → JSON-Quiz)
- [ ] JSON-Validierung für generierte Quiz-Struktur implementieren
- [ ] Quiz-Speicher-Funktion erstellen (JSON in richtige Ordnerstruktur schreiben)
- [ ] Vorschau-Komponente für generiertes Quiz vor dem Speichern
- [ ] Loading-States und Fehlerbehandlung für Generierungsprozess
- [ ] "Quiz generieren" Button mit Prozessindikator

# Akzeptanzkriterien

- Nutzer kann neue Quizzes über eine intuitive Oberfläche generieren
- Content kann via Text, File-Upload (PDF/TXT/MD) oder URL bereitgestellt werden
- Kategorien und Unterkategorien können ausgewählt oder neu angelegt werden
- Quiz-Parameter (Fragenanzahl, Antwortanzahl, Single/Multiple Choice) sind konfigurierbar
- Zielgruppe kann als Freitext angegeben werden
- Generierte Quizzes werden im korrekten JSON-Format in der richtigen Ordnerstruktur gespeichert
- Der Generierungsprozess zeigt einen Ladeindikator und behandelt Fehler angemessen
- Generierte Quizzes sind sofort im bestehenden Quiz-System spielbar