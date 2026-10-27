# Instrumente de măsurare a preciziei ascendentului

Nu fac parte din aplicație (rămâne un singur fișier HTML, offline). Se rulează manual:

1. `node tools/precizie-ascendent-esantioane.mjs $PWD/index.html 600 horoscop` (Playwright) -> `asc_horoscop.json`.
2. `python3 tools/asc_cmp.py horoscop` (necesită `pyerfa`, `skyfield`, `numpy`) -> statistici și `asc_horoscop_ref.json` (referința; copiată, rotunjită, în `tests/data/asc-ref.json`).

Referința: timp sideral aparent și oblicitate adevărată din ERFA (IAU 2006/2000A; ΔT din Skyfield) și definiția geometrică a ascendentului rezolvată numeric (nu formula închisă a aplicației). Nu folosește un program astrologic terț. `window._hsTest.ascendantLon` este un cârlig de test adăugat în 2.0.2 (nu schimbă calculul).
