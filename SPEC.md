Status: fein (project-details, 2026-11-13)

# Neon Pounce – Spezifikation

## 1. Projekt

**Name:** Neon Pounce (Arbeitstitel). **Slogan:** „Think fast!“ Gemeint ist
schnelles Entscheiden; für Schnelligkeit selbst gibt es keine Belohnung.

Namensprüfung (grobe Websuche am 2026-11-12): kein Spiel, keine App, kein Paket
und keine Marke namens „Neon Pounce“ gefunden. Das ist keine Rechtsberatung.

**Idee:** Ein schnelles Sortier-Puzzle fürs Handy im Neon-Look mit
Synthwave-Klang. In der Mitte leuchtet ein Segment mit fester Position und
zufälliger Farbe auf. Der Spieler tippt es unter Zeitdruck in einen von sechs
Ringen, um Ringe zu füllen und möglichst einfarbig abzuräumen.

**Kernmechanik in Kurzform.** Die maßgeblichen Regeln stehen als nummerierte
Anforderungen in `docs/spec/anforderungen.md`, die Begründungen im Spielkonzept
unter `docs/spec/spielkonzept.md`. Wo diese Datei „Konzept“ sagt, ist das
Spielkonzept gemeint. Alle Teilspecs nennt Abschnitt 9.

- Sechs äußere Ringe mit je sechs Plätzen, um 30° gegen die Platz-Positionen
  versetzt. Die Position des Segments steht fest, der Spieler wählt nur den Ring.
- Ein voller Ring leert sich sofort. Einfarbig bringt ×3 und einen Abwurf zurück.
- Ein Fehltipp kostet steigende Strafzeit, ein Timeout kostet eines von 3 Leben.
- Ein Wisch wirft das Segment ab (begrenzter Vorrat). Bei 0 Abwürfen gibt er es
  auf und kostet ein Leben.
- Züge in Folge, die einen Ring leeren, bauen eine Combo auf (höchstens ×6).
  Abwürfe halten die Combo am Leben: Der Spieler kann sie mit Abwürfen „kaufen“.
- 12 Stufen innerhalb einer Partie mit kürzerem Timer, mehr Farben und höherem
  Multiplikator, danach Endlosspiel.
- Bonus-Segmente: Joker, später der Aufräumer.
- Drei Abwägungen tragen das Spiel: sicher oder sortiert, Sortierung opfern oder
  abwerfen, Combo oder Sicherheit.

## 2. Zweck

Ein Spiel für mich selbst und zum Vorzeigen im Freundeskreis. Freunde bekommen
einen Link, legen das Spiel als App auf den Startbildschirm, verstehen es (ggf.
mit Tutorial) und wollen „Again“ drücken.

Das Projekt entsteht nebenbei, in fünf Etappen und ohne festen Termin.

## 3. Ziele

- Geübte spielen im Median 150 bis 300 Züge je Partie. Als Zug zählen nur
  Platzierungen. Zielwerte werden in Zügen angegeben, nicht in Minuten.
- Anfänger erreichen mindestens Stufe 4.
- Auf Stufe 1 bis 4 gibt es kaum erzwungene Lebensverluste.
- Der erste Ring gelingt früh, ohne garantiert zu sein.
- Blockaden kommen vor, entstehen aber überwiegend durch eigene Entscheidungen
  und nicht durch reines Pech.
- Ein volles Feld bleibt spürbar gefährlicher als ein leeres, auch für einen
  Spieler, der nur auf Combos spielt. Messwert: Blockade-Rate je Füllstand und
  Unwucht.
- Unter Spielstilen mit vergleichbarem Planungsaufwand dominiert keiner alle
  anderen. Können soll sich dagegen lohnen: Der vorausplanende Bot liegt
  deutlich vor dem Anfänger-Bot.
- Einfarbig lohnt sich weder nie noch immer. Bei 5 und 6 Farben wird es selten,
  verschwindet aber nicht. Messwert: Einfarbig-Quote je Stufe.
- Der Abwurf-Vorrat ist weder dauernd leer noch dauernd voll, gemessen je Stufe.
- Ein einzelner Glücksfall entscheidet keine Partie. Messwert: Streuung der
  Endpunktzahl je Strategie (die Multiplikatoren stapeln sich bis ×67,5, beim
  Ring nur aus Jokern bis ×225).
- Neue Spieler verstehen mit einem Satz Erklärung, dass die Position feststeht
  und sie nur den Ring wählen.
- Das Spiel läuft auf iPhone und Android-Handy flüssig mit 60 Bildern pro
  Sekunde.

Es gibt kein Lernziel, das den Stack oder den Umfang beeinflusst.

## 4. Feste Anforderungen

- Hochformat fürs Handy. Bedienung nur per Tipp (legen) und Wisch (abwerfen).
- Läuft auf iOS (Safari) und Android (Chrome). Testgeräte: iPhone 17, iPad,
  Android-Handy.
- Per Link erreichbar und auf dem Startbildschirm installierbar.
- Nach dem ersten Laden ohne Internet spielbar.
- Kein Konto, kein Server, kein Tracking.
- Die Spielregeln sind von der Darstellung getrennt, damit Tests und die
  Bot-Simulation ohne Browser laufen.
- Der Regelkern bekommt seinen Zufallsgenerator übergeben (mit Startwert), damit
  Tests wiederholbar und Simulationsläufe vergleichbar sind.
- Sechs Segmentfarben, jede mit einem festen Symbol (auch bei Farbschwäche
  unterscheidbar).
- Kein Text im laufenden Spiel, nur Zahlen und Symbole. Die Oberfläche ist
  Englisch.
- Lokaler Highscore. Eine laufende Partie wird nicht gespeichert.
- Hintergrund und Musik entstehen lokal über ComfyUI und liegen dem Spiel als
  Dateien bei. Spielgrafik und Soundeffekte entstehen per Code (siehe Abschnitt
  6.6).
- Effekte und Musik gehören zum ersten Umfang.

## 5. Nicht-Ziele

Aus dem Spielkonzept:

1. Keine Online-Bestenliste
2. Kein Mehrspieler
3. Keine Level oder Kampagne (die Stufen steigen nur innerhalb einer Partie)
4. Keine Drehmechanik
5. Kein Ziehen und Ablegen
6. Keine Belohnung für Schnelligkeit
7. Keine Werbung und keine Käufe
8. Kein Konto und kein Server
9. Kein Tracking
10. Nur Englisch
11. Kein Einstellungsmenü (nur Mute und Pause)
12. Keine Tastaturbedienung
13. Keine Stufenzahl im laufenden Spiel
14. Kein Blockade-Hinweis vorab
15. Kein Wisch-Hinweis im laufenden Spiel
16. Keine Vorschau auf das nächste Segment
17. Kein Abfangen von Fehlgriffen in einen Nachbarring

Im Interview ergänzt:

18. Keine Veröffentlichung im App Store oder bei Google Play
19. Kein eigenes Layout für das iPad. Das Spielfeld skaliert responsiv und
    bleibt ein zentriertes Hochformat-Feld.
20. Kein Querformat (im Querformat pausiert das Spiel mit Dreh-Hinweis)
21. Kein Abgleich des Highscores über mehrere Geräte

**Nice-to-have, kein Ziel:** Das Spiel ist im Desktop-Browser mit der Maus
bedienbar. Dafür wird nichts optimiert und nichts getestet.

## 6. Entscheidungen

### 6.1 Zielplattform und Auslieferung

**Entscheidung:** Web-App als PWA, ausgeliefert als statische Dateien über
GitHub Pages unter `https://webcodingcat.github.io/neon-pounce/`.

**Begründung:** Ohne Stores ist die PWA der einzige Weg, bei dem Freunde nur
einen Link brauchen. GitHub Pages ist für das öffentliche Repo kostenlos,
liefert HTTPS (Pflicht für eine PWA) und braucht weder ein weiteres Konto noch
ein Secret. Das Repo ist genau deshalb öffentlich.

**Verworfen:**
- Web-App in nativer Hülle (Capacitor): braucht für iOS ein
  Apple-Entwicklerkonto (99 USD im Jahr), TestFlight und Xcode-Builds. Einziger
  Gewinn wäre die Vibration auf dem iPhone.
- Spiel-Engine mit nativem Export (Godot): dieselben Hürden bei der Verteilung,
  dazu eine Engine, die für dieses 2D-Spiel zu schwer ist.
- Cloudflare Pages oder Netlify: Vorschau-Adressen je Branch, aber ein
  zusätzliches Konto und ein Deploy-Token.

**Folgen, die zu beachten sind:**
- Die App liegt unter dem Unterpfad `/neon-pounce/`. Build, Manifest und
  Service Worker müssen diesen Basispfad kennen.
- Auf iOS gibt es im Browser keine Vibration. Dort bleibt es bei Bild und Ton.
- Auf iOS wird die App von Hand über das Teilen-Menü installiert.
- Auf iOS startet Ton erst nach der ersten Berührung.
- Safari kann die Daten einer nicht installierten Web-App nach einigen Tagen
  ohne Nutzung löschen. Der Highscore ist dann weg. Das wird hingenommen.

**Kosten einer späteren Änderung:** Der Wechsel zu Capacitor ist billig, weil
Capacitor dieselbe Web-App verpackt. Ein Wechsel des Hosters dauert etwa eine
Stunde. Der Wechsel zu einer nativen Engine wäre ein Neubau der Darstellung.

### 6.2 Stack

| Baustein | Wahl | Version |
|---|---|---|
| Sprache | TypeScript | 6.0.3 |
| Laufzeit für Build, Tests, Simulation | Node.js | 26 (LTS) |
| Build und Entwicklungsserver | Vite | 8.3 |
| Darstellung | PixiJS | 8.23 |
| Ton | Web Audio API des Browsers | keine Bibliothek |
| Offline und Installation | vite-plugin-pwa | 2.0 (ab Meilenstein 15) |

**Sprache – Begründung:** TypeScript 6 statt 7, weil typescript-eslint 8.72
laut seinen Paketangaben nur TypeScript unter 6.1 unterstützt. Mit TypeScript 7
liefe der typbasierte Linter nicht. **Änderung später:** billig, sobald
typescript-eslint die neue Version unterstützt.

**Regelkern:** reines TypeScript ohne Abhängigkeiten und ohne Zugriff auf
Browser-Schnittstellen. Er läuft unverändert im Browser, in Vitest und in der
Simulation unter Node.

**Darstellung – Begründung:** Der Neon-Look mit Glow, additiver Überblendung
und Partikeln gehört zum ersten Umfang. PixiJS zeichnet per WebGL und ist nur
ein Renderer: Spielschleife und Regeln bleiben eigener Code. Das ist nicht zu
schwer für das Projekt, weil es genau eine Abhängigkeit für genau die Aufgabe
ist, die ohne Bibliothek am meisten Eigenbau kosten würde.

**Verworfen:**
- Canvas 2D ohne Bibliothek: reicht für Etappe 1, aber `shadowBlur` ist auf
  Handys langsam. Für Etappe 3 müssten Glow und Partikel selbst gebaut werden.
- Phaser 4.2: komplette Engine von etwa 1 MB, von der das meiste nicht gebraucht
  wird. Sie will die Spielschleife besitzen und erschwert damit die Trennung von
  Regeln und Darstellung.

**Bekanntes Risiko:** Ein früherer Test mit PixiJS zeigte auf dem iPhone 17
einen schnellen Einbruch der Framerate. Die Ursache ist nicht geklärt. Phaser
würde sie sehr wahrscheinlich nicht beheben, weil beide mit WebGL auf demselben
Grafikchip zeichnen. Deshalb gelten von Anfang an drei Regeln für die
Darstellung:

1. Glow steckt in den Texturen. Zur Laufzeit gibt es keine Filter je Objekt.
2. Die Renderauflösung ist auf Faktor 2 begrenzt, auch auf Geräten mit Faktor 3.
3. Formen werden einmal gebaut und danach nur bewegt, nicht in jedem Bild neu
   gezeichnet.

Ob das reicht, klärt die Leistungsprobe in Etappe 1 (siehe Abschnitt 7).

**Ton – Begründung:** Die steigende Tonhöhe beim Platzieren und die Halbtöne je
Combo-Stufe brauchen die Web Audio API ohnehin. Eine Bibliothek darüber bringt
für wenige Klänge und ein Musikstück nichts. Howler wurde verworfen, weil das
letzte Release (2.2.4) alt ist.

**Kosten einer späteren Änderung:** Ein Wechsel des Renderers bleibt auf die
Darstellungsschicht begrenzt, solange die Regeln getrennt sind. Nach Etappe 3
wäre er trotzdem teuer, weil dann Animationen und Effekte daran hängen. Deshalb
fällt die Prüfung in Etappe 1.

### 6.3 Toolchain

**Entscheidung:** Alles läuft lokal auf dem Rechner: Node 26 (LTS) und npm. Die
Node-Version wird im Projekt festgeschrieben, die CI nutzt dieselbe.

**Begründung:** Schnellste Testläufe und sofortiges Neuladen im Browser. Das
Handy erreicht den Entwicklungsserver direkt im WLAN, was jeder Spieltest
braucht. Volle Editor-Unterstützung. Ein reines Frontend-Projekt ohne Datenbank
oder Dienste gewinnt durch Docker kaum etwas, das die festgeschriebene
Node-Version nicht auch leistet.

**Verworfen:**
- Docker mit Wrapper-Skript: Unter Windows ist der Dateizugriff über die
  Container-Grenze langsam, das automatische Neuladen braucht Polling, der
  Zugriff vom Handy eine Portfreigabe.
- Claude Code im Container: geht nur mit der CLI, gearbeitet wird im Code-Tab
  der Desktop-App.
- pnpm oder andere Paketmanager: npm ist vorhanden, das Projekt hat keine
  Besonderheiten.

**Linter und Formatierung:** ESLint 10.14 mit typescript-eslint 8.72 (typbasierte
Regeln) und Prettier 3.10. Verworfen wurde Biome 2.6: ein Werkzeug und sehr
schnell, aber mit schmaleren typbasierten Regeln.

**Kosten einer späteren Änderung:** gering. Ein Umzug nach Docker oder zu einem
anderen Linter betrifft nur Konfiguration.

### 6.4 Git und CI

- **Repo:** `webcodingcat/neon-pounce` auf GitHub, öffentlich.
- **CI:** GitHub Actions (für öffentliche Repos kostenlos).
  - Bei jedem Push: Linter, Typprüfung, Vitest, Build, Playwright-Rauchtests.
  - Bei jedem Push auf `main`: zusätzlich Deployment nach GitHub Pages.
- **Branch-Strategie:** ein Branch pro Etappe, der nach der Abnahme mit
  `--ff-only` nach `main` zusammengeführt wird.
- **Namensschema:** `m<N>-<kurzer-name>`, zum Beispiel `m1-playable-core`. Diese
  Zeile ist die einzige Quelle für das Schema.

**Begründung:** `main` enthält nur abgenommene Stände, und genau die sehen
Freunde unter dem Link. Eine gescheiterte Etappe lässt sich verwerfen.

**Folge:** Ein unfertiger Stand ist nicht unter der öffentlichen Adresse
erreichbar. Tests vor der Abnahme (auch der Kurztest in Etappe 1) laufen über
den Entwicklungsserver im WLAN oder auf dem eigenen Handy.

**Verworfen:** direkt auf `main`. Jeder Push wäre sofort unter dem Link
testbar, aber Freunde könnten einen kaputten Zwischenstand erwischen.

**Kosten einer späteren Änderung:** keine nennenswerten.

### 6.5 Öffentlichkeit, Lizenz und Dokumentation

- **Sichtbarkeit:** öffentlich (steht durch das GitHub-Repo fest).
- **Lizenz:** MIT für den Code. Grafiken, Soundeffekte und Musik sind
  ausdrücklich ausgenommen, bis die Lizenzen der ComfyUI-Modelle feststehen
  (siehe Abschnitt 7).
- **Dokumentation**, beide Dateien auf Englisch:
  - `README.md` für Anwender: was das Spiel ist, Link zum Spielen, Installation
    auf dem Handy, Lizenz. Ab Etappe 3 mit Screenshot oder kurzer Animation.
  - `docs/DEVELOPMENT.md` für Entwickler: Voraussetzungen, Befehle, Tests,
    Simulation, Struktur, Workflow, Asset-Erzeugung.

**Begründung:** Leser sind Besucher des öffentlichen Repos und die Entwicklung.
MIT ist üblich und unkompliziert. Verworfen wurde „keine Lizenz“, weil ein
Verkauf des Spiels nicht geplant ist.

**Kosten einer späteren Änderung:** Eine Lizenz zu ergänzen ist einfach, sie für
bereits veröffentlichte Stände zurückzunehmen nicht.

### 6.6 Assets

- **Aus ComfyUI auf dem eigenen Rechner:** das Hintergrundbild und das
  Musikstück. Sie liegen dem Spiel als Dateien bei.
- **Per Code:** Ringe, Segmente, Symbole, Glow, Partikel und alle Soundeffekte.
- **Freie Schrift** (SIL Open Font License) als Datei im Repo, ausgewählt in
  Meilenstein 9.

**Begründung:** Spielgrafik muss geometrisch exakt zu den 60°-Keilen passen und
einmal als Glow-Textur gebaut werden (Abschnitt 6.2), das leistet ein Bildmodell
nicht zuverlässig. Die Effekte brauchen steuerbare Tonhöhen (Füllstand,
Halbtöne je Combo). Ein gemalter Hintergrund und ein Musikstück sind dagegen
genau das, was ein Modell gut kann und Code nicht. Die Schrift liegt bei, weil
das Spiel offline laufen und nichts von fremden Servern abrufen soll.

**Kosten einer späteren Änderung:** gering. Das Spiel ruft nur „Effekt mit
Tonhöhe“ auf. Ein einzelner Effekt lässt sich später durch eine Datei aus
ComfyUI ersetzen, ohne das Spiel umzubauen. Dieser Vergleich ist für die Effekte
ohne feste Tonhöhe in Meilenstein 11 vorgesehen.

Modelle, Workflows und Installation klärt `/wcc:asset-setup` (Meilenstein 4).
Die Modelldateien kommen nicht ins Repo. Workflows, die ins Repo kommen,
enthalten keine lokalen Pfade mit Benutzernamen. Stilvorgaben, Formate und
Messwerte stehen in `docs/spec/grafik-audio.md`.

### 6.7 Zielsysteme

**Entscheidung:** Safari auf der aktuellen und der vorigen iOS-Hauptversion,
aktuelles Chrome auf Android 12 oder neuer.

**Begründung:** Das deckt die Handys im Freundeskreis ab, ohne Altlasten zu
pflegen. Getestet wird nur auf den eigenen Geräten.

**Kosten einer späteren Änderung:** gering, solange keine Browser-Funktion
genutzt wird, die es nur in der neuesten Version gibt.

## 7. Offene Annahmen

Die Meilensteine stehen in `docs/spec/meilensteine.md`.

**PixiJS hält 60 Bilder pro Sekunde auf echten Handys.**
- Vorläufiger Standard: PixiJS 8.23 bleibt.
- Geklärt in: Meilenstein 1, Leistungsprobe. Scheitert sie, wird der Renderer
  neu entschieden, bevor Look und Sound darauf aufbauen.

**Neue Spieler verstehen mit einem Satz, dass die Position feststeht.**
- Vorläufiger Standard: Das Konzept bleibt.
- Geklärt in: Meilenstein 3, Kurztest mit ein oder zwei Freunden in zwei
  Durchgängen.
  - Erster Durchgang, etwa fünf Minuten mit 3 Farben, 4 s und jeder Position
    zweimal im Beutel. Prüffrage: Verstehen sie nach einem Satz Erklärung, dass
    sie nur den Ring wählen?
  - Zweiter Durchgang mit harter Einstellung in der Konfigurationsdatei (5
    Farben, 2,5 s), damit die Partie sicher im Game Over endet. Prüffrage:
    Drücken sie „Again“ ohne Aufforderung?

**Geübte erreichen im Median 150 bis 300 Züge.**
- Vorläufiger Standard: die Startwerte aus `docs/spec/balance.md`.
- Geklärt in: Meilenstein 7. Die Simulation liefert die Schätzung. Der Test mit
  Menschen bin ich selbst über mehrere Tage, weil im Spieltest nur Neulinge
  sitzen.

**Die Schätzwerte der Bots treffen echte Spieler.**
- Vorläufiger Standard: Geübte 0,8 s Entscheidungszeit und 2 % Fehlgriffe,
  Anfänger 1,6 s und 8 %.
- Geklärt in: Meilenstein 6, durch Abgleich mit den exportierten Protokollen
  aus Meilenstein 3.

**Der flache Anfang ermüdet nicht.** Die Stufen 1 bis 4 sind 44 Platzierungen
fast ohne Einsatz und kommen nach jedem „Again“ erneut.
- Vorläufiger Standard: Stufenlängen 8 / 10 / 12 / 14. Der flache Anfang ist
  gewollt.
- Geklärt in: Meilenstein 5 und 7, durch eigenes Spiel über viele Partien. Die
  Stufenlängen sind Konstanten, damit der Vergleich mit 6 / 6 / 8 / 10 ohne
  Umbau geht.

**Spieler finden den Wisch auch ohne Tutorial.** Zwei der drei Abwägungen
hängen am Abwurf.
- Vorläufiger Standard: Es bleibt bei der Entscheidung, im laufenden Spiel
  keinen Wisch-Hinweis zu geben.
- Geklärt in: Meilenstein 15, bei der Abnahme. Prüffrage: Entdeckt eine Person,
  die das Tutorial überspringt, den Wisch von selbst? Erst wenn nicht, wird die
  Entscheidung neu aufgerollt.

**ComfyUI liefert lokal einen brauchbaren Hintergrund und brauchbare Musik.**
- Vorläufiger Standard: ComfyUI bleibt.
- Geklärt in: Meilenstein 4, je eine Probe für Hintergrund, Effekt und Musik.

**Lizenz der Assets.**
- Vorläufiger Standard: von der MIT-Lizenz ausgenommen, alle Rechte vorbehalten.
- Geklärt in: Meilenstein 4, sobald die Modelle und ihre Lizenzen feststehen.

**Spielwerte und Varianten.** Die Liste der offenen Stellschrauben steht in
`docs/spec/balance.md`, Abschnitt 5.
- Vorläufiger Standard: die Startwerte dort.
- Geklärt in: Meilenstein 7 (Generator, Timer, Stufen, Strafzeiten, Vorrat) und
  Meilenstein 8 (Bonus-Auslöser).

**Grenzwerte für Bild und Ton.** Kontraste, Farbabstände, Größen und Pegel in
`docs/spec/grafik-audio.md` sind Startwerte.
- Vorläufiger Standard: die Werte dort.
- Geklärt in: Meilenstein 9 (Bild) und Meilenstein 11 (Ton).

**Darstellung und Rückmeldung des Aufräumers** (A62).
- Vorläufiger Standard: weißes Segment mit Wirbel-Symbol. Die Segmente des
  Rings fliegen spiralförmig hinaus. Der Klang ist das Leeren-Arpeggio
  rückwärts.
- Geklärt in: vor Beginn von Meilenstein 16, im Gespräch.

## 8. Secrets

Das Projekt hat keine Secrets.

- **Laufzeit:** kein Server, kein Konto, keine Schlüssel. Alles im
  ausgelieferten Paket ist öffentlich.
- **Deployment:** GitHub Actions nutzt das eingebaute Token. Es wird nichts
  hinterlegt.
- **Assets:** ComfyUI läuft lokal ohne Schlüssel.

Eine `.env`-Datei wird voraussichtlich nicht gebraucht. Die Schutzregeln aus den
Grundlagen (`.gitignore`, `.claude/settings.json`, `.claude/rules/secrets.md`)
bleiben bestehen. Kommt später doch ein Secret dazu, wird dieser Abschnitt
ergänzt.

## 9. Teilspecs

Die Einzelheiten stehen unter `docs/spec/`. Diese Datei bleibt die Übersicht.

| Datei | Inhalt |
|---|---|
| `anforderungen.md` | Nummerierte Anforderungen A1 bis A118 mit Randfällen, Ablauf-Tabelle und Speicherformat. Maßgeblich, wo sie vom Spielkonzept abweicht. |
| `teststrategie.md` | Was automatisch und was von Hand geprüft wird, kontrollierbarer Zufall und Zeit, Testhilfen, Liste der Konstanten |
| `meilensteine.md` | 16 Meilensteine mit Status, Ziel, Anforderungen, Abschlusskriterium, Übergangsverhalten und Abnahme-Checkliste |
| `balance.md` | System „Balance“: Startwerte, Prüfliste, offene Stellschrauben. Reviewer: `balance-reviewer` |
| `grafik-audio.md` | System „Grafik und Audio“: Stilvorgaben, Herkunft der Assets, Messwerte, Prüfliste. Reviewer: `grafik-audio-reviewer` |
| `spielkonzept.md` | Ursprungsdokument mit den Begründungen der Spielregeln |

Anforderungen an den Code, die aus der Teststrategie folgen:

- Der Zufallsgenerator wird dem Regelkern übergeben (siehe Abschnitt 4).
- Die Zeit wird dem Regelkern übergeben, er liest keine Uhr.
- Im Testmodus legt die App den Spielstand lesbar offen, weil Playwright in
  einer Zeichenfläche keine einzelnen Elemente sieht.

## 10. Definition of Done

Ein Meilenstein ist fertig, wenn:

1. Unit-Tests, Linter, Typprüfung, Build und Rauchtests grün sind,
2. der `code-reviewer` den Code geprüft hat, dazu der `docs-reviewer`, wenn sich
   Dokumentation geändert hat, und der `balance-reviewer` oder der
   `grafik-audio-reviewer`, wenn der Meilenstein ihr System berührt,
3. `README.md` und `docs/DEVELOPMENT.md` zum Stand passen,
4. ich die Abnahme-Checkliste des Meilensteins abgenommen habe, bei zweistufiger
   Abnahme die Stufe 1,
5. alles committet und der Branch mit `--ff-only` in `main` zusammengeführt ist.

Bei zweistufiger Abnahme (Meilenstein 3 und 15) folgt Stufe 2 nach Merge und
Push. Der Status des Meilensteins wird erst danach auf „erledigt“ gesetzt.

Der Ablauf je Meilenstein (Branch, Tests zuerst, Plan, Umsetzung, Reviews,
Abnahme) steht in der `CLAUDE.md` unter „Workflow per milestone“ und wird hier
nicht wiederholt.

## 11. Aufgesetzter Stack

Aufgesetzt am 2026-11-12 mit `setup-stack`. Das Grundgerüst steht damit: Etappe 1
beginnt direkt mit dem Spiel und muss kein Projekt mehr anlegen.

**Installierte Versionen** (exakt festgeschrieben in `package.json`):

| Baustein | Version |
|---|---|
| Node.js (lokal) | 26.13.0, festgeschrieben als `26` in `.node-version` und über `engines` |
| npm | 11.20.0 |
| TypeScript | 6.0.3 |
| Vite | 8.3.8 |
| PixiJS (`pixi.js`) | 8.23.0, seit Meilenstein 1 |
| Vitest | 5.1.0 |
| Playwright (`@playwright/test`) | 1.65.0, mit Chromium und WebKit |
| ESLint | 10.14.0, dazu `@eslint/js` 10.0.1 |
| typescript-eslint | 8.72.2 |
| Prettier | 3.10.1 |
| `@types/node` | 26.6.6 |

**Befehle:** `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`,
`npm run format`, `npm run e2e`, `npm run dev`, `npm run preview`. Die
maßgebliche Liste steht in der `CLAUDE.md`.

**Linter:** typbasierte Regeln (`strictTypeChecked`, `stylisticTypeChecked`),
dazu Grenzen für die Komplexität: zyklomatische Komplexität 10,
Verschachtelungstiefe 3, 60 Zeilen je Funktion, 4 Parameter, 3 verschachtelte
Callbacks. Funktionslänge und Callback-Tiefe gelten nicht in Testdateien.

**Stop-Hook:** `.claude/hooks/stop-checks.sh` läuft in Git Bash, sobald Claude
aufhören will, mit einem Zeitlimit von 180 Sekunden. Er führt Typprüfung, Linter
und Unit-Tests aus und hindert Claude bei einem Fehler am Aufhören. Solange die
Datei `.claude/.tests-first` existiert (Test-zuerst-Phase einer Etappe),
überspringt er die Unit-Tests. Typprüfung und Linter laufen weiter. Build und
Rauchtests sind nicht Teil des Hooks.

**Abweichungen und Ergänzungen zur Spec:**

- PixiJS ist seit Meilenstein 1 installiert (siehe Tabelle). `vite-plugin-pwa`
  ist noch nicht installiert und kommt in Meilenstein 15 (wie geplant).
- `@eslint/js` und `@types/node` standen nicht in Abschnitt 6. Das erste liefert
  das Basis-Regelset von ESLint, das zweite die Typen für Konfigurationsdateien
  und das spätere Simulationsskript.
- Die CI (`.github/workflows/ci.yml`) führt bei jedem Push Linter, Typprüfung,
  Vitest, Build und die Rauchtests aus. Das Deployment nach GitHub Pages fehlt
  noch und kommt in Etappe 1, damit keine leere Seite unter dem Link steht.
- Die `LICENSE` (MIT, Copyright WebCodingCat, Assets ausgenommen) liegt schon im
  Repo. `README.md` und `docs/DEVELOPMENT.md` entstehen in Etappe 1.
- Das Skript für README-Bilder entsteht in Etappe 3: `npm run screenshots` als
  eigener Playwright-Lauf mit festen Startwerten des Zufallsgenerators, der nach
  `docs/images/` schreibt, ohne neue Abhängigkeit und außerhalb des Stop-Hooks.
- `npm audit` meldet 10 Befunde mittlerer Schwere, alle über `minimatch` in
  ESLint und typescript-eslint (Entwicklungswerkzeuge, nicht im ausgelieferten
  Spiel). Eine Korrektur gäbe es nur durch den Rückschritt auf ESLint 9. Das
  wird hingenommen, bis die Pakete nachziehen.
