# Neon Pounce – Anforderungen

Diese Datei ist die maßgebliche Liste der Anforderungen. Das Spielkonzept
(`spielkonzept.md`) ist das Ursprungsdokument und liefert die Begründungen. Wo
beide voneinander abweichen, gilt diese Datei. Abweichungen sind in Abschnitt 22
aufgelistet.

Zahlenwerte, die als „Startwert“ markiert sind, stehen als Konstanten in
`src/config.ts` (A106) und werden in `balance.md` abgestimmt. Tests prüfen das
Verhalten gegen die Konstanten, nicht gegen die Zahl im Text.

## 1. Spielfeld

- **A1** Sechs äußere Ringe liegen um die Mitte. Ihre Mittelpunkte stehen bei 12,
  2, 4, 6, 8 und 10 Uhr. Die Ringe tragen die Nummern 0 bis 5, im Uhrzeigersinn
  ab 12 Uhr.
- **A2** Jeder Ring hat sechs Plätze. Ein Platz ist ein Keil von 60° („Kuchenstück“),
  der bis zum Mittelpunkt des Rings reicht. Die Keilmitten stehen bei 1, 3, 5, 7,
  9 und 11 Uhr und tragen die Nummern 0 bis 5, im Uhrzeigersinn ab 1 Uhr. Alle
  Ringe sind gleich ausgerichtet. Zwischen den Keilen bleiben schmale, sichtbare
  Fugen.
- **A3** Die Mitte ist kein Ablageplatz. Sie zeigt das aktuelle Segment als Keil
  an seiner Position, in derselben Ausrichtung wie die Plätze der Ringe. Um die
  Mitte läuft der Timer-Bogen.
- **A4** Das Feld ist ein zentriertes Hochformat-Feld. Es skaliert auf den
  verfügbaren Platz, hält die sicheren Bereiche des Geräts frei (Notch,
  Home-Leiste) und wird höchstens 520 CSS-Pixel breit. Auf dem iPad gibt es kein
  eigenes Layout. Das Feld nimmt die ganze Höhe zwischen den sicheren Bereichen
  ein. Seine Breite ist das Minimum aus der verfügbaren Breite, 520 CSS-Pixeln
  und der Höhe geteilt durch 1,6 (Startwert), damit es immer ein Hochformat
  bleibt.
- **A5** Ein Segment hat eine Position (0 bis 5) und eine Farbe (eine von bis zu
  sechs), oder es ist ein Bonus-Segment (Abschnitt 10 und 11). Jede Farbe hat ein
  festes Symbol, das auf dem Segment zu sehen ist.

## 2. Eingabe

- **A6** Ein Tipp zählt beim Aufsetzen des Fingers. Trefferfläche eines Rings ist
  seine ganze Kreisscheibe. Tipps außerhalb aller Scheiben werden ignoriert.
- **A7** Jeder aufgesetzte Finger ist ein eigener Tipp, in der Reihenfolge des
  Eintreffens.
- **A8** Ein Wisch beginnt auf der Mittelscheibe und zählt, sobald der Finger sie
  verlassen hat (nicht erst beim Loslassen). Er gilt für das Segment, das beim
  Aufsetzen des Fingers sichtbar war. Ist dieses Segment inzwischen weg, verfällt
  der Wisch. Ein Tipp auf die Mitte, der sie nicht verlässt, tut nichts.
- **A9** Schutz vor Doppeltipps: Ein Tipp auf einen Ring, der vor dem Erscheinen
  des aktuellen Segments oder in den ersten 100 ms danach beginnt, wird ohne
  Rückmeldung verworfen. Für den Wisch gilt dieser Schutz nicht.
- **A10** Eine Eingabe zählt nur in dem Zustand, in dem sie begonnen hat. Während
  des Ausblendens vor Game Over (A23), in der Pause und im Countdown werden
  Eingaben auf dem Feld ignoriert.
- **A11** Es gibt keine Tastaturbedienung. Die Maus wirkt wie ein einzelner
  Finger. Dafür wird nichts optimiert und nichts getestet.

## 3. Zug

- **A12** Tippt der Spieler einen Ring an, dessen Platz an der Position des
  Segments frei ist, belegt das Segment diesen Platz. Das ist eine Platzierung
  und zählt als Zug. Jeder Ring mit freiem Platz ist gültig, das Spiel fängt
  Fehlgriffe in einen Nachbarring nicht ab.
- **A13** Ist der Platz belegt, ist das ein Fehltipp: Das Segment bleibt in der
  Mitte, und der Timer verliert Strafzeit (A20).
- **A14** Nach jeder Platzierung, jedem Abwurf und jedem Timeout erscheint sofort
  das nächste Segment, ohne Pause.
- **A15** Das erste Segment einer Partie ist immer ein normales Segment, hat
  keinen Timer und wartet unbegrenzt. Es kann nicht abgeworfen werden: Bei einem
  Wisch rutscht es ein Stück in Wischrichtung und federt zurück, damit der
  Wisch nicht wirkungslos erscheint. Mit seiner Platzierung beginnt die Partie. Ein Fehltipp ist hier nicht möglich,
  weil das Feld leer ist.

## 4. Ringe leeren

- **A16** Ein Ring mit sechs Segmenten leert sich sofort mit der Platzierung und
  bringt Abräumpunkte (A45). Ein Ring bleibt nie voll stehen.
- **A17** Einfarbig: Haben alle sechs Segmente dieselbe Farbe (ein Joker zählt
  als jede Farbe), gilt der Einfarbig-Faktor 3, und der Vorrat bekommt einen
  Abwurf zurück, höchstens bis zum Maximum (A25).
- **A18** Ist der Vorrat bei einem einfarbigen Ring schon voll, verfällt der
  Abwurf. Die Abwurf-Anzeige im HUD pulsiert einmal, ein fliegendes Symbol gibt
  es dann nicht.

## 5. Timer und Leben

- **A19** Jedes Segment außer dem ersten (A15) hat einen eigenen Timer mit der
  vollen Zeit seiner Stufe (A37).
- **A20** Die Strafzeit steigt mit jedem Fehltipp auf dasselbe Segment:
  0,5 / 1 / 2 / 4 s (Startwerte), ab dem fünften Fehltipp weiter 4 s. Mit dem
  nächsten Segment beginnt sie wieder beim ersten Wert. Die Staffel ist auf
  allen Stufen gleich.
- **A21** Erreicht der Timer 0, auch durch eine Strafzeit, folgt sofort der
  Timeout: Ein Leben geht verloren, das Segment verfällt, die Combo wird
  zurückgesetzt.
- **A22** Eine Partie beginnt mit 3 Leben. Leben kommen nie zurück.
- **A23** Bei 0 Leben reagiert das Feld nicht mehr und blendet in 1 s
  gleichmäßig ins Dunkle aus. Danach erscheint Game Over. Die Rückmeldung des
  auslösenden Ereignisses (Timeout, Aufgabe, Blockade-Hilfe) spielt dabei
  vollständig und beginnt gleichzeitig mit dem Ausblenden, damit der Spieler
  sieht, warum er verloren hat. Der Klang `timeout` spielt einmal.
- **A24** Fehltipps kosten nie Punkte. Der Timer ist die einzige Strafe.

## 6. Abwürfe und Blockaden

- **A25** Der Vorrat beginnt mit 3 Abwürfen und fasst höchstens 5.
- **A26** Ein Wisch bei einem Vorrat von mindestens 1 wirft das Segment ab: Der
  Vorrat sinkt um 1, das ist kein Zug, und die Combo bleibt erhalten.
- **A27** Ein Wisch bei einem Vorrat von 0 gibt das Segment auf. Er wirkt in
  den Regeln wie ein Timeout (A21, A30), mit oder ohne Blockade. Die
  Rückmeldung ist eine eigene (A63).
- **A28** Bei einem Vorrat von 0 zeigt das HUD statt des Abwurf-Symbols ein
  „Aufgeben“-Symbol.
- **A29** Blockade heißt: Die Position des Segments ist in allen sechs Ringen
  belegt. Das Spiel weist vorher nicht darauf hin.
- **A30** Nach einem Timeout oder einer Aufgabe bei einer Blockade leuchten auf
  den Stufen 1 bis 4 die sechs belegten Plätze der Position auf. Ab Stufe 5 und
  ohne Blockade leuchtet nichts auf. Ein freier Platz wird nie gezeigt.

## 7. Segment-Generator

- **A31** Die Farbe eines normalen Segments wird gleichverteilt aus den Farben
  der aktuellen Stufe gezogen (A38).
- **A32** Die Position kommt aus einer Mischung von zwei Verfahren. Beutel: Er
  enthält jede Position gleich oft (Startwert: zweimal), wird gemischt und nach
  der letzten Entnahme neu gefüllt. Gewichtung: siehe A33. Das Mischverhältnis ist
  eine Konstante. Bis Meilenstein 7 gibt es nur den Beutel.
- **A33** Gewichtung: Eine Position wird umso seltener gezogen, je mehr Ringe sie
  schon belegt haben, aber nie mit Wahrscheinlichkeit 0.
- **A34** Gnädiger Anfang: Für die ersten Segmente einer Partie (Zahl als
  Konstante) ist der Generator großzügiger. Der erste Ring ist trotzdem nicht
  garantiert.
- **A35** Aller Zufall kommt aus dem Generator, der dem Regelkern übergeben
  wird. Derselbe Startwert und dieselben Eingaben zu denselben Zeiten ergeben
  dieselbe Partie.

## 8. Stufen

- **A36** Eine Partie beginnt auf Stufe 1. Stufe n (1 bis 11) dauert 6 + 2·n
  Platzierungen (8, 10, 12, … 28). Ab Stufe 12 dauert jede Stufe 28
  Platzierungen (Startwert). Die Stufen steigen über 12 hinaus weiter.
- **A37** Die Timer-Zeit je Stufe steht in `balance.md` (Startwerte von 5,5 s auf
  Stufe 1 bis 2,0 s auf Stufe 12, ohne Sprünge). Nach Stufe 12 sinkt sie je
  Stufe um 0,05 s bis zum absoluten Minimum von 1,8 s (Startwerte). Danach
  ändert ein Aufstieg nichts mehr.
- **A38** Zahl der Farben: 2 auf Stufe 1 und 2, 3 auf Stufe 3 und 4, 4 auf Stufe
  5 und 6, 5 auf Stufe 7 und 8, 6 ab Stufe 9.
- **A39** Stufenmultiplikator: 1 + 0,25 · (Stufe − 1), höchstens 3,75 (erreicht
  auf Stufe 12).
- **A40** Neue Werte gelten ab dem nächsten Segment. Für die Punkte eines
  Segments gilt der Multiplikator der Stufe, in der es erschienen ist.
- **A41** Für den Aufstieg zählen Platzierungen einschließlich der
  Bonus-Segmente. Abwürfe und Timeouts zählen nicht.
- **A42** Im laufenden Spiel steht keine Stufenzahl. Ein Fortschrittsbalken
  wächst mit jeder Platzierung und beginnt beim Aufstieg neu, auch nach Stufe
  12.
- **A43** Die erreichte Stufe steht als Zahl im Game Over.

## 9. Punkte und Combo

- **A44** Eine Platzierung bringt 10 × Stufenmultiplikator.
- **A45** Eine Leerung bringt zusätzlich 100 × Stufenmultiplikator ×
  Einfarbig-Faktor × Combo-Faktor. Der Einfarbig-Faktor ist 1, bei Einfarbig 3
  (A17), beim Ring nur aus Jokern 10 (A56).
- **A46** Die Combo zählt Platzierungen in Folge, die einen Ring leeren. Der
  Combo-Faktor ist die Combo-Zahl, höchstens 6. Bei der ersten Leerung ist er 1.
- **A47** Eine Platzierung ohne Leerung, ein Timeout und eine Aufgabe setzen die
  Combo auf 0. Abwürfe, Fehltipps und Stufenaufstiege ändern sie nicht.
- **A48** Die längste Combo einer Partie zählt über 6 hinaus weiter.
- **A49** Der Combo-Ring im HUD hat sechs Plätze. Jede Leerung in Folge füllt
  einen Platz, schon die erste. Ab 6 bleibt er voll. Reißt die Combo ab, leert
  er sich. Reißt eine Combo von mindestens 2 ab, fallen die Plätze sichtbar
  nacheinander ab, damit der Abbruch auffällt. Einen Klang gibt es dafür nicht.
- **A50** Punkte sind ganze Zahlen. Jedes Ereignis (Platzierung, Leerung) wird
  für sich kaufmännisch gerundet (10 × 1,25 = 13).

## 10. Bonus-System und Joker

- **A51** Bonus-Segmente sind eigene Segment-Arten mit eigener Tipp-Regel. Alle
  Arten nutzen dasselbe Bonus-System (A52) und die gemeinsamen Regeln (A53).
- **A52** Bonus-Segmente kommen aus demselben Generator wie die normalen
  Segmente (Mischung aus Beutel und Chance, A32). Jedes Segment ist mit einer
  Chance ein Bonus. Diese Chance hat einen Grundwert über 0 %, ein Bonus kann
  also auch ohne Auslöser erscheinen. Ereignisse im Spiel (Auslöser) erhöhen
  die Chance. Erscheint ein Bonus, fällt sie auf den Grundwert zurück. Der
  Generator behandelt ein Bonus-Segment wie ein normales Segment: Es entsteht
  aus einer normalen Ziehung und verbraucht deren Position aus dem Beutel, auch
  wenn der Joker diese Position nicht nutzt. Vorläufige Startwerte: Grundwert
  2 %, einfarbiger Ring +10 Prozentpunkte, Leerung mit Combo ab 3 +5
  Prozentpunkte, Obergrenze 30 %. Welche Ereignisse welche
  Bonus-Art auslösen und wie Beutel und Chance dabei zusammenwirken, wird je
  Bonus-Art festgelegt: für den Joker in Meilenstein 8, für den Aufräumer in
  Meilenstein 16.
- **A53** Für alle Bonus-Segmente gilt: Sie haben einen Timer, ihr Timeout kostet
  ein Leben, sie dürfen abgeworfen werden, sie zählen für den Stufenaufstieg und
  bringen die Platzierungspunkte (A44). Das erste Segment einer Partie ist nie
  ein Bonus.
- **A54** Der Joker hat keine Position. Er landet im angetippten Ring auf dem
  ersten freien Platz im Uhrzeigersinn ab 1 Uhr. Das gelingt immer, ein Fehltipp
  ist mit ihm nicht möglich.
- **A55** Ein Joker zählt für Einfarbig als jede Farbe.
- **A56** Besteht ein geleerter Ring nur aus Jokern, gilt der Einfarbig-Faktor 10
  statt 3, der Vorrat wird ganz aufgefüllt, und der Ring blinkt in
  Regenbogenfarben. Im Game Over zählt er als einfarbiger Ring.
- **A57** Der Joker ist regenbogenfarben, trägt einen Stern und pulsiert.

## 11. Aufräumer

- **A58** Der Aufräumer leert den angetippten Ring, wenn dort mindestens ein
  Segment liegt. Das zählt als Platzierung und als Leerung: Es gibt Platzierungs-
  und Abräumpunkte, und die Combo steigt.
- **A59** Er bringt den Einfarbig-Bonus (Faktor 3 und einen Abwurf zurück), wenn
  im Ring mindestens 2 Segmente liegen und alle dieselbe Farbe haben. Joker
  zählen als jede Farbe. Der Faktor 10 aus A56 gilt beim Aufräumer nie. Ein so
  geleerter Ring zählt im Game Over als einfarbiger Ring (zwei rote Segmente:
  ja, ein rotes und ein blaues: nein). Ob er auch als Bonus-Auslöser zählt,
  wird mit den Auslösern in Meilenstein 16 festgelegt (A52).
- **A60** Auf einem leeren Ring ist der Aufräumer verbraucht: Er zählt als
  Platzierung (Zug, Stufenaufstieg) und bringt die Platzierungspunkte, aber
  nicht mehr. Es gibt keine Abräumpunkte, und die Combo wird zurückgesetzt.
- **A61** Der Aufräumer erscheint über das Bonus-System. Seine Auslöser und sein
  Anteil gegenüber dem Joker werden in Meilenstein 16 festgelegt (A52).
  Vorläufiger Startwert: Erscheint ein Bonus, ist er mit gleicher Chance Joker
  oder Aufräumer.
- **A62** Der Aufräumer hat eine eigene Darstellung und eine eigene Rückmeldung.
  Beide sind noch offen (siehe SPEC.md, Offene Annahmen).

## 12. Rückmeldung und Look

- **A63** Jedes Ereignis hat genau die folgende Rückmeldung. Die Spalte „Klang“
  nennt den Namen des Effekts aus `grafik-audio.md`.

  | Ereignis | Bild | Klang |
  |---|---|---|
  | Platzieren | Segment fliegt in den Ring, Punkt-Popup, Fortschrittsbalken wächst | `place` |
  | Fehltipp | Ring wackelt, das belegende Segment leuchtet auf | `miss` |
  | Ring geleert | Ring blinkt weiß, Partikel, das Punkt-Popup zeigt den Gesamtwert des Zugs und ist größer als bei einer Platzierung | `clear` |
  | Einfarbig | Ring blinkt zweimal in seiner Farbe, Abwurf-Symbol fliegt ins HUD | `clearMono` |
  | Einfarbig bei vollem Vorrat | Ring blinkt zweimal in seiner Farbe, Abwurf-Anzeige pulsiert | `clearMono` |
  | Ring nur aus Jokern | Ring blinkt in Regenbogenfarben, Popup „×10“, Abwurf-Anzeige füllt sich | `clearMono` eine Oktave höher mit zusätzlicher Schicht |
  | Combo ab 2 | Combo-Ring füllt sich, Popup „×2“, „×3“ … | Leeren-Klang höher (A74) |
  | Combo-Abbruch | Combo-Ring leert sich, ab Combo 2 fallen die Plätze nacheinander ab (A49) | keiner |
  | Wisch auf das erste Segment | Segment rutscht in Wischrichtung und federt zurück (A15) | keiner |
  | Abwurf | Segment fliegt in Wischrichtung hinaus | `discard` |
  | Timeout | Segment verfällt, Rand blinkt rot, ein Leben erlischt | `timeout` |
  | Aufgabe (Wisch bei 0) | wie Timeout, zusätzlich leuchtet der ganze Bildschirm rot auf | `timeout` |
  | Timeout oder Aufgabe bei Blockade, Stufe 1 bis 4 | zusätzlich leuchten die sechs belegten Plätze auf | wie Timeout |
  | Stufenaufstieg | Leuchtpuls über das Feld, Fortschrittsbalken beginnt neu | `levelUp` |
  | Bonus-Segment erscheint | Joker pulsiert | `bonus` |
  | Letzte 25 % des Timers | Bogen nähert sich Rot | `tick` |
  | Letztes Leben verloren | Rückmeldung des Auslösers, gleichzeitig blendet das Feld in 1 s aus (A23) | `timeout`, einmal |

- **A64** Vibration, wo der Browser sie anbietet: Fehltipp 30 ms, Timeout und
  Aufgabe 150 ms (Startwerte). Auf dem iPhone gibt es keine. Mute schaltet die
  Vibration nicht ab.
- **A65** Der Look wird von Stufe 1 bis 12 schrittweise intensiver (Helligkeit
  des Glows, Hintergrund). Nach Stufe 12 bleibt er gleich.
- **A66** Der Timer-Bogen ist ein Regenbogen-Verlauf, der bei Rot endet. Er wird
  mit der Restzeit kürzer. Beim ersten Segment ist er voll und steht.
- **A67** Es gibt sechs Segmentfarben, jede mit festem Symbol. Farbe und Symbol
  sind auch bei Farbschwäche unterscheidbar (Messwerte in `grafik-audio.md`).
- **A68** Stil: viel Neon, leuchtende, hochgesättigte Farben mit Glow.
  Hintergrund und Menüs sind blau-schwarz.
- **A69** Menüs und Zahlen nutzen eine futuristische, frei lizenzierte Schrift,
  die als Datei dem Spiel beiliegt.

## 13. Ton

- **A70** Es gibt Soundeffekte und Musik. Mute schaltet beides gemeinsam stumm
  und wieder ein.
- **A71** Ton beginnt erst nach der ersten Berührung (Vorgabe von iOS). Vorher
  bleibt das Spiel stumm, ohne Hinweis.
- **A72** Die Musik ist ein Stück in nahtloser Schleife. In der Partie läuft sie
  mit voller Musiklautstärke, in den Menüs mit halber. In der Pause und im
  Hintergrund (App-Wechsel) schweigt sie und setzt danach an derselben Stelle
  fort.
- **A73** Die Tonhöhe von `place` steigt mit dem Füllstand des Rings nach der
  Platzierung (1 bis 5 Segmente, fünf Tonhöhen).
- **A74** `clear` und `clearMono` klingen je Combo-Stufe einen Halbton höher
  (Combo 1 bis 6, darüber wie 6).
- **A75** Klangstil: futuristisch, sauber, glänzend. Kein 8-Bit- oder
  Chiptune-Klang.

## 14. Bildschirme und Ablauf

- **A76** Start: Titel „Neon Pounce“, Slogan „Think fast!“, aktueller Highscore,
  „Play“, „How to play“, Mute.
- **A77** How to play: eine Seite zum Scrollen mit Text und Bildern in dieser
  Reihenfolge: Ziel, Platzieren (die Position steht fest, gewählt wird der
  Ring), Fehltipp und Timer, Leeren und Einfarbig, Abwurf und Blockade
  (einschließlich Aufgeben bei 0 Abwürfen), Combo, Bonus-Segmente. Dazu „Back“
  und „Play tutorial“.
- **A78** Tutorial-Frage: Beim ersten „Play“ erscheint „Play tutorial?“ mit
  „Yes“ und „No“. Beide Antworten merken sich, dass gefragt wurde (A92). Danach
  erscheint die Frage nie wieder.
- **A79** Tutorial: fünf geführte Schritte auf vorbereiteten Feldern, ohne
  Timer, ohne Leben und ohne Punkte, mit animierter Hand und einem kurzen Satz
  je Schritt. Nur die gezeigte Eingabe führt weiter, andere werden ignoriert.
  Jederzeit „Skip“.
  1. Platzieren: Ein Segment liegt bereit, die Hand zeigt auf einen Ring.
  2. Fehltipp: Die Hand zeigt auf einen Ring mit belegtem Platz, danach auf
     einen mit freiem Platz.
  3. Leeren: Ein Ring hat fünf gleichfarbige Segmente, das passende sechste
     liegt bereit.
  4. Abwerfen: Die Position ist in allen sechs Ringen belegt, die Hand wischt
     aus der Mitte. Der Satz dazu nennt den Abwurf auch als freie Wahl: „Swipe
     away anything you don't want.“
  5. Abschluss: „Ready?“ als Schaltfläche.
- **A80** Partie: oben Leben, Punktestand, Abwürfe, Combo-Ring und
  Fortschrittsbalken, unten klein Pause und Mute. Kein Text, nur Zahlen und
  Symbole.
- **A81** Game Over zeigt Punkte, Highscore, „New best“ bei neuem Highscore
  (A95), erreichte Stufe, Zahl der einfarbigen Ringe und längste Combo. Dazu
  „Again“ (sofort neue Partie) und „Menu“.
- **A82** Die Schaltflächen im Game Over reagieren erst 500 ms nach dem
  Erscheinen.
- **A83** Der Ablauf folgt dieser Tabelle. Andere Übergänge gibt es nicht. Eine
  Zurück-Taste oder -Geste wird nirgends behandelt. Menüs haben keine
  Vorauswahl.

  | Zustand | Eingabe | Ziel |
  |---|---|---|
  | Start | „Play“, Frage noch nie gestellt | Tutorial-Frage |
  | Start | „Play“, Frage schon gestellt | Partie |
  | Start | „How to play“ | How to play |
  | Start | Mute | Start (Ton umgeschaltet) |
  | Tutorial-Frage | „Yes“ | Tutorial |
  | Tutorial-Frage | „No“ | Partie |
  | How to play | „Back“ | Start |
  | How to play | „Play tutorial“ | Tutorial |
  | Tutorial (von der Frage) | „Skip“ oder „Ready?“ | Partie |
  | Tutorial (aus How to play) | „Skip“ oder „Ready?“ | Start |
  | Partie | Pause-Taste, App-Wechsel, Querformat | Pause |
  | Partie | Mute | Partie (Ton umgeschaltet, Timer läuft weiter) |
  | Partie | letztes Leben verloren | Ausblenden 1 s, dann Game Over |
  | Pause | „Resume“ | Countdown 3 s, dann Partie mit Restzeit |
  | Pause | „Restart“ | neue Partie |
  | Pause | „Menu“ | Start |
  | Countdown | App-Wechsel, Querformat | Pause |
  | Game Over | „Again“ (nach 500 ms) | neue Partie |
  | Game Over | „Menu“ (nach 500 ms) | Start |

- **A84** Die Oberfläche ist Englisch. Eine andere Sprache gibt es nicht.

## 15. Pause

- **A85** Die Pause beginnt durch die Pause-Taste, durch App- oder Tab-Wechsel
  und durch Drehen ins Querformat.
- **A86** Pausenbild: Alle Ringe sind als leere Umrisse gezeichnet, die Mitte ist
  leer, die Werte im HUD bleiben sichtbar. Der Spielstand auf dem Feld ist nicht
  erkennbar.
- **A87** Schaltflächen: „Resume“, „Restart“ (sofort neue Partie) und „Menu“.
  „Restart“ und „Menu“ fragen nicht nach. Eine so beendete Partie zählt nicht
  für den Highscore.
- **A88** Nach „Resume“ läuft bei verdecktem Feld ein Countdown von 3 Sekunden.
  Danach erscheint das Feld wieder, und der Timer läuft mit der Restzeit weiter,
  die beim Pausieren übrig war.
- **A89** Eine Unterbrechung während des Countdowns führt zurück in die Pause.
  Der Countdown beginnt beim nächsten „Resume“ neu.
- **A90** Im Querformat zeigt jeder Bildschirm nur den Dreh-Hinweis. Zurück im
  Hochformat erscheint der vorige Bildschirm, während einer Partie das
  Pausenmenü. Die Partie läuft nicht von selbst weiter.
- **A91** Sonderfälle: Beim ersten Segment bleibt es auch nach der Pause ohne
  Timer. Während des Ausblendens vor Game Over (A23) ist die Pause-Taste
  wirkungslos. Nach einem App-Wechsel in dieser Zeit steht bei der Rückkehr
  direkt Game Over.

## 16. Gespeicherte Daten

- **A92** Ort und Format: `localStorage`, ein Schlüssel `neon-pounce`, Inhalt
  JSON mit genau diesen Feldern:

  | Feld | Typ und Grenzen | Standard |
  |---|---|---|
  | `version` | Zahl, derzeit 1 | 1 |
  | `highscore` | ganze Zahl ≥ 0 | 0 |
  | `muted` | Wahrheitswert | false |
  | `tutorialAsked` | Wahrheitswert | false |

- **A93** Lesen: Fehlt der Eintrag oder ist er kein gültiges JSON, gelten alle
  Standards. Ist ein einzelnes Feld ungültig (falscher Typ, negative oder nicht
  ganze Zahl), gilt für dieses Feld der Standard. Es gibt keinen Fehlerhinweis.
- **A94** Schreiben: Es werden immer genau die vier Felder geschrieben,
  unbekannte Felder werden verworfen. Scheitert das Schreiben, läuft das Spiel
  ohne Hinweis weiter. Spätere Meilensteine dürfen Felder ergänzen und erhöhen
  dann `version`.
- **A95** Der Highscore wird beim Game Over geschrieben, wenn die Punkte höher
  sind als der bisherige Wert. Nur dann erscheint „New best“. Bei 0 Punkten
  erscheint es nie.

## 17. Plattform

- **A96** Unterstützt werden Safari auf der aktuellen und der vorigen
  iOS-Hauptversion und aktuelles Chrome auf Android 12 oder neuer.
- **A97** Das Spiel läuft auf den Testgeräten mit 60 Bildern pro Sekunde. Dafür
  gelten die drei Regeln aus SPEC.md, Abschnitt 6.2: Glow in den Texturen,
  Renderauflösung höchstens Faktor 2, Formen einmal bauen und dann nur bewegen.
- **A98** Die App liegt unter dem Basispfad `/neon-pounce/`. Jeder Push auf
  `main` veröffentlicht den Stand auf GitHub Pages.
- **A99** Die App ist auf dem Startbildschirm installierbar: Manifest mit Name,
  Symbolen, Hochformat und Darstellung ohne Browser-Leiste.
- **A100** Nach dem ersten vollständigen Laden startet und läuft die App ohne
  Internet, einschließlich Musik, Hintergrund und Schrift.
- **A101** Eine neue Version wird beim nächsten Start der App aktiv, ohne
  Hinweis und nie während einer laufenden Sitzung.
- **A102** Die App ruft zur Laufzeit nichts von fremden Servern ab (keine
  Schriftdienste, keine Statistik, kein Tracking).

## 18. Fehler

- **A103** Lässt sich Musik, Hintergrund oder Schrift nicht laden, läuft das
  Spiel ohne sie weiter (Stille, einfarbiger Hintergrund, Systemschrift), ohne
  Hinweis.
- **A104** Fehlt WebGL, erscheint statt des Spiels der Satz „This device is not
  supported.“
- **A105** Während einer Partie erscheinen keine Fehlermeldungen.

## 19. Entwicklung und Testhilfen

- **A106** Alle Spielwerte stehen als Konstanten in `src/config.ts`. Die Liste
  steht in `teststrategie.md`. Zum Ausprobieren anderer Werte wird die Datei
  geändert, der Entwicklungsserver lädt neu. Regler in der Oberfläche gibt es
  nicht.
- **A107** Nur im Entwicklungsserver sichtbar: eine Bildraten-Anzeige (aktueller
  Wert, Mittel, schlechteste Sekunde) und im Game Over die Schaltfläche
  „Export“. Die Sekunden zählen ab dem ersten Bild. Der aktuelle Wert ist die
  Zahl der Bilder in der letzten vollen Sekunde, die schlechteste Sekunde das
  Minimum über alle vollen Sekunden (eine Sekunde ohne Bild zählt als 0), das
  Mittel sind Bilder durch Laufzeit. Zeit, in der die Seite verdeckt war
  (App-Wechsel, Bildschirmsperre), wird verworfen. In der Leistungsprobe (A108)
  zeigt die Anzeige zusätzlich die Laufzeit und hält nach fünf Minuten Mittel
  und schlechteste Sekunde mit ✓ oder ✗ fest (Grenzwerte als Konstanten).
- **A108** Leistungsprobe: Ein Schalter in der Konfiguration ersetzt die Partie
  durch ein volles Feld mit 36 leuchtenden Segmenten, die dauerhaft animiert
  sind, und einem ständigen Partikelstrom.
- **A109** Protokoll: Im Entwicklungsserver zeichnet jede Partie je Segment auf:
  laufende Nummer, Art, Position, Farbe, Stufe, Timer-Zeit, Entscheidungszeit in
  Millisekunden (Erscheinen bis Ende), Zeit bis zum ersten Tipp auf einen Ring
  (leer, wenn es keinen gab), Zahl der Fehltipps, Ausgang (`placed`,
  `discarded`, `timeout`, `givenUp`) und Ring. Für den Abgleich mit den Bots
  außerdem den Stand beim Erscheinen: die Zahl der Ringe, in denen die Position
  belegt ist (0 bis 6, 6 ist eine Blockade), und den Abwurf-Vorrat. Dazu einmal
  je Partie Startwert,
  Konfiguration und Endstand. „Export“ gibt das als JSON-Datei an das
  Teilen-Menü des Geräts, auf dem Desktop als Download.
- **A110** Testmodus: Mit dem Adresszusatz `?test=<Startwert>` nutzt die App
  diesen Startwert für den Zufall und legt unter `window.__neonPounce` den
  Spielstand lesbar offen (Bildschirm, Ringe, aktuelles Segment, Leben, Abwürfe,
  Punkte, Combo, Stufe) sowie eine Funktion, die die Spielzeit um eine
  Millisekundenzahl vorstellt. Ohne den Zusatz gibt es das Objekt nicht.

## 20. Simulation

- **A111** Fünf Bot-Strategien spielen Partien über den Regelkern, ohne Browser:
  Anfänger (irgendein freier Ring), vollster passender Ring, ein Ring pro Farbe,
  vorausplanend (plant Schließungen, wirft überzählige Positionen ab, kennt das
  nächste Segment nicht) und Combo-Jäger (wirft alles ab, was keinen Ring
  schließt). Verhalten in den Grenzfällen: Der Anfänger-Bot erkennt Blockaden
  nicht und lässt den Timer ablaufen. Alle anderen werfen bei einer Blockade
  ab und geben bei einem Vorrat von 0 sofort auf. Der Combo-Jäger legt bei
  einem Vorrat von 0 wie der Bot „vollster passender Ring“.
- **A112** Menschenmodell: Jeder Bot hat eine mittlere Entscheidungszeit mit
  Streuung und eine Fehlgriff-Quote (er trifft mit dieser Wahrscheinlichkeit
  einen zufälligen anderen Ring). Feste Schätzwerte: Geübte = vorausplanender
  Bot mit 0,8 s und 2 %, Anfänger = Anfänger-Bot mit 1,6 s und 8 %. Die übrigen
  Bots nutzen die Werte der Geübten. Die Entscheidungszeit ist zunächst auf
  allen Stufen gleich. Zeigen die Protokolle (A109) eine klare Zunahme mit der
  Farbzahl, steigt sie im Modell mit der Farbzahl (Entscheidung in Meilenstein
  6).
- **A113** Der Bericht nennt je Bot: Median und Quartile der Züge je Partie,
  Verteilung der erreichten Stufe, Median und Streuung der Punkte, Blockade-Rate
  je Füllstand und Unwucht, Einfarbig-Quote je Stufe, mittleren Abwurf-Vorrat je
  Stufe, erzwungene Lebensverluste auf Stufe 1 bis 4, Anteil der Partien, in denen
  die Blockade-Hilfe (A30) mindestens einmal erscheint, Platzierungen bis zum
  ersten geleerten Ring und Länge der Partien nach Stufe 12.
- **A114** Derselbe Startwert und dieselbe Konfiguration ergeben denselben
  Bericht.
- **A115** Die Simulation kann Varianten der Konfiguration nebeneinander
  auswerten und zeigt die Messwerte je Variante in einer Tabelle.
- **A116** Die Simulation läuft über `npm run sim`. In der CI prüft ein kurzer
  Lauf (20 Partien je Bot), dass sie funktioniert.

## 21. Dokumentation

- **A117** `README.md` (Englisch, für Anwender): was das Spiel ist, Link zum
  Spielen, Installation auf dem Handy, Lizenz. Ab Meilenstein 9 mit Screenshot.
- **A118** `docs/DEVELOPMENT.md` (Englisch, für Entwickler): Voraussetzungen,
  Befehle, Tests, Simulation, Struktur, Workflow, Asset-Erzeugung.

## 22. Abweichungen vom Spielkonzept

Entschieden im Interview am 2026-11-12:

- **Aufräumer:** Einfarbig-Bonus ab 2 Segmenten einer Farbe, der dann auch in
  der Statistik als einfarbiger Ring zählt. Auf einem leeren Ring ist er
  verbraucht und bringt nur die Platzierungspunkte (A59, A60). Das Konzept ließ
  beides offen.
- **Bonus-Auslöser:** werden je Bonus-Art festgelegt, nicht einmal für alle
  (A52). Bonus-Segmente können mit einer kleinen Grundchance auch ohne Auslöser
  erscheinen. Das Konzept sah sie nur nach einem Auslöser vor.
- **Ring nur aus Jokern:** eigener Bonus (A56). Im Konzept nicht vorgesehen.
  Begründung: Wer das schafft, hat Respekt verdient.
- **Tutorial:** über „How to play“ wiederholbar (A77). Im Konzept nur einmal.
- **Entwickler-Regler:** entfallen zugunsten der Konfigurationsdatei (A106).
  Begründung: einfacher, und die Werte müssen ohnehin an einer Stelle stehen.
- **Bot-Werte:** feste Schätzwerte statt Messwerten aus dem Protokoll (A112).
  Das Protokoll bleibt als Abgleich.
- **Blockade-Hilfe:** bis einschließlich Stufe 4 (A30).
- **Combo-Abbruch:** ohne Klang. **Einfarbig bei vollem Vorrat:** nur die
  Anzeige pulsiert (A18).
- **Erstes Segment:** nicht abwerfbar (A15).
- **Game Over:** Das Feld blendet in der Sekunde vor Game Over aus, statt nur
  einzufrieren (A23).
- **Musik:** ein Stück für Partie und Menüs (A72).
- **Segmente:** Kuchenstücke bis zur Ringmitte mit schmalen Fugen (A2).
