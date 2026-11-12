# Neon Pounce – Spielidee und Spielkonzept

## 1. Idee in einem Satz

Ein schnelles Sortier-Puzzle fürs Handy im futuristischen Neon-Look mit
Synthwave-Klang: Segmente, die in der Mitte aufleuchten, werden unter Zeitdruck in
einen von sechs Ringen getippt, um Ringe zu füllen und möglichst einfarbig
abzuräumen.

**Arbeitstitel:** Neon Pounce · **Slogan:** „Think fast!“ – gemeint ist
schnelles *Entscheiden*. Für Schnelligkeit selbst gibt es keine Belohnung.

## 2. Zweck und Zielgruppe

- Ein Spiel für mich selbst und zum Vorzeigen im Freundeskreis.
- Freunde öffnen es als installierte App auf dem Handy, verstehen
  es (ggf. mit Tutorial) und wollen „Nochmal“ drücken.
- Eine Partie dauert für Geübte im Median **150 bis 300 Züge**. Die Zugzahl
  ist das Ziel; Minuten werden nicht als Zielwert verfolgt. Als Zug zählen
  nur Platzierungen, nicht Abwürfe und Timeouts.
- **Zeitrahmen:** Das Projekt entsteht nebenbei, in Etappen und ohne festen
  Termin. Es darf auch an einem Wochenende fertig werden.

## 3. Spielfeld

- **Sechs äußere Ringe** liegen um einen **siebten Ring in der Mitte**.
- Die äußeren Ringe sind um 30° gegen die Platz-Positionen versetzt: **je einer
  oben und unten, zwei links, zwei rechts** (bei 2, 4, 6, 8, 10 und
  12 Uhr). So zeigt ein Segment in der Mitte nie auf einen Ring; die Position
  wird als Platz im Ring gelesen, nicht als Richtung.
- Jeder Ring hat **sechs Plätze** (Keile zu je 60°) an festen Uhr-Positionen:
  1, 3, 5, 7, 9 und 11 Uhr. Alle Ringe sind gleich ausgerichtet.
- Die Mitte ist kein Ablageplatz: Dort erscheint das **aktuelle Segment**.
  Um die Mitte läuft der **Timer-Bogen**.

## 4. Kern-Schleife (ein Zug)

1. In der Mitte leuchtet ein Segment mit einer **Position** (Uhrzeit) und
   einer zufälligen **Farbe** auf. Die Position bestimmt der
   Positionsgenerator (siehe Abschnitt 5).
2. Der Spieler **tippt einen äußeren Ring an**. Ist dort der Platz an derselben
   Position frei, fliegt das Segment hinein. Die Position ändert sich nie –
   der Spieler wählt nur den Ring. Gelegt wird nur per Tipp; Ziehen und
   Ablegen gibt es nicht.
3. Ist der Platz belegt (**Fehltipp**), bleibt das Segment in der Mitte und
   der Timer verliert Strafzeit.
4. Passt das Segment nirgends oder will der Spieler es nicht legen, kann er es
   per **Wisch aus der Mitte abwerfen** (begrenzter Vorrat).
5. Läuft der Timer ab, kostet das ein **Leben**; das Segment verfällt, und
   sofort erscheint das nächste.
6. Nach jeder Platzierung, jedem Abwurf und jedem Timeout erscheint sofort das
   nächste Segment – ohne Pause.
7. **Schutz vor Doppeltipps:** Ein Tipp, der vor dem Erscheinen des neuen
   Segments oder in den ersten **100 ms** danach beginnt, zählt nicht. So kann
   niemand ein Segment legen, das er noch nicht gesehen hat. Ein verworfener
   Tipp bekommt keine eigene Rückmeldung.

## 5. Regeln

### Ringe füllen und abräumen
- Ein Ring mit sechs Segmenten **leert sich sofort** und bringt Abräumpunkte.
  Ein Ring kann also nie voll stehen bleiben, und nie ist das ganze Feld
  belegt.
- Sind alle sechs Segmente **gleichfarbig**, gibt es zusätzlich einen
  **Einfarbig-Bonus** (×3) und **einen Abwurf zurück** (bis zum Maximum).

### Positionsgenerator
- Die Position eines Segments ist **kein reiner Zufall**, sondern eine
  Stellschraube der Abstimmung. Reiner Zufall würde Blockaden fast nur vom
  Glück abhängig machen.
- Blockaden sollen **weiterhin vorkommen** – nur nicht allein durch Pech.
- **Woraus Blockaden entstehen:** Jeder Ring hat genau einen Platz je
  Position, und jede Leerung gibt von jeder Position genau einen Platz frei.
  Für jede Position gilt deshalb: belegte Plätze = gelegte Segmente dieser
  Position − Zahl der Leerungen. Welcher Ring ein Segment bekommt, ändert
  nie, welche Position zuerst blockiert. Die Ringwahl wirkt nur indirekt: Sie
  bestimmt, wie früh Ringe schließen. Blockaden entstehen also aus zwei
  Größen: der **Unwucht** der gezogenen Positionen (Sache des Generators) und
  dem **Füllstand** (Sache des Spielers). Der Spieler hat drei Hebel: Ringe
  früh schließen, überzählige Positionen abwerfen, den Joker. Ein Beutel mit
  jeder Position genau einmal macht Blockaden fast unmöglich; eine starke
  Gewichtung wirkt genauso.
- Der Generator ist von Anfang an eine **Mischung aus zwei Verfahren**. Die
  Simulation entscheidet nicht zwischen ihnen, sondern stimmt ihr Verhältnis
  ab:
  - **Beutel:** Die Positionen werden aus einem Beutel gezogen, der jede
    Position mehrfach enthält. Er muss so groß sein, dass Blockaden möglich
    bleiben.
  - **Gewichtung:** Eine Position wird umso seltener gezogen, je mehr Ringe
    sie bereits belegt haben – aber nie mit Wahrscheinlichkeit 0.
- **Risiko der Gewichtung:** Auf einem fast vollen Feld sind die freien
  Plätze genau die selten belegten Positionen. Eine starke Gewichtung liefert
  dann bevorzugt die passenden Segmente und nimmt der Abwägung „Combo oder
  Sicherheit“ das Risiko. Die Mischung muss so abgestimmt sein, dass ein
  volles Feld spürbar gefährlicher bleibt als ein leeres. Mögliche Abhilfen,
  falls das nicht gelingt: die Gewichtung im späten Spiel abschwächen oder sie
  an die zuletzt gezogenen Positionen binden statt an den Füllstand.
- **Gnädiger Anfang:** Am Anfang einer Partie ist der Generator großzügiger
  als im späten Spiel, damit der erste Ring früh gelingt. Einen garantierten
  ersten Ring gibt es nicht; das wäre zu einfach.

### Timer, Leben, Game Over
- Jedes Segment hat einen eigenen Timer mit der vollen Zeit der Stufe.
- Ausnahme: Das **erste Segment jeder Partie hat keinen Timer** – zum
  Ankommen.
- **3 Leben**, sie kommen nie zurück. Bei 0 Leben friert das Feld ein, nach
  1 s folgt Game Over.
- Fehltipps kosten nur Zeit, nie Punkte. Der Timer ist die einzige Strafe.
- Ein Fehltipp kann den Timer auf 0 drücken; dann folgt der Timeout und ein
  Leben ist weg.
- **Die Strafzeit steigt mit jedem Fehltipp auf dasselbe Segment**
  (Startwerte 0,5 / 1 / 2 / 4 s, auf allen Stufen gleich). So kann niemand
  einfach alle Ringe durchprobieren: Vier Fehltipps kosten zusammen 7,5 s
  und damit mehr als jeder Timer. Mit dem nächsten Segment beginnt die
  Strafzeit wieder bei 0,5 s.
- **Ein Tipp auf einen falschen Ring mit freiem Platz ist ein gültiger Zug.**
  Der Spieler muss aufpassen, wohin er tippt; das Spiel fängt Fehlgriffe in
  einen Nachbarring nicht ab.

### Abwürfe und Blockaden
- Start mit **3 Abwürfen**, höchstens **5**. Einfarbige Ringe füllen den
  Vorrat wieder auf.
- **Blockade:** Die Position des Segments ist in allen sechs Ringen belegt.
  Das Spiel weist **vorher** nicht darauf hin; der Spieler muss sie selbst
  erkennen.
- **Keine Erklärung im laufenden Spiel:** Blockade und Abwurf werden nur im
  Tutorial und im How-to-play erklärt, mit den Optionen, die ein Spieler hier
  hat. Wer das Tutorial ablehnt, bekommt im Spiel keinen Wisch-Hinweis.
- Bei 0 Abwürfen **gibt ein Wisch das Segment bewusst auf**: Er löst sofort
  den Timeout aus und kostet ein Leben – mit oder ohne Blockade. So muss man
  einen sicheren Lebensverlust nicht absitzen, und der Wisch verrät keine
  Blockade. Damit das nicht aus Versehen geschieht, schaltet das
  Abwurf-Symbol im HUD bei 0 Abwürfen sichtbar auf ein „Aufgeben“-Symbol um.
  Nach einer Aufgabe ohne Blockade wird kein freier Platz gezeigt.

### Bonus-Segmente
Statt eines reinen Rettungs-Jokers gibt es **zwei Bonus-Segmente**. Sie sind
eher Belohnung als Notfallhilfe.

- **Joker** (regenbogen, Stern, pulsierend):
  - Er hat keine feste Position: Getippt landet er im gewählten Ring auf dem
    ersten freien Platz im Uhrzeigersinn ab 1 Uhr – das gelingt immer.
  - Er zählt für Einfarbig als jede Farbe.
- **Aufräumer:** räumt den angetippten Ring komplett ab (nur diesen Ring,
  nicht das Spielfeld). Sind nur einfarbige Segmente in diesem Ring, gibt es
  den **Einfarbig-Bonus**. Der Aufräumer ist **zurückgestellt** und kommt als
  letzte Etappe. Vorher zu klären: Ein Ring mit nur einem Segment darf keinen
  geschenkten Einfarbig-Bonus bringen.
- **Für beide gilt:** Bonus-Segmente haben einen Timer, und ihr Timeout kostet
  ein Leben. Sie dürfen abgeworfen werden und zählen für den Stufenaufstieg.
- **Bonus-System:** Der Joker wird über ein allgemeines Bonus-System gebaut,
  an das sich später weitere Boni wie der Aufräumer anbinden lassen.
- **Auslöser:** Bonus-Segmente erscheinen nicht sofort. Ein Auslöser legt sie
  in den Beutel oder erhöht ihre Chance im Generator; erscheint ein
  Bonus-Segment, sinkt die Chance wieder. Welche Ereignisse als Auslöser
  zählen (etwa eine Combo ab ×3 oder ein einfarbiger Ring), ist noch offen
  und eine Stellschraube der Simulation.

### Stufen
- **12 Stufen.** Aufstieg nach einer festen Zahl platzierter Segmente
  (11 Aufstiege: 8, 10, 12, … 28; die ersten kurz).
- Mit jeder Stufe: **kürzerer Timer** (5,5 s → 2,0 s, flache Kurve ohne
  Sprünge), **mehr Farben** (2 auf Stufe 1, je zweite Stufe eine mehr, 6 ab
  Stufe 9) und ein **höherer Punkte-Multiplikator** (×1 → ×3,75).
- **Die Strafzeiten sind auf allen Stufen gleich** (erster Fehltipp 0,5 s,
  danach steigend). Auf frühen Stufen verzeiht der lange Timer damit mehr
  Fehltipps, auf späten kaum noch einen.
- Nach Stufe 12 sinkt der Timer langsam weiter bis zu seinem **absoluten
  Minimum** (Startwert 1,8 s). Der **Timer auf Stufe 12** (2,0 s) ist davon
  zu unterscheiden.
- Neue Werte gelten ab dem nächsten Segment.
- **Die Stufe ist als Fortschritt sichtbar, im Spiel aber nicht als Zahl.**
  Ein Fortschrittsbalken füllt sich mit jeder Platzierung und zeigt den Weg
  zur nächsten Stufe – auch nach Stufe 12 unverändert. Beim Aufstieg gibt es
  einen Leuchtpuls in der neuen Farbe, und der Look wird mit den Stufen
  intensiver. Die erreichte Stufe steht als Zahl im Game Over.
- **Die Endphase ist bewusst hart.** Ab Stufe 9 bleiben es 6 Farben auf
  6 Ringen. Das Spiel soll irgendwann enden und dann volle Konzentration
  verlangen.
- Ab Stufe 12 wird es eine Art Endlosspiel. Die Stufen steigen weiter, der
  Spieler kann also höhere Stufen als 12 erreichen. Farben und Multiplikator
  ändern sich nicht mehr; nur der Timer sinkt noch bis zu seinem absoluten
  Minimum. Ist es erreicht, ändert ein Aufstieg nichts mehr – das ist so
  gewollt.

### Punkte und Combo
- Platzierung: `10 × Stufenmultiplikator`.
- Ring geleert: zusätzlich `100 × Stufenmultiplikator × Einfarbig (×3) ×
  Combo`.
- **Combo:** zählt Züge in Folge, die einen Ring leeren. Ab der zweiten
  Leerung in Folge ist der Multiplikator gleich der Combo-Zahl (×2, ×3, …
  höchstens ×6). Eine Platzierung ohne Leeren oder ein Timeout setzt sie
  zurück; Abwürfe und Fehltipps nicht. Über einen Stufenaufstieg bleibt sie
  erhalten.
- **Combo-Ring:** Im HUD steht neben den Symbolen für Leben und Abwürfe ein
  kleiner Ring mit sechs Plätzen. Jede Leerung in Folge füllt ein Segment –
  schon die erste, damit sichtbar ist, dass eine Combo läuft. Reißt die Combo
  ab, leert sich der Ring.
- Die **längste Combo** zählt über ×6 hinaus weiter, bringt darüber aber nicht
  mehr Punkte.
- **Abwürfe halten die Combo am Leben – das ist gewollt.** Der Spieler kann
  eine Combo mit Abwürfen „kaufen“ und entscheidet damit: Vorrat aufbrauchen
  und früher Game Over riskieren, oder die Combo aufgeben.
- Lokaler **Highscore**; Game Over zeigt Punkte, Highscore („New best“),
  erreichte Stufe, Zahl der einfarbigen Ringe und längste Combo.

## 6. Entscheidungen des Spielers

Das Spiel lebt von drei schnellen Abwägungen:

- **Sicher oder sortiert?** Lege ich dorthin, wo Platz ist, oder baue ich
  gezielt auf einen einfarbigen Ring hin?
- **Sortierung opfern oder abwerfen?** Lege ich ein unpassendes Segment so,
  dass es meine Sortierung zerstört, oder gebe ich einen Abwurf dafür aus?
- **Combo oder Sicherheit?** Halte ich mehrere fast volle Ringe für eine
  Combo bereit, obwohl das die Blockade-Gefahr erhöht? Und gebe ich Abwürfe
  aus, um die Combo zu halten?

Zusammenspiel: Gutes Sortieren füllt den Abwurf-Vorrat, der Blockaden
abfedert. Mit mehr Farben wird Einfarbig seltener, der Vorrat sinkt,
Blockaden werden gefährlicher.

## 7. Rückmeldung (Game Feel)

Jedes Ereignis hat eine eigene sichtbare und hörbare Rückmeldung:

| Ereignis | Bild | Klang |
|---|---|---|
| Platzieren | Segment fliegt in den Ring, Punkt-Popup, Fortschrittsbalken wächst | weicher „Plopp“, Tonhöhe steigt mit Füllstand |
| Fehltipp | Ring wackelt, belegendes Segment leuchtet auf | tiefes Brummen, kurze Vibration |
| Ring geleert | Ring blinkt weiß, Partikel | aufsteigendes Arpeggio |
| Einfarbig | Ring blinkt zweimal in seiner Farbe, Abwurf fliegt ins HUD | helleres Arpeggio mit Glitzern |
| Combo | Combo-Ring im HUD füllt sich um ein Segment, Popup „×2“, „×3“ … | Leeren-Klang je Combo-Stufe einen Halbton höher |
| Combo-Abbruch | Combo-Ring im HUD leert sich | noch offen |
| Abwurf | Segment fliegt in Wischrichtung hinaus | Whoosh |
| Wisch bei 0 Abwürfen | wie Timeout, zusätzlich leuchtet der ganze Bildschirm rot auf | wie Timeout |
| Timeout | Segment verfällt, Rand blinkt rot, Leben erlischt | fallender Sweep, längere Vibration |
| Timeout bei Blockade | zusätzlich leuchten die sechs belegten Plätze der Position auf (nur in den Anfangsstufen) | wie Timeout |
| Stufenaufstieg | Leuchtpuls über das Feld, Fortschrittsbalken beginnt neu, Look wird intensiver | anschwellender Akkord |
| Bonus-Segment | Joker pulsiert; Aufräumer noch offen | Schimmer |
| Timer läuft ab | Bogen durchläuft einen Farbverlauf und endet bei Rot | leises Ticken in den letzten 25 % |

Vibration gibt es im Browser auf dem iPhone nicht; dort bleibt es bei Bild
und Ton.

## 8. Look und Sound

- **Neon-Look:** dunkler Hintergrund, leuchtende Segmente mit Glow. Poppige,
  hochgesättigte und leuchtende Farben. Der Look wird mit den Stufen
  intensiver.
- **Sechs Segmentfarben**, jede mit festem **Symbol** – auch bei Farbschwäche
  unterscheidbar.
- **Timer-Bogen:** hat eine eigene Darstellung, die sich von den Segmenten
  abhebt: ein Regenbogen-Verlauf, der bei Rot endet. Die Ähnlichkeit zum
  Regenbogen-Joker stört nicht; der Timer-Bogen bleibt so.
- **Kein Text im laufenden Spiel:** nur Zahlen und Symbole.
- **Sound:** futuristisch mit Synthwave – **Effekte und Musik**. Beides gehört
  zum ersten Umfang und entsteht gemeinsam.
- **Assets:** Grafiken, Soundeffekte und Musik werden lokal über ComfyUI
  erzeugt und liegen dem Spiel als Dateien bei. Die Modelle werden in späteren
  Schritten gewählt. Effekte und einfache Grafiken können auch per Code
  erzeugt werden.

## 9. Bildschirme und Ablauf

- **Start:** Titel, Slogan, „Play“, „How to play“, Mute.
  Zeigt den aktuellen Highscore an.
- **How to play:** eine Seite zum Nachschlagen, die die Spielmechanik mit
  Text und Bildern erklärt – auch die Blockade.
- **Tutorial-Frage** beim ersten „Play“: „Play tutorial?“ – wird nur einmal
  gestellt.
- **Tutorial:** fünf geführte Schritte mit vorbereiteten Segmenten, ohne
  Timer und ohne Strafe, mit animierter Hand: Platzieren, Fehltipp, Leeren
  (einfarbig), Abwerfen an einer vorbereiteten Blockade, Abschluss mit
  „Ready?“. Jederzeit „Skip“.
- **Partie:** oben Leben, Punktestand, Abwürfe, Combo-Ring und der
  Fortschrittsbalken zur nächsten Stufe; unten klein Pause und Mute. Keine
  Stufenzahl.
- **Pause:** manuell, beim App-Wechsel automatisch, im Querformat mit
  Dreh-Hinweis. Das aktuelle Segment ist verdeckt, und **alle Ringe werden so
  angezeigt, dass der Spielstand nicht erkennbar ist** – die Pause darf keine
  Bedenkzeit verschaffen. Schaltflächen: „Resume“, „Restart“ (sofort neue
  Partie) und „Menu“.
- **Fortsetzen:** Nach „Resume“ läuft bei verdecktem Feld ein **Countdown von
  3 Sekunden**. Danach wird das Feld wieder angezeigt, und der Timer läuft
  mit der **Restzeit** weiter, die beim Pausieren übrig war.
- **Game Over:** Werte einschließlich der erreichten Stufe, „Again“ (sofort
  neue Partie), „Menu“.
- Eine laufende Partie wird nicht gespeichert.

## 10. Plattform (kurz)

- Hochformat-Spiel fürs Handy.
- Annahme: Web-App (PWA), die sich auf den Startbildschirm legen lässt.
  Freunde bekommen nur einen Link.

## 11. Nicht-Ziele

Keine Online-Bestenliste, kein Mehrspieler,
keine Level oder Kampagne, keine Drehmechanik, kein Ziehen und Ablegen,
keine Belohnung für Schnelligkeit, keine Werbung und keine Käufe, kein Konto
und kein Server, kein Tracking, nur Englisch, kein Einstellungsmenü (nur Mute
und Pause), keine Tastaturbedienung, keine Stufenzahl im laufenden Spiel,
kein Blockade-Hinweis vorab, kein Wisch-Hinweis im laufenden Spiel, keine
Vorschau auf das nächste Segment, kein Abfangen von Fehlgriffen in einen
Nachbarring.

## 12. Abstimmung der Spielwerte

Die Werte oben sind Startwerte. Sie werden per **Bot-Simulation** und
**Spieltest** abgestimmt.

- **Bot-Strategien:** Anfänger, vollster passender Ring, ein Ring pro Farbe,
  vorausplanend (plant, welche Ringe als Nächstes schließen, und wirft
  überzählige Positionen ab; kennt das nächste Segment nicht), Combo-Jäger (wirft alles ab, was
  keinen Ring schließt).
- **Menschenmodell:** Die Bots bekommen eine Entscheidungszeit und eine
  Fehltipp-Quote, damit auch Timeouts und die Timer-Kurve geprüft werden.
- **Stellschrauben:** neben den Stufenwerten auch der Positionsgenerator
  (Beutelgröße, Stärke der Gewichtung, Mischverhältnis, Großzügigkeit am
  Anfang), die Bonus-Segmente (Auslöser und Höhe der Chance) und die Staffel
  der Strafzeiten.

Wichtige Zielwerte:

- Geübte: **Median 150 bis 300 Züge je Partie**. Die Bots liefern dazu eine
  Schätzung, der Spieltest prüft sie. Zielwerte werden in Zügen angegeben,
  nicht in Minuten.
- Anfänger: mindestens Stufe 4.
- Kaum erzwungene Lebensverluste auf Stufe 1 bis 4.
- Blockaden kommen vor, entstehen aber überwiegend durch eigene
  Entscheidungen und nicht durch reines Pech.
- **Blockade-Rate je Füllstand und Unwucht** als eigener Messwert: Ein volles
  Feld muss spürbar gefährlicher bleiben als ein leeres, auch für den
  Combo-Jäger. Die Unwucht ist die höchste Abweichung zwischen den gezogenen
  Positionen (am einfachsten: die Zahl der Kopien je Position im Beutel).
- Der erste Ring gelingt früh, ohne garantiert zu sein.
- Keine Strategie dominiert alle anderen; Einfarbig lohnt sich weder nie noch
  immer; der Abwurf-Vorrat ist weder dauernd leer noch dauernd voll. **Der
  Vorrat wird je Stufe gemessen**, nicht nur über die ganze Partie.
- **Einfarbig-Quote je Stufe** als eigener Messwert: Bei 5 und 6 Farben darf
  Einfarbig selten werden, aber nicht verschwinden.
- **Streuung der Endpunktzahl je Strategie** als eigener Messwert: Die
  Multiplikatoren für Stufe, Einfarbig und Combo stapeln sich bis ×67,5. Ein
  einzelner Glücksfall soll eine Partie nicht entscheiden. Die Formel bleibt
  vorerst unverändert.

Varianten, die die Simulation vergleicht:

- Auf einer Stufe mit neuer Farbe wird der Timer nicht verkürzt.
- Timer auf Stufe 12 bei 2,5 s statt 2,0 s.
- Prüfpunkt: Dominiert der Combo-Jäger, weil Abwürfe nicht für den
  Stufenaufstieg zählen? Der knappe Vorrat begrenzt den Effekt vermutlich.
- **Abwurf-Vorrat:** Bei 2 bis 3 Farben ist er vermutlich dauernd voll, bei
  6 Farben versiegt er. Zwei Gegenmittel im Vergleich: ein Abwurf je
  Stufenaufstieg; Punkte statt Abwurf bei Einfarbig mit vollem Vorrat.
- **Flacher Anfang:** Die Stufen 1 bis 4 sind 44 Platzierungen fast ohne
  Einsatz und kommen nach jedem „Again“ erneut. Variante mit kürzeren ersten
  Stufen (etwa 6 / 6 / 8 / 10).
- **Strafzeiten:** die Staffel 0,5 / 1 / 2 / 4 s gegen flachere und steilere
  Staffeln.
- **Prüfpunkt Endlosphase:** Wie lang werden die Partien des besten Bots nach
  Stufe 12? Bei einem langen flachen Ende käme ein anderer Hebel in Frage,
  etwa ein wachsender Beutel (mehr Unwucht, mehr Blockaden).

Die Simulation allein entscheidet das nicht: Am Ende von Etappe 2 folgt ein
Spieltest mit Menschen (siehe Abschnitt 15).

## 13. Zukunftsideen

- Mehrere konzentrische Ebenen je Ring.

## 14. Offene Fragen und Entscheidungen

### Entschieden
- **Aufräumer:** räumt nur den angetippten Ring, nicht das ganze Spielfeld.
- **Bonus-Segmente:** haben einen Timer, ihr Timeout kostet ein Leben. Sie
  dürfen abgeworfen werden und zählen für den Stufenaufstieg.
- **Combo:** höchstens ×6. Ein Combo-Ring im HUD füllt sich mit jeder Leerung
  in Folge, schon ab der ersten.
- **Längste Combo:** zählt über ×6 hinaus weiter, bringt aber nicht mehr
  Punkte.
- **Fortschrittsbalken nach Stufe 12:** zeigt dasselbe wie vorher.
- **Aufstiege nach Erreichen des Timer-Minimums:** ändern nichts mehr; das
  bleibt so.
- **Positionsgenerator:** von Anfang an eine Mischung aus Beutel und
  Gewichtung, keine Entscheidung zwischen beiden.
- **Bot „vorausplanend“:** plant voraus, kennt das nächste Segment aber
  nicht. Eine Vorschau gibt es weder für Bots noch im Spiel.
- **Doppeltipp-Schutz:** 100 ms, ohne Rückmeldung für verworfene Tipps.
- **Fortsetzen nach der Pause:** Countdown von 3 Sekunden bei verdecktem
  Feld, dann läuft der Timer mit der Restzeit weiter.
- **Wisch bei 0 Abwürfen:** rot aufleuchtender Bildschirm. Das Abwurf-Symbol
  schaltet bei 0 Abwürfen auf „Aufgeben“ um. Kein Aufleuchten eines freien
  Platzes nach einer Aufgabe.
- **Kein Wisch-Hinweis im Spiel:** Wer das Tutorial ablehnt, bekommt im
  laufenden Spiel keine Erklärung des Abwurfs; dafür gibt es How-to-play.
- **Timer-Bogen:** bleibt ein Regenbogen-Verlauf, trotz Ähnlichkeit zum
  Joker.
- **Zug:** nur Platzierungen.
- **Assets:** Erzeugung über ComfyUI.
- **Vibration:** fehlt im Browser auf dem iPhone; das ist in Ordnung.
- **Lesbarkeit:** Position, Farbe und Symbol sind erkennbar, die Ringe sicher
  zu treffen, die gedrehte Anordnung funktioniert – getestet auf einem
  iPhone 17.
- **Abwurf ohne Tutorial:** Die Tutorial-Frage kommt beim ersten Spiel. Wer
  ablehnt, bekommt keinen Hinweis auf den Wisch – auch keinen ohne Text.
- **Aufgeben-Wisch:** bekommt keine zusätzliche Warnung in der Mitte. Wisch
  und Timeout kosten beide ein Leben.
- **Blockade-Rückmeldung:** Die belegten Plätze leuchten nur in den
  Anfangsstufen auf. Später muss der Spieler das Feld selbst im Blick haben;
  nach einem Timeout ohne Blockade wird kein freier Platz gezeigt.
- **Flacher Anfang mit 2 Farben:** ist gewollt. Er soll den Spieler mit
  Erfolgen an das Spiel binden.
- **Endphase mit 6 Farben:** bleibt. Eine tragfähige Strategie ist dort, zwei
  Ringe für Einfarbig freizuhalten und vier gemischt zu nutzen.
- **Joker-Platz:** bleibt „erster freier Platz im Uhrzeigersinn ab 1 Uhr“,
  weil das für den Spieler vorhersehbar ist.
- **Aufräumer auf fast leeren Ringen:** bringt die vollen Abräumpunkte und
  hält die Combo. Er ist ein Bonus: viele Punkte oder Hilfe in kniffligen
  Lagen. Offen bleibt nur sein Einfarbig-Bonus.
- **Doppeltipp-Fenster:** Tipps bis 100 ms nach dem Erscheinen des Segments
  zählen nicht.

### Noch offen
- **Bonus-Segmente:** Welche Ereignisse erhöhen ihre Chance, und um wie viel?
- **Aufräumer:** Ab wie vielen Segmenten zählt sein Einfarbig-Bonus? Wie
  sieht seine Rückmeldung aus?
- **Timer:** Wie schnell sinkt er nach Stufe 12 auf sein absolutes Minimum,
  und liegt das bei 1,8 s?
- **Stufen nach Stufe 12:** Wie viele Platzierungen dauert eine Stufe?
- **Positionsgenerator:** das Verhältnis von Beutel und Gewichtung in der
  Mischung und die Form des gnädigen Anfangs (Simulation).
- **Varianten aus Abschnitt 12:** Timer auf Stufe 12, flacher Anfang,
  Gegenmittel beim Abwurf-Vorrat, Staffel der Strafzeiten (Simulation und
  Spieltest).
- **Anfangsstufen:** Bis zu welcher Stufe leuchten die belegten Plätze nach
  einem Blockade-Timeout auf?
- **Fehlende Rückmeldungen:** Einfarbig bei vollem Vorrat; Klang beim
  Combo-Abbruch.
- **Assets:** Welche ComfyUI-Modelle erzeugen Grafik, Effekte und Musik, und
  reicht die Qualität?

## 15. Etappen

1. **Kleinste spielbare Version** auf einem echten Handy:
   - Spielfeld in der gedrehten Anordnung, Segmente mit Farbe und Symbol.
   - Tippen, Fehltipp, Ring leeren, Einfarbig, Abwurf per Wisch, einfacher
     Combo-Zähler, Timer, 3 Leben, Game Over mit Punkten und „Again“.
   - Entwickler-Regler für Timer, Farbzahl und Strafzeiten, damit sich auch
     6 Farben bei 2 s ausprobieren lassen.
   - Minimale sichtbare Rückmeldung: Ring wackelt, Ring blinkt, Einfarbig
     blinkt sichtbar anders als ein normales Leeren, Leben erlischt, belegte
     Plätze leuchten nach einem Blockade-Timeout auf.
   - Positionen aus einem einfachen Beutel; die Beutelgröße ist ein weiterer
     Entwickler-Regler (ein sehr großer Beutel entspricht reinem Zufall). Die
     Mischung mit der Gewichtung und der gnädige Anfang folgen in Etappe 2.
   - Platzhalter-Grafik, kein Ton, keine Stufen, kein Tutorial, keine
     Bonus-Segmente, keine Installation als App.
   - Parallel: je ein Probe-Asset (Grafik, Effekt, Musik) aus dem lokalen
     Modell, um die Erzeugung früh zu prüfen.
   - Zum Abschluss ein **Kurztest** von etwa fünf Minuten mit ein oder zwei
     Freunden und nur einem Satz Erklärung: Verstehen sie, dass die Position
     feststeht und sie nur den Ring wählen? Gespielt wird mit einer festen
     Einstellung (etwa 3 Farben, 4 s, jede Position zweimal im Beutel).
     Zusätzlich beobachten: Drücken sie „Again“ ohne Aufforderung?
2. **Regelkern und Simulation:** Regeln getrennt von der Darstellung, Stufen,
   Punkte und Combo, Positionsgenerator, Bonus-System mit dem Joker,
   Bot-Simulation zur Abstimmung. Reihenfolge: zuerst Stufen, Punkte und
   Combo mit den Startwerten bauen und selbst spielen, dann Generator und
   Simulation, den Joker zuletzt. Zum Abschluss ein kurzer **Spieltest** mit
   2 bis 3 Personen und Platzhaltergrafik, mit Stufen und Joker. Erst danach
   werden die Werte festgelegt, auf denen Look und Sound aufbauen.
3. **Look, Game Feel, Sound und Musik:** endgültige Grafik, Animationen,
   Rückmeldungen, Timer-Bogen, Soundeffekte und Musik gemeinsam.
4. **Bildschirme:** Start, How to play, Tutorial, Pause, Game Over,
   Highscore, Installation als PWA.
5. **Aufräumer:** als zweiter Bonus am bestehenden Bonus-System.
