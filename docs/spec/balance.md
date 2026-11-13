# Neon Pounce – System „Balance“

Dieses System umfasst alle Spielwerte, die zusammen bestimmen, wie lang, wie
schwer und wie fair eine Partie ist. Der `balance-reviewer` bewertet es als
Ganzes gegen die Prüfliste in Abschnitt 4. Die A-Nummern verweisen auf
`anforderungen.md`.

## 1. Teile des Systems

| Teil | Anforderungen | Wirkt auf |
|---|---|---|
| Timer und Strafzeiten | A19 bis A21, A37 | Timeouts, Lebensverluste |
| Leben und Abwurf-Vorrat | A22, A25 bis A27 | Länge der Partie, Abfedern von Blockaden |
| Segment-Generator | A31 bis A34 | Blockaden (Unwucht), Einfarbig-Chance |
| Stufen | A36 bis A41 | Tempo der Steigerung, Farbzahl |
| Punkte und Combo | A44 bis A50 | Anreiz für Sortieren und Risiko |
| Bonus-Segmente | A51 bis A61 | Belohnung, Rettung |

**Wie die Teile ineinandergreifen:** Gutes Sortieren füllt den Abwurf-Vorrat,
der Blockaden abfedert. Mit mehr Farben wird Einfarbig seltener, der Vorrat
sinkt, Blockaden werden gefährlicher. Abwürfe halten die Combo, kosten aber den
Vorrat. Blockaden entstehen aus der Unwucht der gezogenen Positionen (Generator)
und dem Füllstand (Spieler). Die Begründungen stehen im Spielkonzept, Abschnitt
5, 6 und 12.

**Nachbarsysteme:** Grafik und Audio (`grafik-audio.md`) macht die Werte
sichtbar und hörbar, ändert sie aber nicht.

## 2. Startwerte

Alle Werte stehen in `src/config.ts`. Diese Tabelle wird nachgezogen, wenn ein
Meilenstein Werte ändert.

| Stufe | Platzierungen | Timer (s) | Farben | Multiplikator |
|---|---|---|---|---|
| 1 | 8 | 5,5 | 2 | 1,00 |
| 2 | 10 | 5,2 | 2 | 1,25 |
| 3 | 12 | 4,9 | 3 | 1,50 |
| 4 | 14 | 4,5 | 3 | 1,75 |
| 5 | 16 | 4,2 | 4 | 2,00 |
| 6 | 18 | 3,9 | 4 | 2,25 |
| 7 | 20 | 3,6 | 5 | 2,50 |
| 8 | 22 | 3,3 | 5 | 2,75 |
| 9 | 24 | 3,0 | 6 | 3,00 |
| 10 | 26 | 2,6 | 6 | 3,25 |
| 11 | 28 | 2,3 | 6 | 3,50 |
| 12 | 28 | 2,0 | 6 | 3,75 |
| ab 13 | 28 | je Stufe −0,05 bis 1,8 | 6 | 3,75 |

Weitere Startwerte: Strafstaffel 0,5 / 1 / 2 / 4 s. 3 Leben. Abwürfe 3 am
Start, höchstens 5. Beutel mit jeder Position zweimal. Bonus: Grundwert 0 %,
einfarbiger Ring +10, Combo ab 3 +5, Obergrenze 30 %. Einfarbig-Faktor 3,
Joker-Ring-Faktor 10, Combo-Faktor höchstens 6. Bots: Geübte 0,8 s und 2 %,
Anfänger 1,6 s und 8 %.

Höchster Gesamtfaktor einer Leerung: 3,75 × 3 × 6 = 67,5, beim Ring nur aus
Jokern 3,75 × 10 × 6 = 225.

## 3. Was Tests entscheiden

Nachrechenbares prüfen Tests, nicht der Reviewer:

- Die Tabellen in Abschnitt 2 stimmen mit der Konfiguration und den Formeln
  überein (A36 bis A39).
- Die Timer-Kurve fällt von Stufe zu Stufe und hat keinen Schritt über 0,4 s.
- Die Summe der Strafstaffel liegt über dem längsten Timer.
- Der Beutel liefert jede Position gleich oft, die Gewichtung nie
  Wahrscheinlichkeit 0 (A32, A33).
- Die Bonus-Chance bleibt zwischen Grundwert und Obergrenze (A52).
- Die Simulation ist wiederholbar (A114).

## 4. Prüfliste

Der Reviewer bewertet die Messwerte aus dem Bericht der Simulation (A113) und
die Werte im Zusammenhang. Die Schwellen sind Ziele, keine Tests.

**Ziele**

1. Geübte (vorausplanender Bot): Median 150 bis 300 Züge je Partie.
2. Anfänger-Bot: erreicht in mindestens 80 % der Partien Stufe 4.
3. Erzwungene Lebensverluste auf Stufe 1 bis 4 (Timeout oder Aufgabe bei
   Blockade ohne Abwurf): im Mittel unter 0,1 je Partie, für jeden Bot.
4. Erster geleerter Ring: im Median nach höchstens 12 Platzierungen, aber nicht
   in jeder Partie nach genau 6.
5. Können lohnt sich: Der vorausplanende Bot liegt bei Zügen und Punkten
   deutlich vor dem Anfänger-Bot (Median mindestens doppelt so hoch).

**Entscheidungen des Spielers bleiben echt**

6. Unter den Bots mit vergleichbarem Planungsaufwand (vollster Ring, ein Ring
   pro Farbe, Combo-Jäger) ist keiner in Zügen und Punkten zugleich der beste.
7. Einfarbig lohnt sich weder nie noch immer: Die Einfarbig-Quote sinkt mit der
   Farbzahl, bleibt bei 5 und 6 Farben aber über 5 % der Leerungen des
   Bots „ein Ring pro Farbe“.
8. Der Abwurf-Vorrat ist je Stufe weder dauernd leer noch dauernd voll (Mittel
   zwischen 1 und 4 auf jeder Stufe, für den vorausplanenden Bot).
9. Ein volles Feld ist gefährlicher als ein leeres: Die Blockade-Rate steigt mit
   dem Füllstand, auch beim Combo-Jäger.

**Risiken**

10. Blockaden durch reines Pech: Blockaden bei niedrigem Füllstand (unter der
    Hälfte) bleiben selten.
11. Glück entscheidet die Partie: Die Streuung der Punkte je Bot ist nicht so
    groß, dass eine einzelne Leerung mit hohem Faktor den Median der Partie
    übertrifft. Der Ring nur aus Jokern (Faktor 225) ist dabei ausdrücklich zu
    prüfen: Er darf vorkommen, aber nicht regelmäßig.
12. Gewichtung nimmt das Risiko: Eine starke Gewichtung liefert auf vollem Feld
    bevorzugt passende Segmente (siehe Ziel 9).
13. Langes flaches Ende: Die Partien des besten Bots nach Stufe 12 ziehen sich
    nicht über hunderte Züge ohne steigende Gefahr.
14. Combo-Jäger dominiert, weil Abwürfe nicht für den Aufstieg zählen.
15. Bonus-Segmente werden zur Regel statt zur Belohnung (Anteil an allen
    Segmenten über 10 %) oder kommen praktisch nie vor (unter 1 %). Dass sie
    sich auf den frühen Stufen häufen und auf den späten versiegen, ist gewollt
    und kein Befund: Am Anfang soll viel Belohnung ein gutes Spielgefühl
    erzeugen, am Ende darf es schwerer und etwas frustrierend werden.16. Aufräumer: Mit dem Einfarbig-Bonus ab 2 Segmenten wird „zwei gleiche legen,
    dann aufräumen“ zur besten Verwendung. Prüfen, sobald er gebaut ist. Dabei
    auch prüfen, ob sich Boni selbst nachliefern, falls ein einfarbiger
    Aufräumer-Ring als Bonus-Auslöser zählt.

**Sprünge und Lücken**

17. Kein Stufenwechsel verschlechtert zwei Größen so stark zugleich, dass die
    Lebensverluste dort sprunghaft steigen (neue Farbe und kürzerer Timer).
18. Die Blockade-Hilfe (A30) bleibt ungesehen: Erscheint sie beim Anfänger-Bot
    nur in einem kleinen Teil der Partien, wirkt die erste echte Blockade ab
    Stufe 5 wie Willkür.

## 5. Offene Stellschrauben

Geklärt in Meilenstein 7 (Generator und Abstimmung) und 8 (Bonus), durch
Simulation und eigenes Spiel. Entschiedene Werte wandern in Abschnitt 2.

- Positionsgenerator: Verhältnis von Beutel und Gewichtung, Form des gnädigen
  Anfangs
- Timer auf Stufe 12: 2,0 s oder 2,5 s
- Timer nach Stufe 12: Tempo der Abnahme, Minimum bei 1,8 s
- Länge der Stufen nach Stufe 12
- Variante: Auf einer Stufe mit neuer Farbe wird der Timer nicht verkürzt
- Variante: kürzere erste Stufen (6 / 6 / 8 / 10)
- Strafstaffel: 0,5 / 1 / 2 / 4 s gegen flachere und steilere
- Abwurf-Vorrat: ein Abwurf je Stufenaufstieg, oder Punkte statt Abwurf bei
  Einfarbig mit vollem Vorrat
- Bonus-Auslöser, je Bonus-Art: welche Ereignisse, wie viel Zuwachs, und wie
  Beutel und Chance dabei zusammenwirken (Joker in Meilenstein 8, Aufräumer in
  Meilenstein 16)
- Blockade-Hilfe: letzte Stufe, auf der sie erscheint (Startwert 4), entschieden
  nach dem Messwert zu Risiko 18
- Endlosphase: bei langem flachem Ende ein wachsender Beutel
