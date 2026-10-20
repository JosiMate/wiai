# Własne typy danych – typ wyliczeniowy, unie, klasy, tablice

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział III. Podstawy programowania — środowisko i dane
    · efekt kształcenia **INF.03.5.2**

    Typy wbudowane — `int`, `double`, `char`, `string` — przechowują jedną
    wartość. Serwis rowerowy potrzebuje więcej: cennika z kilkunastoma
    usługami, zlecenia, które ma numer, rower, cenę i status, listy wszystkich
    rowerów klienta. Takie dane programista składa z typów wbudowanych w
    **typy złożone**: tablice, typy wyliczeniowe, struktury, unie i klasy.

    Na tym temacie poznasz je w C, JavaScripcie i PHP. Zobaczysz, że C każe
    zadeklarować kształt danych z góry, a JavaScript i PHP pozwalają budować go
    w trakcie — i co z tego wynika. Na następnym temacie klasy dostaną metody.

    ??? abstract "Plan trzech lekcji"

        | Lekcja | Sekcje | Ćwiczenia |
        | :---: | --- | --- |
        | 1 | 1–4: po co typy złożone; tablice w C, JavaScripcie i PHP (indeksowane i asocjacyjne) | 1, 2, 3 |
        | 2 | 5–8: typ wyliczeniowy, struktura i unia w C; obiekt w JavaScripcie i tablica asocjacyjna jako „struktura” | 4, 5, 6 |
        | 3 | 9–12: klasa w JavaScripcie i PHP, `enum` w PHP, porównanie trzech języków, najczęstsze błędy | 7, 8; quiz |

??? rozgrzewka "Na rozgrzewkę — 3 minuty, bez zaglądania"

    Odpowiedz w zeszycie, zanim zaczniesz nowy temat. Odpowiedzi rozwiń
    dopiero wtedy, gdy wszyscy skończą — nie liczą się do oceny.

    1. **Z poprzedniej lekcji.** Co wypisze w PHP `var_dump("5" + 3);`,
       a co w JavaScripcie `console.log("5" + 3);`?
    2. **Sprzed kilku tygodni.** Ile bajtów zajmuje w C jeden `char`, a ile
       `int`?
    3. **Z dawniejszych tematów.** Którymi znacznikami HTML zapiszesz listę
       numerowaną z trzema pozycjami?

    ??? success "Odpowiedzi"

        1. PHP: `int(8)` — `+` zawsze dodaje. JavaScript: `"53"` — `+`
           z napisem skleja.
        2. `char` — 1 bajt, `int` — zwykle 4 bajty. Dziś policzysz, ile zajmuje
           tablica pięciu `int`-ów i cała struktura.
        3. `<ol>` i trzy `<li>`. Lista to w HTML-u to samo, co tablica
           w programie: wiele wartości pod jedną nazwą, w ustalonej kolejności.

!!! success "Kryteria sukcesu — sprawdź się na koniec tematu"

    Po tym temacie:

    1. Utworzę tablicę w C, JavaScripcie i PHP i odczytam jej element po indeksie, pamiętając, że numeracja zaczyna się od 0.
    2. Utworzę w PHP tablicę asocjacyjną i wypiszę ją pętlą `foreach`.
    3. Zdefiniuję typ wyliczeniowy (`enum` w C i PHP, zamrożony obiekt w JavaScripcie) i wyjaśnię, dlaczego jest lepszy od gołych liczb i napisów.
    4. Zdefiniuję strukturę w C i zapiszę te same dane jako obiekt w JavaScripcie i tablicę asocjacyjną w PHP.
    5. Wyjaśnię, czym unia różni się od struktury, i przewidzę rozmiar obu.
    6. Zdefiniuję prostą klasę z konstruktorem w JavaScripcie i PHP i utworzę jej obiekty.
    7. Dobiorę rodzaj typu złożonego (tablica, typ wyliczeniowy, struktura, unia, klasa) do informacji z życia i uzasadnię wybór.

---

## 1. Po co własne typy danych

Typ prosty przechowuje **jedną** wartość: cenę, wiek, literę. Dane z życia
zwykle mają wiele części albo wiele sztuk. Zamiast dwudziestu osobnych
zmiennych `cena1`, `cena2`… programista tworzy **typ złożony** — jedną
nazwę dla całej grupy wartości.

| Rodzaj typu | Co przechowuje | Przykład z serwisu | C | JavaScript | PHP |
| --- | --- | --- | --- | --- | --- |
| **tablica** | wiele wartości jednego rodzaju, numerowanych od 0 | ceny pięciu części | `int ceny[5]` | `[...]` | `[...]` |
| **tablica asocjacyjna** | wartości pod nazwanymi kluczami | cennik: usługa → cena | — | obiekt `{...}` | `['klucz' => ...]` |
| **typ wyliczeniowy** | jedną wartość z zamkniętej listy | status zlecenia | `enum` | zamrożony obiekt | `enum` (PHP 8.1+) |
| **struktura** | kilka pól różnych typów o jednym przeznaczeniu | zlecenie: numer, rower, cena | `struct` | obiekt `{...}` | tablica asocjacyjna |
| **unia** | jedno z kilku pól — wszystkie w tym samym miejscu pamięci | kwota w groszach **albo** w złotych | `union` | — | — |
| **klasa** | szablon, z którego powstaje wiele obiektów | każdy rower w serwisie | — (C nie ma klas) | `class` | `class` |

!!! quote "Zasada, którą warto zapamiętać"

    Typ złożony to nowa nazwa dla **kształtu** danych. Raz go opisujesz,
    a potem tworzysz tyle wartości tego kształtu, ile potrzebujesz.

---

## 2. Tablica w C: stały rozmiar, jeden typ

Tablica w C to ciąg elementów **tego samego typu**, ułożonych w pamięci
jeden za drugim. Rozmiar podajesz przy deklaracji i nie zmienia się on do
końca programu.

```c
int ceny[5] = {2500, 4500, 9000, 1200, 3000};   /* ceny w groszach */
int sprzedane[4] = {3};                         /* reszta dostaje 0 */
char serwis[] = "Szprycha";                     /* rozmiar policzy kompilator */

printf("%d\n", ceny[0]);        /* pierwszy element: 2500 */
printf("%d\n", ceny[4]);        /* ostatni element:  3000 */
ceny[1] = 4900;                 /* zmiana drugiego elementu */
```

- Elementy numerujemy **od 0**. Tablica pięciu elementów ma indeksy 0–4.
- Gdy podasz mniej wartości niż rozmiar, reszta dostaje `0`.
- Napis w C to tablica znaków zakończona niewidocznym znakiem `'\0'`.
  Dlatego `"Szprycha"` (8 liter) zajmuje 9 bajtów.
- `sizeof ceny` to rozmiar całej tablicy w bajtach, a
  `sizeof ceny / sizeof ceny[0]` — liczba elementów.

```c
int ceny[5] = {2500, 4500, 9000, 1200, 3000};
printf("%zu %zu\n", sizeof ceny, sizeof ceny / sizeof ceny[0]);
printf("%d\n", ceny[5]);
```

!!! example "Przewiduj"

    Co wypisze pierwszy `printf`? A co drugi — czy program zgłosi błąd?

    ??? success "Przewiduj, potem sprawdź wynik"

        Pierwszy: `20 5` — pięć `int`-ów po 4 bajty i pięć elementów.

        Drugi wypisze **przypadkową liczbę** (np. `32766`) bez żadnego błędu.
        Indeks 5 jest już poza tablicą, a C **nie sprawdza granic** — czyta
        pamięć, która leży za tablicą. To jeden z najgroźniejszych błędów
        w C: program działa, tylko liczy źle.

---

## 3. Tablica w JavaScripcie: rośnie i trzyma wszystko

Tablica w JavaScripcie nie ma stałego rozmiaru ani jednego typu. Zapisujesz
ją w nawiasach kwadratowych.

```js
const czesci = ["dętka", "łańcuch", "klocki"];
console.log(czesci[0]);                    // "dętka"
console.log(czesci.length);                // 3 — liczba elementów
console.log(czesci[czesci.length - 1]);    // "klocki" — ostatni element
czesci.push("linka");                      // dopisanie na koniec
```

Zauważ `const`: stała pilnuje, żeby nazwa `czesci` wskazywała ciągle **tę
samą** tablicę — ale jej zawartość wolno zmieniać (temat o deklaracjach,
sekcja 6).

```js
const czesci = ["dętka", "łańcuch", "klocki"];
console.log(czesci[3]);
czesci[5] = "siodełko";
console.log(czesci.length);
console.log(typeof czesci);
```

!!! example "Przewiduj"

    Co wypiszą trzy wiersze `console.log`?

    ??? success "Przewiduj, potem sprawdź wynik"

        1. `undefined` — elementu o indeksie 3 nie ma, ale JavaScript nie
           zgłasza błędu.
        2. `6` — przypisanie do indeksu 5 wydłużyło tablicę, a miejsca 3 i 4
           zostały puste.
        3. `"object"` — tablica jest w JavaScripcie obiektem. Czy coś jest
           tablicą, sprawdzisz przez `Array.isArray(czesci)`.

---

## 4. Tablice w PHP: indeksowane i asocjacyjne

PHP ma jeden typ `array`, ale używa się go na dwa sposoby.

**Tablica indeksowana** — klucze to kolejne liczby od 0:

```php
<?php
$czesci = ['dętka', 'łańcuch'];
$czesci[] = 'klocki';          // [] bez numeru — dopisanie na koniec
echo $czesci[2];               // klocki
echo count($czesci);           // 3
```

**Tablica asocjacyjna** — klucze to napisy, które sam wybierasz:

```php
<?php
$cennik = [
    'przegląd'      => 90,
    'wymiana dętki' => 35,
];
$cennik['wymiana linki'] = 30;          // nowa usługa
echo $cennik['przegląd'];               // 90

foreach ($cennik as $usluga => $cena) {
    echo "$usluga: $cena zł<br>";
}
```

Pętla `foreach` przechodzi po kolei przez wszystkie pary klucz → wartość.
Do podejrzenia całej tablicy służą `print_r($cennik)` i `var_dump($cennik)`.

```php
<?php
$cennik = ['przegląd' => 90, 'wymiana dętki' => 35];
echo $cennik[0];
echo $cennik['Przegląd'];
```

!!! example "Przewiduj"

    Co pokażą oba wiersze `echo`?

    ??? success "Przewiduj, potem sprawdź wynik"

        Oba dadzą ostrzeżenie i pustą wartość:
        `Warning: Undefined array key 0` oraz
        `Warning: Undefined array key "Przegląd"`.
        Tablica asocjacyjna nie ma numerów 0, 1, 2 — tylko klucze, które jej
        nadałeś. A klucze rozróżniają wielkość liter: `'Przegląd'` to inny
        klucz niż `'przegląd'`.

!!! quote "Zasada, którą warto zapamiętać"

    Tablica indeksowana: „który z kolei?”. Tablica asocjacyjna: „który
    o tej nazwie?”. Gdy pytasz o coś, czego w tablicy nie ma, C czyta
    śmieci, JavaScript daje `undefined`, a PHP — ostrzeżenie.

---

## 5. Typ wyliczeniowy: zamknięta lista wartości

Zlecenie w serwisie ma zawsze jeden z czterech statusów. Gdyby zapisywać go
napisem, literówka `"gotowy"` zamiast `"gotowe"` przeszłaby niezauważona.
**Typ wyliczeniowy** (ang. *enumeration*) wymienia wszystkie dozwolone
wartości i nadaje im nazwy.

```c
enum Status { PRZYJETE, W_NAPRAWIE, GOTOWE, ODEBRANE };

enum Status s = W_NAPRAWIE;
if (s == GOTOWE)
    printf("Zadzwon do klienta\n");
printf("%d\n", s);              /* 1 */
```

W C każda nazwa to po prostu liczba całkowita: kolejno 0, 1, 2, 3. Wartość
możesz też nadać sam — następne liczą się dalej od niej.

```c
enum Rozmiar { S = 1, M, L = 10, XL };
printf("%d %d\n", M, XL);
```

!!! example "Przewiduj"

    Co wypisze `printf`?

    ??? success "Przewiduj, potem sprawdź wynik"

        `2 11`. `M` jest następne po `S = 1`, więc 2. `XL` jest następne po
        `L = 10`, więc 11.

**JavaScript nie ma słowa `enum`.** Zastępuje go obiekt ze stałymi,
zamrożony funkcją `Object.freeze`, żeby nikt nie zmienił jego wartości:

```js
const STATUS = Object.freeze({
  PRZYJETE: "przyjęte",
  W_NAPRAWIE: "w naprawie",
  GOTOWE: "gotowe",
  ODEBRANE: "odebrane",
});

let status = STATUS.W_NAPRAWIE;
STATUS.GOTOWE = "zrobione";      // zignorowane — obiekt jest zamrożony
console.log(STATUS.GOTOWE);      // "gotowe"
console.log(STATUS.GOTWE);       // undefined — literówka nie daje błędu!
```

Zamrożenie chroni wartości, ale literówki w nazwie JavaScript nie wyłapie.
W PHP od wersji 8.1 jest prawdziwy `enum` — wrócisz do niego w sekcji 10.

---

## 6. Struktura w C: kilka pól pod jedną nazwą

**Struktura** (`struct`) łączy kilka wartości różnych typów, które opisują
jedną rzecz. Najpierw opisujesz jej kształt, potem tworzysz zmienne tego
typu.

```c
struct Rower {
    char marka[20];
    int rok;
    double przebieg;
};

struct Rower r = {"Kross", 2021, 1250.5};
r.przebieg = r.przebieg + 30;           /* dostęp do pola: kropka */
printf("%s %d %.1f\n", r.marka, r.rok, r.przebieg);   /* Kross 2021 1280.5 */
```

- Opis `struct Rower { ... };` nie tworzy jeszcze żadnej zmiennej — to tylko
  przepis. Średnik po klamrze jest obowiązkowy.
- Do pola sięgasz kropką: `r.rok`.
- Pola zajmują **osobne** miejsca w pamięci, jedno za drugim.

```c
struct Mala {
    char klasa;
    int rok;
};
printf("%zu\n", sizeof(struct Mala));
```

!!! example "Przewiduj"

    `char` ma 1 bajt, `int` — 4. Ile bajtów zajmie cała struktura?

    ??? success "Przewiduj, potem sprawdź wynik"

        Na typowym komputerze **8**, a nie 5. Kompilator dopycha między
        polami puste bajty (ang. *padding*), żeby `int` zaczynał się pod
        adresem podzielnym przez 4 — procesor czyta go wtedy szybciej.
        Rozmiar struktury sprawdzaj więc zawsze przez `sizeof`, a nie
        dodając w pamięci.

---

## 7. Unia w C: kilka pól w jednym miejscu

**Unia** (`union`) wygląda jak struktura, ale wszystkie jej pola leżą
**w tym samym miejscu pamięci**. W danej chwili ma sens tylko to pole,
które zapisałeś ostatnio. Unia zajmuje tyle, ile jej największe pole.

```c
union Kwota {
    int grosze;      /* 4 bajty */
    double zlote;    /* 8 bajtów */
};

union Kwota k;
k.grosze = 12500;
printf("%d\n", k.grosze);
k.zlote = 125.0;
printf("%d\n", k.grosze);
printf("%zu\n", sizeof(union Kwota));
```

!!! example "Przewiduj"

    Co wypiszą trzy wiersze `printf`?

    ??? success "Przewiduj, potem sprawdź wynik"

        1. `12500` — pole `grosze` zapisane przed chwilą.
        2. Na typowym komputerze (x86) **`0`**. Zapis `zlote` nadpisał te
           same bajty, a liczba 125.0 zapisana jako `double` ma w miejscu
           pierwszych czterech bajtów same zera. Wartość `12500` zniknęła.
        3. `8` — rozmiar największego pola. Struktura z tymi samymi polami
           zajęłaby co najmniej 12 bajtów.

| | `struct` | `union` |
| --- | --- | --- |
| pola w pamięci | każde osobno | wszystkie w tym samym miejscu |
| rozmiar | suma pól (plus *padding*) | największe pole |
| ile pól ma sens naraz | wszystkie | jedno — ostatnio zapisane |
| po co | opis jednej rzeczy z wieloma cechami | oszczędność pamięci, gdy wartość jest **albo** jednego, **albo** drugiego rodzaju |

Unie spotkasz w programach na mikrokontrolery i w obsłudze formatów plików.
JavaScript i PHP ich nie mają — tam zmienna i tak może przechowywać wartość
dowolnego typu.

---

## 8. Struktura bez deklaracji: obiekt w JS, tablica w PHP

W JavaScripcie i PHP nie musisz opisywać kształtu danych z góry. Te same
informacje co `struct Rower` zapiszesz od razu:

=== "JavaScript — obiekt"

    ```js
    const rower = { marka: "Kross", rok: 2021, przebieg: 1250.5 };
    console.log(rower.marka);       // "Kross"
    console.log(rower["rok"]);      // 2021 — drugi sposób dostępu
    rower.kolor = "czerwony";       // nowe pole można dopisać w każdej chwili
    console.log(rower.waga);        // undefined — takiego pola nie ma
    ```

=== "PHP — tablica asocjacyjna"

    ```php
    <?php
    $rower = ['marka' => 'Kross', 'rok' => 2021, 'przebieg' => 1250.5];
    echo $rower['marka'];           // Kross
    $rower['kolor'] = 'czerwony';   // nowy klucz
    print_r($rower);
    ```

Wiele takich rekordów trzymasz w tablicy — to najczęstszy kształt danych
w aplikacjach internetowych (tak samo wyglądają wiersze z bazy danych):

```js
const zlecenia = [
  { nr: 101, rower: "Kross Hexagon", status: STATUS.GOTOWE },
  { nr: 102, rower: "Romet Orkan", status: STATUS.W_NAPRAWIE },
];
console.log(zlecenia[1].rower);     // "Romet Orkan"
console.table(zlecenia);            // ładna tabela w konsoli
```

!!! example "Przewiduj"

    ```js
    const a = { nr: 101 };
    const b = a;
    b.nr = 999;
    console.log(a.nr);
    ```

    ??? success "Przewiduj, potem sprawdź wynik"

        `999`. `b = a` nie kopiuje obiektu, tylko daje mu **drugą nazwę** —
        `a` i `b` wskazują ten sam obiekt. Tak samo działają tablice
        w JavaScripcie. (W PHP przypisanie tablicy robi kopię — tam wynik
        byłby inny.)

Wygoda ma cenę: literówka w nazwie pola (`rower.mraka`) nie daje błędu,
tylko `undefined` w JavaScripcie albo ostrzeżenie w PHP. Kompilator C taki
błąd zatrzymałby od razu. Porządek wprowadzają **klasy**.

---

## 9. Klasa: szablon obiektów

**Klasa** opisuje, jakie pola ma mieć każdy obiekt danego rodzaju.
Obiekty tworzysz słowem `new`, a wartości pól ustawia **konstruktor** —
specjalna funkcja wywoływana przy tworzeniu obiektu.

=== "JavaScript"

    ```js
    class Rower {
      constructor(marka, rok) {
        this.marka = marka;     // this — „ten obiekt, który właśnie powstaje”
        this.rok = rok;
      }
    }

    const r1 = new Rower("Kross", 2021);
    const r2 = new Rower("Romet", 2019);
    console.log(r1.marka, r2.rok);         // Kross 2019
    console.log(r1 instanceof Rower);      // true
    ```

=== "PHP"

    ```php
    <?php
    class Rower
    {
        public string $marka;
        public int $rok;

        public function __construct(string $marka, int $rok)
        {
            $this->marka = $marka;
            $this->rok = $rok;
        }
    }

    $r1 = new Rower('Kross', 2021);
    echo $r1->marka;                       // Kross — w PHP strzałka zamiast kropki
    ```

Klasa w PHP może mieć **typy pól** (`public int $rok`). PHP pilnuje ich
przy każdym przypisaniu:

```php
<?php
$r1 = new Rower('Kross', 2021);
$r1->rok = "2019";
var_dump($r1->rok);
$r1->rok = "dwa tysiące";
```

!!! example "Przewiduj"

    Co pokaże `var_dump`? Co się stanie w ostatnim wierszu?

    ??? success "Przewiduj, potem sprawdź wynik"

        `int(2019)` — napis wyglądający jak liczba PHP zamienił na `int`.
        Ostatni wiersz kończy skrypt błędem
        `TypeError: Cannot assign string to property Rower::$rok of type int`.
        Typ pola działa jak strażnik — podobnie jak typ zmiennej w C.

| | JavaScript | PHP |
| --- | --- | --- |
| definicja | `class Rower { ... }` | `class Rower { ... }` |
| konstruktor | `constructor(...)` | `public function __construct(...)` |
| pole wewnątrz klasy | `this.marka` | `$this->marka` |
| utworzenie obiektu | `new Rower("Kross", 2021)` | `new Rower('Kross', 2021)` |
| dostęp do pola | `r1.marka` | `$r1->marka` |
| typy pól | nie ma | `public int $rok` |

Klasy potrafią też **działać** — mieć własne funkcje (metody), np.
`r1.dodajPrzebieg(30)`. To temat następnej lekcji.

---

## 10. Enum w PHP 8

Od PHP 8.1 typ wyliczeniowy jest wbudowany w język. Każdy przypadek (`case`)
może mieć wartość — napis albo liczbę.

```php
<?php
enum Status: string
{
    case Przyjete  = 'przyjęte';
    case WNaprawie = 'w naprawie';
    case Gotowe    = 'gotowe';
    case Odebrane  = 'odebrane';
}

$s = Status::Gotowe;
echo $s->value;                      // gotowe — wartość do wyświetlenia
echo $s->name;                       // Gotowe — nazwa przypadku
var_dump($s === Status::Gotowe);     // bool(true)
```

Najważniejsza zaleta: enum może być **typem parametru** i typem pola klasy.

```php
<?php
class Zlecenie
{
    public function __construct(public int $nr, public Status $status) {}
}

$z1 = new Zlecenie(101, Status::Gotowe);
$z2 = new Zlecenie(102, 'gotowe');
```

!!! example "Przewiduj"

    Który wiersz przejdzie, a który nie?

    ??? success "Przewiduj, potem sprawdź wynik"

        `$z1` powstanie. `$z2` kończy skrypt błędem `TypeError`:
        *Argument #2 ($status) must be of type Status, string given*.
        Napis `'gotowe'` to nie to samo co `Status::Gotowe` — PHP nie
        przepuści literówki ani zwykłego tekstu.

        Gdy status przychodzi jako tekst (z formularza albo bazy danych),
        zamień go: `Status::from('gotowe')` daje `Status::Gotowe`,
        a dla nieznanej wartości zgłasza błąd `ValueError`.
        `Status::tryFrom('zepsute')` zamiast błędu zwraca `null`.

(Zapis `public int $nr` wewnątrz nawiasów konstruktora to skrót z PHP 8 —
deklaruje pole i od razu przypisuje mu parametr.)

---

## 11. Jedna informacja — trzy języki

| Informacja | C | JavaScript | PHP |
| --- | --- | --- | --- |
| ceny pięciu części | `int ceny[5] = {...};` | `const ceny = [...];` | `$ceny = [...];` |
| cennik usług | — (tablica struktur) | `const cennik = { "przegląd": 90 };` | `$cennik = ['przegląd' => 90];` |
| status zlecenia | `enum Status { ... };` | `const STATUS = Object.freeze({ ... });` | `enum Status: string { ... }` |
| jeden rower | `struct Rower { ... };` | `{ marka: "Kross", rok: 2021 }` | `['marka' => 'Kross', 'rok' => 2021]` |
| kwota: grosze albo złote | `union Kwota { ... };` | — | — |
| wiele rowerów jednego kształtu | tablica struktur `struct Rower r[10];` | `class Rower` + tablica obiektów | `class Rower` + tablica obiektów |

!!! quote "Zasada, którą warto zapamiętać"

    W C najpierw opisujesz kształt danych (`struct`, `enum`, rozmiar tablicy)
    i kompilator pilnuje go za ciebie. W JavaScripcie i PHP kształt budujesz
    w trakcie — szybciej, ale literówki wychodzą dopiero w działaniu.
    Klasa i `enum` przywracają porządek tam, gdzie dane są ważne.

---

## 12. Najczęstsze błędy

| Objaw | Przyczyna | Co zrobić |
| --- | --- | --- |
| C: przypadkowa liczba albo awaria programu | indeks poza tablicą, np. `ceny[5]` w tablicy pięciu elementów | ostatni indeks to rozmiar − 1; pętla `i < 5`, nie `i <= 5` |
| C: błąd `expected ';' ...` w wierszu **za** opisem struktury | brak średnika po `}` w `struct ... { ... }` | `};` |
| C: pole unii ma „dziwną” wartość | odczyt innego pola niż ostatnio zapisane | czytaj to pole, które zapisałeś |
| JS: `undefined` zamiast wartości | indeks poza tablicą albo literówka w nazwie pola | sprawdź `length` i nazwę pola |
| JS: ostatni element to `undefined` | `czesci[czesci.length]` | ostatni to `czesci[czesci.length - 1]` |
| JS: `TypeError: Class constructor Rower cannot be invoked without 'new'` | `Rower(...)` bez `new` | `new Rower(...)` |
| JS: zmiana jednego obiektu zmienia drugi | `b = a` daje drugą nazwę temu samemu obiektowi | to zamierzone — kopię robi się osobno |
| PHP: `Warning: Undefined array key "..."` | klucz z literówką albo inną wielkością liter | klucz co do litery; `$t['klucz'] ?? 0` |
| PHP: `TypeError: ... must be of type Status, string given` | zwykły napis zamiast przypadku enuma | `Status::Gotowe` albo `Status::from('gotowe')` |
| PHP: `Error: Typed property ... must not be accessed before initialization` | konstruktor nie przypisał wartości któremuś polu | przypisz w konstruktorze wszystkie pola |

---

## Ćwiczenia

Ćwiczenia 1–4 i 6 są dla wszystkich. Ćwiczenia 5 i 7 są na ocenę dobrą,
a 8 — na bardzo dobrą. Ćwiczenia 1, 4 i 6 robisz na kartce albo w karcie
pracy, pozostałe w paczce.

Pobierz paczkę i **rozpakuj katalog `wlasne-typy` do `C:\xampp\htdocs\`** —
ma powstać `C:\xampp\htdocs\wlasne-typy\index.html`. Otwórz ten katalog
w VS Code: **File → Open Folder** (w polskiej wersji: **Plik → Otwórz
folder**). Stronę startową otworzysz pod adresem
`http://localhost/wlasne-typy/`, a wyniki skryptów zobaczysz w konsoli:
++f12++ → **Konsola**.

[:material-folder-zip: Własne typy — paczka startowa (.zip)](../pliki/wlasne-typy-start.zip){ .md-button .md-button--primary download="wlasne-typy-start.zip" }

### :material-console: Ćwiczenie 1 — tablice w C

Otwórz w VS Code plik `c/tablice.c` z paczki. **Nie uruchamiaj go.**
W karcie pracy:

1. Napisz, co wypisze każdy z pięciu wierszy z `printf`.
2. Jaki jest indeks ostatniego elementu tablicy `ceny`?
3. Dlaczego napis `"Szprycha"` zajmuje 9 bajtów, skoro ma 8 liter?
4. Co się stanie, gdy usuniesz komentarz wokół wiersza A?

Jeśli chcesz sprawdzić wynik, wklej program do kompilatora online
(np. godbolt.org, przycisk **Execute the code**).

??? tip "Podpowiedź 1"

    Indeksy zaczynają się od 0, więc `ceny[4]` to piąty, ostatni element.
    Sumę policz na kartce: 2500 + 4500 + 9000 + 1200 + 3000.

??? tip "Podpowiedź 2"

    `int sprzedane[4] = {3};` — podana jest tylko pierwsza wartość, reszta
    dostaje 0. `sizeof` zwraca bajty: pięć `int`-ów po 4 bajty.

??? tip "Podpowiedź 3"

    Na końcu każdego napisu w C stoi znak `'\0'` — po nim `printf` poznaje,
    gdzie napis się kończy. Wiersz A sięga za tablicę — przeczytaj jeszcze raz
    ramkę „Przewiduj” w sekcji 2.

### :material-console: Ćwiczenie 2 — tablica części

Otwórz `js/czesci.js` i uzupełnij miejsca oznaczone `ZADANIE`:

1. Stała tablica `czesci` z trzema nazwami; wypisz liczbę elementów,
   pierwszy i ostatni element.
2. Dopisz `"linka hamulcowa"` metodą `push` i wypisz nową liczbę elementów.
3. Wypisz `czesci[10]`.
4. Wypisz wszystkie części z numerami od 1 — pętla jest przygotowana
   w komentarzu.

Zapisz plik, odśwież `http://localhost/wlasne-typy/` i przepisz wyniki do
karty pracy.

??? tip "Podpowiedź 1"

    Tablicę zapisujesz w nawiasach kwadratowych, elementy rozdzielasz
    przecinkami: `const czesci = ["dętka 28 cali", "łańcuch", ...];`

??? tip "Podpowiedź 2"

    `czesci.length` to liczba elementów. Ostatni element ma indeks o jeden
    mniejszy: `czesci[czesci.length - 1]`.

??? tip "Podpowiedź 3"

    W pętli w miejscu `...` wstaw `czesci[i]`. Numer dla człowieka to `i + 1`,
    bo indeksy liczą się od 0.

### :material-console: Ćwiczenie 3 — cennik w PHP

Otwórz `cennik.php`. Tablica `$cennik` jest asocjacyjna: usługa → cena.

1. `ZADANIE 1`: dopisz usługę `'wymiana linki'` za 30 zł jednym
   przypisaniem.
2. `ZADANIE 2`: wypisz w akapicie cenę przeglądu odczytaną z tablicy.
3. `ZADANIE 3`: usuń `/*` i `*/` wokół pętli `foreach` w tabeli, a w części
   PHP policz sumę wszystkich cen.
4. Otwórz `http://localhost/wlasne-typy/cennik.php`. Strona ma pokazać pięć
   usług i sumę **245 zł**.
5. `ZADANIE 4`: odkomentuj wiersz B, przepisz komunikat do karty i przywróć
   komentarz.

??? tip "Podpowiedź 1"

    Nowy klucz dopisujesz tak samo jak zmieniasz istniejący:
    `$cennik['nowy klucz'] = wartość;`

??? tip "Podpowiedź 2"

    W HTML-u wartość z PHP wstawisz skrótem `<?= ... ?>`, np.
    `<?= $cennik['przegląd'] ?>`.

??? tip "Podpowiedź 3"

    Suma: `foreach ($cennik as $cena) { $suma = $suma + $cena; }`. Pętla musi
    stać **po** dopisaniu wymiany linki — inaczej wyjdzie 215 zł.

### :material-console: Ćwiczenie 4 — jaki typ?

Na kartce albo w karcie pracy dobierz do każdej informacji rodzaj typu:
tablica, tablica asocjacyjna, typ wyliczeniowy, struktura (obiekt), unia
albo klasa. Uzasadnij jednym zdaniem.

1. ceny abonamentu serwisowego w 12 kolejnych miesiącach,
2. rodzaj roweru: górski, miejski, szosowy, dziecięcy,
3. dane jednego klienta: imię, telefon, liczba wizyt,
4. godziny otwarcia w każdym dniu tygodnia, np. poniedziałek → 8–16,
5. ocena zlecenia w programie na mikrokontroler — **albo** liczba gwiazdek,
   **albo** kod komentarza, nigdy oba naraz, a pamięci jest mało,
6. wszystkie rowery w serwisie — każdy z marką, rokiem i przebiegiem,
   a nowe przybywają codziennie.

Na koniec odpowiedz: dlaczego status zlecenia lepiej zapisać typem
wyliczeniowym niż zwykłym napisem?

??? tip "Podpowiedź 1"

    Zadaj sobie dwa pytania: „wiele wartości tego samego rodzaju czy jedna
    rzecz z kilkoma cechami?” i „czy lista możliwych wartości jest zamknięta?”.

??? tip "Podpowiedź 2"

    Zamknięta lista → typ wyliczeniowy. „Albo to, albo to” przy małej pamięci
    → unia. Dni tygodnia jako klucze → tablica asocjacyjna.

??? tip "Podpowiedź 3"

    Pomyśl, co się stanie, gdy jeden programista zapisze `"gotowe"`, a drugi
    `"gotowy"` — i który z typów pozwoliłby to wykryć.

### :material-console: Ćwiczenie 5 — lista zleceń

:material-plus-circle: **rozszerzenie**

Otwórz `js/status.js`. Stała `STATUS` jest gotowa.

1. Utwórz tablicę `zlecenia` z czterema obiektami (dane są w komentarzu)
   i wypisz ją przez `console.table`.
2. Zlecenie 102 jest naprawione — zmień jego status na `STATUS.GOTOWE`
   i wypisz tabelę jeszcze raz.
3. Wypisz zlecenia do odbioru: `Do odbioru: 3 (101, 102, 103)`.
4. Spróbuj zmienić `STATUS.GOTOWE` na `"zrobione"` i wypisz go. Zapisz
   w karcie, co się stało.

??? tip "Podpowiedź 1"

    Obiekt: `{ nr: 101, rower: "Kross Hexagon", status: STATUS.GOTOWE }`.
    Obiekty w tablicy oddzielasz przecinkami.

??? tip "Podpowiedź 2"

    Zlecenie 102 to drugi element, czyli `zlecenia[1]`. Jego status:
    `zlecenia[1].status`.

??? tip "Podpowiedź 3"

    W pętli dopisuj numery do tablicy: `doOdbioru.push(z.nr);`. Na końcu:
    `` console.log(`Do odbioru: ${doOdbioru.length} (${doOdbioru.join(", ")})`) ``.

### :material-console: Ćwiczenie 6 — enum, struktura i unia w C

Otwórz `c/serwis.c`. **Nie uruchamiaj go.** W karcie pracy:

1. Napisz, co wypisze każdy z pięciu wierszy z `printf`.
2. Dlaczego status wypisuje się jako liczba?
3. Dlaczego po zapisaniu `k.zlote` pole `k.grosze` nie ma już wartości 12500?
4. Policz, ile bajtów zajmą unia i struktura (`int` — 4 bajty,
   `double` — 8, `enum` — 4).

??? tip "Podpowiedź 1"

    `GOTOWE` to trzecia nazwa w `enum Status` — liczymy od 0.
    Cena: 9000 + 3500.

??? tip "Podpowiedź 2"

    W unii wszystkie pola leżą w tym samym miejscu — sekcja 7.

??? tip "Podpowiedź 3"

    Unia: rozmiar największego pola. Struktura: 4 + 20 + 4 + 4 bajty —
    tu kompilator nie musi niczego dopychać.

### :material-console: Ćwiczenie 7 — klasa Rower

:material-plus-circle: **rozszerzenie**

Otwórz `js/rower.js`.

1. Dodaj do konstruktora czwarty parametr i pole `przebiegKm`.
2. Utwórz tablicę `rowery` z trzema obiektami klasy `Rower` i wypisz ją
   przez `console.table`.
3. Wypisz każdy rower w jednym wierszu, np. `Kross Hexagon (2021): 1250 km`,
   a na końcu łączny przebieg: `Razem: 5930 km`.
4. Wypisz wynik `rowery[0] instanceof Rower` i `typeof rowery[0]`. Odkomentuj
   wiersz D, zapisz komunikat i zakomentuj go z powrotem.

??? tip "Podpowiedź 1"

    W nawiasie konstruktora dopisz `przebiegKm`, a w środku
    `this.przebiegKm = przebiegKm;`.

??? tip "Podpowiedź 2"

    Obiekt klasy tworzysz słowem `new`: `new Rower("Kross", "Hexagon", 2021, 1250)`.

??? tip "Podpowiedź 3"

    Pętla `for (const r of rowery) { ... }` przechodzi po obiektach. Przed nią
    `let razem = 0;`, w środku `razem = razem + r.przebiegKm;`.

### :material-console: Ćwiczenie 8 — enum i klasa w PHP

:material-star: **dopełnienie**

Otwórz `zlecenia.php`. Enum `Status` i szkielet klasy `Zlecenie` są gotowe.

1. `ZADANIE 1`: dokończ konstruktor.
2. `ZADANIE 2`: wpisz cztery zlecenia do tablicy `$zlecenia`.
3. `ZADANIE 3`: policz zlecenia ze statusem `Status::Gotowe` i ich łączną
   kwotę. Strona ma pokazać: **Do odbioru: 2 zlecenia na 165,00 zł.**
4. `ZADANIE 4`: odkomentuj wiersz C, przepisz komunikat do karty, popraw
   wiersz tak, żeby działał, i odśwież stronę.

??? tip "Podpowiedź 1"

    W konstruktorze: `$this->status = $status;` i to samo dla `cenaGr`.
    Jeśli o tym zapomnisz, PHP zgłosi, że pole *must not be accessed before
    initialization*.

??? tip "Podpowiedź 2"

    Porównanie: `if ($z->status === Status::Gotowe) { ... }`. Licznik
    zwiększasz `$doOdbioru++`, kwotę — `$kwotaGr += $z->cenaGr;`.

??? tip "Podpowiedź 3"

    W wierszu C trzeci argument to napis `'gotowe'`, a konstruktor czeka na
    `Status`. Zamień go na `Status::Gotowe` albo `Status::from('gotowe')`.

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła.**

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Tablica w C zadeklarowana jako int ceny[5]; — jaki jest indeks jej ostatniego elementu?",
  "opcje": [
   "4",
   "5",
   "6",
   "1"
  ],
  "poprawna": 0,
  "wyjasnienie": "Indeksy zaczynają się od 0, więc pięć elementów ma indeksy 0–4. ceny[5] jest już poza tablicą."
 },
 {
  "pytanie": "Co wypisze ten program w C (int ma 4 bajty)?",
  "kod": "int ceny[5] = {2500, 4500, 9000, 1200, 3000};\nprintf(\"%zu\", sizeof ceny);",
  "opcje": [
   "5",
   "4",
   "20",
   "9"
  ],
  "poprawna": 2,
  "wyjasnienie": "sizeof podaje rozmiar całej tablicy w bajtach: 5 elementów po 4 bajty to 20. Liczbę elementów da sizeof ceny / sizeof ceny[0]."
 },
 {
  "pytanie": "Co wypisze ten kod w JavaScripcie?",
  "kod": "const czesci = [\"dętka\", \"łańcuch\", \"klocki\"];\nconsole.log(czesci[3]);",
  "opcje": [
   "\"klocki\"",
   "Błąd RangeError",
   "null",
   "undefined"
  ],
  "poprawna": 3,
  "wyjasnienie": "Element o indeksie 3 nie istnieje. JavaScript nie zgłasza błędu, tylko zwraca undefined."
 },
 {
  "pytanie": "Jak odczytać ostatni element tablicy czesci w JavaScripcie, niezależnie od jej długości?",
  "opcje": [
   "czesci[czesci.length - 1]",
   "czesci[czesci.length]",
   "czesci[-1]",
   "czesci.last"
  ],
  "poprawna": 0,
  "wyjasnienie": "length to liczba elementów, a indeksy liczą się od 0, więc ostatni ma indeks length − 1."
 },
 {
  "pytanie": "Co pokaże PHP po wykonaniu tego kodu?",
  "kod": "<?php\n$cennik = ['przegląd' => 90, 'wymiana dętki' => 35];\necho $cennik['Przegląd'];",
  "opcje": [
   "90",
   "Warning: Undefined array key \"Przegląd\"",
   "0",
   "Fatal error"
  ],
  "poprawna": 1,
  "wyjasnienie": "Klucze tablicy rozróżniają wielkość liter. Klucza 'Przegląd' nie ma, więc PHP zgłasza ostrzeżenie i nic nie wypisuje."
 },
 {
  "pytanie": "Co wypisze ten program w C?",
  "kod": "enum Status { PRZYJETE, W_NAPRAWIE, GOTOWE, ODEBRANE };\nprintf(\"%d\", GOTOWE);",
  "opcje": [
   "3",
   "GOTOWE",
   "2",
   "1"
  ],
  "poprawna": 2,
  "wyjasnienie": "Nazwy w enum to kolejne liczby całkowite od 0: PRZYJETE = 0, W_NAPRAWIE = 1, GOTOWE = 2."
 },
 {
  "pytanie": "Czym unia (union) w C różni się od struktury (struct)?",
  "opcje": [
   "Unia może mieć tylko pola typu int",
   "Wszystkie pola unii leżą w tym samym miejscu pamięci, więc sensowne jest tylko ostatnio zapisane",
   "Unia nie może być przekazana do funkcji",
   "Unia zajmuje sumę rozmiarów wszystkich pól"
  ],
  "poprawna": 1,
  "wyjasnienie": "Pola unii nakładają się na siebie, a jej rozmiar to rozmiar największego pola. Pola struktury leżą osobno, jedno za drugim."
 },
 {
  "pytanie": "Co wypisze ten kod w JavaScripcie?",
  "kod": "const a = { nr: 101 };\nconst b = a;\nb.nr = 999;\nconsole.log(a.nr);",
  "opcje": [
   "101",
   "undefined",
   "TypeError",
   "999"
  ],
  "poprawna": 3,
  "wyjasnienie": "b = a nie kopiuje obiektu — a i b wskazują ten sam obiekt, więc zmianę zrobioną przez b widać też przez a."
 },
 {
  "pytanie": "Który zapis poprawnie tworzy obiekt klasy Rower w JavaScripcie?",
  "kod": "class Rower {\n  constructor(marka, rok) {\n    this.marka = marka;\n    this.rok = rok;\n  }\n}",
  "opcje": [
   "const r = new Rower(\"Kross\", 2021);",
   "const r = Rower(\"Kross\", 2021);",
   "const r = Rower.new(\"Kross\", 2021);",
   "const r = class Rower(\"Kross\", 2021);"
  ],
  "poprawna": 0,
  "wyjasnienie": "Obiekt klasy tworzy się słowem new. Wywołanie Rower(...) bez new kończy się błędem TypeError."
 },
 {
  "pytanie": "Pole klasy w PHP zadeklarowano jako public int $rok. Co się stanie po $r->rok = \"dwa tysiące\";?",
  "opcje": [
   "Pole dostanie wartość 0",
   "Pole dostanie napis \"dwa tysiące\"",
   "TypeError: Cannot assign string to property ... of type int",
   "Tylko ostrzeżenie Warning"
  ],
  "poprawna": 2,
  "wyjasnienie": "Typowane pole pilnuje typu. Napis, który nie jest liczbą, kończy skrypt błędem TypeError."
 },
 {
  "pytanie": "Jak w PHP 8 zamienić napis 'gotowe' (np. z formularza) na przypadek enuma Status: string?",
  "opcje": [
   "(Status) 'gotowe'",
   "Status::from('gotowe')",
   "new Status('gotowe')",
   "Status['gotowe']"
  ],
  "poprawna": 1,
  "wyjasnienie": "Metoda from() szuka przypadku o tej wartości i zgłasza ValueError, gdy go nie ma. tryFrom() zamiast błędu zwraca null."
 }
]
</script>
</div>

---

## Karta pracy

Z tego tematu oddajesz **kartę pracy** w formacie Word. Kartę wypełniaj w trakcie ćwiczeń: wpisuj przewidywania **przed** uruchomieniem kodu, a wyniki i wnioski — po wykonaniu.

<div class="kp-podsumowanie" data-karta="wlasne-typy-danych"></div>

<span id="karta" class="kp-kotwica"></span>

???+ karta "Rozwiń kartę pracy"

    !!! info "Twoje odpowiedzi zostają na twoim komputerze"

        Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
        przycisku. Wyczyszczenie danych przeglądarki usunie odpowiedzi — kiedy
        skończysz, pobierz plik.

    <div class="karta-pracy" data-karta="wlasne-typy-danych"></div>

### Jak ją oddać

1. Pobierz kartę pracy przyciskiem pod formularzem na tej stronie.
2. Plik `.docx` dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *Własne typy danych – typ wyliczeniowy, unie, klasy, tablice — karta pracy*.

---

Poprzedni temat: [Deklaracja stałych i zmiennych w odniesieniu do wbudowanych typów danych](deklaracja-stalych-zmiennych.md).
Następny temat: [Tworzenie własnych typów danych w wybranych językach programowania](tworzenie-typow-danych.md).

!!! info "Materiały uzupełniające"

    - Tablice w JavaScripcie (po polsku): [developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/Array](https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/Array)
    - Klasy w JavaScripcie (po angielsku): [developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
    - Tablice w PHP (po polsku): [php.net/manual/pl/language.types.array.php](https://www.php.net/manual/pl/language.types.array.php)
    - Typy wyliczeniowe w PHP (po angielsku): [php.net/manual/en/language.enumerations.php](https://www.php.net/manual/en/language.enumerations.php)
    - Klasy i obiekty w PHP (po polsku): [php.net/manual/pl/language.oop5.basic.php](https://www.php.net/manual/pl/language.oop5.basic.php)
