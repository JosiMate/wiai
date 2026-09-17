# Walidacja kodu HTML i CSS oraz testowanie w przeglądarkach

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział II. Tworzenie i publikowanie witryn internetowych
    · efekt kształcenia **INF.03.3.7**

    Strona, którą zbudowałeś na poprzednich zajęciach, wygląda dobrze. To nie
    znaczy, że jest poprawna. Przeglądarka jest wyrozumiała do granic
    przyzwoitości: domyka za ciebie znaczniki, ignoruje literówki w CSS
    i udaje, że wszystko gra. Walidator nie udaje niczego.

    Dziś uczysz się dwóch różnych czynności, których nie wolno mylić:
    **walidacji** — sprawdzenia, czy kod jest zgodny ze standardem, oraz
    **testowania** — sprawdzenia, czy strona faktycznie działa u odbiorcy.

!!! success "Cele lekcji"

    Po tych zajęciach potrafisz:

    1. zwalidować dokument HTML i arkusz CSS na serwisach W3C, trzema sposobami: z adresu, z pliku i przez wklejenie kodu
    2. przeczytać komunikat walidatora — odnaleźć wiersz, zrozumieć treść i poprawić przyczynę, a nie objaw
    3. odróżnić błąd od ostrzeżenia i uzasadnić, które ostrzeżenia zostawiasz bez zmian
    4. wyjaśnić, dlaczego kod poprawny formalnie może być jednocześnie niedostępny, i sprawdzić stronę narzędziem WAVE
    5. przetestować układ na różnych szerokościach ekranu w narzędziach deweloperskich i odczytać błędy z konsoli
    6. sprawdzić w serwisie caniuse.com, czy właściwość CSS zadziała w przeglądarce odbiorcy, i dobrać wartość zapasową
    7. wykonać audyt Lighthouse i wskazać z niego dwie rzeczy warte poprawienia

---

## 1. Dlaczego przeglądarka nie wystarczy

Weź ten fragment:

```html
<p>Przegląd w <b>24 godziny</p></b>
```

Znaczniki są zamknięte w złej kolejności. Otwórz to w przeglądarce — zobaczysz
pogrubiony tekst i nic więcej. Przeglądarka po cichu naprawiła strukturę,
bo taką ma instrukcję: **nigdy nie pokazuj użytkownikowi pustej strony, jeżeli
da się cokolwiek wyświetlić**.

Ta wyrozumiałość ma swoją cenę:

- **każda przeglądarka naprawia po swojemu** — na twoim komputerze wygląda
  dobrze, u klienta rozjeżdża się układ;
- **skrypty gubią się w poprawionej strukturze** — `document.querySelector`
  szuka w drzewie, które przeglądarka dopiero sobie dorobiła;
- **czytnik ekranu i wyszukiwarka pracują na strukturze, nie na wyglądzie**;
- **egzaminator ocenia kod** — poprawny wygląd przy niepoprawnym kodzie to
  utracone punkty.

!!! quote "Zasada, którą warto zapamiętać"

    Przeglądarka pokazuje, **co udało się wyświetlić**.
    Walidator pokazuje, **co napisałeś naprawdę**.

---

## 2. Walidator HTML — validator.w3.org

W3C (World Wide Web Consortium) to organizacja, która ustala standardy sieci.
Pod adresem [validator.w3.org](https://validator.w3.org/) udostępnia
**Nu Html Checker** — narzędzie sprawdzające dokument znak po znaku zgodnie
ze specyfikacją HTML.

### Trzy sposoby podania kodu

| Zakładka | Kiedy jej używasz |
| --- | --- |
| **Validate by URI** | strona jest już opublikowana — podajesz adres |
| **Validate by File Upload** | strona leży na dysku, gotowa do wysłania |
| **Validate by Direct Input** | sprawdzasz fragment albo stronę, której nie chcesz nikomu pokazywać |

Na lekcji najczęściej użyjesz drugiego i trzeciego. Po publikacji — pierwszego,
bo tylko on sprawdza to, co naprawdę dostaje użytkownik.

!!! tip "Validate by Direct Input ma pułapkę"

    Wklejając fragment, wklej **cały dokument** razem z `<!DOCTYPE html>`,
    `<html>`, `<head>` i `<body>`. Sam kawałek `<section>` zgłosi mnóstwo
    błędów, które nie istnieją — bo walidator nie wie, w czym ten fragment stoi.

### Jak czytać komunikat

Każdy komunikat ma trzy części: **miejsce**, **treść** i **wycinek kodu**.

```text
Error: End tag "b" violates nesting rules.
From line 26, column 61; to line 26, column 64
godziny</b></i>.</p>
```

Czytasz to od końca: patrzysz na wycinek, znajdujesz ten wiersz w edytorze,
dopiero potem zastanawiasz się nad treścią komunikatu. Numer wiersza jest
wskazówką, nie wyrokiem — **przyczyna bywa kilka wierszy wyżej**.

!!! warning "Jedna usterka, kilka komunikatów"

    Niezamknięty `<div>` w połowie strony potrafi wygenerować pięć komunikatów
    naraz, bo walidator gubi się w strukturze aż do końca pliku.

    Dlatego poprawia się **od góry, po jednym błędzie, walidując po każdej
    poprawce**. Naprawienie pierwszego często kasuje cztery następne. Kto
    poprawia wszystkie naraz, zwykle psuje coś przy okazji.

---

## 3. Błąd czy ostrzeżenie — i co z tym zrobić

Walidator zwraca komunikaty w dwóch wagach i **nie wolno ich traktować tak
samo**.

| | Błąd (*Error*) | Ostrzeżenie (*Warning*) |
| --- | --- | --- |
| Co znaczy | kod łamie specyfikację | kod jest zgodny, ale coś budzi wątpliwość |
| Kolor na stronie W3C | czerwony | żółty |
| Czy trzeba poprawić | **tak, zawsze** | zależy — i musisz umieć uzasadnić |

### Trzy typowe ostrzeżenia i decyzja przy każdym

**„Consider adding a `lang` attribute to the `html` start tag”** — formalnie
ostrzeżenie, praktycznie poprawiasz zawsze. Bez `lang="pl"` czytnik ekranu
przeczyta polski tekst z angielską wymową, a to bariera nie do przejścia dla
użytkownika niewidomego. Na egzaminie zawodowym to również punkt.

**„The `border` attribute on the `table` element is obsolete”** — strona
przejdzie walidację z tym atrybutem. Usuwasz go i tak, bo wygląd należy do CSS,
a nie do znaczników. Koszt poprawki: jedna linijka w arkuszu.

**„Section lacks heading”** — walidator zauważył `<section>` bez nagłówka.
Masz dwa poprawne wyjścia: dodać nagłówek albo zamienić `<section>` na `<div>`.
`section` znaczy „samodzielna część treści”; jeżeli fragment nie jest
samodzielny, `div` jest właściwszy. **Obie odpowiedzi są dobre — pod warunkiem
że potrafisz powiedzieć, którą wybrałeś i dlaczego.**

!!! danger "Czego nie robić z ostrzeżeniami"

    Nie usuwaj kodu tylko po to, żeby zgasić żółty pasek. Widziane na pracach:
    uczeń kasuje cały `<section>`, bo „walidator się czepiał” — i razem z nim
    kasuje treść, która miała być na stronie. Ostrzeżenie to pytanie, nie rozkaz.

---

## 4. Walidator CSS — jigsaw.w3.org

Arkusz stylów sprawdza osobne narzędzie:
[jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/). Działa tak
samo — adres, plik albo wklejony kod — i tak samo dzieli komunikaty na błędy
i ostrzeżenia.

Typowe błędy, których nie zobaczysz w przeglądarce, bo ona po prostu **pomija
niezrozumiałą deklarację i idzie dalej**:

| Zapis | Co jest nie tak |
| --- | --- |
| `colour: #222;` | literówka w nazwie właściwości — CSS zna tylko `color` |
| `font-size: 16;` | liczba bez jednostki; poprawnie `16px` albo `1rem` |
| `text-align: centre;` | pisownia brytyjska; CSS zna tylko `center` |
| `color: #fffff;` | pięć znaków — a musi być trzy albo sześć |
| `margin: 10 px;` | spacja rozbiła liczbę i jednostkę na dwie wartości |

!!! warning "Najbardziej podstępny błąd CSS: brak średnika"

    ```css
    .logo {
      font-size: 24px
      font-weight: 700;
    }
    ```

    Brakuje średnika po `24px`. Przeglądarka skleja obie linijki w jedną
    wartość, nie rozumie jej — i **wyrzuca obie deklaracje**. Nagłówek nie jest
    ani większy, ani pogrubiony, a w kodzie wygląda wszystko normalnie.

    To jest dokładnie ten rodzaj usterki, którą znajduje wyłącznie walidator
    albo bardzo cierpliwe oko.

---

## 5. Poprawny to jeszcze nie znaczy dostępny

:material-plus-circle: **rozszerzenie**

Strona może przejść walidację W3C z wynikiem zerowym i nadal być nie do użycia
dla części odbiorców. Walidator sprawdza **składnię**, nie **sens**.

```html
<img src="wykres.png" alt="obrazek">
<a href="#">Kliknij tutaj</a>
<p>Imię: <input type="text" name="imie"></p>
```

Zero błędów. A jednocześnie: opis alternatywny nic nie mówi, odnośnik nic nie
mówi wyrwany z kontekstu, a pole formularza nie ma etykiety `<label>`, więc
czytnik ekranu nie powie, co w nim wpisać.

### WAVE — walidator dostępności

[wave.webaim.org](https://wave.webaim.org/) sprawdza stronę pod kątem wytycznych
**WCAG**. Wynik pokazuje kolorowymi znacznikami nałożonymi na stronę:

- **czerwone** — błędy dostępności (brak etykiety, brak `alt`, zbyt niski kontrast),
- **żółte** — ostrzeżenia (podejrzany tekst odnośnika, pominięty poziom nagłówka),
- **zielone** — elementy poprawne, na przykład opisy alternatywne, które są na miejscu.

To samo robi rozszerzenie **axe DevTools**, wbudowane w narzędzia deweloperskie.

### Kontrast

Najczęstszy błąd dostępności w pracach uczniowskich to za jasny tekst na jasnym
tle. Wymagany stosunek kontrastu to **4,5 : 1** dla zwykłego tekstu i **3 : 1**
dla dużego. Sprawdzasz go w
[webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/)
albo wprost w narzędziach deweloperskich — po kliknięciu próbki koloru
przeglądarka sama pokazuje wynik.

!!! info "Dla stron urzędów to nie jest dobra wola"

    Ustawa o dostępności cyfrowej nakłada wymagania WCAG na podmioty publiczne.
    Strona szkoły, urzędu gminy czy przychodni musi je spełniać, a brak
    dostępności bywa przedmiotem skargi. Dla ciebie to przede wszystkim
    umiejętność, o którą zapyta pracodawca.

---

## 6. Testowanie w przeglądarce — narzędzia deweloperskie

Walidacja skończyła się na pliku. Testowanie zaczyna się w przeglądarce.
Otwierasz je klawiszem ++f12++ (albo ++ctrl+shift+i++).

| Zakładka | Do czego służy |
| --- | --- |
| **Elements / Inspektor** | podgląd drzewa dokumentu **po naprawach przeglądarki** — tu widać, co naprawdę powstało |
| **Styles** | która reguła CSS zadziałała, a która została przekreślona i przez co |
| **Console** | błędy skryptów i ostrzeżenia przeglądarki |
| **Network / Sieć** | co się pobrało, ile waży, co zwróciło błąd 404 |
| **Lighthouse** | audyt wydajności, dostępności i SEO |

!!! tip "Przekreślona reguła w zakładce Styles"

    Kiedy deklaracja jest przekreślona, przeglądarka mówi ci: *znam ją, ale coś
    ją nadpisało albo jest błędna*. Najechanie kursorem pokazuje przyczynę.
    To najszybszy sposób na pytanie „dlaczego ten kolor się nie zmienia”.

### Tryb responsywny

Ikona urządzenia w narzędziach deweloperskich (++ctrl+shift+m++) przełącza
stronę w symulację ekranu telefonu i tabletu. Możesz wpisać dowolną szerokość
albo wybrać gotowy model.

Trzy szerokości, które trzeba sprawdzić zawsze:

- **360 px** — typowy telefon,
- **768 px** — tablet i granica większości zapytań medialnych,
- **1280 px** — laptop.

!!! warning "Tryb responsywny to symulacja, nie telefon"

    Przeglądarka udaje rozmiar ekranu, ale nadal jest tą samą przeglądarką na
    tym samym systemie. Nie sprawdzisz w ten sposób dotyku, wydajności ani
    zachowania klawiatury ekranowej. **Przed oddaniem pracy klientowi otwiera
    się stronę na prawdziwym telefonie.**

Częsta przyczyna „na telefonie wygląda jak na komputerze, tylko mniejsze”:
brak jednego znacznika w `<head>`.

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

---

## 7. Dlaczego ta sama strona wygląda inaczej

:material-plus-circle: **rozszerzenie**

Przeglądarek jest wiele, ale **silników renderujących** — czyli tego, co
faktycznie zamienia kod na obraz — zaledwie kilka.

| Silnik | Przeglądarki |
| --- | --- |
| **Blink** | Chrome, Edge, Opera, Brave, Vivaldi |
| **Gecko** | Firefox |
| **WebKit** | Safari na macOS, **oraz każda przeglądarka na iPhonie** |

Ostatni wiersz jest ważny: na iPhonie Chrome też jest WebKitem, bo Apple nie
dopuszcza innych silników. Testowanie „w Chromie na telefonie z Androidem” nic
nie mówi o tym, jak strona wygląda u użytkownika iPhone'a.

### caniuse.com

Zanim użyjesz właściwości CSS, której nie znasz z pamięci, sprawdzasz ją
w [caniuse.com](https://caniuse.com/). Wpisujesz nazwę i dostajesz tabelę
wsparcia w przeglądarkach z podziałem na wersje.

Kiedy wsparcie jest niepełne, masz dwa wyjścia:

**Wartość zapasowa.** Piszesz najpierw wersję działającą wszędzie, a pod nią
nowszą. Przeglądarka, która nowszej nie rozumie, pominie ją i zostanie przy
poprzedniej.

```css
.karta {
  background-color: #14213d;          /* zadziała wszędzie */
  background-color: color-mix(in srgb, #14213d 80%, white);
}
```

**Zapytanie o możliwości.** Reguła `@supports` włącza kod tylko tam, gdzie
przeglądarka daną właściwość zna.

```css
@supports (display: grid) {
  .galeria { display: grid; grid-template-columns: repeat(3, 1fr); }
}
```

---

## 8. Lighthouse — audyt jednym kliknięciem

:material-plus-circle: **rozszerzenie**

W narzędziach deweloperskich Chrome i Edge jest zakładka **Lighthouse**.
Uruchamiasz audyt i po kilkunastu sekundach dostajesz cztery oceny
w skali 0–100: **wydajność**, **dostępność**, **dobre praktyki** i **SEO**.

Nie chodzi o to, żeby gonić za setką. Chodzi o listę pod ocenami — każdy punkt
opisuje konkretną rzecz do poprawienia i szacuje, ile na tym zyskasz.

Trzy rzeczy, które Lighthouse wytyka uczniom najczęściej:

- **obrazy bez podanych wymiarów** — strona „skacze” podczas ładowania, bo
  przeglądarka nie wie, ile miejsca zarezerwować;
- **obrazy w za dużej rozdzielczości** — zdjęcie 4000 px szerokości wyświetlane
  w ramce 800 px to kilka megabajtów wyrzuconych w błoto;
- **brak opisu strony w `<meta name="description">`** — wyszukiwarka nie ma co
  pokazać pod tytułem.

!!! note "Wydajność zmierzona lokalnie bywa zawyżona"

    Plik otwarty z dysku ładuje się natychmiast. Prawdziwy wynik zobaczysz
    dopiero po publikacji na serwerze — o tym jest następny temat.

---

## 9. Lista kontrolna przed oddaniem pracy

Ta sama lista obowiązuje na egzaminie zawodowym i u klienta.

1. Każda podstrona zwalidowana na `validator.w3.org` — **zero błędów**.
2. Ostrzeżenia przejrzane; przy każdym pozostawionym potrafisz powiedzieć dlaczego.
3. Arkusz stylów zwalidowany na `jigsaw.w3.org/css-validator`.
4. `<html lang="pl">`, `<meta charset="utf-8">` i `<meta name="viewport">` na miejscu.
5. Każdy obraz ma sensowny `alt`, każde pole formularza ma `<label>`.
6. Układ sprawdzony przy 360, 768 i 1280 px.
7. Konsola przeglądarki pusta — żadnego czerwonego komunikatu.
8. Wszystkie odnośniki i obrazy działają (zakładka **Sieć**, żadnych 404).
9. Kontrast tekstu do tła co najmniej 4,5 : 1.
10. Strona otwarta w drugiej przeglądarce, na innym silniku niż twoja domyślna.

---

## Ćwiczenia

Pobierz paczkę. Są w niej trzy podstrony i arkusz stylów. **Dwie strony mają
błędy, jedna jest już poprawna** — pierwsze zadanie polega na ustaleniu, która.

[:material-folder-zip: Szprycha — wersja do naprawy (.zip)](../pliki/walidacja-start.zip){ .md-button .md-button--primary download="walidacja-start.zip" }

### :material-console: Ćwiczenie 1 — inwentaryzacja usterek

Zwaliduj wszystkie trzy pliki `.html` na `validator.w3.org` (zakładka
**Validate by File Upload**) **zanim cokolwiek poprawisz**. Dla każdego pliku
zapisz liczbę błędów i liczbę ostrzeżeń oraz wskaż stronę bez usterek.

Ta lista jest dowodem twojej pracy — sam poprawiony plik nie pokazuje, co
umiałeś znaleźć.

### :material-console: Ćwiczenie 2 — naprawa po jednym błędzie

Popraw `index.html` i `kontakt.html`. Pracuj od góry, **po jednym błędzie,
walidując po każdej poprawce**. Zanotuj przypadek, w którym jedna poprawka
wygasiła więcej niż jeden komunikat — w tej paczce takie są.

Nie usuwaj treści, żeby pozbyć się komunikatu. Poprawka ma zachować to, co na
stronie miało być widoczne.

### :material-console: Ćwiczenie 3 — ostrzeżenia i decyzje

W `index.html` zostają ostrzeżenia. Przy każdym zdecyduj: poprawiam czy
zostawiam — i zapisz uzasadnienie w jednym zdaniu. Odpowiedź „bo walidator tak
kazał” nie jest uzasadnieniem.

### :material-console: Ćwiczenie 4 — arkusz stylów

Zwaliduj `css/style.css` na `jigsaw.w3.org/css-validator`. Popraw wszystkie
błędy, a potem porównaj stronę w przeglądarce przed poprawką i po. **Cztery
z tych usterek zmieniają wygląd strony** — znajdź je i opisz, co się zmieniło.
Najłatwiej zacząć od nawigacji: odnośniki w granatowym pasku mają dziwny kolor,
choć w arkuszu stoi deklaracja, która miała je zrobić białymi.

### :material-console: Ćwiczenie 5 — dostępność

Poprawioną stronę przepuść przez **WAVE** (albo axe DevTools). Wypisz błędy
dostępności, których walidator W3C **nie zgłosił**, i napraw co najmniej dwa.

Sprawdź też dwie pary kolorów z tej strony: żółty `#fca311` na granatowym
`#14213d` oraz szary `#a8b0bd` na tle `#f6f7f9`. **Jedna para przechodzi,
druga nie** — podaj oba wyniki i napisz, którą trzeba poprawić.

### :material-console: Ćwiczenie 6 — testowanie

Otwórz poprawioną stronę i w narzędziach deweloperskich sprawdź:

1. wygląd przy szerokości 360, 768 i 1280 px — zanotuj, co się psuje;
2. konsolę — czy są czerwone komunikaty;
3. zakładkę **Sieć** — czy wszystko się pobrało;
4. audyt **Lighthouse** — zapisz cztery oceny i dwie rzeczy z listy zaleceń.

Na koniec otwórz tę samą stronę w drugiej przeglądarce na innym silniku
(Firefox obok Chrome albo Edge) i porównaj.

### :material-console: Ćwiczenie 7 — twoja własna witryna

Weź witrynę „Szprycha”, którą zbudowałeś na poprzednich zajęciach, i przejdź
przez **całą listę kontrolną z sekcji 9**. To jest ta część, która realnie
podnosi ocenę za tamtą pracę.

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła.**

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Strona z niezamkniętym znacznikiem <div> wygląda w przeglądarce poprawnie. Dlaczego?",
  "opcje": ["Bo brak zamknięcia div nie jest błędem w HTML5", "Bo przeglądarka domyka znaczniki sama, żeby cokolwiek wyświetlić", "Bo arkusz CSS naprawia strukturę dokumentu", "Bo błąd ujawnia się dopiero po publikacji na serwerze"],
  "poprawna": 1,
  "wyjasnienie": "Przeglądarka ma wyświetlić stronę mimo błędów i naprawia strukturę po swojemu. Problem w tym, że każda robi to trochę inaczej — a skrypty i czytniki ekranu pracują na tym, co z tego wyszło."
 },
 {
  "pytanie": "Walidator zgłosił pięć błędów, wszystkie w drugiej połowie pliku. Jak zabierasz się do poprawiania?",
  "opcje": ["Poprawiam wszystkie naraz i waliduję raz na koniec", "Poprawiam pierwszy od góry i waliduję ponownie", "Zaczynam od ostatniego, bo tam jest przyczyna", "Usuwam fragment kodu, którego dotyczą komunikaty"],
  "poprawna": 1,
  "wyjasnienie": "Jedna usterka potrafi wygenerować kilka komunikatów, bo walidator gubi się w strukturze aż do końca pliku. Poprawka pierwszego błędu często kasuje kolejne."
 },
 {
  "pytanie": "Czym różni się Error od Warning w wyniku walidacji?",
  "opcje": ["Error dotyczy HTML, Warning dotyczy CSS", "Error trzeba poprawić zawsze, Warning to sygnał do decyzji, którą musisz umieć uzasadnić", "Warning pojawia się tylko przy walidacji z adresu URL", "Nie ma różnicy, oba trzeba usunąć do zera"],
  "poprawna": 1,
  "wyjasnienie": "Błąd oznacza kod niezgodny ze specyfikacją. Ostrzeżenie to kod poprawny, który budzi wątpliwość — zostawiasz albo poprawiasz, ale decyzję musisz umieć obronić."
 },
 {
  "pytanie": "Co zrobi przeglądarka z arkuszem, w którym po deklaracji font-size: 24px zabrakło średnika, a w następnej linijce stoi font-weight: 700;?",
  "opcje": ["Zastosuje obie deklaracje, średnik jest opcjonalny", "Odrzuci obie deklaracje, bo skleiła je w jedną niezrozumiałą wartość", "Zastosuje font-size, a font-weight pominie", "Zgłosi błąd w konsoli i przerwie wczytywanie arkusza"],
  "poprawna": 1,
  "wyjasnienie": "Brak średnika skleja obie linijki w jedną wartość, której CSS nie rozumie — i odrzuca całość po cichu. Nagłówek nie jest ani większy, ani pogrubiony, a kod wygląda normalnie."
 },
 {
  "pytanie": "Strona ma zero błędów w walidatorze W3C. Czy to znaczy, że jest dostępna dla osoby niewidomej?",
  "opcje": ["Tak, walidacja obejmuje wytyczne WCAG", "Nie — walidator sprawdza składnię, a nie sens opisów alternatywnych i etykiet", "Tak, jeśli strona ma atrybut lang", "Nie, bo walidator W3C w ogóle nie sprawdza obrazów"],
  "poprawna": 1,
  "wyjasnienie": "alt=\"obrazek\" i odnośnik „Kliknij tutaj” przechodzą walidację bez zastrzeżeń i nie znaczą nic dla użytkownika czytnika ekranu. Dostępność sprawdza się osobno, na przykład narzędziem WAVE."
 },
 {
  "pytanie": "Użytkownik zgłasza, że na iPhonie strona wygląda inaczej niż na jego Androidzie, choć w obu ma Chrome. Skąd ta różnica?",
  "opcje": ["Na iPhonie Chrome działa na silniku WebKit, bo Apple nie dopuszcza innych", "Na iPhonie nie działa CSS Grid", "Chrome na iOS pobiera inną wersję strony z serwera", "Różnica wynika wyłącznie z rozdzielczości ekranu"],
  "poprawna": 0,
  "wyjasnienie": "Na iOS każda przeglądarka jest nakładką na WebKit. Dlatego test „w Chromie na Androidzie” nic nie mówi o wyglądzie u użytkownika iPhone'a."
 },
 {
  "pytanie": "Jak nazywa się serwis, w którym sprawdzasz, w których przeglądarkach i od której wersji działa dana właściwość CSS?",
  "odpowiedz": ["caniuse", "caniuse.com", "can i use"],
  "wyjasnienie": "caniuse.com pokazuje tabelę wsparcia z podziałem na wersje przeglądarek. Sprawdzasz tam właściwość, zanim jej użyjesz — a nie po tym, jak klient zgłosi, że coś nie działa."
 },
 {
  "pytanie": "Strona na telefonie wygląda jak wersja na komputer, tylko pomniejszona. Czego najprawdopodobniej brakuje?",
  "opcje": ["Zapytania medialnego @media w arkuszu stylów", "Znacznika <meta name=\"viewport\"> w sekcji head", "Atrybutu lang w znaczniku html", "Deklaracji <!DOCTYPE html>"],
  "poprawna": 1,
  "wyjasnienie": "Bez znacznika viewport telefon renderuje stronę na wirtualnej szerokości około 980 px i pomniejsza całość. Zapytania medialne wtedy nie zadziałają, choćby były napisane poprawnie."
 }
]
</script>
</div>

---

## Praca do oddania

Z tego tematu oddajesz **kartę pracy** oraz **spakowaną, poprawioną witrynę**.
Kartę wypełniaj w trakcie ćwiczeń — pyta o liczby i komunikaty, których po
poprawieniu plików już nie odtworzysz.

!!! info "Twoje odpowiedzi zostają na twoim komputerze"

    Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
    przycisku. Wyczyszczenie danych przeglądania usunie odpowiedzi — kiedy
    skończysz, pobierz plik.

<div class="karta-pracy" data-karta="walidacja-testowanie"></div>

### Jak ją oddać

1. Poprawiony katalog witryny spakuj do `4TI_<numer w dzienniku>_walidacja.zip`.
2. Pobierz kartę pracy przyciskiem pod formularzem.
3. Oba pliki dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *Walidacja i testowanie — karta pracy*.

---

!!! info "Materiały uzupełniające"

    - Walidator HTML: [validator.w3.org](https://validator.w3.org/)
    - Walidator CSS: [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/)
    - Walidator dostępności: [wave.webaim.org](https://wave.webaim.org/)
    - Sprawdzanie kontrastu: [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/)
    - Wsparcie właściwości w przeglądarkach: [caniuse.com](https://caniuse.com/)
    - Wytyczne dostępności po polsku: [wcag.pl](https://wcag.pl/)
