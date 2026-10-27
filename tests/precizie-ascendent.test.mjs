// Precizia ascendentului (formula proprie) față de o referință independentă (tests/data/asc-ref.json). Rulare: node tests/precizie-ascendent.test.mjs
import {launch, check, summary} from "./_lib.mjs";
import fs from "fs"; import path from "path"; import {fileURLToPath} from "url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const {samples} = JSON.parse(fs.readFileSync(path.join(HERE, "data", "asc-ref.json"), "utf8"));
check("600 de eșantioane de referință", samples.length === 600, samples.length);
const {browser, page, st} = await launch({clock: "2026-10-14T09:00:00Z", timezoneId: "Europe/Bucharest"});
await page.waitForTimeout(2000);
const app = await page.evaluate(smp => smp.map(o => window._hsTest.ascendantLon(o.jd - 2451545.0, o.lon, o.lat)), samples);
const d = (a, b) => Math.abs(((a - b + 540) % 360) - 180) * 60;   // minute de arc
const e = samples.map((r, i) => d(app[i], r.asc));
const band = (lo, hi) => e.filter((_, i) => Math.abs(samples[i].lat) > lo && Math.abs(samples[i].lat) <= hi);
const mx = a => Math.max(...a), mean = a => a.reduce((x, y) => x + y, 0) / a.length;
console.log(`  ascendent: medie ${mean(e).toFixed(3)}′, max ${mx(e).toFixed(3)}′; ≤45°: ${mx(band(-1, 45)).toFixed(3)}′; 45–60°: ${mx(band(45, 60)).toFixed(3)}′; 60–65°: ${mx(band(60, 65)).toFixed(3)}′`);
check("eroare medie ≤ 0,3′", mean(e) <= 0.3, mean(e));
check("eroare maximă ≤ 2,1′ (≈0,035°)", mx(e) <= 2.1, mx(e));
check("sub 45° latitudine: maxim ≤ 0,6′", mx(band(-1, 45)) <= 0.6, mx(band(-1, 45)));
check("0 erori de pagină", st.errs.length === 0, st.errs);
await browser.close(); summary();
