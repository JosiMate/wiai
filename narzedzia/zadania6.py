#!/usr/bin/env python3
"""Buduje sekcję „Zadania na ocenę celującą” na stronie spisu tematów.

Czyta sekcje „## Na ocenę celującą” ze stron tematów, grupuje je po działach
i wstawia (albo odświeża) blok pod spisem tematów. Idempotentny — powtórne
uruchomienie nadpisuje blok aktualną treścią.

Użycie:  python3 zadania6.py <plik-index.md> [...]
"""
import re, os, sys

START = "<!-- zadania6:start -->"
KONIEC = "<!-- zadania6:end -->"

# „**A. Tytuł.**” albo „1. **Tytuł.**”
LITERA = re.compile(r"^\*\*([A-Z])\.\s+(.+?)\*\*", re.M)
CYFRA = re.compile(r"^\d+\.\s+\*\*(.+?)\*\*", re.M)

WSTEP = """## Zadania na ocenę celującą

Każdy dział ma w Dzienniku VULCAN własne zadanie **„Zadanie na ocenę celującą:
Dział …”**. Wybierasz **jedno** zadanie z listy poniżej i odsyłasz je tam
w ciągu **dwóch tygodni od zakończenia działu**. Zadanie da się wykonać po
przerobieniu tematu, przy którym stoi — dlatego cała lista jest widoczna
od początku działu, a nie dopiero na jego końcu.

Pełne zasady (co zostaje w karcie pracy, jak nazwać plik, co jest oceniane)
opisuje strona [wymagań edukacyjnych]({wym}).
"""


def zadania_z_tematu(sciezka):
    """Zwraca listę (oznaczenie, tytuł) z sekcji „Na ocenę celującą”."""
    if not os.path.exists(sciezka):
        return []
    s = open(sciezka, encoding="utf8").read()
    m = re.search(r"^## Na ocenę celującą\s*$", s, re.M)
    if not m:
        return []
    reszta = s[m.end():]
    # sekcja kończy się na kolejnym nagłówku ## albo poziomej linii
    kon = re.search(r"^(## |---\s*$)", reszta, re.M)
    if kon:
        reszta = reszta[:kon.start()]
    # admonicja z zasadami oddawania jest wcięta, więc wzorce ^\*\* jej nie łapią
    wynik = [(lit, tyt.rstrip(".")) for lit, tyt in LITERA.findall(reszta)]
    if not wynik:
        wynik = [(str(i), tyt.rstrip("."))
                 for i, tyt in enumerate(CYFRA.findall(reszta), start=1)]
    return wynik


def dzialy_ze_spisu(sciezka):
    """[(tytuł działu, [(tytuł tematu, odsyłacz)])] — z tabel w spisie tematów."""
    s = open(sciezka, encoding="utf8").read()
    kawalki = re.split(r"^### (.+?)\s*$", s, flags=re.M)[1:]
    out = []
    for i in range(0, len(kawalki), 2):
        naglowek, tresc = kawalki[i], kawalki[i + 1]
        tematy = [(t, l) for t, l in
                  re.findall(r"\|\s*\*\*\[(.+?)\]\((.+?)\)\*\*\s*\|", tresc)
                  if "wymagania-i-bhp" not in l]
        out.append((naglowek, tematy))
    return out


def blok(sciezka_index):
    baza = os.path.dirname(sciezka_index)
    czesci = []
    for naglowek, tematy in dzialy_ze_spisu(sciezka_index):
        wiersze = []
        for tytul, link in tematy:
            for ozn, zad in zadania_z_tematu(os.path.join(baza, link)):
                wiersze.append(f"    | **{ozn}.** {zad} | [{tytul}]({link}) |")
        if not wiersze:
            continue
        czesci.append(
            f'??? example "{naglowek}"\n\n'
            "    | Zadanie | Z tematu |\n"
            "    | --- | --- |\n"
            + "\n".join(wiersze) + "\n")
    if not czesci:
        return None
    zrodlo = open(sciezka_index, encoding="utf8").read()
    m = re.search(r"\]\((\S*wymagania-i-bhp\.md)\)", zrodlo)
    wym = m.group(1) if m else "wymagania-i-bhp.md"
    return START + "\n\n" + WSTEP.format(wym=wym) + "\n" + "\n".join(czesci) + "\n" + KONIEC


def patch(sciezka):
    b = blok(sciezka)
    if b is None:
        return "brak zadań"
    s = open(sciezka, encoding="utf8").read()
    if START in s:
        s = re.sub(re.escape(START) + r".*?" + re.escape(KONIEC), lambda _: b, s, flags=re.S)
    else:
        # zaraz po zamknięciu kontenera ze spisem tematów
        m = None
        for m in re.finditer(r"^</div>\s*$", s, re.M):
            pass
        if m is None:
            return "! brak </div>"
        s = s[:m.end()] + "\n\n" + b + "\n" + s[m.end():].lstrip("\n")
    open(sciezka, "w", encoding="utf8").write(s)
    return "zmieniono"


if __name__ == "__main__":
    for f in sys.argv[1:]:
        print(patch(f), f)
