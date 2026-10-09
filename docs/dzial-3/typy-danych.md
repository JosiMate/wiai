# Wbudowane typy danych — char, int, float, double i ich specyfikatory

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział III. Podstawy programowania — środowisko i dane
    · efekt kształcenia **INF.03.5.2**

    W pamięci komputera nie ma liczb, liter ani cen — są tylko bajty. To
    **typ danych** mówi, ile bajtów zajmuje wartość i jak je odczytać. Od typu
    zależy, czy licznik odwiedzin przekręci się do zera, czy w koszyku sklepu
    zgodzą się grosze i czy `7 / 2` da 3, czy 3,5.

    Typy poznasz najpierw w języku C, bo tam widać je najlepiej: każdą
    zmienną deklarujesz z typem, a rozmiar i zakres są stałe. Potem zobaczysz,
    co z tego zostaje w JavaScripcie i PHP — i dlaczego paragon „Szprychy”
    liczysz w groszach, a nie w złotych.

    ??? abstract "Plan trzech lekcji"

        | Lekcja | Sekcje | Ćwiczenia |
        | :---: | --- | --- |
        | 1 | 1–3: po co typ danych, liczby całkowite i modyfikatory, liczby zmiennoprzecinkowe | 1 |
        | 2 | 4–5: specyfikatory formatu, typy w JavaScripcie | 2, 4, 6 |
        | 3 | 6–8: typy w PHP, dobór typu, najczęstsze błędy | 3, 5, 7 |

??? rozgrzewka "Na rozgrzewkę — 3 minuty, bez zaglądania"

    Odpowiedz w zeszycie, zanim zaczniesz nowy temat. Odpowiedzi rozwiń
    dopiero wtedy, gdy wszyscy skończą — nie liczą się do oceny.

    1. **Z poprzedniej lekcji.** Co zwróci w JavaScripcie wyrażenie `450 / 0`?
       Czy program zgłosi błąd?
    2. **Sprzed kilku tygodni.** Co wypisze w JavaScripcie `"90" + 30`
       i dlaczego?
    3. **Z dawniejszych tematów.** Zapisz liczbę 13 w systemie dwójkowym. Ile
       bitów do tego potrzeba?

    ??? success "Odpowiedzi"

        1. `Infinity` — bez żadnego błędu, program liczy dalej. Dziś zobaczysz
           dlaczego: liczby w JavaScripcie mają typ zmiennoprzecinkowy, a ten
           ma specjalną wartość „nieskończoność”.
        2. `9030` — jedna strona `+` jest tekstem, więc JavaScript skleja
           teksty zamiast dodawać. To, czy `+` dodaje, czy skleja, zależy od
           **typu** wartości.
        3. `1101` — 4 bity (8 + 4 + 1). Dziś policzysz, ile różnych liczb mieści
           się w 8, 16 i 32 bitach.

!!! success "Kryteria sukcesu"

    Po tym temacie:

    1. Wyjaśnię, po co programowi typ danych, i powiem, ile bajtów zajmują `char`, `int`, `float` i `double`.
    2. Policzę zakres typu całkowitego z liczby bitów i rozpoznam przepełnienie.
    3. Dobiorę specyfikator formatu (`%c`, `%d`, `%u`, `%f`, `%.2f`, `%e`, `%x`) do wartości wypisywanej przez `printf` — w C i w PHP.
    4. Wyjaśnię, dlaczego `0.1 + 0.2` nie daje dokładnie `0.3`, i policzę kwotę w groszach zamiast w złotych.
    5. Rozpoznam typ wartości w JavaScripcie (`typeof`) i w PHP (`gettype`, `var_dump`) i powiem, któremu typowi C odpowiada.
    6. Dobiorę typ danych do informacji i uzasadnię wybór zakresem i zajmowaną pamięcią.

---

## 1. Po co programowi typ danych

Pamięć komputera to ciąg bajtów. Bajt `01000001` nie wie, czym jest. Może być
liczbą 65, literą „A”, kawałkiem ceny albo fragmentem obrazka — zależy, jak
program go odczyta. Tę informację niesie **typ danych**. Mówi on trzy rzeczy:

- **ile bajtów** zajmuje wartość;
- **jak je odczytać** — jako liczbę całkowitą, liczbę z przecinkiem czy znak;
- **jakie działania** wolno na niej wykonać i jak działają — na przykład
  dzielenie liczb całkowitych w C odcina część ułamkową.

W języku C każdą zmienną deklarujesz z typem. Cztery podstawowe typy
wbudowane:

| Typ | Rozmiar | Co przechowuje | Przykład |
| --- | :---: | --- | --- |
| `char` | 1 bajt | jeden znak — w pamięci jako mała liczba, kod znaku | `char klasa = 'B';` |
| `int` | zwykle 4 bajty | liczbę całkowitą | `int rowery = 5;` |
| `float` | 4 bajty | liczbę zmiennoprzecinkową **pojedynczej precyzji** | `float temp = 21.5f;` |
| `double` | 8 bajtów | liczbę zmiennoprzecinkową **podwójnej precyzji** | `double cena = 24.99;` |

```c
#include <stdio.h>

int main(void) {
    char znak = 65;
    printf("%c %d\n", znak, znak);
    printf("%c\n", znak + 1);
    return 0;
}
```

!!! example "Przewiduj"

    Zmienna `znak` dostaje liczbę 65. Co wypiszą dwa wiersze z `printf`?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        A 65
        B
        ```

        To **ten sam bajt** wypisany dwa razy: specyfikator `%c` każe
        pokazać go jako znak, `%d` — jako liczbę. W tablicy kodów ASCII
        litera „A” ma kod 65, więc `znak + 1` to 66, czyli „B”.

Typ możesz zapisać przy zmiennej albo przy wartości. Języki takie jak C, C++
czy Java sprawdzają typy **przy kompilacji** — mówimy o **typowaniu
statycznym**. JavaScript i PHP ustalają typ **w trakcie działania**, na
podstawie wartości — to **typowanie dynamiczne**. Deklarowaniem zmiennych
i stałych zajmiesz się w następnym temacie; dziś liczy się to, **jakie typy
w ogóle są** i co potrafią.

---

## 2. Liczby całkowite: zakres i modyfikatory

### Ile liczb mieści się w n bitach

Jeden bit to 2 możliwości, `n` bitów — 2^n^ możliwości. Typ może je
wykorzystać na dwa sposoby:

| Wariant | Zakres dla `n` bitów | 8 bitów | 16 bitów | 32 bity |
| --- | --- | --- | --- | --- |
| **bez znaku** (`unsigned`) | od 0 do 2^n^ − 1 | 0 … 255 | 0 … 65 535 | 0 … 4 294 967 295 |
| **ze znakiem** (`signed`) | od −2^n−1^ do 2^n−1^ − 1 | −128 … 127 | −32 768 … 32 767 | −2 147 483 648 … 2 147 483 647 |

Liczb ujemnych jest o jedną więcej niż dodatnich, bo zero zajmuje jedną
z „dodatnich” kombinacji bitów (procesor zapisuje liczby ze znakiem w kodzie
uzupełnień do dwóch, U2).

### Modyfikatory: short, long, signed, unsigned

Do typu `int` (i do `char`) można dopisać słowa, które zmieniają rozmiar
albo sposób odczytu. W standardzie języka C słowa `short`, `long`, `signed`
i `unsigned` należą do **specyfikatorów typu** — potocznie nazywa się je
**modyfikatorami**.

| Typ | Bajty | Zakres |
| --- | :---: | --- |
| `signed char` | 1 | −128 … 127 |
| `unsigned char` | 1 | 0 … 255 |
| `short` | 2 | −32 768 … 32 767 |
| `unsigned short` | 2 | 0 … 65 535 |
| `int` | 4 | −2 147 483 648 … 2 147 483 647 |
| `unsigned int` | 4 | 0 … 4 294 967 295 |
| `long` | 8 (w Windows: 4) | jak `long long` (w Windows: jak `int`) |
| `long long` | 8 | −9 223 372 036 854 775 808 … 9 223 372 036 854 775 807 |

Standard języka C ustala tylko **minimalne** rozmiary typów, a dokładne
zależą od kompilatora i systemu. Liczby w tabeli zmierzono operatorem
`sizeof` w kompilatorze gcc 13 na 64-bitowym Linuksie. Najczęstsza różnica:
`long` ma w 64-bitowym Linuksie 8 bajtów, a w Windows — 4. Rozmiar sprawdzisz
w programie: `sizeof(long)`.

### Przepełnienie: licznik się przekręca

```c
#include <stdio.h>

int main(void) {
    unsigned char licznik = 255;
    licznik = licznik + 1;
    printf("%d\n", licznik);

    unsigned int u = 0;
    u = u - 1;
    printf("%u\n", u);
    return 0;
}
```

!!! example "Przewiduj"

    `licznik` ma już największą wartość, jaką mieści `unsigned char`.
    Co się stanie po dodaniu 1? A co po odjęciu 1 od zera w `unsigned int`?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        0
        4294967295
        ```

        Jak licznik kilometrów w starym samochodzie: po 999 999 pokazuje
        000 000. Typ bez znaku liczy „w kółko” — po największej wartości jest
        0, a przed zerem jest największa wartość. Program nie zgłasza żadnego
        błędu. Przy typach **ze znakiem** przepełnienie `int` w C jest
        jeszcze gorsze: standard nie mówi, co się stanie (to tzw. zachowanie
        niezdefiniowane).

Przepełnienia zdarzają się naprawdę:

- W grudniu 2014 r. licznik wyświetleń teledysku „Gangnam Style” w serwisie
  YouTube zbliżył się do 2 147 483 647 — granicy 32-bitowej liczby ze
  znakiem. Serwis przeszedł na licznik 64-bitowy.
- Wiele systemów zapisuje czas jako liczbę sekund od 1 stycznia 1970 r.
  W 32-bitowej liczbie ze znakiem skończy się miejsce **19 stycznia 2038 r.
  o 3:14:07 UTC** — to tak zwany problem roku 2038. Nowe systemy używają
  liczb 64-bitowych.

!!! quote "Zasada, którą warto zapamiętać"

    Typ całkowity ma sztywny zakres. Wybierasz go tak, żeby zmieścił
    **największą wartość, jaka może się zdarzyć** — nie tę, którą widzisz
    dziś w danych.

---

## 3. Liczby zmiennoprzecinkowe: float i double

Liczby z częścią ułamkową komputer zapisuje podobnie jak notację naukową:
**znak**, **cyfry znaczące** (mantysa) i **wykładnik** — `1.2345 · 10^3^`.
Dlatego przecinek „pływa”: ta sama liczba bitów wystarcza dla bardzo małych
i bardzo dużych liczb, ale **liczba cyfr znaczących jest ograniczona**.
Prawie wszystkie komputery i języki stosują ten sam standard: **IEEE 754**.

| Typ | Bajty | Cyfry znaczące | Największa wartość |
| --- | :---: | :---: | --- |
| `float` | 4 | ok. 6–7 | ok. 3,4 · 10^38^ |
| `double` | 8 | ok. 15–16 | ok. 1,8 · 10^308^ |

W kodzie C liczba z kropką, np. `0.1`, ma typ `double`. Literka `f` na końcu,
np. `0.1f`, robi z niej `float`.

### Dlaczego 0.1 nie jest dokładnie 0.1

Ułamek 1/3 w systemie dziesiętnym to 0,3333… — nie kończy się. Tak samo
**0,1 w systemie dwójkowym** to nieskończony ułamek. Komputer obcina go na
ostatnim bicie, więc zapisuje liczbę **bardzo bliską** 0,1, ale nie równą.

```c
#include <stdio.h>

int main(void) {
    float f = 0.1f;
    double d = 0.1;
    printf("%.10f\n", f);
    printf("%.20f\n", d);
    printf("%d\n", 0.1 + 0.2 == 0.3);

    float suma = 0.0f;
    for (int i = 0; i < 10; i++) suma = suma + 0.1f;
    printf("%.7f\n", suma);

    printf("%d %f\n", 7 / 2, 7 / 2.0);
    return 0;
}
```

!!! example "Przewiduj"

    Co wypisze każdy z pięciu wierszy? Zwróć uwagę na trzeci: w C porównanie
    daje 1, gdy jest prawdziwe, i 0, gdy fałszywe.

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        0.1000000015
        0.10000000000000000555
        0
        1.0000001
        3 3.500000
        ```

        1. `float` ma ok. 7 cyfr znaczących — dalej widać błąd zapisu.
        2. `double` jest dokładny dużo dłużej, ale też nie do końca.
        3. `0.1 + 0.2` to w `double` 0,30000000000000004 — **nie** jest
           równe `0.3`, więc porównanie daje fałsz.
        4. Dziesięć razy dodane 0,1 nie daje dokładnie 1 — błędy się sumują.
        5. `7 / 2` to dzielenie **dwóch liczb całkowitych**: wynik jest
           całkowity, część ułamkowa przepada. Wystarczy, że jedna liczba
           jest zmiennoprzecinkowa (`2.0`), a wynik ma część ułamkową.

### Pieniądze liczy się w groszach

Błąd na 17. miejscu po przecinku wydaje się niegroźny. Ale paragon sumuje
dziesiątki pozycji, zaokrągla i porównuje kwoty — i nagle brakuje grosza albo
warunek „zapłacono całość” jest fałszywy. Dlatego ceny w programach trzyma się
jako **liczbę całkowitą groszy**: 24,99 zł to `2499`. Działania na liczbach
całkowitych są dokładne. Na złote zamieniasz dopiero przy wyświetlaniu.

!!! quote "Zasada, którą warto zapamiętać"

    Liczb zmiennoprzecinkowych nie porównuj operatorem `==` i nie licz na
    nich pieniędzy. Kwoty trzymaj w groszach, jako liczby całkowite.

---

## 4. Specyfikatory formatu — jak wypisać wartość

Funkcja `printf` (*print formatted*) wypisuje tekst, w który wstawia wartości.
Miejsce i sposób wstawienia wyznacza **specyfikator formatu** — znak `%`
i litera. Litera musi pasować do **typu** wartości.

| Specyfikator | Typ wartości | Przykład | Wynik |
| --- | --- | --- | --- |
| `%c` | `char` — jako znak | `printf("%c", 66)` | `B` |
| `%d` albo `%i` | `int` — dziesiętnie | `printf("%d", -5)` | `-5` |
| `%u` | `unsigned int` | `printf("%u", 40u)` | `40` |
| `%ld`, `%lld` | `long`, `long long` | `printf("%lld", 3000000000LL)` | `3000000000` |
| `%f` | `float` i `double` — 6 miejsc po kropce | `printf("%f", 90.0)` | `90.000000` |
| `%e` | liczba zmiennoprzecinkowa w notacji naukowej | `printf("%e", 1234.5)` | `1.234500e+03` |
| `%x`, `%o` | liczba całkowita szesnastkowo, ósemkowo | `printf("%x", 255)` | `ff` |
| `%s` | tekst | `printf("%s", "Szprycha")` | `Szprycha` |
| `%%` | sam znak procentu | `printf("10%%")` | `10%` |

Między `%` a literą możesz dopisać **szerokość** i **dokładność**:
`%[flagi][szerokość][.dokładność]litera`.

| Zapis | Znaczenie |
| --- | --- |
| `%.2f` | dwa miejsca po kropce — z zaokrągleniem |
| `%8.2f` | razem co najmniej 8 znaków, wyrównane do prawej |
| `%-8d` | 8 znaków, wyrównane do **lewej** (flaga `-`) |
| `%05d` | 5 znaków, z przodu zera zamiast spacji (flaga `0`) |

```c
#include <stdio.h>

int main(void) {
    int rowery = 12;
    double kwota = 1234.5;
    printf("%d rowerow\n", rowery);
    printf("[%4d] [%-4d] [%04d]\n", rowery, rowery, rowery);
    printf("%.2f zl\n", kwota);
    printf("[%10.2f]\n", kwota);
    printf("%e\n", kwota);
    printf("%d %x %o\n", 255, 255, 255);
    return 0;
}
```

!!! example "Przewiduj"

    Napisz w zeszycie dokładnie, co pojawi się na ekranie — razem ze
    spacjami w nawiasach kwadratowych.

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        12 rowerow
        [  12] [12  ] [0012]
        1234.50 zl
        [   1234.50]
        1.234500e+03
        255 ff 377
        ```

        `%10.2f` daje 10 znaków razem z kropką, więc przed `1234.50`
        (7 znaków) stoją trzy spacje. 255 to szesnastkowo `ff`, a ósemkowo
        `377`.

!!! warning "printf i scanf różnią się przy double"

    W `printf` specyfikator `%f` wypisze i `float`, i `double`. Przy
    **wczytywaniu** funkcją `scanf` jest inaczej: `%f` jest dla `float`,
    a dla `double` trzeba napisać `%lf`. Pomyłka nie zatrzyma kompilacji
    (najwyżej ostrzeżenie), ale wczyta śmieci.

Te same specyfikatory znajdziesz w PHP — w funkcjach `printf` i `sprintf`
(sekcja 6). Raz nauczone przydają się w obu językach.

---

## 5. Typy w JavaScripcie

JavaScript nie ma osobnych typów `char`, `int`, `float` i `double`.
Każda liczba ma typ **`number`**, a w środku jest to zawsze **double** —
64-bitowa liczba zmiennoprzecinkowa IEEE 754. Typ wartości podaje operator
**`typeof`**.

| Typ | Przykład | Odpowiednik w C |
| --- | --- | --- |
| `number` | `5`, `5.5`, `-0.25`, `Infinity`, `NaN` | `double` |
| `bigint` | `5n`, `9007199254740993n` | — (dowolnie duża liczba całkowita) |
| `string` | `"Szprycha"`, `'A'` | tablica znaków `char` |
| `boolean` | `true`, `false` | w C: `int` 0 i 1 albo `bool` z `<stdbool.h>` |
| `undefined` | zmienna bez wartości | — |
| `null` | „celowo brak wartości” | — |

Pojedynczy znak to w JavaScripcie po prostu tekst o długości 1. Jego kod
odczytasz metodą `"A".charCodeAt(0)` (wynik `65`), a znak z kodu —
`String.fromCharCode(66)` (wynik `"B"`).

```js
console.log(typeof 5, typeof 5.5, typeof "5", typeof true);
console.log(typeof undefined, typeof null);
console.log(7 / 2, 450 / 0, 0 / 0);
console.log(0.1 + 0.2);
console.log(9007199254740992 + 1);
console.log((19.99 * 3).toFixed(2));
```

!!! example "Przewiduj"

    Przepisz kod do konsoli przeglądarki (++f12++ → **Konsola**) dopiero
    wtedy, gdy zapiszesz w zeszycie swoje przewidywania.

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        number number string boolean
        undefined object
        3.5 Infinity NaN
        0.30000000000000004
        9007199254740992
        59.97
        ```

        - `5` i `5.5` mają ten sam typ — `number`. Dlatego `7 / 2` daje 3,5,
          a nie 3 jak w C.
        - `typeof null` daje `"object"` — to znany błąd z pierwszej wersji
          języka, którego nie da się już poprawić bez psucia starych stron.
        - `450 / 0` to `Infinity`, a `0 / 0` to `NaN` (*not a number*) —
          specjalne wartości typu double, stąd brak błędu.
        - `0.1 + 0.2` — ten sam błąd zapisu co w C.
        - Typ double ma 53 bity precyzji, więc liczby całkowite są dokładne
          tylko do `Number.MAX_SAFE_INTEGER` = 9 007 199 254 740 991. Dalej
          `+ 1` potrafi „zniknąć”. Większe liczby zapisuje się jako `bigint`:
          `9007199254740992n + 1n` daje `9007199254740993n`.
        - `toFixed(2)` zaokrągla do dwóch miejsc i zwraca **tekst** (`string`),
          nie liczbę — nadaje się do wyświetlenia, nie do dalszych obliczeń.

---

## 6. Typy w PHP

PHP ma osobny typ dla liczb całkowitych i dla liczb zmiennoprzecinkowych —
bliżej mu do C niż JavaScriptowi.

| Typ PHP | Przykład | Odpowiednik w C |
| --- | --- | --- |
| `int` | `5`, `-12`, `PHP_INT_MAX` | `long long` (w PHP 64-bitowym — 8 bajtów) |
| `float` | `5.0`, `24.99`, `1.2e3` | `double` |
| `string` | `"Szprycha"`, `'A'` | tablica znaków `char` |
| `bool` | `true`, `false` | `bool` z `<stdbool.h>` |
| `null` | `null` | — |
| `array` | `[90, 60, 45]` | tablica — w kolejnych tematach |

Typ sprawdzisz na trzy sposoby:

- `gettype($x)` — nazwa typu jako tekst. Uwaga: dla liczby zmiennoprzecinkowej
  zwraca **`"double"`**, a nie `"float"` — z powodów historycznych, ale to
  ten sam typ;
- `var_dump($x)` — typ i wartość, np. `float(3.5)`, `string(1) "5"`;
- `is_int($x)`, `is_float($x)`, `is_string($x)`… — zwracają `true` albo `false`.

```php
<?php
var_dump(10 / 5);
var_dump(7 / 2);
echo gettype(2.5), "\n";
echo 0.1 + 0.2, "\n";
var_dump(0.1 + 0.2);
var_dump(PHP_INT_MAX + 1);
```

!!! example "Przewiduj"

    Pierwsze dwa wiersze to dzielenie liczb całkowitych. W C oba dałyby
    liczbę całkowitą. A w PHP?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        int(2)
        float(3.5)
        double
        0.3
        float(0.30000000000000004)
        float(9.223372036854776E+18)
        ```

        - Operator `/` w PHP daje liczbę całkowitą tylko wtedy, gdy dzielenie
          jest **bez reszty**. W pozostałych przypadkach — `float`. Dzielenie
          całkowite jak w C zapewnia funkcja `intdiv(7, 2)` (wynik `3`).
        - `echo` zaokrągla liczbę do 14 cyfr znaczących (ustawienie
          `precision` w `php.ini`), więc pokazuje `0.3`. `var_dump` pokazuje
          wartość dokładniej — i błąd zapisu wychodzi na jaw.
        - Gdy wynik nie mieści się w `int`, PHP **nie przekręca** licznika
          jak C — zamienia liczbę na `float`. Tracisz za to dokładność.

### printf, sprintf i number_format w PHP

PHP ma `printf` (wypisuje) i `sprintf` (zwraca tekst) z tymi samymi
specyfikatorami co C: `%d`, `%u`, `%f`, `%.2f`, `%e`, `%x`, `%c`, `%s`, `%%`,
z szerokością i flagami. Dochodzi `%b` — zapis dwójkowy.

```php
<?php
printf("%5.2f zł | %b | %e\n", 405, 13, 1234.5);
echo number_format(123456.789, 2, ',', ' '), "\n";
```

```text
405.00 zł | 1101 | 1.234500e+3
123 456,79
```

Do kwot po polsku lepsza jest funkcja **`number_format(liczba, miejsca,
przecinek, separator tysięcy)`** — sama wstawi przecinek i spacje.

!!! warning "printf w PHP liczy bajty, nie litery"

    Szerokość w `%10s` to 10 **bajtów**. W UTF-8 polska litera (np. „ł”)
    zajmuje 2 bajty, więc tekst `90,00 zł` liczy się jako 9 znaków, choć
    widzisz 8. Kolumny z polskimi literami wyrównują się dlatego o jedną
    spację mniej — zobaczysz to na paragonie w ćwiczeniu 5.

---

## 7. Który typ wybrać

Najpierw porównanie typów w trzech językach:

| C | JavaScript | PHP |
| --- | --- | --- |
| `char` | `string` o długości 1 | `string` o długości 1 |
| `short`, `int`, `long`, `long long` | `number` (dokładnie do 2^53^ − 1) albo `bigint` | `int` (64 bity) |
| `float`, `double` | `number` | `float` |
| tablica `char` | `string` | `string` |
| `bool` (`<stdbool.h>`) | `boolean` | `bool` |

Dobór typu zaczynasz od pytania: **czy na tej wartości będę liczyć?**

| Informacja | Typ w C | W JS / PHP | Dlaczego |
| --- | --- | --- | --- |
| liczba rowerów w zamówieniu | `unsigned char` albo `int` | `number` / `int` | całkowita, mała |
| cena części | `int` — w groszach | `number` / `int` — w groszach | dokładne sumy co do grosza |
| liczba wyświetleń filmu | `long long` | `number` / `int` | może przekroczyć 2 147 483 647 |
| temperatura z czujnika | `float` | `number` / `float` | ułamek; 6–7 cyfr wystarczy, a zajmuje połowę miejsca |
| zapłacono / nie zapłacono | `bool` | `boolean` / `bool` | tylko dwie wartości |
| ocena literowa (A–F) | `char` | `string` | jeden znak |
| PESEL, numer telefonu, kod pocztowy | tablica `char` | `string` | **nie liczysz** na nich; zero na początku (PESEL osoby urodzonej w 2005 r. zaczyna się od `05`) i znak `+` muszą zostać |

!!! quote "Zasada, którą warto zapamiętać"

    Liczba to coś, na czym liczysz. Numer — PESEL, telefon, kod pocztowy —
    to tekst, nawet jeśli składa się z samych cyfr.

---

## 8. Najczęstsze błędy

| Objaw | Przyczyna | Co zrobić |
| --- | --- | --- |
| `7 / 2` w C daje 3 | dzielenie dwóch liczb całkowitych | jedna z liczb jako zmiennoprzecinkowa: `7 / 2.0` albo `(double) 7 / 2` |
| licznik nagle pokazuje 0 albo liczbę ujemną | przepełnienie typu całkowitego | typ o większym zakresie (`long long`) |
| `printf("%d", 2.5)` wypisuje bzdurę | specyfikator nie pasuje do typu | `%f` dla liczb zmiennoprzecinkowych; kompilator ostrzega — czytaj ostrzeżenia |
| `if (suma == 0.3)` nigdy nie jest prawdziwe | błąd zapisu liczby zmiennoprzecinkowej | licz w groszach albo porównuj z tolerancją |
| suma koszyka różni się o grosz | ceny jako `float` w złotych | ceny w groszach, jako liczby całkowite |
| `"24,99" * 100` w JS daje `NaN` | przecinek zamiast kropki — to nie jest liczba | `tekst.replace(",", ".")` przed `Number()` |
| 0,29 zł zamienia się na 28 groszy | `0.29 * 100` to 28,999999999999996, a `Math.floor` albo `(int)` odcina część ułamkową | `Math.round(…)` w JS, `(int) round(…)` w PHP |
| numer telefonu traci zero albo `+` na początku | numer zapisany jako liczba | numery trzymaj jako tekst |

---

## Ćwiczenia

Ćwiczenia 1–5 są dla wszystkich. Ćwiczenie 6 jest na ocenę dobrą, a 7 — na
bardzo dobrą. Ćwiczenia 1 i 2 robisz na kartce, pozostałe w paczce.

Pobierz paczkę i **rozpakuj katalog `typy` do `C:\xampp\htdocs\`** — ma
powstać `C:\xampp\htdocs\typy\index.html`. Otwórz ten katalog w VS Code:
**File → Open Folder** (w polskiej wersji: **Plik → Otwórz folder**). Stronę
startową otworzysz pod adresem `http://localhost/typy/`.

[:material-folder-zip: Typy — paczka startowa (.zip)](../pliki/typy-start.zip){ .md-button .md-button--primary download="typy-start.zip" }

### :material-console: Ćwiczenie 1 — zakresy i pamięć

Na kartce, bez komputera:

1. Ile różnych wartości mieści typ 16-bitowy? Podaj zakres `short`
   i `unsigned short`.
2. Serwis liczy rowery zmienną typu `unsigned char`. Ile rowerów policzy
   poprawnie? Co pokaże licznik po przyjęciu kolejnego?
3. Czujnik zapisuje temperaturę co minutę przez rok (365 dni). Ile bajtów
   zajmą pomiary zapisane jako `float`, a ile jako `double`?
4. Dobierz najmniejszy typ całkowity z tabeli w sekcji 2 dla: liczby uczniów
   w klasie, roku urodzenia, liczby sekund w roku, liczby milisekund, które
   upłynęły od 1 stycznia 1970 r. (dziś to ponad 1,7 biliona).

??? tip "Podpowiedź 1"

    Typ 16-bitowy to 2^16^ kombinacji. Połowę z nich typ ze znakiem
    przeznacza na liczby ujemne.

??? tip "Podpowiedź 2"

    Minut w roku jest 365 · 24 · 60. Każdy pomiar zajmuje tyle bajtów, ile
    typ: `float` — 4, `double` — 8. W punkcie 4 porównuj największą możliwą
    wartość z górną granicą zakresu.

??? tip "Podpowiedź 3"

    525 600 pomiarów · 4 B = 2 102 400 B (ok. 2,1 MB), a jako `double` —
    dwa razy więcej. Rok urodzenia (np. 2009) nie mieści się w `char`, ale
    mieści się w `short`; 1,7 biliona przekracza zakres `int` i `unsigned int`.

### :material-console: Ćwiczenie 2 — specyfikatory w C

Otwórz w VS Code plik `c/specyfikatory.c` z paczki. **Nie uruchamiaj go** —
w karcie pracy napisz, co wypisze każdy z dziesięciu wierszy z `printf`,
razem ze spacjami. Jeśli chcesz sprawdzić wynik, wklej program do
kompilatora online (np. godbolt.org, przycisk **Execute the code**).

??? tip "Podpowiedź 1"

    Idź wiersz po wierszu i przy każdym specyfikatorze zapytaj: jaki typ ma
    wartość i co mówi liczba przed literą — szerokość czy liczba miejsc po
    kropce?

??? tip "Podpowiedź 2"

    `%f` bez dokładności daje 6 miejsc po kropce. `90 * 5 * 0.9` to 405.
    W `%08.2f` liczba 8 to szerokość całego zapisu razem z kropką, a `0`
    każe dopełnić zerami.

??? tip "Podpowiedź 3"

    Trzy najtrudniejsze wiersze: `[00405.00]`, `1.234567e+06` i `ff`.
    Kod litery `B` to 66.

### :material-console: Ćwiczenie 3 — typy w PHP

1. Otwórz `typy.php` w VS Code. **Zanim uruchomisz**, wpisz w karcie pracy,
   jaki typ poda `gettype()` dla każdego wyrażenia z tablicy `$probki`.
2. Otwórz `http://localhost/typy/typy.php` i porównaj. Przy których
   wyrażeniach się pomyliłeś?
3. Dopisz do tablicy trzy wiersze (miejsce oznaczone `ZADANIE`):
   `PHP_INT_MAX + 1`, `0.1 + 0.2` i `(int) "12abc"`. Odśwież stronę i zapisz
   wyniki. Odczytaj też z dołu strony, ile bajtów ma `int` w twoim PHP.

??? tip "Podpowiedź 1"

    Każdy wiersz tablicy to para: opis w apostrofach (tekst, który zobaczysz
    w tabeli) i samo wyrażenie, które PHP obliczy.

??? tip "Podpowiedź 2"

    Opis z cudzysłowem w środku zapisz w apostrofach: `'(int) "12abc"'`.
    Nie zapomnij o przecinku po każdym wierszu.

??? tip "Podpowiedź 3"

    ```php
    ['PHP_INT_MAX + 1', PHP_INT_MAX + 1],
    ['0.1 + 0.2', 0.1 + 0.2],
    ['(int) "12abc"', (int) "12abc"],
    ```

### :material-console: Ćwiczenie 4 — liczby w konsoli przeglądarki

Otwórz dowolną stronę, naciśnij ++f12++ i przejdź na zakładkę **Konsola**.
Przed każdym wyrażeniem zapisz przewidywanie, potem wpisz je i zapisz wynik:

1. `typeof 3.0`
2. `0.1 + 0.2 === 0.3`
3. `Number.MAX_SAFE_INTEGER + 2`
4. `0.29 * 100`
5. `Math.round(0.29 * 100)`
6. `(1234.5).toFixed(2)` i `typeof (1234.5).toFixed(2)`
7. `"A".charCodeAt(0)`

### :material-console: Ćwiczenie 5 — paragon w groszach

Plik `paragon.php` ma ceny w groszach i trzy miejsca `ZADANIE`:

1. funkcja `zl()` zamienia grosze na tekst w złotych;
2. pętla liczy sumę paragonu — w groszach;
3. każda pozycja ma się wypisać funkcją `printf`: ilość na 3 znakach, cena
   na 10, obie wyrównane do prawej.

Poprawny paragon pod adresem `http://localhost/typy/paragon.php`:

```text
  5 x  90,00 zł  Przegląd podstawowy
  2 x  60,00 zł  Wymiana łańcucha
  3 x  24,99 zł  Dętka 28"
  1 x  18,50 zł  Smar do łańcucha
  1 x  30,00 zł  Tryb ekspresowy
----------------------------------
RAZEM: 693,47 zł
```

Pod paragonem strona pokazuje typ zmiennej `$suma` — ma być `integer`.

??? tip "Podpowiedź 1"

    Zacznij od `zl()` — bez niej żadna kwota się nie pokaże. Grosze dzielisz
    przez 100 dopiero przy wyświetlaniu, a resztę robi `number_format()`
    (sekcja 6).

??? tip "Podpowiedź 2"

    Pętla: `foreach ($pozycje as [$nazwa, $cena, $ilosc]) { … }`, w środku
    `$suma += …`. Specyfikatory w `printf`: `%3d` dla ilości, `%10s` dla
    gotowego tekstu z `zl()`, `%s` dla nazwy.

??? tip "Podpowiedź 3"

    `return number_format($grosze / 100, 2, ',', ' ') . ' zł';` oraz
    `printf("%3d x %10s  %s\n", $ilosc, zl($cena), $nazwa);`. Między `90,00 zł`
    a `x` jest jedna spacja dopełnienia, nie dwie — `%10s` liczy bajty,
    a „ł” zajmuje dwa.

### :material-console: Ćwiczenie 6 — kalkulator części w JavaScripcie

:material-plus-circle: **rozszerzenie**

Na stronie `http://localhost/typy/` jest kalkulator: cena za sztukę (tekst,
z przecinkiem) razy liczba sztuk. W pliku `js/ceny.js` uzupełnij dwie
funkcje: `wGroszach(tekst)` i `naZlote(grosze)`. Sprawdź wszystkie
przypadki — zwłaszcza dwa środkowe:

| Cena | Sztuk | Oczekiwany wynik |
| --- | :---: | --- |
| 24,99 | 3 | Razem: 74,97 zł (7497 gr, typ: number) |
| 0,29 | 100 | Razem: 29,00 zł (2900 gr, typ: number) |
| 1,15 | 100 | Razem: 115,00 zł (11500 gr, typ: number) |
| 90 | 5 | Razem: 450,00 zł (45000 gr, typ: number) |

??? tip "Podpowiedź 1"

    Dwa kroki: najpierw zamień przecinek na kropkę i tekst na liczbę, potem
    pomnóż przez 100. Sprawdź w konsoli, co daje `0.29 * 100`.

??? tip "Podpowiedź 2"

    `tekst.replace(",", ".")`, potem `Number(…)`. Wynik mnożenia zaokrąglij
    funkcją `Math.round()` — `Math.floor()` i `parseInt()` dadzą 28 zamiast 29.
    W `naZlote` przydadzą się `toFixed(2)` i jeszcze raz `replace`.

??? tip "Podpowiedź 3"

    ```js
    return Math.round(Number(tekst.replace(",", ".")) * 100);
    ```

    oraz `return (grosze / 100).toFixed(2).replace(".", ",") + " zł";`

### :material-console: Ćwiczenie 7 — dobierz typ

:material-star: **dopełnienie**

Dla każdej informacji podaj typ w C oraz typ w JavaScripcie i PHP. Uzasadnij
wybór zakresem albo zajmowaną pamięcią — jednym zdaniem:

1. liczba punktów z egzaminu INF.03 (0–40 w części pisemnej);
2. saldo konta klienta serwisu, które może być ujemne, z dokładnością do grosza;
3. kod koloru zapisany w CSS jako `#14213d`;
4. pierwsza litera nazwiska klienta;
5. odległość z serwisu do klienta w kilometrach, z dokładnością do 100 m;
6. numer seryjny ramy roweru, np. `WTU123456789`;
7. czy rower jest na gwarancji;
8. liczba wszystkich wizyt na stronie „Szprychy” od początku jej istnienia.

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła.**

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Ile bajtów zajmuje zmienna typu double?",
  "opcje": ["1", "4", "8", "16"],
  "poprawna": 2,
  "wyjasnienie": "double to liczba zmiennoprzecinkowa podwójnej precyzji: 8 bajtów, ok. 15–16 cyfr znaczących. 4 bajty ma float, 1 bajt — char."
 },
 {
  "pytanie": "Jaki jest zakres typu unsigned char (8 bitów)?",
  "opcje": ["od 0 do 255", "od −128 do 127", "od 0 do 256", "od −255 do 255"],
  "poprawna": 0,
  "wyjasnienie": "8 bitów to 2^8 = 256 kombinacji. Bez znaku: od 0 do 255 — 256 to już dziewiąty bit. Zakres −128 … 127 ma signed char."
 },
 {
  "pytanie": "Co wypisze w C instrukcja printf(\"%d\", 7 / 2);?",
  "odpowiedz": ["3"],
  "wyjasnienie": "7 i 2 są liczbami całkowitymi, więc dzielenie jest całkowite i część ułamkowa przepada. 3,5 dałoby 7 / 2.0 i specyfikator %f."
 },
 {
  "pytanie": "Który specyfikator wypisze cenę 24.99 jako 24.99 — z dokładnie dwoma miejscami po kropce?",
  "opcje": ["%d", "%2f", "%.2f", "%c"],
  "poprawna": 2,
  "wyjasnienie": "Kropka przed liczbą oznacza dokładność: %.2f to dwa miejsca po kropce. %2f to szerokość 2 znaków przy domyślnych 6 miejscach, a %d jest dla liczb całkowitych."
 },
 {
  "pytanie": "Dlaczego w JavaScripcie 0.1 + 0.2 === 0.3 daje false?",
  "opcje": ["Bo === porównuje też typy, a 0.3 jest tekstem", "Bo 0.1 i 0.2 nie mają dokładnego zapisu dwójkowego, więc suma to 0.30000000000000004", "Bo JavaScript zaokrągla do jednego miejsca po kropce", "Bo dodawanie liczb ułamkowych wymaga funkcji Math.add"],
  "poprawna": 1,
  "wyjasnienie": "0,1 w systemie dwójkowym to ułamek nieskończony, jak 1/3 w dziesiętnym. Zapis jest obcięty, więc suma jest minimalnie większa od 0,3. Oba porównywane wyrażenia są liczbami (number)."
 },
 {
  "pytanie": "Co wypisze w PHP echo gettype(5.0);?",
  "opcje": ["float", "integer", "number", "double"],
  "poprawna": 3,
  "wyjasnienie": "gettype() z powodów historycznych zwraca \"double\" dla liczb zmiennoprzecinkowych — to ten sam typ, który var_dump pokazuje jako float. Napis number to typ z JavaScriptu."
 },
 {
  "pytanie": "Jak zapisać w programie sklepu cenę 24,99 zł, żeby sumy zgadzały się co do grosza?",
  "opcje": ["Jako liczbę całkowitą groszy: 2499", "Jako float w złotych: 24.99", "Jako tekst \"24,99 zł\"", "Jako float zaokrąglany do jednego miejsca: 25.0"],
  "poprawna": 0,
  "wyjasnienie": "Działania na liczbach całkowitych są dokładne. Float w złotych ma błędy zapisu, które przy sumowaniu i zaokrąglaniu dają różnicę grosza, a na tekście nie da się liczyć."
 },
 {
  "pytanie": "Jakiego typu użyjesz do przechowania numeru PESEL?",
  "opcje": ["int, bo to same cyfry", "float, bo liczba jest długa", "string (tekst)", "bool"],
  "poprawna": 2,
  "wyjasnienie": "Na PESEL-u się nie liczy, a zero na początku (osoby urodzone od 2000 r.) musi zostać — liczba by je zgubiła. Poza tym 11 cyfr nie mieści się w 32-bitowym int."
 }
]
</script>
</div>

---

## Karta pracy

Z tego tematu oddajesz **kartę pracy** oraz **spakowany katalog `typy`**
z uzupełnionymi plikami `typy.php`, `paragon.php` i — jeśli robiłeś
ćwiczenie 6 — `js/ceny.js`. Kartę wypełniaj w trakcie ćwiczeń: wpisuj
przewidywania **przed** uruchomieniem, a wyniki — po.

<div class="kp-podsumowanie" data-karta="typy-danych"></div>

<span id="karta" class="kp-kotwica"></span>

???+ karta "Rozwiń kartę pracy"

    !!! info "Twoje odpowiedzi zostają na twoim komputerze"

        Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
        przycisku. Wyczyszczenie danych przeglądania usunie odpowiedzi — kiedy
        skończysz, pobierz plik.

    <div class="karta-pracy" data-karta="typy-danych"></div>

### Jak ją oddać

1. Katalog `C:\xampp\htdocs\typy` spakuj do `4TI_<numer w dzienniku>_typy.zip`.
2. Pobierz kartę pracy przyciskiem pod formularzem.
3. Oba pliki dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *Wbudowane typy danych — karta pracy*.

---

Poprzedni temat: [Środowisko programistyczne — edytor, kompilator, translator, linker, debugger](srodowisko-programistyczne.md).
Następny temat: [Deklaracja stałych i zmiennych w odniesieniu do wbudowanych typów danych](deklaracja-stalych-zmiennych.md).

!!! info "Materiały uzupełniające"

    - Typy danych w JavaScripcie (po angielsku): [developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
    - Typy w PHP (po angielsku): [php.net/manual/en/language.types.php](https://www.php.net/manual/en/language.types.php)
    - Funkcja sprintf i jej specyfikatory (po angielsku): [php.net/manual/en/function.sprintf.php](https://www.php.net/manual/en/function.sprintf.php)
    - Liczby zmiennoprzecinkowe — dlaczego 0.1 + 0.2 ≠ 0.3 (po angielsku): [0.30000000000000004.com](https://0.30000000000000004.com/)
    - Compiler Explorer — sprawdzisz w nim programy w C: [godbolt.org](https://godbolt.org/)
