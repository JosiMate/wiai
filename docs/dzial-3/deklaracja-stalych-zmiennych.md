# Deklaracja stałych i zmiennych w odniesieniu do wbudowanych typów danych

!!! abstract "O tym temacie"

    **2 godziny lekcyjne** · Dział III. Podstawy programowania — środowisko i dane
    · efekt kształcenia **INF.03.01**

    Każdy skrypt i aplikacja internetowa musi gdzieś przechowywać swoje dane:
    aktualny wynik gracza, zawartość koszyka sklepowego, imię zalogowanego
    użytkownika czy niezmienną stawkę podatku VAT. Do tego celu służą
    **zmienne** oraz **stałe**.

    W tym temacie nauczysz się poprawnie deklarować zmienne i stałe w języku
    JavaScript za pomocą słów kluczowych `let` i `const`, poznasz zasady
    tworzenia czytelnych nazw w notacji `camelCase`, opanujesz wbudowane typy
    danych (`number`, `string`, `boolean`, `undefined`, `null`) oraz zrozumiesz,
    na czym polega zjawisko typowania dynamicznego.

    ??? abstract "Plan dwóch lekcji"

        | Lekcja | Sekcje | Ćwiczenia |
        | :---: | --- | --- |
        | 1 | 1–3: pojęcie zmiennej i stałej (`let`, `const`, `var`), wbudowane typy danych, reguły nazewnictwa i `camelCase` | 1–2 |
        | 2 | 4–6: typowanie dynamiczne, przykłady z życia (`const` vs `let`) oraz najczęstsze błędy | 3–4 |

??? rozgrzewka "Na rozgrzewkę — 3 minuty, bez zaglądania"

    Odpowiedz w zeszycie, zanim zaczniesz nowy temat. Odpowiedzi rozwiń
    dopiero wtedy, gdy wszyscy skończą — nie liczą się do oceny.

    1. **Z poprzedniej lekcji.** Czym różni się typ `number` w języku JavaScript
       od typów `int` i `float` znanych z języka C?
    2. **Sprzed kilku tygodni.** Jaki klawisz otwiera Narzędzia deweloperskie
       (DevTools) w przeglądarce internetowej, w których znajduje się konsola JavaScript?
    3. **Z dawniejszych tematów.** Za pomocą jakiego znacznika HTML i jakiego
       atrybutu podłącza się zewnętrzny plik ze skryptem JavaScript (`skrypt.js`) do dokumentu HTML?

    ??? success "Odpowiedzi"

        1. W JavaScripcie nie ma osobnych typów `int` ani `float` — wszystkie liczby
           (całkowite i ułamkowe) mają ten sam typ `number` (zapisywany jako 64-bitowa liczba zmiennoprzecinkowa IEEE 754).
        2. Klawisz ++f12++ (lub skrót ++ctrl+shift+i++).
        3. Za pomocą znacznika `<script src="skrypt.js"></script>`.

!!! success "Kryteria sukcesu"

    Po tym temacie:

    1. Wyjaśnię różnicę między rezerwacją pamięci przez zmienną (`let`) a stałą (`const`) oraz powiem, dlaczego unika się przestarzałego słowa `var`.
    2. Wskażę i opiszę 5 wbudowanych prostych typów danych w JavaScript (`number`, `string`, `boolean`, `undefined`, `null`).
    3. Zastosuję poprawne identyfikatory oraz konwencję `camelCase` podczas tworzenia nazw zmiennych i stałych.
    4. Wyjaśnię zjawisko typowania dynamicznego w językach skryptowych i przeanalizuję zmianę typu wartości w czasie działania programu.
    5. Prawidłowo dobiorę deklarację (`const` vs `let`) do problemu z życia (np. stawka VAT vs wynik punktowy gracza).
    6. Przeanalizuję strukturę danych i zabezpieczę kod przed niepożądaną modyfikacją za pomocą stałych oraz zweryfikuję typy operatorem `typeof`.

---

## 1. Pojęcie zmiennej i stałej — let, const i var

Aplikacja komputerowa w czasie działania operuje na danych zapisanych w pamięci RAM. Aby programista nie musiał odwoływać się do skomplikowanych adresów pamięci, tworzy się **identyfikatory** — słowne nazwy przypisane do wydzielonych obszarów pamięci.

W języku JavaScript wyróżniamy dwa podstawowe sposoby rezerwacji pamięci:

- **Zmienna (`let`)** — rezerwuje komórkę pamięci, której zawartość **może się zmieniać** w trakcie wykonywania programu.
- **Stała (`const`)** — rezerwuje komórkę pamięci, której wartość jest przypisywana **dokładnie raz** (przy deklaracji) i **nie może być zmodyfikowana** poprzez ponowne przypisanie.

### Deklaracja i inicjalizacja

Deklaracja to poinformowanie interpretera o utworzeniu nowej nazwy. Inicjalizacja to nadanie jej pierwszej wartości.

```javascript
// Deklaracja i inicjalizacja zmiennej
let wynikGracza = 0;
wynikGracza = 15; // Poprawnie: zmiana wartości zmiennej

// Deklaracja i inicjalizacja stałej
const stawkaVat = 0.23;
// stawkaVat = 0.08; // BŁĄD! TypeError: Assignment to constant variable.
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

    Co wypisze w konsoli powyższy fragment kodu? Co się stanie, gdy zadeklarujesz `const` bez podania wartości wyjściowej?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        undefined
        18
        3
        ```

        Zmienna zadeklarowana słowem `let` bez przypisanej wartości ma domyślnie wartość `undefined`.
        Stała `const` **musi** zostać zainicjalizowana w momencie deklaracji — próba napisania `const x;` zakończy się błędem `SyntaxError: Missing initializer in const declaration`.

### Dlaczego unikamy słowa kluczowego `var`?

W starszych wersjach języka JavaScript (przed standardem ES6 z 2015 roku) do deklaracji zmiennych używano wyłącznie słowa `var`. Dziś uznaje się je za przestarzałe ze względu na dwie cechy:

1. **Zasięg funkcyjny zamiast blokowego:** zmienna `var` „wycieka” poza bloki instrukcji warunkowych `if` czy pętli `for`. Zmienne `let` i `const` mają **zasięg blokowy** (ograniczony nawiasami klamrowymi `{ }`).
2. **Wynoszenie (hoisting) i zezwolenie na ponowną deklarację:** słowo `var` pozwala na wielokrotne deklarowanie tej samej zmiennej w tym samym obszarze kodu, co prowadzi do trudnych do wykrycia błędów.

```javascript
if (true) {
    var x = "zmienna var";
    let y = "zmienna let";
}
console.log(x); // Wypisze: "zmienna var"
// console.log(y); // BŁĄD! ReferenceError: y is not defined
```

!!! quote "Zasada, którą warto zapamiętać"

    Domyślnie używaj **`const`** dla wszystkich wartości, których nie planujesz zmieniać. Jeśli wartość musi ulec zmianie (np. licznik pętli, suma punktów), użyj **`let`**. Słowa **`var` nie używamy wcale**.

---

## 2. Wbudowane typy danych w JavaScript

W języku JavaScript wartości dzielą się na **typy proste (prymitywne)** oraz **typy złożone (obiekty)**. W tym temacie skupiamy się na pięciu podstawowych typach prostych:

| Typ danych | Opis | Przykłady wartości |
| --- | --- | --- |
| **`number`** | Liczby całkowite oraz zmiennoprzecinkowe | `42`, `-7`, `3.14`, `0.29`, `NaN`, `Infinity` |
| **`string`** | Ciągi znaków (tekst) ujęte w cudzysłowy lub apostrofy | `"Szprycha"`, `'Jan'`, `` `Wynik: 10` `` |
| **`boolean`** | Typ logiczny — przyjmuje jedną z dwóch wartości | `true` (prawda), `false` (fałsz) |
| **`undefined`** | Zmienna istnieje, ale nie przypisano jej jeszcze wartości | `undefined` |
| **`null`** | Celowy brak wartości (pusta referencja) | `null` |

```javascript
const nazwaSerwisu = "Szprycha";
let liczbaRowerow = 5;
let rabatUdzielony = false;
let daneKlienta;
let opisUsterki = null;

console.log(nazwaSerwisu, typeof nazwaSerwisu);
console.log(liczbaRowerow, typeof liczbaRowerow);
console.log(rabatUdzielony, typeof rabatUdzielony);
console.log(daneKlienta, typeof daneKlienta);
console.log(opisUsterki, typeof opisUsterki);
```

!!! example "Przewiduj"

    Co wypisze w konsoli powyższy kod dla każdej z pięciu zmiennych? Zwróć uwagę na typ wartości `null`.

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        Szprycha string
        5 number
        false boolean
        undefined undefined
        null object
        ```

        Zauważ specjalny przypadek: `typeof null` zwraca napis `"object"`. Jest to historyczny błąd w języku JavaScript obecny od jego pierwszej wersji w 1995 r., pozostawiony dla zachowania wstecznej kompatybilności.

---

## 3. Zasady deklaracji i konwencji nazewnictwa

Nazwa zmiennej lub stałej w programie nazywana jest **identyfikatorem**. Aby kod był poprawny składniowo i czytelny dla innych programistów, należy przestrzegać zasad języka oraz przyjętych konwencji.

### Twarde reguły języka (błąd składniowy)

1. Identyfikator może składać się z liter, cyfr, znaku podkreślenia (`_`) oraz znaku dolara (`$`).
2. Nazwa **nie może zaczynać się od cyfry** (np. `1miejsce` jest błędne, ale `miejsce1` jest poprawne).
3. Nazwa **nie może być zastrzeżonym słowem kluczowym** języka (np. `let`, `const`, `function`, `class`, `if`, `return`).
4. Wielkość liter ma znaczenie — JavaScript rozróżnia wielkie i małe litery (`punkty`, `Punkty` i `PUNKTY` to trzy różne zmienne).

### Konwencje czystego kodu (notacja camelCase)

W języku JavaScript powszechnie obowiązuje konwencja **`camelCase`** (wielbłąda notacja):

- Pierwsze słowo piszemy **małą literą**.
- Każde kolejne słowo w nazwie rozpoczynamy **wielką literą**.
- Nie używamy spacji, myślników ani polskich znaków diakrytycznych (ą, ę, ć, ł itp.).

| Słaba nazwa | Poprawna nazwa `camelCase` | Wyjaśnienie |
| --- | --- | --- |
| `liczba_punktow` | `liczbaPunktow` | Styl węża (`snake_case`) stosuje się m.in. w Pythonie, w JS używamy `camelCase`. |
| `uzytkownikzalogowany` | `uzytkownikZalogowany` | Trudne do przeczytania — brak wyróżnienia kolejnych słów. |
| `zmienna1`, `x` | `imieKlienta`, `cenaBrutto` | Nazwa powinna sama wyjaśniać, co przechowuje komórka pamięci. |
| `iloscRowerów` | `iloscRowerow` | Unikamy polskich liter w nazwach zmiennych, aby zapobiec problemom z kodowaniem znaków. |

Stałym o zasięgu globalnym, których wartość jest znana już w momencie pisania kodu (np. stałe fizyczne lub konfiguracyjne), nadaje się czasem nazwy ujęte wielkimi literami z rozdzielnikiem `_` (`SNAKE_CASE_UPPER`):

```javascript
const MAKSYMALNA_LICZBA_PROB = 3;
const STAWKA_VAT = 0.23;
```

---

## 4. Zjawisko typowania dynamicznego

JavaScript należy do rodziny **języków skryptowych z typowaniem dynamicznym**. Oznacza to, że:

1. **Typ jest powiązany z wartością, a nie ze zmienną.** Podczas deklaracji zmiennej słowem `let` nie podajemy typu danych (jak w językach ze statycznym typowaniem, np. C czy C++).
2. **Zmienna może w trakcie działania programu zmienić typ przechowywanej wartości.**

```javascript
let dana = 100;         // Wartość liczVerification: typ number
console.log(typeof dana);

dana = "Sto złotych";   // Przypisanie tekstu: typ zmienia się na string
console.log(typeof dana);

dana = true;           // Przypisanie wartości logicznej: typ boolean
console.log(typeof dana);
```

!!! example "Przewiduj"

    Jakie typy wypisze funkcja `console.log` po kolejnych przypisaniach do tej samej zmiennej `dana`?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        number
        string
        boolean
        ```

        Program wykonał się bez żadnego błędu. W językach statycznie typowanych (np. C++) próba przypisania tekstu do zmiennej liczbowej wywołałaby błąd kompilacji.

### Pułapki typowania dynamicznego

Dynamiczne typowanie daje dużą elastyczność, ale wymaga ostrożności. Jeśli nie sprawdzimy typu danych pobranych od użytkownika (np. z formularza HTML), operator `+` może połączyć teksty zamiast dodać liczby:

```javascript
let cena = "50"; // Pobrano z pola tekstowego
let dostawa = 10;
let razem = cena + dostawa;

console.log(razem, typeof razem);
```

!!! example "Przewiduj"

    Co wypisze zmienna `razem`? Czy wynik wyniesie 60?

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        5010 string
        ```

        Zmienna `cena` zawiera ciąg znaków `"50"`. Operator `+` w przypadku połączenia tekstu i liczby zamienia liczbę na tekst i wykonuje **konkatenację** (sklejanie). Aby dokonać dodawania matematycznego, należy najpierw przekształcić tekst na liczbę (np. funkcją `Number(cena)`).

---

## 5. Przykłady z życia — const vs let w praktyce

Dobra struktura programu polega na trafnym doborze słów kluczowych (`const` lub `let`) oraz typów danych do realnych obiektów dziedzinowych.

### Kiedy stosować stałą (`const`)?

Stałe stosujemy do przechowywania wartości, które są stałymi regułami biznesowymi lub konfiguracją aplikacji i nie powny ulec przypadkowej modyfikacji:

- Stawka podatku VAT: `const stawkaVat = 0.23;`
- Maksymalna liczba nieudanych prób logowania: `const maxProbyLogowania = 3;`
- Adres URL serwera API: `const apiUrl = "https://api.szprycha-serwis.pl/v1";`
- Tytuł witryny internetowej: `const tytulStrony = "Serwis Rowerowy Szprycha";`

### Kiedy stosować zmienną (`let`)?

Zmienne stosujemy do parametrów, które zmieniają się w wyniku działań użytkownika lub przebiegu algorytmu:

- Bieżący wynik punktowy gracza: `let wynikGracza = 0;` (zwiększa się po zdobyciu punktu).
- Liczba towarów w koszyku: `let iloscWKoszyku = 1;` (zmienia się przy kliknięciu przycisku).
- Status zalogowania użytkownika: `let czyZalogowany = false;` (zmienia się z `false` na `true` po podaniu hasła).
- Łączna kwota zamówienia: `let sumaZamowienia = 0.0;` (przeliczana w pętli).

```javascript
// Przykład logiczny: obsługa koszyka w serwisie rowerowym
const cenaUslugi = 90; // Stawka stała za przegląd
const stawkaVat = 0.23;

let iloscRowerow = 2; // Zmienna zależna od wyboru klienta
let czyRabatEdukacyjny = true; // Zmienna logiczna

let kosztNetto = cenaUslugi * iloscRowerow;
if (czyRabatEdukacyjny) {
    kosztNetto = kosztNetto * 0.9; // Udzielenie 10% rabatu
}

const kosztBrutto = kosztNetto * (1 + stawkaVat);

console.log("Koszt netto:", kosztNetto, "zł");
console.log("Koszt brutto:", kosztBrutto.toFixed(2), "zł");
```

---

## 6. Najczęstsze błędy

| Objaw / Komunikat błędu | Przyczyna | Co zrobić |
| --- | --- | --- |
| `TypeError: Assignment to constant variable` | Próba przypisania nowej wartości do stałej zadeklarowanej przez `const`. | Zmień deklarację stałej na `let`, jeśli wartość ma być modyfikowana. |
| `SyntaxError: Missing initializer in const declaration` | Deklaracja stałej `const` bez jednoczesnego przypisania wartości. | Przypisz wartość w momencie deklaracji: `const x = 10;`. |
| `SyntaxError: Identifier 'x' has already been declared` | Ponowna deklaracja tej samej nazwy w tym samym zasięgu blokowym. | Usuń drugie słowo kluczowe `let`/`const` lub zmień nazwę zmiennej. |
| `ReferenceError: x is not defined` | Odwołanie się do zmiennej, która nie została w ogóle zadeklarowana lub znajduje się poza obecnym blokiem `{ }`. | Sprawdź pisownię nazwy oraz czy zmienna jest zadeklarowana przed jej użyciem. |
| Wyrażenie `10 + "5"` daje `"105"` | Dodanie liczby do tekstu powoduje konwersję liczby na tekst i sklejanie znaków. | Konwertuj tekst na liczbę za pomocą `Number("5")` lub `parseInt("5")`. |
| `SyntaxError: Unexpected token` przy `let class = 5;` | Użycie zastrzeżonego słowa kluczowego języka JavaScript (`class`) jako nazwy zmiennej. | Zmień nazwę identyfikatora, np. `let klasaUcznia = 5;`. |

---

## Ćwiczenia

Wszystkie ćwiczenia wykonujesz przy komputerze w edytorze kodu (np. VS Code) oraz w przeglądarce internetowej z otwartą konsolą deweloperską (++f12++).

Stwórz na swoim komputerze prostą strukturę plików:
1. Utwórz plik `index.html` zawierający podstawową strukturę dokumentu HTML5 oraz znacznik `<script src="script.js"></script>`.
2. Utwórz plik `script.js` w tym samym katalogu.
3. Otwórz plik `index.html` w przeglądarce i naciśnij ++f12++ → **Konsola**, aby obserwować wyniki działania skryptu.

---

### :material-console: Ćwiczenie 1 — Profil użytkownika i stałe const

W pliku `script.js` zadeklaruj zestaw stałych i zmiennych opisujących profil klienta serwisu rowerowego:

1. Zadeklaruj stałą `nazwaSerwisu` o wartości `"Szprycha"`.
2. Zadeklaruj stałą `idUzytkownika` z unikalnym numerem identyfikacyjnym (np. `1042`).
3. Zadeklaruj zmienne za pomocą `let`:
   - `imieUzytkownika` (tekst),
   - `wiekUzytkownika` (liczba),
   - `czyAktywny` (wartość logiczna `true` lub `false`),
   - `ostatniaWypozyczalnia` (zostaw bez przypisywania wartości — `undefined`).
4. Wypisz w konsoli wartości wszystkich zmiennych oraz ich typy za pomocą operatora `typeof`.

---

### :material-console: Ćwiczenie 2 — Testowanie mutowalności const vs let

Przetestuj zachowanie zmiennych i stałych podczas próby ich modyfikacji:

1. Zadeklaruj zmienną `punktyLojalnosciowe = 100`.
2. Zwieksz wartość `punktyLojalnosciowe` o 25 i wypisz nową wartość w konsoli.
3. Zadeklaruj stałą `maksymalnyRabat = 0.30`.
4. Spróbuj przypisać nową wartość do stałej `maksymalnyRabat = 0.50`.
5. Zaobserwuj błąd w konsoli przeglądarki (++f12++). Zapisz w karcie pracy dokładny treść komunikatu błędu i wyjaśnij, dlaczego wystąpił.
6. Zakomentuj linię wywołującą błąd, aby skrypt działał poprawnie.

---

### :material-console: Ćwiczenie 3 — Mini-kalkulator cen części rowerowych

:material-plus-circle: **rozszerzenie**

Napisz skrypt obliczający wartość koszyka w serwisie z uwzględnieniem stałej stawki VAT oraz możliwości zmiany liczby zamawianych przedmiotów:

1. Zadeklaruj stałą `STAWKA_VAT = 0.23`.
2. Zadeklaruj stałą `cenaDetki = 25` (zł netto za sztukę).
3. Zadeklaruj zmienną `iloscSztuk = 3`.
4. Oblicz koszt netto (`cenaDetki * iloscSztuk`) i przypisz do zmiennej `kosztNetto`.
5. Oblicz koszt brutto (`kosztNetto * (1 + STAWKA_VAT)`) i przypisz do stałej `kosztBrutto`.
6. Wypisz w konsoli czytelny komunikat używając szablonu tekstu (tzw. template string z użyciem znaków grawisu `` ` ``):
   `„Zamówiono 3 szt. Dętka 28. Razem netto: 75 zł, brutto: 92.25 zł.”`
7. Zmień wartość `iloscSztuk` na `5`, przelicz ponownie wartości i wypisz nowy wynik.

??? tip "Podpowiedź 1"

    Szablon tekstu (template string) tworzymy używając znaków grawisu `` ` tekst ` `` (klawisz pod ++esc++). Wewnątrz szablonu wartości zmiennych wstawiamy za pomocą `${nazwaZmiennej}`.

??? tip "Podpowiedź 2"

    Aby ograniczyć liczbę miejsc po przecinku w kwocie brutto do dwóch, użyj metody `.toFixed(2)` na zmiennej liczbowej, np. `kosztBrutto.toFixed(2)`.

??? tip "Podpowiedź 3"

    ```javascript
    const STAWKA_VAT = 0.23;
    const cenaDetki = 25;
    let iloscSztuk = 3;

    let kosztNetto = cenaDetki * iloscSztuk;
    const kosztBrutto = kosztNetto * (1 + STAWKA_VAT);

    console.log(`Zamówiono ${iloscSztuk} szt. Razem netto: ${kosztNetto} zł, brutto: ${kosztBrutto.toFixed(2)} zł.`);
    ```

---

### :material-console: Ćwiczenie 4 — Walidacja typów wejściowych operatorem typeof

:material-star: **dopełnienie**

Napisz funkcję lub blok kodu sprawdzający typ danych dostarczonych do skryptu i zabezpieczający przed błędnym obliczeniem:

1. Zadeklaruj zmienną `wejscieCena = "49.99"` (dane wprowadzone przez użytkownika jako tekst).
2. Zadeklaruj zmienną `wejscieIlosc = 2`.
3. Za pomocą instrukcji warunkowej `if` i operatora `typeof` sprawdź, czy `wejscieCena` jest typu `number`:
   - Jeśli nie jest typu `number`, przekonwertuj wartość na liczbę za pomocą `Number(wejscieCena)` i wypisz komunikat w konsoli: `"Konwersja wartości z typu string na number"`.
4. Oblicz iloczyn przekonwertowanej ceny i ilości, a wynik wypisz w konsoli.
5. Przeprowadź test zmieniając wartość `wejscieCena` na `null` oraz `undefined` i opisz w karcie pracy, jak zachowała się funkcja `Number()`.

??? tip "Podpowiedź 1"

    Operator `typeof` zwraca nazwę typu jako ciąg znaków ujęty w cudzysłów, np. `typeof wejscieCena === "string"`.

??? tip "Podpowiedź 2"

    Konwersja `Number("49.99")` daje liczbę `49.99`. Konwersja `Number(null)` zwraca `0`, natomiast `Number(undefined)` zwraca specjalną wartość `NaN` (*Not a Number*).

??? tip "Podpowiedź 3"

    ```javascript
    let wejscieCena = "49.99";
    let wejscieIlosc = 2;

    if (typeof wejscieCena !== "number") {
        console.log(`Wartość ma typ ${typeof wejscieCena}. Wykonuję konwersję...`);
        wejscieCena = Number(wejscieCena);
    }

    let razem = wejscieCena * wejscieIlosc;
    console.log(`Wynik: ${razem} (typ: ${typeof razem})`);
    ```

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła.**

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Które słowo kluczowe służy do zadeklarowania stałej w języku JavaScript?",
  "opcje": ["let", "var", "const", "static"],
  "poprawna": 2,
  "wyjasnienie": "Słowo kluczowe const tworzy stałą, której nie można przypisać nowej wartości po jej zainicjalizowaniu. let służy do zmiennych, a var jest przestarzałe."
 },
 {
  "pytanie": "Co się stanie po wykonaniu poniższego kodu w konsoli?",
  "kod": "const x = 10;\nx = 20;",
  "opcje": ["Zmienna x zmieni wartość na 20", "Zostanie zgłoszony błąd TypeError", "Zmienna x przyjmie wartość NaN", "Konsola wypisze undefined"],
  "poprawna": 1,
  "wyjasnienie": "Próba ponownego przypisania wartości do stałej zadeklarowanej słowem const powoduje błąd wykonania TypeError: Assignment to constant variable."
 },
 {
  "pytanie": "Jaki typ danych zwróci wyrażenie typeof null w JavaScript?",
  "opcje": ["\"null\"", "\"undefined\"", "\"object\"", "\"boolean\""],
  "poprawna": 2,
  "wyjasnienie": "TypeOf null zwraca napis \"object\". Jest to historyczny błąd we wczesnej implementacji języka JavaScript, zachowany dla wstecznej kompatybilności."
 },
 {
  "pytanie": "Która z podanych nazw zmiennych jest poprawna według konwencji camelCase?",
  "opcje": ["liczba_punktow", "LiczbaPunktow", "liczbaPunktow", "liczba-punktow"],
  "poprawna": 2,
  "wyjasnienie": "Konwencja camelCase wymaga rozpoczęcia nazwy małą literą oraz pisania każdego kolejnego słowa wielką literą, bez spacji, myślników czy podkreśleń."
 },
 {
  "pytanie": "Co zostanie wypisane w konsoli po wykonaniu podanego fragmentu kodu?",
  "kod": "let x = \"5\";\nlet y = 3;\nconsole.log(x + y);",
  "opcje": ["8", "53", "NaN", "TypeError"],
  "poprawna": 1,
  "wyjasnienie": "Operator + przy połączeniu ciągu znaków (\"5\") i liczby (3) wykonuje konwersję liczby na tekst i dokonuje konkatenacji (sklejania), dając tekst \"53\"."
 },
 {
  "pytanie": "Na czym polega zjawisko typowania dynamicznego w skryptowych językach programowania?",
  "opcje": [
   "Typ zmiennej musi zostać określony przed kompilacją i nie może ulec zmianie",
   "Typ jest powiązany z wartością, a zmienna może przechowywać wartości różnych typów w trakcie działania programu",
   "Wszystkie zmienne są automatycznie konwertowane do typu string",
   "Stałe typu const mogą zmieniać swój typ, ale nie wartość"
  ],
  "poprawna": 1,
  "wyjasnienie": "W typowaniu dynamicznym zmienne nie mają przypisanego sztywnego typu na stałe — typ posiada sama wartość, co pozwala na przypisywanie zmiennej danych różnych typów w czasie działania programu."
 },
 {
  "pytanie": "Jaka jest domyślna wartość zmiennej zadeklarowanej za pomocą słowa let, której nie przypisano żadnej wartości wyjściowej?",
  "opcje": ["0", "null", "undefined", "false"],
  "poprawna": 2,
  "wyjasnienie": "Zmienna zadeklarowana słowem let bez inicjalizacji (np. let wiek;) posiada domyślnie wartość undefined."
 },
 {
  "pytanie": "Który z podanych identyfikatorów spowoduje błąd składniowy (SyntaxError) przy próbie deklaracji?",
  "opcje": ["$cenaUslugi", "_idKlienta", "1miejsce", "uzytkownik2"],
  "poprawna": 2,
  "wyjasnienie": "Identyfikatory w JavaScript nie mogą rozpoczynać się od cyfry. Nazwa 1miejsce spowoduje błąd składniowy."
 }
]
</script>
</div>

---

## Karta pracy

Z tego tematu oddajesz **kartę pracy** w formacie Word. Kartę wypełniaj w trakcie ćwiczeń: wpisuj przewidywania **przed** uruchomieniem kodu, a wyniki i wnioski — po wykonaniu w konsoli.

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

!!! info "Materiały uzupełniające"

    - Gramatyka i deklaracja zmiennych w JavaScript (po polsku): [developer.mozilla.org/pl/docs/Web/JavaScript/Guide/Grammar_and_types](https://developer.mozilla.org/pl/docs/Web/JavaScript/Guide/Grammar_and_types)
    - Opis słowa kluczowego const (po angielsku): [developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
    - Opis słowa kluczowego let (po angielsku): [developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
    - Typy danych w JavaScript (po angielsku): [javascript.info/types](https://javascript.info/types)
