# -*- coding: utf-8 -*-
"""Uruchamia prawdziwy walidator W3C na paczce do ćwiczeń.

HTML sprawdza Nu Html Checker (vnu.jar) — ten sam silnik, który stoi za
validator.w3.org. CSS sprawdza parser css-tree, porównując każdą deklarację
ze specyfikacją.

Po co: liczba błędów podana uczniowi w materiale musi się zgadzać z tym, co
zobaczy na ekranie. Ten skrypt jest jedynym źródłem tych liczb — nie liczę
ich z głowy.
"""
import json
import os
import pathlib
import subprocess
import sys

KAT = pathlib.Path(__file__).resolve().parent
JAR = pathlib.Path(os.environ.get(
    "VNU_JAR",
    pathlib.Path.home() / ".npm-global/lib/node_modules/vnu-jar/build/dist/vnu.jar"))
PACZKA = KAT / "paczka"


def html(pliki):
    wynik = subprocess.run(
        ["java", "-jar", str(JAR), "--format", "json"] + [str(p) for p in pliki],
        capture_output=True, text=True,
    )
    strumien = wynik.stdout + wynik.stderr
    poczatek = strumien.find('{"')
    if poczatek < 0:
        print("nie udało się odczytać odpowiedzi walidatora:\n", strumien[:600])
        sys.exit(1)
    dane = json.loads(strumien[poczatek:])
    print("Nu Html Checker", dane.get("version", "?"))
    razem = {"error": 0, "warning": 0}
    for p in pliki:
        wiad = [m for m in dane["messages"] if m["url"].endswith(p.name)]
        bledy = [m for m in wiad if m["type"] == "error"]
        ostrz = [m for m in wiad if m["type"] != "error"]
        razem["error"] += len(bledy)
        razem["warning"] += len(ostrz)
        print("\n=== %s — %d błędów, %d ostrzeżeń" % (p.name, len(bledy), len(ostrz)))
        for m in bledy:
            print("  BŁĄD      w.%-3s %s" % (m.get("lastLine"), m["message"]))
        for m in ostrz:
            print("  OSTRZEŻ.  w.%-3s %s" % (m.get("lastLine"), m["message"]))
    print("\nRAZEM HTML: %d błędów, %d ostrzeżeń" % (razem["error"], razem["warning"]))
    return razem


def css(plik):
    wynik = subprocess.run(["node", str(KAT / "sprawdz_css.js"), str(plik)],
                           capture_output=True, text=True, cwd=KAT)
    if wynik.returncode:
        print("css-tree:", wynik.stderr[:400])
        sys.exit(1)
    bledy = json.loads(wynik.stdout)
    print("\n=== %s — %d błędów CSS" % (plik.name, len(bledy)))
    for b in bledy:
        print("  BŁĄD  w.%-3s [%s] %s" % (b["wiersz"], b["rodzaj"], b["opis"]))
    return len(bledy)


if __name__ == "__main__":
    strony = sorted(PACZKA.glob("*.html"))
    html(strony)
    for arkusz in sorted((PACZKA / "css").glob("*.css")):
        css(arkusz)
