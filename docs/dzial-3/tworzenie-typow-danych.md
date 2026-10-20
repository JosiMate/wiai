# Tworzenie własnych typów danych w wybranych językach programowania

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział III. Podstawy programowania — środowisko i dane
    · efekt kształcenia **INF.03.5.2**

    Na poprzednim temacie typy złożone tylko **przechowywały** dane: rower miał
    markę, rok i przebieg. Teraz typ nauczy się **działać** — rower sam doliczy
    przebieg, zlecenie samo policzy sumę, a karnet nie pozwoli wykorzystać
    szóstego przeglądu z pięciu.

    Zobaczysz, jak to robi C (struktura i funkcje), JavaScript i PHP (klasy
    z metodami), jak schować dane przed przypadkową zmianą i jak zaprojektować
    własny typ od opisu do działającego kodu.

    ??? abstract "Plan trzech lekcji"

        | Lekcja | Sekcje | Ćwiczenia |
        | :---: | --- | --- |
        | 1 | 1–4: dane i zachowanie; typ w C — struktura i funkcje; metody w JavaScripcie i PHP | 1, 2, 3 |
        | 2 | 5–7: projektowanie typu, pola prywatne, gettery, walidacja, `toString`, `readonly` | 4, 5 |
        | 3 | 8–12: kompozycja, pola statyczne, typ w JSON, porównanie języków, najczęstsze błędy | 6, 7, 8; quiz |

??? rozgrzewka "Na rozgrzewkę — 3 minuty, bez zaglądania"

    Odpowiedz w zeszycie, zanim zaczniesz nowy temat. Odpowiedzi rozwiń
    dopiero wtedy, gdy wszyscy skończą — nie liczą się do oceny.

    1. **Z poprzedniej lekcji.** Czym różni się w C `struct` od `union`?
    2. **Sprzed kilku tygodni.** Co się stanie w JavaScripcie po
       `const b = a; b.nr = 999;`, gdy `a` jest obiektem? Ile wynosi `a.nr`?
    3. **Z dawniejszych tematów.** Do czego służy w PHP funkcja
       `htmlspecialchars()`?

    ??? success "Odpowiedzi"

        1. Pola struktury leżą w pamięci osobno, pola unii — w tym samym
           miejscu (sensowne jest tylko ostatnio zapisane).
        2. `a.nr` też wynosi 999 — `b` to druga nazwa tego samego obiektu.
           Dziś zobaczysz, że w C przypisanie struktury robi **kopię**.
        3. Zamienia znaki specjalne HTML (`<`, `>`, `&`, `"`) na encje, żeby
           tekst od użytkownika nie stał się kodem strony.

!!! success "Kryteria sukcesu — sprawdź się na koniec tematu"

    Po tym temacie:

    1. Wyjaśnię, czym metoda różni się od zwykłej funkcji i do czego służy `this`.
    2. Zdefiniuję w C typ przez `typedef struct` i napiszę funkcję, która zmienia strukturę przez wskaźnik.
    3. Dopiszę do klasy w JavaScripcie i PHP metody, które zwracają wynik i zmieniają stan obiektu.
    4. Zaprojektuję typ na podstawie opisu: pola, metody i reguły, których ma pilnować.
    5. Schowam pole przed zmianą z zewnątrz (`#pole`, `private`) i udostępnię je getterem.
    6. Dopiszę walidację, która rzuca błąd przy złych danych, i obsłużę go w `try`/`catch`.
    7. Zbuduję typ złożony z innych typów (zlecenie z usługami) i użyję pola statycznego.

---

## 1. Typ to dane i zachowanie

Rower z poprzedniego tematu wiedział tylko, **czym jest**. Każdą operację —
doliczenie przebiegu, sprawdzenie, czy czas na przegląd — trzeba było
pisać obok, w kodzie, który z niego korzysta. Gdy tych miejsc jest dziesięć,
reguła „przegląd od 1000 km” powtarza się dziesięć razy, a przy zmianie
łatwo jedno miejsce przeoczyć.

Własny typ łączy **dane** z **zachowaniem**:

| | Dane (pola) | Zachowanie (metody) |
| --- | --- | --- |
| Rower | marka, model, rok, przebieg | dolicz przebieg, opisz się, czy potrzebuje przeglądu? |
| Zlecenie | numer, rower, status, lista usług | dodaj usługę, policz sumę, zmień status |
| Karnet | właściciel, liczba przeglądów | wykorzystaj przegląd, ile zostało? |

**Metoda** to funkcja zapisana wewnątrz typu. Działa na danych **swojego**
obiektu — sięga do nich przez `this` (JavaScript) albo `$this` (PHP).

!!! quote "Zasada, którą warto zapamiętać"

    Reguła dotycząca danych mieszka tam, gdzie dane. Zamiast w dziesięciu
    miejscach pisać `rower.przebiegKm >= 1000`, raz piszesz metodę
    `potrzebujePrzegladu()` i wszędzie ją wywołujesz.

---

## 2. Typ w C: struktura i funkcje

C nie ma klas. Własny typ tworzy się tam ze **struktury** i **funkcji**,
które przyjmują tę strukturę. `typedef` nadaje typowi krótką nazwę — zamiast
`struct Rower` piszesz po prostu `Rower`.

```c
typedef struct {
    char marka[20];
    int rok;
    int przebieg_km;
} Rower;

void dodaj_przebieg(Rower *r, int km)   /* gwiazdka: wskaźnik na rower */
{
    if (km > 0)
        r->przebieg_km += km;           /* -> to pole roweru, na który wskazuje r */
}

int main(void)
{
    Rower a = {"Kross", 2021, 1250};
    dodaj_przebieg(&a, 30);             /* & — adres zmiennej a */
    printf("%d\n", a.przebieg_km);      /* 1280 */
}
```

Dlaczego wskaźnik? W C argument funkcji to **kopia**. Funkcja, która dostaje
`Rower r`, zmienia własną kopię — oryginał zostaje bez zmian. Żeby zmienić
oryginał, przekazujesz jego **adres** (`&a`), a w funkcji sięgasz do pól
strzałką `->`.

```c
void zeruj_kopie(Rower r)
{
    r.przebieg_km = 0;
}

Rower a = {"Kross", 2021, 1250};
Rower b = a;
a.przebieg_km = 2000;
zeruj_kopie(a);
printf("%d %d\n", a.przebieg_km, b.przebieg_km);
```

!!! example "Przewiduj"

    Co wypisze `printf`?

    ??? success "Przewiduj, potem sprawdź wynik"

        `2000 1250`. `Rower b = a;` robi **kopię** całej struktury — dalsze
        zmiany `a` nie dotykają `b`. `zeruj_kopie(a)` wyzerowała swoją
        kopię, a nie `a`.

        To odwrotnie niż w JavaScripcie, gdzie `const b = a;` daje drugą
        nazwę **tego samego** obiektu (temat o własnych typach, sekcja 8).

---

## 3. Metody w JavaScripcie

Metodę zapisujesz w klasie bez słowa `function`. Do pól obiektu sięgasz przez
`this` — „ten obiekt, na rzecz którego wywołano metodę”.

```js
class Rower {
  constructor(marka, model, rok, przebiegKm) {
    this.marka = marka;
    this.model = model;
    this.rok = rok;
    this.przebiegKm = przebiegKm;
  }

  opis() {
    return `${this.marka} ${this.model} (${this.rok}): ${this.przebiegKm} km`;
  }

  dodajPrzebieg(km) {
    this.przebiegKm += km;
  }
}

const kross = new Rower("Kross", "Hexagon", 2021, 1250);
kross.dodajPrzebieg(30);
console.log(kross.opis());       // Kross Hexagon (2021): 1280 km
```

Dwa rodzaje metod:

- **zwracające wynik** (`opis()`, `potrzebujePrzegladu()`) — kończą się
  `return` i niczego nie zmieniają;
- **zmieniające stan** (`dodajPrzebieg(km)`) — zmieniają pola obiektu
  i zwykle nic nie zwracają.

!!! example "Przewiduj"

    ```js
    class Rower {
      constructor(marka) { this.marka = marka; }
      opis() { return marka; }
      opis2() { console.log(this.marka); }
    }
    const r = new Rower("Kross");
    console.log(r.opis2());
    console.log(r.opis());
    ```

    Co wypiszą dwa ostatnie wiersze?

    ??? success "Przewiduj, potem sprawdź wynik"

        Pierwszy: `Kross`, a pod nim `undefined` — `opis2()` sama wypisuje
        markę, ale niczego nie zwraca, więc `console.log` dostaje `undefined`.

        Drugi kończy się błędem `ReferenceError: marka is not defined`.
        Wewnątrz metody pole obiektu to zawsze `this.marka` — samo `marka`
        oznacza zwykłą zmienną, której nie ma.

---

## 4. Metody w PHP

W PHP metoda to funkcja z modyfikatorem dostępu (`public`), a do pól sięga
się przez `$this->`. PHP 8 ma skrót: parametry konstruktora z modyfikatorem
od razu stają się polami (**promocja konstruktora**).

```php
<?php
class Rower
{
    public function __construct(
        public string $marka,
        public string $model,
        public int $rok,
        public int $przebiegKm,
    ) {}

    public function opis(): string
    {
        return "{$this->marka} {$this->model} ({$this->rok}): {$this->przebiegKm} km";
    }

    public function dodajPrzebieg(int $km): void
    {
        $this->przebiegKm += $km;
    }
}

$kross = new Rower('Kross', 'Hexagon', 2021, 1250);
$kross->dodajPrzebieg(30);
echo $kross->opis();      // Kross Hexagon (2021): 1280 km
```

Typy parametrów i wyniku (`int $km`, `: string`, `: void`) są w PHP
opcjonalne, ale warto je pisać — PHP pilnuje ich przy każdym wywołaniu.

!!! example "Przewiduj"

    ```php
    <?php
    $kross->dodajPrzebieg("30");
    $kross->dodajPrzebieg("trzydzieści");
    ```

    ??? success "Przewiduj, potem sprawdź wynik"

        Pierwszy wiersz działa — napis wyglądający jak liczba PHP zamienia na
        `int`. Drugi kończy skrypt błędem `TypeError: Rower::dodajPrzebieg():
        Argument #1 ($km) must be of type int, string given`. Typ parametru
        to pierwsza linia obrony przed złymi danymi.

---

## 5. Projektowanie typu: od opisu do klasy

Zanim napiszesz klasę, przeczytaj opis i rozdziel go na trzy listy:

| W opisie szukasz… | To będzie… | Przykład: karnet na przeglądy |
| --- | --- | --- |
| rzeczowników — czym typ **jest** i co pamięta | **pola** | właściciel, liczba przeglądów, ile zostało |
| czasowników — co z nim **robimy** | **metody** | wykorzystaj przegląd, opisz karnet |
| reguł — czego **nie wolno** | **walidacja** w konstruktorze i metodach | od 1 do 20 przeglądów; nie można wykorzystać, gdy nic nie zostało |
| informacji tylko do odczytu | **getter** bez możliwości zapisu | ile zostało — widać, ale nie da się „dopisać” |

Wynik projektu zapisuje się często jako **diagram klasy**: nazwa, pola,
metody. Minus (`-`) oznacza element prywatny, plus (`+`) — publiczny.

```text
┌──────────────────────────────┐
│ Karnet                       │
├──────────────────────────────┤
│ + wlasciciel: string         │
│ + liczba: int                │
│ - pozostalo: int             │
├──────────────────────────────┤
│ + wykorzystaj(): int         │
│ + pozostalo(): int  (getter) │
│ + toString(): string         │
└──────────────────────────────┘
```

---

## 6. Pola prywatne: hermetyzacja

Licznik przebiegu w prawdziwym rowerze nie ma przycisku „cofnij”. Gdy pole
`przebiegKm` jest publiczne, każdy fragment kodu może napisać
`rower.przebiegKm = 0`. **Hermetyzacja** (kapsułkowanie) to schowanie pola
w środku obiektu — zmieniać je mogą tylko metody tego typu.

=== "JavaScript"

    ```js
    class LicznikRoweru {
      #przebiegKm;                       // # — pole prywatne

      constructor(marka, przebiegKm) {
        this.marka = marka;
        this.#przebiegKm = przebiegKm;
      }
    }
    const l = new LicznikRoweru("Kross", 1250);
    console.log(l.#przebiegKm);          // SyntaxError
    ```

=== "PHP"

    ```php
    <?php
    class LicznikRoweru
    {
        private int $przebiegKm;

        public function __construct(public string $marka, int $przebiegKm)
        {
            $this->przebiegKm = $przebiegKm;
        }
    }
    $l = new LicznikRoweru('Kross', 1250);
    echo $l->przebiegKm;                 // Error: Cannot access private property
    ```

| | JavaScript | PHP |
| --- | --- | --- |
| pole prywatne | `#przebiegKm` (z krzyżykiem także przy użyciu: `this.#przebiegKm`) | `private int $przebiegKm` |
| odwołanie z zewnątrz | `SyntaxError: Private field '#przebiegKm' must be declared in an enclosing class` — cały skrypt się nie uruchomi | `Error: Cannot access private property LicznikRoweru::$przebiegKm` |
| pole publiczne | zwykłe `this.marka` | `public` |

---

## 7. Gettery, walidacja, opis obiektu

Prywatne pole trzeba czasem **odczytać**. Służy do tego **getter** —
metoda, która wygląda z zewnątrz jak pole, ale da się ją tylko czytać.

```js
class LicznikRoweru {
  #przebiegKm;
  constructor(marka, przebiegKm) {
    this.marka = marka;
    this.#przebiegKm = przebiegKm;
  }

  get przebiegKm() {                     // odczyt: licznik.przebiegKm
    return this.#przebiegKm;
  }

  dodajPrzebieg(km) {
    if (!Number.isInteger(km) || km <= 0) {
      throw new Error(`Niepoprawny przebieg: ${km}`);
    }
    this.#przebiegKm += km;
  }

  toString() {                           // opis obiektu w napisie: `${licznik}`
    return `${this.marka}: ${this.#przebiegKm} km`;
  }
}
```

**Walidacja** to sprawdzenie danych, zanim zmienią stan obiektu. Gdy są złe,
metoda **rzuca błąd** (`throw`), a kod, który ją wywołał, może go **złapać**:

```js
try {
  licznik.dodajPrzebieg(-5);
} catch (e) {
  console.log(`Błąd: ${e.message}`);     // Błąd: Niepoprawny przebieg: -5
}
```

W PHP tak samo: `throw new InvalidArgumentException('...')` i
`try { ... } catch (InvalidArgumentException $e) { echo $e->getMessage(); }`.
Getter w PHP to zwykła metoda, np. `public function getPrzebiegKm(): int`,
a opis obiektu w napisie daje metoda `__toString()`.

!!! example "Przewiduj"

    ```js
    const licznik = new LicznikRoweru("Kross", 1280);
    licznik.przebiegKm = 0;
    console.log(`${licznik}`);
    ```

    ??? success "Przewiduj, potem sprawdź wynik"

        `Kross: 1280 km`. Getter nie ma pary do zapisu (settera), więc
        przypisanie w zwykłym skrypcie jest po cichu **ignorowane**. W trybie
        ścisłym (`"use strict"`, moduły) to błąd
        `TypeError: Cannot set property przebiegKm of #<LicznikRoweru> which has only a getter`.
        Tak czy inaczej — licznika nie da się cofnąć.

**Pola tylko do odczytu w PHP 8.1.** Modyfikator `readonly` pozwala nadać
wartość raz (w konstruktorze), a potem tylko ją czytać — dobre dla numeru
zlecenia czy ceny usługi:

```php
<?php
class Usluga
{
    public function __construct(
        public readonly string $nazwa,
        public readonly int $cenaGr,
    ) {}
}
$u = new Usluga('przegląd', 9000);
$u->cenaGr = 1;      // Error: Cannot modify readonly property Usluga::$cenaGr
```

---

## 8. Kompozycja: typ złożony z typów

Zlecenie **ma** usługi. Zamiast dopisywać do zlecenia pola `usluga1`,
`cena1`, `usluga2`… dajesz mu tablicę obiektów `Usluga` i metody, które na
niej pracują. To **kompozycja**: większy typ zbudowany z mniejszych.

```php
<?php
class Zlecenie
{
    private array $pozycje = [];             // tablica obiektów Usluga

    public function __construct(
        public readonly int $nr,
        public readonly string $rower,
    ) {}

    public function dodaj(Usluga $u): void
    {
        $this->pozycje[] = $u;
    }

    public function suma(): int
    {
        $suma = 0;
        foreach ($this->pozycje as $u) {
            $suma += $u->cenaGr;
        }
        return $suma;
    }
}

$z = new Zlecenie(101, 'Kross Hexagon');
$z->dodaj(new Usluga('przegląd', 9000));
$z->dodaj(new Usluga('wymiana dętki', 3500));
echo $z->suma();                             // 12500
```

Tablica `$pozycje` jest prywatna: z zewnątrz nie da się wstawić do niej
czegoś, co nie jest usługą — `dodaj()` przyjmie tylko obiekt `Usluga`.

---

## 9. Pola i metody statyczne

Zwykłe pole należy do **obiektu** — każdy rower ma swój przebieg. Pole
**statyczne** należy do **klasy** — jedno, wspólne dla wszystkich obiektów.
Przydaje się np. do licznika utworzonych zleceń.

=== "JavaScript"

    ```js
    class Zlecenie {
      static liczba = 0;
      constructor(rower) {
        Zlecenie.liczba++;
        this.nr = 100 + Zlecenie.liczba;
        this.rower = rower;
      }
    }
    new Zlecenie("Kross Hexagon");
    new Zlecenie("Romet Orkan");
    console.log(Zlecenie.liczba);     // 2 — przez nazwę klasy
    ```

=== "PHP"

    ```php
    <?php
    class Zlecenie
    {
        public static int $liczba = 0;
        public function __construct(public string $rower)
        {
            self::$liczba++;          // self — „ta klasa”
        }
    }
    new Zlecenie('Kross Hexagon');
    new Zlecenie('Romet Orkan');
    echo Zlecenie::$liczba;           // 2
    ```

---

## 10. Własny typ w JSON

Aplikacje internetowe przesyłają obiekty między przeglądarką a serwerem jako
tekst w formacie **JSON**. `JSON.stringify(obiekt)` w JavaScripcie
i `json_encode($obiekt)` w PHP zamieniają obiekt na taki tekst.

```js
const licznik = new LicznikRoweru("Kross", 1280);
console.log(JSON.stringify(licznik));
```

!!! example "Przewiduj"

    Czy w tekście JSON znajdzie się przebieg?

    ??? success "Przewiduj, potem sprawdź wynik"

        Nie: `{"marka":"Kross"}`. Do JSON trafiają tylko pola **publiczne** —
        w JavaScripcie pola `#` są pominięte, w PHP `json_encode` pomija
        `private`. To zaleta (nie wyślesz przypadkiem danych wewnętrznych)
        i pułapka (trzeba świadomie zdecydować, co ma wyjść na zewnątrz).

---

## 11. Jeden typ — trzy języki

| | C | JavaScript | PHP |
| --- | --- | --- | --- |
| definicja typu | `typedef struct { ... } Rower;` | `class Rower { ... }` | `class Rower { ... }` |
| utworzenie | `Rower a = {"Kross", 2021, 1250};` | `new Rower("Kross", 2021, 1250)` | `new Rower('Kross', 2021, 1250)` |
| zachowanie | funkcja `dodaj_przebieg(&a, 30)` | metoda `a.dodajPrzebieg(30)` | metoda `$a->dodajPrzebieg(30)` |
| „ten obiekt” w środku | parametr-wskaźnik `r->` | `this.` | `$this->` |
| pole prywatne | — (umowa: nie ruszaj) | `#pole` | `private` |
| tylko do odczytu | `const` przy parametrze | getter bez settera | `readonly`, getter |
| błąd przy złych danych | zwracany kod błędu (np. `0`/`-1`) | `throw new Error(...)` | `throw new InvalidArgumentException(...)` |
| przypisanie `b = a` | **kopia** struktury | ten sam obiekt | ten sam obiekt |

---

## 12. Najczęstsze błędy

| Objaw | Przyczyna | Co zrobić |
| --- | --- | --- |
| C: funkcja „nie zmienia” struktury | przekazanie przez wartość — funkcja dostała kopię | parametr `Rower *r`, wywołanie `f(&a)`, w środku `r->pole` |
| JS: `ReferenceError: marka is not defined` w metodzie | brak `this.` przed nazwą pola | `this.marka` |
| PHP: `Undefined variable $marka` w metodzie | brak `$this->` | `$this->marka` |
| metoda wypisuje, a wynik to `undefined` | brak `return` | metoda zwracająca wynik kończy się `return` |
| JS: `TypeError: ... is not a function` | literówka w nazwie metody albo wywołanie bez nawiasów w innym miejscu | sprawdź nazwę; wywołanie zawsze z `()` |
| JS: `SyntaxError: Private field '#x' must be declared…` | odwołanie do pola `#` spoza klasy | getter albo metoda w klasie |
| PHP: `Cannot access private property` | odczyt pola `private` z zewnątrz | getter `getX()` |
| PHP: `Cannot modify readonly property` | zmiana pola `readonly` po konstruktorze | nowy obiekt zamiast zmiany, albo pole bez `readonly` |
| błąd przy złych danych wywraca całą stronę | brak `try`/`catch` wokół wywołania, które może rzucić błąd | łap błąd tam, gdzie wiesz, co z nim zrobić |
| obiekt w JSON nie ma ważnego pola | pole prywatne | świadomie dodaj je do wyniku (np. metoda zwracająca tablicę do zapisu) |

---

## Ćwiczenia

Ćwiczenia 1–4 i 6 są dla wszystkich. Ćwiczenia 5 i 7 są na ocenę dobrą,
a 8 — na bardzo dobrą. Ćwiczenia 1 i 4 robisz na kartce albo w karcie
pracy, pozostałe w paczce.

Pobierz paczkę i **rozpakuj katalog `klasy` do `C:\xampp\htdocs\`** —
ma powstać `C:\xampp\htdocs\klasy\index.html`. Otwórz ten katalog
w VS Code: **File → Open Folder** (w polskiej wersji: **Plik → Otwórz
folder**). Stronę startową otworzysz pod adresem
`http://localhost/klasy/`, a wyniki skryptów zobaczysz w konsoli:
++f12++ → **Konsola**.

[:material-folder-zip: Klasy — paczka startowa (.zip)](../pliki/klasy-start.zip){ .md-button .md-button--primary download="klasy-start.zip" }

### :material-console: Ćwiczenie 1 — typ Rower w C

Otwórz `c/rower.c`. **Nie uruchamiaj go.** W karcie pracy:

1. Napisz, co wypiszą trzy wiersze wyniku.
2. Dlaczego `dodaj_przebieg(&a, -500)` niczego nie zmieniło?
3. Dlaczego `zeruj_kopie(a)` nie wyzerowała przebiegu?
4. Dlaczego `b` ma inny przebieg niż `a`?

Sprawdzić możesz w kompilatorze online (np. godbolt.org).

??? tip "Podpowiedź 1"

    Przebieg `a`: 1250, potem +30, potem próba −500. Zajrzyj do warunku
    w `dodaj_przebieg`.

??? tip "Podpowiedź 2"

    `zeruj_kopie` dostaje `Rower r` — bez gwiazdki. Co dostaje funkcja w C,
    gdy parametr nie jest wskaźnikiem? (sekcja 2)

??? tip "Podpowiedź 3"

    `Rower b = a;` stoi **przed** zmianami `a`, a przypisanie struktury robi
    kopię. Rozmiar typu: 20 bajtów tablicy znaków + dwa `int`-y po 4 bajty.

### :material-console: Ćwiczenie 2 — metody klasy Rower

Otwórz `js/rower.js` i dopisz metody:

1. `opis()` — zwraca `Kross Hexagon (2021): 1250 km`,
2. `dodajPrzebieg(km)`,
3. `wiek(rokBiezacy)`,
4. `potrzebujePrzegladu()` — `true` od 1000 km.

Potem odkomentuj wiersze na dole pliku i porównaj wynik z komentarzami.

??? tip "Podpowiedź 1"

    Metoda w klasie: `opis() { return ...; }` — bez słowa `function`.

??? tip "Podpowiedź 2"

    Każde pole obiektu w metodzie z `this.`: `this.marka`, `this.przebiegKm`.

??? tip "Podpowiedź 3"

    `dodajPrzebieg(km) { this.przebiegKm += km; }` ·
    `wiek(rokBiezacy) { return rokBiezacy - this.rok; }` ·
    `potrzebujePrzegladu() { return this.przebiegKm >= 1000; }`

### :material-console: Ćwiczenie 3 — metody w PHP

Otwórz `rower.php`. Dopisz metody `opis()`, `dodajPrzebieg()`
i `potrzebujePrzegladu()`, a w `ZADANIU 4` dodaj każdemu rowerowi 30 km
pętlą `foreach`. Otwórz `http://localhost/klasy/rower.php`. W tabeli mają
być:

| Rower | Przegląd |
| --- | :---: |
| Kross Hexagon (2021): 1280 km | tak |
| Romet Orkan (2019): 330 km | nie |
| Merida Speeder (2023): 1010 km | tak |

??? tip "Podpowiedź 1"

    W PHP do pól sięgasz przez `$this->marka`. Napis z wartościami:
    `"{$this->marka} {$this->model} ({$this->rok}): {$this->przebiegKm} km"`.

??? tip "Podpowiedź 2"

    `public function dodajPrzebieg(int $km): void { $this->przebiegKm += $km; }`

??? tip "Podpowiedź 3"

    `foreach ($rowery as $r) { $r->dodajPrzebieg(30); }` — obiekt w pętli to
    ten sam obiekt co w tablicy, więc zmiana zostaje. Merida: 980 + 30 =
    1010, więc już „tak”.

### :material-console: Ćwiczenie 4 — zaprojektuj typ

Na kartce albo w karcie pracy zaprojektuj typ na podstawie opisu (sekcja 5).
Nie pisz kodu — wypisz pola, metody i reguły.

> Serwis wynajmuje **stanowiska samoobsługowe** do naprawy roweru. Rezerwacja
> ma numer stanowiska (1–6), imię klienta, godzinę rozpoczęcia (8–17) i liczbę
> godzin (1–3). Rezerwację można przedłużyć o godzinę, ale nie dłużej niż do 18.
> Można ją też anulować — anulowanej nie da się już przedłużyć. Koszt to 15 zł
> za godzinę.

Zaznacz, które pola mają być prywatne albo tylko do odczytu, i podaj dwie
reguły, przy których metoda powinna rzucić błąd.

??? tip "Podpowiedź 1"

    Rzeczowniki: stanowisko, klient, godzina rozpoczęcia, liczba godzin… czy
    jest jeszcze coś, co rezerwacja musi **pamiętać** (np. o anulowaniu)?

??? tip "Podpowiedź 2"

    Czasowniki: przedłuż, anuluj, policz koszt. Koszt nie musi być polem —
    można go liczyć metodą z liczby godzin.

??? tip "Podpowiedź 3"

    Reguły: numer stanowiska poza 1–6; koniec po 18 przy przedłużeniu;
    przedłużenie anulowanej. Numer stanowiska i godzina rozpoczęcia mogą być
    tylko do odczytu.

### :material-console: Ćwiczenie 5 — licznik, którego nie da się cofnąć

:material-plus-circle: **rozszerzenie**

Otwórz `js/przebieg.js`. Kod na dole pliku jest gotowy — uzupełnij klasę
`LicznikRoweru` tak, żeby wypisał:

```text
dodano 30 → 1280 km
Błąd: Niepoprawny przebieg: -5
Błąd: Niepoprawny przebieg: 40
Błąd: Niepoprawny przebieg: 2.5
Po próbie cofnięcia: Kross: 1280 km
```

(Przy `"40"` błąd jest słuszny: to napis, a nie liczba.)

??? tip "Podpowiedź 1"

    Pole prywatne deklarujesz w klasie: `#przebiegKm;`, a w konstruktorze
    `this.#przebiegKm = przebiegKm;`.

??? tip "Podpowiedź 2"

    Getter: `get przebiegKm() { return this.#przebiegKm; }`. Walidacja:
    `Number.isInteger(km)` odrzuca i napisy, i ułamki.

??? tip "Podpowiedź 3"

    ``toString() { return `${this.marka}: ${this.#przebiegKm} km`; }`` —
    ten wynik pokazuje `${licznik}` w ostatnim wierszu.

### :material-console: Ćwiczenie 6 — zlecenie z usługami

Otwórz `zlecenie.php`.

1. `ZADANIE 1`: metoda `dodaj(Usluga $u)`.
2. `ZADANIE 2`: metoda `suma()`.
3. `ZADANIE 3`: dodaj trzy usługi i zmień status na „w naprawie”.
   Strona ma pokazać: **Razem: 165,00 zł (pozycji: 3)**.
4. `ZADANIE 4`: odkomentuj wiersz C, przepisz komunikat i przywróć
   komentarz.

??? tip "Podpowiedź 1"

    Dopisanie na koniec tablicy: `$this->pozycje[] = $u;`.

??? tip "Podpowiedź 2"

    W `suma()` pętla po `$this->pozycje` i `$suma += $u->cenaGr;` —
    sekcja 8.

??? tip "Podpowiedź 3"

    `$z->dodaj(new Usluga('przegląd', 9000));` i tak samo dwie pozostałe.
    Status: `$z->status = Status::WNaprawie;`. Wiersz C zmienia pole
    `readonly` — sekcja 7.

### :material-console: Ćwiczenie 7 — kolejność statusów

:material-plus-circle: **rozszerzenie**

Otwórz `js/zlecenie.js`. Zlecenie może przejść tylko po kolei: przyjęte →
w naprawie → gotowe → odebrane.

1. `ZADANIE 1`: metoda `zmienStatus(nowy)` — rzuca błąd przy niedozwolonym
   przejściu.
2. `ZADANIE 2`: `toString()`.
3. `ZADANIE 3`: przeprowadź pierwsze zlecenie do „gotowe”, a drugie spróbuj
   od razu oznaczyć jako „odebrane”. Ma wyjść:

```text
Błąd: Nie można zmienić statusu z „przyjęte” na „odebrane”
Zlecenie 101 (Kross Hexagon): gotowe
Zlecenie 102 (Romet Orkan): przyjęte
Zleceń: 2
```

??? tip "Podpowiedź 1"

    Dozwolony następny status dla obecnego to `NASTEPNY[this.#status]`.
    Jeśli `nowy` jest inny — błąd.

??? tip "Podpowiedź 2"

    Zmianę każdego statusu zamknij w `try { ... } catch (e) { ... }` —
    inaczej pierwszy błąd zatrzyma cały skrypt.

??? tip "Podpowiedź 3"

    Liczbę zleceń czytasz przez nazwę klasy: `Zlecenie.liczba` — pole
    statyczne, sekcja 9.

### :material-console: Ćwiczenie 8 — karnet według specyfikacji

:material-star: **dopełnienie**

Otwórz `js/karnet.js`. Na górze jest opis typu `Karnet`, na dole — sześć
gotowych testów. Napisz klasę tak, żeby wszystkie dały `OK` i na końcu stało
**`Wynik: 6/6`**. Testów nie zmieniaj.

W karcie pracy wklej klasę i narysuj jej diagram (sekcja 5).

??? tip "Podpowiedź 1"

    Zacznij od konstruktora z wartością domyślną: `constructor(wlasciciel,
    liczba = 5)` i od `toString()` — to da dwa pierwsze testy.

??? tip "Podpowiedź 2"

    „Da się odczytać, nie da się zmienić” — pole prywatne `#pozostalo`
    i getter `pozostalo` (sekcja 7). Walidacja w konstruktorze:
    `Number.isInteger(liczba)` i zakres 1–20.

??? tip "Podpowiedź 3"

    `wykorzystaj()` najpierw sprawdza, czy `#pozostalo` to 0 (wtedy
    `throw new Error("Karnet wykorzystany")`), a dopiero potem zmniejsza.

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła.**

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Czym metoda różni się od zwykłej funkcji?",
  "opcje": [
   "Metoda jest zapisana w klasie i działa na danych swojego obiektu (this / $this)",
   "Metoda nie może przyjmować parametrów",
   "Metoda zawsze zwraca napis",
   "Nie ma różnicy — to dwie nazwy tego samego"
  ],
  "poprawna": 0,
  "wyjasnienie": "Metoda należy do typu i ma dostęp do pól obiektu, na rzecz którego ją wywołano: this w JavaScripcie, $this w PHP."
 },
 {
  "pytanie": "Dlaczego w C funkcja zmieniająca strukturę przyjmuje wskaźnik (Rower *r)?",
  "opcje": [
   "Bo struktur nie wolno przekazywać do funkcji",
   "Bo wskaźnik zajmuje mniej miejsca na ekranie",
   "Bo argument zwykły to kopia — przez wskaźnik funkcja zmienia oryginał",
   "Bo bez wskaźnika program się nie skompiluje"
  ],
  "poprawna": 2,
  "wyjasnienie": "W C argument funkcji to kopia. Żeby zmienić oryginał, przekazuje się jego adres (&a) i sięga do pól przez ->."
 },
 {
  "pytanie": "Co wypisze ten kod w C?",
  "kod": "Rower a = {\"Kross\", 2021, 1250};\nRower b = a;\na.przebieg_km = 2000;\nprintf(\"%d\", b.przebieg_km);",
  "opcje": [
   "2000",
   "0",
   "Błąd kompilacji",
   "1250"
  ],
  "poprawna": 3,
  "wyjasnienie": "Przypisanie struktury w C robi kopię. Zmiana a po skopiowaniu nie dotyka b."
 },
 {
  "pytanie": "Co się stanie po wywołaniu r.opis() dla tej klasy w JavaScripcie?",
  "kod": "class Rower {\n  constructor(marka) { this.marka = marka; }\n  opis() { return marka; }\n}",
  "opcje": [
   "Zwróci markę roweru",
   "ReferenceError: marka is not defined",
   "Zwróci undefined",
   "Zwróci napis \"marka\""
  ],
  "poprawna": 1,
  "wyjasnienie": "W metodzie pole obiektu to this.marka. Samo marka to zwykła zmienna, której nie ma — stąd ReferenceError."
 },
 {
  "pytanie": "Jak w JavaScripcie zadeklarować pole, którego nie da się odczytać ani zmienić spoza klasy?",
  "opcje": [
   "private przebieg;",
   "_przebieg;",
   "#przebieg;",
   "static przebieg;"
  ],
  "poprawna": 2,
  "wyjasnienie": "Pole z # jest prywatne. Odwołanie do niego spoza klasy to SyntaxError. Słowo private istnieje w PHP, a podkreślenie to tylko umowa."
 },
 {
  "pytanie": "Pole #przebiegKm ma getter, ale nie ma settera. Co da licznik.przebiegKm = 0 w zwykłym skrypcie?",
  "opcje": [
   "Przypisanie zostanie po cichu zignorowane",
   "Przebieg zmieni się na 0",
   "Powstanie drugie pole przebiegKm",
   "SyntaxError"
  ],
  "poprawna": 0,
  "wyjasnienie": "Bez settera przypisania nie ma gdzie zapisać — w zwykłym skrypcie jest ignorowane, w trybie ścisłym rzuca TypeError."
 },
 {
  "pytanie": "Co zrobi metoda, która przy złych danych wykonuje throw new Error(\"...\")?",
  "opcje": [
   "Wypisze komunikat i będzie działać dalej",
   "Zwróci false",
   "Zakończy się błędem, który można złapać w try/catch",
   "Usunie obiekt"
  ],
  "poprawna": 2,
  "wyjasnienie": "throw przerywa metodę i przekazuje błąd do kodu wywołującego. Jeśli nikt go nie złapie (try/catch), skrypt się zatrzyma."
 },
 {
  "pytanie": "Co zgłosi PHP 8.1 przy próbie zmiany pola public readonly int $nr po utworzeniu obiektu?",
  "opcje": [
   "Warning, ale wartość się zmieni",
   "Nic — readonly działa tylko w JavaScripcie",
   "Notice: undefined property",
   "Error: Cannot modify readonly property"
  ],
  "poprawna": 3,
  "wyjasnienie": "Pole readonly można ustawić tylko raz, w konstruktorze. Każda późniejsza zmiana to Error."
 },
 {
  "pytanie": "Zlecenie przechowuje tablicę obiektów Usluga i ma metody dodaj() i suma(). Jak nazywa się taki sposób budowania typu?",
  "opcje": [
   "Kompozycja",
   "Unia",
   "Rzutowanie",
   "Przeciążanie"
  ],
  "poprawna": 0,
  "wyjasnienie": "Kompozycja to budowanie większego typu z mniejszych: zlecenie „ma” usługi."
 },
 {
  "pytanie": "Czym pole statyczne (static liczba = 0) różni się od zwykłego pola?",
  "opcje": [
   "Nie można go zmieniać",
   "Jest jedno, wspólne dla całej klasy, a nie osobne w każdym obiekcie",
   "Jest zawsze prywatne",
   "Istnieje tylko w C"
  ],
  "poprawna": 1,
  "wyjasnienie": "Pole statyczne należy do klasy — odczytujesz je przez nazwę klasy (Zlecenie.liczba, Zlecenie::$liczba)."
 },
 {
  "pytanie": "Co wypisze JSON.stringify(licznik), gdy licznik ma publiczne pole marka i prywatne #przebiegKm?",
  "opcje": [
   "{\"marka\":\"Kross\",\"przebiegKm\":1280}",
   "{\"marka\":\"Kross\"}",
   "{}",
   "Błąd TypeError"
  ],
  "poprawna": 1,
  "wyjasnienie": "Do JSON trafiają tylko pola publiczne. Pola # są pomijane — tak samo pola private w json_encode w PHP."
 }
]
</script>
</div>

---

## Karta pracy

Z tego tematu oddajesz **kartę pracy** w formacie Word. Kartę wypełniaj w trakcie ćwiczeń: wpisuj przewidywania **przed** uruchomieniem kodu, a wyniki i wnioski — po wykonaniu.

<div class="kp-podsumowanie" data-karta="tworzenie-typow-danych"></div>

<span id="karta" class="kp-kotwica"></span>

???+ karta "Rozwiń kartę pracy"

    !!! info "Twoje odpowiedzi zostają na twoim komputerze"

        Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
        przycisku. Wyczyszczenie danych przeglądarki usunie odpowiedzi — kiedy
        skończysz, pobierz plik.

    <div class="karta-pracy" data-karta="tworzenie-typow-danych"></div>

### Jak ją oddać

1. Pobierz kartę pracy przyciskiem pod formularzem na tej stronie.
2. Plik `.docx` dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *Tworzenie własnych typów danych w wybranych językach programowania — karta pracy*.

---

Poprzedni temat: [Własne typy danych – typ wyliczeniowy, unie, klasy, tablice](wlasne-typy-danych.md).
Następny temat: [Operatory arytmetyczne, bitowe, logiczne oraz relacji](operatory.md).

!!! info "Materiały uzupełniające"

    - Klasy w JavaScripcie (po angielsku): [developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
    - Pola prywatne w JavaScripcie (po angielsku): [developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)
    - Klasy i obiekty w PHP (po polsku): [php.net/manual/pl/language.oop5.php](https://www.php.net/manual/pl/language.oop5.php)
    - Właściwości readonly w PHP (po angielsku): [php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties](https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties)
