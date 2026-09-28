# Wprowadzenie do programowania aplikacji internetowych

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział III. Podstawy programowania — środowisko i dane
    · efekty kształcenia **INF.03.5.1**, **INF.03.5.2**

    Do tej pory budowałeś **strony**: każdy, kto wszedł pod adres, dostawał ten
    sam plik. Cennik serwisu „Szprycha” był tabelką, którą klient musiał
    przeczytać i przeliczyć w głowie. W tym temacie ta tabelka zaczyna
    **liczyć sama**.

    Zrobisz to dwa razy — raz w przeglądarce, w JavaScripcie, i raz na
    serwerze, w PHP. Ten sam wynik, dwie zupełnie różne drogi. Kto rozumie,
    czym się różnią, ten nie popełni błędu, który w aplikacjach internetowych
    kosztuje najwięcej: **zaufania temu, co przysłał użytkownik**.

    | Lekcja | Sekcje | Ćwiczenia |
    | :---: | --- | --- |
    | 1 | 1–3: strona a aplikacja, HTTP, klient i serwer | 1 |
    | 2 | 4: pierwszy skrypt JavaScript | 2–3 |
    | 3 | 5–9: PHP, formularz, zaufanie do danych, najczęstsze błędy | 4–6 |

!!! question "Na rozgrzewkę — 3 minuty, bez zaglądania"

    Odpowiedz w zeszycie, zanim zaczniesz nowy temat. Odpowiedzi rozwiń
    dopiero wtedy, gdy wszyscy skończą — nie liczą się do oceny.

    1. **Z poprzedniej lekcji.** Hosting daje do wyboru FTP i SFTP. Który
       wybierasz i dlaczego?
    2. **Sprzed kilku tygodni.** Walidator wskazuje błąd w wierszu 12, a w tym
       wierszu wszystko wygląda dobrze. Gdzie szukasz przyczyny?
    3. **Z dawniejszych tematów.** Pole formularza ma `id="imie"` i
       `name="imie_klienta"`. Pod którą nazwą jego wartość dotrze na serwer?

    ??? success "Odpowiedzi"

        1. **SFTP** — szyfruje i hasło, i przesyłane pliki. Zwykły FTP wysyła
           hasło otwartym tekstem.
        2. **Wyżej** — zwykle przyczyną jest niedomknięty znacznik albo
           cudzysłów kilka wierszy nad wskazanym miejscem. Z tą samą
           zasadą spotkasz się dziś przy błędach PHP.
        3. `imie_klienta` — serwer widzi atrybut **`name`**. Atrybut `id` służy
           etykiecie, CSS i JavaScriptowi.

!!! success "Kryteria sukcesu"

    Po tym temacie:

    1. Powiem jednym zdaniem, czym aplikacja internetowa różni się od strony — i podam przykład każdej z nich.
    2. Otworzę zakładkę **Sieć** i odczytam z niej metodę, kod statusu i typ treści żądania.
    3. Powiem, gdzie wykonuje się JavaScript, a gdzie PHP, i co użytkownik widzi z każdego z nich.
    4. Dołączę skrypt do strony, wypiszę komunikat w konsoli i obsłużę kliknięcie przycisku.
    5. Uruchomię skrypt PHP przez `http://localhost/…` i odbiorę w nim dane z formularza.
    6. Wyjaśnię, dlaczego serwer sprawdza dane sam, nawet gdy formularz sprawdził je wcześniej.

---

## 1. Strona a aplikacja internetowa

**Strona internetowa** to dokument: tekst, obrazy, odnośniki. Pokazuje
wszystkim to samo i niczego nie zmienia.

**Aplikacja internetowa** to program, którego interfejsem jest strona.
Przyjmuje dane od użytkownika, coś z nimi robi i odpowiada wynikiem —
za każdym razem innym, bo zależnym od danych.

| | Strona | Aplikacja |
| --- | --- | --- |
| Przykład | cennik serwisu rowerowego | wycena naprawy na podstawie wybranych usług |
| Co dostaje użytkownik | zawsze ten sam dokument | wynik obliczony dla jego danych |
| Z czego się składa | HTML i CSS | HTML i CSS **oraz program** |
| Przykłady z życia | strona o firmie, regulamin | e-dziennik, sklep internetowy, bankowość, rozkład jazdy z wyszukiwarką |

Granica bywa płynna — strona z jednym przyciskiem „pokaż menu” też ma w sobie
kawałek programu. Dla nas liczy się jedno pytanie: **czy coś tu jest
obliczane albo zapamiętywane?** Jeśli tak, potrzebny jest program. Pytanie
brzmi tylko: gdzie ma się wykonać.

---

## 2. Żądanie i odpowiedź — jak przeglądarka rozmawia z serwerem

Każde wejście na stronę to rozmowa według protokołu **HTTP** — w praktyce
szyfrowanego **HTTPS**. Rozmowa ma zawsze dwie części:

1. **Żądanie** (*request*) — przeglądarka wysyła do serwera: *„daj mi
   `/wycena/index.html`”*. Mówi przy tym, jaką **metodą** prosi (najczęściej
   `GET`), jakiej jest wersji i jakie formaty rozumie.
2. **Odpowiedź** (*response*) — serwer odsyła **kod statusu**, nagłówki (na
   przykład typ treści `text/html; charset=UTF-8`) i samą treść.
3. Przeglądarka czyta otrzymany HTML, widzi w nim `<link>` do arkusza stylów,
   `<img>` i `<script>` — i **dla każdego z tych plików wysyła osobne
   żądanie**. Jedna strona to często kilkadziesiąt rozmów.

!!! example "Przewiduj"

    Strona `index.html` dołącza jeden arkusz stylów, jeden skrypt i dwa
    obrazy. Ile żądań wyśle przeglądarka po wpisaniu adresu tej strony?

    ??? success "Przewiduj, potem sprawdź wynik"

        **Pięć** — jedno po sam dokument i po jednym na każdy plik, który się
        w nim znalazł: CSS, skrypt i dwa obrazy. Często dochodzi szóste, po
        ikonę karty `favicon.ico`, o którą przeglądarka prosi sama. Sprawdzisz
        to w ćwiczeniu 1.

Kody statusu, które spotkasz najczęściej:

| Kod | Znaczenie | Kiedy go zobaczysz |
| :---: | --- | --- |
| **200** | OK | wszystko w porządku |
| **301**, **302** | przekierowanie | strona przeniesiona pod inny adres |
| **404** | Not Found | literówka w adresie albo w nazwie pliku |
| **500** | Internal Server Error | błąd w programie na serwerze |

!!! tip "Rozmowę widać w narzędziach deweloperskich"

    ++f12++ → zakładka **Sieć** (*Network*) → odśwież stronę ++f5++. Każdy
    wiersz to jedno żądanie. Kliknij pierwszy — w zakładce **Nagłówki**
    zobaczysz metodę, kod statusu i typ treści. Od tego zaczyna się
    ćwiczenie 1.

### GET i POST

Formularz może wysłać dane na dwa sposoby:

- **`GET`** — dane doklejone do adresu po znaku zapytania:
  `wycena.php?usluga=przeglad&rowery=3`. Widać je, można je skopiować,
  zapisać w zakładce, **i można je zmienić ręcznie w pasku adresu**.
- **`POST`** — dane jadą w treści żądania, poza adresem. Tak wysyła się
  hasła, dane osobowe i wszystko, co coś zmienia — zamówienie, wpis
  w dzienniku, przelew.

W tym temacie używamy `GET`, bo widać w nim dokładnie, co przyszło do serwera.
Ale zapamiętaj: `POST` **nie jest zabezpieczeniem**. Dane są tylko schowane
przed okiem, a nie przed kimś, kto otworzy narzędzia deweloperskie.

---

## 3. Po stronie klienta i po stronie serwera

Program aplikacji internetowej może się wykonać w dwóch miejscach —
i to jest najważniejsza rzecz w tym temacie.

| | Po stronie **klienta** | Po stronie **serwera** |
| --- | --- | --- |
| Język na naszych lekcjach | **JavaScript** | **PHP** |
| Gdzie się wykonuje | w przeglądarce użytkownika | na komputerze, na którym stoi strona |
| Kiedy | **po** pobraniu strony, w odpowiedzi na działania użytkownika | **zanim** strona zostanie wysłana |
| Czy użytkownik widzi kod | **tak** — całość, ++ctrl+u++ | **nie** — widzi tylko wynik |
| Czy użytkownik może go zmienić | **tak**, w narzędziach deweloperskich | nie |
| Do czego ma dostęp | do strony (przyciski, pola, treść), do okna przeglądarki | do plików na serwerze, do bazy danych, do poczty |
| Czego nie może | sięgnąć do bazy danych serwera | zareagować na ruch myszą bez nowego żądania |
| Typowe zadania | reakcja na kliknięcie, podpowiedzi przy wypełnianiu, przeliczanie na bieżąco | logowanie, zapis zamówienia, odczyt z bazy, wysyłka maila |

!!! quote "Zasada, którą warto zapamiętać"

    Przeglądarka należy do **użytkownika**. Serwer należy do **ciebie**.
    Wszystko, co dzieje się w przeglądarce, użytkownik może podejrzeć
    i zmienić — dlatego decyzje, które mają znaczenie, zapadają na serwerze.

JavaScript od kilkunastu lat działa także na serwerach (środowisko Node.js),
a PHP bywa uruchamiany z wiersza poleceń. Na egzaminie zawodowym INF.03
i na naszych lekcjach podział jest jednak wyraźny: **JavaScript w przeglądarce,
PHP na serwerze**. PHP nie jest przy tym językiem muzealnym — według W3Techs
we wrześniu 2026 r. działał na blisko **70%** stron, których język po stronie
serwera da się ustalić.

---

## 4. Pierwszy skrypt JavaScript

### Gdzie wstawić skrypt

Skrypt dołączasz znacznikiem `<script>` — najlepiej z osobnego pliku,
**na końcu `<body>`**:

```html
  <p id="wynik"></p>

  <script src="js/wycena.js"></script>
</body>
</html>
```

Dlaczego na końcu? Przeglądarka czyta dokument od góry. Skrypt wstawiony
w `<head>` wykona się, **zanim** powstanie przycisk, którego szuka — i dostanie
`null` zamiast przycisku. Drugie poprawne wyjście to `<script src="…" defer>`
w nagłówku: atrybut `defer` każe poczekać z wykonaniem do końca wczytywania.

### Konsola — pierwszy kontakt z programem

```js
console.log("Skrypt wczytany");
```

Ta linijka nic nie pokazuje na stronie. Jej wynik zobaczysz w narzędziach
deweloperskich, w zakładce **Konsola** (*Console*). Tam też pojawiają się
**błędy skryptu** — na czerwono, z nazwą pliku i numerem wiersza. Kto pisze
JavaScript z zamkniętą konsolą, pisze po omacku.

Konsola przyjmuje też polecenia. Wpisz w niej `2 + 2` i naciśnij ++enter++ —
to najszybszy sposób, żeby sprawdzić, co zwraca jakiś fragment kodu.

### Reakcja na kliknięcie

Program w przeglądarce czeka na **zdarzenia** — kliknięcie, wpisanie znaku,
przewinięcie strony. Oto kompletny przykład: przycisk, który pokazuje
aktualną godzinę.

```html
<button type="button" id="pokaz">Która godzina?</button>
<p id="zegar"></p>

<script>
  document.getElementById("pokaz").addEventListener("click", function () {
    const teraz = new Date();
    document.getElementById("zegar").textContent =
      "Teraz jest " + teraz.toLocaleTimeString("pl-PL");
  });
</script>
```

| Fragment | Co robi |
| --- | --- |
| `document.getElementById("pokaz")` | odnajduje na stronie element o `id="pokaz"` |
| `.addEventListener("click", function () { … })` | każe wykonać podaną funkcję **przy każdym kliknięciu** |
| `const teraz = new Date();` | tworzy stałą z bieżącą datą i godziną — **z komputera użytkownika** |
| `.textContent = …` | wpisuje tekst do akapitu `id="zegar"` |
| `+` między tekstami | skleja teksty w jeden |

!!! example "Przewiduj"

    Zegar w komputerze ucznia jest przestawiony o godzinę do przodu. Jaką
    godzinę pokaże ten przycisk — prawdziwą czy przestawioną?

    ??? success "Przewiduj, potem sprawdź wynik"

        **Przestawioną.** `new Date()` czyta zegar komputera, na którym działa
        skrypt — a JavaScript działa u użytkownika. Zapamiętaj to do sekcji 5:
        `date()` w PHP czyta zegar **serwera**.

!!! warning "Pułapka numer jeden: pole formularza zawsze oddaje tekst"

    Wartość odczytana z pola `<input>` — nawet `type="number"` — jest
    **tekstem**, nie liczbą. Przewidź, co zwróci każdy wiersz, zanim rozwiniesz
    odpowiedź. Sprawdzisz to w konsoli w ćwiczeniu 2.

    ```js
    "1" + 1
    Number("1") + 1
    "90" * 2
    ```

    ??? success "Przewiduj, potem sprawdź wynik"

        ```text
        "11"   — znak + przy tekście nie dodaje, tylko skleja
        2      — Number() zamienił tekst na liczbę, więc + dodaje
        180    — mnożenie nie ma drugiego znaczenia, więc tekst zamienia się sam
        ```

    Dlatego wartość z pola, z którą chcesz liczyć, zamieniasz najpierw funkcją
    `Number()`. Trzeci wiersz działa przypadkiem — na takim szczęściu nie
    buduje się programu. Typom danych poświęcony jest osobny temat w tym
    dziale.

---

## 5. Pierwszy skrypt PHP

### Serwer w pracowni: XAMPP

PHP potrzebuje serwera. W pracowni — tak jak na stanowisku egzaminacyjnym —
jest nim pakiet **XAMPP**: serwer WWW Apache, interpreter PHP, serwer baz
danych MariaDB i phpMyAdmin w jednej instalacji. Aktualna wersja dla Windows
to 8.2.12 (PHP 8.2).

1. Uruchom **XAMPP Control Panel** i kliknij **Start** przy module **Apache**.
   Nazwa modułu ma podświetlić się na zielono.
2. Pliki aplikacji umieszczasz w katalogu **`C:\xampp\htdocs\`** — każdy
   projekt w osobnym podkatalogu, na przykład `C:\xampp\htdocs\wycena\`.
3. W przeglądarce otwierasz **`http://localhost/wycena/`**.
   `localhost` oznacza „ten sam komputer” — przeglądarka rozmawia z serwerem
   uruchomionym na twoim stanowisku.

!!! danger "Nigdy nie otwieraj pliku PHP podwójnym kliknięciem"

    Adres zaczynający się od `file:///C:/…` oznacza, że przeglądarka czyta plik
    z dysku, **bez serwera**. HTML i JavaScript zadziałają, ale PHP się nie
    wykona — zobaczysz surowy kod, pustą stronę albo okno pobierania pliku.

    | Adres w pasku | Kto czyta plik | Czy PHP działa |
    | --- | --- | :---: |
    | `file:///C:/xampp/htdocs/wycena/pierwszy.php` | przeglądarka, prosto z dysku | **nie** |
    | `http://localhost/wycena/pierwszy.php` | serwer Apache z PHP | **tak** |

### Składnia na start

Utwórz plik `C:\xampp\htdocs\wycena\pierwszy.php`:

```php
<?php
$serwis = 'Szprycha';
$dzis = date('d.m.Y');
?>
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Pierwszy skrypt PHP</title>
</head>
<body>
  <h1>Witaj w serwisie <?php echo $serwis; ?></h1>
  <p>Dziś jest <?php echo $dzis; ?>, godzina <?php echo date('H:i:s'); ?>.</p>
  <p>Serwer działa na PHP w wersji <?php echo phpversion(); ?>.</p>
</body>
</html>
```

| Element | Znaczenie |
| --- | --- |
| `<?php … ?>` | tu zaczyna się i kończy kod PHP; wszystko poza tymi znacznikami serwer wysyła bez zmian |
| `$serwis` | zmienna — w PHP **każda** nazwa zmiennej zaczyna się od `$` |
| `;` | koniec instrukcji — w PHP **obowiązkowy** |
| `echo` | wypisuje tekst do odpowiedzi, czyli do HTML, który dostanie przeglądarka |
| `date('d.m.Y')` | data **z zegara serwera** w podanym formacie |
| `.` | sklejanie tekstów — w PHP kropka, nie plus |

Odśwież stronę kilka razy — godzina się zmienia, bo **serwer buduje
dokument od nowa przy każdym żądaniu**.

!!! example "Przewiduj"

    Otwierasz `http://localhost/wycena/pierwszy.php` i naciskasz ++ctrl+u++.
    Czy w źródle strony zobaczysz `$serwis` i `<?php`?

    ??? success "Przewiduj, potem sprawdź wynik"

        **Nie.** W źródle jest gotowy HTML — na przykład
        `<h1>Witaj w serwisie Szprycha</h1>` i data wpisana na sztywno. Kod PHP
        wykonał się na serwerze i do przeglądarki trafiło tylko to, co wypisał
        `echo`.

!!! warning "Komunikat o błędzie wskazuje linijkę za błędem"

    Brak średnika w PHP kończy się komunikatem wypisanym na stronie:

    ```text
    Parse error: syntax error, unexpected variable "$dzis"
    in C:\xampp\htdocs\wycena\pierwszy.php on line 3
    ```

    Średnika zabrakło w wierszu **2**, a PHP zgłasza wiersz **3** — bo dopiero
    tam trafił na coś, czego się nie spodziewał. Szukając błędu, zaczynasz od
    wskazanego wiersza **i patrzysz o jeden w górę**.

---

## 6. Formularz, który trafia do PHP

Formularz HTML wysyła dane pod adres z atrybutu `action`, metodą z atrybutu
`method`. Nazwy danych biorą się z atrybutów **`name`** pól — `id` służy
JavaScriptowi i serwer go nie widzi.

```html
<form action="powitanie.php" method="get">
  <label for="imie">Imię</label>
  <input type="text" id="imie" name="imie">
  <button type="submit">Wyślij</button>
</form>
```

Po wpisaniu „Ola” i kliknięciu przeglądarka wysyła żądanie
`powitanie.php?imie=Ola`. W PHP dane z adresu leżą w tablicy **`$_GET`**:

```php
<?php
$imie = $_GET['imie'] ?? 'nieznajomy';
echo 'Cześć, ' . htmlspecialchars($imie) . '!';
```

- `$_GET['imie']` — wartość pola o nazwie `imie`, zawsze jako tekst;
- `?? 'nieznajomy'` — wartość zastępcza, gdy pola w żądaniu nie ma wcale
  (ktoś wszedł na adres bez formularza);
- `htmlspecialchars()` — o tym za chwilę, w sekcji 7.

!!! example "Przewiduj"

    Co wypisze `powitanie.php` pod każdym z tych adresów?

    1. `powitanie.php?imie=Ola`
    2. `powitanie.php`
    3. `powitanie.php?imie=`

    ??? success "Przewiduj, potem sprawdź wynik"

        1. `Cześć, Ola!`
        2. `Cześć, nieznajomy!` — pola `imie` w żądaniu nie ma wcale, więc
           działa wartość zastępcza po `??`.
        3. `Cześć, !` — pole **jest**, tylko puste. Operator `??` reaguje
           wyłącznie na brak pola, a nie na pusty tekst. Pusty tekst
           sprawdzisz osobno — to zadanie dla walidacji z sekcji 7.

!!! info "Niezaznaczone pole wyboru nie przychodzi wcale"

    `<input type="checkbox" name="ekspres">` trafia do `$_GET` **tylko wtedy,
    gdy jest zaznaczone**. Dlatego nie pytasz o jego wartość, tylko o to,
    czy w ogóle przyszło: `isset($_GET['ekspres'])`.

---

## 7. Nie ufaj niczemu, co przyszło od klienta

:material-plus-circle: **rozszerzenie**

W formularzu wyceny pole liczby rowerów ma `min="1" max="20"`. Przeglądarka
nie pozwoli wpisać zera. Ale wystarczy zmienić adres w pasku:

```text
http://localhost/wycena/wycena.php?usluga=przeglad&rowery=-3
```

i do serwera trafia **minus trzy rowery**. Atrybuty `min`, `max`, `required`
i sprawdzanie w JavaScripcie to **wygoda dla uczciwego użytkownika** —
podpowiedź, zanim wyśle. **Bezpieczeństwo zapewnia wyłącznie serwer**, bo
tylko jego kodu użytkownik nie może zmienić.

```php
if (!isset($ceny[$usluga]) || $rowery < 1 || $rowery > 20) {
    $komunikat = 'Niepoprawne dane zamówienia.';
}
```

### Tekst od użytkownika wypisuj przez htmlspecialchars

Jeśli PHP wypisze na stronę to, co przyszło w adresie, bez żadnej obróbki,
użytkownik może przysłać **kod HTML — albo skrypt** — i serwer wstawi go do
strony, jakby był jej częścią. To atak nazywany **XSS** (*cross-site
scripting*).

```php
echo 'Cześć, ' . $imie;                    // niebezpieczne
echo 'Cześć, ' . htmlspecialchars($imie);  // bezpieczne
```

`htmlspecialchars()` zamienia znaki `<`, `>`, `&` i cudzysłowy na encje, więc
przeglądarka pokaże je jako tekst, zamiast je wykonać.

!!! example "Przewiduj"

    Ktoś wpisuje adres `powitanie.php?imie=<b>Ola</b>`. Co zobaczy na stronie
    przy pierwszej wersji `echo`, a co przy drugiej?

    ??? success "Przewiduj, potem sprawdź wynik"

        - Bez `htmlspecialchars()`: **Cześć, Ola!** z pogrubionym imieniem —
          przeglądarka wykonała znacznik, który przysłał użytkownik. Zamiast
          `<b>` mógł przysłać `<script>`.
        - Z `htmlspecialchars()`: dosłownie `Cześć, <b>Ola</b>!` — znaczniki
          są zwykłym tekstem. W źródle strony zobaczysz `&lt;b&gt;`.

!!! quote "Zasada, którą warto zapamiętać"

    Sprawdzanie w przeglądarce jest **dla wygody**.
    Sprawdzanie na serwerze jest **dla bezpieczeństwa**.
    Pierwsze można pominąć. Drugiego — nigdy.

---

## 8. JavaScript czy PHP?

| Zadanie | Gdzie | Dlaczego |
| --- | --- | --- |
| Przeliczanie ceny na bieżąco przy zmianie opcji | JavaScript | bez przeładowania strony, natychmiast |
| Zapisanie zamówienia | PHP | trzeba zapisać dane na serwerze albo w bazie |
| Sprawdzenie hasła przy logowaniu | PHP | hasło porównane w przeglądarce widziałby każdy |
| Rozwijane menu na telefonie | JavaScript | dotyczy wyłącznie wyglądu na ekranie użytkownika |
| Ostateczna cena w zamówieniu | PHP | cenę z przeglądarki użytkownik może zmienić |
| Podpowiedź „hasło za krótkie” podczas pisania | JavaScript | wygoda — i tak sprawdzi to jeszcze serwer |
| Lista produktów z bazy danych | PHP | tylko serwer ma dostęp do bazy |

Najczęstsza odpowiedź w prawdziwych aplikacjach brzmi: **oba**. JavaScript
daje szybką odpowiedź i wygodę, PHP podejmuje decyzję i pilnuje danych.
Dokładnie tak zbudujesz w ćwiczeniach wycenę naprawy.

---

## 9. Najczęstsze błędy na start

| Objaw | Przyczyna | Co zrobić |
| --- | --- | --- |
| Zamiast strony widać kod PHP albo przeglądarka proponuje pobranie pliku | plik otwarty z dysku (`file:///`) albo Apache wyłączony | adres `http://localhost/…`, Apache włączony w XAMPP |
| `Not Found` (404) pod `localhost` | plik nie leży w `htdocs` albo literówka w nazwie katalogu | sprawdź ścieżkę; pisz nazwy małymi literami — XAMPP pod Windows ich nie rozróżnia, ale serwer z Linuksem na hostingu już tak |
| Przycisk nic nie robi, na stronie brak komunikatu | błąd w skrypcie | ++f12++ → Konsola — tam jest wiersz z błędem |
| `Cannot read properties of null` w konsoli | skrypt szuka elementu, którego jeszcze nie ma albo `id` się nie zgadza | skrypt na końcu `<body>`; porównaj `id` litera po literze |
| Wynik `9030` zamiast `120` | `+` skleił tekst z pola z liczbą | `Number()` przed dodawaniem |
| `Parse error … on line 7` | brak średnika albo nawiasu | wiersz 7 **i wiersz nad nim** |
| `Warning: Undefined array key` | skrypt czyta z `$_GET` pole, którego nie wysłano | `??` z wartością zastępczą albo `isset()` |

---

## Ćwiczenia

Pobierz paczkę i **rozpakuj katalog `wycena` do `C:\xampp\htdocs\`** — ma
powstać `C:\xampp\htdocs\wycena\index.html`. Formularz i wygląd są gotowe.
Uzupełniasz dwa pliki: `js/wycena.js` i `wycena.php`; miejsca do
uzupełnienia są oznaczone słowem `ZADANIE`.

[:material-folder-zip: Wycena naprawy — paczka startowa (.zip)](../pliki/wycena-start.zip){ .md-button .md-button--primary download="wycena-start.zip" }

Cennik jest ten sam co na stronie „Szprychy”: przegląd podstawowy 90 zł,
centrowanie koła 45 zł, wymiana łańcucha 60 zł, serwis amortyzatora 220 zł.
Tryb ekspresowy dolicza **30 zł do całego zamówienia**, niezależnie od liczby
rowerów.

### :material-console: Ćwiczenie 1 — podsłuchaj rozmowę

Uruchom Apache i otwórz `http://localhost/wycena/` z otwartą zakładką **Sieć**.
Odśwież stronę. Zapisz: ile żądań wysłała przeglądarka, jakie pliki pobrała,
jaki kod statusu i typ treści ma sam dokument. Potem wpisz w adresie
`http://localhost/wycena/cennik.html` — pliku o tej nazwie nie ma. Jaki kod
wrócił tym razem?

### :material-console: Ćwiczenie 2 — konsola

W pliku `js/wycena.js` wykonaj **ZADANIE 1**: wypisz w konsoli komunikat, że
skrypt się wczytał. Sprawdź, czy się pojawił.

Potem wpisz w konsoli ręcznie dwa polecenia i porównaj wyniki:

```js
document.getElementById("rowery").value + 1
Number(document.getElementById("rowery").value) + 1
```

### :material-console: Ćwiczenie 3 — wycena w przeglądarce

Wykonaj **ZADANIA 2–4** w `js/wycena.js`: po kliknięciu przycisku *Oblicz
w przeglądarce* odczytaj usługę, liczbę rowerów i tryb ekspresowy, policz
koszt i wpisz go do akapitu `wynik`. Sprawdź program na tych danych —
**wynik musi się zgadzać co do złotówki**:

| Usługa | Rowery | Ekspres | Oczekiwany wynik |
| --- | :---: | :---: | :---: |
| Przegląd podstawowy | 3 | tak | 300 zł |
| Serwis amortyzatora | 1 | nie | 220 zł |
| Centrowanie koła | 4 | nie | 180 zł |

??? tip "Podpowiedź 1"

    Każdy z trzech elementów formularza odczytujesz tak samo: `document.getElementById("…")`, a potem właściwość. Dla listy i pola liczby to `.value`, dla pola wyboru — `.checked` (`true` albo `false`).

??? tip "Podpowiedź 2"

    Liczba rowerów przychodzi jako tekst — owiń ją w `Number(…)`. Cenę odczytujesz z obiektu po nazwie usługi: `CENY[usluga]`. Dopłatę dodajesz w instrukcji `if (ekspres) { … }`.

??? tip "Podpowiedź 3"

    Szkielet:

    ```js
    const rowery = Number(document.getElementById("rowery").value);
    // … usługa i ekspres odczytane tak samo …
    let razem = CENY[usluga] * rowery;
    if (ekspres) {
      razem = razem + DOPLATA_EKSPRES;
    }
    document.getElementById("wynik").textContent = "Szacunkowy koszt: " + razem + " zł";
    ```

    `Number()` stawiasz od razu przy odczycie z pola. Przy mnożeniu tekst
    zamieniłby się na liczbę sam, ale gdy do wartości z pola cokolwiek
    **dodajesz**, bez `Number()` dostaniesz sklejony tekst.

### :material-console: Ćwiczenie 4 — pierwszy skrypt PHP

Utwórz `pierwszy.php` z sekcji 5 w katalogu `C:\xampp\htdocs\wycena\`. Otwórz
go przez `http://localhost/wycena/pierwszy.php`, potem obejrzyj źródło
(++ctrl+u++). Następnie otwórz ten sam plik z Eksploratora plików, podwójnym
kliknięciem, i zapisz, co się stało.

Na koniec usuń celowo średnik z końca wiersza 2 (`$serwis = 'Szprycha';`).
Zanotuj komunikat i numer wiersza, który podał PHP — i porównaj go z wierszem,
w którym naprawdę jest błąd. Średnik tuż przed znacznikiem `?>` (wiersz 3)
można pominąć bez błędu, bo `?>` sam kończy instrukcję — dlatego usuwasz go
z wiersza 2.

### :material-console: Ćwiczenie 5 — wycena na serwerze

Wykonaj **ZADANIA 1–2** w `wycena.php`: odczytaj dane z `$_GET` i policz koszt
tak samo jak w JavaScripcie. Sprawdź tymi samymi trzema przypadkami
z ćwiczenia 3, tym razem przyciskiem *Wyślij do serwera*. Przepisz adres,
który pojawił się w pasku po wysłaniu formularza.

Na koniec wyłącz JavaScript w przeglądarce (++f12++ → ++ctrl+shift+p++ →
wpisz *Disable JavaScript* → ++enter++) i przetestuj oba przyciski. Który
jeszcze działa? Po teście włącz JavaScript z powrotem tym samym sposobem.

??? tip "Podpowiedź 1"

    Dane z formularza leżą w `$_GET` pod nazwami z atrybutów `name`: `$_GET['usluga']`, `$_GET['rowery']`. Pola `ekspres` nie pytasz o wartość, tylko o to, czy przyszło: `isset($_GET['ekspres'])`.

??? tip "Podpowiedź 2"

    Przy każdym odczycie daj wartość zastępczą operatorem `??`, na przykład `$_GET['rowery'] ?? 0` — wtedy brak pola nie kończy się ostrzeżeniem. Liczbę rowerów zamień na liczbę całkowitą: `(int)`.

??? tip "Podpowiedź 3"

    Szkielet:

    ```php
    $usluga  = $_GET['usluga'] ?? '';
    $rowery  = (int) ($_GET['rowery'] ?? 0);
    $razem   = $ceny[$usluga] * $rowery;
    if (isset($_GET['ekspres'])) {
        $razem = $razem + $doplataEkspres;
    }
    $komunikat = 'Szacunkowy koszt: ' . $razem . ' zł';
    ```

    Pamiętaj o kropce, nie plusie, przy sklejaniu tekstu.

### :material-console: Ćwiczenie 6 — spróbuj oszukać własny serwer

:material-plus-circle: **rozszerzenie**

Nie używając formularza, **zmieniaj adres w pasku** i sprawdzaj, co odpowie
twój `wycena.php`:

1. `?usluga=przeglad&rowery=-3`
2. `?usluga=xyz&rowery=2`
3. `?rowery=2` (bez usługi)
4. `?usluga=przeglad&rowery=1000`

Zapisz, co pokazał serwer. Potem dopisz w PHP sprawdzanie danych tak, żeby
na każdy z tych adresów odpowiadał komunikatem *Niepoprawne dane zamówienia.*,
a na poprawne dane — kosztem.

Na koniec dopisz do wyniku nazwę usługi z adresu i wpisz w pasku
`?usluga=<i>test</i>&rowery=1`. Opisz, co się stało, i napraw to funkcją
`htmlspecialchars()`.

??? tip "Podpowiedź 1"

    Wszystkie cztery złe adresy łapie jeden warunek. Zapytaj o trzy rzeczy: czy taka usługa jest w cenniku, czy rowerów jest co najmniej 1 i czy nie więcej niż 20.

??? tip "Podpowiedź 2"

    Czy usługa jest w cenniku, sprawdza `isset($ceny[$usluga])`. Trzy warunki łączysz operatorem `||` („lub”) — wystarczy, że jeden jest spełniony, i dane są złe. Wzór masz w sekcji 7.

??? tip "Podpowiedź 3"

    Całość to `if (!isset($ceny[$usluga]) || $rowery < 1 || $rowery > 20) { $komunikat = 'Niepoprawne dane zamówienia.'; } else { … }` — a obliczenia z ćwiczenia 5 przenosisz do gałęzi `else`. Nazwę usługi wypisujesz jako `htmlspecialchars($usluga)`.

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła.**

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Co odróżnia aplikację internetową od strony internetowej?",
  "opcje": ["Aplikacja ma więcej podstron", "Aplikacja przyjmuje dane od użytkownika i odpowiada wynikiem obliczonym dla tych danych", "Aplikacja działa tylko po zalogowaniu", "Aplikacja nie używa HTML"],
  "poprawna": 1,
  "wyjasnienie": "Strona pokazuje wszystkim ten sam dokument. Aplikacja coś oblicza albo zapamiętuje — do tego potrzebny jest program, w przeglądarce, na serwerze albo w obu miejscach."
 },
 {
  "pytanie": "Jaki kod statusu HTTP dostaniesz, gdy wpiszesz adres pliku, którego nie ma na serwerze?",
  "odpowiedz": ["404", "404 not found"],
  "wyjasnienie": "404 Not Found — serwer działa, ale pod tym adresem nic nie ma. Kod 500 oznaczałby błąd w programie na serwerze."
 },
 {
  "pytanie": "Uczeń otwiera stronę z kodem PHP i naciska Ctrl+U. Co zobaczy w źródle?",
  "opcje": ["Kod PHP razem z HTML", "Sam HTML — wynik działania skryptu, bez kodu PHP", "Pusty plik, bo PHP ukrywa źródło", "Kod PHP zaszyfrowany"],
  "poprawna": 1,
  "wyjasnienie": "PHP wykonuje się na serwerze, zanim odpowiedź zostanie wysłana. Przeglądarka dostaje tylko to, co skrypt wypisał — gotowy HTML."
 },
 {
  "pytanie": "Plik wycena.php otwarty podwójnym kliknięciem pokazuje surowy kod. Dlaczego?",
  "opcje": ["W pliku jest błąd składni", "Przeglądarka czyta plik z dysku (file:///), bez serwera, więc PHP się nie wykonuje", "Brakuje znacznika DOCTYPE", "JavaScript blokuje wykonanie PHP"],
  "poprawna": 1,
  "wyjasnienie": "PHP wykonuje serwer. Plik trzeba otworzyć przez adres http://localhost/… przy uruchomionym Apache."
 },
 {
  "pytanie": "Co wypisze konsola po wykonaniu \"1\" + 1 w JavaScripcie?",
  "opcje": ["2", "\"11\"", "błąd", "NaN"],
  "poprawna": 1,
  "wyjasnienie": "Gdy jedna strona znaku + jest tekstem, JavaScript skleja teksty. Wartość z pola formularza jest zawsze tekstem — dlatego przed dodawaniem zamieniasz ją funkcją Number()."
 },
 {
  "pytanie": "Którym znakiem skleja się teksty w PHP?",
  "opcje": ["+", ". (kropka)", "&", ","],
  "poprawna": 1,
  "wyjasnienie": "W PHP teksty skleja kropka: 'Cześć, ' . $imie. Plus zawsze dodaje liczby."
 },
 {
  "pytanie": "Pole liczby rowerów ma w formularzu atrybuty min=\"1\" max=\"20\". Czy serwer musi mimo to sprawdzić tę wartość?",
  "opcje": ["Nie — przeglądarka nie pozwoli wysłać złej wartości", "Tak — adres z danymi można zmienić ręcznie, a formularz można w ogóle pominąć", "Tylko przy metodzie POST", "Tylko wtedy, gdy JavaScript jest wyłączony"],
  "poprawna": 1,
  "wyjasnienie": "Sprawdzanie w przeglądarce jest dla wygody uczciwego użytkownika. Do serwera może trafić cokolwiek — decyzje, które mają znaczenie, zapadają na serwerze."
 },
 {
  "pytanie": "Który element strony zamawiającej naprawę MUSI być policzony w PHP, a nie tylko w JavaScripcie?",
  "opcje": ["Podgląd kosztu przy zmianie liczby rowerów", "Ostateczna cena zapisywana w zamówieniu", "Podświetlenie wybranej usługi", "Rozwinięcie menu na telefonie"],
  "poprawna": 1,
  "wyjasnienie": "Kod w przeglądarce użytkownik może zmienić. Podgląd w JavaScripcie jest wygodny, ale cenę, która trafia do zamówienia, liczy serwer."
 }
]
</script>
</div>

---

## Karta pracy

Z tego tematu oddajesz **kartę pracy** oraz **spakowany katalog `wycena`**
z uzupełnionymi plikami. Kartę wypełniaj w trakcie ćwiczeń — pyta o to, co
zobaczysz po drodze: kody statusu, komunikaty błędów i adresy.

<div class="kp-podsumowanie" data-karta="wprowadzenie-programowanie"></div>

<span id="karta" class="kp-kotwica"></span>

???+ karta "Rozwiń kartę pracy"

    !!! info "Twoje odpowiedzi zostają na twoim komputerze"

        Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
        przycisku. Wyczyszczenie danych przeglądania usunie odpowiedzi — kiedy
        skończysz, pobierz plik.

    <div class="karta-pracy" data-karta="wprowadzenie-programowanie"></div>

### Jak ją oddać

1. Katalog `C:\xampp\htdocs\wycena` spakuj do `4TI_<numer w dzienniku>_wycena.zip`.
2. Pobierz kartę pracy przyciskiem pod formularzem.
3. Oba pliki dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *Wprowadzenie do programowania — karta pracy*.

---

Następny temat: [Środowisko programistyczne — edytor, kompilator, translator, linker, debugger](srodowisko-programistyczne.md).
Wrócisz w nim do wyceny naprawy — tym razem z debuggerem w ręku.

---

!!! info "Materiały uzupełniające"

    - JavaScript — dokumentacja MDN (po angielsku): [developer.mozilla.org — JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
    - Przegląd HTTP — MDN (po angielsku): [developer.mozilla.org — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
    - Podręcznik PHP (po angielsku): [php.net/manual](https://www.php.net/manual/en/)
    - Pakiet XAMPP: [apachefriends.org](https://www.apachefriends.org/)
    - Udział języków po stronie serwera: [w3techs.com](https://w3techs.com/technologies/overview/programming_language)
