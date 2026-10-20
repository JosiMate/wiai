# Deklaracja stałych i zmiennych w odniesieniu do wbudowanych typów danych

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział III. Podstawy programowania — środowisko i dane
    · efekt kształcenia **INF.03.5.2**

    Każdy program pamięta: wynik gracza, zawartość koszyka, imię zalogowanego
    użytkownika, stawkę VAT. Żeby z tej pamięci skorzystać, trzeba ją najpierw
    **zadeklarować** — nadać jej nazwę i powiedzieć, czy wolno ją zmieniać.

    Na poprzednim temacie poznałeś typy danych. Teraz zobaczysz, jak deklaruje
    się z nimi zmienne i stałe w trzech językach: w C typ stoi przy zmiennej,
    w JavaScripcie i PHP — przy wartości. Ta jedna różnica tłumaczy, dlaczego
    w C kompilator wyłapie błąd, który JavaScript przepuści, i dlaczego
    `"5" + 3` daje w JavaScripcie `"53"`, a w PHP `8`.

    ??? abstract "Plan trzech lekcji"

        | Lekcja | Sekcje | Ćwiczenia |
        | :---: | --- | --- |
        | 1 | 1–3: deklaracja, inicjalizacja i przypisanie; deklaracje w C; `let` i `const` w JavaScripcie | 1, 2, 3 |
        | 2 | 4–7: zasięg, nazwy, `const` a tablice i obiekty, typowanie statyczne i dynamiczne | 4, 5, 6 |
        | 3 | 8–12: zmienne i stałe w PHP, żonglowanie typami, porównanie trzech języków, najczęstsze błędy | 7, 8; quiz |

??? rozgrzewka "Na rozgrzewkę — 3 minuty, bez zaglądania"

    Odpowiedz w zeszycie, zanim zaczniesz nowy temat. Odpowiedzi rozwiń
    dopiero wtedy, gdy wszyscy skończą — nie liczą się do oceny.

    1. **Z poprzedniej lekcji.** Jaki typ ma wynik `7 / 2` w JavaScripcie
       (`typeof`), a jaki w PHP (`gettype`)?
    2. **Sprzed kilku tygodni.** Plik `test.php` leży w katalogu
       `C:\xampp\htdocs\szprycha`. Jaki adres wpiszesz w przeglądarce, żeby
       PHP go wykonało?
    3. **Z dawniejszych tematów.** Którym znacznikiem i atrybutem podłączasz do
       strony zewnętrzny plik `skrypt.js`?

    ??? success "Odpowiedzi"

        1. W JavaScripcie `number` (wartość 3.5), w PHP `double` — czyli
           `float`. Dziś zobaczysz, że w obu językach typ ma **wartość**,
           a nie zmienna.
        2. `http://localhost/szprycha/test.php` — przez serwer, nie przez
           `file:///`. Tak samo uruchomisz dziś plik `deklaracje.php`.
        3. `<script src="skrypt.js"></script>`. Z tego korzysta paczka
           do dzisiejszych ćwiczeń.

!!! success "Kryteria sukcesu — sprawdź się na koniec tematu"

    Po tym temacie:

    1. Odróżnię deklarację, inicjalizację i przypisanie i wskażę je w kodzie C, JavaScriptu i PHP.
    2. Zadeklaruję w C zmienną i stałą z typem (`int`, `double`, `char`, `const`) i powiem, czym `const` różni się od `#define`.
    3. Dobiorę w JavaScripcie `let` albo `const` i wyjaśnię, dlaczego nie używa się `var`.
    4. Przewidzę, gdzie zmienna jest widoczna, i odczytam komunikaty `SyntaxError`, `ReferenceError` i `TypeError` przy deklaracjach.
    5. Nadam zmiennej i stałej poprawną, czytelną nazwę według zwyczaju danego języka.
    6. Zadeklaruję w PHP zmienną i stałą (`$`, `define`, `const`) i przewidzę, jak PHP i JavaScript potraktują `"5" + 3`.
    7. Wyjaśnię różnicę między typowaniem statycznym a dynamicznym na przykładzie tej samej informacji zapisanej w C, JavaScripcie i PHP.

---

## 1. Zmienna, stała i trzy słowa na start

**Zmienna** to nazwane miejsce w pamięci, którego zawartość może się
zmieniać — jak szuflada z etykietą. **Stała** to szuflada zamknięta po
pierwszym włożeniu wartości. Program posługuje się nazwą (etykietą), a nie
adresem komórki pamięci.

Przy każdej zmiennej warto odróżniać trzy czynności:

| Czynność | Co się dzieje | C | JavaScript | PHP |
| --- | --- | --- | --- | --- |
| **deklaracja** | powstaje nazwa (i w C — miejsce w pamięci danego typu) | `int punkty;` | `let punkty;` | — (PHP nie ma osobnej deklaracji) |
| **inicjalizacja** | pierwsza wartość, nadana razem z deklaracją | `int punkty = 0;` | `let punkty = 0;` | `$punkty = 0;` |
| **przypisanie** | nowa wartość dla zmiennej, która już istnieje | `punkty = 15;` | `punkty = 15;` | `$punkty = 15;` |

Znak `=` w programowaniu nie znaczy „jest równe”, tylko **„włóż do”**:
`punkty = punkty + 5` czytaj „do `punkty` włóż to, co było w `punkty`,
powiększone o 5”.

!!! quote "Zasada, którą warto zapamiętać"

    Deklaracja tworzy nazwę, przypisanie zmienia wartość. Stałą deklarujesz
    i inicjalizujesz w jednym kroku — potem już tylko ją czytasz.

---

## 2. Deklaracja w C: typ przed nazwą

W C każda zmienna ma typ zapisany przy deklaracji i nie zmienia go do końca
programu. Kompilator już przy deklaracji rezerwuje tyle bajtów, ile potrzebuje
ten typ (temat o typach danych: `char` — 1, `int` — 4, `double` — 8).

```c
int rowery = 2;          /* deklaracja z inicjalizacją */
double cena = 90.0;
char klasa = 'B';
int a, b = 5;            /* dwie zmienne w jednym wierszu; wartość dostaje tylko b */
int raty = 2.9;          /* do int trafi 2 — część ułamkowa zostaje odcięta */
```

Dwie rzeczy zaskakują najczęściej:

- **Zmienna lokalna bez wartości ma w C wartość przypadkową** — to, co
  akurat zostało w tym miejscu pamięci. Kompilator z opcją `-Wall` ostrzeże:
  *'licznik' is used uninitialized*.
- **Liczba z przecinkiem wpisana do `int` traci część ułamkową bez żadnego
  komunikatu** — przy zwykłych ustawieniach kompilatora nawet bez ostrzeżenia.

```c
int licznik;
int suma = 0;
suma = suma + 5;
licznik = licznik + 1;
printf("%d %d\n", suma, licznik);
```

!!! example "Przewiduj"

    Co wypisze pierwsza liczba, a co druga?

    ??? success "Przewiduj, potem sprawdź wynik"

        Pierwsza liczba to zawsze `5`. Druga jest **nieprzewidywalna** — na
        jednym komputerze wyjdzie `1`, na innym `32765` albo jeszcze coś
        innego, bo `licznik` nie dostał wartości początkowej. To dlatego
        w C zmienne inicjalizuje się od razu: `int licznik = 0;`.

### Stałe w C: const i #define

Stałą w C zapiszesz na dwa sposoby:

```c
#define STAWKA_VAT 0.23          /* stała preprocesora */

int main(void)
{
    const int MAX_PROB = 3;      /* zmienna tylko do odczytu */
    /* MAX_PROB = 4; */          /* błąd kompilacji: assignment of read-only variable */
    ...
}
```

| | `const int MAX_PROB = 3;` | `#define STAWKA_VAT 0.23` |
| --- | --- | --- |
| kto to obsługuje | kompilator | preprocesor — przed kompilacją |
| typ | ma (`int`) — kompilator go sprawdza | nie ma — to tylko zamiana tekstu |
| średnik na końcu | tak | **nie** — średnik zostałby wklejony razem z wartością |
| próba zmiany | błąd kompilacji | nie da się — nazwy już nie ma po preprocesorze |

`#define` działa jak „znajdź i zamień”: zanim kompilator zobaczy kod, każde
wystąpienie `STAWKA_VAT` zostaje zamienione na `0.23`.

---

## 3. JavaScript: let, const i (już nie) var

W JavaScripcie przy deklaracji **nie podajesz typu** — typ ma dopiero
wartość, którą włożysz do zmiennej. Słowo kluczowe mówi tylko, czy wolno
zmieniać wartość:

- **`let`** — zmienna; wartość możesz zmieniać dowolnie często,
- **`const`** — stała; wartość dostaje przy deklaracji i nie można przypisać nowej,
- **`var`** — stary sposób sprzed 2015 roku (standard ES6). Spotkasz go
  w starszych skryptach i w internecie, ale w nowym kodzie się go nie używa —
  dlaczego, zobaczysz w sekcji 4.

```javascript
let wynikGracza = 0;
wynikGracza = 15;                 // poprawnie: zmienna dostaje nową wartość

const stawkaVat = 0.23;
// stawkaVat = 0.08;              // TypeError: Assignment to constant variable.
```

```javascript
let wiek;
console.log(wiek);
wiek = 18;
console.log(wiek);

const maxProby = 3;
console.log(maxProby);
```

!!! example "Przewiduj"

    Co wypisze powyższy fragment? I co się stanie, gdy napiszesz `const x;` —
    stałą bez wartości?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        undefined
        18
        3
        ```

        Zmienna `let` bez wartości ma wartość **`undefined`** — nie
        przypadkową jak w C, tylko zawsze tę samą. Stała musi dostać wartość
        od razu: `const x;` kończy się błędem
        `SyntaxError: Missing initializer in const declaration`. W C
        `const int Z;` kompilator przepuści — i zostaniesz ze stałą
        o przypadkowej wartości.

!!! quote "Zasada, którą warto zapamiętać"

    Domyślnie pisz **`const`**. Gdy wartość musi się zmieniać — licznik,
    suma, stan gry — zmień na **`let`**. **`var`** zostaw starym skryptom.

---

## 4. Zasięg: gdzie zmienna „żyje”

**Zasięg** to fragment programu, w którym nazwa jest widoczna. Zmienne `let`
i `const` mają **zasięg blokowy** — żyją tylko między nawiasami klamrowymi
`{ }`, w których je zadeklarowano. Zmienna `var` nawiasów bloku nie zauważa
i „wycieka” na zewnątrz.

```javascript
let rabat = 0;
if (true) {
    let rabat = 10;
    var dodatek = 5;
    console.log("w bloku:", rabat);
}
console.log("po bloku:", rabat, dodatek);
```

!!! example "Przewiduj"

    Ile wynosi `rabat` w bloku, a ile po nim? Czy `dodatek` istnieje po
    zamknięciu nawiasu?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        w bloku: 10
        po bloku: 0 5
        ```

        W bloku powstała **druga, osobna** zmienna `rabat` — przesłoniła
        tę z zewnątrz tylko do nawiasu zamykającego. `dodatek`, zadeklarowany
        przez `var`, przeżył blok — a to, że zmienna z wnętrza `if` jest
        widoczna w całym skrypcie, prowadzi do trudnych do wykrycia błędów.

Trzy błędy, które pojawiają się przy deklaracjach najczęściej:

| Kod | Komunikat w konsoli | Co znaczy |
| --- | --- | --- |
| `let x = 1;` … `let x = 2;` | `SyntaxError: Identifier 'x' has already been declared` | druga deklaracja tej samej nazwy w tym samym bloku; `var` by ją przepuścił — po cichu |
| `console.log(y);` … `let y = 5;` | `ReferenceError: Cannot access 'y' before initialization` | użycie zmiennej `let`/`const` przed wierszem deklaracji |
| `console.log(z);` (brak deklaracji) | `ReferenceError: z is not defined` | literówka albo zmienna z innego bloku |

Błąd `SyntaxError` przeglądarka wykrywa, zanim uruchomi skrypt — wtedy nie
wykona się z niego **ani jeden wiersz**. Błąd `ReferenceError` i `TypeError`
zatrzymuje skrypt dopiero w miejscu błędu.

---

## 5. Nazwy zmiennych i stałych

Nazwa zmiennej to **identyfikator**. Reguły są w trzech językach prawie
takie same — a ich złamanie daje błąd składni:

1. litery, cyfry i znak `_` (w JavaScripcie i PHP także `$`),
2. **nie na początku cyfra**: `miejsce1` tak, `1miejsce` nie,
3. **nie słowo kluczowe** języka: `int`, `class`, `const`, `if`, `return`…,
4. **wielkość liter ma znaczenie**: `punkty`, `Punkty` i `PUNKTY` to trzy różne nazwy.

Polskie litery JavaScript i PHP przyjmą (`let żółw = 1;` działa), ale się
ich unika — wystarczy jeden plik zapisany w innym kodowaniu i nazwa przestaje
się zgadzać.

Poza regułami są **zwyczaje** — kod działa i bez nich, ale czyta go się
znacznie gorzej:

| Język | Zmienne | Stałe | Przykład |
| --- | --- | --- | --- |
| C | małe litery z `_` (`snake_case`) | WIELKIE z `_` | `int liczba_rowerow;` `#define STAWKA_VAT 0.23` |
| JavaScript | **`camelCase`**: pierwsze słowo małą literą, każde kolejne wielką | `camelCase` albo WIELKIE z `_` dla ustawień znanych z góry | `let liczbaRowerow;` `const STAWKA_VAT = 0.23;` |
| PHP | `$camelCase` albo `$snake_case` — byle jednolicie w całym projekcie | WIELKIE z `_` | `$liczbaRowerow` `const STAWKA_VAT = 0.23;` |

| Słaba nazwa | Lepsza | Dlaczego |
| --- | --- | --- |
| `x`, `zmienna1` | `cenaBrutto`, `imieKlienta` | nazwa ma mówić, co przechowuje |
| `uzytkownikzalogowany` | `uzytkownikZalogowany` | bez wyróżnienia słów trudno czytać |
| `liczba_punktow` (w JS) | `liczbaPunktow` | w JavaScripcie przyjęło się `camelCase` |
| `czy` | `czyZaplacono` | wartość logiczna — nazwa jak pytanie „tak/nie” |

---

## 6. Stała to nie zawsze „niezmienne”: const, tablice i obiekty

`const` w JavaScripcie zabrania **przypisania nowej wartości do nazwy**.
Nie zabrania zmiany **wnętrza** tablicy albo obiektu, na które nazwa
wskazuje.

```javascript
const rower = { marka: "Kross", przebieg: 1200 };
rower.przebieg = 1350;
console.log(rower.przebieg);
rower = { marka: "Romet" };
```

!!! example "Przewiduj"

    Który wiersz zgłosi błąd: zmiana przebiegu czy podstawienie nowego roweru?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        1350
        TypeError: Assignment to constant variable.
        ```

        Zmiana pola obiektu przeszła — to wciąż **ten sam** rower, tylko
        z nowym przebiegiem. Błąd dał dopiero wiersz, który próbował włożyć
        do stałej **inny** obiekt. Tak samo `koszyk.push("łańcuch")` działa na
        stałej tablicy `koszyk` — sprawdzisz to w ćwiczeniu 3.

Jeśli wnętrze obiektu też ma być nietykalne, służy do tego
`Object.freeze(obiekt)` — wtedy próba zmiany pola zostaje po cichu
zignorowana.

---

## 7. Typowanie statyczne i dynamiczne

| | **Typowanie statyczne** — C | **Typowanie dynamiczne** — JavaScript, PHP |
| --- | --- | --- |
| gdzie jest typ | przy **zmiennej**, od deklaracji | przy **wartości** |
| czy zmienna może zmienić typ | nie | tak — przy każdym przypisaniu |
| kiedy wychodzi błąd typu | często już przy kompilacji | dopiero przy uruchomieniu — albo wcale, tylko wynik jest zły |

```javascript
let dana = 100;
console.log(typeof dana);
dana = "Sto złotych";
console.log(typeof dana);
dana = true;
console.log(typeof dana);
```

!!! example "Przewiduj"

    Jakie trzy typy wypisze konsola? Czy JavaScript zgłosi błąd przy drugim
    przypisaniu?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        number
        string
        boolean
        ```

        Bez żadnego błędu — zmienna `dana` za każdym razem dostaje wartość
        innego typu. W C po `int dana = 100;` przypisanie `dana = "Sto";`
        kompilator odrzuci albo przynajmniej ostrzeże, bo tekst nie jest
        liczbą całkowitą.

Elastyczność ma swoją cenę. Wartość z pola formularza jest **zawsze tekstem**,
nawet gdy użytkownik wpisał cyfry. JavaScript niczego nie zgłosi —
po prostu sklei teksty:

```javascript
const cena = "50";          // z pola formularza
const dostawa = 10;
console.log(cena + dostawa);           // 5010
console.log(Number(cena) + dostawa);   // 60
```

Przed liczeniem zamień tekst na liczbę: `Number("50")` daje `50`,
a `Number("abc")` — `NaN` (*not a number*). Czy wynik jest liczbą, sprawdzisz
funkcją `Number.isNaN(wartosc)`.

---

## 8. PHP: zmienna z dolarem, bez deklaracji

W PHP nazwa zmiennej zaczyna się od `$`, a osobnej deklaracji nie ma:
**zmienna powstaje przy pierwszym przypisaniu**. Typ, jak w JavaScripcie,
ma wartość.

```php
<?php
$cenaPrzegladu = 90;          // int
$nazwa = "Szprycha";          // string
$czyRabat = true;             // bool
$cenaPrzegladu = 85.5;        // ta sama zmienna, teraz float
```

Wielkość liter ma znaczenie: `$cena` i `$Cena` to dwie różne zmienne.

Co się stanie, gdy użyjesz zmiennej, której nie ma — na przykład przez
literówkę?

```php
<?php
$cenaPrzegladu = 90;
echo $cenaPrzegladow;
```

PHP 8 wyświetli ostrzeżenie **`Warning: Undefined variable $cenaPrzegladow`**,
potraktuje zmienną jak `null` i… pojedzie dalej. Skrypt się nie zatrzyma,
tylko w miejscu ceny pojawi się pusto. Dlatego czytaj ostrzeżenia — w XAMPP-ie
widać je na stronie.

Gdy nie masz pewności, czy zmienna istnieje, użyj:

- `isset($x)` — `true`, gdy zmienna istnieje i nie jest `null`,
- `$x ?? 'wartość domyślna'` — wartość zmiennej albo domyślna, bez ostrzeżenia.

---

## 9. Stałe w PHP: define i const

Stała w PHP **nie ma dolara**, a nazwę pisze się wielkimi literami.

```php
<?php
define('NAZWA_SERWISU', 'Szprycha');   // funkcja define(nazwa, wartość)
const STAWKA_VAT = 0.23;               // słowo kluczowe const

echo NAZWA_SERWISU, " — VAT ", STAWKA_VAT * 100, "%";
```

| | `define('X', 1);` | `const X = 1;` |
| --- | --- | --- |
| co to jest | funkcja — działa w czasie wykonania | słowo kluczowe — stała znana od startu skryptu |
| gdzie wolno | wszędzie, także w `if` | na najwyższym poziomie pliku albo w klasie, nie w `if` |
| ponowne zdefiniowanie | `Warning: Constant X already defined`, wartość zostaje stara | to samo ostrzeżenie |

PHP ma też gotowe stałe: `PHP_INT_MAX` (znasz ją z tematu o typach),
`PHP_EOL` (znak końca wiersza), `M_PI` (liczba π).

```php
<?php
const LIMIT = 3;
define('LIMIT', 5);
echo LIMIT, "\n";
echo Limit;
```

!!! example "Przewiduj"

    Co wypisze pierwszy `echo`? Co zrobi drugi — przecież nazwa różni się
    tylko wielkością liter?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        Warning: Constant LIMIT already defined
        3
        Fatal error: Uncaught Error: Undefined constant "Limit"
        ```

        Stałej nie da się zdefiniować drugi raz — `define` tylko ostrzega,
        a `LIMIT` zostaje równe 3. Nazwy stałych rozróżniają wielkość liter,
        a użycie stałej, której nie ma, to w PHP 8 **błąd krytyczny** —
        skrypt się zatrzymuje. Niezdefiniowana zmienna dawała tylko
        ostrzeżenie.

---

## 10. PHP żongluje typami — inaczej niż JavaScript

Oba języki mają typowanie dynamiczne, ale operator `+` rozumieją inaczej:

- w **JavaScripcie** `+` dodaje albo skleja — skleja, gdy choć jedna strona
  jest tekstem,
- w **PHP** `+` zawsze **dodaje**, a do sklejania służy osobny operator:
  **kropka** `.`.

```php
<?php
$x = "5";
var_dump($x + 3);
var_dump($x . 3);
var_dump("2" * "4");
var_dump("12abc" + 1);
```

!!! example "Przewiduj"

    Napisz cztery wyniki razem z typami. Dla porównania: w JavaScripcie
    `"5" + 3` daje `"53"`.

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        int(8)
        string(2) "53"
        int(8)
        Warning: A non-numeric value encountered
        int(13)
        ```

        Tekst, który wygląda jak liczba (`"5"`, `"2"`, `"4"`), PHP przy
        działaniach liczbowych sam zamienia na liczbę. Tekst zaczynający się
        od liczby (`"12abc"`) też — ale z ostrzeżeniem. Tekst bez liczby na
        początku, np. `"abc" + 1`, w PHP 8 kończy się błędem `TypeError`.

Zamiana jawna — lepsza niż zgadywanie, co zrobi PHP:

| Zapis | Wynik | Uwagi |
| --- | --- | --- |
| `(int) "12abc"` | `12` | bierze liczbę z początku tekstu, bez ostrzeżenia |
| `(float) "24.99"` | `24.99` | |
| `(float) "24,99"` | `24.0` | przecinek kończy liczbę — zamień go na kropkę: `str_replace(',', '.', $t)` |
| `intval("42")` | `42` | to samo co `(int)` |
| `is_numeric("24.99")` | `true` | `"24,99"` daje `false` — dobra kontrola danych z formularza |

---

## 11. Jedna informacja — trzy deklaracje

| Informacja | C | JavaScript | PHP |
| --- | --- | --- | --- |
| stawka VAT, stała | `const double STAWKA_VAT = 0.23;` albo `#define STAWKA_VAT 0.23` | `const STAWKA_VAT = 0.23;` | `const STAWKA_VAT = 0.23;` |
| liczba rowerów w zleceniu | `int liczba_rowerow = 2;` | `let liczbaRowerow = 2;` | `$liczbaRowerow = 2;` |
| cena w groszach | `int cena_gr = 2499;` | `let cenaGr = 2499;` | `$cenaGr = 2499;` |
| nazwa serwisu | `const char NAZWA[] = "Szprycha";` | `const nazwaSerwisu = "Szprycha";` | `define('NAZWA_SERWISU', 'Szprycha');` |
| czy zapłacono | `bool zaplacono = false;` (`<stdbool.h>`) | `let czyZaplacono = false;` | `$czyZaplacono = false;` |
| zmienna jeszcze bez wartości | `int kupione;` — wartość przypadkowa | `let kupione;` — `undefined` | (nie ma — zmienna powstaje przy przypisaniu) |

!!! quote "Zasada, którą warto zapamiętać"

    W C typ wybierasz przy deklaracji i kompilator go pilnuje. W JavaScripcie
    i PHP typ przychodzi razem z wartością — więc pilnujesz go ty: sprawdzasz
    `typeof` albo `gettype` i zamieniasz tekst na liczbę, zanim zaczniesz
    liczyć.

---

## 12. Najczęstsze błędy

| Objaw | Przyczyna | Co zrobić |
| --- | --- | --- |
| C: zmienna ma „dziwną” wartość | zmienna lokalna bez inicjalizacji | od razu nadaj wartość: `int licznik = 0;` |
| C: `int raty = 2.9;` daje 2 | liczba z przecinkiem w zmiennej całkowitej | typ `double` albo jawne zaokrąglenie |
| C: dziwny błąd w wierszu z `STAWKA_VAT` | średnik na końcu `#define` | `#define STAWKA_VAT 0.23` — bez średnika |
| JS: `TypeError: Assignment to constant variable` | przypisanie nowej wartości do `const` | `let`, jeśli wartość ma się zmieniać |
| JS: `SyntaxError: Missing initializer in const declaration` | `const` bez wartości | wartość od razu: `const x = 10;` |
| JS: `SyntaxError: Identifier 'x' has already been declared` | drugie `let`/`const` z tą samą nazwą | przy drugim razie samo przypisanie: `x = 2;` |
| JS: `ReferenceError: Cannot access 'x' before initialization` | użycie przed wierszem deklaracji | deklaracja wyżej, przed użyciem |
| JS: `"50" + 10` daje `"5010"` | tekst z formularza | `Number(tekst)` przed liczeniem |
| PHP: `Warning: Undefined variable $x` | literówka albo zmienna niezadeklarowana wcześniej | sprawdź nazwę; `isset($x)` albo `$x ?? 0` |
| PHP: `Error: Undefined constant "X"` | stała zapisana z `$` albo inną wielkością liter, albo niezdefiniowana | stała bez `$`, nazwa co do litery |
| PHP: zamiast tekstu wychodzi liczba albo `TypeError` | sklejanie przez `+` zamiast `.` | do sklejania tekstów kropka: `"Razem: " . $suma` |

---

## Ćwiczenia

Ćwiczenia 1–4 i 7 są dla wszystkich. Ćwiczenia 5 i 8 są na ocenę dobrą,
a 6 — na bardzo dobrą. Ćwiczenia 1, 4 i 8 robisz na kartce albo w karcie
pracy, pozostałe w paczce.

Pobierz paczkę i **rozpakuj katalog `deklaracje` do `C:\xampp\htdocs\`** —
ma powstać `C:\xampp\htdocs\deklaracje\index.html`. Otwórz ten katalog
w VS Code: **File → Open Folder** (w polskiej wersji: **Plik → Otwórz
folder**). Stronę startową otworzysz pod adresem
`http://localhost/deklaracje/`, a wyniki skryptów zobaczysz w konsoli:
++f12++ → **Konsola**.

[:material-folder-zip: Deklaracje — paczka startowa (.zip)](../pliki/deklaracje-start.zip){ .md-button .md-button--primary download="deklaracje-start.zip" }

### :material-console: Ćwiczenie 1 — deklaracje w C

Otwórz w VS Code plik `c/deklaracje.c` z paczki. **Nie uruchamiaj go.**
W karcie pracy:

1. Przy każdym z wierszy z `int rowery`, `int kupione` i `kupione = rowery + 1`
   napisz, czy to deklaracja, deklaracja z inicjalizacją, czy przypisanie.
2. Napisz, co wypiszą trzy wiersze z `printf`.
3. Wyjaśnij, dlaczego `raty` ma taką wartość.
4. Co się stanie, gdy usuniesz komentarz wokół wiersza A? Czym ta sytuacja
   różniłaby się, gdyby zamiast `const int MAX_ROWEROW = 5;` było
   `#define MAX_ROWEROW 5`?

Jeśli chcesz sprawdzić wynik, wklej program do kompilatora online
(np. godbolt.org, przycisk **Execute the code**).

??? tip "Podpowiedź 1"

    Deklaracja z inicjalizacją ma typ **i** znak `=` w tym samym wierszu.
    Przypisanie nie ma typu — zmienna musi już istnieć.

??? tip "Podpowiedź 2"

    `%.2f` to liczba z dwoma miejscami po kropce. 90 · 1,23 = 110,7.
    Do zmiennej typu `int` nie zmieści się część ułamkowa 2,9.

??? tip "Podpowiedź 3"

    Wiersz A: kompilator przerwie pracę z błędem
    `assignment of read-only variable 'MAX_ROWEROW'`. Przy `#define`
    preprocesor zamieniłby wiersz na `5 = 6;` — też błąd, ale z zupełnie
    innym, mniej czytelnym komunikatem.

### :material-console: Ćwiczenie 2 — profil klienta

Otwórz `js/profil.js` i uzupełnij miejsca oznaczone `ZADANIE`:

1. Stałe `nazwaSerwisu` (`"Szprycha"`) i `idUzytkownika` (`1042`).
2. Zmienne `imieUzytkownika`, `wiekUzytkownika`, `czyAktywny` oraz
   `ostatniaWypozyczalnia` — tę ostatnią bez wartości.
3. Wypisz każdą stałą i zmienną razem z typem (`typeof`).

Zapisz plik, odśwież `http://localhost/deklaracje/` i przepisz wyniki do
karty pracy.

??? tip "Podpowiedź 1"

    Stała: `const nazwa = wartość;`. Zmienna: `let nazwa = wartość;`, a bez
    wartości — samo `let nazwa;`.

??? tip "Podpowiedź 2"

    `console.log("wiek:", wiekUzytkownika, typeof wiekUzytkownika);` — trzy
    argumenty oddzielone przecinkami konsola wypisze w jednym wierszu.

??? tip "Podpowiedź 3"

    Zmienna bez wartości: wartość `undefined`, typ `"undefined"`. Liczba
    1042 i wiek mają ten sam typ `number`.

### :material-console: Ćwiczenie 3 — zmienna, stała i stała tablica

Otwórz `js/stala.js`:

1. Zwiększ `punktyLojalnosciowe` o 25 i wypisz nową wartość.
2. Przypisz stałej `maksymalnyRabat` wartość `0.50`, zapisz i odśwież
   stronę. Przepisz do karty **dokładny** komunikat z konsoli, a potem
   zakomentuj ten wiersz (++ctrl+slash++).
3. Dopisz do stałej tablicy `koszyk` element `"łańcuch"` metodą `push`
   i wypisz koszyk. Czy był błąd? Wyjaśnij w karcie, co chroni `const`.

??? tip "Podpowiedź 1"

    `punktyLojalnosciowe = punktyLojalnosciowe + 25;` — bez `let`, bo
    zmienna już istnieje.

??? tip "Podpowiedź 2"

    Błąd przy stałej zaczyna się od `Uncaught TypeError`. Kliknij w nazwę
    pliku po prawej stronie komunikatu — VS Code nie, ale przeglądarka
    pokaże wiersz z błędem.

??? tip "Podpowiedź 3"

    Wróć do sekcji 6: `const` pilnuje nazwy, nie zawartości. Tablica po
    `push` ma 2 elementy, a błędu nie ma.

### :material-console: Ćwiczenie 4 — nazwy i typy

Na kartce albo w karcie pracy oceń każdy identyfikator: poprawny czy błędny,
a jeśli poprawny — czy zgodny ze zwyczajem JavaScriptu. Dla złych podaj
poprawkę:

`1miejsce`, `liczba_punktow`, `uzytkownikZalogowany`, `let class = 4;`

Na koniec odpowiedz: co zwraca `typeof null` i dlaczego?

??? tip "Podpowiedź 1"

    Sprawdź po kolei: czy zaczyna się od cyfry? czy to słowo kluczowe?
    czy słowa są wyróżnione wielką literą?

??? tip "Podpowiedź 2"

    `class` to słowo kluczowe — konsola zgłosi `SyntaxError: Unexpected
    token 'class'`. `liczba_punktow` jest poprawne, ale w JavaScripcie
    nietypowe.

??? tip "Podpowiedź 3"

    `typeof null` daje `"object"` — wróć do tematu o typach danych, sekcja 5.

### :material-console: Ćwiczenie 5 — kalkulator koszyka

:material-plus-circle: **rozszerzenie**

Otwórz `js/koszyk.js`. Ceny są w groszach — tak jak w temacie o typach.

1. Zadeklaruj stałe `STAWKA_VAT = 0.23` i `cenaDetkiGr = 2500` oraz
   zmienną `iloscSztuk = 3`.
2. Oblicz koszt netto i brutto w groszach; brutto zaokrąglij
   `Math.round(...)`. Zdecyduj, które wartości będą `let`, a które `const`.
3. Wypisz komunikat szablonem tekstu (grawis `` ` `` i `${...}`):
   `Zamówiono 3 szt. Netto: 75.00 zł, brutto: 92.25 zł.`
4. Zmień `iloscSztuk` na 5, przelicz i wypisz jeszcze raz.

??? tip "Podpowiedź 1"

    Szablon tekstu zapisujesz grawisem (klawisz pod ++esc++), a wartości
    wstawiasz przez `${nazwa}`. Grosze na złote: `(grosze / 100).toFixed(2)`.

??? tip "Podpowiedź 2"

    Jeśli w zadaniu 4 netto i brutto liczysz drugi raz, muszą być `let` —
    przy `const` dostaniesz `TypeError`. Albo zadeklaruj je od nowa
    pod innymi nazwami.

??? tip "Podpowiedź 3"

    ```javascript
    let nettoGr = cenaDetkiGr * iloscSztuk;
    let bruttoGr = Math.round(nettoGr * (1 + STAWKA_VAT));
    console.log(`Zamówiono ${iloscSztuk} szt. Netto: ${(nettoGr / 100).toFixed(2)} zł, brutto: ${(bruttoGr / 100).toFixed(2)} zł.`);
    ```

    Dla 5 sztuk: netto 125.00 zł, brutto 153.75 zł.

### :material-console: Ćwiczenie 6 — napraw skrypt

:material-star: **dopełnienie**

W `js/naprawa.js` jest pięć błędów związanych z deklaracjami. Konsola
pokazuje zawsze tylko pierwszy, na który trafi. Popraw go, zapisz, odśwież —
i szukaj następnego. Ostatni błąd nie daje żadnego komunikatu: zobaczysz
tylko zły wynik.

Gdy skrypt jest poprawny, wypisze:
`Szprycha: zlecenia 1, do zapłaty 96 zł`.

W karcie pracy dla każdego błędu zapisz: komunikat z konsoli (albo objaw)
i swoją poprawkę.

??? tip "Podpowiedź 1"

    Kolejność komunikatów: `SyntaxError` (dwa razy), `ReferenceError`,
    `TypeError`. Każdy znajdziesz w tabeli w sekcji 12.

??? tip "Podpowiedź 2"

    `cenaPrzegladu` ma się zmienić po rabacie — więc nie może być stałą.
    Wartość `dostawa` jest tekstem.

??? tip "Podpowiedź 3"

    Stała `GODZINA_OTWARCIA` potrzebuje wartości, np. `8`. Drugie
    `let liczbaZlecen` zamień na samo przypisanie. `let rabat` przenieś nad
    `console.log`. Na końcu `Number(dostawa)` — wtedy 81 + 15 = 96.

### :material-console: Ćwiczenie 7 — zmienne i stałe w PHP

Otwórz `deklaracje.php` w VS Code.

1. **Zanim uruchomisz**, zapisz w karcie pracy, jaki typ poda `gettype()`
   dla `$liczbaRowerow` i dla `$netto` po wykonaniu zadania 1.
2. Uzupełnij `ZADANIE 1` i `ZADANIE 2`: zmienną `$netto` (cena przeglądu
   razy liczba rowerów) i stałą `RABAT = 0.1` zadeklarowaną przez `const`,
   odjętą od `$netto`, gdy `$czyRabat` jest prawdą.
3. Otwórz `http://localhost/deklaracje/deklaracje.php` i porównaj typy ze
   swoimi przewidywaniami.
4. `ZADANIE 3` i `4`: odkomentuj po kolei wiersze B i C, przepisz komunikaty
   do karty i przywróć komentarze.

??? tip "Podpowiedź 1"

    Zmienna w PHP: `$netto = $cenaPrzegladu * $liczbaRowerow;`. Stała:
    `const RABAT = 0.1;` — bez dolara, na górze pliku, nie w `if`.

??? tip "Podpowiedź 2"

    `"2"` to tekst, ale wygląda jak liczba — przy mnożeniu PHP sam zrobi
    z niego `2`. Zwróć uwagę, jak zmienia się typ `$netto` przed rabatem
    i po nim.

??? tip "Podpowiedź 3"

    Przed rabatem `$netto` to `int(180)`, po rabacie — `float(162)`, bo
    0,9 jest liczbą zmiennoprzecinkową. Na dole strony: 199,26 zł brutto.

### :material-console: Ćwiczenie 8 — jedna informacja w trzech językach

:material-plus-circle: **rozszerzenie**

W karcie pracy zapisz deklarację każdej informacji w C, JavaScripcie i PHP.
Zdecyduj, czy to zmienna, czy stała, dobierz typ w C i nazwę według zwyczaju
języka:

1. maksymalna liczba rowerów, które serwis przyjmuje dziennie — 12,
2. liczba rowerów przyjętych dziś — na razie 0,
3. cena wymiany łańcucha — 45,00 zł (pamiętaj o groszach),
4. czy klient zgodził się na SMS-y — tak,
5. kod pocztowy serwisu — 33-230.

Jednym zdaniem: w którym języku pomyłkę typu wykryje narzędzie, zanim
program ruszy?

??? tip "Podpowiedź 1"

    Wartość ustalona raz na zawsze — stała. Wartość zmieniająca się w ciągu
    dnia — zmienna.

??? tip "Podpowiedź 2"

    Kod pocztowy to **numer**, nie liczba — w C tablica `char`, w JS i PHP
    tekst (temat o typach, sekcja 7). Cena w groszach: 4500.

??? tip "Podpowiedź 3"

    Przykład dla pierwszej informacji:
    C: `const int MAX_ROWEROW_DZIENNIE = 12;` ·
    JS: `const MAX_ROWEROW_DZIENNIE = 12;` ·
    PHP: `const MAX_ROWEROW_DZIENNIE = 12;` (albo `define(...)`). Błąd typu przed uruchomieniem
    wyłapie kompilator C.

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła.**

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Które słowo kluczowe służy do zadeklarowania stałej w języku JavaScript?",
  "opcje": [
   "const",
   "let",
   "var",
   "static"
  ],
  "poprawna": 0,
  "wyjasnienie": "const tworzy stałą — po inicjalizacji nie można jej przypisać nowej wartości. let służy do zmiennych, a var to stary sposób, którego unikamy."
 },
 {
  "pytanie": "Co się stanie po wykonaniu tego kodu w konsoli przeglądarki?",
  "kod": "const x = 10;\nx = 20;",
  "opcje": [
   "x zmieni wartość na 20",
   "Pojawi się błąd TypeError: Assignment to constant variable.",
   "x przyjmie wartość NaN",
   "Konsola wypisze undefined"
  ],
  "poprawna": 1,
  "wyjasnienie": "Ponowne przypisanie do stałej const kończy się błędem TypeError: Assignment to constant variable."
 },
 {
  "pytanie": "Co zgłosi kompilator gcc dla tego fragmentu w C?",
  "kod": "const int MAX_ROWEROW = 5;\nMAX_ROWEROW = 6;",
  "opcje": [
   "Nic — program wypisze 6",
   "Ostrzeżenie, ale program się skompiluje",
   "Błąd: assignment of read-only variable 'MAX_ROWEROW'",
   "Błąd dopiero w czasie działania programu"
  ],
  "poprawna": 2,
  "wyjasnienie": "W C stała const jest pilnowana przez kompilator: zmiana jej wartości to błąd kompilacji, program w ogóle nie powstanie."
 },
 {
  "pytanie": "Jaką wartość ma zmienna zadeklarowana w JavaScripcie jako let wiek; (bez przypisania)?",
  "opcje": [
   "0",
   "null",
   "false",
   "undefined"
  ],
  "poprawna": 3,
  "wyjasnienie": "Zmienna let bez inicjalizacji ma wartość undefined. Dla porównania: const bez wartości to błąd składni."
 },
 {
  "pytanie": "Co wypisze ten kod w JavaScripcie?",
  "kod": "let rabat = 0;\nif (true) {\n  let rabat = 10;\n}\nconsole.log(rabat);",
  "opcje": [
   "10",
   "0",
   "undefined",
   "ReferenceError"
  ],
  "poprawna": 1,
  "wyjasnienie": "let ma zasięg blokowy. rabat w klamrach to osobna zmienna, która znika po wyjściu z bloku — na zewnątrz nadal jest 0."
 },
 {
  "pytanie": "Który identyfikator spowoduje błąd składni przy deklaracji let w JavaScripcie?",
  "opcje": [
   "1miejsce",
   "$cenaUslugi",
   "_idKlienta",
   "uzytkownik2"
  ],
  "poprawna": 0,
  "wyjasnienie": "Nazwa nie może zaczynać się od cyfry. $ i _ na początku są dozwolone."
 },
 {
  "pytanie": "Jak w PHP powstaje zmienna $cena?",
  "opcje": [
   "Trzeba ją najpierw zadeklarować słowem var",
   "Trzeba podać typ, np. int $cena;",
   "Powstaje przy pierwszym przypisaniu, np. $cena = 90;",
   "Tylko przez define('cena', 90)"
  ],
  "poprawna": 2,
  "wyjasnienie": "W PHP zmienną tworzy pierwsze przypisanie. Literówka w nazwie daje więc nową, niezdefiniowaną zmienną i ostrzeżenie Undefined variable."
 },
 {
  "pytanie": "Co wypisze ten skrypt w PHP 8?",
  "kod": "<?php\ndefine('LIMIT', 5);\necho Limit;",
  "opcje": [
   "5",
   "LIMIT",
   "Limit",
   "Fatal error: Undefined constant \"Limit\""
  ],
  "poprawna": 3,
  "wyjasnienie": "Nazwy stałych w PHP rozróżniają wielkość liter. Limit to inna, niezdefiniowana stała — w PHP 8 to błąd krytyczny."
 },
 {
  "pytanie": "Jaki będzie wynik var_dump(\"5\" + 3); w PHP?",
  "opcje": [
   "string(2) \"53\"",
   "int(8)",
   "float(8)",
   "TypeError"
  ],
  "poprawna": 1,
  "wyjasnienie": "W PHP + zawsze dodaje liczbowo — napis \"5\" zamienia się na liczbę i wychodzi int(8). Sklejanie napisów to kropka: \"5\" . 3 daje \"53\"."
 },
 {
  "pytanie": "Co wypisze console.log(x + y); w JavaScripcie?",
  "kod": "let x = \"5\";\nlet y = 3;\nconsole.log(x + y);",
  "opcje": [
   "8",
   "NaN",
   "TypeError",
   "53"
  ],
  "poprawna": 3,
  "wyjasnienie": "W JavaScripcie + z napisem skleja tekst: \"5\" + 3 daje \"53\". To ta sama operacja, która w PHP daje 8 — dlatego przed liczeniem zamieniamy dane na liczby."
 },
 {
  "pytanie": "Na czym polega typowanie dynamiczne (JavaScript, PHP)?",
  "opcje": [
   "Typ ma wartość, a ta sama zmienna może w trakcie programu przechowywać wartości różnych typów",
   "Typ zmiennej podaje się przy deklaracji i nie może się zmienić",
   "Wszystkie zmienne są zawsze napisami",
   "Stałe mogą zmieniać typ, ale nie wartość"
  ],
  "poprawna": 0,
  "wyjasnienie": "W typowaniu dynamicznym typ należy do wartości, nie do zmiennej. W C (typowanie statyczne) typ zmiennej ustala deklaracja."
 }
]
</script>
</div>

---

## Karta pracy

Z tego tematu oddajesz **kartę pracy** w formacie Word. Kartę wypełniaj w trakcie ćwiczeń: wpisuj przewidywania **przed** uruchomieniem kodu, a wyniki i wnioski — po wykonaniu.

<div class="kp-podsumowanie" data-karta="deklaracja-stalych-zmiennych"></div>

<span id="karta" class="kp-kotwica"></span>

???+ karta "Rozwiń kartę pracy"

    !!! info "Twoje odpowiedzi zostają na twoim komputerze"

        Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
        przycisku. Wyczyszczenie danych przeglądarki usunie odpowiedzi — kiedy
        skończysz, pobierz plik.

    <div class="karta-pracy" data-karta="deklaracja-stalych-zmiennych"></div>

### Jak ją oddać

1. Pobierz kartę pracy przyciskiem pod formularzem na tej stronie.
2. Plik `.docx` dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *Deklaracja stałych i zmiennych w odniesieniu do wbudowanych typów danych — karta pracy*.

---

Poprzedni temat: [Wbudowane typy danych — char, int, float, double i ich specyfikatory](typy-danych.md).
Następny temat: [Własne typy danych – typ wyliczeniowy, unie, klasy, tablice](wlasne-typy-danych.md).

!!! info "Materiały uzupełniające"

    - Gramatyka i deklaracja zmiennych w JavaScript (po polsku): [developer.mozilla.org/pl/docs/Web/JavaScript/Guide/Grammar_and_types](https://developer.mozilla.org/pl/docs/Web/JavaScript/Guide/Grammar_and_types)
    - Opis słowa kluczowego const (po angielsku): [developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
    - Opis słowa kluczowego let (po angielsku): [developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
    - Zmienne w PHP (po polsku): [php.net/manual/pl/language.variables.basics.php](https://www.php.net/manual/pl/language.variables.basics.php)
    - Stałe w PHP (po polsku): [php.net/manual/pl/language.constants.php](https://www.php.net/manual/pl/language.constants.php)
