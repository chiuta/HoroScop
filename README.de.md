# Horoscop · fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

**Version:** 1.2.0 · **Zuletzt aktualisiert:** 2026-10-19

Eine persönliche Ephemeride, lokal berechnet aus genäherten Planetenpositionen (keplersche Formeln mit verminderter Genauigkeit): der heutige Himmel, verglichen mit dem Himmel im Augenblick deiner Geburt.

**Live:** https://chiuta.github.io/HoroScop/

![Screenshot](screenshot.png)

## Was es ist

Horoscop ist eine App in einer einzigen HTML-Datei, die im Browser die Positionen von Sonne, Mond und den acht Planeten berechnet (keplersche Bahnelemente, Formeln mit verminderter Genauigkeit vom Typ Schlyter / Meeus), sie mit dem Geburtshoroskop eines Profils vergleicht und eine tägliche „Lesung“ zusammenstellt. Die App weist im Text darauf hin, dass die Astrologie symbolisch behandelt wird und dass sie weder Gesundheits- noch Sterblichkeitsrisiken abschätzt.

## Funktionen

- Mehrere Profile (optionaler Name, Datum, Uhrzeit und Zeitzone UTC±, Geburtsort mit Breiten-/Längengrad für den Aszendenten): „Hinzufügen“, „Bearbeiten“, „Duplizieren“, „Löschen“.
- Die Tageslesung nach Abschnitten: Panorama, Seele & Beziehungen, Arbeit & Geld, Körper & Energie, Rat des Tages; „Heutige Lesung kopieren“.
- „Der Himmel von heute“, „Die kommende Woche“ (der stärkste Aspekt pro Tag), Elemente von heute, Rückläufige, Mond ohne Aspekt (Void of Course), mögliche Finsternisse, Cazimi / Verbrennung.
- Das Geburtshoroskop, die Struktur des Horoskops, bedeutsame Geburtsaspekte, die Aspektrosette, ein 3D-Geburts-Orrery (Drehen durch Ziehen).
- Solare Revolutionen (von der Geburt bis heute und Projektion nach vorn), Saturn-/Jupiter-/Mondrückkehren.
- Vereinfachte Kompatibilität (Synastrie) zwischen zwei Profilen.
- „Sphärenmusik“: Jeder Geburtsplanet wird zu einem Ton („▶ Dein Horoskop spielen“ / „■ Stopp“).
- „Kosmisches Porträt“: ein lokal erzeugtes Video von etwa 6 Sekunden, herunterladbar als `portret-cosmic.webm`.
- Option für den siderischen Tierkreis (Lahiri, näherungsweise).
- „Himmel für das Datum berechnen“: Du wählst ein anderes Datum (1900–2100, 12:00 Uhr Ortszeit), und alle Abschnitte (der Himmel, die Aspekte, die Woche, die Lesung, das Kopieren) werden für diesen Tag berechnet; „Heute“ kehrt zurück. Das gewählte Datum wird nicht über Sitzungen hinweg gespeichert.
- Design: automatisch (nach Systemeinstellung), dunkel oder hell; die Wahl wird lokal gespeichert.
- Abschnitt „Wie das berechnet wird“ mit der geschätzten Genauigkeit und den Grenzen (die astrologischen Häuser werden nicht berechnet, nur der Aszendent).

## Neue Funktionen (1.1.0)

Die einklappbare Karte **„Lokale Ephemeriden (FFF.ephem)“** am Ende der Seite berechnet lokal (ohne Netzwerk) für einen Ort und für das in der App gewählte Datum („Himmel für das Datum berechnen“; standardmäßig heute):

- **Sonne:** Aufgang, Meridiandurchgang (mit der maximalen Höhe), Untergang, Tageslänge und bürgerliche, nautische, astronomische Dämmerung.
- **Mond:** Phase, Beleuchtung, Alter, Entfernung, Auf-/Untergang und die nächsten vier Phasen (Neumond, erstes Viertel, Vollmond, letztes Viertel).
- **Positionen** von Sonne, Mond und den acht Planeten (+ Pluto): ekliptikale Länge mit Zeichen, Höhe/Azimut (mit Refraktion), Auf-/Untergang, Helligkeit, Elongation.
- **Die Spalte „Δ“**: die Differenz in Bogenminuten zwischen der Länge aus dem einfachen Modell der App (keplersche Elemente, dasjenige, das die Lesungen speist) und der aus `FFF.ephem`. An 4 Testdaten betrugen die Differenzen: Sonne ≤ 0,5′, Planeten ≤ 8′ (am größten: Pluto, Uranus), Mond bis zu ≈ 20′. Die Zahlen zeigen, wie sehr das einfache Modell irren kann; die Lesungen und Aspekte wurden **nicht** verändert.
- Der Ort: Breite/Länge, Name aus der Städteliste der App, aktives Profil (Geburtsort) oder **GPS mit zweistufiger Einwilligung** (Bestätigung auf der Seite, dann eine einzige Anfrage; es wird nicht gespeichert). Die Zeitzone wird mit der des Browsers vorbelegt und ist editierbar (IANA-Name).
- Die angegebene Genauigkeit erscheint in der Karte (Abschnitt „Genauigkeit“) und weiter unten.

Die Karte ist nur auf Rumänisch, wie der Rest der App (die App hat kein i18n-System), und wird beim Drucken ausgeblendet.

## Anleitung

1. Drücke „Erstes Profil hinzufügen“ (oder „Hinzufügen“).
2. Trage das Geburtsdatum ein; optional Name, Uhrzeit, Zeitzone UTC± (Rumänien: +2 im Winter, +3 im Sommer) und Breiten-/Längengrad des Ortes. Ohne Uhrzeit kann der Aszendent nicht berechnet werden.
3. Drücke „Profil speichern“ (oder „Abbrechen“).
4. Lies die Abschnitte des Tages; „↻ Jetzt aktualisieren“ berechnet den Himmel neu.
5. Setze bei Bedarf den Haken bei der Option für den siderischen Tierkreis; unter „Himmel für das Datum berechnen“ kannst du den Himmel an einem anderen Tag sehen; unter „Design“ wählst du das Erscheinungsbild.
6. Für Musik drücke „▶ Dein Horoskop spielen“; für Video „🎬 Porträt erzeugen“, dann lade die Datei herunter.
7. „Profile exportieren“ speichert die Profile in einer Datei; „Profile importieren“ lädt sie wieder; „Alles löschen“ entfernt sie. Die Escape-Taste schließt das Profilformular (wenn es weitere Profile gibt).

## Datenschutz und Netzwerk

- Lokal: Die Profile werden in `localStorage` gespeichert (`horoscopFF_profiles_v1`, das aktive Profil `horoscopFF_active_v1`, die Siderisch-Option `horoscopFF_sidereal_v1`, das Design `horoscopFF_theme_v1`). Ist der Speicher nicht verfügbar (privater Modus), zeigt die App eine Warnung, und die Profile bleiben ohne Export nicht erhalten.
- Netzwerk: Im geprüften Code gibt es keine `fetch`-Aufrufe, Skripte oder externen Ressourcen; die Berechnungen erfolgen im Browser.
- Die Oberfläche ist auf Rumänisch (ohne i18n-System; das Kit bietet hu/de nur in seinen eigenen Dialogen an). Die maschinellen Übersetzungen fr/it/es/pt/hu/de des Kits sind nicht von Muttersprachlern geprüft.

- 1.1.0: Die **Geolokalisierung** (`navigator.geolocation`) wird nur verwendet, wenn du in der Ephemeridenkarte „Meinen Standort verwenden (GPS)“ drückst und auf der Seite bestätigst. Es gibt keine neuen Netzwerkanfragen, und es wird nichts Neues in `localStorage` gespeichert (die Karte hat keinen persistenten Zustand). Das Kit `fff-kit` (`core`, `label`, `bundle`, `ephem`) fügt die Transparenzschaltfläche und den Index `fff.horoscop.__keys` der bereits vorhandenen Schlüssel hinzu.
## Warnhinweis

Informativer, symbolischer und unterhaltender Inhalt; er ersetzt keine medizinische, rechtliche oder finanzielle Beratung. Die Astrologie hat keine wissenschaftliche Validierung: Die Planetenpositionen sind astronomische Berechnungen (mit verminderter Genauigkeit, Formeln vom Typ Schlyter / Meeus), die Deutungen (die „Lesungen“) sind jedoch kulturelle Tradition, keine validierten Vorhersagen. Derselbe Hinweis steht in der Fußzeile der App.

## Grenzen (die neuen Funktionen)

- **Lokale Ephemeriden — Genauigkeit.** Gegenüber dem physikalischen Referenzmodell (JPL DE421/DE423) weichen die scheinbaren Positionen von Sonne und Planeten um ≤ 3″ ab (Neptun ≤ 5″, Pluto ≤ 7″), die des Mondes um ≤ 1,5″; Auf-/Untergang der Sonne ≤ 6 s, des Mondes ≤ 25 s; die Phasen ≤ 30 s. Gegenüber pyephem 4.2.1 (Test in `tests/`): Auf-/Untergang ≤ 0,5 s, Phasen ≤ 6 s, Höhe/Azimut ≤ 0,003°. Die Uhrzeiten werden auf die Minute gerundet angezeigt. **In Wirklichkeit** weichen Auf-/Untergang um Minuten ab wegen der realen Refraktion, des Reliefs und der Höhe (nicht modelliert), und ΔT ist 2027 um etwa ±1 s unsicher. Die Helligkeiten sind Richtwerte. Nicht geeignet für Navigation oder astrometrische Beobachtungen.
- Der Rest der App (Lesungen, Aspekte, Geburtshoroskope) verwendet weiterhin das einfache Modell mit verminderter Genauigkeit; die neuen Ephemeriden ersetzen es nicht. Die astrologischen Häuser werden nicht mit `FFF.ephem` berechnet.

## Tests

`node tests/fff-r8.test.mjs` (Playwright aus `/opt/node-tools`, lokales Chromium, Netzwerk blockiert; `tests/_lib.mjs` enthält die gemeinsamen Hilfsfunktionen). Die Referenzwerte stehen in `tests/ref-c3a.json`: die Zeitpunkte von Auf-/Untergang/Durchgang (Sonne, Mond; 5 Orte × 4 Daten), 56 Phasenzeitpunkte und 54 Höhen-/Azimut-Positionen, unabhängig mit **pyephem 4.2.1** berechnet (nur offline zur Erzeugung der Zahlen verwendet; nicht Teil der App). Jeder Test hat seine Schwelle im Code festgeschrieben; der Barrierefreiheitstest (axe-core, `bypassCSP`) läuft auch in geöffneten Dialogen/Panels, bei 1280×800 und 360×740.

## Lokale Nutzung / offline

Lade `index.html` herunter und öffne sie in einem Browser; im geprüften Code braucht sie kein Internet.

## Lizenz

MIT — siehe Datei `LICENSE`. © 2026 Alexandru-Ionuț Chiuță (Alexio). Eventuelle in der Datei enthaltene Drittanbieter-Bibliotheken behalten ihre eigenen Lizenzen.

Lizenz: MIT (siehe Datei LICENSE). Kontakt: alexio@trom.tf

Dieselbe Erklärung steht im HTML-Kopf und in der Fußzeile der App. Der Lizenztext befindet sich in der Datei LICENSE.

## Verlauf / Changelog

### 19. Oktober 2026 (v1.2.0)
- Neu: „↗ Der Himmel deiner Geburt, in TerRa“ (nur mit Uhrzeit und Ort); Verlaufshinweis; Ort auf ~1 km gerundet; der Name wird nicht gesendet.

### 1.1.0 — 2026-10-14
- Neu: die Karte „Lokale Ephemeriden (FFF.ephem)“ (Auf-/Untergang/Durchgang, Dämmerungen, Mondphasen, Höhen-/Azimut-Positionen, Spalte Δ gegenüber dem einfachen Modell, GPS mit zweistufiger Einwilligung, angegebene Genauigkeit); das Kit `fff-kit` (`core`, `label`, `bundle`, `ephem`); `tests/fff-r8.test.mjs` (47 Prüfungen, einschließlich axe im hellen und dunklen Design, bei 1280×800 und 360×740). Vorher-/Nachher-Vergleich bei 1280×800: Die Startseite ist pixelgenau identisch (die Karte ist standardmäßig geschlossen), der Screenshot hat sich also nicht geändert.

- 1.0.0 — 2026-10-12: Version und Datum der letzten Aktualisierung werden in der App angezeigt (erste nummerierte Version; in der Fußzeile anstelle des alten Vermerks „aktualisiert am 11. Oktober 2026“).

Runde 7:
- **Dokumentierte numerische Überprüfung** (die Formeln wurden nicht verändert): die Sonne am 13.10.1992 0h TD → 199,902° gegenüber 199,906° (Meeus, *Astronomical Algorithms*, Bsp. 25.a, genaue Methode, Wert über pymeeus erneut bestätigt); der Mond am 12.04.1992 0h TD → 133,221° gegenüber 133,163° (Bsp. 47.a; Differenz 0,06°); GMST am 10.04.1987 0h UT stimmt mit Meeus-Beispiel 12.a überein (197,6932°); die Tagundnachtgleiche vom 20.03.2026, 14:46 UTC → solare Länge 0,004°. Der Aszendent wurde an 60 zufälligen Kombinationen (Jahre 1900–2099, Breiten ±70°, beliebige Länge) mit einer unabhängigen numerischen Methode verglichen — maximale Differenz unter 0,03°. Die Zusammenfassung steht im Abschnitt „Wie das berechnet wird“. Die Zeitpunkte werden als UTC behandelt (ohne ΔT ≈ 1 Minute).
- CSP-Hash neu berechnet; axe-core = 0 Verstöße bei 1280 und 360 px.

Runde 6:
- Neu: „Himmel für das Datum berechnen“ (1900–2100) und die Designauswahl (automatisch / dunkel / hell, mit heller Palette und Unterstützung für `prefers-color-scheme`). Die „Heute“-Texte passen sich an, wenn ein anderes Datum gewählt wird. CSP-Hash neu berechnet; Screenshot aktualisiert.
- Synastrie: Solange kein Profil gewählt ist, zeigt die Karte jetzt „Wähle ein Profil aus der Liste, um die Kompatibilität zu sehen.“, statt leer zu bleiben.
- Barrierefreiheit: Der Seiteninhalt liegt jetzt in einem `<main>` (zuvor gab es ihn nur, wenn das Diagramm sichtbar war); die beiden scrollbaren Listen der solaren Revolutionen haben unterschiedliche Beschriftungen; axe-core = 0 Verstöße, mit und ohne Profil, bei 1280 und 360 px.
- Die CSP-Richtlinie bindet das Skript jetzt per Hash (zuvor `'unsafe-inline'`).
- Die astronomischen Berechnungen sind dynamisch (aktuelles Datum); die Formeln wurden nicht verändert.

## Autor

Alexio — Alexandru-Ionuț Chiuță, Kontakt: alexio@trom.tf

## Zusammenfassung

Horoscop · fără frontiere ist eine rumänischsprachige persönliche Ephemeride in einer einzigen Datei: Sie berechnet Planetenpositionen im Browser, vergleicht den heutigen Himmel mit einem Geburtshoroskop und zeigt tägliche Lesungen, Aspekte, solare Revolutionen, Synastrie, ein 3D-Geburts-Orrery, Musik aus Planetentönen und ein herunterladbares WebM-Porträt. Die Profile liegen in localStorage mit JSON-Export/-Import. Im Code wurden keine Netzwerkanfragen gefunden. Lizenz: MIT (siehe Datei LICENSE) (Kontakt: alexio@trom.tf).

## Audit

Audit: 2026-10-10 (Runde 2, 2026-10-11: der Slogan „exakt verglichen“ / „reale Positionen“ zur Konsistenz mit dem Methodikabschnitt umformuliert — verminderte Genauigkeit, das Zeichen kann an den Spitzen um einen Tag abweichen) — geprüft: 0 JS-Fehler, keine Netzwerkanfragen (CSP `default-src 'none'; connect-src 'none'`), der Profilname erzeugt kein XSS (getestet mit Markup in Name und Ort). Behoben: der Kontrast in der Fußzeile, die scrollbare Liste der solaren Revolutionen (jetzt per Tastatur erreichbar) und der obige Warnhinweis ergänzt.

Runde 3 (2026-10-11): ausdrückliche Lizenzerklärung, die nicht deklariert war (Kopf, Fußzeile, README), und ein sichtbarer astrologischer Warnhinweis unter dem Titel, in RO und EN.
