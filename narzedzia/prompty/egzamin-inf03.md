# Zadanie dla Julesa — dział „Egzamin INF.03”

Przed wysłaniem uzupełnij albo popraw sekcję **„Sprawdzone fakty”** (oznaczone
⚠). Potem skopiuj wszystko poniżej linii i wklej do Julesa po wybraniu
repozytorium `JosiMate/wiai` i gałęzi `main`.

---

Przeczytaj `AGENTS.md` w katalogu głównym repozytorium i postępuj według
niego — szczególnie według sekcji 2 „Zasady pracy”, 3 „Język i styl”,
6 „Widżety i składnia”, 7 „Czego nie ruszać” i 8 „Zanim oddasz zmiany”.
To zadanie **wprost pozwala** dodać nowy katalog `docs/egzamin/`, nowe
skrypty JS, wpisy w `mkdocs.yml` i `docs/.nav.yml` oraz uzupełnić
`AGENTS.md` — poza tym obowiązuje wszystko, co tam jest.

## Cel

Klasa 4TI zdaje kwalifikację **INF.03** dopiero **w kolejnym roku szkolnym**.
Teraz budujemy **fundament**, który będzie rósł z każdym nowym tematem:

1. **bank pytań** w stylu części pisemnej i **test egzaminacyjny** w
   przeglądarce (pełny test na czas oraz trening z wybranego obszaru),
2. **listę kontrolną części praktycznej** do samodzielnego sprawdzania pracy,
3. **stronę postępu**, która pokazuje uczniowi, z czego jest słaby,
4. **zasadę w `AGENTS.md`**, dzięki której każdy kolejny temat dopisuje
   pytania do banku.

Uczeń korzysta z tego przez cały rok: po temacie robi trening z jego
obszaru, raz na kilka tygodni pełny test.

## Sprawdzone fakty — użyj tylko tych

⚠ Nauczyciel: sprawdź z aktualnym informatorem CKE dla INF.03 przed
wysłaniem i popraw, jeśli coś się zmieniło.

- Część pisemna: **40 zadań** zamkniętych, jedna poprawna z czterech
  odpowiedzi, **60 minut**, zdaje się od **50%** punktów, test na komputerze.
- Część praktyczna: **150 minut**, zdaje się od **75%** punktów.
- Środowisko w pracowni i na egzaminie: XAMPP 8.2.12 (Apache, PHP 8.2,
  MariaDB, phpMyAdmin), Windows, edytor bez WYSIWYG — jak w `AGENTS.md`.

Innych liczb o egzaminie (terminy sesji, opłaty, liczba punktów za
konkretne kryteria, statystyki zdawalności) **nie podawaj**. Jeśli tekst
tego wymaga, pisz opisowo i wypisz miejsce w „Do sprawdzenia”.

## 1. Bank pytań — `docs/assets/egzamin/pytania.json`

Lista obiektów:

```json
{
  "id": "inf03-html-001",
  "obszar": "html-css",
  "temat": "dzial-1/powtorzenie-html-css.md",
  "pytanie": "Który znacznik HTML …?",
  "kod": "",
  "opcje": ["…", "…", "…", "…"],
  "poprawna": 2,
  "wyjasnienie": "…"
}
```

- `id` — stały, unikalny, nigdy nie zmieniany ani nie używany ponownie
  (pod nim przeglądarka ucznia trzyma historię odpowiedzi). Usunięte
  pytanie znika z banku, ale jego `id` nie wraca.
- `obszar` — jeden z: `html-css`, `javascript`, `php`, `sql`,
  `bazy-projektowanie`, `grafika-multimedia`, `narzedzia-publikacja`.
  Listę obszarów z opisami trzymaj w tym samym pliku albo w osobnym
  `obszary.json` — strona postępu i filtr treningu biorą ją stamtąd.
- `temat` — ścieżka strony tematu, z którego pytanie wynika (link
  „Powtórz temat” po teście); dla obszarów bez tematu w wiai (np. `sql`)
  pusty napis albo pełny adres strony w serwisie lsbd
  (`https://josimate.github.io/lsbd/…`).
- `kod` — opcjonalny fragment kodu pokazywany w bloku pod pytaniem.
- `poprawna` — indeks od 0, jak w quizie.
- `wyjasnienie` — 1–3 zdania: dlaczego poprawna jest poprawna i dlaczego
  najczęstsza zła odpowiedź jest zła.

**Początkowy bank: 60–80 pytań**, w tym:

- po **6–10** do każdego istniejącego tematu wiai (działy 1–3 — przeczytaj
  te strony i pytaj o to, czego uczą),
- **15–20** z SQL i projektowania baz na poziomie tematów serwisu lsbd
  (SELECT, WHERE, JOIN, GROUP BY, klucze, typy danych, postaci normalne) —
  bez linków do konkretnych stron lsbd, jeśli nie masz do niego dostępu.

Zasady treści:

- **Pytania piszesz sam.** Nie kopiuj ani nie parafrazuj pytań z
  serwisów z „bazami pytań egzaminacyjnych” ani z arkuszy CKE — prawa
  autorskie i ryzyko błędów. Styl ma przypominać egzamin: krótkie
  polecenie, cztery wiarygodne odpowiedzi, jedna jednoznacznie poprawna.
- Złe odpowiedzi to **typowe błędy uczniów**, a nie absurdy.
- Unikaj „wszystkie powyższe”, „żadna z powyższych”, przeczeń w pytaniu
  („który NIE…”) najwyżej w co dziesiątym pytaniu i wtedy wyróżnionych.
- Poprawne odpowiedzi rozłożone mniej więcej równo między A, B, C i D.
- Każde pytanie z kodem **uruchom** (HTML/CSS w Chromium, JS w Node lub
  przeglądarce, PHP w `php -r` / `php plik.php`, SQL w SQLite lub
  MariaDB) i odpowiedź przepisz z wyniku. Pytania o różnice SQLite /
  MariaDB pomiń.
- Wersje: PHP 8.2, MariaDB z XAMPP 8.2.12, współczesny HTML5/CSS3.
  Bez przestarzałych elementów jako poprawnych odpowiedzi (`<font>`,
  `mysql_*`).

To jest materiał treningowy, nie praca na ocenę — poprawne odpowiedzi
w publicznym JSON-ie są dopuszczalne, tak jak w quizach na stronach.

## 2. Widżet testu — `docs/assets/js/egzamin.js`

Znacznik na stronie:

```html
<div class="egzamin-test" data-tryb="pelny"></div>
<div class="egzamin-test" data-tryb="trening"></div>
```

- **`pelny`**: 40 losowych pytań (albo wszystkie, jeśli w banku jest mniej
  — wtedy wyraźna informacja), proporcjonalnie z obszarów; licznik
  **60:00** odliczający w dół; po czasie test kończy się sam; nawigacja
  między pytaniami, oznaczanie „wrócę do tego”, przycisk „Zakończ”
  z potwierdzeniem w widżecie (bez `alert`/`confirm`).
- **`trening`**: wybór obszaru (albo kilku) i liczby pytań (10 / 20 /
  wszystkie z obszaru), bez limitu czasu, **wyjaśnienie zaraz po
  odpowiedzi**.
- Wynik: procent, „zdane / niezdane” według progu z sekcji faktów, wynik
  w podziale na obszary, lista błędnych odpowiedzi z wyjaśnieniem
  i linkiem „Powtórz temat”.
- Kolejność odpowiedzi w pytaniu **mieszana** przy każdym podejściu
  (oznaczenia A–D liczone po wymieszaniu).
- Historia w localStorage pod kluczem z przedrostkiem `wiai-egzamin-`:
  data, tryb, wynik ogółem i na obszar oraz `id` pytań z błędną
  odpowiedzią. Każdy odczyt i zapis w `try/catch`; bez localStorage widżet
  działa, tylko nie pamięta historii. Przycisk „Wyczyść historię”.
- Pytania wczytywane `fetch` z adresu **liczonego raz, przy wczytaniu
  skryptu, jako adres bezwzględny**:
  `new URL('../egzamin/pytania.json', document.currentScript.src)`.
- **Serwis ma `navigation.instant`.** Inicjalizacja przez
  `document$.subscribe(start)`, gdy `document$` istnieje (tak startują
  `quiz.js` i `postep.js`), z zabezpieczeniem przed podwójnym
  zbudowaniem tego samego znacznika. W innym serwisie pominięcie tego
  sprawiło, że widżet nie wyświetlał się po przejściu z menu.
- Wygląd ze zmiennych Material (`--md-…`), oba motywy, telefon 375 px
  bez przewijania strony w bok, obsługa klawiaturą (1–4 / A–D, strzałki).

## 3. Strony w `docs/egzamin/`

Dodaj `"Egzamin INF.03": egzamin` w `docs/.nav.yml` przed „Karty pracy”
i `docs/egzamin/.nav.yml` z kolejnością:

1. **`index.md` — „Egzamin INF.03 — jak to wygląda”**: obie części
   egzaminu (tylko fakty z sekcji wyżej), co z tego jest już w serwisie,
   jak korzystać z działu przez cały rok (trening po temacie, pełny test
   co kilka tygodni, lista kontrolna przy każdej większej pracy),
   odesłanie do strony „Trening” w lsbd dla części bazodanowej
   (`https://josimate.github.io/lsbd/`).
2. **`test.md` — „Test próbny”**: krótki wstęp, oba tryby jako zakładki
   (`=== "Trening z obszaru"` / `=== "Pełny test — 60 minut"`).
3. **`lista-kontrolna.md` — „Część praktyczna — lista kontrolna”**: listy
   `- [ ]` w czterech grupach: **baza danych** (import, kwerendy, zapis
   kwerend i zrzutów), **witryna** (struktura i nazwy plików z polecenia,
   semantyka, walidacja W3C, style w osobnym pliku), **skrypt po stronie
   klienta**, **skrypt PHP** (połączenie, zapytanie, wyświetlenie,
   zamknięcie połączenia) oraz **na koniec** (nazwy folderów i plików,
   zrzuty, zapis przed końcem czasu). Punkty ogólne, wynikające
   z treści wiai i typowej budowy zadań — bez przypisywania im punktacji.
   Odhaczanie i licznik „odhaczone X z Y” robi skrypt
   `lista-kontrolna.js` z serwisu `inf-tt` — skopiuj go do
   `docs/assets/js/`, zmień stałą `SERWIS` na `"wiai"`, dodaj obsługę
   `document$` jak wyżej i dopisz do `mkdocs.yml`.
4. **`postep.md` — „Mój postęp”**: widżet `<div class="egzamin-postep">`
   (w tym samym `egzamin.js`): historia podejść (tabela), wynik na
   obszar z ostatnich podejść (pasek z procentem, bez bibliotek do
   wykresów), „Twoje najsłabsze obszary” z przyciskiem treningu z tego
   obszaru, lista pytań, na które uczeń najczęściej odpowiada źle.
   Ramka `!!! info` o tym, że dane są tylko w tej przeglądarce.

Strony działu to nie tematy lekcji — standard tematu (rozgrzewka,
kryteria, „Przewiduj”) ich nie dotyczy. Styl i język jak w reszcie
serwisu.

## 4. Skrypt kontrolny — `narzedzia/sprawdz_pytania.py`

Bez zależności spoza biblioteki standardowej. Sprawdza i kończy się
kodem 1 przy błędzie:

- poprawny JSON, wszystkie pola, typy;
- unikalne `id` i zgodne z wzorcem `inf03-<obszar-skrót>-NNN`;
- `obszar` z listy obszarów; `temat` wskazuje istniejący plik w `docs/`
  (albo pusty / adres https);
- dokładnie 4 różne, niepuste opcje; `poprawna` w zakresie 0–3;
- brak zdublowanych treści pytań;
- **lista `id` z poprzedniego commita** (`git show HEAD:…`) — każde
  zniknięte `id` wypisuje jako ostrzeżenie, a `id` użyte ponownie dla
  innej treści jako błąd;
- podsumowanie: liczba pytań na obszar i rozkład poprawnych A/B/C/D.

## 5. Bank rośnie z tematami — `AGENTS.md` i szablony

- W `AGENTS.md`, w sekcji 5 „Standard tematu”, dopisz punkt: **każdy
  nowy albo dostosowywany temat dopisuje 5–8 pytań do
  `docs/assets/egzamin/pytania.json`** (zasady jak wyżej, nowe `id`,
  pole `temat` = ścieżka tematu) i uruchamia `sprawdz_pytania.py`.
- W sekcji 6 opisz widżety `egzamin-test` i `egzamin-postep` oraz
  listę kontrolną.
- W sekcji 8 (lista kontrolna przed oddaniem) dopisz uruchomienie
  `python3 narzedzia/sprawdz_pytania.py`.
- W `narzedzia/prompty/nowy-temat.md` i `dostosuj-temat.md` dopisz jedną
  linię przypominającą o pytaniach do banku.

Nie zmieniaj `.github/workflows/` ani `.github/scripts/kontrola.py` —
są wspólne dla siedmiu serwisów.

## Czego nie robić

- Nie zmieniaj istniejących tematów, quizów, kart pracy ani spisu
  tematów na stronie głównej.
- Nie podawaj terminów sesji, liczby punktów za kryteria ani statystyk.
- Nie kopiuj pytań z cudzych baz.

## Zanim oddasz

1. `python3 narzedzia/sprawdz_pytania.py` — zero błędów; wynik wklej
   do opisu PR.
2. `mkdocs build --strict` — bez ostrzeżeń.
3. W przeglądarce (Playwright/Chromium, jeśli masz): wejdź na stronę
   startową i **przejdź do działu „Egzamin” z menu** (nie przez
   odświeżenie) — test, lista kontrolna i postęp muszą się zbudować.
   Zrób trening z jednego obszaru, pełny test z przyspieszonym zegarem
   (np. parametr tylko do testów, niewidoczny dla ucznia, albo podmiana
   czasu w konsoli), sprawdź, że wynik trafia na stronę postępu, a
   „Wyczyść historię” ją czyści. Telefon 375 px i oba motywy.
4. `git status` — tylko pliki z tego zadania.
5. Opis PR z częściami **„Do sprawdzenia”** (każde pytanie, co do którego
   masz choć cień wątpliwości — `id` i powód; miejsca, gdzie pisałeś
   opisowo zamiast podać fakt) i **„Dla nauczyciela”** (jak dopisać
   pytanie, liczba pytań na obszar, jak uruchomić kontrolę, co warto
   dodać w następnej kolejności).
