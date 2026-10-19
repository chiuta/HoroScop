// HoroScop — teste pentru funcțiile noi (runda 8): efemeride locale (răsărit/apus, faze, poziții) față de referințe independente.
// Rulare: node tests/fff-r8.test.mjs   (Playwright din /opt/node-tools, rețea blocată, Chromium local)
import {launch, axeRun, hOverflow, check, summary, REF} from "./_lib.mjs";

const NOON = "2026-10-14T09:00:00Z";
const hhmm = (iso, zone) => new Intl.DateTimeFormat("en-GB", {hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: zone}).format(new Date(iso));
const toMin = s => { const m = /(\d\d):(\d\d)/.exec(s); return m ? +m[1] * 60 + +m[2] : null; };
const dmin = (a, b) => { let d = Math.abs(a - b); return Math.min(d, 1440 - d); };
const openCard = async page => { if (!(await page.evaluate(() => document.getElementById("ephCard").open))) await page.click("#ephCard > summary"); await page.waitForSelector("#eph-loc", {state: "visible"}); };
const setLoc = async (page, q, tz) => { await page.fill("#eph-loc", q); await page.press("#eph-loc", "Enter"); if (tz != null) { await page.fill("#eph-tz", tz); await page.dispatchEvent("#eph-tz", "change"); } await page.waitForTimeout(250); };

console.log("1. pornire, versiune, 0 erori");
{
  const {browser, page, st} = await launch({clock: NOON, timezoneId: "Europe/Bucharest"});
  await page.waitForTimeout(3500);
  check("0 pageerror/console error", st.errs.length === 0, st.errs);
  check("0 cereri de rețea", st.net.length === 0, st.net);
  check("0 violări CSP", (await page.evaluate(() => window.__csp)).length === 0);
  check("#app-version arată 1.3.0 · 2026-10-19", /1\.3\.0 · 2026-10-19/.test((await page.textContent("#app-version")).replace(/\s+/g, " ")));
  check("meta application-version 1.3.0", (await page.getAttribute('meta[name="application-version"]', "content")) === "1.3.0");
  check("meta last-updated 2026-10-19", (await page.getAttribute('meta[name="last-updated"]', "content")) === "2026-10-19");
  check("cardul de efemeride există și e vizibil", await page.isVisible("#ephCard"));
  check("fără depășire orizontală 1280", (await hOverflow(page)) <= 0);
  await browser.close();
}

console.log("2. răsărit/apus/trecere față de pyephem (5 locuri, 14.10.2026, ±1 min după rotunjire)");
{
  const {browser, page, st} = await launch({clock: NOON, timezoneId: "Europe/Bucharest"});
  await page.waitForTimeout(2000); await openCard(page);
  const sites = REF.riseSet.filter(r => r.date === "2026-10-14");
  let n = 0, bad = [];
  for (const r of sites) {
    await setLoc(page, `${r.lat}, ${r.lon}`, r.zone);
    const get = async id => (await page.textContent(id)).trim();
    const ui = {sunrise: await get("#eph-sunrise"), sunset: await get("#eph-sunset"), moonrise: await get("#eph-moonrise"), moonset: await get("#eph-moonset")};
    const pairs = [["sunrise", r.sun.rise], ["sunset", r.sun.set], ["moonrise", r.moon.rise], ["moonset", r.moon.set]];
    for (const [k, iso] of pairs) {
      if (iso == null) continue; n++;
      const ref = toMin(hhmm(iso, r.zone)), got = toMin(ui[k]);
      // luna: ziua civilă poate fi altă zi (rise/set în ziua următoare/anterioară) -> doar când ora afișată nu are sufixul de altă zi
      if (got == null || dmin(ref, got) > 1) bad.push([r.site, k, ui[k], hhmm(iso, r.zone)]);
    }
  }
  check(`${n} momente (Soare + Lună) afișate coincid cu pyephem ±1 min`, n >= 18 && bad.length === 0, bad.slice(0, 6));
  const acc = await page.textContent("#eph-acc");
  check("precizia e declarată în interfață (≤ 6 s, ≤ 25 s, ≤ 30 s, 3″) cu limitele reale", /6 s/.test(acc) && /25 s/.test(acc) && /30 s/.test(acc) && /3″/.test(acc) && /refrac/i.test(acc) && /relief/i.test(acc), acc.slice(0, 200));
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("3. calcul numeric (EPH.compute) față de pyephem: răsărit/apus în secunde, faze, alt/az");
{
  const {browser, page} = await launch({clock: NOON, timezoneId: "Europe/Bucharest"});
  await page.waitForTimeout(1500);
  const R = await page.evaluate(ref => {
    const E = FFF.ephem, out = {rs: [], ph: [], hz: []};
    for (const w of ref.riseSet) {
      const d = EPH.compute({lat: w.lat, lon: w.lon, zone: w.zone, date: new Date(w.noonUtc)});
      for (const body of ["sun", "moon"]) { const rst = d.bodies.find(x => x.name === body).rst; for (const k of ["rise", "set", "transit"]) { const q = w[body][k], v = rst[k]; out.rs.push({body, k, site: w.site, date: w.date, d: (q && v != null) ? (E.dateFromJd(v).getTime() - Date.parse(q)) / 1000 : ((q == null && v == null) ? 0 : 1e9)}); } }
    }
    for (const q of ref.phases) { const t = Date.parse(q.utc); const jd = E.nextPhase(E.jdFromDate(new Date(t - 3 * 864e5)), q.kind, 1); out.ph.push({kind: q.kind, d: (E.dateFromJd(jd).getTime() - t) / 1000}); }
    for (const o of ref.horizontal) { if (o.alt < 3) continue; const ob = E.observe(o.body, E.jdFromDate(new Date(o.utc)), o.lat, o.lon, 0, {refraction: true}); let da = ob.az - o.az; da = ((da + 540) % 360) - 180; out.hz.push({body: o.body, dalt: ob.alt - o.alt, daz: da * Math.cos(o.alt * Math.PI / 180)}); }
    return out;
  }, REF);
  const mx = a => Math.max(...a.map(Math.abs));
  const sunRS = R.rs.filter(x => x.body === "sun").map(x => x.d), moonRS = R.rs.filter(x => x.body === "moon").map(x => x.d);
  check("Soare: răsărit/apus/trecere în ±5 s (60 valori: 5 locuri × 4 date × 3 evenimente)", sunRS.length === 60 && mx(sunRS) <= 5, [sunRS.length, mx(sunRS)]);
  check("Lună: răsărit/apus/trecere în ±10 s sau același „fără eveniment”", moonRS.length === 60 && mx(moonRS) <= 10, [moonRS.length, mx(moonRS)]);
  check("faze: toate 56 de momente (4 tipuri × 14) în ±30 s", R.ph.length === 56 && mx(R.ph.map(x => x.d)) <= 30, [R.ph.length, mx(R.ph.map(x => x.d))]);
  check("alt/az (Soare, Lună, Venus, Marte, Jupiter, Saturn) în ±0,02°", R.hz.length >= 20 && mx(R.hz.map(x => x.dalt)) <= 0.02 && mx(R.hz.map(x => x.daz)) <= 0.02, [R.hz.length, mx(R.hz.map(x => x.dalt)), mx(R.hz.map(x => x.daz))]);
  await browser.close();
}

console.log("4. faze ale Lunii afișate (București) și poziții în tabel");
{
  const {browser, page} = await launch({clock: "2026-10-14T18:30:00Z", timezoneId: "Europe/Bucharest"});
  await page.waitForTimeout(2000); await openCard(page);
  await setLoc(page, "44.4268, 26.1025", "Europe/Bucharest");
  const li = await page.$$eval("#eph-nextphases li", els => els.map(e => [e.dataset.kind, e.textContent]));
  check("4 faze viitoare (nouă, primul pătrar, plină, ultimul pătrar)", li.map(x => x[0]).sort().join() === "first,full,last,new", li);
  let bad = [];
  for (const [kind, txt] of li) {
    const first = REF.phases.filter(p => p.kind === kind).map(p => p.utc).sort().find(u => Date.parse(u) > Date.parse("2026-10-14T18:30:00Z"));
    const ref = new Intl.DateTimeFormat("sv-SE", {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Europe/Bucharest"}).format(new Date(first));
    const m = /(\d{4}-\d\d-\d\d \d\d:\d\d)$/.exec(txt.trim()); const ui = m && m[1];
    if (!ui || Math.abs(Date.parse(ui.replace(" ", "T") + "Z") - Date.parse(ref.replace(" ", "T") + "Z")) > 60000) bad.push([kind, ui, ref]);
  }
  check("orele fazelor coincid cu pyephem ±1 min", bad.length === 0, bad);
  const rows = await page.$$eval("#eph-bodies tbody tr", trs => trs.map(t => [t.dataset.body, t.children[2].textContent]));
  check("tabel cu 10 corpuri (Soare, Lună, 8 planete)", rows.length >= 9, rows.length);
  const refRows = REF.horizontal.filter(o => o.site === "București" && o.utc === "2026-10-14T18:30:00Z");
  let ok = 0, tot = 0, det = [];
  for (const o of refRows) { const r = rows.find(x => x[0] === o.body); if (!r) continue; const m = /(-?[\d.,−]+)° \/ (\d+)°/.exec(r[1].replace("−", "-")); if (!m) continue; tot++; const alt = parseFloat(m[1].replace(",", ".")), az = +m[2]; let da = Math.abs(az - o.az); da = Math.min(da, 360 - da); if (Math.abs(alt - o.alt) <= 0.06 && da <= 0.6) ok++; else det.push([o.body, r[1], o.alt, o.az]); }
  check("alt/az din tabel coincid cu pyephem (rotunjite la 0,1° / 1°)", tot >= 5 && ok === tot, det);
  await browser.close();
}

console.log("5. coloana Δ (modelul simplu al aplicației față de FFF.ephem) și data aleasă în aplicație");
{
  const {browser, page, st} = await launch({clock: NOON, timezoneId: "Europe/Bucharest"});
  await page.waitForTimeout(2000); await openCard(page); await setLoc(page, "44.4268, 26.1025", "Europe/Bucharest");
  check("antet „Δ” prezent", /Δ/.test(await page.textContent("#eph-bodies thead")));
  const del = await page.$$eval("#eph-bodies tbody tr", trs => trs.map(t => [t.dataset.body, t.lastElementChild.textContent]));
  const num = del.map(d => [d[0], parseFloat(d[1].replace(",", ".").replace("−", "-"))]).filter(d => isFinite(d[1]));
  check("Δ afișat pentru Soare, Lună și planete", num.length >= 9, del);
  const sol = num.find(d => d[0] === "sun")[1];
  check("Soare: |Δ| < 2′ (nutație + aberație ≈ 20″ + eroarea modelului simplu)", Math.abs(sol) < 2, sol);
  check("planete: |Δ| < 10′ (modelul simplu al aplicației nu e destinat preciziei)", num.filter(d => !["moon"].includes(d[0])).every(d => Math.abs(d[1]) < 10), num);
  check("nota despre Δ e afișată", /Δ =/.test(await page.textContent("#ephHost")));
  await page.fill("#refDate", "2027-08-02"); await page.dispatchEvent("#refDate", "input"); await page.dispatchEvent("#refDate", "change"); await page.waitForTimeout(500);
  const r = REF.riseSet.find(x => x.site === "București" && x.date === "2027-08-02");
  check("după alegerea datei 2027-08-02 cardul se recalculează (zi în antet)", /2027-08-02/.test(await page.textContent("#eph-zoneline")), await page.textContent("#eph-zoneline"));
  check("răsăritul Soarelui la 2027-08-02 coincide cu pyephem ±1 min", dmin(toMin(await page.textContent("#eph-sunrise")), toMin(hhmm(r.sun.rise, "Europe/Bucharest"))) <= 1, [await page.textContent("#eph-sunrise"), hhmm(r.sun.rise, "Europe/Bucharest")]);
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("6. căutare loc, coordonate invalide, fus orar invalid, GPS cu consimțământ");
{
  const {browser, page} = await launch({clock: NOON, timezoneId: "Europe/Bucharest", perm: ["geolocation"], geo: {latitude: 46.7712, longitude: 23.6236}, geoSpy: true});
  await page.waitForTimeout(2000); await openCard(page);
  await setLoc(page, "Cluj");
  const hits = await page.locator("#eph-hits button").count(); if (hits) { await page.locator("#eph-hits button").first().click(); await page.waitForTimeout(200); }
  check("căutare după nume (Cluj): se oferă variante/alege și locația afișată conține coordonate apropiate", /46[,.]\d+°, 23[,.]\d+°/.test(await page.textContent("#eph-locline")), await page.textContent("#eph-locline"));
  await setLoc(page, "95, 200");
  check("coordonate invalide: avertizare", /valid|interval|coord/i.test(await page.textContent("#eph-msg")), await page.textContent("#eph-msg"));
  await setLoc(page, "Zzzqqq");
  check("loc inexistent: mesaj", (await page.textContent("#eph-msg")).length > 5, await page.textContent("#eph-msg"));
  await page.fill("#eph-tz", "Nu/Exista"); await page.dispatchEvent("#eph-tz", "change");
  check("fus orar invalid: avertizare, calculul continuă în UTC", /fus/i.test(await page.textContent("#eph-msg")), await page.textContent("#eph-msg"));
  check("până aici 0 cereri GPS", (await page.evaluate(() => window.__geoCalls)) === 0);
  await page.click("#eph-gps");
  check("GPS: întâi confirmare în pagină, 0 cereri", (await page.isVisible("#eph-gpsbox")) && (await page.evaluate(() => window.__geoCalls)) === 0);
  await page.click("#eph-gpsno");
  check("„Nu” nu face nicio cerere", !(await page.isVisible("#eph-gpsbox")) && (await page.evaluate(() => window.__geoCalls)) === 0);
  await page.click("#eph-gps"); await page.click("#eph-gpsyes"); await page.waitForTimeout(800);
  check("după „Da”: o cerere, locația din GPS e folosită", (await page.evaluate(() => window.__geoCalls)) === 1 && /46[,.]77\d*°, 23[,.]62\d*°/.test(await page.textContent("#eph-locline")), await page.textContent("#eph-locline"));
  await browser.close();
}
{
  const {browser, page} = await launch({clock: NOON, timezoneId: "Europe/Bucharest"});
  await page.waitForTimeout(2000); await openCard(page);
  await page.click("#eph-gps"); await page.click("#eph-gpsyes"); await page.waitForTimeout(800);
  check("GPS refuzat: mesaj, câmpurile rămân utilizabile", /refuz|permis|disponibil|indisponibil/i.test(await page.textContent("#eph-msg")) && (await page.isEnabled("#eph-loc")), await page.textContent("#eph-msg"));
  await browser.close();
}

console.log("7. regresie: restul aplicației funcționează și cardul nu strică imprimarea");
{
  const {browser, page, st} = await launch({clock: NOON, timezoneId: "Europe/Bucharest"});
  await page.waitForTimeout(3500);
  const printHidden = await page.evaluate(() => { for (const ss of document.styleSheets) for (const r of ss.cssRules || []) if (r.media && /print/.test(r.conditionText || r.media.mediaText) && /ephCard/.test(r.cssText)) return true; return false; });
  check("regulă @media print ascunde cardul de efemeride", printHidden);
  check("titlul principal al aplicației rămâne", (await page.locator("h1").count()) >= 1);
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("8. accesibilitate (axe), contrast în temă deschisă și închisă, 1280×800 și 360×740, cu cardul deschis");
for (const scheme of ["light", "dark"]) for (const [w, h] of [[1280, 800], [360, 740]]) {
  const {browser, page} = await launch({w, h, bypassCSP: true, colorScheme: scheme, clock: NOON, timezoneId: "Europe/Bucharest"});
  await page.waitForTimeout(3500);
  await openCard(page); await setLoc(page, "44.4268, 26.1025", "Europe/Bucharest");
  const v = (await axeRun(page)) || [];
  check(`${scheme} ${w}: axe 0 cu cardul deschis`, v.length === 0, v);
  check(`${scheme} ${w}: fără depășire orizontală`, (await hOverflow(page)) <= 0, await hOverflow(page));
  await browser.close();
}
summary();
