# Jurnal de modificări — HoroScop

## 2.0.2 — 2026-10-27 (anterior: 2.0.1)

Text în aplicație + documentație + test (formulele de calcul nu s-au schimbat).

- **Nota „Precizie” din aplicație** (`m2`, 8 limbi) înlocuită cu cifrele **măsurate** față de JPL DE421 (499 de date, 1900–2050): estimările vechi (Lună ±0,3°, planete ±0,03°…±0,15°) erau ușor depășite de eșantionul larg (Luna până la ≈22′ ≈ 0,37°; Venus/Marte/Saturn ≈3′; Uranus/Pluto ≈9–10′).
- **Ascendent măsurat**: 600 de combinații de dată și loc (lat. ±65°) față de o referință independentă (timp sideral aparent + oblicitate adevărată ERFA, definiția geometrică rezolvată numeric): medie 0,20′, p95 0,40′, maxim 1,92′ (≈0,03°; 0,49′ sub 45°). Adăugat la `m3` (verificarea independentă veche, pe 60 de cazuri, rămâne) și în README (8 limbi). Aplicația nu calculează case, deci „casele nemăsurate” s-a înlocuit cu precizarea că nu există.
- Test nou `tests/precizie-ascendent.test.mjs` + referința `tests/data/asc-ref.json`; generatorul în `tools/` (nu face parte din aplicație). Cârlig de test nou, fără efect asupra calculului: `window._hsTest.ascendantLon`.

Nu implementat:

- Comparație cu NASA JPL Horizons sau cu un program astrologic terț: fără acces; referința e DE421 / definiția standard a unghiurilor.
- Latitudini peste 65°: nemăsurate.
- Case astrologice: nu sunt calculate de aplicație; nimic de măsurat.
- Diferența Lunii în 2025–2050 (≈10″ cu `FFF.ephem`) atribuită extrapolării ΔT: încă neverificată separat.
- Traducerile notei în fr/it/es/pt/de/hu: traducere automată, neverificate de vorbitori nativi.

## 2.0.1 — 2026-10-27 (anterior: 2.0.0)

Documentație: precizie măsurată (fără schimbări de calcul).

- README (8 limbi): punct nou „Precizie măsurată” cu erori medii/maxime ale modelului simplu și ale `FFF.ephem` față de JPL DE421 pe 499 de date 1900–2050; cifrele vechi „la 4 date de test” marcate ca orientative prin completarea de mai sus.
- „Stare” și „Offline”.

Nu implementat:

- Casele astrologice: nemăsurate („de verificat”).
- Comparație cu NASA JPL Horizons: inaccesibil din mediul meu; s-a folosit DE421.
- Diferența Lunii în 2025–2050 (până la ≈10″) atribuită provizoriu extrapolării ΔT: neverificată separat.
- Nicio schimbare în formulele de calcul sau în textele din aplicație.

Istoricul anterior (1.x–2.0.0) este în secțiunea „History” din README.md.
