Status: grob (project-scope, 2026-11-12)

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

**Kernmechanik in Kurzform.** Die vollständigen Regeln stehen im Spielkonzept
unter `docs/spec/spielkonzept.md`. Wo diese Datei „Konzept“ sagt, ist es
gemeint.

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
  Endpunktzahl je Strategie (die Multiplikatoren stapeln sich bis ×67,5).
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
- Grafiken, Soundeffekte und Musik entstehen lokal über ComfyUI und liegen dem
  Spiel als Dateien bei. Einfache Effekte und Grafiken dürfen auch per Code
  entstehen.
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
| Offline und Installation | vite-plugin-pwa | 2.0 (ab Etappe 4) |

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

Grafiken, Soundeffekte und Musik kommen aus ComfyUI auf dem eigenen Rechner und
liegen dem Spiel als Dateien bei. Einfache Effekte und Grafiken dürfen per Code
entstehen. Modelle, Workflows und Installation klärt `/wcc:asset-setup`. Die
Modelldateien kommen nicht ins Repo. Workflows, die ins Repo kommen, enthalten
keine lokalen Pfade mit Benutzernamen.

## 7. Offene Annahmen

**PixiJS hält 60 Bilder pro Sekunde auf echten Handys.**
- Vorläufiger Standard: PixiJS 8.23 bleibt.
- Geklärt in: Etappe 1, Leistungsprobe. Prüffrage: Hält ein volles Feld mit 36
  leuchtenden Segmenten und Partikeln fünf Minuten am Stück stabile 60 Bilder
  pro Sekunde auf dem iPhone 17 und dem Android-Handy? Wenn nicht, wird der
  Renderer neu entschieden, bevor Look und Sound darauf aufbauen.

**Neue Spieler verstehen mit einem Satz, dass die Position feststeht.**
- Vorläufiger Standard: Das Konzept bleibt.
- Geklärt in: Etappe 1, Kurztest mit ein oder zwei Freunden in zwei
  Durchgängen.
  - Erster Durchgang, etwa fünf Minuten mit der festen Einstellung aus dem
    Konzept (etwa 3 Farben, 4 s, jede Position zweimal im Beutel). Prüffrage:
    Verstehen sie nach einem Satz Erklärung, dass sie nur den Ring wählen?
  - Zweiter Durchgang mit harter Einstellung über die Entwickler-Regler (etwa
    5 Farben, 2,5 s), damit die Partie sicher im Game Over endet. Prüffrage:
    Drücken sie „Again“ ohne Aufforderung? Mit der leichten Einstellung verliert
    in fünf Minuten kaum jemand drei Leben, die Frage bliebe sonst
    unbeantwortet.

**Geübte erreichen im Median 150 bis 300 Züge.**
- Vorläufiger Standard: die Startwerte aus dem Konzept.
- Geklärt in: Etappe 2. Die Simulation liefert die Schätzung. Der Test mit
  Menschen bin ich selbst über mehrere Tage, weil im Spieltest nur Neulinge
  sitzen. Damit die Bots nicht auf geratenen Werten rechnen, protokolliert schon
  Etappe 1 je Segment Entscheidungszeit und Fehltipps, auch bei harter
  Einstellung (6 Farben, 2 s). Welcher Bot mit welchen Werten „Geübte“ und
  „Anfänger“ darstellt, legt `project-details` fest.

**Der flache Anfang ermüdet nicht.** Die Stufen 1 bis 4 sind 44 Platzierungen
fast ohne Einsatz und kommen nach jedem „Again“ erneut.
- Vorläufiger Standard: Stufenlängen 8 / 10 / 12 / 14 wie im Konzept. Der flache
  Anfang ist gewollt.
- Geklärt in: Etappe 2, durch eigenes Spiel über viele Partien. Das misst weder
  die Simulation noch ein Test mit Neulingen. Die Stufenlängen sind einstellbare
  Werte, damit der Vergleich mit 6 / 6 / 8 / 10 ohne Umbau geht.

**Spieler finden den Wisch auch ohne Tutorial.** Zwei der drei Abwägungen
hängen am Abwurf.
- Vorläufiger Standard: Es bleibt bei der Entscheidung, im laufenden Spiel
  keinen Wisch-Hinweis zu geben.
- Geklärt in: Etappe 4, bei der Abnahme. Prüffrage: Entdeckt eine Person, die
  das Tutorial überspringt, den Wisch von selbst? Erst wenn nicht, wird die
  Entscheidung neu aufgerollt.

**ComfyUI liefert lokal brauchbare Grafik, Effekte und Musik.**
- Vorläufiger Standard: ComfyUI bleibt.
- Geklärt in: Etappe 1, je ein Probe-Asset für Grafik, Effekt und Musik. Die
  Modelle wählt `/wcc:asset-setup`.

**Lizenz der Assets.**
- Vorläufiger Standard: von der MIT-Lizenz ausgenommen, alle Rechte vorbehalten.
- Geklärt in: `/wcc:asset-setup`, sobald die Modelle und ihre Lizenzen
  feststehen.

**Spielwerte und Varianten.** Die vollständige Liste steht im Konzept,
Abschnitt 12 und 14.
- Vorläufiger Standard: die Startwerte aus dem Konzept.
- Geklärt in `project-details` (Regeln und Rückmeldungen):
  - Aufräumer: Ab wie vielen Segmenten zählt sein Einfarbig-Bonus? Wie sieht
    seine Rückmeldung aus?
  - Bis zu welcher Stufe leuchten die belegten Plätze nach einem
    Blockade-Timeout auf?
  - Fehlende Rückmeldungen: Einfarbig bei vollem Vorrat, Klang beim
    Combo-Abbruch.
- Geklärt in Etappe 2 (Simulation und Spieltest):
  - Bonus-Segmente: Welche Ereignisse erhöhen ihre Chance, und um wie viel?
  - Positionsgenerator: Verhältnis von Beutel und Gewichtung, Form des gnädigen
    Anfangs.
  - Timer auf Stufe 12: 2,0 s oder 2,5 s.
  - Timer nach Stufe 12: Wie schnell sinkt er auf sein absolutes Minimum, und
    liegt das bei 1,8 s? Das ist eine andere Frage als der Timer auf Stufe 12.
  - Wie viele Platzierungen dauert eine Stufe nach Stufe 12?
  - Variante: Auf einer Stufe mit neuer Farbe wird der Timer nicht verkürzt.
  - Variante: kürzere erste Stufen (6 / 6 / 8 / 10).
  - Staffel der Strafzeiten: 0,5 / 1 / 2 / 4 s gegen flachere und steilere.
  - Abwurf-Vorrat: ein Abwurf je Stufenaufstieg, oder Punkte statt Abwurf bei
    Einfarbig mit vollem Vorrat.
  - Prüfpunkt: Dominiert der Combo-Jäger, weil Abwürfe nicht für den
    Stufenaufstieg zählen?
  - Prüfpunkt: Wie lang werden die Partien des besten Bots nach Stufe 12? Bei
    einem langen flachen Ende käme ein wachsender Beutel in Frage.

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

## 9. Teststrategie (grob)

| Ebene | Werkzeug | Was geprüft wird |
|---|---|---|
| Regelkern | Vitest 5.1 | Alle Spielregeln als reine Funktionen: Platzieren, Fehltipp, Leeren, Einfarbig, Combo, Strafzeiten, Stufen, Generator. Ohne Browser. |
| Simulation | eigenes Skript unter Node | Bots spielen tausende Partien und liefern die Messwerte zur Abstimmung. Das ist ein Abstimmwerkzeug. In der CI prüft nur ein kurzer Lauf, dass es funktioniert. |
| Oberfläche | Playwright 1.65 | Wenige Rauchtests mit emuliertem Handy-Bildschirm in Chromium und WebKit: Die App lädt, ein Tipp legt ein Segment, Game Over erscheint. Ab Etappe 4 auch der Start ohne Netz. |
| Von Hand | eigene Geräte, Freunde | Spielgefühl, Lesbarkeit, Ton, Leistungsprobe, Installation auf dem Startbildschirm, Kurztest und Spieltest. |

Anforderungen an den Code, die daraus folgen:

- Der Zufallsgenerator wird dem Regelkern übergeben (siehe Abschnitt 4).
- Die Zeit wird dem Regelkern übergeben, er liest keine Uhr.
- Im Testmodus legt die App den Spielstand lesbar offen, weil Playwright in
  einer Zeichenfläche keine einzelnen Elemente sieht.

## 10. Noch offen für das feine Interview

- **Anforderungen im Detail.** Quelle ist das Spielkonzept unter
  `docs/spec/spielkonzept.md` (Spielfeld, Kern-Schleife, Regeln, Rückmeldungen,
  Look und Sound, Bildschirme, Abstimmung der Spielwerte).
- **Meilensteine mit Abschlusskriterien.** Ausgangspunkt sind die fünf Etappen
  aus dem Konzept, Abschnitt 15:
  1. Kleinste spielbare Version auf einem echten Handy, mit Leistungsprobe,
     Probe-Assets und Kurztest in zwei Durchgängen. Dazu gehören
     Entwickler-Regler für Timer, Farbzahl, Strafzeiten und Beutelgröße (damit
     sich auch 6 Farben bei 2 s ausprobieren lassen) und ein Protokoll von
     Entscheidungszeit und Fehltipps je Segment.
  2. Regelkern und Simulation: Stufen, Punkte, Combo, Positionsgenerator,
     Bonus-System mit Joker, Bot-Simulation, Spieltest
  3. Look, Game Feel, Sound und Musik
  4. Bildschirme: Start, How to play, Tutorial, Pause, Game Over, Highscore,
     Installation als PWA
  5. Aufräumer als zweiter Bonus
- **Definition of Done.**
- **Formate, Palette und Messwerte der Assets**, aufbauend auf ComfyUI.
- **Zielgeräte genauer:** älteste iOS- und Android-Version, die unterstützt
  wird.
