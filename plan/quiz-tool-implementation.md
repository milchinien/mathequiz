# Ziel

Entwicklung einer webbasierten Next.js-Anwendung zur Durchführung von Multiple-Choice-Quizzen mit JSON-basierter Datenverwaltung und zweistufiger Ordnerstruktur.

# Schritte:

- [ ] Next.js Projekt initialisieren mit TypeScript
- [ ] Basis-Ordnerstruktur für Quizze erstellen (root/Kategorie/Unterkategorie/*.json)
- [ ] TypeScript-Interfaces für Quiz-JSON-Format definieren
- [ ] API-Route zum Lesen der Quiz-Ordnerstruktur implementieren
- [ ] API-Route zum Laden einzelner Quiz-JSON-Dateien erstellen
- [ ] Hauptseite mit Quiz-Auswahl (zweistufige Navigation) bauen
- [ ] Quiz-Komponente für Fragen-Darstellung entwickeln
- [ ] Antwort-Auswahl-Logik implementieren (Single/Multiple Choice)
- [ ] Modus 1: Sofortiges Feedback bei falschen Antworten einbauen
- [ ] Modus 2: Sammelmodus mit Ergebnis-Summary am Ende implementieren
- [ ] Modus-Umschaltung in der UI ermöglichen
- [ ] Ergebnis-Anzeige mit Punktzahl und Kommentaren erstellen
- [ ] Beispiel-Quiz-Dateien in verschiedenen Kategorien anlegen
- [ ] Basis-Styling mit Tailwind CSS hinzufügen
- [ ] Navigation zwischen Fragen (vor/zurück) implementieren

# Akzeptanzkriterien

- Next.js-Anwendung startet ohne Fehler
- Quiz-Dateien werden aus zweistufiger Ordnerstruktur korrekt gelesen
- User kann ein Quiz aus der hierarchischen Liste auswählen
- Fragen werden einzeln oder sequenziell angezeigt
- Beide Modi (Sofort-Feedback und Sammelmodus) funktionieren
- Ergebnisse zeigen richtige/falsche Antworten mit Kommentaren
- JSON-Format wird korrekt interpretiert (SingleAnswer/MultipleAnswer)
- Anwendung ist im Browser nutzbar ohne zusätzliche Tools