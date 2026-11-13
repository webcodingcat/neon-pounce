# Neon Pounce – System „Grafik und Audio“

Dieses System umfasst alles, was der Spieler sieht und hört. Der
`grafik-audio-reviewer` bewertet es als Ganzes gegen die Prüfliste in Abschnitt
6. Die A-Nummern verweisen auf `anforderungen.md`.

Die Werte in dieser Datei sind Startwerte. Meilenstein 9 (Stil) legt Palette,
Symbole, Schrift und Proportionen fest und trägt sie hier ein.

## 1. Stilvorgaben

- **Bild:** viel Neon. Leuchtende, hochgesättigte Farben mit Glow auf dunklem
  Grund. Hintergrund und Menüs sind blau-schwarz. Der Look wird mit den Stufen
  intensiver (A65).
- **Schrift:** futuristisch, für Menüs und Zahlen dieselbe (A69).
- **Klang:** futuristisch, sauber, glänzend, Synthwave. Ausdrücklich nicht
  retro: kein 8-Bit- und kein Chiptune-Klang (A75). Mittel dafür sind
  FM-Synthese, mehrere leicht verstimmte Schichten, Hall und Echo über einen
  gemeinsamen Effektweg, gleitende Filter.
- **Segmente:** Kuchenstücke bis zur Ringmitte, mit schmalen Fugen (A2).
- **Timer-Bogen:** Regenbogen-Verlauf, der bei Rot endet (A66). Die Ähnlichkeit
  zum Joker ist gewollt hingenommen.

## 2. Woher die Assets kommen

| Asset | Quelle | Liegt im Repo als |
|---|---|---|
| Ringe, Segmente, Symbole, Glow, Partikel, Timer-Bogen, HUD-Symbole | Code | Palette und Formen als Daten, Texturen entstehen beim Start |
| Soundeffekte | Code (Web Audio) | Rezepte als Daten: Wellenform, Frequenzen, Hüllkurve, Lautstärke |
| Hintergrundbild | ComfyUI, lokal | Bilddatei, dazu Workflow ohne lokale Pfade |
| Musik | ComfyUI, lokal | Audiodatei, dazu Workflow ohne lokale Pfade |
| Schrift | freie Schrift (SIL Open Font License) | Schriftdatei mit Lizenztext |

- Die Asset-Kette richtet `/wcc:asset-setup` ein (Meilenstein 4), einzelne
  Assets erzeugt `/wcc:asset`. Modelldateien kommen nicht ins Repo.
- Effekte: Zunächst entstehen alle per Code. In Meilenstein 11 werden Effekte
  ohne feste Tonhöhe (`discard`, `timeout`, `levelUp`, `bonus`) mit Varianten
  aus ComfyUI verglichen. Die Entscheidung fällt je Effekt. Das Spiel ruft nur
  „Effekt mit Tonhöhe“ auf, die Quelle dahinter ist austauschbar.
- Bis Meilenstein 9 nutzt das Spiel Platzhalter: einfarbige Keile mit einfachen
  Symbolen, kein Hintergrundbild, Systemschrift.
- **Lizenz:** Die Assets aus ComfyUI sind von der MIT-Lizenz ausgenommen, bis
  die Lizenzen der Modelle feststehen (SPEC.md, Offene Annahmen). Die Schrift
  behält ihre eigene Lizenz, der Lizenztext liegt neben der Datei, und das
  README nennt sie.

## 3. Bild: Messwerte

| Größe | Grenzwert |
|---|---|
| Kontrast jeder Segmentfarbe gegen den Hintergrund | mindestens 4,5 : 1 |
| Kontrast des Symbols gegen seine Segmentfarbe | mindestens 4,5 : 1 |
| Kontrast von Text und Zahlen gegen den Hintergrund | mindestens 7 : 1 |
| Farbabstand zweier Segmentfarben (CIEDE2000), normales Sehen | mindestens 20 |
| Farbabstand bei simulierter Protanopie, Deuteranopie, Tritanopie | mindestens 8 |
| Durchmesser eines äußeren Rings bei 360 CSS-Pixeln Bildschirmbreite | mindestens 96 CSS-Pixel |
| Größe eines Symbols auf einem Segment | mindestens 14 CSS-Pixel |
| Größe der Zahlen im HUD | mindestens 16 CSS-Pixel |
| Größe einer Schaltfläche | mindestens 48 × 48 CSS-Pixel |
| Hintergrundbild | WebP, 1440 × 2560, höchstens 400 KB |
| Schriftdatei | WOFF2, höchstens 100 KB |

Die sechs Symbole unterscheiden sich in der Grundform (Startvorschlag: Kreis,
Dreieck, Quadrat, Raute, Stern, Kreuz), nicht nur im Detail. Der Stern des
Jokers ist von allen sechs unterscheidbar.

## 4. Ton: Messwerte

| Größe | Grenzwert |
|---|---|
| Spitzenpegel jedes Effekts | höchstens −3 dBFS |
| Spitzenpegel der Musik | höchstens −1 dBFS |
| Mittlerer Pegel (RMS) der Musik | −20 dBFS ± 2 |
| Abstand Effekte zu Musik in der Partie | Effekte mindestens 6 dB lauter |
| Musik im Menü | halbe Lautstärke der Partie (−6 dB) |
| Länge eines Effekts | höchstens 1,5 s, `place` und `tick` höchstens 0,2 s |
| Stille am Anfang eines Effekts | höchstens 10 ms |
| Übersteuern (Werte über 0 dBFS) | nie, auch nicht bei gleichzeitigen Effekten |
| Musikdatei | MP3, 44,1 kHz, Stereo, 160 kbit/s, Länge 60 bis 120 s, höchstens 3 MB |
| Schleife | Start- und Endpunkt als Daten, kein hörbarer Sprung |

## 5. Ereignis und Klang

Die Tabelle in A63 nennt je Ereignis den Effekt. Die Effekte:

| Effekt | Beschreibung | Tonhöhe |
|---|---|---|
| `place` | weicher, glasiger Plopp | steigt mit dem Füllstand des Rings (A73) |
| `miss` | tiefes, kurzes Brummen | fest |
| `clear` | aufsteigendes Arpeggio | je Combo-Stufe einen Halbton höher (A74) |
| `clearMono` | helleres Arpeggio mit Glitzern | je Combo-Stufe einen Halbton höher (A74) |
| `discard` | Whoosh | fest |
| `timeout` | fallender Sweep | fest |
| `levelUp` | anschwellender Akkord | fest |
| `bonus` | Schimmer | fest |
| `tick` | leises Ticken in den letzten 25 % des Timers | fest |

Der Combo-Abbruch hat keinen Klang. Der Aufräumer bekommt seinen Klang in
Meilenstein 16.

## 6. Prüfliste

**Was Tests und Skripte entscheiden** (nicht der Reviewer):

- Kontraste und Farbabstände aus den Palettenkonstanten (Abschnitt 3)
- Mindestgrößen aus der Geometrie bei 360 CSS-Pixeln Breite
- Format und Dateigröße von Hintergrund, Musik und Schrift
- Länge und rechnerische Lautstärke der Effekt-Rezepte
- Gerenderte Spitzenpegel und Übersteuern, gemessen in einem Playwright-Lauf
- Jedes Ereignis löst genau den Effekt aus Abschnitt 5 aus

**Was der Reviewer beurteilt.** Er bekommt Screenshots aus `npm run
screenshots` (Partie auf Stufe 1, 6 und 12, volles Feld, Pause, Game Over,
Start, How to play, Tutorial) und die Messwerte. Die Pfade nennt der Aufruf.

1. Lesbarkeit: Position, Farbe und Symbol des Segments in der Mitte sind auf
   einen Blick erkennbar, auch auf Stufe 12 mit vollem Feld.
2. Überlappung: Popups, Partikel und HUD verdecken weder die Mitte noch belegte
   Plätze.
3. Abgeschnittene Elemente: Nichts ragt aus dem Feld oder unter Notch und
   Home-Leiste.
4. Hierarchie: Das aktuelle Segment und der Timer-Bogen ziehen den Blick zuerst
   an, das HUD danach, der Hintergrund zuletzt.
5. Der Hintergrund konkurriert nicht mit den Segmenten (Helligkeit, Sättigung,
   Details hinter den Ringen).
6. Der intensivere Look auf hohen Stufen verschlechtert die Lesbarkeit nicht.
7. Timer-Bogen und Joker sind trotz Regenbogen nicht zu verwechseln.
8. Leere Plätze, belegte Plätze und das Pausenbild (leere Umrisse) sind klar
   unterscheidbar.
9. Das „Aufgeben“-Symbol ist vom Abwurf-Symbol deutlich zu unterscheiden.
10. Ton, nur anhand der Messwerte: Pegelverhältnisse eingehalten, kein Effekt
    fällt in Länge oder Pegel aus der Reihe.

**Was nur du beurteilst** (manuelle Punkte in den Checklisten): Stil und
Stimmung, ob es nach Neon und Zukunft aussieht, Klangcharakter, ob die Musik
trägt, ob die Schleife nahtlos klingt.
