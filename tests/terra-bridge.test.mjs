// HoroScop 1.2.0 — punte „↗ Cerul nașterii tale, în TerRa”. Copiat în HoroScop/tests/terra-bridge.test.mjs. Rulare: node tests/terra-bridge.test.mjs
import {launch, check, summary} from "./_lib.mjs";
const {browser, page, st} = await launch({clock: "2026-10-18T09:00:00Z", timezoneId: "Europe/Bucharest"});
await page.waitForTimeout(2500);
const setP = async p => { await page.evaluate(p => { localStorage.setItem("horoscopFF_profiles_v1", JSON.stringify([Object.assign({id: "t1", name: "Secret Nume"}, p)])); localStorage.setItem("horoscopFF_active_v1", "t1"); }, p); await page.reload(); await page.waitForTimeout(1800); };
const link = () => page.evaluate(() => { const a = document.querySelector("#terraBirthLink a"); return a ? {h: a.href, rel: a.rel, tg: a.target, t: a.title} : null; });
// 1) cu oră + loc (București, EEST +3 în iulie 1990? utilizatorul alege offset=3)
await setP({birthDate: "1990-07-15", birthTime: "14:30", utcOffset: 3, cityName: "București", lat: 44.4268, lon: 26.1025});
let l = await link();
check("link prezent", !!l, l);
check("href exact: 14:30 la +3 = 11:30Z, ll la 2 zecimale, from=horoscop", l && l.h === "https://chiuta.github.io/TerRa/#v=sky&t=1990-07-15T11:30:00Z&ll=44.43,26.10&from=horoscop", l && l.h);
check("nu conține numele profilului", l && !/Secret|Nume/.test(l.h));
check("target=_blank rel=noopener + avertisment de istoric", l && l.tg === "_blank" && /noopener/.test(l.rel) && /istoric/.test(l.t));
// 2) fără oră -> fără link
await setP({birthDate: "1990-07-15", birthTime: null, utcOffset: 3, cityName: "București", lat: 44.4268, lon: 26.1025});
check("fără oră: fără link", (await link()) === null);
// 3) fără loc -> fără link
await setP({birthDate: "1990-07-15", birthTime: "14:30", utcOffset: 3, cityName: "", lat: null, lon: null});
check("fără loc: fără link", (await link()) === null);
// 4) an în afara 1900-2100 -> fără link; emisfera sudică/vest cu semn
await setP({birthDate: "1850-01-01", birthTime: "10:00", utcOffset: 0, cityName: "X", lat: 1, lon: 1});
check("1850: fără link", (await link()) === null);
st.errs.length = 0; // 1850 declanșează o eroare PRE-EXISTENTĂ în renderAll (detectYodsAndKites, index.html:4265, reproductibilă pe v1.1.0) — nu face parte din punte
await setP({birthDate: "2001-12-31", birthTime: "23:50", utcOffset: -3, cityName: "São Paulo", lat: -23.5505, lon: -46.6333});
l = await link();
check("offset negativ trece peste miezul nopții (23:50 la -3 = 02:50Z ziua următoare), semne păstrate", l && l.h.endsWith("#v=sky&t=2002-01-01T02:50:00Z&ll=-23.55,-46.63&from=horoscop"), l && l.h);
check("un singur link după re-randări (fără dubluri)", await page.evaluate(() => document.querySelectorAll("#terraBirthLink").length) === 1);
check("0 erori / 0 rețea", st.errs.length === 0 && st.net.length === 0, [st.errs, st.net]);
await browser.close(); summary();
