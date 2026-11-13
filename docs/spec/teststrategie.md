# Neon Pounce – Teststrategie

Die A-Nummern verweisen auf `anforderungen.md`.

## 1. Ebenen

| Ebene | Werkzeug | Was geprüft wird |
|---|---|---|
| Regelkern | Vitest | Alle Spielregeln als reine Funktionen, ohne Browser |
| Daten | Vitest | Speicherformat, Palette, Effekt-Rezepte, Konfiguration |
| Simulation | Vitest und `npm run sim` | Bots, Wiederholbarkeit, Messwerte |
| Oberfläche | Playwright (Chromium, WebKit, emuliertes Handy) | wenige Rauchtests über den Testmodus (A110) |
| Von Hand | eigene Geräte, Freunde | Gefühl, Optik, Ton, Tempo, Leistung, Installation |

## 2. Kontrollierbarer Zufall und Zeit

- Der Regelkern bekommt seinen Zufallsgenerator mit Startwert übergeben (A35).
  Tests nutzen feste Startwerte oder einen Generator, der eine vorgegebene Folge
  liefert.
- Der Regelkern liest keine Uhr. Jede Eingabe und jeder Zeitschritt trägt die
  Zeit als Argument. Tests stellen die Zeit selbst vor.
- In den Rauchtests übernimmt das der Testmodus: Startwert über die Adresse,
  Zeit über die Funktion unter `window.__neonPounce` (A110).

## 3. Automatisch geprüft

| Anforderungen | Was der Test festlegt |
|---|---|
| A1 bis A3 | Geometrie als reine Funktion: Mittelpunkte der Ringe, Winkel und Fugen der Plätze, Lage des Timer-Bogens für eine gegebene Feldgröße |
| A4 | Feld als reine Funktion: Breite höchstens 520 CSS-Pixel, sichere Bereiche, Zentrierung, schmaleres Feld bei geringer Höhe |
| A97 | Renderauflösung höchstens Faktor 2 |
| A107 | Bildraten-Statistik als reine Funktion (aktueller Wert, Mittel, schlechteste Sekunde, verworfene Zeit, Grenzwerte der Leistungsprobe). Rauchtest: Im gebauten Stand gibt es keine Bildraten-Anzeige |
| A6 bis A9 | Zuordnung Berührpunkt zu Ring, Reihenfolge mehrerer Finger, Wisch-Erkennung beim Verlassen der Mitte, Doppeltipp-Fenster an den Grenzen 99 und 100 ms |
| A10 | Eingaben aus einem früheren Zustand werden verworfen |
| A12 bis A15 | Platzierung, Fehltipp, sofortiges Folgesegment, erstes Segment ohne Timer und ohne Abwurf |
| A16 bis A18 | Leerung beim sechsten Segment, Einfarbig mit und ohne Joker, Vorrat an der Obergrenze |
| A19 bis A24 | Timer je Segment, Strafstaffel einschließlich fünftem Fehltipp, Timeout durch Strafzeit, Leben, Ende nach 1 s |
| A25 bis A30 | Vorrat, Abwurf, Aufgabe bei 0, Blockade-Erkennung, Aufleuchten nur auf Stufe 1 bis 4 und nur bei Blockade |
| A31 bis A35 | Farben nur aus der Stufe, Beutel liefert jede Position gleich oft, Gewichtung nie 0, gleiche Partie bei gleichem Startwert |
| A36 bis A43 | Stufenlängen, Timer-, Farb- und Multiplikator-Tabelle, Werte ab dem nächsten Segment, Endlosphase bis zum Minimum |
| A44 bis A50 | Punkteformel mit allen Faktoren, Rundung, Combo-Zählung, Rücksetzen, längste Combo über 6 |
| A51 bis A57 | Auslöser erhöhen die Chance, Rückfall auf den Grundwert, Joker-Platz, Joker in Einfarbig, Ring nur aus Jokern |
| A58 bis A61 | Aufräumer auf vollem, einfarbigem, gemischtem, einzelnem und leerem Ring |
| A63 (Zuordnung) | Jedes Ereignis des Regelkerns löst genau die Rückmeldung und den Effekt aus der Tabelle aus |
| A67 | Kontrast und Unterscheidbarkeit der Palette (Grenzwerte in `grafik-audio.md`) |
| A73, A74 | Tonhöhe je Füllstand und je Combo-Stufe als Daten |
| A83 | Ablauf-Tabelle als Zustandsmaschine: jeder Übergang, keine weiteren |
| A85 bis A91 | Pause-Auslöser, Restzeit nach dem Countdown, Unterbrechung des Countdowns, Sonderfälle |
| A92 bis A95 | Lesen fehlender, kaputter und teilweise ungültiger Daten, Schreiben ohne unbekannte Felder, Highscore-Regel |
| A109 | Form und Inhalt des Protokolls |
| A111 bis A115 | Jeder Bot spielt regelgerecht, gleicher Startwert ergibt gleichen Bericht, Varianten erscheinen im Bericht |
| A98, A99, A100, A104, A110 | Rauchtests: App lädt unter dem Basispfad, ein Tipp legt ein Segment, Game Over erscheint, ab Meilenstein 15 Start ohne Netz und gültiges Manifest |
| A102 | Rauchtest: Während einer Partie geht keine Anfrage an einen fremden Server |
| A116 | Kurzer Simulationslauf in der CI |

Die Rauchtests bleiben wenige. Sie prüfen, dass die Teile zusammen laufen, nicht
die Regeln.

## 4. Manuell geprüft

Was Tests nicht sehen können, steht als Checkliste beim jeweiligen Meilenstein
in `meilensteine.md`, jeweils mit Handlung und erwartetem Ergebnis:

- Spielgefühl, Tempo und Treffsicherheit auf dem Handy (A6 bis A8)
- Leistung auf echten Geräten (A97)
- Optik, Lesbarkeit und Stil (A63 Bild, A65 bis A69)
- Klang, Lautstärke und nahtlose Schleife (A70 bis A75)
- Vibration (A64)
- Verständlichkeit von Tutorial und How to play (A77, A79)
- Installation und Offline-Betrieb auf echten Geräten (A99 bis A101)
- Kurztest und Spieltest mit Freunden (SPEC.md, Offene Annahmen)
- Abstimmung der Spielwerte (`balance.md`)

Ohne Test bleiben außerdem: A4 (Darstellung auf den Geräten; die Berechnung des
Felds ist getestet), A11 (Maus, ausdrücklich ungetestet), A62 (noch offen), A96
(Zielsysteme, geprüft werden nur die Testgeräte), A101 (Update, nur von Hand
prüfbar), A107 (die Anzeige selbst und „Export“; die Statistik ist getestet),
A108 (Leistungsprobe), A117 und A118 (Dokumentation, geprüft vom
`docs-reviewer`).

## 5. Übergangsverhalten

Verhalten, das nur bis zu einem späteren Meilenstein gilt, bekommt keinen
automatischen Test. Es steht beim Meilenstein unter „Übergangsverhalten“ und
wird per Checkliste geprüft. Tests decken nur Verhalten ab, das in allen
späteren Meilensteinen gültig bleibt.

## 6. Testhilfen

- Konfigurationsdatei statt Reglern (A106)
- Bildraten-Anzeige und Protokoll-Export im Entwicklungsserver (A107, A109)
- Leistungsprobe (A108)
- Testmodus mit Startwert, lesbarem Spielstand und steuerbarer Zeit (A110)
- Screenshot-Lauf `npm run screenshots` ab Meilenstein 9 (feste Startwerte,
  schreibt nach `docs/images/`, außerhalb des Stop-Hooks)

## 7. Konstanten

Alle Werte, die nach Gefühl oder Simulation nachjustiert werden, stehen in
`src/config.ts` und nirgends sonst:

- **Timer:** Zeit je Stufe 1 bis 12, Abnahme je Stufe nach 12, absolutes
  Minimum, Strafstaffel, Doppeltipp-Fenster, Dauer des Ausblendens vor Game
  Over, Sperre der Schaltflächen im Game Over, Countdown nach der Pause
- **Partie:** Leben, Abwürfe am Start und höchstens, letzte Stufe mit
  Blockade-Hilfe
- **Stufen:** Länge je Stufe, Länge ab Stufe 12, Farbzahl je Stufe,
  Multiplikator je Stufe
- **Punkte:** Platzierung, Leerung, Einfarbig-Faktor, Joker-Ring-Faktor,
  Combo-Obergrenze
- **Generator:** Kopien je Position im Beutel, Stärke der Gewichtung,
  Mischverhältnis, Länge und Stärke des gnädigen Anfangs
- **Bonus:** Grundwert, Zuwachs je Auslöser, Obergrenze, Anteil je Bonus-Art
- **Bots:** Entscheidungszeit, Streuung und Fehlgriff-Quote für Geübte und
  Anfänger, Zahl der Partien je Lauf
- **Rückmeldung:** Dauer der Vibrationen, Dauer der Animationen
- **Ton:** Lautstärke von Effekten, Musik in der Partie und Musik im Menü
- **Darstellung:** Obergrenze der Renderauflösung, größte Feldbreite, kleinstes
  Seitenverhältnis des Felds, Proportionen des Bretts (Ringabstand, Ringradius,
  Mitte, Timer-Bogen, Fuge; Platzhalter bis Meilenstein 9)
- **Entwicklung:** Schalter für die Leistungsprobe, ihre Dauer und Grenzwerte,
  Partikelzahl und Tempo der Probe

Palette, Symbole und Effekt-Rezepte sind eigene Datendateien (siehe
`grafik-audio.md`).
