# Neues Quizzes generieren

Wir möchten jetzt neue Quizzes generieren. Momentan haben wir ja ein paar Beispielquizzes und wir möchten jetzt ein neues User Interface generieren, bei dem wir über die KI und wir verwenden dazu OpenAI, neue Quizzes generieren in diesem JSON-Format und entsprechend in die richtigen Ordner einordnen.

Das heißt, die Kategorisierung soll möglichst vom User vorgegeben werden können.

Das heißt, wir müssen sagen, was für eine Kategorie unter Kategorie soll es sein? Müssen wir auch neue anlegen können?

Und dann möchte ich im Prinzip ein neues Quiz erzeugen. Dazu möchte ich dem User die Möglichkeit geben, entweder über ein großes Textfenster per Copy-and-Paste-Text hinzuzufügen oder per File Link drag-and-drop eine Datei hochzuladen. Momentan unterstützen wir am besten nur PDF, Textdateien und Markdowns oder eine URL einzugeben, die das Programm dann nutzt, um die Webseite zu scrapen.

Dieser Content ist quasi die Basis, wofür ein Quiz erstellt werden soll. Zusätzlich müssen wir vermutlich immer noch angeben, wie schwer das Quiz sein soll, d.h. für welche Zielgruppe das Ganze passieren soll.

Das heißt, wir brauchen irgendwo noch eine Möglichkeit anzugeben, wer die Zielgruppe ist (z.B. Matheprofessoren oder Schüler der dritten Klasse) und daraufhin soll dann das Programm über einen Large Language Model und einen konfigurierbaren Prompt, der in einer Textdatei stehen sollte, den Content an einen Large Language Model schicken und daraufhin ein Quiz generieren. Als Parameter wollen wir noch angeben:
- Wie viele Fragen das Quiz haben soll
- Wie viele Antworten pro Frage existieren sollen
- Ob mehrfach Antworten erlaubt sein sollen oder ob es nur einfache Antworten geben soll
Alles weitere soll nachher das LLM machen.

Also nochmal zur Wiederholung. Wir wollen im Prinzip eine Funktionalität haben, wo wir sagen: Neues Quiz erzeugen.

Der User soll Kategorien unter Kategorie auswählen oder bei Bedarf neue anlegen. Möglichst mit Platz sparen, das heißt, das ist eine Funktion, die einfach mit einem Model oder so gemacht werden kann.

Und wenn er die Kategorie, die Unterkategorie ausgewählt hat, soll er den Content, den er über den er das Quiz erstellen will, entweder als reiner Text oder als File oder als URL angeben können.

Dann die Angaben wie viele Fragen, wie viele Antworten und ob Mehrfachantworten erlaubt sein sollen. Das muss ein bisschen über die Settings sein, die man einmalig einstellt.

Und noch eine Angabe zur Zielgruppe – das kann man theoretisch auch als Freitext machen.

Danach brauchen wir quasi einen generieren Quiz Button, und dann soll das LLM loslegen und das Ziel chasen, wie es bei den bisherigen Quizzes auch ist, erzeugen. 