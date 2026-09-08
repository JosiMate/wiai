# WiAI 4TI — strona z materiałami

Statyczna strona z materiałami do przedmiotu **witryny i aplikacje internetowe**
dla klasy 4TI (technik informatyk, kwalifikacja INF.03). Zbudowana na MkDocs
Material, publikowana na GitHub Pages.

Zakres przedmiotu obejmuje jednostki **INF.03.1** (bezpieczeństwo i higiena
pracy), **INF.03.3** (projektowanie stron internetowych) i **INF.03.5**
(programowanie aplikacji internetowych). Języki: **JavaScript** po stronie
klienta, **PHP** po stronie serwera.

> Repozytorium zawierało wcześniej jednostronicową wersję tej strony
> (`index.html`, wdrażaną na Vercelu). Została zastąpiona — poprzednia wersja
> pozostaje dostępna w historii gita.

## Co jest w środku

```
.
├── .github/workflows/
│   └── deploy.yml       # buduje stronę i publikuje na GitHub Pages
├── mkdocs.yml           # konfiguracja: nawigacja, motyw, rozszerzenia Markdown
├── requirements.txt     # zależności Pythona (wersja przypięta — patrz niżej)
└── docs/
    ├── index.md                        # spis wszystkich 31 tematów
    ├── dzial-1/                        # materiały działu I
    ├── pliki/                          # wymagania edukacyjne do pobrania
    └── assets/
        ├── extra.css                   # korekty stylu + reguły wydruku
        ├── karty/<id>.json             # definicje interaktywnych kart pracy
        └── js/
            ├── karta.js                # formularz karty → plik .docx
            ├── quiz.js                 # testy z natychmiastową odpowiedzią
            ├── postep.js               # odhaczanie tematów, paski postępu
            ├── narzedzia.js            # widgety: siła hasła, konwerter systemów
            └── docx.umd.js             # biblioteka składająca .docx (1,1 MB)
```

## Elementy interaktywne

Wszystko działa po stronie przeglądarki — strona pozostaje statyczna, nie ma
serwera i żadne odpowiedzi uczniów nigdzie nie wychodzą. Stan trzymany jest
w `localStorage`, czyli przetrwa zamknięcie karty, ale zniknie po wyczyszczeniu
danych przeglądania i nie przeniesie się na inny komputer.

**Karta pracy jako formularz.** W materiale wstawiasz jedną linijkę:

```html
<div class="karta-pracy" data-karta="systemy-operacyjne"></div>
```

Zadania opisujesz w `docs/assets/karty/systemy-operacyjne.json`. Dostępne typy
pól: `tabela` (wiersze etykieta → wartość), `tekst` (pole wielowierszowe),
`wybor` (jedna opcja z listy) i `zrzut` (wklejenie obrazu przez Ctrl + V,
przeciągnięcie pliku albo wybór z dysku). Uczeń klika przycisk i dostaje plik
`.docx` nazwany według wzoru `<klasa>_<nr w dzienniku>_<sufiks>.docx`.

Biblioteka `docx.umd.js` **nie jest ładowana na starcie** — `karta.js` doczytuje
ją dopiero przy pierwszym kliknięciu przycisku, żeby czytelnicy materiału nie
pobierali megabajta bez potrzeby. Trzymamy ją w repozytorium zamiast na CDN,
bo szkolna sieć potrafi blokować zewnętrzne serwery.

**Quiz.** Dane w znaczniku `script`, dzięki czemu nie potrzeba wtyczek do
budowania:

```html
<div class="quiz" markdown="0">
<script type="application/json">
[ { "pytanie": "…", "opcje": ["a","b"], "poprawna": 1, "wyjasnienie": "…" },
  { "pytanie": "…", "odpowiedz": ["TRIM"], "wyjasnienie": "…" } ]
</script>
</div>
```

Pytanie z `opcje` jest zamknięte, pytanie z `odpowiedz` sprawdza wpisany tekst
po uproszczeniu — bez ogonków, wielkości liter i znaków interpunkcyjnych, więc
„ trim ” i „TRIM” są traktowane tak samo.

**Pasek postępu** włącza się sam na stronie głównej: `postep.js` dokłada kolumnę
z checkboxem do każdej tabeli działowej i liczy procent przerobionych tematów.

**Narzędzia** wstawiasz przez `<div class="narzedzie" data-narzedzie="hasla">`.
Dostępne: `hasla` (entropia i typowe słabości hasła — użyte w temacie 2) oraz
`konwerter` (systemy dwójkowy, ósemkowy, dziesiętny i szesnastkowy na żywo,
przydatny przy operatorach bitowych w dziale III).

Strona główna wypisuje wszystkie tematy z rozkładu 4TI i oznacza, które mają już
materiały. Dodając nowy temat, pamiętaj o zmianie jego statusu w tej tabeli.

## Uruchomienie — raz, na start

### 1. Repozytorium

```powershell
cd wiai
git add .
git commit -m "Strona z materialami WiAI 4TI"
git remote add origin https://github.com/JosiMate/wiai.git
```

Bez narzędzia `gh` załóż repozytorium przez stronę GitHuba, a zamiast ostatniej
linii wykonaj:

```powershell
git remote add origin https://github.com/JosiMate/inf-1.git
git push -u origin main
```

Repozytorium musi pozostać publiczne — GitHub Pages obsługuje repozytoria
prywatne dopiero w płatnych planach.

### 2. Włącz GitHub Pages

W repozytorium: **Settings → Pages → Build and deployment → Source** ustaw na
**GitHub Actions**. To repozytorium było wcześniej wdrażane przez Vercela, więc
Pages trzeba włączyć od zera. Projekt na Vercelu można przy okazji odłączyć —
po zmianie struktury nie ma już czego budować pod dawnym adresem.

To jedyny krok, którego workflow nie zrobi za ciebie. Bez niego budowanie
przejdzie, a wdrożenie zakończy się błędem.

### 3. Poczekaj na pierwszy przebieg

Zakładka **Actions** pokaże workflow *Publikacja strony*. Po jego zakończeniu
strona jest pod adresem:

```
https://josimate.github.io/wiai/
```

Jeśli nazwiesz repozytorium inaczej, popraw `site_url`, `repo_url` i `repo_name`
w `mkdocs.yml` — inaczej mapa strony i przycisk „Edytuj tę stronę" będą wskazywać
w złe miejsce.

## Codzienna praca

Dopisujesz treść, wypychasz zmiany, strona przebudowuje się sama:

```powershell
git add .
git commit -m "Temat 3: edytory WYSIWYG"
git push
```

Przebieg trwa około minuty. Status widać w zakładce **Actions**; przy
niepowodzeniu GitHub wysyła powiadomienie mailem.

### Podgląd przed wypchnięciem

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
mkdocs serve
```

Strona pojawi się na `http://127.0.0.1:8000` i przeładowuje się po każdym zapisie
pliku. To najwygodniejszy sposób pisania — Markdown w jednym oknie, efekt
w drugim.

## Jak dodać materiał do kolejnego tematu

1. Utwórz plik `.md` w katalogu odpowiedniego działu, np.
   `docs/dzial-2/edytory-wysiwyg.md`.
2. Dopisz go do sekcji `nav:` w `mkdocs.yml` — inaczej budowanie ze flagą
   `--strict` zgłosi błąd, bo strona istnieje, ale nie ma do niej dojścia.
3. W `docs/index.md` zmień status tematu z *w przygotowaniu* na link.
4. `git add`, `git commit`, `git push`.

### Konwencje przyjęte w gotowym materiale

Warto je powtarzać, żeby kolejne tematy czytało się tak samo. Wzorzec znajdziesz
w repozytorium `inf-1` (plik `docs/dzial-1/systemy-operacyjne.md`) — obie strony korzystają z tej samej mechaniki.

- **Ramka „O tym temacie"** na początku: liczba godzin, dział, efekty kształcenia
  INF.03 i jedno zdanie o tym, po co uczniowi ta lekcja.
- **Etykiety poziomów** przy sekcjach wykraczających poza podstawę:
  `:material-plus-circle: **rozszerzenie**` (ocena 4) oraz
  `:material-star: **dopełnienie**` (ocena 5). Sekcje bez etykiety to wymagania
  konieczne i podstawowe.
- **Ćwiczenia** numerowane, z nagłówkiem `### :material-console: Ćwiczenie N — …`
  i jasno wskazanym efektem („zapisz w zeszycie…").
- **Zadania sprawdzające** jako zwijane bloki `??? question "…"` z odpowiedzią
  w środku — uczeń widzi pytanie, odpowiedź odsłania sam.
- **Sekcja „Na ocenę celującą"** z zadaniami wykraczającymi poza program.

Przydatne elementy Material, których konfiguracja już jest gotowa:

````markdown
!!! note "Ramka informacyjna"
    Treść ramki.

??? tip "Ramka zwijana — domyślnie schowana"
    Dobra na rozwiązania zadań.

```cpp
// bloki kodu z podświetlaniem i przyciskiem kopiowania
int main() { return 0; }
```

=== "Wariant A"
    Treść pierwszej zakładki.
=== "Wariant B"
    Treść drugiej zakładki.
````

## Własna domena

W **Settings → Pages → Custom domain** wpisz adres, a u operatora domeny dodaj
rekord `CNAME` wskazujący na `josimate.github.io`. GitHub sam wystawi certyfikat
HTTPS — zaznacz **Enforce HTTPS**, gdy stanie się dostępne. Po podpięciu domeny
zaktualizuj `site_url` w `mkdocs.yml`.

## Cztery rzeczy, o których warto wiedzieć

**Wersje akcji są przypięte do konkretnych wydań.** `deploy.yml` używa
`checkout@v7`, `setup-python@v6`, `configure-pages@v6`, `upload-pages-artifact@v5`
i `deploy-pages@v5` — sprawdzone jako aktualne we wrześniu 2026. GitHub wycofuje
stare wersje akcji, więc gdy za rok czy dwa workflow zacznie zgłaszać ostrzeżenia
o przestarzałych wersjach, wystarczy podbić numery.

**Wersja MkDocs Material też jest przypięta celowo.** Zespół Material zapowiedział,
że MkDocs 2.0 wprowadzi zmiany niekompatybilne wstecz — wtyczki i nadpisania
motywu przestaną działać, bez ścieżki migracji. Przypięta wersja sprawia, że
strona nie przestanie się budować w środku roku szkolnego. Aktualizuj świadomie,
poza sezonem.

**Budowanie działa w trybie `--strict`.** Każde ostrzeżenie — martwy odsyłacz,
strona spoza nawigacji — przerywa wdrożenie. To celowe: lepiej, żeby zmiana się
nie opublikowała, niż żeby uczniowie trafili na zepsuty link. Jeśli kiedyś będzie
przeszkadzać, usuń `--strict` z `.github/workflows/deploy.yml`.

**Wyszukiwarka nie odmienia polskich słów.** Biblioteka lunr, na której opiera się
wyszukiwanie w Material, nie ma polskiego stemmera. Szukanie działa, ale dopasowuje
formy dosłownie: „defragmentacja" znajdzie „defragmentacja", nie znajdzie
„defragmentacji". Przy stronie tej wielkości to nie problem.

## Licencja i treść

Materiały do użytku edukacyjnego PCEiKZ Szczucin. Zakres tematów i treść wymagań
wynikają z podstawy programowej kształcenia w zawodzie technik informatyk
(351203) — dokumentu publicznego.
