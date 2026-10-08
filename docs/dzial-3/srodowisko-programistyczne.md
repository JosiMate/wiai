# Środowisko programistyczne — edytor, kompilator, translator, linker, debugger

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział III. Podstawy programowania — środowisko i dane
    · efekt kształcenia **INF.03.5.5**

    Procesor nie rozumie ani słowa z tego, co piszesz. Nie zna `if`, nie wie,
    co to `$rowery`, a „Szacunkowy koszt” jest dla niego ciągiem bajtów. Między
    tekstem w edytorze a działającym programem stoi cały łańcuch narzędzi —
    i każde z nich łapie **inny** rodzaj błędu.

    Kto wie, które narzędzie zgłasza błąd i na jakim etapie, ten nie zgaduje.
    Czyta komunikat, wie, gdzie szukać, i poprawia przyczynę za pierwszym
    razem. Wracasz w tym temacie do wyceny naprawy dla „Szprychy” — tym razem
    z rabatem i z błędami, które znajdziesz sam.

    ??? abstract "Plan trzech lekcji"

        | Lekcja | Sekcje | Ćwiczenia |
        | :---: | --- | --- |
        | 1 | 1–3: od tekstu do programu, kompilator i interpreter, rodzaje błędów | 1–2 |
        | 2 | 4–5: edytor i IDE, debugger | 3–4 |
        | 3 | 6–8: XAMPP jako środowisko uruchomieniowe, dobór narzędzi, najczęstsze kłopoty | 5–6 |

??? rozgrzewka "Na rozgrzewkę — 3 minuty, bez zaglądania"

    Odpowiedz w zeszycie, zanim zaczniesz nowy temat. Odpowiedzi rozwiń
    dopiero wtedy, gdy wszyscy skończą — nie liczą się do oceny.

    1. **Z poprzedniej lekcji.** Otwierasz `wycena.php` podwójnym kliknięciem
       w Eksploratorze plików. Co zobaczysz i dlaczego?
    2. **Sprzed kilku tygodni.** Co wstawi VS Code, gdy wpiszesz `ul>li*3`
       i naciśniesz ++tab++?
    3. **Z dawniejszych tematów.** Ile różnych wartości da się zapisać w jednym
       bajcie?

    ??? success "Odpowiedzi"

        1. Surowy kod PHP, pustą stronę albo okno pobierania pliku. Adres
           zaczyna się od `file:///` — przeglądarka czyta plik z dysku, bez
           serwera, więc PHP nie ma kto wykonać.
        2. Listę `<ul>` z trzema elementami `<li>` — to skrót **Emmet**,
           wbudowany w edytor. Edytor to pierwsze narzędzie, o którym dziś
           mowa.
        3. **256** — bajt ma 8 bitów, a 2^8^ = 256. Dziś zobaczysz, że program,
           który wykonuje procesor, to właśnie ciąg takich bajtów.

!!! success "Kryteria sukcesu"

    Po tym temacie:

    1. Wymienię składniki środowiska programistycznego i powiem, co robi każdy z nich.
    2. Wyjaśnię, czym kompilator różni się od interpretera, i powiem, jak uruchamiane są JavaScript i PHP.
    3. Rozpoznam w komunikacie błąd składni i błąd wykonania i powiem, które narzędzie go zgłosiło.
    4. Skonfiguruję VS Code do pracy z PHP i skorzystam z podpowiedzi składni.
    5. Zatrzymam program na punkcie przerwania, wykonam go krok po kroku i odczytam wartości zmiennych.
    6. Odczytam konfigurację XAMPP-a: wersję PHP, plik `php.ini`, port serwera — i otworzę phpMyAdmin.
    7. Dobiorę narzędzia do zadania i uzasadnię wybór.

---

## 1. Od tekstu do działającego programu

Procesor wykonuje wyłącznie **kod maszynowy** — ciąg bajtów; każda ich grupa
oznacza jedną prostą instrukcję. Tak wygląda funkcja licząca koszt
`cena * rowery` po przetłumaczeniu kompilatorem gcc dla procesora x86-64
(w Linuksie — tak samo pokaże ją godbolt.org):

| Bajty (szesnastkowo) | Instrukcja | Znaczenie |
| --- | --- | --- |
| `89 f8` | `mov eax, edi` | skopiuj cenę do rejestru `eax` |
| `0f af c6` | `imul eax, esi` | pomnóż `eax` przez liczbę rowerów |
| `c3` | `ret` | wróć z wynikiem |

Nikt nie pisze tak programów. Piszesz **kod źródłowy** w języku zrozumiałym
dla człowieka, a resztę robią narzędzia. Wszystkie razem to **środowisko
programistyczne**:

| Narzędzie | Co robi | Przykłady |
| --- | --- | --- |
| **Edytor** | służy do pisania kodu źródłowego: podświetla składnię, podpowiada, formatuje | VS Code, Notepad++, Sublime Text |
| **Translator** | ogólna nazwa programu, który **tłumaczy** kod z jednego języka na inny; kompilator, interpreter i asembler to jego rodzaje | — |
| **Kompilator** | tłumaczy **cały** program na kod maszynowy **przed** uruchomieniem | gcc, clang, Microsoft C/C++ |
| **Interpreter** | wykonuje program, tłumacząc go **w trakcie** działania — przy każdym uruchomieniu | PHP, Python, silnik JavaScriptu w przeglądarce |
| **Asembler** | tłumaczy język asemblera (`mov`, `imul`…) na kod maszynowy | NASM, as |
| **Linker** (konsolidator) | **łączy** przetłumaczone części programu i biblioteki w jeden plik wykonywalny | ld, link.exe |
| **Debugger** | wykonuje program pod kontrolą: zatrzymuje go, prowadzi krok po kroku, pokazuje wartości zmiennych | narzędzia deweloperskie przeglądarki, gdb, Xdebug |

Jeśli edytor, kompilator (albo interpreter) i debugger są połączone w jednym
programie z obsługą całego projektu, mówimy o **zintegrowanym środowisku
programistycznym** — **IDE** (*Integrated Development Environment*).

---

## 2. Kompilator, linker, interpreter

### Kompilacja i łączenie — na przykładzie języka C

Języki JavaScript i PHP nie mają osobnego kroku kompilacji, więc drogę
„klasyczną” pokazujemy na języku C. Program wyceny podzielono na dwa pliki —
tak jak w PHP dzielisz kod na `wycena.php` i `cennik.php`:

=== "cennik.h — zapowiedź"

    ```c
    int rabat(int kwota, int rowery);
    ```

=== "cennik.c — treść funkcji"

    ```c
    #include "cennik.h"

    int rabat(int kwota, int rowery) {
        if (rowery >= 5) {
            return kwota * 90 / 100;
        }
        return kwota;
    }
    ```

=== "main.c — program główny"

    ```c
    #include <stdio.h>
    #include "cennik.h"

    int main(void) {
        int razem = rabat(90 * 5, 5);
        printf("Koszt: %d zl\n", razem);
        return 0;
    }
    ```

Budowanie programu to trzy polecenia:

```text
gcc -c cennik.c                        ← kompilacja: powstaje cennik.o
gcc -c main.c                          ← kompilacja: powstaje main.o
gcc main.o cennik.o -o wycena.exe      ← łączenie (linker): powstaje wycena.exe
```

1. **Preprocesor** wkleja do każdego pliku zawartość plików z `#include`.
   Dzięki temu `main.c` „wie”, że funkcja `rabat` istnieje i jakie ma
   parametry.
2. **Kompilator** tłumaczy każdy plik osobno na kod maszynowy — powstają
   **pliki obiektowe** `.o` (w Windows `.obj`). W `main.o` zamiast adresu
   funkcji `rabat` jest puste miejsce — jej treść leży w innym pliku.
3. **Linker** składa pliki `.o` i biblioteki (tu: bibliotekę z funkcją
   `printf`) w jeden plik wykonywalny i wpisuje w puste miejsca właściwe
   adresy.

Gotowy `wycena.exe` uruchomisz na każdym komputerze z tym samym systemem
i procesorem — **bez kompilatora i bez kodu źródłowego**.

!!! example "Przewiduj"

    Ktoś w trzecim poleceniu zapomniał o pliku `cennik.o`:
    `gcc main.o -o wycena.exe`. Które narzędzie zgłosi błąd — kompilator czy
    linker? Czy powstanie plik `wycena.exe`?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        main.c:(.text+0x17): undefined reference to `rabat'
        collect2: error: ld returned 1 exit status
        ```

        Zgłasza **linker** (`ld`). Oba pliki skompilowały się bez zarzutu —
        dzięki `cennik.h` kompilator wiedział, że funkcja istnieje. Dopiero
        linker szuka jej **treści** i nie znajduje jej w żadnym z podanych
        plików. Plik `wycena.exe` nie powstaje.

### Interpreter — i gdzie w tym JavaScript i PHP

| | Kompilator | Interpreter |
| --- | --- | --- |
| Kiedy tłumaczy | raz, przed uruchomieniem | przy każdym uruchomieniu, w trakcie działania |
| Co powstaje | plik wykonywalny | nic — program od razu działa |
| Co jest potrzebne do uruchomienia | sam plik wykonywalny | interpreter **i** kod źródłowy |
| Kiedy wychodzą błędy składni | wszystkie przed uruchomieniem | gdy interpreter dojdzie do tłumaczenia danego pliku |
| Szybkość działania | zwykle wyższa | zwykle niższa |
| Przykłady języków | C, C++, Rust, Go | **PHP**, **JavaScript**, Python |

**JavaScript** i **PHP** są językami **interpretowanymi** — nazywa się je też
**skryptowymi**. Do uruchomienia skryptu PHP serwer potrzebuje interpretera
PHP, a do uruchomienia JavaScriptu — przeglądarki z silnikiem JavaScriptu.
Dlatego kod JavaScriptu każdy użytkownik może przeczytać: przeglądarka musi go
dostać, żeby go wykonać.

!!! info "W praktyce granica się zaciera"

    Dzisiejsze interpretery nie czytają programu „wiersz po wierszu”. PHP
    najpierw tłumaczy **cały plik** na kod pośredni (tzw. opkody) i dopiero
    go wykonuje; moduł OPcache przechowuje przetłumaczone pliki, żeby nie
    tłumaczyć ich przy każdym żądaniu. Silnik JavaScriptu w przeglądarce
    tłumaczy skrypt na kod bajtowy, a fragmenty wykonywane najczęściej
    kompiluje w locie do kodu maszynowego — to kompilacja **JIT**
    (*just in time*). Tę samą technikę ma PHP od wersji 8, choć domyślnie jest
    ona wyłączona.

    Na egzaminie wystarczy wiedzieć: C i C++ są kompilowane, PHP i JavaScript
    — interpretowane. Ale żeby rozumieć komunikaty o błędach, warto pamiętać
    o jednym: **przed wykonaniem PHP i JavaScript sprawdzają składnię całego
    pliku**.

### Taśma: gdzie który błąd wychodzi na jaw

Wybierz język i rodzaj błędu. Zanim zobaczysz odpowiedź, kliknij etap,
na którym — twoim zdaniem — program się zatrzyma.

<div class="narzedzie" data-narzedzie="tasma"></div>

---

## 3. Błąd składni, błąd wykonania, błąd logiczny

| Rodzaj | Kto go wykrywa | Kiedy | Przykład |
| --- | --- | --- | --- |
| **Błąd składni** | translator: kompilator albo interpreter | **przed** wykonaniem — program w ogóle nie rusza | brak średnika, niedomknięty nawias |
| **Błąd wykonania** | interpreter albo system | **w trakcie** — program zatrzymuje się w wierszu z błędem | w PHP i JavaScripcie: wywołanie nieistniejącej funkcji; w PHP: brak dołączanego pliku, dzielenie przez zero |
| **Błąd logiczny** | **nikt** — tylko ty: testami i debuggerem | program działa do końca i podaje zły wynik | `>` zamiast `>=`, zły wzór |

W językach kompilowanych dochodzi jeszcze **błąd łączenia**: w C brak treści
funkcji wykryje linker, zanim program w ogóle powstanie — widziałeś to
w sekcji 2.

Plik `bledy.php` z paczki do ćwiczeń:

```php
<?php
// Dwa rodzaje błędów — do sekcji 3 materiału.
// Uruchom przez http://localhost/srodowisko/bledy.php
echo 'Start<br>';
echo 'Koszt: ' . cena('przeglad') . '<br>';
echo 'Koniec';
```

!!! example "Przewiduj"

    1. Co zobaczysz na stronie po uruchomieniu tego pliku? Czy pojawi się
       słowo „Start”? A „Koniec”?
    2. Teraz usuwasz średnik na końcu wiersza 4 (`echo 'Start<br>'`). Co
       zobaczysz tym razem?

    ??? success "Przewiduj, potem sprawdź wynik"

        1. Najpierw **Start**, a pod nim:

            ```text
            Fatal error: Uncaught Error: Call to undefined function cena()
            in C:\xampp\htdocs\srodowisko\bledy.php:5
            ```

            To **błąd wykonania**. Tłumaczenie przeszło, wiersz 4 wykonał
            się normalnie, a program zatrzymał się dopiero w wierszu 5.
            „Koniec” się nie pojawi.

        2. **Nic poza komunikatem** — nawet „Start”:

            ```text
            Parse error: syntax error, unexpected token "echo", expecting "," or ";"
            in C:\xampp\htdocs\srodowisko\bledy.php on line 5
            ```

            To **błąd składni**. PHP nie przetłumaczył pliku, więc nie
            wykonał z niego ani jednej instrukcji. Średnika zabrakło
            w wierszu 4, a PHP wskazuje 5 — tam trafił na coś, czego się nie
            spodziewał.

!!! tip "Sprawdzenie składni bez uruchamiania: `php -l`"

    Interpreter PHP potrafi wykonać **sam etap tłumaczenia** — sprawdzić
    składnię i nie uruchamiać skryptu. W terminalu VS Code (++ctrl+grave++)
    wpisz:

    ```text
    C:\xampp\php\php.exe -l wycena.php
    ```

    Poprawny plik da odpowiedź `No syntax errors detected in wycena.php`.
    Błędów wykonania i błędów logicznych `php -l` nie znajdzie — do nich
    trzeba program uruchomić.

W JavaScripcie jest tak samo: błąd składni (`SyntaxError`) zatrzymuje cały
skrypt przed pierwszą instrukcją, a błąd wykonania (na przykład
`ReferenceError: … is not defined`) — dopiero w wierszu, do którego program
doszedł. Jedna różnica zaskakuje: **sam brak średnika w JavaScripcie zwykle
nie jest błędem**, bo silnik wstawia go automatycznie. W PHP brak średnika
kończy się komunikatem `Parse error` — z jednym wyjątkiem: tuż przed
znacznikiem `?>` średnik można pominąć, bo znacznik sam kończy instrukcję.

!!! quote "Zasada, którą warto zapamiętać"

    Błąd składni pokaże ci translator. Błąd wykonania — uruchomienie.
    Błędu logicznego nie pokaże nikt, dopóki go nie poszukasz: testami
    i debuggerem.

---

## 4. Edytor, edytor kodu, IDE

| Rodzaj | Co potrafi | Przykłady |
| --- | --- | --- |
| **Edytor tekstu** | zapisuje czysty tekst — i nic więcej | Notatnik |
| **Edytor kodu** | podświetla składnię, podpowiada, domyka nawiasy, formatuje; rozszerzenia dodają kolejne funkcje | VS Code, Notepad++, Sublime Text |
| **IDE** | edytor, uruchamianie, debugger, zarządzanie projektem i testami w jednym programie | PhpStorm, WebStorm, Visual Studio, NetBeans |

VS Code formalnie jest edytorem kodu, ale z rozszerzeniami działa jak lekkie
IDE — dlatego według ankiet od lat jest najczęściej używanym edytorem wśród
programistów. Środowiska JetBrains są płatne; WebStorm jest bezpłatny do
użytku niekomercyjnego, a uczniowie i studenci mogą dostać bezpłatną licencję
edukacyjną na wszystkie.

Na egzaminie INF.03 stanowisko ma edytor kodu **bez funkcji WYSIWYG**, na
przykład Notepad++, Visual Studio Code albo Sublime Text, pakiet XAMPP
i przeglądarki. Pracujesz tym, co jest — dlatego warto umieć więcej niż jedno
narzędzie i nie uzależniać się od jednego rozszerzenia.

### VS Code w pracowni — ustawienia dla PHP i JavaScriptu

VS Code sam z siebie rozumie JavaScript: podpowiada nazwy, pokazuje parametry
funkcji i przeskakuje do definicji. PHP rozumie słabiej — trzeba mu wskazać
interpreter. Otwórz ustawienia: ++ctrl+comma++ → ikona **Open Settings (JSON)**
w prawym górnym rogu, i dopisz:

```json
"php.validate.executablePath": "C:\\xampp\\php\\php.exe"
```

Wiersz wpisujesz **wewnątrz** nawiasów `{ }` pliku; jeśli przed nim jest już
inne ustawienie, oddziel je przecinkiem.

Od tej chwili VS Code w tle wykonuje to samo co `php -l` i **podkreśla błędy
składni PHP w trakcie pisania**.

| Funkcja | Skrót | Do czego |
| --- | --- | --- |
| Podpowiedzi (IntelliSense) | ++ctrl+space++ | nazwy funkcji, zmiennych i ich parametry |
| Emmet | skrót, potem ++tab++ | szkielet HTML: `!` → cały dokument |
| Formatowanie dokumentu | ++shift+alt+f++ | porządkuje wcięcia |
| Przejdź do definicji | ++f12++ | skacze do miejsca, gdzie funkcję zdefiniowano |
| Zmień nazwę wszędzie | ++f2++ | zmienia nazwę zmiennej we wszystkich miejscach naraz |
| Terminal | ++ctrl+grave++ | wiersz poleceń w katalogu projektu |
| Komentarz | ++ctrl+slash++ | zakomentowuje zaznaczone wiersze |

Przydatne rozszerzenia, jeśli w pracowni wolno je instalować: **PHP
Intelephense** (podpowiedzi PHP i przechodzenie do definicji między plikami)
oraz **PHP Debug** (współpraca z debuggerem Xdebug).

!!! example "Przewiduj"

    Po ustawieniu `php.validate.executablePath` otwierasz **niepoprawiony**
    `wycena.php` z paczki (jeśli już go poprawiłeś, usuń średnik z końca
    wiersza 8). Który wiersz podkreśli VS Code na czerwono?

    ??? success "Przewiduj, potem sprawdź wynik"

        Wiersz **10** — ten z `if`, dokładnie ten sam, który wskazuje
        `php -l`. VS Code nie ma własnego „sprawdzacza PHP”, tylko wywołuje
        interpreter. Średnika brakuje wiersz wyżej, na końcu wiersza 8.

!!! warning "Asystent AI w edytorze to też narzędzie — ale kod oddajesz ty"

    Edytory podpowiadają dziś całe fragmenty programu. Wolno z nich
    korzystać, ale oddajesz tylko to, co rozumiesz i potrafisz uzasadnić —
    tak jak przy każdej innej pomocy.

---

## 5. Debugger — program w zwolnionym tempie

Błędu logicznego nie zgłosi żaden translator. Program działa, a wynik jest zły.
Możesz wtedy zgadywać i dopisywać `console.log` w dziesięciu miejscach —
albo **zatrzymać program** i zajrzeć do środka.

| Pojęcie | Co oznacza |
| --- | --- |
| **Punkt przerwania** (*breakpoint*, pułapka) | wiersz, na którym program się zatrzyma, **zanim** go wykona |
| **Krok przez** (*step over*) ++f10++ | wykonaj bieżący wiersz i zatrzymaj się na następnym |
| **Krok do** (*step into*) ++f11++ | jeśli w wierszu jest wywołanie funkcji — wejdź do jej wnętrza |
| **Wyjdź z funkcji** (*step out*) ++shift+f11++ | dokończ bieżącą funkcję i zatrzymaj się po powrocie |
| **Wznów** (*resume*) ++f8++ | działaj dalej, do następnego punktu przerwania |
| **Zakres** (*Scope*) | aktualne wartości zmiennych |
| **Obserwowane wyrażenia** (*Watch*) | dowolne wyrażenie liczone na bieżąco, np. `razem > 400` |
| **Stos wywołań** (*Call Stack*) | która funkcja wywołała bieżącą |

### Debugger JavaScriptu w przeglądarce

Przeglądarka ma wbudowany debugger — ten sam, z którego korzystają zawodowi
programiści.

1. Otwórz `http://localhost/srodowisko/` i naciśnij ++f12++.
2. Zakładka **Źródła** (*Sources*) → w drzewie po lewej `js/wycena.js`.
3. Kliknij **numer wiersza 20** (`let razem = …`). Pojawi się niebieski znacznik —
   to punkt przerwania.
4. Na stronie wybierz *Przegląd podstawowy*, wpisz **5** rowerów i kliknij
   *Oblicz w przeglądarce*. Strona „zamarznie”, a wiersz 20 podświetli się.
5. W panelu **Zakres** (*Scope*) odczytaj `usluga`, `rowery`, `ekspres`.
6. Naciskaj ++f10++ i obserwuj, które wiersze się wykonują i jak zmienia się
   `razem`.

!!! example "Przewiduj"

    Program stoi na wierszu 20. Dane: przegląd, 5 rowerów, bez trybu
    ekspresowego. Rabat przysługuje **od 5 rowerów**. Jaką wartość będzie
    miało `razem` po wykonaniu wiersza 20? Czy przy kolejnych naciśnięciach
    ++f10++ program wejdzie do wiersza 22, w którym liczony jest rabat?

    ??? success "Przewiduj, potem sprawdź wynik"

        `razem` = **450**. Pierwsze ++f10++ przenosi na wiersz 21 z warunkiem,
        a drugie — **od razu na wiersz 24**: do wiersza 22 program nie wchodzi. Warunek `rowery > PROG_RABATU` to `5 > 5`, czyli
        fałsz. To pierwszy błąd logiczny w tym pliku: miało być `>=`. Dwa
        kolejne znajdziesz w ćwiczeniu 4.

Punkt przerwania można też wpisać w kod instrukcją `debugger;` — przy
otwartych narzędziach deweloperskich program zatrzyma się w tym miejscu.
Prawy przycisk myszy na numerze wiersza daje **pułapkę warunkową**: program
zatrzyma się tylko wtedy, gdy warunek jest spełniony, np. `rowery >= 5`.

### A PHP?

PHP wykonuje się na serwerze, więc debugger przeglądarki go nie widzi.

- **Komunikaty o błędach** — na komputerze programisty włączone
  (`display_errors = On` w `php.ini`), na serwerze produkcyjnym wyłączone:
  zdradzałyby ścieżki i fragmenty kodu. Tam błędy trafiają do dziennika
  (pliku wskazanego w ustawieniu `error_log`).
- **`var_dump($zmienna)`** — wypisuje typ i wartość zmiennej. Najprostszy
  „debugger” PHP: `var_dump($_GET);` pokaże dokładnie, co przyszło
  z formularza.
- **Xdebug** — prawdziwy debugger PHP. Po zainstalowaniu go w XAMPP-ie
  i dodaniu rozszerzenia *PHP Debug* do VS Code ustawiasz punkty przerwania
  w pliku `.php` tak samo jak w przeglądarce.

---

## 6. XAMPP — środowisko uruchomieniowe

**Środowisko programistyczne** służy do pisania programu. **Środowisko
uruchomieniowe** to wszystko, czego program potrzebuje, żeby działać. Dla
JavaScriptu jest nim przeglądarka. Dla aplikacji w PHP — serwer:

| Składnik XAMPP-a | Rola | Port |
| --- | --- | :---: |
| **Apache** | serwer WWW: przyjmuje żądania HTTP, pliki `.php` przekazuje do PHP | 80 (HTTP), 443 (HTTPS) |
| **PHP** | interpreter: wykonuje skrypty i oddaje wynik Apache'owi | — |
| **MariaDB** (w panelu opisana jako *MySQL*) | serwer baz danych | 3306 |
| **phpMyAdmin** | aplikacja w PHP do obsługi bazy przez przeglądarkę: `http://localhost/phpmyadmin/` | — |

Konfiguracja jest zapisana w dwóch plikach, które otworzysz przyciskiem **Config**
w XAMPP Control Panel:

- **`httpd.conf`** — ustawienia Apache'a, w tym port (`Listen 80`);
- **`php.ini`** — ustawienia PHP, w tym `display_errors` i limity (np. rozmiar
  wysyłanych plików).

Po zmianie któregokolwiek z nich **Apache trzeba zatrzymać i uruchomić
ponownie** — pliki konfiguracji są czytane tylko przy starcie.

!!! warning "Wersja PHP w pracowni to nie to samo co na hostingu"

    Pakiet XAMPP dla Windows w wersji 8.2.12 zawiera PHP 8.2. Ta wersja
    dostaje od twórców PHP już tylko poprawki bezpieczeństwa, do końca 2026 r.
    Firmy hostingowe oferują nowsze wydania: 8.3, 8.4 i 8.5. Zanim
    opublikujesz aplikację, sprawdź wersję na serwerze — `phpversion()` albo
    strona `phpinfo()`.

### Najczęstsza awaria: zajęty port 80

Apache nie startuje, a w dzienniku panelu widać komunikat o **porcie 80
zajętym** przez inny program. Na jednym porcie może nasłuchiwać tylko jeden
program.

1. Przycisk **Netstat** w panelu pokaże, kto zajął port.
2. Jeśli tego programu nie można wyłączyć: **Config → Apache (httpd.conf)**,
   zmień `Listen 80` na `Listen 8080` i zapisz.
3. Uruchom Apache ponownie. Adres ma teraz postać `http://localhost:8080/…` —
   także phpMyAdmin: `http://localhost:8080/phpmyadmin/`.

Te same programy często zajmują też port **443** (HTTPS). Jeśli Apache nadal
nie startuje, zmień w **Config → Apache (httpd-ssl.conf)** wiersz `Listen 443`
na przykład na `Listen 4433`.

!!! danger "Nie zostawiaj `phpinfo()` na serwerze produkcyjnym"

    Strona `phpinfo()` pokazuje wersje, ścieżki i ustawienia serwera — to
    gotowa ściąga dla atakującego. Na własnym komputerze to przydatne
    narzędzie, na hostingu plik trzeba usunąć zaraz po sprawdzeniu.

---

## 7. Dobór środowiska do zadania

Nie ma jednego „najlepszego” narzędzia. Jest takie, które pasuje do zadania.

| Sytuacja | Co wybierasz | Dlaczego |
| --- | --- | --- |
| Egzamin INF.03 | edytor kodu ze stanowiska, XAMPP, przeglądarka | nic innego nie ma; liczy się szybkość w podstawowych narzędziach |
| Nauka i drobne projekty | VS Code + XAMPP + narzędzia deweloperskie przeglądarki | bezpłatne, lekkie, jeden edytor do HTML, CSS, JS i PHP |
| Duża aplikacja w PHP pisana przez zespół | IDE (np. PhpStorm) albo VS Code z rozszerzeniami, Xdebug, system kontroli wersji Git | przechodzenie między setkami plików, debugowanie, wspólna historia zmian |
| Szybka poprawka pliku na serwerze bez okienek | edytor terminalowy (nano, vim) przez SSH | serwer nie ma środowiska graficznego |
| Program w C lub C++ | kompilator (gcc, clang albo Microsoft C/C++) i IDE, np. Visual Studio | język kompilowany wymaga kompilatora i linkera |

!!! quote "Zasada, którą warto zapamiętać"

    Narzędzie wybierasz do zadania, a nie z przyzwyczajenia. Ale
    podstawowe — edytor, konsola przeglądarki, komunikaty PHP — musisz znać
    tak dobrze, żeby nie myśleć o nich w czasie pracy.

---

## 8. Najczęstsze kłopoty

| Objaw | Przyczyna | Co zrobić |
| --- | --- | --- |
| `Parse error … on line 10`, a wiersz 10 wygląda dobrze | brak średnika albo nawiasu **wyżej** | szukaj w górę, do najbliższego wiersza z kodem |
| `Failed opening required 'cenik.php'` | literówka w nazwie dołączanego pliku albo plik w innym katalogu | porównaj nazwę z nazwą na dysku, litera po literze |
| `Call to undefined function …` | funkcja nazywa się inaczej albo plik z nią nie został dołączony | ++f12++ w VS Code (przejdź do definicji) albo wyszukiwanie ++ctrl+shift+f++ |
| VS Code nie podkreśla błędów PHP | brak ścieżki do interpretera | ustawienie `php.validate.executablePath` |
| Punkt przerwania ustawiony, a program się nie zatrzymuje | narzędzia deweloperskie zamknięte albo kliknięty inny przycisk niż ten z pułapką | ++f12++ przed kliknięciem; sprawdź, czy wiersz w ogóle się wykonuje |
| Apache nie startuje | port 80 zajęty | **Netstat**, potem `Listen 8080` w `httpd.conf` |
| Zmiana w `php.ini` nic nie zmienia | Apache nie został uruchomiony ponownie albo edytujesz inny plik | Stop → Start; ścieżkę pliku podaje `phpinfo()` w wierszu *Loaded Configuration File* |

---

## Ćwiczenia

Pobierz paczkę i **rozpakuj katalog `srodowisko` do `C:\xampp\htdocs\`** — ma
powstać `C:\xampp\htdocs\srodowisko\index.html`. Otwórz ten katalog w VS Code:
**File → Open Folder** (w polskiej wersji: **Plik → Otwórz folder**).

[:material-folder-zip: Środowisko — paczka startowa (.zip)](../pliki/srodowisko-start.zip){ .md-button .md-button--primary download="srodowisko-start.zip" }

Cennik jest ten sam co w wycenie naprawy, doszedł rabat: **od 5 rowerów
10% mniej za usługi**. Dopłata za tryb ekspresowy — 30 zł do zamówienia —
rabatowi nie podlega. Poprawna aplikacja liczy tak:

| Usługa | Rowery | Ekspres | Oczekiwany wynik |
| --- | :---: | :---: | :---: |
| Przegląd podstawowy | 3 | tak | 300 zł |
| Przegląd podstawowy | 5 | nie | 405 zł |
| Centrowanie koła | 4 | nie | 180 zł |
| Serwis amortyzatora | 5 | tak | 1020 zł |
| Wymiana łańcucha | 6 | nie | 324 zł |

### :material-console: Ćwiczenie 1 — taśma

Na taśmie z sekcji 2 sprawdź wszystkie trzy języki i wszystkie trzy rodzaje
błędów. **Najpierw przewiduj**, potem odsłaniaj. Zapisz w karcie pracy, na
którym etapie wychodzi każdy błąd, i zaznacz, gdzie przewidziałeś źle.

### :material-console: Ćwiczenie 2 — trzy błędy w `wycena.php`

1. Otwórz `http://localhost/srodowisko/wycena.php?usluga=przeglad&rowery=5`.
   Przepisz komunikat, numer wiersza, który podał PHP, i wiersz, w którym
   naprawdę jest błąd.
2. Popraw błąd i odśwież stronę. Powtarzaj, aż zobaczysz wynik **405 zł**.
   Przy każdym błędzie zanotuj: czy był to błąd składni, czy wykonania?
3. Przed poprawką każdego błędu uruchom w terminalu
   `C:\xampp\php\php.exe -l wycena.php`. Przy którym błędzie `php -l`
   pomógł, a przy których milczał — i dlaczego?

??? tip "Podpowiedź 1"

    Błędy są trzy i wychodzą **po kolei**: dopóki jest błąd składni, PHP nie
    wykona niczego, więc dwóch pozostałych jeszcze nie widać. Po każdej
    poprawce odśwież stronę i czytaj nowy komunikat.

??? tip "Podpowiedź 2"

    Pierwszy komunikat wskazuje wiersz 10 — szukaj w górę. Drugi dotyczy
    pliku, który `wycena.php` dołącza: porównaj nazwę z listą plików
    w katalogu. Trzeci mówi o funkcji — zajrzyj do `cennik.php`, jak
    naprawdę się nazywa.

??? tip "Podpowiedź 3"

    Poprawki: średnik na końcu wiersza 8 (`isset($_GET['ekspres']);`),
    `require 'cennik.php';` w wierszu 4, a w wierszu 13 `rabat(…)` zamiast
    `policz_rabat(…)`. `php -l` znalazł tylko pierwszy błąd — pozostałe dwa
    są błędami wykonania, a `php -l` niczego nie wykonuje.

### :material-console: Ćwiczenie 3 — VS Code dla PHP

1. Ustaw `php.validate.executablePath` tak jak w sekcji 4. Wstaw celowo błąd
   składni w `cennik.php` i sprawdź, czy VS Code go podkreśla. Usuń błąd.
2. W `wycena.php` napisz w nowym wierszu `str` i naciśnij ++ctrl+space++.
   Zapisz trzy funkcje, które zaproponował edytor — i usuń ten wiersz.
3. Utwórz plik `test.html`, wpisz `!` i naciśnij ++tab++. Potem rozstaw kod
   krzywo i użyj ++shift+alt+f++.
4. W `js/wycena.js` postaw kursor na `PROG_RABATU` w wierszu 21 i naciśnij
   ++f12++, a potem ++f2++ — i zmień nazwę na `PROG`. W ilu miejscach
   zmieniła się nazwa? Cofnij zmianę (++ctrl+z++).

### :material-console: Ćwiczenie 4 — debugger: trzy błędy logiczne

Skrypt `js/wycena.js` nie zgłasza żadnego błędu, a mimo to przy części danych
liczy źle. Sprawdź go pięcioma przypadkami z tabeli powyżej, przyciskiem
*Oblicz w przeglądarce*. Potem debuggerem znajdź **trzy** błędy logiczne —
pierwszy znasz już z sekcji 5:

- przy każdym zapisz wiersz, dane, przy których błąd wychodzi, i wartości
  zmiennych w chwili zatrzymania;
- popraw błąd w VS Code, odśwież stronę (++ctrl+f5++) i sprawdź ponownie
  **wszystkie pięć** przypadków — poprawka jednego błędu potrafi odsłonić
  następny.

??? tip "Podpowiedź 1"

    Który przypadek z tabeli wychodzi dobrze? Który źle? Porównaj: błędne
    wyniki mają coś wspólnego — rabat albo tryb ekspresowy. Pułapka na
    wierszu 20 i krokowanie ++f10++ pokażą, które wiersze się wykonują,
    a które program omija.

??? tip "Podpowiedź 2"

    Przy trybie ekspresowym spójrz w panelu **Zakres** na wartość zmiennej
    `ekspres` — i porównaj ją z tym, z czym jest porównywana w wierszu 24.
    Przy rabacie policz na kartce: sześć łańcuchów to 360 zł, a
    `360 * 10 / 100` daje 36. Czy 36 zł to cena **po** rabacie, czy sam
    rabat?

??? tip "Podpowiedź 3"

    Poprawki: wiersz 21 — `rowery >= PROG_RABATU`; wiersz 22 —
    `razem * (100 - RABAT_PROCENT) / 100`; wiersz 24 — `if (ekspres)`.
    Właściwość `checked` zwraca `true` albo `false`, a nie tekst `"tak"` —
    `"tak"` to wartość atrybutu `value`, która trafia na serwer.

### :material-console: Ćwiczenie 5 — co ma w środku twój XAMPP

1. Otwórz `http://localhost/srodowisko/info.php`. Odczytaj: wersję PHP,
   ścieżkę w wierszu *Loaded Configuration File* i wartość `display_errors`.
2. **Config → Apache (httpd.conf)**. Znajdź wiersz `Listen` i zapisz port.
   Niczego nie zmieniaj.
3. Uruchom moduł **MySQL** i otwórz `http://localhost/phpmyadmin/`. Odczytaj
   wersję serwera bazy danych — i sprawdź, czy to MySQL, czy MariaDB.
4. Kliknij **Netstat** w panelu i zapisz, jakie programy nasłuchują na
   portach 80 i 3306.

### :material-console: Ćwiczenie 6 — dobierz środowisko

:material-plus-circle: **rozszerzenie**

Dla każdej sytuacji wybierz narzędzia i uzasadnij wybór jednym, dwoma
zdaniami:

1. Kolega ma w domu stary laptop i chce ćwiczyć zadania egzaminacyjne INF.03.
2. Firma zamawia sklep internetowy w PHP, pisany przez trzy osoby przez pół roku.
3. Aplikacja na hostingu nagle pokazuje białą stronę zamiast wyniku. Masz
   dostęp tylko przez SSH.

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła.**

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Które narzędzie łączy pliki obiektowe (.o, .obj) i biblioteki w jeden plik wykonywalny?",
  "opcje": ["Kompilator", "Linker", "Debugger", "Interpreter"],
  "poprawna": 1,
  "wyjasnienie": "Kompilator tłumaczy każdy plik osobno. Linker (konsolidator) składa przetłumaczone części i biblioteki w jeden program i wpisuje adresy funkcji z innych plików."
 },
 {
  "pytanie": "Czym kompilator różni się od interpretera?",
  "opcje": ["Kompilator działa tylko w Windows", "Kompilator tłumaczy cały program przed uruchomieniem i tworzy plik wykonywalny; interpreter tłumaczy program przy każdym uruchomieniu, w trakcie działania", "Interpreter tworzy plik .exe, a kompilator nie", "Nie różnią się — to dwie nazwy tego samego programu"],
  "poprawna": 1,
  "wyjasnienie": "Program skompilowany uruchomisz bez kompilatora. Program interpretowany zawsze potrzebuje interpretera i kodu źródłowego — dlatego na serwerze musi być PHP, a u użytkownika przeglądarka."
 },
 {
  "pytanie": "W pliku PHP brakuje średnika na końcu wiersza 8, w środku bloku kodu (dalej są kolejne instrukcje). Które wiersze tego pliku się wykonają?",
  "opcje": ["Wiersze 1–7", "Wszystkie oprócz wiersza 8", "Żaden", "Wszystkie — PHP sam wstawi średnik"],
  "poprawna": 2,
  "wyjasnienie": "PHP najpierw tłumaczy cały plik. Błąd składni przerywa tłumaczenie, więc nie wykona się żadna instrukcja — nawet te nad błędem."
 },
 {
  "pytanie": "Co zwróci w JavaScripcie wyrażenie 450 / 0?",
  "odpowiedz": ["Infinity"],
  "wyjasnienie": "JavaScript nie zgłasza błędu przy dzieleniu przez zero — zwraca Infinity, a 0 / 0 daje NaN. Program liczy dalej ze złą wartością, więc taki błąd znajdzie tylko test albo debugger."
 },
 {
  "pytanie": "PHP zgłasza „Parse error … on line 10”, a wiersz 10 jest poprawny. Gdzie szukasz?",
  "opcje": ["W wierszu 11 i niżej", "W wierszu 10 i wyżej", "W pliku php.ini", "W konsoli przeglądarki"],
  "poprawna": 1,
  "wyjasnienie": "PHP zgłasza miejsce, w którym trafił na coś niespodziewanego. Przyczyna — brak średnika albo nawiasu — jest zwykle wcześniej, często w poprzednim wierszu z kodem."
 },
 {
  "pytanie": "Program zatrzymał się na punkcie przerwania. Który klawisz w narzędziach deweloperskich wykona bieżący wiersz i zatrzyma program na następnym, bez wchodzenia do wywoływanych funkcji?",
  "opcje": ["F8", "F10", "F11", "F12"],
  "poprawna": 1,
  "wyjasnienie": "F10 to krok przez (step over). F11 wchodzi do wnętrza funkcji, F8 wznawia działanie do następnej pułapki, a F12 otwiera i zamyka narzędzia deweloperskie."
 },
 {
  "pytanie": "Apache w XAMPP-ie nie startuje, bo port 80 zajmuje inny program. Co robisz?",
  "opcje": ["Reinstaluję XAMPP", "Zmieniam w httpd.conf Listen 80 na Listen 8080 i otwieram http://localhost:8080/", "Zmieniam port w php.ini", "Otwieram pliki z dysku przez file:///"],
  "poprawna": 1,
  "wyjasnienie": "Port serwera WWW ustawia plik konfiguracji Apache'a — httpd.conf. Po zmianie Apache trzeba uruchomić ponownie, a numer portu dopisywać do adresu."
 },
 {
  "pytanie": "Który z elementów NIE jest potrzebny, żeby uruchomić gotowy plik wycena.exe skompilowany z języka C?",
  "opcje": ["System operacyjny", "Kompilator", "Procesor zgodny z tym, dla którego skompilowano program", "Żaden z nich nie jest potrzebny"],
  "poprawna": 1,
  "wyjasnienie": "Kompilator pracuje raz, przy budowaniu programu. Gotowy plik wykonywalny działa bez niego — ale tylko na systemie i procesorze, dla których go zbudowano."
 }
]
</script>
</div>

---

## Karta pracy

Z tego tematu oddajesz **kartę pracy** oraz **spakowany katalog
`srodowisko`** z poprawionymi plikami `wycena.php` i `js/wycena.js`. Kartę
wypełniaj w trakcie ćwiczeń — pyta o komunikaty, numery wierszy i wartości
zmiennych, które zobaczysz po drodze.

<div class="kp-podsumowanie" data-karta="srodowisko-programistyczne"></div>

<span id="karta" class="kp-kotwica"></span>

???+ karta "Rozwiń kartę pracy"

    !!! info "Twoje odpowiedzi zostają na twoim komputerze"

        Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
        przycisku. Wyczyszczenie danych przeglądania usunie odpowiedzi — kiedy
        skończysz, pobierz plik.

    <div class="karta-pracy" data-karta="srodowisko-programistyczne"></div>

### Jak ją oddać

1. Katalog `C:\xampp\htdocs\srodowisko` spakuj do `4TI_<numer w dzienniku>_srodowisko.zip`.
2. Pobierz kartę pracy przyciskiem pod formularzem.
3. Oba pliki dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *Środowisko programistyczne — karta pracy*.

---

Poprzedni temat: [Wprowadzenie do programowania aplikacji internetowych](wprowadzenie-programowanie.md).

Następny temat: [Wbudowane typy danych — char, int, float, double i ich specyfikatory](typy-danych.md).
Zobaczysz w nim, dlaczego `450 / 0` daje w JavaScripcie `Infinity` i czemu ceny liczy się w groszach.

!!! info "Materiały uzupełniające"

    - VS Code i PHP (po angielsku): [code.visualstudio.com/docs/languages/php](https://code.visualstudio.com/docs/languages/php)
    - Debugowanie JavaScriptu w Chrome (po angielsku): [developer.chrome.com/docs/devtools/javascript](https://developer.chrome.com/docs/devtools/javascript)
    - Obsługiwane wersje PHP: [php.net/supported-versions.php](https://www.php.net/supported-versions.php)
    - Xdebug — debugger PHP (po angielsku): [xdebug.org/docs](https://xdebug.org/docs/)
    - Compiler Explorer — kod w C i jego tłumaczenie na asembler na żywo: [godbolt.org](https://godbolt.org/)
