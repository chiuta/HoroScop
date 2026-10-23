// HoroScop — regresie: profilele corupte din localStorage nu produc NaN/erori SVG; ținte tactile ≥44px pe mobil.
// Rulare: node tests/storage-sanitize.test.mjs
import {launch, check, summary} from "./_lib.mjs";

const base = {id: "p1", name: "T", birthDate: "1990-05-05", birthTime: "12:00", utcOffset: 2, cityName: "", lat: 44.4, lon: 26.1};
const cases = {
  "lat/lon/oră corupte": {lat: "abc", lon: 1e308, birthTime: "25:99"},
  "fus orar extrem": {utcOffset: 1e9},
  "nume cu HTML": {name: "<img src=x onerror=window.__x=1>", cityName: "<img src=x onerror=window.__x=1>"},
};
for (const [nume, o] of Object.entries(cases)) {
  console.log("profil din localStorage: " + nume);
  const {browser, page, st} = await launch({w: 390, h: 800});
  await page.evaluate(p => { localStorage.setItem("horoscopFF_profiles_v1", JSON.stringify([p])); localStorage.setItem("horoscopFF_active_v1", p.id); }, {...base, ...o});
  await page.reload(); await page.waitForTimeout(2500);
  const r = await page.evaluate(() => ({x: window.__x, imgs: document.querySelectorAll("img[src=x]").length, bad: /NaN|undefined|Infinity/.test(document.body.innerText)}));
  check("0 erori de consolă", st.errs.length === 0, st.errs);
  check("fără NaN/undefined/Infinity în text", !r.bad);
  check("fără HTML injectat", r.imgs === 0 && r.x === undefined);
  await browser.close();
}
console.log("ținte tactile la 390px");
{
  const {browser, page} = await launch({w: 390, h: 800});
  await page.waitForTimeout(2000);
  const small = await page.evaluate(() => [...document.querySelectorAll("button,select,input:not([type=checkbox]),summary,footer a,#app-version")]
    .filter(e => e.closest("details:not([open])") && e.tagName !== "SUMMARY" ? false : true)
    .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 43.5; })
    .map(e => e.tagName + "#" + e.id + " " + Math.round(e.getBoundingClientRect().height)));
  check("butoane/câmpuri ≥44px înălțime", small.length === 0, small);
  await browser.close();
}
summary();
