/* Kontrola arkusza stylów parserem css-tree, zgodnym ze specyfikacją CSS.
 *
 * Nie jest to walidator W3C — ten stoi tylko na jigsaw.w3.org i nie da się go
 * uruchomić lokalnie. Służy do potwierdzenia, że błędy wstawione do pliku
 * ćwiczeniowego są prawdziwymi błędami, a nie moim wyobrażeniem o nich.
 *
 * css-tree nie umie sprawdzać deklaracji z var() ani własnych właściwości
 * (--zmienna) — te komunikaty to szum narzędzia, nie błędy w arkuszu,
 * więc je odsiewamy.
 */
const csstree = require("css-tree");
const fs = require("fs");

const plik = process.argv[2];
const zrodlo = fs.readFileSync(plik, "utf8");
const bledy = [];

const ast = csstree.parse(zrodlo, {
  positions: true,
  parseValue: true,
  onParseError(e) {
    bledy.push({ rodzaj: "składnia", wiersz: e.line, opis: e.rawMessage || e.message });
  },
});

const SZUM = /custom properties|var\(\) is not supported/;

csstree.walk(ast, {
  visit: "Declaration",
  enter(node) {
    const r = csstree.lexer.matchDeclaration(node);
    if (!r.error) return;
    const m = r.error.message || "";
    if (SZUM.test(m)) return;
    bledy.push({
      rodzaj: "deklaracja",
      wiersz: node.loc ? node.loc.start.line : null,
      opis: node.property + ": " + m.split("\n")[0],
    });
  },
});

// Niezamknięty nawias klamrowy css-tree domyka po cichu na końcu pliku,
// a walidator W3C go zgłasza — dlatego liczymy klamry osobno.
const bezKomentarzy = zrodlo.replace(/\/\*[\s\S]*?\*\//g, "");
const otw = (bezKomentarzy.match(/{/g) || []).length;
const zam = (bezKomentarzy.match(/}/g) || []).length;
if (otw !== zam) {
  bledy.push({
    rodzaj: "struktura",
    wiersz: zrodlo.split("\n").length,
    opis: "niezrównoważone nawiasy klamrowe: " + otw + " otwierających, " + zam + " zamykających",
  });
}

console.log(JSON.stringify(bledy, null, 1));
