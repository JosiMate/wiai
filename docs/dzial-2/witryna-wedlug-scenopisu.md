# Tworzenie witryny według projektu/scenopisu — ćwiczenia

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział II. Tworzenie i publikowanie witryn internetowych
    · efekt kształcenia **INF.03.3.6**

    Dostajesz gotowy scenopis i budujesz z niego działającą witrynę. Nic nie
    wymyślasz: treści, kolory, kroje pisma i układ sekcji są ustalone, a twoim
    zadaniem jest wierne przełożenie ich na kod. Dokładnie tak wygląda zlecenie
    w pracy — i dokładnie tak jest zbudowany arkusz egzaminu praktycznego.

!!! success "Cele lekcji"

    Po tych zajęciach potrafisz:

    1. przeczytać scenopis i wypisać z niego to, co jest wiążące, a co zostawiono do twojej decyzji
    2. przełożyć makietę na strukturę znaczników semantycznych i strukturę katalogów projektu
    3. zbudować układ sekcji siatką CSS Grid i Flexboxem, według podanej szerokości i odstępów
    4. zapisać paletę barw i kroje pisma jako zmienne CSS i sprawdzić kontrast pary kolorów
    5. przygotować wersję działającą na telefonie jednym zapytaniem medialnym
    6. spełnić podstawowe wymagania dostępności: opisy alternatywne, etykiety pól, widoczny obrys przy nawigacji klawiaturą
    7. sprawdzić własną pracę kartą oceny i walidatorem, zanim ją oddasz

[:material-file-document-outline: Scenopis witryny „Szprycha” (.docx)](../pliki/scenopis-szprycha-4ti.docx){ .md-button .md-button--primary download="scenopis-szprycha-4ti.docx" }
[:material-folder-zip: Pakiet startowy (.zip)](../pliki/szprycha-start.zip){ .md-button download="szprycha-start.zip" }
[:material-clipboard-check: Karta oceny (.docx)](../pliki/karta-oceny-szprycha-4ti.docx){ .md-button download="karta-oceny-szprycha-4ti.docx" }

---

## 1. Skąd się bierze scenopis

Nikt nie siada do kodu od razu. Między rozmową z klientem a pierwszym
znacznikiem są cztery etapy:

| Etap | Co powstaje | Kto to robi |
| --- | --- | --- |
| **Brief** | kto zamawia, po co, dla kogo, jaki budżet i termin | klient razem z wykonawcą |
| **Mapa strony** | wykaz podstron i powiązań między nimi | projektant |
| **Makieta** (*wireframe*) | rozmieszczenie bloków na stronie, bez kolorów i ozdobników | projektant |
| **Scenopis** | makieta plus treści, kolory, kroje pisma, opisy zachowań | projektant |

**Makieta pokazuje, gdzie co leży. Scenopis mówi dodatkowo, co w tym miejscu
napisać i jak ma wyglądać.** Prototyp to kolejny krok — klikalna wersja makiety,
w której można przejść ścieżkę użytkownika.

!!! tip "Na egzaminie zawodowym"

    W zadaniu praktycznym INF.03 dostajesz treść zadania z opisem strony,
    gotowe teksty i grafiki w katalogu, a często także obrazek z układem
    sekcji. Egzaminator nie ocenia twojego gustu — porównuje twoją stronę
    z opisem punkt po punkcie. Ćwiczymy dziś dokładnie tę czynność.

---

## 2. Jak czytać scenopis

Pierwsze piętnaście minut pracy to czytanie, nie pisanie. Wypisz sobie na boku
dwie listy.

=== "Wiążące — odtwarzasz dokładnie"

    - treści: nagłówki, akapity, pozycje cennika, dane kontaktowe
    - liczba i kolejność sekcji na każdej podstronie
    - nazwy plików i katalogów
    - paleta barw i kroje pisma
    - szerokość treści i punkt zmiany układu
    - wymagania techniczne: semantyka, dostępność, walidacja

=== "Twoje — decydujesz sam"

    - nazwy klas CSS i sposób ich zapisu
    - kolejność reguł w arkuszu i komentarze
    - to, czy użyjesz Grida, czy Flexboksa, o ile efekt zgadza się z makietą
    - odstępy wewnętrzne, o ile wygląd odpowiada projektowi
    - sposób pracy: kolejność pisania podstron

!!! danger "Najczęstszy błąd na tej lekcji"

    Uczeń czyta scenopis pobieżnie, buduje „coś podobnego”, a potem poprawia
    przez trzy godziny. Zgodność z projektem to pierwsze kryterium oceny —
    ładna strona niezgodna ze scenopisem dostaje mniej punktów niż skromna,
    ale zgodna.

---

## 3. Od makiety do znaczników

Każdy pas makiety ma swój odpowiednik w kodzie. Ta zamiana jest niemal
mechaniczna:

| Element makiety | Znacznik | Uwaga |
| --- | --- | --- |
| pasek górny z logo i menu | `<header>` + `<nav>` | menu to lista `<ul>` z odsyłaczami |
| główna treść podstrony | `<main>` | na stronie występuje **raz** |
| wyodrębniony blok treści | `<section>` | zwykle z własnym nagłówkiem |
| pojedynczy wpis, karta usługi | `<article>` albo `<div class="karta">` | `<article>` gdy blok ma sens sam z siebie |
| pasek boczny, treść poboczna | `<aside>` | |
| stopka z danymi | `<footer>` | |

Szkielet podstrony wygląda więc tak — i zaczynasz **od niego**, zanim napiszesz
choć jedną regułę stylu:

```html
<body>
  <header class="naglowek">
    <div class="kontener naglowek__pas">
      <a class="logo" href="index.html">…</a>
      <nav aria-label="Menu główne">
        <ul class="menu">…</ul>
      </nav>
    </div>
  </header>

  <main id="tresc">
    <section class="hero">…</section>
    <section class="uslugi">…</section>
  </main>

  <footer class="stopka">…</footer>
</body>
```

Zasada hierarchii: **jeden `<h1>` na podstronie**, pod nim `<h2>` dla sekcji,
`<h3>` dla elementów wewnątrz sekcji. Nie przeskakuje się poziomów i nie dobiera
nagłówka po wielkości liter — od wielkości jest CSS.

---

## 4. Struktura projektu i nazwy plików

```text
szprycha/
├── index.html          ← strona główna, zawsze pod tą nazwą
├── uslugi.html
├── kontakt.html
├── css/
│   └── style.css
├── img/
│   ├── logo.svg
│   └── hero.svg
└── tresci/
    └── tresci.txt      ← materiały robocze, nie trafiają na serwer
```

Trzy zasady, przez które wywraca się najwięcej prac:

1. **Nazwy plików małymi literami, bez spacji i bez polskich znaków.** Serwer
   hostingowy pracuje na Linuksie, gdzie `Logo.SVG` i `logo.svg` to dwa różne
   pliki. Na twoim Windowsie zadziała, po wysłaniu na serwer — nie.
2. **Ścieżki tylko względne.** `css/style.css`, nie `C:\Users\...`. Ścieżka
   bezwzględna działa wyłącznie na twoim komputerze.
3. **Strona główna nazywa się `index.html`.** To plik, który serwer wyświetla,
   gdy nikt nie poda nazwy pliku w adresie.

---

## 5. Kolory i kroje pisma jako zmienne

Paletę zapisujesz raz, w bloku `:root`, i dalej używasz wyłącznie nazw. Zmiana
jednego odcienia w całej witrynie to wtedy poprawka w jednym wierszu.

```css
:root {
  --kolor-glowny: #14532d;
  --kolor-akcent: #c2410c;
  --kolor-tlo: #f7f7f5;
  --kolor-tekst: #1f2933;
  --czcionka-naglowki: "Segoe UI Semibold", "Segoe UI", Tahoma, Arial, sans-serif;
  --czcionka-tekst: "Segoe UI", Tahoma, Arial, sans-serif;
}

body { background: var(--kolor-tlo); color: var(--kolor-tekst); }
h1, h2, h3 { font-family: var(--czcionka-naglowki); color: var(--kolor-glowny); }
```

W kroju pisma zawsze podajesz **listę zapasową**. Jeśli pierwszego kroju nie ma
w systemie użytkownika, przeglądarka bierze kolejny — dlatego lista kończy się
nazwą rodziny (`sans-serif`), a nie konkretnym plikiem.

### Kontrast — liczba, nie wrażenie

Tekst musi odcinać się od tła w stosunku co najmniej **4,5 : 1** dla zwykłego
rozmiaru (wytyczne WCAG 2.2, poziom AA). Nie ocenia się tego okiem, tylko mierzy
— w narzędziach deweloperskich przeglądarki (F12 → wybierz element → podgląd
koloru) albo w dowolnym mierniku kontrastu.

| Para kolorów | Kontrast | Ocena |
| --- | :---: | --- |
| biały na `#ea580c` (jasny pomarańcz) | 3,6 : 1 | :material-close-circle: za mało |
| biały na `#c2410c` (ciemniejszy pomarańcz) | 5,2 : 1 | :material-check-circle: wystarczy |
| biały na `#14532d` (zieleń główna) | 9,1 : 1 | :material-check-circle: z zapasem |
| `#1f2933` na tle `#f7f7f5` | 13,8 : 1 | :material-check-circle: tekst zasadniczy |

!!! info "To już nie jest tylko dobra praktyka"

    Polska ustawa z 26 kwietnia 2024 r. o zapewnianiu spełniania wymagań
    dostępności niektórych produktów i usług — wdrożenie unijnego aktu
    o dostępności — obowiązuje od **28 czerwca 2025 r.** Obejmuje między innymi
    usługi handlu elektronicznego, czyli sklepy i serwisy sprzedażowe.
    Dostępność witryny bywa dziś warunkiem umowy, nie dodatkiem.

---

## 6. Układ sekcji

Najpierw **kontener**: element, który ogranicza szerokość treści i centruje ją
na ekranie. Bez niego tekst rozjeżdża się na całą szerokość monitora.

```css
.kontener {
  width: min(100% - 2 * 1.5rem, 1100px);
  margin-inline: auto;
}
```

Potem siatka. Dwa narzędzia, dwa zastosowania:

=== "CSS Grid — układ w dwóch wymiarach"

    Do siatek: kafelki usług, galeria, układ strony na kolumny.

    ```css
    .uslugi {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    ```

    `1fr` to jedna część dostępnego miejsca — trzy równe kolumny dzielą je po
    równo, niezależnie od zawartości.

=== "Flexbox — układ w jednym wymiarze"

    Do pasków: nagłówek z logo i menu, rząd przycisków, stopka.

    ```css
    .naglowek__pas {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    ```

    `justify-content: space-between` rozsuwa elementy do krawędzi,
    `flex-wrap: wrap` pozwala im zawinąć się na wąskim ekranie.

!!! warning "Czego nie używamy do układu"

    Tabeli (`<table>`) — ona służy do danych, a cennik to dane, ale układ strony
    już nie. Pływania (`float`) — to rozwiązanie sprzed Grida, dziś stosowane
    tylko do oblewania obrazu tekstem. Pozycjonowania bezwzględnego do budowy
    sekcji — rozpada się przy każdej zmianie treści.

---

## 7. Obrazy

```html
<img src="img/hero.svg" alt="Rower oparty o ścianę warsztatu"
     width="640" height="400" loading="lazy">
```

- **`alt`** opisuje, co przedstawia obraz — czyta go czytnik ekranu i wyświetla
  przeglądarka, gdy plik się nie wczyta. Obraz czysto ozdobny dostaje `alt=""`,
  puste, ale obecne.
- **`width` i `height`** podane w kodzie rezerwują miejsce, dzięki czemu treść
  nie podskakuje w trakcie wczytywania.
- **`loading="lazy"`** odkłada pobranie obrazów spoza pierwszego ekranu.
- **Format:** zdjęcia najlepiej w WebP lub AVIF (mniejsze od JPEG przy tej samej
  jakości), grafiki płaskie i logo w SVG — skaluje się bez utraty ostrości.

W pakiecie startowym wszystkie grafiki są w SVG i mają gotowe opisy
alternatywne wypisane w pliku z treściami. Twoim zadaniem jest je przepisać,
a nie wymyślić.

---

## 8. Responsywność

Zaczynasz od układu szerokiego, bo taki jest w makiecie, a potem dokładasz
**jedno** zapytanie medialne na końcu arkusza:

```css
@media (max-width: 720px) {
  .uslugi { grid-template-columns: 1fr; }
  .hero   { grid-template-columns: 1fr; }
  .kontener { --odstep: 1rem; }
}
```

Dwie rzeczy, bez których nic z tego nie zadziała:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

```css
img { max-width: 100%; height: auto; }
```

Bez znacznika `viewport` telefon udaje szeroki ekran i pomniejsza całą stronę.
Bez `max-width` na obrazach jeden szeroki plik rozpycha stronę i pojawia się
poziomy pasek przewijania — na egzaminie to punkt w dół.

**Sprawdzenie:** ++f12++ → ikona urządzenia mobilnego → szerokość 360 px.
Strona ma być czytelna bez powiększania i **bez przewijania w poziomie**.

---

## 9. Dostępność w praktyce

Cztery rzeczy, które kosztują minutę, a decydują o punktach:

```html
<!-- 1. Etykieta powiązana z polem — sam napis obok pola nie wystarcza -->
<label for="email">Adres e-mail</label>
<input type="email" id="email" name="email" required>

<!-- 2. Telefon i e-mail jako odsyłacze -->
<a href="tel:+48140000000">14 000 00 00</a>
<a href="mailto:serwis@szprycha.example">serwis@szprycha.example</a>

<!-- 3. Odsyłacz pomijający nawigację, pierwszy element w <body> -->
<a class="pomin-nawigacje" href="#tresc">Przejdź do treści</a>
```

```css
/* 4. Widoczny obrys przy nawigacji klawiaturą */
a:focus-visible, button:focus-visible, input:focus-visible {
  outline: 3px solid var(--kolor-akcent);
  outline-offset: 2px;
}
```

!!! danger "Nigdy `outline: none`"

    Usunięcie obrysu jest najczęstszą poradą z internetu i najprostszym sposobem
    na uczynienie strony bezużyteczną dla osoby, która nie korzysta z myszy.
    Obrys wolno **zmienić**, nie wolno go **skasować**.

Szybki test bez żadnych narzędzi: odłóż mysz i przejdź całą stronę klawiszem
++tab++. Widzisz, gdzie jesteś? Dasz się dostać do wszystkich odsyłaczy
i wypełnić formularz? Jeśli tak — podstawa jest spełniona.

---

## 10. Zanim oddasz

Kolejność sprawdzania jest zawsze ta sama:

1. **Zgodność ze scenopisem** — przejdź punkt po punkcie, z dokumentem obok.
2. **Walidacja HTML** — [validator.w3.org](https://validator.w3.org/), zakładka
   *Validate by File Upload*, każda podstrona osobno. Poprawiasz **pierwszy**
   błąd i sprawdzasz ponownie; jeden niedomknięty znacznik generuje ich kilka.
3. **Walidacja CSS** — [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/).
4. **Widok 360 px** — bez poziomego przewijania.
5. **Klawiatura** — przejście ++tab++ przez całą stronę.
6. **Karta oceny** — dziesięć kryteriów, te same, według których stawiam ocenę.

---

## Plan trzech godzin

| Godzina | Co robisz | Stan na koniec |
| :---: | --- | --- |
| **1** | Czytasz scenopis, rozpakowujesz pakiet startowy, budujesz szkielet HTML trzech podstron: nagłówek, sekcje, stopka, treści z pliku | Trzy podstrony z treścią, bez stylów, nawigacja działa |
| **2** | Piszesz style: zmienne, kontener, hero, kafelki siatką, pasek „dlaczego my”, tabela cennika, formularz, stopka | Witryna wygląda jak makieta na szerokim ekranie |
| **3** | Dokładasz zapytanie medialne, poprawiasz dostępność, walidujesz, sprawdzasz kartą oceny, pakujesz i oddajesz | Praca oddana w VULCAN-ie |

---

## Ćwiczenia

### :material-console: Ćwiczenie 1 — analiza i szkielet *(godzina 1)*

1. Przeczytaj cały scenopis. Wypisz w karcie pracy **pięć ustaleń wiążących**
   i **dwie rzeczy pozostawione twojej decyzji**.
2. Rozpakuj pakiet startowy do własnego katalogu roboczego.
3. Uzupełnij `index.html`: sekcje 3.1–3.3 i stopkę, treści z `tresci/tresci.txt`.
4. Zbuduj `uslugi.html` i `kontakt.html` — nagłówek przenieś z gotowego wzoru
   i przestaw aktywną pozycję menu.
5. Sprawdź w przeglądarce, że wszystkie trzy podstrony otwierają się z menu.

Na tym etapie strona ma wyglądać brzydko. Jeśli wygląda ładnie, to znaczy, że
pisałeś style zamiast struktury.

### :material-console: Ćwiczenie 2 — style według projektu *(godzina 2)*

1. Uzupełnij `css/style.css` w kolejności komentarzy `TODO`.
2. Kafelki usług ułóż siatką Grid, pasek nagłówka i stopkę — Flexboksem.
3. Sprawdź w narzędziach deweloperskich kontrast przycisku „Umów przegląd”
   i wpisz zmierzoną wartość do karty pracy.
4. Porównaj gotowy widok z makietą ze scenopisu — sekcja po sekcji.

### :material-console: Ćwiczenie 3 — telefon, dostępność, oddanie *(godzina 3)*

1. Dopisz zapytanie medialne dla 720 px i sprawdź witrynę przy 360 px.
2. Przejdź stronę klawiszem ++tab++ i popraw to, co zniknęło z pola widzenia.
3. Zwaliduj wszystkie trzy podstrony i arkusz stylów. Zrzut wyniku jednej
   podstrony wklej do karty pracy.
4. Wypełnij kartę oceny jako samoocenę i popraw to, co sam wskazałeś.
5. Spakuj katalog do `4TI_<numer w dzienniku>_szprycha.zip` i wyślij.

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Czym różni się makieta od scenopisu?",
    "typ": "jedna",
    "opcje": [
      "Makieta jest kolorowa, a scenopis czarno-biały",
      "Makieta pokazuje rozmieszczenie bloków, a scenopis dokłada treści, kolory i kroje pisma",
      "Makieta powstaje po scenopisie, jako jego uszczegółowienie",
      "To dwie nazwy tego samego dokumentu"
    ],
    "poprawna": 1,
    "wyjasnienie": "Makieta odpowiada na pytanie „gdzie co leży”, scenopis dodatkowo na „co tam napisać i jak to ma wyglądać”. Prototyp to jeszcze krok dalej — klikalna wersja makiety."
  },
  {
    "pytanie": "Scenopis podaje teksty do wklejenia. Możesz je przeredagować, jeśli uznasz, że brzmią lepiej?",
    "typ": "jedna",
    "opcje": [
      "Tak, liczy się efekt wizualny",
      "Nie — treści są wiążące, zmiana obniża ocenę za zgodność z projektem",
      "Tak, o ile poinformujesz o tym nauczyciela po oddaniu",
      "Tylko w nagłówkach"
    ],
    "poprawna": 1,
    "wyjasnienie": "Zgodność ze zleceniem to pierwsze kryterium oceny. W pracy to samo: treść zwykle zatwierdza klient i wykonawca jej nie zmienia z własnej inicjatywy."
  },
  {
    "pytanie": "Ile znaczników <h1> powinna mieć jedna podstrona?",
    "typ": "jedna",
    "opcje": ["Dokładnie jeden", "Po jednym na każdą sekcję", "Tyle, ile potrzeba do wyglądu", "Żadnego, wystarczy <title>"],
    "poprawna": 0,
    "wyjasnienie": "Jeden h1 określa temat całej podstrony. Kolejne poziomy to h2 i h3. O wielkości liter decyduje CSS, nie wybór poziomu nagłówka."
  },
  {
    "pytanie": "Strona działa na twoim komputerze, ale po wysłaniu na serwer nie wczytuje obrazów. Co sprawdzisz najpierw?",
    "typ": "jedna",
    "opcje": [
      "Rozmiar plików graficznych",
      "Wielkość liter w nazwach plików i ścieżkach — serwer linuksowy rozróżnia Logo.SVG i logo.svg",
      "Wersję przeglądarki",
      "Czy w kodzie użyto znacznika <picture>"
    ],
    "poprawna": 1,
    "wyjasnienie": "Windows nie rozróżnia wielkości liter w nazwach plików, Linux tak. Druga częsta przyczyna to ścieżka bezwzględna z dysku C."
  },
  {
    "pytanie": "Biały tekst na tle #ea580c daje kontrast 3,6 : 1. Co to oznacza dla przycisku ze zwykłym tekstem?",
    "typ": "jedna",
    "opcje": [
      "Spełnia wymagania WCAG na poziomie AA",
      "Nie spełnia wymagań — minimum to 4,5 : 1, trzeba przyciemnić tło albo zmienić kolor tekstu",
      "Wystarczy pogrubić tekst i wymóg zostaje spełniony",
      "Kontrast nie dotyczy przycisków"
    ],
    "poprawna": 1,
    "wyjasnienie": "Dla zwykłego tekstu minimum to 4,5 : 1. Ciemniejszy odcień #c2410c daje 5,2 : 1 i wymóg spełnia. Złagodzony próg 3 : 1 dotyczy dużego tekstu, nie tego przypadku."
  },
  {
    "pytanie": "Które rozwiązanie zbuduje trzy równe kafelki obok siebie zgodnie z makietą?",
    "typ": "jedna",
    "opcje": [
      "Tabela z jednym wierszem i trzema komórkami",
      "display: grid oraz grid-template-columns: repeat(3, 1fr)",
      "float: left dla każdego kafelka",
      "position: absolute z podanymi współrzędnymi"
    ],
    "poprawna": 1,
    "wyjasnienie": "Tabela służy do danych, float to rozwiązanie sprzed Grida, a pozycjonowanie bezwzględne rozpada się przy zmianie treści. Siatka Grid robi to jedną regułą i łatwo ją przestawić na jedną kolumnę."
  },
  {
    "pytanie": "Pole formularza ma obok siebie napis „Adres e-mail”. Kiedy jest to poprawna etykieta?",
    "typ": "jedna",
    "opcje": [
      "Zawsze — liczy się to, co widzi użytkownik",
      "Gdy napis jest w znaczniku <label for=\"…\"> wskazującym na id pola",
      "Gdy napis jest pogrubiony",
      "Gdy pole ma atrybut placeholder o tej samej treści"
    ],
    "poprawna": 1,
    "wyjasnienie": "Bez powiązania label z id czytnik ekranu nie wie, co to za pole, a kliknięcie w napis nie ustawia kursora w polu. Placeholder etykiety nie zastępuje — znika po rozpoczęciu pisania."
  },
  {
    "pytanie": "Na telefonie pojawia się poziomy pasek przewijania. Co jest najczęstszą przyczyną?",
    "typ": "jedna",
    "opcje": [
      "Zbyt mała czcionka",
      "Element szerszy od ekranu — zwykle obraz bez max-width lub brak znacznika viewport",
      "Zbyt wiele reguł w arkuszu stylów",
      "Użycie CSS Grid zamiast Flexboksa"
    ],
    "poprawna": 1,
    "wyjasnienie": "Sprawdza się to w narzędziach deweloperskich, zawężając widok: element, który wystaje poza ekran, widać od razu. Reguła img { max-width: 100%; height: auto; } rozwiązuje większość takich przypadków."
  }
]
</script>
</div>

---

## Praca do oddania

Oddajesz **dwie rzeczy**: spakowaną witrynę i kartę pracy.

!!! info "Twoje odpowiedzi zostają na twoim komputerze"

    Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
    przycisku. Wyczyszczenie danych przeglądania usunie odpowiedzi — kiedy
    skończysz, pobierz plik.

<div class="karta-pracy" data-karta="witryna-wedlug-scenopisu"></div>

### Jak to oddać

1. Katalog witryny spakuj do `4TI_<numer w dzienniku>_szprycha.zip`.
2. Kartę pracy pobierz jako dokument Worda.
3. Oba pliki dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *Witryna według scenopisu*.

---

## Na ocenę celującą


!!! info "Jak oddajesz zadanie na ocenę celującą"

    W karcie pracy zaznaczasz tylko, **które zadanie wybrałeś**, i opisujesz
    w kilku zdaniach, co z niego wyszło. Samą pracę — plik, kod, witrynę albo
    zrzuty z pomiarami — oddajesz **osobno**, w Dzienniku VULCAN w zadaniu
    *Zadanie na ocenę celującą: Tworzenie witryny według projektu/scenopisu — ćwiczenia*, w ciągu **dwóch tygodni** od
    omówienia tematu.
Wybierz jedno zadanie. Warunkiem jest wcześniejsze oddanie kompletnej witryny.

1. **Czwarta podstrona — galeria.** Dołóż `galeria.html` z siatką miniatur
   (Grid, `loading="lazy"`, opisy alternatywne). Zmierz w zakładce *Sieć*
   rozmiar pobranych zasobów przed zastosowaniem `loading="lazy"` i po nim.

2. **Wersja ciemna bez JavaScriptu.** Dodaj drugi zestaw zmiennych w regule
   `@media (prefers-color-scheme: dark)` i sprawdź kontrast każdej pary kolorów
   również w tej wersji. Podaj zmierzone wartości.

3. **Audyt strony.** Przepuść witrynę przez wbudowany audyt przeglądarki
   (F12 → *Lighthouse* lub odpowiednik) i opisz trzy najpoważniejsze uwagi:
   co znaczą, co poprawiłeś i jak zmienił się wynik.

4. **Wersja do druku.** Napisz regułę `@media print`, która ukrywa nawigację
   i stopkę, rozwija odsyłacze do postaci tekstowej i mieści cennik na jednej
   stronie A4.

---

!!! info "Materiały uzupełniające"

    - Walidator HTML: [validator.w3.org](https://validator.w3.org/) · walidator CSS: [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/)
    - Dokumentacja CSS Grid i Flexboksa: [developer.mozilla.org](https://developer.mozilla.org/pl/docs/Web/CSS/CSS_grid_layout)
    - Wytyczne dostępności po polsku: [wcag.pl](https://wcag.pl/)
    - Obowiązki wynikające z aktu o dostępności: [gov.pl — dostępność cyfrowa](https://www.gov.pl/web/dostepnosc-cyfrowa)

*Wartości kontrastu policzone dla palety z tego scenopisu; stan prawny i wersje
wytycznych sprawdzone 13 września 2026 r.*
