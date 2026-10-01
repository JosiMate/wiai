# AGENTS.md — instrukcja dla agenta (Jules) · serwis wiai (witryny i aplikacje internetowe, 4TI)

Ten plik czytasz przed każdym zadaniem w tym repozytorium. Opisuje, jak ten
serwis jest zbudowany i jak dodawać do niego materiały tak, żeby wyglądały
i działały jak reszta. Jeśli polecenie w zadaniu jest sprzeczne z tym plikiem,
wykonaj polecenie z zadania, a sprzeczność opisz w opisie zmian (PR).

## 1. Co to jest i dla kogo piszesz

Serwis **wiai** — przedmiot **witryny i aplikacje internetowe**, klasa
**4TI** (technik informatyk), kwalifikacja **INF.03**, 3 godziny tygodniowo,
90 godzin w roku. Języki: **JavaScript** po stronie klienta i **PHP** po
stronie serwera. Środowisko jak na egzaminie: **XAMPP 8.2.12** (Apache,
PHP 8.2, MariaDB, phpMyAdmin) pod Windows, edytor kodu bez WYSIWYG
(VS Code), przeglądarka z narzędziami deweloperskimi. Aplikacje ćwiczeniowe
to ciągła historia serwisu rowerowego „Szprycha” (cennik, wycena naprawy).
Tematy mają numery efektów kształcenia (np. **INF.03.5.2**).

- **Autor i odbiorca.** Materiały przygotowuje nauczyciel informatyki
  w PCEiKZ Szczucin. Czyta je **uczeń**, nie programista i nie nauczyciel.
- **Publikacja.** MkDocs Material na GitHub Pages; każdy push na `main`
  uruchamia `.github/workflows/deploy.yml`, który buduje stronę z
  `mkdocs build --strict` — każde ostrzeżenie zatrzymuje publikację.
- **Repozytorium jest publiczne.** Wszystko, co zapiszesz w repozytorium
  i w opisie PR, mogą przeczytać uczniowie.

## 2. Zasady pracy

1. **Najpierw przeczytaj wzorce** wskazane w sekcji 4 i odwzoruj ich
   konwencje — nagłówki, typy ramek, kolejność sekcji, format tabel i JSON.
   Nie wymyślaj własnej struktury.
2. **Zmieniaj tylko to, czego wymaga zadanie.** Nie przebudowuj istniejących
   tematów, motywu, `mkdocs.yml`, skryptów JS ani stylów, jeśli zadanie tego
   nie mówi wprost.
3. **Nic dla nauczyciela nie trafia do repozytorium ani do opisu PR:**
   rozwiązania i klucze do prac **oddawanych do oceny** (karty pracy,
   szkielety ćwiczeń oddawane z kartą, sprawdziany, prace klasowe) oraz
   scenariusze lekcji. Rozwiązania sprawdzaj w katalogu **poza
   repozytorium** (np. `/tmp/rozwiazania/`), a przed otwarciem PR uruchom
   `git status` i upewnij się, że żaden taki plik się nie dostał.
   Na stronie zostają celowo: trzecia, ostatnia podpowiedź pod ćwiczeniem
   (prawie gotowe rozwiązanie) i omówienia przykładów w ramkach „Przewiduj”.
4. **Nie zmyślaj faktów.** Liczby, wersje programów, daty, przepisy, limity
   i nazwy opcji podawaj tylko wtedy, gdy są w zadaniu, w repozytorium albo
   masz pewne źródło. W razie wątpliwości pisz opisowo i wypisz takie miejsca
   w opisie PR w części „Do sprawdzenia”. Fakty podane w zadaniu przez
   nauczyciela są sprawdzone — użyj ich dosłownie.
5. **Każdy wynik na stronie musi być prawdziwy.** Kod z przykładów
   i ćwiczeń uruchom, a wyniki w ramkach „Przewiduj” przepisz z uruchomienia,
   nie z pamięci.
6. **Końce linii pilnuje `.gitattributes`** (`* text=auto`): w repozytorium
   każdy plik tekstowy ma LF. Zapisuj pliki w UTF-8, z LF i pustym wierszem
   na końcu. Nie przepisuj całych plików — w diffie ma być widać tylko twoje
   zmiany.
7. **Stabilne identyfikatory.** Nie zmieniaj istniejących `id` pól w kartach
   pracy, nazw plików kart (`data-karta`) ani tekstu wierszy w spisach
   tematów — przeglądarki uczniów trzymają pod nimi zapisane odpowiedzi
   i odhaczone tematy. Zmiana kasuje uczniom ich pracę.

## 3. Język i styl

- Po polsku, do ucznia per „ty”. Rzeczowo i konkretnie: zdanie niesie
  informację albo go nie ma. Bez „warto pamiętać, że”, „w dzisiejszych
  czasach”, zachwytów nad technologią i emoji.
- Najpierw problem z życia albo z egzaminu, potem pojęcie. Przykłady
  z codzienności ucznia i z zawodu.
- Polskie cudzysłowy „…”, pauza — w zdaniach, półpauza – w zakresach
  (1–3). Klawisze zapisuj rozszerzeniem `pymdownx.keys`: `++ctrl+c++`.
- Tabele chętnie — przy porównaniach niosą więcej niż akapit.
- Każda ramka (admonicja) ma tytuł w cudzysłowie, treść wciętą 4 spacjami.

## 4. Budowa repozytorium i dodawanie tematu

Tematy leżą w `docs/dzial-N/` (działy I–VII; katalogi IV–VII powstaną wraz
z pierwszym tematem działu). Pełny rozkład — działy, tematy, godziny —
jest w spisie `docs/index.md`; wymagania na oceny w
`docs/pliki/wymagania-edukacyjne-wiai-4ti.docx`.

### Wzorce — przeczytaj przed pisaniem

1. `docs/dzial-3/srodowisko-programistyczne.md` — **pełny standard**
   (zwinięty plan lekcji, rozgrzewka, kryteria, „Przewiduj”, widżet,
   ćwiczenia z podpowiedziami, quiz, karta, „Jak ją oddać”).
2. `docs/dzial-3/wprowadzenie-programowanie.md` — drugi wzorzec (JS + PHP,
   formularze, paczka startowa).
3. `docs/assets/karty/srodowisko-programistyczne.json` — wzorzec karty pracy.
4. `docs/index.md`, `docs/dzial-3/.nav.yml`, `docs/karty/index.md`.

Tematy z działów I–II powstały przed standardem („Cele lekcji”, brak
rozgrzewki) — nie traktuj ich jako wzoru układu.

Tytuł ramki kryteriów: `!!! success "Kryteria sukcesu"` z wierszem
„Po tym temacie:”. W „O tym temacie”: „efekt kształcenia **INF.03.5.5**”
przy jednym efekcie, „efekty kształcenia **INF.03.5.1**, **INF.03.5.2**”
przy kilku.

### Pliki, które zmieniasz przy nowym temacie

- `docs/dzial-N/<plik>.md` — strona. Nazwa: małe litery ASCII bez polskich
  znaków, słowa przez myślnik, skrót tytułu (`srodowisko-programistyczne.md`).
- `docs/dzial-N/.nav.yml` — `  - "Krótki tytuł": <plik>.md`. Pierwszy temat
  nowego działu: utwórz katalog z `.nav.yml` wzorowanym na
  `docs/dzial-3/.nav.yml` (tytuł działu jak w spisie) i dopisz `- dzial-N`
  do `docs/.nav.yml` przed „Karty pracy”.
- `docs/index.md` — w tabeli działu wiersz
  `| Tytuł | 3 | *w przygotowaniu* |` zamień na
  `| **[Tytuł](dzial-N/<plik>.md)** | 3 | :material-check-circle:{ title="Materiał gotowy" } gotowe |`
  (kolumnę godzin zostaw bez zmian).
  **Tekst tytułu zostaw co do znaku** (także półpauzy „–”) — pod nim
  przeglądarki uczniów pamiętają odhaczone tematy.
- `docs/karty/index.md` — dopisz do tablicy JSON:
  `{"plik": "<plik>", "tytul": "Dział III · <krótki tytuł>", "url": "../dzial-3/<plik>/#karta"}`
  (numer działu w tytule rzymski, w adresie arabski).
- `docs/assets/karty/<plik>.json` — karta pracy (niżej).
- Poprzedni temat działu: dopisz na jego końcu wiersz
  `Następny temat: [<tytuł>](<plik>.md).` (wzór w
  `wprowadzenie-programowanie.md`), a w nowym — `Poprzedni temat: […](…).`
- `docs/pliki/<nazwa>-start.zip` — paczka startowa, jeśli ćwiczenia jej
  wymagają (niżej).

### Paczka startowa do ćwiczeń

- Jeden katalog w środku (`<nazwa>/…`), który uczeń rozpakowuje do
  `C:\xampp\htdocs\` i otwiera przez `http://localhost/<nazwa>/`.
- W katalogu `CZYTAJ-TO-NAJPIERW.txt`: zawartość, jak uruchomić, ostrzeżenie
  przed otwieraniem plików PHP podwójnym kliknięciem.
- Miejsca do uzupełnienia oznaczone w kodzie słowem `ZADANIE`; wygląd
  (`css/style.css`) gotowy — możesz skopiować styl z istniejącej paczki
  (`srodowisko-start.zip`).
- Pliki tekstowe w paczce z końcami **CRLF** (uczniowie pracują w Windows).
- **Sprawdź paczkę:** `php -l` na każdym pliku PHP, uruchomienie przez
  `php -S localhost:8000` i test w przeglądarce (np. Playwright), a dla
  JavaScriptu — test w przeglądarce, nie tylko w Node. Rozwiązania nie
  commitujesz; wyniki oczekiwane podaj na stronie w tabeli, jak we wzorcu.
- Link na stronie:
  `[:material-folder-zip: <Nazwa> — paczka startowa (.zip)](../pliki/<nazwa>-start.zip){ .md-button .md-button--primary download="<nazwa>-start.zip" }`

### Karta pracy — `docs/assets/karty/<plik>.json`

```json
{
 "id": "wiai-<plik>",
 "tytul": "<tytuł tematu>",
 "przedmiot": "PCEiKZ Szczucin · witryny i aplikacje internetowe · INF.03",
 "klasa": "4TI",
 "sufiks": "<KROTKI-SUFIKS>",
 "zadania": [
  {
   "nr": 1,
   "tytul": "…",
   "poziom": "wymagania konieczne · ocena 2",
   "polecenie": "Ćwiczenie 1. … (dozwolony HTML: <code>, <strong>)",
   "pola": [
    {"typ": "tabela", "wiersze": [["z1_status", "Kod statusu dokumentu", ""]]},
    {"typ": "tekst", "id": "z1_czemu", "wiersze": 3, "pytanie": "…"},
    {"typ": "wybor", "id": "z1_metoda", "pytanie": "…", "opcje": ["get", "post"]},
    {"typ": "zrzut", "id": "z1_zrzut", "opis": "co ma być na zrzucie"}
   ]
  }
 ]
}
```

- `poziom`: `wymagania konieczne · ocena 2` … `wymagania dopełniające · ocena 5`
  albo łączone (`wymagania rozszerzające i dopełniające · oceny 4–5`).
  Ocena 6 nie pojawia się w kartach tematów — zadania na 6 są działowe.
- Zwykle 7–8 zadań; ostatnie „Samoocena” (`"poziom": ""`,
  `"polecenie": "Krótko i szczerze — to nie jest oceniane na stopień."`,
  pola `s_…`). `id` pól: `z<nr>_<nazwa>`. Wcięcie JSON: 1 spacja.
- `polecenie` jest wstawiane jako HTML — nie używaj gołego znaku `<`.

### Zadania na ocenę celującą

Są **działowe**: `narzedzia/zadania6.json` (klucz = nagłówek `### Dział …`
z `docs/index.md`). Blok między `<!-- zadania6:start -->` i
`<!-- zadania6:end -->` w `docs/index.md` jest generowany — nie edytuj go
ręcznie. Tylko na polecenie: zmień JSON i uruchom
`python3 narzedzia/zadania6.py docs/index.md`.

## 5. Standard tematu — obowiązuje każdy nowy temat

Elementy w tej kolejności, od góry strony:

1. **Tytuł** `# …` — jak w rozkładzie materiału (spis tematów), może być
   lekko skrócony.
2. **„O tym temacie”** — `!!! abstract "O tym temacie"`: liczba godzin ·
   dział · efekty kształcenia albo podstawa programowa, potem 1–2 akapity:
   po co ten temat, z czym się łączy. W temacie na **2 i więcej godzin** plan
   lekcji jest **zwiniętym blokiem wewnątrz** tej ramki (ramka zostaje
   otwarta):

   ```markdown
   !!! abstract "O tym temacie"

       **3 godziny lekcyjne** · Dział … · efekty kształcenia **…**

       Akapit o tym, po co jest ten temat.

       ??? abstract "Plan trzech lekcji"

           | Lekcja | Sekcje | Ćwiczenia |
           | :---: | --- | --- |
           | 1 | 1–3: … | 1–2 |
   ```

3. **Rozgrzewka** — zwinięta ramka z trzema pytaniami na przypomnienie,
   **bez oceny**. Zastępuje bilety wyjścia (wyjściówek nie dodajemy nigdzie).
   Dokładnie ten układ:

   ```markdown
   ??? rozgrzewka "Na rozgrzewkę — 3 minuty, bez zaglądania"

       Odpowiedz w zeszycie, zanim zaczniesz nowy temat. Odpowiedzi rozwiń
       dopiero wtedy, gdy wszyscy skończą — nie liczą się do oceny.

       1. **Z poprzedniej lekcji.** …
       2. **Sprzed kilku tygodni.** …
       3. **Z dawniejszych tematów.** …

       ??? success "Odpowiedzi"

           1. …
           2. …
           3. …
   ```

   - Pytanie 1 dotyczy **poprzedniego tematu tej samej klasy**, pytanie 2 —
     tematu sprzed kilku tygodni, pytanie 3 — dawniejszego (wcześniejszy
     dział, poprzedni rok, inny przedmiot tej klasy). Kolejność tematów
     odczytasz ze spisu tematów i z `.nav.yml` — **przeczytaj te strony**,
     zanim ułożysz pytania.
   - Pytania krótkie, z jednoznaczną odpowiedzią (wynik, liczba, nazwa,
     jedno zdanie). Najlepiej takie, które przygotowują dzisiejszy temat —
     odpowiedź może się kończyć zdaniem „dziś do tego wrócimy”.
4. **Kryteria sukcesu** — `!!! success` z listą numerowaną, pisaną językiem
   ucznia, w pierwszej osobie czasu przyszłego: „Napiszę…”, „Wyjaśnię…”,
   „Rozpoznam…”, „Dobiorę…”. Od 4 do 7 punktów, każdy do sprawdzenia
   w ćwiczeniach albo w karcie pracy. Dokładny tytuł ramki — jak we
   wzorcu z sekcji 4.
5. **Sekcje treści** `## 1. …`, `## 2. …` (separatory `---` między nimi —
   tak jak we wzorcu tego repozytorium). Na końcu treści zestawienie
   najczęstszych błędów (objaw, przyczyna, co zrobić) — w formie, jakiej
   używa wzorzec (tabela albo ramka `!!! warning`).
6. **„Przewiduj, potem sprawdź”** — wynik przykładu nigdy nie stoi na
   widoku przed pytaniem. Uczeń najpierw przewiduje, potem odsłania wynik
   w zwiniętej ramce. Składnia — sekcja 6.
7. **Ćwiczenia** (`## Ćwiczenia`) — od łatwych do trudnych; napisz, które
   są minimum dla wszystkich, a które na wyższą ocenę. Pod trudniejszymi
   ćwiczeniami **trzy stopniowane podpowiedzi**:

   ```markdown
   ??? tip "Podpowiedź 1"

       Kierunek: od czego zacząć, o co zapytać.

   ??? tip "Podpowiedź 2"

       Konkretne narzędzie: funkcja, polecenie, konstrukcja.

   ??? tip "Podpowiedź 3"

       Prawie gotowe rozwiązanie z jednym zdaniem wyjaśnienia.
   ```

8. **„Sprawdź się”** — quiz z natychmiastową odpowiedzią (7–8 pytań), składnia
   w sekcji 6. Każde `wyjasnienie` mówi, dlaczego poprawna odpowiedź jest
   poprawna, a kusząca błędna — błędna.
9. **Karta pracy** i sposób oddania — jak we wzorcu (sekcja 4 i 6).
   Prace oddaje się przez **Zadania domowe w dzienniku VULCAN**, termin —
   najbliższa lekcja.
10. **Zakończenie strony** jak we wzorcu tego repozytorium (stopka kursywą
    ze źródłami i datą sprawdzenia albo odsyłacze do sąsiednich tematów
    i „Materiały uzupełniające”).
11. **Dopisanie pytań do banku egzaminacyjnego:** każdy nowy albo dostosowywany
    temat dopisuje 5–8 pytań do `docs/assets/egzamin/pytania.json` (nowe unikalne
    `id`, pole `temat` = ścieżka tematu, autorskie pytania) i uruchamia
    `python3 narzedzia/sprawdz_pytania.py`.

Scenariusz lekcji w Wordzie należy do standardu, ale przygotowuje go
nauczyciel **poza repozytorium** — nie twórz go tutaj.

### Dostosowanie istniejącego tematu do standardu

Tylko wtedy, gdy zadanie o to prosi. Dodajesz brakujące elementy (rozgrzewka,
kryteria sukcesu zamiast „Cele lekcji”, ramki „Przewiduj” wokół wyników,
podpowiedzi pod trudniejszymi ćwiczeniami), **nie przepisujesz** reszty.
Nie zmieniaj numeracji ćwiczeń ani `id` pól w karcie pracy — uczniowie mogą
mieć już zapisane odpowiedzi.

## 6. Widżety i składnia

### „Przewiduj, potem sprawdź”

```markdown
!!! example "Przewiduj"

    Co wypisze `powitanie.php?imie=Ola`?

    ??? success "Przewiduj, potem sprawdź wynik"

        `Cześć, Ola!` — …
```

Wynik przepisujesz z prawdziwego uruchomienia (`php`, `node`, przeglądarka).
Komunikaty błędów PHP podawaj w postaci z PHP 8 (np.
`Parse error: syntax error, unexpected token "if"`).

### Inne ramki używane w serwisie

- `!!! quote "Zasada, którą warto zapamiętać"` — jedna zasada na sekcję,
  najwyżej kilka na temat.
- `!!! warning "…"`, `!!! danger "…"`, `!!! tip "…"`, `!!! info "…"`.
- Znacznik poziomu jako osobny akapit pod nagłówkiem ćwiczenia albo sekcji:
  `:material-plus-circle: **rozszerzenie**` (ocena 4),
  `:material-star: **dopełnienie**` (ocena 5).
- Ćwiczenia: `### :material-console: Ćwiczenie N — tytuł`.
- Zakładki (`pymdownx.tabbed`): `=== "plik.php"` z treścią wciętą 4 spacjami.
- Indeks górny: `2^8^` (`pymdownx.caret`). Klawisze: `++ctrl+u++`, `++f12++`.

### Narzędzia interaktywne (`docs/assets/js/narzedzia.js`)

`<div class="narzedzie" data-narzedzie="hasla"></div>` — dostępne:
`hasla`, `konwerter`, `tasma`. Nowe narzędzie dopisujesz do obiektu
`NARZEDZIA` w tym pliku, style do `docs/assets/extra.css` (klasy `.nz-…`)
— tylko gdy zadanie o to prosi.

### Widżety egzaminacyjne INF.03

- Test i trening: `<div class="egzamin-test" data-tryb="pelny"></div>` lub `data-tryb="trening"`.
- Strona postępu: `<div class="egzamin-postep"></div>`.
- Lista kontrolna części praktycznej: standardowa lista zadaniowa `- [ ]` obsługiwana automatycznie przez `assets/js/lista-kontrolna.js`.

### Quiz „Sprawdź się”

Pod nagłówkiem zdanie: „Test z natychmiastową odpowiedzią. **Nie jest
oceniany i nic nie wysyła.**”, potem:

```html
<div class="quiz" markdown="0">
<script type="application/json">
[
 {"pytanie": "…", "opcje": ["…", "…", "…", "…"], "poprawna": 1, "wyjasnienie": "…"},
 {"pytanie": "Co zwróci 450 / 0 w JavaScripcie?", "odpowiedz": ["Infinity"], "wyjasnienie": "…"}
]
</script>
</div>
```

`poprawna` liczy się od 0; 8 pytań.

### Karta pracy i oddanie

```markdown
## Karta pracy

Z tego tematu oddajesz **kartę pracy** oraz **spakowany katalog `<nazwa>`**
z uzupełnionymi plikami. Kartę wypełniaj w trakcie ćwiczeń.

<div class="kp-podsumowanie" data-karta="<plik>"></div>

<span id="karta" class="kp-kotwica"></span>

???+ karta "Rozwiń kartę pracy"

    !!! info "Twoje odpowiedzi zostają na twoim komputerze"

        Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
        przycisku. Wyczyszczenie danych przeglądania usunie odpowiedzi — kiedy
        skończysz, pobierz plik.

    <div class="karta-pracy" data-karta="<plik>"></div>

### Jak ją oddać

1. Katalog `C:\xampp\htdocs\<nazwa>` spakuj do `4TI_<numer w dzienniku>_<nazwa>.zip`.
2. Pobierz kartę pracy przyciskiem pod formularzem.
3. Oba pliki dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *<Tytuł tematu> — karta pracy*.
```

Na końcu strony: odsyłacz do poprzedniego/następnego tematu i ramka
`!!! info "Materiały uzupełniające"` (MDN, php.net — z dopiskiem „po
angielsku”, gdy strona jest po angielsku).

## 7. Czego nie ruszać

- `docs/assets/js/docx.umd.js` — biblioteka ładowana leniwie; nie edytuj,
  nie dopisuj do `extra_javascript`.
- `docs/pliki/*.docx` — gotowe dokumenty nauczyciela.
- `narzedzia/paczka/` i `narzedzia/gen_klucz.py` — źródło paczki do walidacji;
  **nie twórz nowych plików `KLUCZ-*`** ani rozwiązań (`*-rozwiazanie*`)
  w repozytorium.
- `README.md` jest częściowo nieaktualny — kieruj się tym plikiem i wzorcami.

## 8. Zanim oddasz zmiany

1. `python3 narzedzia/sprawdz_pytania.py` — **zero błędów**.
2. `pip install -r requirements.txt` i `mkdocs build --strict` — **bez
   ostrzeżeń**. Martwy link albo plik poza nawigacją też jest błędem.
2. Każdy JSON jest poprawny: karta pracy (`python3 -m json.tool plik.json`)
   i tablica quizu wewnątrz strony (wytnij ją i sprawdź tak samo).
3. Kod z przykładów i ćwiczeń uruchomiony; wyniki na stronie zgadzają się
   z uruchomieniem.
   Paczka startowa: `php -l` bez błędów tam, gdzie nie ma celowych błędów;
   ćwiczenie w paczce da się rozwiązać, a rozwiązanie daje wyniki z tabeli
   na stronie.
4. Lista kontrolna standardu — każdy punkt odhacz w opisie PR:
   - [ ] „O tym temacie” (+ zwinięty plan lekcji, jeśli temat ma 2+ godziny)
   - [ ] rozgrzewka: 3 pytania (poprzednia lekcja / kilka tygodni / dawniej) z odpowiedziami
   - [ ] kryteria sukcesu w pierwszej osobie
   - [ ] „Przewiduj” — żaden wynik nie stoi na widoku przed pytaniem
   - [ ] trzy podpowiedzi pod trudniejszymi ćwiczeniami
   - [ ] quiz, karta pracy, sposób oddania, zakończenie strony
   - [ ] spis tematów i nawigacja zaktualizowane
   - [ ] `git status`: w zmianach nie ma rozwiązań, kluczy, scenariuszy ani plików tymczasowych
5. **Opis PR** po polsku: co dodałeś, lista zmienionych plików, część
   „Do sprawdzenia” (fakty, których nie byłeś pewien) i część „Dla
   nauczyciela” (np. pliki do przygotowania ręcznie, jak ściąga .docx).
   Nie wklejaj do opisu rozwiązań — repozytorium jest publiczne.
