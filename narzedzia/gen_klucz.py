# -*- coding: utf-8 -*-
"""Generuje klucz dla nauczyciela do paczki „Szprycha — wersja do naprawy".

Klucz powstaje z prawdziwego przebiegu walidatora, nie z pamięci — dzięki temu
przy każdej zmianie w paczce wystarczy uruchomić skrypt jeszcze raz i klucz
się zgadza.

Plik wynikowy trafia do narzedzia/, a NIE do docs/ — inaczej wylądowałby na
GitHub Pages razem z resztą serwisu i uczniowie mieliby go w dwóch kliknięciach.

Czego potrzeba, żeby to uruchomić (raz):

    npm install -g vnu-jar      # silnik walidatora W3C, wymaga Javy
    npm install css-tree        # parser CSS, w katalogu narzedzia/

Uruchomienie:

    python narzedzia/gen_klucz.py

Ścieżkę do vnu.jar można wskazać zmienną środowiskową VNU_JAR; bez niej skrypt
szuka jej w domyślnym miejscu instalacji npm. Paczka ćwiczeniowa musi być
rozpakowana w narzedzia/paczka/ — tam skrypt jej szuka.
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
CEL = KAT / "KLUCZ-walidacja-4ti.md"

# Co który błąd ma uczyć — przypisane ręcznie do komunikatu walidatora.
CZEGO_UCZY = {
    "Text not allowed in element “ul” in this context.":
        "w liście mogą stać wyłącznie elementy li — tekst „Menu:” trzeba przenieść "
        "do nagłówka albo do atrybutu aria-label",
    "End tag “b” violates nesting rules.":
        "znaczniki muszą się zamykać w odwrotnej kolejności niż otwierały; "
        "<b><i></b></i> to klasyka",
    "No “i” element in scope but a “i” end tag seen.":
        "drugi komunikat tego samego błędu — jedna poprawka gasi oba; dobry moment, "
        "żeby pokazać, że liczba komunikatów to nie liczba usterek",
    "An “img” element must have an “alt” attribute, except under certain conditions. "
    "For details, consult guidance on providing text alternatives for images.":
        "brak opisu alternatywnego; to jednocześnie błąd walidacji i bariera "
        "dostępności — wraca w części o WAVE",
    "The “center” element is obsolete. Use CSS instead.":
        "element wycofany z HTML5; wygląd należy do CSS, nie do znaczników",
    "Duplicate ID “kontakt”.":
        "identyfikator musi być unikalny w całym dokumencie — inaczej odnośnik "
        "kotwicowy i skrypty trafiają zawsze w pierwszy",
    "End tag for  “body” seen, but there were unclosed elements.":
        "niezamknięty element footer; przeglądarka domyka po cichu, walidator nie",
    "Unclosed element “footer”.":
        "drugi komunikat tej samej usterki co wyżej",
    "The heading “h3” (with computed level 3) follows the heading “h1” "
    "(with computed level 1), skipping 1 heading level.":
        "przeskok poziomów nagłówków — h1 potem h3; struktura dokumentu ma być ciągła",
    "Duplicate attribute “href”.":
        "ten sam atrybut podany dwa razy; przeglądarka bierze pierwszy, "
        "co bywa źródłem „odnośnik prowadzi nie tam, gdzie napisałem”",
    "The “font” element is obsolete. Use CSS instead.":
        "element wycofany, jak center",
    "Start tag “a” seen but an element of the same type was already open.":
        "odnośnik w odnośniku — niedozwolone zagnieżdżenie",
    "Stray end tag “a”.":
        "skutek tego samego zagnieżdżenia",
    "Element “img” is missing one or more of the following attributes: “src”, “srcset”.":
        "obrazek bez źródła; uczeń zwykle widzi najpierw pustą ramkę, a dopiero "
        "walidator mówi dlaczego",
    "Stray end tag “span”.":
        "znacznik zamykający bez otwierającego",
}

OSTRZEZENIA_KOMENTARZ = {
    "The “border” attribute on the “table” element is obsolete. Consider specifying "
    "“img { border: 0; }” in CSS instead.":
        "OSTRZEŻENIE, nie błąd — strona przejdzie walidację z tym atrybutem. "
        "Usunąć i tak, bo wygląd należy do CSS. Dobry przykład ostrzeżenia, "
        "które warto potraktować poważnie.",
    "Section lacks heading. Consider using “h2”-“h6” elements to add identifying "
    "headings to all sections, or else use a “div” element instead for any cases "
    "where no heading is needed.":
        "OSTRZEŻENIE. Dwa wystąpienia. Poprawne rozwiązanie to albo dodać nagłówek, "
        "albo zamienić section na div — obie odpowiedzi uznajemy, jeśli uczeń "
        "uzasadni wybór.",
    "The first occurrence of ID “kontakt” was here.":
        "OSTRZEŻENIE towarzyszące błędowi o powtórzonym identyfikatorze — samo "
        "z siebie nie jest usterką, tylko wskazaniem drugiego miejsca.",
    "Consider adding a “lang” attribute to the “html” start tag to declare the "
    "language of this document.":
        "OSTRZEŻENIE, ale traktujemy je jak błąd: bez lang=\"pl\" czytnik ekranu "
        "przeczyta polski tekst po angielsku. Na egzaminie zawodowym to punkt.",
}

CSS_CZEGO_UCZY = {
    "colour": "colour zamiast color — literówka w nazwie właściwości; deklaracja "
              "jest po cichu pomijana, a tekst zostaje w kolorze domyślnym",
    "padding": "padding: 16 24px — pierwsza wartość bez jednostki; cała deklaracja "
               "odpada, przez co pasek nagłówka traci wewnętrzne marginesy",
    "font-size": "brak średnika po font-size: 24px — następna deklaracja "
                 "(font-weight) zostaje wciągnięta do wartości i przepadają obie; "
                 "logo jest małe i nie jest pogrubione",
    "color": "color: #fffff — pięć znaków zamiast trzech albo sześciu; odnośniki "
             "w nawigacji zostają domyślnie niebieskie zamiast białych",
    "text-align": "text-align: centre — pisownia brytyjska; CSS zna tylko center, "
                  "przez co tabela cennika jest wyrównana do lewej",
}


def wiadomosci():
    strony = sorted(PACZKA.glob("*.html"))
    w = subprocess.run(["java", "-jar", str(JAR), "--format", "json"]
                       + [str(p) for p in strony], capture_output=True, text=True)
    s = w.stdout + w.stderr
    dane = json.loads(s[s.find('{"'):])
    return strony, dane


def css_bledy():
    w = subprocess.run(["node", str(KAT / "sprawdz_css.js"),
                        str(PACZKA / "css" / "style.css")],
                       capture_output=True, text=True, cwd=KAT)
    if w.returncode:
        print(w.stderr[:400])
        sys.exit(1)
    return json.loads(w.stdout)


def main():
    strony, dane = wiadomosci()
    L = []
    L.append("# Klucz — „Szprycha, wersja do naprawy”")
    L.append("")
    L.append("**Witryny i aplikacje internetowe · klasa 4TI · temat „Walidacja "
             "poprawności kodu HTML i CSS (W3C) oraz testowanie w przeglądarkach”**")
    L.append("")
    L.append("Ten plik leży w `narzedzia/`, czyli **poza `docs/`** — nie trafia na "
             "GitHub Pages i uczeń go nie zobaczy.")
    L.append("")
    L.append("Wygenerowany silnikiem **Nu Html Checker %s** — tym samym, który "
             "stoi za `validator.w3.org`. Jeżeli serwis W3C zdąży się "
             "zaktualizować, liczby mogą drgnąć o jeden; lista usterek zostaje "
             "ta sama. Klucz odtwarza `narzedzia/gen_klucz.py`.\n\n"
             "Źródło paczki leży w `narzedzia/paczka/`. Po zmianie w niej "
             "przepakuj archiwum poleceniem `cd narzedzia/paczka && zip -r "
             "../../docs/pliki/walidacja-start.zip .` i uruchom ten skrypt "
             "jeszcze raz."
             % dane.get("version", "?"))
    L.append("")

    razem_b = razem_o = 0
    for p in strony:
        wiad = [m for m in dane["messages"] if m["url"].endswith(p.name)]
        bledy = [m for m in wiad if m["type"] == "error"]
        ostrz = [m for m in wiad if m["type"] != "error"]
        razem_b += len(bledy)
        razem_o += len(ostrz)
        L.append("## `%s` — %d błędów, %d ostrzeżeń" % (p.name, len(bledy), len(ostrz)))
        L.append("")
        if not wiad:
            L.append("Plik jest poprawny. **To jest ta strona, której uczeń ma nie "
                     "poprawiać** — jeżeli zgłasza w niej usterki, walidował zły plik "
                     "albo poprawiał na oko.")
            L.append("")
            continue
        L.append("| Wiersz | Rodzaj | Komunikat walidatora | O czym to uczy |")
        L.append("| ---: | --- | --- | --- |")
        for m in bledy + ostrz:
            rodzaj = "błąd" if m["type"] == "error" else "ostrzeżenie"
            tresc = m["message"]
            opis = CZEGO_UCZY.get(tresc) or OSTRZEZENIA_KOMENTARZ.get(tresc) or "—"
            L.append("| %s | %s | %s | %s |"
                     % (m.get("lastLine"), rodzaj, tresc.replace("|", "\\|"),
                        opis.replace("|", "\\|")))
        L.append("")

    L.append("**Razem w trzech plikach HTML: %d błędów i %d ostrzeżeń.**"
             % (razem_b, razem_o))
    L.append("")

    bledy = css_bledy()
    L.append("## `css/style.css` — %d usterek" % len(bledy))
    L.append("")
    L.append("Walidatora CSS W3C (`jigsaw.w3.org`) nie da się uruchomić lokalnie, "
             "więc arkusz sprawdzony jest parserem `css-tree` zgodnym ze "
             "specyfikacją. Serwis W3C może pogrupować komunikaty inaczej — "
             "**oceniaj listę usterek, nie ich liczbę**.")
    L.append("")
    L.append("| Wiersz | Co jest nie tak |")
    L.append("| ---: | --- |")
    for b in sorted(bledy, key=lambda x: x["wiersz"] or 0):
        wlasciwosc = b["opis"].split(":")[0].strip()
        opis = CSS_CZEGO_UCZY.get(wlasciwosc)
        if not opis:
            if b["rodzaj"] == "struktura":
                opis = ("brak zamykającego nawiasu klamrowego bloku `@media` na końcu "
                        "pliku — reguły responsywne działają, ale plik jest niepoprawny")
            else:
                opis = ("skutek braku średnika po font-size — parser gubi się "
                        "w tym miejscu i zgłasza to jako osobną usterkę")
        L.append("| %s | %s |" % (b["wiersz"], opis))
    L.append("")
    L.append("## Czego nie ma w paczce, a warto przy okazji pokazać")
    L.append("")
    L.append("- **Brak `<meta name=\"viewport\">` w `index.html` i `kontakt.html`.** "
             "Walidator tego nie zgłasza, a strona na telefonie wygląda źle. "
             "`uslugi.html` ten znacznik ma — dobre porównanie w trybie responsywnym.")
    L.append("- **Odnośnik „Regulamin” prowadzi do `#`.** Poprawny HTML, bezużyteczny "
             "link — to znajduje testowanie, nie walidacja.")
    L.append("- **Pola formularza nie mają etykiet `<label>`.** Zero błędów W3C, "
             "komplet błędów w WAVE. To jest sedno rozróżnienia walidacja ≠ dostępność.")
    L.append("- **Za niski kontrast cytatów w sekcji „Opinie”.** Szary `#a8b0bd` "
             "na tle `#f6f7f9` to **2,04 : 1** przy wymaganych 4,5 : 1. Walidator "
             "CSS tego nie zgłasza, bo zapis jest poprawny — znajduje to dopiero "
             "WAVE albo ręczne sprawdzenie kontrastu. Żółty `#fca311` na granacie "
             "`#14213d` daje 7,90 : 1 i jest w porządku; ćwiczenie 5 każe podać "
             "obie liczby.")
    L.append("- **Przeskok nagłówków h1 → h3** w `index.html` walidator jednak "
             "zgłasza — warto pokazać, że granica między „poprawność” a „dostępność” "
             "nie jest ostra.")
    L.append("")

    CEL.write_text("\n".join(L) + "\n", encoding="utf-8")
    print("zapisano:", CEL, CEL.stat().st_size, "B")
    print("HTML: %d błędów, %d ostrzeżeń · CSS: %d usterek"
          % (razem_b, razem_o, len(bledy)))


if __name__ == "__main__":
    main()
