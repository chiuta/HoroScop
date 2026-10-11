# Horoscop · fără frontiere

O efemeridă personală, calculată local din poziții planetare aproximative (formule kepleriene de precizie redusă): cerul de azi, comparat cu cerul din clipa nașterii tale.

**Live:** https://chiuta.github.io/HoroScop/

![Captura de ecran](screenshot.png)

## Ce este

Horoscop este o aplicație dintr-un singur fișier HTML care calculează în browser pozițiile Soarelui, Lunii și ale celor opt planete (elemente orbitale kepleriene, formule cu precizie redusă de tip Schlyter / Meeus), le compară cu tema natală a unui profil și compune o „citire" zilnică. Aplicația precizează în text că astrologia este tratată simbolic și că nu estimează riscuri de sănătate sau de mortalitate.

## Funcții

- Profiluri multiple (nume opțional, data, ora și fusul orar UTC±, locul nașterii cu latitudine/longitudine pentru ascendent): „Adaugă", „Editează", „Duplică", „Șterge".
- Citirea zilei pe secțiuni: Panorama, Suflet & relații, Muncă & bani, Trup & energie, Sfatul zilei; „Copiază citirea de azi".
- „Cerul de azi", „Săptămâna care vine" (cel mai puternic aspect pe zi), elemente de azi, retrograde, Luna goală de curs, eclipse posibile, cazimi / combust.
- Tema natală, structura temei, aspecte natale semnificative, rozeta aspectelor, orrery natal 3D (rotire prin tragere).
- Revoluții solare (de la naștere până azi și proiecție înainte), întoarceri Saturn / Jupiter / Lună.
- Compatibilitate (sinastrie) simplificată între două profile.
- „Muzica sferelor": fiecare planetă natală devine un ton („▶ Cântă tema ta" / „■ Oprește").
- „Portret cosmic": videoclip de aproximativ 6 secunde generat local, descărcabil ca `portret-cosmic.webm`.
- Opțiune pentru zodiacul sideral (Lahiri, aproximativ).
- „Calculează cerul pentru data”: alegi o altă dată (1900–2100, ora 12:00 locală) și toate secțiunile (cerul, aspectele, săptămâna, citirea, copierea) se calculează pentru acea zi; „Azi” revine. Data aleasă nu se păstrează între sesiuni.
- Temă: automată (după preferința sistemului), întunecată sau luminoasă; alegerea se păstrează local.
- Secțiune „Cum se calculează asta" cu precizia estimată și limitele (nu sunt calculate casele astrologice, doar ascendentul).

## Manual de utilizare

1. Apasă „Adaugă primul profil" (sau „Adaugă").
2. Completează data nașterii; opțional numele, ora, fusul orar UTC± (România: +2 iarna, +3 vara) și latitudinea/longitudinea locului. Fără oră, ascendentul nu poate fi calculat.
3. Apasă „Salvează profilul" (sau „Renunță").
4. Citește secțiunile zilei; „↻ Actualizează acum" recalculează cerul.
5. Bifează opțiunea pentru zodiac sideral dacă dorești; din „Calculează cerul pentru data” poți vedea cerul într-o altă zi; din „Temă” alegi aspectul.
6. Pentru muzică apasă „▶ Cântă tema ta"; pentru video „🎬 Generează portretul", apoi descarcă fișierul.
7. „Exportă profiluri" salvează profilurile într-un fișier; „Importă profiluri" le reîncarcă; „Șterge tot" le elimină. Tasta Escape închide formularul de profil (dacă există alte profiluri).

## Confidențialitate și rețea

- Local: profilurile se păstrează în `localStorage` (`horoscopFF_profiles_v1`, profilul activ `horoscopFF_active_v1`, opțiunea sideral `horoscopFF_sidereal_v1`, tema `horoscopFF_theme_v1`). Dacă stocarea nu este disponibilă (mod privat), aplicația afișează un avertisment și profilurile nu se păstrează fără export.
- Rețea: în codul verificat nu există apeluri `fetch`, scripturi sau resurse externe; calculele se fac în browser.
- Interfața este în limba română.

## Avertisment

Conținut informativ, simbolic și de divertisment; nu înlocuiește sfatul medical, juridic sau financiar. Astrologia nu are validare științifică: pozițiile planetelor sunt calcule astronomice (cu precizie redusă, formule de tip Schlyter / Meeus), dar interpretările („citirile”) sunt tradiție culturală, nu predicții validate. Aceeași notă apare în subsolul aplicației.

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser; nu are nevoie de internet în codul verificat.

## Licență

Licență: nedeclarată de autor; toate drepturile rezervate până la o declarație contrară. Contact: alexio@trom.tf

License: not declared by the author; all rights reserved until stated otherwise. Contact: alexio@trom.tf

Aceeași declarație apare în antetul HTML și în subsolul aplicației. Nu există fișier LICENSE: alegerea unei licențe aparține autorului.

## Istoric / Changelog

Ultima actualizare: 11 octombrie 2026 (runda 7; aplicația nu are număr de versiune; subsolul afișează „actualizat 11 octombrie 2026”).

Runda 7:
- **Verificare numerică documentată** (formulele nu au fost modificate): Soarele la 13.10.1992 0h TD → 199,902° față de 199,906° (Meeus, *Astronomical Algorithms*, ex. 25.a, metoda precisă, valoare reconfirmată prin pymeeus); Luna la 12.04.1992 0h TD → 133,221° față de 133,163° (ex. 47.a; diferență 0,06°); GMST la 10.04.1987 0h UT coincide cu exemplul Meeus 12.a (197,6932°); echinocțiul din 20.03.2026, 14:46 UTC → longitudine solară 0,004°. Ascendentul a fost comparat pe 60 de combinații aleatorii (ani 1900–2099, latitudini ±70°, orice longitudine) cu o metodă numerică independentă — diferență maximă sub 0,03°. Rezumatul apare în secțiunea „Cum se calculează asta”. Momentele sunt tratate ca UTC (fără ΔT ≈ 1 minut).
- Hash-ul CSP recalculat; axe-core = 0 violări la 1280 și 360 px.

Runda 6:
- Nou: „Calculează cerul pentru data” (1900–2100) și alegerea temei (automată / întunecată / luminoasă, cu paletă luminoasă și suport pentru `prefers-color-scheme`). Textele „azi” se adaptează când e aleasă altă dată. Hash-ul CSP recalculat; captura de ecran reîmprospătată.
- Sinastria: cât timp nu e ales niciun profil, cardul afișează acum „Alege un profil din listă pentru a vedea compatibilitatea.”, în loc să rămână gol.
- Accesibilitate: conținutul paginii este acum într-un `<main>` (înainte exista doar când graficul era vizibil); cele două liste derulabile de revoluții solare au etichete distincte; axe-core = 0 violări, cu și fără profil, la 1280 și 360 px.
- Politica CSP leagă acum scriptul prin hash (înainte `'unsafe-inline'`).
- Calculele astronomice sunt dinamice (data curentă); formulele nu au fost modificate.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## English summary

Horoscop · fără frontiere is a single-file Romanian-language personal ephemeris: it computes planetary positions in the browser, compares today's sky with a natal chart, and shows daily readings, aspects, solar returns, synastry, a 3D natal orrery, planet-tone music and a downloadable WebM portrait. Profiles live in localStorage with JSON export/import. No network requests were found in the code. License: not declared by the author; all rights reserved until stated otherwise (contact: alexio@trom.tf).

## Audit

Audit: 2026-10-10 (rundă 2, 2026-10-11: sloganul „comparat exact” / „poziții reale” reformulat pentru consecvență cu secțiunea de metodologie — precizie redusă, semnul poate diferi cu o zi la cuspide) — verificat: 0 erori JS, fără cereri de rețea (CSP `default-src 'none'; connect-src 'none'`), numele de profil nu produce XSS (testat cu markup în nume și loc). Corectat contrastul din subsol, lista derulabilă a revoluțiilor solare (acum accesibilă cu tastatura) și adăugat avertismentul de mai sus.

Runda 3 (2026-10-11): declarație explicită de licență nedeclarată (antet, subsol, README) și notă de avertisment astrologic vizibilă sub titlu, în RO și EN.
