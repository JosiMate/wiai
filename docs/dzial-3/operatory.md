# Operatory arytmetyczne, bitowe, logiczne oraz relacji

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział III. Podstawy programowania — środowisko i dane
    · efekt kształcenia **INF.03.5.2**

    Każdy program liczy i decyduje: ile kosztuje naprawa, czy klient dostaje
    rabat, czy mechanik może usunąć zlecenie. Do tego służą **operatory** —
    znaki, które z wartości robią nową wartość.

    Na tym temacie poznasz cztery grupy operatorów w C, JavaScripcie i PHP.
    Większość wygląda tak samo we wszystkich trzech językach — i właśnie
    dlatego najgroźniejsze są miejsca, w których działają **inaczej**:
    `7 / 2`, `"5" == 5`, `2 ^ 3`.

    ??? abstract "Plan trzech lekcji"

        | Lekcja | Sekcje | Ćwiczenia |
        | :---: | --- | --- |
        | 1 | 1–4: operatory arytmetyczne, dzielenie w trzech językach, `++` i `+=`, kolejność działań | 1, 2, 3 |
        | 2 | 5–7: operatory relacji, `==` i `===`, operatory logiczne i skrócone wartościowanie | 4, 5 |
        | 3 | 8–12: system dwójkowy, operatory bitowe, uprawnienia w bitach, ściąga z priorytetów, najczęstsze błędy | 6, 7, 8; quiz |

??? rozgrzewka "Na rozgrzewkę — 3 minuty, bez zaglądania"

    Odpowiedz w zeszycie, zanim zaczniesz nowy temat. Odpowiedzi rozwiń
    dopiero wtedy, gdy wszyscy skończą — nie liczą się do oceny.

    1. **Z poprzednich lekcji.** Jak w JavaScripcie i w PHP utworzysz obiekt
       klasy `Rower`?
    2. **Sprzed kilku tygodni.** Co wypisze w JavaScripcie `"5" + 3`, a co
       w PHP `"5" + 3`?
    3. **Z dawniejszych tematów.** Zapisz liczbę 12 w systemie dwójkowym.

    ??? success "Odpowiedzi"

        1. Słowem `new`: `new Rower("Kross", 2021)` w JavaScripcie,
           `new Rower('Kross', 2021)` w PHP.
        2. JavaScript: `"53"` — `+` z napisem skleja. PHP: `8` — `+` zawsze
           dodaje. Dziś zobaczysz więcej takich par.
        3. `1100` (8 + 4). Przyda się na trzeciej lekcji, przy operatorach
           bitowych.

!!! success "Kryteria sukcesu — sprawdź się na koniec tematu"

    Po tym temacie:

    1. Obliczę wyrażenie z operatorami arytmetycznymi i przewidzę wynik dzielenia `/` i reszty `%` w C, JavaScripcie i PHP.
    2. Użyję `++`, `--` i operatorów przypisania złożonego (`+=`, `*=`) i wyjaśnię różnicę między `licznik++` a `++licznik`.
    3. Ustalę kolejność wykonywania działań i dostawię nawiasy tam, gdzie zmieniają wynik.
    4. Porównam wartości operatorami relacji i wyjaśnię, czym różni się `==` od `===` w JavaScripcie i PHP.
    5. Zbuduję złożony warunek z `&&`, `||` i `!` i sprawdzę go dla wartości granicznych.
    6. Obliczę wynik operatorów bitowych `&`, `|`, `^`, `~`, `<<`, `>>` na zapisie dwójkowym.
    7. Zapiszę uprawnienia jako bity jednej liczby i sprawdzę, nadam i odbiorę uprawnienie.

---

## 1. Operator, operand, wyrażenie

W zapisie `cena * 2` gwiazdka to **operator**, a `cena` i `2` to
**operandy**. Razem tworzą **wyrażenie** — coś, co ma wartość. Wyrażenia
można składać: `(cena * 2 + dostawa) * 0.9`.

| Grupa | Operatory | Wynik | Przykład z serwisu |
| --- | --- | --- | --- |
| arytmetyczne | `+` `-` `*` `/` `%` `**` | liczba | koszt naprawy, reszta do wydania |
| przypisania | `=` `+=` `-=` `*=` `/=` `%=` `++` `--` | nowa wartość zmiennej | licznik klientów |
| relacji (porównania) | `<` `>` `<=` `>=` `==` `!=` `===` `!==` | prawda / fałsz | czy kwota ≥ 300 zł? |
| logiczne | `&&` <code>&#124;&#124;</code> `!` | prawda / fałsz | stały klient **lub** duże zamówienie, **ale nie** ekspres |
| bitowe | `&` <code>&#124;</code> `^` `~` `<<` `>>` | liczba | uprawnienia zapisane w bitach |

W PHP dochodzą `.` i `.=` do sklejania napisów, a w PHP i JavaScripcie `??`
(wartość domyślna). `===` i `!==` nie ma w C — tam typy pilnuje kompilator.

---

## 2. Arytmetyka: dzielenie w trzech językach

Dodawanie, odejmowanie i mnożenie działają wszędzie tak samo. Dzielenie —
nie.

```text
C:           7 / 2         7 % 2        -7 % 3
JavaScript:  7 / 2         7 % 2        -7 % 3
PHP:         7 / 2         7 % 2        -7 % 3      intdiv(7, 2)
```

!!! example "Przewiduj"

    Jaki wynik da `7 / 2` w każdym języku? Co da `-7 % 3`?

    ??? success "Przewiduj, potem sprawdź wynik"

        | | `7 / 2` | `7 % 2` | `-7 % 3` |
        | --- | :---: | :---: | :---: |
        | C (`int`) | **3** | 1 | -1 |
        | JavaScript | **3.5** | 1 | -1 |
        | PHP | **3.5** (`float`) | 1 | -1 |

        W C dzielenie dwóch liczb całkowitych daje liczbę całkowitą — część
        ułamkowa przepada (temat o typach). Żeby dostać 3.5, jeden operand
        musi być zmiennoprzecinkowy: `(double) 7 / 2` albo `7 / 2.0`.
        W JavaScripcie część całkowitą da `Math.floor(7 / 2)`, w PHP
        `intdiv(7, 2)`.

        Reszta z dzielenia ma znak **dzielnej**: `-7 % 3` to -1 we
        wszystkich trzech językach.

**Reszta z dzielenia `%`** przydaje się częściej, niż się wydaje:

- `liczba % 2` — 0 dla parzystej, 1 dla nieparzystej,
- `minuty % 60` — minuty po pełnych godzinach (135 min = 2 h **15** min),
- `nr % 3 === 0` — co trzeci klient dostaje gratis,
- `kwota % 50` — ile zostaje po wydaniu banknotów 50 zł.

**Potęga** to `**` w JavaScripcie i PHP (`2 ** 3` = 8). W C nie ma
operatora potęgi — jest funkcja `pow(2, 3)` z `<math.h>`. Uwaga: `^` to
nie potęga, tylko operator bitowy (sekcja 9).

**Dzielenie przez zero** kończy się w każdym języku inaczej:

| C (liczby całkowite) | JavaScript | PHP 8 |
| --- | --- | --- |
| program przerywa działanie (*Floating point exception*); przy stałej `/ 0` kompilator ostrzega *division by zero* | `10 / 0` → `Infinity`, `0 / 0` → `NaN` — bez błędu | `DivisionByZeroError: Division by zero` — skrypt staje |

---

## 3. Inkrementacja i przypisanie złożone

Zamiast `licznik = licznik + 1` piszemy `licznik++`, a zamiast
`suma = suma + cena` — `suma += cena`. Działa to tak samo w C, JavaScripcie
i PHP.

| Zapis | To samo co |
| --- | --- |
| `x++` albo `++x` | `x = x + 1` |
| `x--` albo `--x` | `x = x - 1` |
| `x += 5` | `x = x + 5` |
| `x *= 2` | `x = x * 2` |
| `x %= 60` | `x = x % 60` |
| `$napis .= "zł"` (PHP) | `$napis = $napis . "zł"` |

Różnica między `x++` a `++x` widać dopiero wtedy, gdy wynik od razu gdzieś
trafia:

```c
int licznik = 5;
int a = licznik++;
int b = ++licznik;
printf("a=%d b=%d licznik=%d\n", a, b, licznik);
```

!!! example "Przewiduj"

    Jakie wartości mają `a`, `b` i `licznik`?

    ??? success "Przewiduj, potem sprawdź wynik"

        `a=5 b=7 licznik=7`. `licznik++` najpierw **oddaje** starą wartość (5),
        potem zwiększa licznik do 6. `++licznik` najpierw **zwiększa**
        (do 7), potem oddaje nową wartość. Gdy `++` stoi w osobnym wierszu,
        obie formy działają tak samo.

---

## 4. Kolejność działań

Operatory mają **priorytety** — tak jak w matematyce mnożenie idzie przed
dodawaniem: `2 + 3 * 4` to 14, a `(2 + 3) * 4` to 20. Gdy priorytet jest
równy, liczy się od lewej: `10 - 4 - 3` to 3. Wyjątek: potęga liczy się od
prawej — `2 ** 3 ** 2` to `2 ** 9`, czyli 512.

Najwięcej niespodzianek daje sklejanie napisów:

```js
console.log("Suma: " + 2 + 3);
console.log("Suma: " + (2 + 3));
console.log(2 + 3 + " zł");
```

```php
<?php
echo "Suma: " . 2 + 3;
```

!!! example "Przewiduj"

    Co wypiszą trzy wiersze w JavaScripcie, a co wiersz w PHP?

    ??? success "Przewiduj, potem sprawdź wynik"

        JavaScript: `Suma: 23`, `Suma: 5`, `5 zł`. `+` liczy od lewej:
        najpierw `"Suma: " + 2` daje napis `"Suma: 2"`, a napis plus 3 to
        znowu sklejanie. W trzecim wierszu najpierw jest `2 + 3` — dwie
        liczby, więc 5, potem dopiero sklejenie.

        PHP 8: `Suma: 5` — w PHP 8 dodawanie ma wyższy priorytet niż
        kropka, więc najpierw `2 + 3`. (W PHP 7 wynik był inny — dlatego
        programiści i tak dostawiają nawiasy.)

!!! quote "Zasada, którą warto zapamiętać"

    Gdy nie jesteś pewien kolejności — dostaw nawiasy. Nic nie kosztują,
    a następna osoba, która czyta kod, nie musi pamiętać tabeli priorytetów.

---

## 5. Operatory relacji

Porównanie daje wartość logiczną: **prawdę** albo **fałsz**.

| Operator | Znaczenie | Przykład | Wynik |
| --- | --- | --- | --- |
| `<` `>` | mniejsze, większe | `kwota > 300` | zależy od kwoty |
| `<=` `>=` | mniejsze lub równe, większe lub równe | `wizyty >= 5` | |
| `==` `!=` | równe, różne | `status == "gotowe"` | |
| `===` `!==` | równe i tego samego typu (JS, PHP) | `kod === 1234` | |

W C porównanie daje liczbę typu `int`: `printf("%d", 7 > 2)` wypisze `1`,
a fałsz to `0`.

Napisy porównuje się **znak po znaku** jak w słowniku, a nie jak liczby:

```js
console.log("10" < "9");    // true  — znak "1" jest przed "9"
console.log("10" < 9);      // false — jedna liczba, więc JS porównuje liczbowo
```

W PHP `"10" < "9"` daje `false`: dwa napisy wyglądające jak liczby PHP
porównuje liczbowo. To jedno z tych miejsc, gdzie JavaScript i PHP
rozchodzą się w zachowaniu.

Liczb zmiennoprzecinkowych nie porównuj przez `==`: `0.1 + 0.2 == 0.3`
daje fałsz (temat o typach). Kwoty trzymaj w groszach.

---

## 6. `==` czy `===`?

W JavaScripcie i PHP `==` przed porównaniem **zamienia typy** — próbuje
„dogadać” napis z liczbą. `===` porównuje bez zamiany: wartość **i** typ
muszą być takie same.

```js
console.log("5" == 5, "5" === 5);
console.log(0 == "", null == undefined, null === undefined);
console.log(NaN == NaN);
```

!!! example "Przewiduj"

    Co wypiszą trzy wiersze?

    ??? success "Przewiduj, potem sprawdź wynik"

        `true false` · `true true false` · `false`.

        `"5" == 5` — napis zamieniony na liczbę, więc równe. `"5" === 5` —
        różne typy. `0 == ""` — pusty napis to po zamianie 0. `null`
        i `undefined` są sobie „luźno” równe, ale to różne typy. `NaN` nie
        jest równe niczemu, nawet sobie — sprawdza się je przez
        `Number.isNaN(x)`.

PHP 8 zachowuje się ostrożniej niż starsze wersje:

| Porównanie w PHP | PHP 8 | PHP 7 | Dlaczego |
| --- | :---: | :---: | --- |
| `"5" == 5` | `true` | `true` | napis-liczba zamieniony na liczbę |
| `"abc" == 0` | `false` | `true` | PHP 8 nie zamienia już tekstu na 0 przy porównaniu |
| `0 == ""` | `false` | `true` | j.w. |
| `"1e3" == "1000"` | `true` | `true` | oba napisy to liczby: 1·10³ i 1000 |
| `null == false` | `true` | `true` | obie wartości są „puste” |
| `"5" === 5` | `false` | `false` | różne typy |

!!! quote "Zasada, którą warto zapamiętać"

    W JavaScripcie i PHP domyślnie używaj `===` i `!==`. Wartość
    z formularza zamień najpierw na liczbę (`Number(...)`, `(int)`),
    a potem porównuj ściśle.

---

## 7. Operatory logiczne

| Operator | Nazwa | Prawda, gdy… |
| --- | --- | --- |
| `a && b` | i (koniunkcja) | **oba** warunki są prawdziwe |
| <code>a &#124;&#124; b</code> | lub (alternatywa) | **co najmniej jeden** jest prawdziwy |
| `!a` | nie (negacja) | `a` jest fałszywe |

| `a` | `b` | `a && b` | <code>a &#124;&#124; b</code> | `!a` |
| :---: | :---: | :---: | :---: | :---: |
| fałsz | fałsz | fałsz | fałsz | prawda |
| fałsz | prawda | fałsz | prawda | prawda |
| prawda | fałsz | fałsz | prawda | fałsz |
| prawda | prawda | prawda | prawda | fałsz |

Regulamin rabatu z serwisu: *rabat dostaje stały klient (co najmniej 5 wizyt)
albo zamówienie za co najmniej 300 zł, ale nigdy przy trybie ekspresowym*.

```php
<?php
$czyRabat = ($wizyty >= 5 || $kwota >= 300) && !$ekspres;
```

Nawiasy są tu konieczne: `&&` ma wyższy priorytet niż `||`. Bez nich
`$wizyty >= 5 || $kwota >= 300 && !$ekspres` znaczyłoby „stały klient —
zawsze, nawet z ekspresem”.

!!! example "Przewiduj"

    Godziny otwarcia serwisu: od 8 do 18. Który warunek jest dobry?

    ```js
    const godzina = 19;
    console.log(godzina >= 8 || godzina < 18);
    console.log(godzina >= 8 && godzina < 18);
    ```

    ??? success "Przewiduj, potem sprawdź wynik"

        Pierwszy daje `true` — i dawałby `true` dla każdej godziny, bo każda
        liczba jest albo ≥ 8, albo < 18. Dobry jest drugi: `false`.
        „Godzina w przedziale” to zawsze **dwa warunki połączone `&&`**.

**Skrócone wartościowanie.** `a && b` nie sprawdza `b`, gdy `a` jest
fałszywe — wynik i tak będzie fałszem. `a || b` nie sprawdza `b`, gdy `a`
jest prawdziwe. Dlatego bezpieczny jest zapis `zlecenie && zlecenie.status` —
gdy zlecenia nie ma, do `.status` program w ogóle nie sięgnie.

**Wartość domyślna.** W JavaScripcie i PHP `x ?? "brak"` daje `"brak"`, gdy
`x` jest `null` albo `undefined` (w PHP — gdy zmiennej lub klucza nie ma).
Stąd w PHP: `$wizyty = (int) ($_GET['wizyty'] ?? 0);`.

**Operator warunkowy** `warunek ? jeśli_tak : jeśli_nie` wybiera jedną
z dwóch wartości — działa w C, JavaScripcie i PHP:

```js
const stanowisko = nrZlecenia % 2 === 0 ? "B" : "A";
```

---

## 8. System dwójkowy w pigułce

Operatory bitowe działają na **bitach** — cyfrach zapisu dwójkowego. Każda
pozycja ma wagę dwa razy większą od poprzedniej:

| waga | 8 | 4 | 2 | 1 | liczba |
| --- | :---: | :---: | :---: | :---: | :---: |
| 12 | 1 | 1 | 0 | 0 | 8 + 4 |
| 10 | 1 | 0 | 1 | 0 | 8 + 2 |
| 6 | 0 | 1 | 1 | 0 | 4 + 2 |

Zapis dwójkowy liczby zobaczysz w JavaScripcie przez `(12).toString(2)`
(→ `"1100"`), w PHP przez `decbin(12)`.

---

## 9. Operatory bitowe

Operator bitowy robi swoje osobno na **każdej parze bitów** na tej samej
pozycji.

| Operator | Nazwa | Bit wyniku = 1, gdy… | `12` i `10` | Wynik |
| --- | --- | --- | --- | :---: |
| `&` | AND | oba bity to 1 | `1100 & 1010` = `1000` | **8** |
| <code>&#124;</code> | OR | co najmniej jeden to 1 | <code>1100 &#124; 1010</code> = `1110` | **14** |
| `^` | XOR | bity są różne | `1100 ^ 1010` = `0110` | **6** |
| `~` | NOT | odwraca każdy bit | `~5` | **-6** |
| `<<` | przesunięcie w lewo | dopisuje zera z prawej — mnoży przez 2 | `5 << 2` = `10100` | **20** |
| `>>` | przesunięcie w prawo | obcina bity z prawej — dzieli przez 2 | `20 >> 2` = `101` | **5** |

Wynik `~5` to -6, bo liczby całkowite ze znakiem zapisuje się w kodzie U2
(temat o typach): odwrócenie wszystkich bitów liczby `x` daje `-x - 1`.

Dwa szybkie triki:

- `x & 1` — 1 dla nieparzystej, 0 dla parzystej (sprawdza najmłodszy bit),
- `1 << n` — liczba z jednym zapalonym bitem na pozycji `n`: 1, 2, 4, 8…

!!! example "Przewiduj"

    ```js
    console.log(2 ^ 3);
    console.log(2 ** 3);
    ```

    ??? success "Przewiduj, potem sprawdź wynik"

        `1` i `8`. `^` to XOR: `10 ^ 11` = `01`. Potęga to `**`. W C gcc
        nawet ostrzega: *result of '2^3' is 1; did you mean '1 << 3' (8)?*

---

## 10. Uprawnienia zapisane w bitach

Panel serwisu ma cztery uprawnienia. Każde dostaje **jeden bit**, więc
wszystkie uprawnienia jednej osoby mieszczą się w jednej liczbie:

```js
const ODCZYT   = 1;   // 0001
const EDYCJA   = 2;   // 0010
const USUWANIE = 4;   // 0100
const RAPORTY  = 8;   // 1000

let mechanik = ODCZYT | EDYCJA;          // 0011 = 3 — nadanie: OR
mechanik |= RAPORTY;                     // 1011 = 11 — dołożenie uprawnienia
mechanik &= ~EDYCJA;                     // 1001 = 9 — odebranie: AND z negacją
const mozeUsuwac = (mechanik & USUWANIE) !== 0;   // sprawdzenie: AND
```

Tak samo działają uprawnienia plików w Linuksie: `chmod 754` to trzy liczby
z bitów odczytu (4), zapisu (2) i wykonania (1) — 7 = 4 + 2 + 1, 5 = 4 + 1.

!!! example "Przewiduj"

    `mechanik` ma wartość 9 (`1001`) — nie może usuwać. Co wypisze ten wiersz?

    ```js
    console.log(mechanik & USUWANIE !== 0);
    ```

    ??? success "Przewiduj, potem sprawdź wynik"

        `1` — czyli „prawda”, choć powinien być fałsz. Porównanie `!==` ma
        **wyższy priorytet** niż `&`, więc liczy się najpierw
        `USUWANIE !== 0` (→ `true`, czyli 1), a potem `9 & 1` = 1. Poprawnie:
        `(mechanik & USUWANIE) !== 0` → `false`. Przy operatorach bitowych
        nawiasy dawaj zawsze.

---

## 11. Ściąga: priorytety

Od najwyższego do najniższego (wybrane operatory; kolejność jest taka sama
w C, JavaScripcie i PHP — wyjątki w ostatniej kolumnie):

| Priorytet | Operatory | Uwagi |
| :---: | --- | --- |
| 1 | `()` | nawiasy — zawsze najpierw |
| 2 | `**` | JS, PHP; liczy od prawej |
| 3 | `++` `--` `!` `~` jednoargumentowy `-` | `-2 ** 2`: w PHP -4, w JS błąd składni — dostaw nawias |
| 4 | `*` `/` `%` | |
| 5 | `+` `-` | w PHP 8 też przed `.` |
| 6 | `<<` `>>` | |
| 7 | `<` `<=` `>` `>=` | |
| 8 | `==` `!=` `===` `!==` | |
| 9 | `&` | **niżej** niż porównania! |
| 10 | `^` | |
| 11 | <code>&#124;</code> | |
| 12 | `&&` | |
| 13 | <code>&#124;&#124;</code> `??` | w JS `??` nie wolno mieszać z <code>&#124;&#124;</code> bez nawiasów |
| 14 | `? :` | |
| 15 | `=` `+=` `-=` `*=` … | najniżej — przypisanie na końcu |

---

## 12. Najczęstsze błędy

| Objaw | Przyczyna | Co zrobić |
| --- | --- | --- |
| C: `7 / 2` daje 3 | dzielenie dwóch `int` | `(double) 7 / 2` albo `7 / 2.0` |
| C: *Floating point exception* | dzielenie liczby całkowitej przez zero | sprawdź dzielnik przed dzieleniem |
| warunek zawsze prawdziwy | `if (x = 5)` — przypisanie zamiast porównania | `===` w JS i PHP, `==` w C |
| JS: `"18020"` zamiast 200 | `+` z napisem z formularza skleja | `Number(tekst)` przed dodawaniem |
| JS i PHP: `"5" == 5` daje prawdę, a nie powinno | `==` zamienia typy | `===` i `!==` |
| warunek „w przedziale” zawsze prawdziwy | <code>&#124;&#124;</code> zamiast `&&` | `x >= 8 && x < 18` |
| rabat dostaje ktoś, kto nie powinien | brak nawiasów przy `&&` i <code>&#124;&#124;</code> | <code>(a &#124;&#124; b) &amp;&amp; !c</code> |
| `2 ^ 3` daje 1 | `^` to XOR, nie potęga | `2 ** 3`, w C `pow(2, 3)` |
| `x & 4 !== 0` daje „prawdę” | `!==` ma wyższy priorytet niż `&` | `(x & 4) !== 0` |
| `&` zamiast `&&` w warunku | bitowe AND zamiast logicznego | w warunkach `&&` i <code>&#124;&#124;</code> |
| PHP: `DivisionByZeroError` | dzielenie lub `%` przez zero | sprawdź dzielnik; `fdiv()` daje `INF` zamiast błędu |

---

## Ćwiczenia

Ćwiczenia 1–4 i 6 są dla wszystkich. Ćwiczenia 5 i 7 są na ocenę dobrą,
a 8 — na bardzo dobrą. Ćwiczenia 1, 3 i 6 robisz na kartce albo w karcie
pracy, pozostałe w paczce.

Pobierz paczkę i **rozpakuj katalog `operatory` do `C:\xampp\htdocs\`** —
ma powstać `C:\xampp\htdocs\operatory\index.html`. Otwórz ten katalog
w VS Code: **File → Open Folder** (w polskiej wersji: **Plik → Otwórz
folder**). Stronę startową otworzysz pod adresem
`http://localhost/operatory/`, a wyniki skryptów zobaczysz w konsoli:
++f12++ → **Konsola**.

[:material-folder-zip: Operatory — paczka startowa (.zip)](../pliki/operatory-start.zip){ .md-button .md-button--primary download="operatory-start.zip" }

### :material-console: Ćwiczenie 1 — policz bez komputera

Na kartce albo w karcie pracy oblicz każde wyrażenie w podanym języku.

| Nr | Język | Wyrażenie |
| :---: | --- | --- |
| a | C (`int`) | `17 / 5` |
| b | JavaScript | `17 / 5` |
| c | każdy | `17 % 5` |
| d | każdy | `20 - 2 * 3 + 4` |
| e | każdy | `(20 - 2) * (3 + 4)` |
| f | JavaScript | `"Rowery: " + 2 + 1` |
| g | PHP | `intdiv(17, 5)` |
| h | JavaScript | `2 ** 4` |

??? tip "Podpowiedź 1"

    W C dwie liczby całkowite dają wynik całkowity — część ułamkowa
    przepada. W JavaScripcie `/` zawsze daje pełny wynik.

??? tip "Podpowiedź 2"

    `%` to reszta: ile zostaje, gdy z 17 zabierzesz tyle razy po 5, ile się
    da. Mnożenie przed dodawaniem i odejmowaniem.

??? tip "Podpowiedź 3"

    Wiersz f: `+` liczy od lewej, a napis plus liczba to sklejanie —
    sekcja 4.

### :material-console: Ćwiczenie 2 — kasa serwisu

Otwórz `js/kasa.js` i uzupełnij miejsca oznaczone `ZADANIE`:

1. Zamień 135 minut na `Czas naprawy: 2 h 15 min`.
2. Wypisz resztę z dzielenia numeru zlecenia 1046 przez 2.
3. Dokończ pętlę, która wydaje 87 zł w nominałach 50, 20, 10, 5, 2, 1.
   Ma wyjść: `50 zł × 1`, `20 zł × 1`, `10 zł × 1`, `5 zł × 1`, `2 zł × 1`.
4. Licznik klientów: trzy razy `++`, potem `+= 10` — `Klientów: 13`.

??? tip "Podpowiedź 1"

    Godziny: `Math.floor(czasMin / 60)`. Minuty: `czasMin % 60`.

??? tip "Podpowiedź 2"

    W pętli: `ile` to część całkowita z `doWydania / n`. To, co zostaje do
    wydania, to reszta z dzielenia `doWydania` przez `n`.

??? tip "Podpowiedź 3"

    `const ile = Math.floor(doWydania / n);` i `doWydania = doWydania % n;`
    (albo krócej: `doWydania %= n;`).

### :material-console: Ćwiczenie 3 — operatory w C

Otwórz `c/operatory.c`. **Nie uruchamiaj go.** W karcie pracy:

1. Napisz, co wypisze każdy z siedmiu wierszy z `printf`.
2. Dlaczego „Srednio” i „Srednio inaczej” dają różne wyniki?
3. Co się stanie, gdy usuniesz komentarz wokół wiersza A?

Sprawdzić możesz w kompilatorze online (np. godbolt.org).

??? tip "Podpowiedź 1"

    `7 / 2` na `int`-ach to 3, a `7 % 2` to 1. Mnożenie przed dodawaniem.

??? tip "Podpowiedź 2"

    `(double) rowery / stanowiska` — najpierw zamiana 7 na 7.0, potem
    dzielenie. `(double) (rowery / stanowiska)` — najpierw dzielenie
    całkowite (3), potem zamiana na 3.0.

??? tip "Podpowiedź 3"

    `licznik++` oddaje starą wartość, `++licznik` — nową (sekcja 3). Potem
    `+= 10` i `*= 2` liczą się po kolei: (7 + 10) · 2. Wiersz A: tabela
    dzielenia przez zero w sekcji 2.

### :material-console: Ćwiczenie 4 — `==` czy `===`?

Otwórz `js/porownania.js`.

1. **Zanim odświeżysz stronę**, wpisz do karty pracy przewidywanie dla
   ośmiu porównań. Potem odśwież i zaznacz, gdzie się pomyliłeś.
2. `ZADANIE 1`: dopisz dwa własne porównania.
3. `ZADANIE 2`: funkcja `kodPoprawny` zawsze odpowiada „false”. Popraw ją
   tak, żeby dla `"1234"` dawała `true` — bez zmiany `===` na `==`.

??? tip "Podpowiedź 1"

    Przy każdym wierszu zadaj sobie pytanie: czy oba operandy mają ten sam
    typ? Jeśli nie — `===` od razu daje `false`, a `==` najpierw zamienia.

??? tip "Podpowiedź 2"

    Wiersze 7 i 8: dwa napisy porównuje się jak w słowniku, napis z liczbą —
    liczbowo (sekcja 5).

??? tip "Podpowiedź 3"

    W `kodPoprawny` napis `"1234"` nigdy nie jest `===` liczbie 1234. Zamień
    go na liczbę: `Number(kodZFormularza) === 1234`.

### :material-console: Ćwiczenie 5 — rabat w PHP

:material-plus-circle: **rozszerzenie**

Otwórz `rabat.php`. Zasady rabatu są w komentarzu u góry pliku.

1. `ZADANIE 1`: odczytaj `kwota`, `wizyty` i `ekspres` z adresu. Brakujący
   parametr ma dać 0 (operator `??`).
2. `ZADANIE 2`: zapisz warunek rabatu **jednym** wyrażeniem.
3. `ZADANIE 3` i `4`: kwota po rabacie i komunikat o złych danych.
4. Sprawdź wszystkie odnośniki ze strony startowej. Wynik ma się zgadzać
   z tabelą:

| Kwota | Wizyty | Ekspres | Oczekiwany wynik |
| :---: | :---: | :---: | --- |
| 200 | 6 | nie | Do zapłaty: 180,00 zł (rabat: tak) |
| 350 | 1 | nie | Do zapłaty: 315,00 zł (rabat: tak) |
| 350 | 6 | tak | Do zapłaty: 350,00 zł (rabat: nie) |
| 120 | 2 | nie | Do zapłaty: 120,00 zł (rabat: nie) |
| 300 | 0 | nie | Do zapłaty: 270,00 zł (rabat: tak) |
| — | 3 | nie | Niepoprawne dane zamówienia. |

??? tip "Podpowiedź 1"

    `$kwota = (float) ($_GET['kwota'] ?? 0);` — tak samo `$wizyty` z `(int)`.
    `$ekspres = isset($_GET['ekspres']);`

??? tip "Podpowiedź 2"

    „Stały klient **albo** duże zamówienie” to `||` w nawiasie. „Ale nigdy
    z ekspresem” to `&& !$ekspres` za nawiasem. Granica 300 zł: `>=`, nie `>`.

??? tip "Podpowiedź 3"

    `$doZaplaty = $czyRabat ? $kwota * 0.9 : $kwota;`. Komunikat o złych
    danych: `if ($kwota <= 0) { ... } else { ... }` wokół gotowego wiersza
    z `$komunikat`.

### :material-console: Ćwiczenie 6 — bity na kartce

Na kartce albo w karcie pracy zapisz liczby dwójkowo i oblicz:

1. `12 & 10`, `12 | 10`, `12 ^ 10`,
2. `5 << 2` i `20 >> 2`,
3. `13 & 1` i `14 & 1` — co ten wynik mówi o liczbie?
4. Uprawnienia pliku w Linuksie: odczyt = 4, zapis = 2, wykonanie = 1. Jaką
   liczbę ma właściciel, który może czytać i zapisywać, ale nie wykonywać?
   Jak sprawdzisz operatorem bitowym, czy liczba 5 zawiera zapis?

??? tip "Podpowiedź 1"

    12 = `1100`, 10 = `1010`. Podpisz bity jeden pod drugim i porównaj kolumna
    po kolumnie — tabela w sekcji 9.

??? tip "Podpowiedź 2"

    Przesunięcie o 2 w lewo to dwa razy pomnożyć przez 2, w prawo — dwa razy
    podzielić.

??? tip "Podpowiedź 3"

    `x & 1` sprawdza ostatni bit — on decyduje o parzystości. Odczyt + zapis
    = 4 + 2. Zapis sprawdzasz przez `5 & 2` (5 = `101`, 2 = `010`).

### :material-console: Ćwiczenie 7 — uprawnienia w panelu

:material-plus-circle: **rozszerzenie**

Otwórz `js/uprawnienia.js`.

1. `ZADANIE 1`: uprawnienia kierownika — wszystkie cztery, połączone `|`.
   Ma wyjść: `kierownik: 15 (1111)`.
2. `ZADANIE 2`: funkcja `ma(upr, flaga)` — `true`, gdy bit jest zapalony.
3. `ZADANIE 3`: mechanik dostaje `RAPORTY` i traci `EDYCJA` —
   `mechanik po zmianach: 9 (1001)`.
4. `ZADANIE 4`: odkomentuj wiersz D i wyjaśnij w karcie, skąd wynik `1`.

??? tip "Podpowiedź 1"

    `ODCZYT | EDYCJA | USUWANIE | RAPORTY` — każda flaga zapala swój bit.

??? tip "Podpowiedź 2"

    `upr & flaga` zostawia tylko bit flagi — jeśli był zapalony, wynik jest
    różny od zera. Nawias: `(upr & flaga) !== 0`.

??? tip "Podpowiedź 3"

    Dołożenie: `mechanik |= RAPORTY;`. Odebranie: `mechanik &= ~EDYCJA;` —
    `~EDYCJA` ma zapalone wszystkie bity oprócz bitu edycji. Wiersz D —
    ramka „Przewiduj” w sekcji 10.

### :material-console: Ćwiczenie 8 — napraw skrypt

:material-star: **dopełnienie**

W `js/naprawa.js` jest pięć błędów w operatorach. **Żaden nie daje
komunikatu** — skrypt działa, tylko liczy źle. Gdy go poprawisz, wypisze:

```text
Do zapłaty: 200 zł
Serwis zamknięty (godzina 19)
Powierzchnia stanowiska: 9 m²
Zlecenie 1046: stanowisko B
```

W karcie pracy dla każdego błędu zapisz: zły wiersz, poprawkę i jednym
zdaniem — dlaczego źle liczył.

??? tip "Podpowiedź 1"

    Zacznij od pierwszego złego wiersza wyniku: `16218 zł` to sklejony napis
    pomnożony przez 0.9. Skąd w kwocie wziął się napis?

??? tip "Podpowiedź 2"

    Stały klient ma wartość `false`, a mimo to dostaje rabat — przyjrzyj
    się znakowi w `if`. Godzina 19 „otwarta” — który operator łączy warunki?

??? tip "Podpowiedź 3"

    Pozostałe dwa: `^` to nie potęga (sekcja 9), a numer parzysty ma resztę
    z dzielenia przez 2 równą **0**.

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła.**

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Ile wynosi 7 / 2 w języku C, gdy oba operandy są typu int?",
  "opcje": [
   "3",
   "3.5",
   "4",
   "Błąd kompilacji"
  ],
  "poprawna": 0,
  "wyjasnienie": "Dzielenie dwóch liczb całkowitych w C daje liczbę całkowitą — część ułamkowa przepada. 3.5 da (double) 7 / 2."
 },
 {
  "pytanie": "Jaką wartość ma wyrażenie 17 % 5?",
  "opcje": [
   "3",
   "3.4",
   "2",
   "5"
  ],
  "poprawna": 2,
  "wyjasnienie": "% to reszta z dzielenia: 17 = 3 · 5 + 2."
 },
 {
  "pytanie": "Co wypisze ten kod w C?",
  "kod": "int licznik = 5;\nint a = licznik++;\nprintf(\"%d %d\", a, licznik);",
  "opcje": [
   "6 6",
   "5 5",
   "6 5",
   "5 6"
  ],
  "poprawna": 3,
  "wyjasnienie": "licznik++ najpierw oddaje starą wartość (5), potem zwiększa licznik do 6."
 },
 {
  "pytanie": "Co wypisze ten kod w JavaScripcie?",
  "kod": "console.log(\"Suma: \" + 2 + 3);",
  "opcje": [
   "Suma: 23",
   "Suma: 5",
   "Suma: 2 3",
   "NaN"
  ],
  "poprawna": 0,
  "wyjasnienie": "+ liczy od lewej: \"Suma: \" + 2 to napis, a napis + 3 to znowu sklejanie. Nawias \"Suma: \" + (2 + 3) dałby Suma: 5."
 },
 {
  "pytanie": "Który zapis w JavaScripcie da false?",
  "opcje": [
   "\"5\" == 5",
   "null == undefined",
   "\"5\" === 5",
   "0 == \"\""
  ],
  "poprawna": 2,
  "wyjasnienie": "=== porównuje wartość i typ — napis i liczba to różne typy. Pozostałe porównania == zamieniają typy i dają true."
 },
 {
  "pytanie": "Co da w PHP 8 porównanie \"abc\" == 0?",
  "opcje": [
   "true",
   "false",
   "TypeError",
   "Warning i true"
  ],
  "poprawna": 1,
  "wyjasnienie": "PHP 8 nie zamienia już tekstu, który nie jest liczbą, na 0 przy porównaniu — wynik to false. W PHP 7 było true."
 },
 {
  "pytanie": "Serwis jest otwarty od 8 do 18. Który warunek sprawdza to poprawnie?",
  "opcje": [
   "godzina >= 8 || godzina < 18",
   "godzina >= 8 && godzina < 18",
   "godzina > 8 && godzina > 18",
   "!(godzina >= 8) && godzina < 18"
  ],
  "poprawna": 1,
  "wyjasnienie": "Godzina w przedziale musi spełniać oba warunki naraz — &&. Warunek z || jest prawdziwy dla każdej godziny."
 },
 {
  "pytanie": "Rabat: stały klient LUB zamówienie od 300 zł, ale nigdy z ekspresem. Który warunek PHP jest poprawny?",
  "opcje": [
   "$staly || $kwota >= 300 && !$ekspres",
   "$staly && $kwota >= 300 || !$ekspres",
   "($staly || $kwota >= 300) && !$ekspres",
   "!($staly || $kwota >= 300) && $ekspres"
  ],
  "poprawna": 2,
  "wyjasnienie": "&& ma wyższy priorytet niż ||, więc bez nawiasu stały klient dostawałby rabat także z ekspresem."
 },
 {
  "pytanie": "Ile wynosi 12 & 10 (12 = 1100, 10 = 1010)?",
  "opcje": [
   "14",
   "6",
   "22",
   "8"
  ],
  "poprawna": 3,
  "wyjasnienie": "AND bitowy zostawia 1 tylko tam, gdzie oba bity to 1: 1100 & 1010 = 1000, czyli 8."
 },
 {
  "pytanie": "Co wypisze w JavaScripcie console.log(2 ^ 3)?",
  "opcje": [
   "8",
   "1",
   "6",
   "9"
  ],
  "poprawna": 1,
  "wyjasnienie": "^ to XOR bitowy, nie potęga: 10 ^ 11 = 01, czyli 1. Potęga to 2 ** 3."
 },
 {
  "pytanie": "Uprawnienia: ODCZYT = 1, EDYCJA = 2, USUWANIE = 4. Jak poprawnie sprawdzić, czy w liczbie upr jest USUWANIE?",
  "opcje": [
   "(upr & USUWANIE) !== 0",
   "upr & USUWANIE !== 0",
   "upr | USUWANIE",
   "upr == USUWANIE"
  ],
  "poprawna": 0,
  "wyjasnienie": "& zostawia tylko bit USUWANIE. Nawias jest konieczny: !== ma wyższy priorytet niż &, więc bez nawiasu liczy się upr & true."
 }
]
</script>
</div>

---

## Karta pracy

Z tego tematu oddajesz **kartę pracy** w formacie Word. Kartę wypełniaj w trakcie ćwiczeń: wpisuj przewidywania **przed** uruchomieniem kodu, a wyniki i wnioski — po wykonaniu.

<div class="kp-podsumowanie" data-karta="operatory"></div>

<span id="karta" class="kp-kotwica"></span>

???+ karta "Rozwiń kartę pracy"

    !!! info "Twoje odpowiedzi zostają na twoim komputerze"

        Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
        przycisku. Wyczyszczenie danych przeglądarki usunie odpowiedzi — kiedy
        skończysz, pobierz plik.

    <div class="karta-pracy" data-karta="operatory"></div>

### Jak ją oddać

1. Pobierz kartę pracy przyciskiem pod formularzem na tej stronie.
2. Plik `.docx` dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *Operatory arytmetyczne, bitowe, logiczne oraz relacji — karta pracy*.

---

Poprzedni temat: [Tworzenie własnych typów danych w wybranych językach programowania](tworzenie-typow-danych.md).

!!! info "Materiały uzupełniające"

    - Wyrażenia i operatory w JavaScripcie (po polsku): [developer.mozilla.org/pl/docs/Web/JavaScript/Guide/Expressions_and_operators](https://developer.mozilla.org/pl/docs/Web/JavaScript/Guide/Expressions_and_operators)
    - Priorytety operatorów w JavaScripcie (po angielsku): [developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence)
    - Operatory w PHP (po polsku): [php.net/manual/pl/language.operators.php](https://www.php.net/manual/pl/language.operators.php)
    - Porównania w PHP 8 — tabele (po angielsku): [php.net/manual/en/types.comparisons.php](https://www.php.net/manual/en/types.comparisons.php)
