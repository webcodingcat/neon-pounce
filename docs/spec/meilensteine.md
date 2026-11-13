# Neon Pounce – Meilensteine

Der Ablauf je Meilenstein steht in der `CLAUDE.md` unter „Workflow per
milestone“, die Definition of Done in der `SPEC.md`. Die A-Nummern verweisen auf
`anforderungen.md`.

Startbefehl für jede Prüfung am Handy, wenn nichts anderes dasteht: `npm run
dev`, dann die angezeigte Netzwerk-Adresse im selben WLAN auf dem Handy öffnen.

Etappen: 1 bis 4 spielbar auf dem Handy, 5 bis 8 Regeln und Abstimmung, 9 bis 11
Look und Klang, 12 bis 15 Bildschirme, 16 Aufräumer.

## Meilenstein 1: Leistungsprobe

**Status:** offen

**Ziel:** Beweisen, dass PixiJS ein volles, leuchtendes Feld auf echten Handys
mit 60 Bildern pro Sekunde zeichnet, bevor irgendetwas darauf aufbaut.

**Anforderungen:** A1 bis A4, A97, A107 (nur Bildraten-Anzeige), A108

**Abschlusskriterium:** Die Geometrie-Tests sind grün, und für iPhone 17 und
Android-Handy liegen Messwerte aus fünf Minuten Leistungsprobe vor. Bestanden
ist die Probe bei einem Mittel von mindestens 58 Bildern pro Sekunde und einer
schlechtesten Sekunde von mindestens 50. Scheitert sie, wird der Renderer neu
entschieden (SPEC.md, Abschnitt 6.2), und die folgenden Meilensteine warten.

**Übergangsverhalten:**
- Die App zeigt nur die Leistungsprobe, es gibt kein Spiel.
- Die Segmente sind Platzhalter mit Glow, ohne endgültige Farben und Symbole.

**Abnahme-Checkliste:**
- [ ] App auf dem iPhone 17 öffnen: Sechs Ringe stehen bei 12, 2, 4, 6, 8 und
      10 Uhr um die Mitte, jeder ist mit sechs leuchtenden Kuchenstücken
      gefüllt, Partikel strömen.
- [ ] iPhone 17 fünf Minuten laufen lassen: Die Anzeige zeigt danach ein Mittel
      von mindestens 58 und eine schlechteste Sekunde von mindestens 50.
- [ ] Dasselbe auf dem Android-Handy: gleiche Grenzwerte.
- [ ] Auf beiden Geräten nach fünf Minuten hinsehen: kein sichtbares Ruckeln,
      das Gerät wird nicht heiß.
- [ ] App auf dem iPad öffnen: Das Feld steht zentriert im Hochformat und ist
      nicht breiter als auf einem großen Handy.

## Meilenstein 2: Legen, Leeren, Abwerfen

**Status:** offen

**Ziel:** Das Feld lässt sich mit dem Finger bespielen: legen, Ringe leeren,
abwerfen, noch ohne Zeitdruck.

**Anforderungen:** A5 bis A8, A10 bis A14, A16 bis A18, A25, A26, A29, A31, A32
(nur Beutel), A35, A44 bis A47, A106

**Abschlusskriterium:** Die Regeltests zu den genannten Anforderungen sind grün,
und eine Partie lässt sich am Handy beliebig lang spielen.

**Übergangsverhalten:**
- Es gibt keinen Timer, keine Leben und kein Game Over. Die Partie endet nur
  durch Neuladen der Seite.
- Ein Fehltipp zeigt nur die Rückmeldung (Ring wackelt) und kostet nichts.
- Ein Wisch bei 0 Abwürfen wird ignoriert.
- Es gilt dauerhaft Stufe 1 mit Multiplikator 1. Die Farbzahl kommt aus der
  Konfiguration (Startwert 3).
- Punkte, Abwürfe und Combo stehen als einfache Zahlen am oberen Rand.
- Rückmeldungen sind minimal: Das Segment springt an seinen Platz, ein geleerter
  Ring blinkt weiß, ein einfarbiger blinkt in seiner Farbe.
- Die Leistungsprobe bleibt über den Schalter in der Konfiguration erreichbar.

**Abnahme-Checkliste:**
- [ ] App öffnen: In der Mitte liegt ein Segment mit Farbe und Symbol an einer
      der sechs Positionen.
- [ ] Einen Ring antippen: Das Segment liegt sofort an derselben Position in
      diesem Ring, ein neues erscheint in der Mitte.
- [ ] Einen Ring antippen, dessen Platz an dieser Position belegt ist: Der Ring
      wackelt, das Segment bleibt in der Mitte.
- [ ] Zwanzig Segmente zügig legen: Jeder Tipp landet im gemeinten Ring, kein
      Tipp wird verschluckt oder dem Nachbarring zugeschlagen.
- [ ] Mit zwei Daumen abwechselnd tippen: Beide Tipps zählen.
- [ ] Einen Ring füllen: Er leert sich sofort und blinkt weiß, die Punkte
      steigen um 110.
- [ ] Einen Ring einfarbig füllen: Er blinkt in seiner Farbe, die Punkte steigen
      um 310, die Abwürfe um 1.
- [ ] Aus der Mitte wischen: Das Segment verschwindet, die Abwürfe sinken um 1,
      ein neues Segment erscheint.
- [ ] Auf einem Ring ansetzen und wischen: Es zählt als Tipp auf diesen Ring,
      nicht als Abwurf.
- [ ] Position, Farbe und Symbol des Segments aus Armlänge ansehen: Alle drei
      sind auf einen Blick erkennbar.

## Meilenstein 3: Zeitdruck und Game Over

**Status:** offen

**Ziel:** Die kleinste vollständige Partie: Timer, Leben, Game Over und „Again“,
öffentlich erreichbar und bereit für den Kurztest.

**Anforderungen:** A9, A15, A19 bis A24, A27, A28, A30, A81 (nur Punkte und
„Again“), A82, A96, A98, A107 (Export), A109, A110, A117, A118

**Abschlusskriterium:** Regeltests und Rauchtests (App lädt, Tipp legt ein
Segment, Game Over erscheint) sind grün, der Kurztest ist durchgeführt, und nach
dem Push ist das Spiel unter dem öffentlichen Link spielbar.

**Zweistufige Abnahme:** Stufe 1 prüfst du vor dem Merge über den
Entwicklungsserver. Stufe 2 ist erst nach Merge und Push prüfbar.

**Übergangsverhalten:**
- Die App startet direkt in einer Partie, ohne Startbildschirm.
- Es gibt keine Stufen: Timer und Farbzahl kommen fest aus der Konfiguration
  (Startwerte 4 s und 3 Farben). Die Blockade-Hilfe (A30) ist immer aktiv.
- Game Over zeigt nur die Punkte und „Again“, kein „Menu“, keinen Highscore.
- Das „Aufgeben“-Symbol und die Leben sind Platzhalter-Symbole.
- Der Timer-Bogen ist einfarbig.
- Es gibt keine Pause. Ein App-Wechsel hält die Partie nicht an.

**Abnahme-Checkliste, Stufe 1:**
- [ ] App öffnen und warten: Das erste Segment bleibt ohne Timer liegen, bis du
      es legst.
- [ ] Erstes Segment wegwischen: Es rutscht ein Stück in Wischrichtung und
      federt zurück, der Vorrat bleibt gleich.
- [ ] Zweites Segment liegen lassen: Der Bogen läuft ab, ein Leben erlischt, das
      nächste Segment erscheint sofort.
- [ ] Fehltipp: Der Bogen springt sichtbar um ein Stück zurück. Zweiter Fehltipp
      auf dasselbe Segment: Der Sprung ist größer.
- [ ] Sofort nach dem Legen blind noch einmal tippen: Der zweite Tipp legt das
      neue Segment nicht.
- [ ] Alle Abwürfe verbrauchen: Das Symbol im HUD wechselt auf „Aufgeben“. Dann
      wischen: Ein Leben erlischt.
- [ ] Eine Position in allen sechs Ringen belegen und den Timer ablaufen lassen:
      Die sechs belegten Plätze leuchten auf.
- [ ] Drittes Leben verlieren: Das Feld blendet in etwa einer Sekunde aus, dann
      erscheint Game Over mit den Punkten.
- [ ] Im Game Over sofort hektisch tippen: „Again“ löst in der ersten halben
      Sekunde nicht aus. Danach „Again“: Eine neue Partie beginnt.
- [ ] Im Game Over „Export“ antippen: Das Teilen-Menü bietet eine JSON-Datei an.
      Sie enthält je Segment Entscheidungszeit und Fehltipps.
- [ ] Zwei Partien am Stück spielen: Das Spiel fühlt sich unter Zeitdruck
      flüssig an, der Timer ist ohne Hinsehen aus dem Augenwinkel lesbar.
- [ ] Kurztest, erster Durchgang (3 Farben, 4 s, Beutel mit jeder Position
      zweimal): Ein oder zwei Freunde spielen etwa fünf Minuten nach einem Satz
      Erklärung. Notieren: Verstehen sie, dass die Position feststeht und sie
      nur den Ring wählen?
- [ ] Kurztest, zweiter Durchgang (in `src/config.ts` 5 Farben und 2,5 s
      einstellen): Die Partie endet sicher im Game Over. Notieren: Drücken sie
      „Again“ ohne Aufforderung?
- [ ] Eigene Partie mit 6 Farben und 2 s spielen und exportieren: Die Datei
      liegt für den Abgleich der Bot-Werte bereit.

**Abnahme-Checkliste, Stufe 2 (nach Merge und Push):**
- [ ] `https://webcodingcat.github.io/neon-pounce/` auf dem Handy öffnen: Das
      Spiel lädt und ist spielbar.
- [ ] Dort eine Partie bis zum Game Over spielen: Es gibt keine
      Bildraten-Anzeige und kein „Export“.
- [ ] Das Repo auf GitHub öffnen: Das README nennt den Link zum Spiel.

## Meilenstein 4: Asset-Kette und Probe-Assets

**Status:** offen

**Ziel:** Klären, ob ComfyUI lokal brauchbare Hintergründe, Effekte und Musik
liefert, bevor Look und Klang darauf aufbauen.

**Anforderungen:** keine. Geklärt werden die Annahmen „ComfyUI liefert lokal
brauchbare Grafik, Effekte und Musik“ und „Lizenz der Assets“ aus der SPEC.md.

**Abschlusskriterium:** `/wcc:asset-setup` ist durchgelaufen, je eine Probe für
Hintergrund, Effekt und Musik liegt vor, und in der SPEC.md stehen die
Entscheidung „ComfyUI bleibt oder nicht“ sowie die Lizenzen der Modelle.

Dieser Meilenstein enthält keinen Spielcode. Die Schritte „Tests zuerst“ und
„Code-Review“ des Workflows entfallen, wenn kein Code entsteht. Workflows und
Skripte, die ins Repo kommen, prüft der `docs-reviewer` mit.

**Übergangsverhalten:** keines. Die Proben werden nicht ins Spiel eingebaut.

**Abnahme-Checkliste:**
- [ ] Probe-Hintergrund ansehen (blau-schwarz, Neon, Hochformat): Er ist als
      Hintergrund hinter leuchtenden Ringen vorstellbar und lenkt nicht ab.
- [ ] Probe-Effekt anhören (Whoosh für den Abwurf): Er klingt futuristisch,
      nicht nach 8-Bit, und ist kürzer als eine Sekunde.
- [ ] Probe-Musik anhören (Synthwave, 60 bis 120 s): Sie trägt mehrere Minuten
      in Schleife, ohne zu nerven.
- [ ] Die Erzeugung einer Probe wiederholen: Der Weg vom Befehl zur fertigen
      Datei funktioniert ohne Handarbeit, die nicht dokumentiert ist.
- [ ] Die Lizenzangaben der Modelle lesen: Sie erlauben, die Assets in einem
      öffentlichen Repo auszuliefern.

## Meilenstein 5: Stufen, Punkte, Combo

**Status:** offen

**Ziel:** Die Partie steigert sich über 12 Stufen und die Endlosphase, mit
vollständiger Punkte- und Combo-Rechnung.

**Anforderungen:** A36 bis A43, A48 bis A50, A80, A81 (ohne „Menu“ und
Highscore)

**Abschlusskriterium:** Die Tests zu Stufen, Punkten und Combo sind grün, und
eine Partie durchläuft am Handy sichtbar mehrere Stufen.

**Übergangsverhalten:**
- Game Over zeigt Punkte, erreichte Stufe, einfarbige Ringe und längste Combo,
  aber weder Highscore noch „Menu“.
- Fortschrittsbalken, Combo-Ring und der Leuchtpuls beim Aufstieg sind
  Platzhalter in einfacher Form.
- Der Generator ist weiterhin nur der Beutel.
- Pause- und Mute-Symbol im HUD fehlen noch.

**Abnahme-Checkliste:**
- [ ] Acht Segmente legen: Der Fortschrittsbalken ist voll, beginnt neu, und
      ein Leuchtpuls läuft über das Feld. Eine Stufenzahl ist nirgends zu sehen.
- [ ] Bis Stufe 3 spielen: Eine dritte Farbe mit eigenem Symbol erscheint.
- [ ] Zwei Ringe direkt nacheinander leeren: Der Combo-Ring zeigt zwei gefüllte
      Plätze, die zweite Leerung bringt sichtbar mehr Punkte.
- [ ] Während einer Combo ein Segment abwerfen und dann wieder leeren: Der
      Combo-Ring wächst weiter.
- [ ] Während einer Combo ein Segment legen, ohne zu leeren: Der Combo-Ring
      leert sich.
- [ ] Partie beenden: Game Over zeigt Punkte, Stufe, einfarbige Ringe und
      längste Combo, und die Werte passen zu dem, was du gespielt hast.
- [ ] Zehn Partien mit den Startwerten spielen und notieren: Bis zu welcher
      Stufe kommst du, und ermüden die Stufen 1 bis 4 nach mehreren „Again“?

## Meilenstein 6: Bot-Simulation

**Status:** offen

**Ziel:** Bots spielen tausende Partien und liefern die Messwerte, mit denen die
Spielwerte abgestimmt werden.

**Anforderungen:** A111 bis A114, A116

**Abschlusskriterium:** Die Tests zu Bots und Wiederholbarkeit sind grün, `npm
run sim` schreibt einen Bericht mit allen Messwerten aus A113, und der kurze
Lauf läuft in der CI.

**Übergangsverhalten:**
- Die Simulation rechnet mit dem einfachen Beutel und ohne Bonus-Segmente.
- Varianten lassen sich noch nicht nebeneinander auswerten.

**Abnahme-Checkliste:** Startbefehl ist `npm run sim`.
- [ ] `npm run sim` zweimal starten: Beide Berichte sind gleich.
- [ ] Den Bericht lesen: Für jeden der fünf Bots stehen Züge, Stufe, Punkte,
      Blockade-Rate, Einfarbig-Quote und Abwurf-Vorrat je Stufe darin, und du
      verstehst jede Zahl ohne Nachfrage.
- [ ] Die Zahlen des vorausplanenden Bots mit deinen eigenen Partien aus
      Meilenstein 5 vergleichen: Die Größenordnung passt, oder du nennst die
      Abweichung.
- [ ] Die exportierten Protokolle aus Meilenstein 3 mit den Schätzwerten der
      Bots (0,8 s und 2 %, 1,6 s und 8 %) vergleichen: Du entscheidest, ob die
      Schätzwerte bleiben.
- [ ] In den Protokollen die Entscheidungszeit je Farbzahl vergleichen: Steigt
      sie mit der Farbzahl klar an, entscheidest du, dass sie auch im
      Menschenmodell der Bots steigt.

## Meilenstein 7: Positionsgenerator und Abstimmung

**Status:** offen

**Ziel:** Der Generator mischt Beutel und Gewichtung, und die Spielwerte sind
anhand von Simulation und eigenem Spiel entschieden.

**Anforderungen:** A32 bis A34, A115

**Abschlusskriterium:** Die Generator-Tests sind grün, der Variantenvergleich
liegt vor, der `balance-reviewer` hat die Messwerte bewertet, und die
entschiedenen Werte stehen in `balance.md` und in der Konfiguration.

**Übergangsverhalten:**
- Es gibt noch keine Bonus-Segmente. Ziele der Prüfliste, die vom Joker
  abhängen, werden in Meilenstein 8 erneut bewertet.

**Abnahme-Checkliste:** Startbefehle sind `npm run sim` und `npm run dev`.
- [ ] Den Variantenvergleich lesen: Für jede offene Stellschraube aus
      `balance.md`, Abschnitt 5 (außer Bonus) stehen die Varianten mit ihren
      Messwerten nebeneinander.
- [ ] Je Stellschraube entscheiden: Welcher Wert gilt? Die Entscheidung steht
      danach mit Begründung in `balance.md`.
- [ ] Mit den neuen Werten zehn Partien spielen: Der erste Ring gelingt meist
      früh, aber nicht immer.
- [ ] Absichtlich das Feld vollspielen: Es fühlt sich gefährlicher an als ein
      leeres Feld, Blockaden kommen vor.
- [ ] Über mehrere Tage spielen und die Zugzahl notieren: Dein Median liegt
      zwischen 150 und 300, oder du nennst die Richtung der Abweichung.

## Meilenstein 8: Bonus-System und Joker

**Status:** offen

**Ziel:** Der Joker erscheint als Belohnung über ein allgemeines Bonus-System,
und die Spielwerte sind nach einem Spieltest festgelegt.

**Anforderungen:** A51 bis A57

**Abschlusskriterium:** Die Tests zu Bonus-System und Joker sind grün, die
Simulation rechnet mit dem Joker, der `balance-reviewer` hat die Prüfliste
erneut bewertet, und der Spieltest ist durchgeführt. Danach gelten die Werte als
fest für Look und Klang.

**Übergangsverhalten:**
- Der Joker ist ein Platzhalter: weißes Segment mit Stern, ohne Regenbogen und
  ohne Pulsieren.
- Der Ring nur aus Jokern blinkt wie ein einfarbiger Ring.

**Abnahme-Checkliste:**
- [ ] Einen einfarbigen Ring leeren und weiterspielen: In den folgenden
      Segmenten erscheint gelegentlich ein Joker, nicht jedes Mal.
- [ ] Einen Joker in einen Ring tippen: Er landet auf dem ersten freien Platz im
      Uhrzeigersinn ab 1 Uhr.
- [ ] Einen Ring mit fünf gleichfarbigen Segmenten mit dem Joker schließen: Er
      zählt als einfarbig, ein Abwurf kommt zurück.
- [ ] Einen Joker liegen lassen: Der Timer läuft ab, ein Leben erlischt.
- [ ] Den Bericht der Simulation lesen: Der Anteil der Bonus-Segmente liegt
      zwischen 1 % und 10 %.
- [ ] Spieltest mit 2 bis 3 Personen, etwa 15 Minuten je Person: Notieren, bis
      zu welcher Stufe sie kommen, wo sie Leben verlieren, ob sie den Joker
      verstehen und ob sie nach dem Game Over von selbst „Again“ drücken.
- [ ] Nach dem Spieltest entscheiden: Die Werte bleiben, oder du nennst, was
      sich ändern soll.

## Meilenstein 9: Stil

**Status:** offen

**Ziel:** Der Look steht: Palette, Symbole, Glow, Schrift, Timer-Bogen und
Hintergrund, von dir freigegeben.

**Anforderungen:** A2 (Fugen), A57, A66 bis A69, A117 (Screenshot)

**Abschlusskriterium:** Die Tests zu Kontrast, Farbabstand und Mindestgrößen
sind grün, `npm run screenshots` schreibt die Bilder, der
`grafik-audio-reviewer` hat sie bewertet, und du hast den Look freigegeben.
Palette, Symbole, Schrift, Fugenbreite und Proportionen stehen danach in
`grafik-audio.md`.

**Übergangsverhalten:**
- Animationen fehlen noch: Segmente springen an ihren Platz, Rückmeldungen
  bleiben die einfachen aus den früheren Meilensteinen.
- Der Look ist auf allen Stufen gleich intensiv.
- Es gibt noch keinen Ton.

**Abnahme-Checkliste:**
- [ ] Zwei bis drei Schrift-Kandidaten im Spielbild vergleichen und eine wählen:
      Zahlen im HUD sind auch klein gut lesbar.
- [ ] Zwei bis drei Varianten von Palette und Hintergrund vergleichen und eine
      wählen: blau-schwarzer Grund, viel Neon.
- [ ] Partie am Handy spielen: Die sechs Farben sind auf einen Blick zu
      unterscheiden, jedes Symbol ist auf seinem Segment erkennbar.
- [ ] Das Handy in den Graustufen-Modus schalten und spielen: Die Segmente
      lassen sich allein am Symbol unterscheiden.
- [ ] Volles Feld auf Stufe 12 ansehen: Das Segment in der Mitte hebt sich klar
      vom Rest ab, der Hintergrund lenkt nicht ab.
- [ ] Timer-Bogen ablaufen lassen: Der Regenbogen-Verlauf endet bei Rot und ist
      aus dem Augenwinkel lesbar.
- [ ] Joker ansehen: Er pulsiert in Regenbogenfarben und ist nicht mit dem
      Timer-Bogen zu verwechseln.
- [ ] Leistungsprobe erneut fünf Minuten auf beiden Handys laufen lassen: Die
      Grenzwerte aus Meilenstein 1 gelten weiter.
- [ ] Gesamteindruck: Es sieht nach Neon und Zukunft aus. Du gibst den Look
      frei.

## Meilenstein 10: Rückmeldungen im Bild

**Status:** offen

**Ziel:** Jedes Ereignis hat seine sichtbare Rückmeldung, und der Look wird mit
den Stufen intensiver.

**Anforderungen:** A63 (Spalte Bild), A64, A65

**Abschlusskriterium:** Der Test „jedes Ereignis löst seine Rückmeldung aus“ ist
grün, der `grafik-audio-reviewer` hat neue Screenshots bewertet, und die
Bildrate bleibt auf beiden Handys bei 60.

**Übergangsverhalten:**
- Es gibt noch keinen Ton.

**Abnahme-Checkliste:** Jedes Ereignis einzeln am Handy auslösen.
- [ ] Legen: Das Segment fliegt in den Ring, ein Punkt-Popup erscheint.
- [ ] Fehltipp: Der Ring wackelt, das belegende Segment leuchtet auf. Auf dem
      Android-Handy vibriert es kurz.
- [ ] Ring leeren: Er blinkt weiß, Partikel fliegen.
- [ ] Einfarbig leeren: Er blinkt zweimal in seiner Farbe, ein Abwurf-Symbol
      fliegt ins HUD.
- [ ] Einfarbig leeren bei vollem Vorrat: Die Abwurf-Anzeige pulsiert, kein
      Symbol fliegt.
- [ ] Combo: Der Combo-Ring füllt sich, „×2“ erscheint als Popup, und das
      Punkt-Popup der Leerung zeigt den Gesamtwert des Zugs, sichtbar größer.
- [ ] Combo von mindestens 2 abreißen lassen: Die Plätze des Combo-Rings fallen
      nacheinander ab, und du bemerkst es, ohne hinzusehen.
- [ ] Abwerfen nach links und nach oben: Das Segment fliegt in die jeweilige
      Wischrichtung hinaus.
- [ ] Timeout: Der Rand blinkt rot, ein Leben erlischt. Auf dem Android-Handy
      vibriert es länger.
- [ ] Aufgeben bei 0 Abwürfen: Der ganze Bildschirm leuchtet rot auf.
- [ ] Stufenaufstieg: Ein Leuchtpuls läuft über das Feld.
- [ ] Bis Stufe 6 und weiter spielen: Der Look wird sichtbar intensiver, das
      Feld bleibt lesbar.
- [ ] Eine schnelle Partie spielen: Keine Animation bremst das nächste Segment
      oder verdeckt die Mitte.
- [ ] Mit eingeschalteter Bildraten-Anzeige eine Partie mit vielen Leerungen
      spielen: Das Mittel bleibt bei mindestens 58.

## Meilenstein 11: Soundeffekte und Musik

**Status:** offen

**Ziel:** Jedes Ereignis hat seinen Klang, die Musik läuft, und Mute schaltet
beides.

**Anforderungen:** A63 (Spalte Klang), A70 bis A75, A103 (Musik)

**Abschlusskriterium:** Die Tests zur Zuordnung Ereignis und Effekt, zu
Tonhöhen und zu den Pegeln sind grün, die Musikdatei erfüllt die Messwerte aus
`grafik-audio.md`, und du hast je Effekt zwischen Code und ComfyUI entschieden.

**Übergangsverhalten:**
- Mute wird nicht gespeichert: Nach jedem Start ist der Ton an.
- Die Musik läuft nur in der Partie. Menüs gibt es noch nicht.
- Ein App-Wechsel hält die Musik an, aber noch nicht die Partie.

**Abnahme-Checkliste:**
- [ ] App auf dem iPhone öffnen und das erste Segment legen: Ab dieser Berührung
      sind Effekte und Musik zu hören.
- [ ] Einen Ring Segment für Segment füllen: Der Plopp wird mit jedem Segment
      höher.
- [ ] Drei Ringe in Folge leeren: Das Arpeggio klingt jedes Mal einen Halbton
      höher.
- [ ] Fehltipp, Abwurf, Timeout, Stufenaufstieg und Joker auslösen: Jedes
      Ereignis hat einen eigenen, erkennbaren Klang.
- [ ] Timer fast ablaufen lassen: In den letzten 25 % tickt es leise.
- [ ] Combo abreißen lassen: Kein eigener Klang.
- [ ] Mute antippen: Effekte und Musik schweigen sofort. Noch einmal: Beides ist
      wieder da.
- [ ] Musik drei Durchläufe lang anhören: Der Übergang der Schleife ist nicht zu
      hören.
- [ ] Eine Partie mit Ton spielen: Die Effekte liegen klar über der Musik,
      nichts übersteuert oder schmerzt.
- [ ] Vergleich anhören (`discard`, `timeout`, `levelUp`, `bonus` je einmal per
      Code und aus ComfyUI): Du entscheidest je Effekt.
- [ ] Gesamteindruck: Es klingt futuristisch, nicht nach 8-Bit.

## Meilenstein 12: Start, Game Over, Highscore

**Status:** offen

**Ziel:** Das Spiel hat einen Startbildschirm, ein vollständiges Game Over und
merkt sich Highscore und Mute.

**Anforderungen:** A76, A81, A83 (Übergänge von Start und Game Over), A84, A92
bis A95, A103 bis A105

**Abschlusskriterium:** Die Tests zu Speicherformat, Highscore-Regel und den
genannten Übergängen sind grün, der Rauchtest läuft vom Startbildschirm bis zum
Game Over.

**Übergangsverhalten:**
- „How to play“ ist sichtbar, führt aber auf eine leere Seite mit „Back“.
- „Play“ startet immer direkt die Partie. Die Tutorial-Frage kommt in
  Meilenstein 14, `tutorialAsked` wird bis dahin nie gesetzt.
- Es gibt weiterhin keine Pause.

**Abnahme-Checkliste:**
- [ ] App öffnen: Titel, Slogan, Highscore 0, „Play“, „How to play“ und Mute
      sind zu sehen, die Musik läuft nach der ersten Berührung leiser als in der
      Partie.
- [ ] „Play“: Die Partie beginnt, die Musik wird lauter.
- [ ] Partie mit Punkten beenden: Game Over zeigt „New best“ und alle fünf
      Werte. „Menu“ führt zum Start, dort steht der neue Highscore.
- [ ] Eine schlechtere Partie spielen: Kein „New best“, der Highscore bleibt.
- [ ] Mute einschalten, App schließen und neu öffnen: Sie bleibt stumm, der
      Highscore ist noch da.
- [ ] Im Browser die gespeicherten Daten der Seite löschen und neu laden: Das
      Spiel startet ohne Fehler mit Highscore 0 und Ton.
- [ ] Im Flugmodus neu laden (ohne installierte App): Entweder lädt die Seite
      nicht, oder das Spiel läuft. Eine halb geladene Seite mit Fehlermeldung
      gibt es nicht.

## Meilenstein 13: Pause

**Status:** offen

**Ziel:** Die Partie lässt sich anhalten, ohne dass die Pause Bedenkzeit
verschafft.

**Anforderungen:** A85 bis A91, A83 (Übergänge von Pause und Countdown), A72
(Musik in der Pause)

**Abschlusskriterium:** Die Tests zu Auslösern, Restzeit, Countdown und
Sonderfällen sind grün.

**Übergangsverhalten:** keines.

**Abnahme-Checkliste:**
- [ ] In der Partie die Pause-Taste antippen: Alle Ringe sind leere Umrisse, die
      Mitte ist leer, die Musik schweigt. „Resume“, „Restart“ und „Menu“ sind zu
      sehen.
- [ ] Pausenbild ansehen: Du kannst nicht erkennen, welche Plätze belegt waren
      und welches Segment anlag.
- [ ] „Resume“: Ein Countdown von 3 läuft bei verdecktem Feld, danach ist das
      Feld wieder da, und der Timer-Bogen steht dort, wo er beim Pausieren war.
- [ ] In der Partie zu einer anderen App wechseln und zurückkommen: Das
      Pausenmenü steht da, der Timer ist nicht weitergelaufen.
- [ ] Während des Countdowns die App wechseln und zurückkommen: Das Pausenmenü
      steht wieder da.
- [ ] Handy ins Querformat drehen: Nur der Dreh-Hinweis ist zu sehen. Zurück ins
      Hochformat: Das Pausenmenü erscheint.
- [ ] Auf dem Startbildschirm ins Querformat drehen und zurück: Dreh-Hinweis,
      dann wieder der Startbildschirm.
- [ ] „Restart“: Sofort beginnt eine neue Partie mit 0 Punkten. „Menu“ in einer
      weiteren Pause: Der Startbildschirm erscheint, der Highscore hat sich
      nicht geändert.

## Meilenstein 14: How to play und Tutorial

**Status:** offen

**Ziel:** Neue Spieler lernen das Spiel über ein kurzes Tutorial und können die
Regeln nachschlagen.

**Anforderungen:** A77 bis A79, A83 (übrige Übergänge)

**Abschlusskriterium:** Die Tests zur vollständigen Ablauf-Tabelle und zu den
Tutorial-Schritten sind grün, und eine Person, die das Spiel nicht kennt, hat
das Tutorial gespielt.

**Übergangsverhalten:**
- „How to play“ erklärt beim Abschnitt Bonus-Segmente nur den Joker. Der
  Aufräumer kommt in Meilenstein 16 dazu.

**Abnahme-Checkliste:**
- [ ] Gespeicherte Daten löschen, App öffnen, „Play“: Die Frage „Play
      tutorial?“ erscheint. „Yes“: Das Tutorial beginnt.
- [ ] Die fünf Schritte durchspielen: In jedem Schritt zeigt die Hand, was zu
      tun ist, andere Tipps bewirken nichts, es läuft kein Timer.
- [ ] Schritt 4: Die Hand wischt aus der Mitte. Nach deinem Wisch geht es
      weiter.
- [ ] „Ready?“: Eine Partie beginnt.
- [ ] Zum Start zurück und „Play“: Die Frage erscheint nicht mehr.
- [ ] Daten löschen, „Play“, „No“: Die Partie beginnt sofort. Danach „Play“: Die
      Frage erscheint nicht mehr.
- [ ] „How to play“ öffnen und lesen: Jeder Abschnitt ist mit seinem Bild
      verständlich, auch die Blockade und das Aufgeben bei 0 Abwürfen.
- [ ] Dort „Play tutorial“, dann „Skip“: Der Startbildschirm erscheint.
- [ ] Einer Person, die das Spiel nicht kennt, das Handy geben: Sie versteht
      nach dem Tutorial, dass die Position feststeht und sie nur den Ring wählt,
      und sie weiß, wozu der Wisch dient.

## Meilenstein 15: Installation und Offline

**Status:** offen

**Ziel:** Freunde legen das Spiel als App auf den Startbildschirm und spielen
ohne Netz.

**Anforderungen:** A99 bis A102

**Abschlusskriterium:** Die Rauchtests zu Manifest, Start ohne Netz und
fremden Anfragen sind grün, und die Installation ist auf iPhone und
Android-Handy vom öffentlichen Link aus geprüft.

**Zweistufige Abnahme:** Stufe 1 prüfst du vor dem Merge mit `npm run build`
und `npm run preview`. Stufe 2 ist erst nach Merge und Push prüfbar, weil die
Installation HTTPS braucht.

**Übergangsverhalten:** keines.

**Abnahme-Checkliste, Stufe 1:**
- [ ] Die gebaute App am Rechner im Browser öffnen, einmal vollständig laden,
      dann das Netz in den Entwicklerwerkzeugen abschalten und neu laden: Das
      Spiel startet, mit Musik, Hintergrund und Schrift.

**Abnahme-Checkliste, Stufe 2 (nach Merge und Push):**
- [ ] Den öffentlichen Link auf dem iPhone in Safari öffnen und über das
      Teilen-Menü „Zum Home-Bildschirm“ wählen: Das Symbol erscheint mit Name
      und eigenem Bild.
- [ ] Die App vom Startbildschirm öffnen: Sie läuft ohne Browser-Leiste im
      Hochformat.
- [ ] Dasselbe auf dem Android-Handy in Chrome: Chrome bietet die Installation
      an, die App startet ohne Browser-Leiste.
- [ ] Flugmodus einschalten und die installierte App auf beiden Geräten öffnen:
      Eine ganze Partie mit Ton ist spielbar.
- [ ] Highscore erspielen, App schließen und öffnen: Der Highscore ist noch da.
- [ ] Nach einem späteren Push die App zweimal öffnen: Beim zweiten Öffnen läuft
      die neue Version, ohne Hinweis.
- [ ] Einer Person, die das Tutorial überspringt, das Handy geben: Notieren, ob
      sie den Wisch von selbst entdeckt (Annahme aus der SPEC.md).

## Meilenstein 16: Aufräumer

**Status:** offen

**Ziel:** Der Aufräumer ergänzt den Joker als zweiter Bonus am bestehenden
Bonus-System.

**Anforderungen:** A58 bis A62

**Abschlusskriterium:** Darstellung und Rückmeldung des Aufräumers (A62) und
seine Auslöser (A52, A61) sind vor Beginn mit dir geklärt und in der Spec
eingetragen. Die Tests zum Aufräumer
sind grün, die Simulation rechnet mit ihm, der `balance-reviewer` hat Punkt 16
der Prüfliste bewertet, und „How to play“ erklärt ihn.

**Übergangsverhalten:** keines.

**Abnahme-Checkliste:**
- [ ] Spielen, bis ein Aufräumer erscheint: Er ist sofort vom Joker und von
      normalen Segmenten zu unterscheiden.
- [ ] Aufräumer auf einen Ring mit gemischten Farben tippen: Der Ring leert
      sich, es gibt Abräumpunkte, die Combo steigt.
- [ ] Aufräumer auf einen Ring mit zwei gleichfarbigen Segmenten tippen: Der
      Ring blinkt wie bei Einfarbig, ein Abwurf kommt zurück.
- [ ] Aufräumer auf einen Ring mit einem einzelnen Segment tippen: Der Ring
      leert sich ohne Einfarbig-Bonus.
- [ ] Aufräumer auf einen leeren Ring tippen: Er ist weg, es gibt nur die
      Platzierungspunkte, der Fortschrittsbalken wächst, der Combo-Ring leert
      sich.
- [ ] Partie nach einem Aufräumer auf zwei gleichfarbigen Segmenten beenden:
      Game Over zählt ihn bei den einfarbigen Ringen mit.
- [ ] Aufräumer liegen lassen: Der Timer läuft ab, ein Leben erlischt.
- [ ] „How to play“ öffnen: Der Abschnitt Bonus-Segmente erklärt den Aufräumer.
- [ ] Fünf Partien spielen: Der Aufräumer fühlt sich wie eine Belohnung an,
      nicht wie die Regel.
