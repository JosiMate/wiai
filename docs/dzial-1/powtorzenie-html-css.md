# Powtórzenie: HTML i CSS

!!! abstract "O tym temacie"

    **2 godziny lekcyjne** · Dział I. Organizacja pracy i powtórzenie
    · efekty kształcenia **INF.03.3.1**, **INF.03.3.2**

    To nie jest powtórka dla samej powtórki. Przez cały ten rok będziesz pisał
    skrypty, które modyfikują stronę, odbierają dane z formularzy i zmieniają
    wygląd elementów. Jeśli struktura dokumentu i selektory nie są dla ciebie
    oczywiste, JavaScript i PHP będą wyglądały na trudniejsze, niż są naprawdę
    — bo zabraknie ci nie programowania, tylko fundamentu pod nim.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. zbudować poprawny dokument HTML5 i wskazać w nim elementy struktury: nagłówek, nawigację, sekcje główną i stopkę
    2. dobrać znacznik do rodzaju treści — nagłówki, listy, tabelę, obraz z tekstem alternatywnym, odnośnik
    3. zbudować formularz z polami różnych typów i wyjaśnić, do czego służą atrybuty `name`, `id` i `for`
    4. napisać selektory CSS: elementu, klasy, identyfikatora, potomka i pseudoklasy, i przewidzieć, który z nich zadziała silniej
    5. wyjaśnić model pudełkowy i policzyć rzeczywistą szerokość elementu przy obu wartościach `box-sizing`
    6. zbudować układ strony z użyciem flexboxa i siatki CSS oraz dobrać jedno do drugiego według rodzaju układu
    7. przygotować stronę responsywną: zapytania medialne, jednostki względne, obrazy skalowalne
    8. sprawdzić kod walidatorem W3C i poprawić zgłoszone błędy

## Jak wykorzystać tę lekcję

Zacznij od **[testu na końcu strony](#sprawdz-sie)**. Zajmie kilka minut i pokaże,
które sekcje musisz przeczytać, a które możesz przejrzeć pobieżnie. Dopiero potem
wracaj do teorii — powtarzanie wszystkiego po kolei jest stratą czasu, jeśli
połowę pamiętasz dobrze.

---

## 1. Struktura dokumentu

Każda strona zaczyna się tak samo i każdy z tych elementów coś robi:

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tytuł widoczny w karcie przeglądarki</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- treść -->
</body>
</html>
```

Trzy z tych linijek uczniowie najczęściej traktują jak ozdobnik, a każda ma
konsekwencje:

**`lang="pl"`** mówi przeglądarce i czytnikom ekranu, w jakim języku jest treść.
Bez niego syntezator mowy przeczyta polski tekst z angielską wymową.

**`charset="utf-8"`** decyduje o polskich znakach. Brak tej linijki to klasyczne
„krzaczki" zamiast ą, ę i ł.

**`viewport`** mówi telefonowi, żeby nie udawał ekranu o szerokości 980 pikseli.
Bez niego responsywny układ CSS nie zadziała, choćbyś napisał go bezbłędnie.

### Znaczniki sekcji

```html
<body>
  <header>  <!-- nagłówek strony: logo, tytuł -->
    <nav>   <!-- menu nawigacyjne -->
  </header>
  <main>    <!-- główna treść — tylko jeden na stronie -->
    <article>  <!-- samodzielna całość, np. wpis, artykuł -->
    <section>  <!-- wydzielona część treści -->
    <aside>    <!-- treść poboczna -->
  </main>
  <footer>  <!-- stopka -->
</body>
```

!!! tip "Kiedy `div`, a kiedy znacznik semantyczny"

    Zasada jest prosta: jeśli istnieje znacznik opisujący **rolę** fragmentu,
    użyj go. `div` zostaje do sytuacji, w której grupujesz elementy wyłącznie
    po to, żeby coś im ostylować. Ma to znaczenie praktyczne — czytniki ekranu
    budują z tych znaczników mapę strony, a na egzaminie zawodowym semantyka
    bywa punktowana osobno.

---

## 2. Treść: nagłówki, listy, tabele, obrazy, odnośniki

**Nagłówki** dobiera się według hierarchii treści, nie według wielkości liter.
`h1` to temat całej strony, `h2` to jej główne części, `h3` to podpunkty w tych
częściach. Nie przeskakuj poziomów. Jeśli `h2` wydaje ci się za duży — zmień to
w CSS, a nie przez użycie `h3`.

**Listy** — `ul` nieuporządkowana, `ol` uporządkowana, `dl` definicyjna
(pary termin–opis).

**Tabela** ma więcej części niż `tr` i `td`:

```html
<table>
  <caption>Wyniki sprawdzianu</caption>
  <thead>
    <tr><th scope="col">Uczeń</th><th scope="col">Punkty</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Kowalski</th><td>18</td></tr>
  </tbody>
</table>
```

`scope` mówi, czy komórka nagłówkowa opisuje kolumnę, czy wiersz — bez tego
czytnik ekranu nie powiąże danych z nagłówkami.

**Obrazy** wymagają atrybutu `alt`. Ma opisywać *treść* obrazu, nie jego wygląd.
Jeśli obraz jest czysto dekoracyjny, zostaw `alt=""` — pusty, ale obecny. Wtedy
czytnik go pominie zamiast czytać nazwę pliku.

**Odnośniki** otwierane w nowej karcie:

```html
<a href="https://przyklad.pl" target="_blank" rel="noopener">Otwórz</a>
```

`rel="noopener"` odcina otwartej stronie dostęp do okna, z którego przyszła.
Bez tego strona docelowa może podmienić adres w twojej karcie.

---

## 3. Formularze

To najważniejsza część powtórki, bo od niej zaczniemy programowanie — skrypty
JavaScript będą walidowały formularze, a PHP odbierało z nich dane.

```html
<form action="zapisz.php" method="post">
  <label for="imie">Imię</label>
  <input type="text" id="imie" name="imie" required>

  <label for="mail">E-mail</label>
  <input type="email" id="mail" name="mail" required>

  <label for="wiek">Wiek</label>
  <input type="number" id="wiek" name="wiek" min="1" max="120">

  <button type="submit">Wyślij</button>
</form>
```

Trzy rzeczy, na których najłatwiej się potknąć:

**`label` z atrybutem `for`** wskazuje na `id` pola. To nie jest kosmetyka:
kliknięcie etykiety ustawia kursor w polu, a czytnik ekranu wie, jak nazywa się
pole. Bez powiązania formularz jest niedostępny dla części użytkowników.

**`name`, nie `id`, trafia na serwer.** W PHP odczytasz `$_POST['imie']` —
wartość atrybutu `name`. `id` służy do powiązania z etykietą i do CSS oraz
JavaScriptu. Pole bez `name` po prostu nie zostanie wysłane.

**`method="get"` czy `"post"`** — GET dokleja dane do adresu (widoczne, można
zakładkować, ograniczona długość), POST wysyła je w treści żądania. Hasła
i dłuższe formularze zawsze POST-em.

---

## 4. CSS: gdzie i jak

Trzy sposoby dołączenia stylów, w kolejności od najgorszego do najlepszego:

| Sposób | Zapis | Kiedy |
| --- | --- | --- |
| lokalny | `<p style="color:red">` | praktycznie nigdy — trudno nadpisać, nie da się użyć ponownie |
| wewnętrzny | `<style>` w `head` | pojedyncza strona, szybki prototyp |
| zewnętrzny | `<link rel="stylesheet">` | zawsze, gdy stron jest więcej niż jedna |

### Specyficzność — dlaczego „mój styl się nie stosuje"

Gdy dwie reguły dotyczą tego samego elementu, wygrywa ta o wyższej
specyficzności. Liczy się ją jako cztery liczby:

| Co | Waga | Przykład |
| --- | :---: | --- |
| styl lokalny (`style="…"`) | 1,0,0,0 | `<p style="color:red">` |
| identyfikator | 0,1,0,0 | `#menu` |
| klasa, atrybut, pseudoklasa | 0,0,1,0 | `.karta`, `[type=text]`, `:hover` |
| znacznik, pseudoelement | 0,0,0,1 | `p`, `::before` |

Porównuje się od lewej. `#menu a` (0,1,0,1) wygra z `nav ul li a.link`
(0,0,1,3), mimo że drugi selektor jest dłuższy. Przy równej specyficzności
wygrywa reguła zapisana później.

!!! warning "`!important` to nie rozwiązanie"

    Dopisanie `!important` przebija całą tę hierarchię — i dlatego jest pułapką.
    Raz użyte, wymusza kolejne `!important` przy każdej próbie nadpisania.
    Jeśli sięgasz po nie regularnie, problem leży w strukturze arkusza, nie
    w konkretnej regule.

---

## 5. Model pudełkowy

:material-plus-circle: **rozszerzenie**

Każdy element to prostokąt złożony z czterech warstw: **treść**, **wypełnienie**
(`padding`), **obramowanie** (`border`) i **margines** (`margin`).

Pytanie, na którym wykłada się większość: element ma `width: 300px`,
`padding: 20px` i `border: 5px`. Jaką szerokość zajmie na stronie?

=== "Domyślnie (`content-box`)"

    ```
    300 + 20 + 20 + 5 + 5 = 350 px
    ```

    `width` opisuje **samą treść**, a padding i border dochodzą do niej.

=== "Z `box-sizing: border-box`"

    ```
    300 px
    ```

    `width` obejmuje treść razem z wypełnieniem i obramowaniem. Treść skurczy
    się do 250 px.

Dlatego niemal każdy arkusz stylów zaczyna się od:

```css
*, *::before, *::after { box-sizing: border-box; }
```

!!! note "Sklejanie marginesów"

    Sąsiadujące marginesy pionowe nie sumują się — zostaje większy z nich.
    Akapit z `margin-bottom: 30px` nad akapitem z `margin-top: 20px` da odstęp
    **30 px**, nie 50. Marginesy poziome nigdy się nie sklejają.

---

## 6. Układ strony

:material-plus-circle: **rozszerzenie**

Dwa narzędzia, jedno rozróżnienie:

**Flexbox** układa elementy **w jednej osi** — poziomo albo pionowo. Pasek
nawigacji, rząd przycisków, wyśrodkowanie zawartości.

```css
.menu { display: flex; gap: 1rem; justify-content: space-between; align-items: center; }
```

**Grid** układa elementy **w dwóch osiach naraz** — wiersze i kolumny. Układ
całej strony, galeria, tabela kart.

```css
.galeria { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
```

Pytanie kontrolne przy wyborze: *czy rozmieszczam elementy wzdłuż jednej linii,
czy w siatce?* Jedna linia to flex, siatka to grid. Można je łączyć — grid na
układ strony, flex wewnątrz poszczególnych sekcji.

---

## 7. Responsywność

:material-plus-circle: **rozszerzenie**

Zapytania medialne pozwalają zmienić style zależnie od szerokości okna:

```css
/* najpierw style dla telefonu — podejście mobile-first */
.galeria { grid-template-columns: 1fr; }

/* od 48rem w górę: trzy kolumny */
@media (min-width: 48rem) {
  .galeria { grid-template-columns: repeat(3, 1fr); }
}
```

**Mobile-first** znaczy: domyślne style opisują najmniejszy ekran, a zapytania
medialne **dodają** rzeczy na większych. Odwrotna kolejność też działa, ale
prowadzi do dłuższych arkuszy pełnych nadpisań.

Używaj jednostek względnych — `rem`, `%`, `fr`, `vw` — zamiast pikseli wszędzie
tam, gdzie rozmiar ma się skalować. `rem` odnosi się do rozmiaru czcionki
dokumentu, więc szanuje ustawienia użytkownika, który powiększył tekst
w przeglądarce.

---

## 8. Walidacja i dostępność

:material-star: **dopełnienie**

**Walidator W3C** (`validator.w3.org`) sprawdza zgodność kodu ze standardem.
Nie sprawdza, czy strona ładnie wygląda — sprawdza, czy jest poprawnie zbudowana.
Typowe błędy, które wychwytuje: niedomknięty znacznik, powtórzony `id`, brak
`alt`, zagnieżdżenie blokowego elementu w liniowym.

**Dostępność (WCAG)** to nie osobny projekt, tylko kilka nawyków:

- kontrast tekstu wobec tła co najmniej 4,5 : 1
- każdy obraz z sensownym `alt`
- każde pole formularza z powiązaną etykietą
- kolejność nagłówków bez przeskoków
- strona obsługiwalna z klawiatury — sprawdź, przechodząc przez nią tabulatorem

To także wymóg prawny dla stron podmiotów publicznych, więc jako technik
informatyk będziesz się z nim stykał zawodowo.

---

## 9. Co doszło w CSS od czasu, gdy się go uczyłeś

:material-star: **dopełnienie**

Dwie rzeczy, które jeszcze niedawno były eksperymentem, a dziś działają
we wszystkich głównych przeglądarkach:

**Selektor `:has()`** pozwala wybrać element na podstawie tego, co zawiera —
czego CSS nie potrafił przez dwadzieścia lat:

```css
/* karta, która zawiera obrazek, dostaje inny układ */
.karta:has(img) { display: grid; grid-template-columns: auto 1fr; }
```

**Zapytania kontenerowe** reagują na szerokość rodzica, a nie całego okna —
dzięki temu ten sam komponent może wyglądać inaczej w wąskiej kolumnie
i w szerokiej sekcji:

```css
.panel { container-type: inline-size; }

@container (min-width: 30rem) {
  .karta { display: flex; }
}
```

Nie musisz ich używać na zaliczenie. Warto wiedzieć, że istnieją, bo rozwiązują
problemy, które wcześniej wymagały JavaScriptu.

---

## Ćwiczenia

### :material-console: Ćwiczenie 1 — odtwórz strukturę

Zbuduj szkielet strony wizytówkowej zawierający: nagłówek z tytułem i menu
z trzema pozycjami, główną treść z dwiema sekcjami, treść poboczną i stopkę.
Użyj wyłącznie znaczników semantycznych — ani jednego `div`. Sprawdź wynik
w walidatorze W3C.

### :material-console: Ćwiczenie 2 — znajdź błędy

Poniższy fragment zawiera **pięć** błędów. Wypisz je i podaj poprawną wersję.

```html
<div class="naglowek">
  <h3>Moja strona</h3>
  <h1>O mnie</h1>
</div>
<img src="foto.jpg">
<form>
  <input type="text" id="imie">
  <label>Imię</label>
  <input type="submit" value="Wyślij">
</form>
```

??? tip "Podpowiedź, jeśli utknąłeś"

    Przyjrzyj się: kolejności nagłówków, brakującemu atrybutowi przy obrazie,
    powiązaniu etykiety z polem, brakującemu atrybutowi decydującemu o tym,
    co trafi na serwer, oraz temu, czy `div` jest tu potrzebny.

### :material-console: Ćwiczenie 3 — układ responsywny

Zbuduj galerię czterech kart. Na telefonie jedna kolumna, od 48 rem trzy
kolumny. Użyj gridu, `gap` i jednostek względnych. Sprawdź działanie,
zwężając okno przeglądarki.

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła** —
liczy się w twojej przeglądarce i ma jedno zadanie: pokazać ci, które sekcje
przeczytać uważniej.

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Bez którego znacznika w sekcji head responsywny układ CSS nie zadziała na telefonie?",
  "opcje": ["<meta charset=\"utf-8\">", "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", "<link rel=\"stylesheet\">", "<title>"],
  "poprawna": 1,
  "wyjasnienie": "Bez meta viewport telefon udaje ekran o szerokości około 980 px i po prostu pomniejsza całą stronę — zapytania medialne nigdy się nie uruchamiają."
 },
 {
  "pytanie": "Który selektor ma wyższą specyficzność: #menu a czy nav ul li a.link?",
  "opcje": ["nav ul li a.link — bo jest dłuższy", "#menu a — bo zawiera identyfikator", "Oba mają taką samą", "Wygrywa ten zapisany później"],
  "poprawna": 1,
  "wyjasnienie": "Specyficzność porównuje się od lewej: identyfikator (0,1,0,1) bije dowolną liczbę klas i znaczników (0,0,1,3). Długość selektora nie ma znaczenia."
 },
 {
  "pytanie": "Element ma width: 300px, padding: 20px i border: 5px. Ile zajmie w poziomie przy domyślnym box-sizing?",
  "opcje": ["300 px", "325 px", "350 px", "390 px"],
  "poprawna": 2,
  "wyjasnienie": "Przy content-box width opisuje samą treść: 300 + 2×20 + 2×5 = 350 px. Z box-sizing: border-box element zajmie dokładnie 300 px."
 },
 {
  "pytanie": "Akapit ma margin-bottom: 30px, następny po nim margin-top: 20px. Jaki będzie odstęp między nimi?",
  "opcje": ["50 px", "30 px", "20 px", "25 px"],
  "poprawna": 1,
  "wyjasnienie": "Sąsiadujące marginesy pionowe sklejają się — zostaje większy z nich, czyli 30 px. Marginesy poziome nigdy się nie sklejają."
 },
 {
  "pytanie": "Wartość którego atrybutu pola formularza odczytasz w PHP jako klucz tablicy $_POST?",
  "opcje": ["id", "name", "class", "type"],
  "poprawna": 1,
  "wyjasnienie": "Na serwer trafia name. Atrybut id służy do powiązania z etykietą oraz do CSS i JavaScriptu — pole bez name nie zostanie wysłane w ogóle."
 },
 {
  "pytanie": "Do czego służy atrybut scope w komórce th?",
  "opcje": ["Ustala szerokość kolumny", "Wskazuje, czy nagłówek opisuje kolumnę, czy wiersz", "Scala komórki", "Włącza sortowanie tabeli"],
  "poprawna": 1,
  "wyjasnienie": "scope=\"col\" lub scope=\"row\" pozwala czytnikom ekranu powiązać dane z właściwym nagłówkiem. Bez tego tabela jest dla nich zbiorem luźnych liczb."
 },
 {
  "pytanie": "Który sposób układania elementów wybierzesz do poziomego paska nawigacji?",
  "odpowiedz": ["flexbox", "flex", "display flex", "display:flex"],
  "wyjasnienie": "Flexbox układa elementy wzdłuż jednej osi. Grid ma sens tam, gdzie rozmieszczasz elementy w wierszach i kolumnach naraz."
 },
 {
  "pytanie": "Jak nazywa się atrybut, który dla obrazu dekoracyjnego powinien zostać pusty, ale obecny?",
  "odpowiedz": ["alt"],
  "wyjasnienie": "alt=\"\" mówi czytnikowi ekranu, że obraz można pominąć. Całkowity brak atrybutu sprawia, że czytnik odczyta nazwę pliku."
 }
]
</script>
</div>

---

## Praca do oddania

Z tego tematu oddajesz **kartę pracy**. Wypełnij ją tutaj, na stronie —
odpowiedzi zapisują się w twojej przeglądarce, a na końcu jednym przyciskiem
pobierasz gotowy plik Worda z właściwą nazwą.

!!! info "Twoje odpowiedzi zostają na twoim komputerze"

    Formularz niczego nie wysyła. Wszystko dzieje się w przeglądarce, a plik
    Worda powstaje dopiero po kliknięciu przycisku. Odwrotna strona tej samej
    monety: wyczyszczenie danych przeglądania usunie odpowiedzi, a na cudzym
    komputerze ich nie znajdziesz. Kiedy skończysz — pobierz plik.

<div class="karta-pracy" data-karta="powtorzenie-html-css"></div>

### Jak ją oddać

Zapisany plik dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
*Powtórzenie HTML i CSS — karta pracy*. Jeśli w twoim widoku załączniki są
niedostępne, wklej odpowiedzi w pole tekstowe.

---

## Na ocenę celującą

Wybierz jedno i przygotuj krótkie omówienie dla klasy.

1. **Przebuduj układ z pływających elementów na grid.** Znajdź w internecie
   stronę zbudowaną na `float` (albo napisz taką sam), a potem odtwórz ten sam
   układ gridem. Porównaj długość arkusza stylów przed i po.

2. **Zbadaj dostępność wybranej strony publicznej** — na przykład szkoły albo
   urzędu. Sprawdź kontrast, obsługę klawiaturą, obecność `alt` i etykiet.
   Opisz trzy najpoważniejsze problemy i podaj poprawki.

3. **Zastąp JavaScript selektorem `:has()`.** Znajdź przykład efektu, który
   kiedyś wymagał skryptu (na przykład podświetlenie formularza zawierającego
   nieprawidłowe pole) i zrealizuj go samym CSS-em.

---

!!! info "Materiały uzupełniające"

    - Dokumentacja HTML i CSS: [MDN Web Docs](https://developer.mozilla.org/pl/)
    - Walidator kodu: [validator.w3.org](https://validator.w3.org/)
    - Sprawdzanie wsparcia przeglądarek: [caniuse.com](https://caniuse.com/)
