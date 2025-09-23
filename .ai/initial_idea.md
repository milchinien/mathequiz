# Quiz Tool

Wir wollen gerne eine webbasierte Anwendung erstellen, die es uns ermöglicht, Multiple-Choice-Quizzes abzufragen.

Wir haben dazu einen der Input wird dabei aus JSON-Dateien kommen, das heißt, ein Quiz ist jeweils in einem einzigen JSON-File drin.

Die Oberfläche soll uns im Prinzip erlauben, ein Quiz auszuwählen auf Basis der Datei. Das Format soll ungefähr folgendermaßen aussehen: 

```json
{
    "Thema": "Binomische Formeln",
    "Fragen": [
        {
            "Frage": "Wie groß ist Michi?",
            "Typ": "SingleAnswer",
            "Antworten": [
                {
                    "Antwort" :"1,30m",
                    "Richtig": false,
                    "Kommentar": "Das ist lange her"
                },
                {
                    "Antwort" :"1,80m",
                    "Richtig": true,
                    "Kommentar": "Wahrscheinlich richtig"
                }
            ]
        }
    ]

}
```

Quizze sollen in einer Ordnerstruktur abgelegt werden, die zweistufig ist.

Das heißt, wir haben im Prinzip eine zweistufige Hierarchie, die wir dann für die Auswahl brauchen. 
z.B.

-root
  - 9teKlasse
    - Mathe
      - quiz1.json
      - quiz2.json
...

Das Ganze soll eine Next.js-Anwendung werden und wir werden das komplett von scratch starten. Das heißt, das Projekt existiert noch nicht, wir wollen also eine neue Anwendung machen mit Next.js, die in der Lage ist, dem User erlaubt,
- ein Quiz auszuwählen
- das Quiz durchzuführen
- am Ende ein Ergebnis zu bekommen, wie viele Antworten er richtig hatte und wie viele Antworten falsch waren

Wir wollen zwei Modi haben:
1. Er bei einer falschen Antwort sofort sagen, dass es falsch ist und den Hinweis geben.
2. Alle Fragen beantwortet werden und wir dann eine Summary angezeigt bekommen, welche Antwort richtig, welche falsch war, mit dem entsprechenden Kommentar dazu.1