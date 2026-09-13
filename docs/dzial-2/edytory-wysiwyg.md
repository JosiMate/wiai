# Edytory WYSIWYG i dobór narzędzi

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział II. Tworzenie i publikowanie witryn internetowych
    · efekty kształcenia **INF.03.3.6**, **INF.03.5.5**

    Temat wygląda na katalog programów, ale nie o to w nim chodzi. Chodzi
    o umiejętność, którą podstawa programowa nazywa **doborem narzędzia**:
    umiesz spojrzeć na zadanie, warunki i odbiorcę, i uzasadnić, czym je
    zrobisz. To pytanie wraca potem przy każdym zleceniu w pracy.

!!! success "Cele lekcji"

    Po tej lekcji potrafisz:

    1. wyjaśnić, na czym polega zasada WYSIWYG, i wskazać, za co po jej zastosowaniu nadal odpowiadasz jako autor strony
    2. rozróżnić cztery rodziny narzędzi do budowy witryn i podać przykład zastosowania każdej z nich
    3. ocenić kod wygenerowany przez edytor: znaleźć nadmiarowe znaczniki, style wpisane w atrybuty i braki w dostępności
    4. dobrać narzędzie do zadania, uzasadniając wybór wymaganiami zlecenia, budżetem i kompetencjami odbiorcy
    5. wskazać, kiedy edytor WYSIWYG jest rozwiązaniem lepszym od pisania kodu ręcznie, a kiedy gorszym
    6. wymienić składniki nowoczesnego środowiska pracy front-end i powiedzieć, co każdy z nich wnosi

## 1. Co znaczy WYSIWYG

**WYSIWYG** to skrót od *What You See Is What You Get* — „to, co widzisz, jest
tym, co dostaniesz". Układasz stronę wizualnie: przeciągasz bloki, wpisujesz
tekst, zmieniasz kolory. Kod HTML i CSS powstaje sam, w tle.

Idea narodziła się w latach dziewięćdziesiątych, kiedy pisanie stron ręcznie
było umiejętnością rzadką. Obietnica brzmiała: nie musisz znać HTML-a, żeby
zrobić stronę.

Obietnica została spełniona tylko połowicznie i **to jest sedno tej lekcji**.
Nie musisz znać HTML-a, żeby *zrobić* stronę. Musisz go znać, żeby ocenić, czy
strona, którą zrobiłeś, jest dobra — a odpowiadasz za nią tak samo, jakbyś
napisał każdą linijkę sam.

---

## 2. Cztery rodziny narzędzi

Nazwy programów zmieniają się co kilka lat, kategorie są trwalsze. Ucz się
kategorii.

| Rodzaj | Przykłady | Kto tego używa | Koszt |
| --- | --- | --- | --- |
| **Edytor kodu z podglądem** | VS Code, Sublime Text, Brackets | programista — pełna kontrola nad kodem | bezpłatne |
| **Edytor hybrydowy** | Dreamweaver, Pinegrow, Nicepage | projektant znający kod, praca wizualna z wglądem w źródło | Dreamweaver ok. 23 USD/mies. |
| **Kreator stron w chmurze** | Wix, Squarespace, Webflow | klient bez zaplecza technicznego, szybka wizytówka | abonament |
| **Edytor treści w systemie CMS** | Gutenberg (WordPress), TinyMCE, CKEditor | redaktor, który tylko dopisuje treść | zwykle w cenie CMS-a |

!!! note "Edytor hybrydowy to nie to samo co czysty WYSIWYG"

    Dreamweaver czy Pinegrow pokazują jednocześnie widok wizualny i kod, a to,
    co zmienisz po jednej stronie, natychmiast widać po drugiej. To narzędzie
    dla kogoś, kto kod **czyta** — a nie dla kogoś, kto chce go uniknąć.
    Właśnie dlatego są używane zawodowo, a kreatory z chmury raczej nie.

---

## 3. Co edytor robi z twoim kodem

Tu leży cały ciężar tematu. Ten sam prosty fragment — nagłówek i akapit —
napisany ręcznie i wygenerowany przez narzędzie wizualne.

=== "Napisane ręcznie"

    ```html
    <section class="oferta">
      <h2>Nasza oferta</h2>
      <p>Projektujemy strony internetowe dla małych firm.</p>
    </section>
    ```

    Trzy znaczniki. Struktura mówi, czym jest treść. Style siedzą w osobnym
    arkuszu, więc zmiana wyglądu w całym serwisie to jedna poprawka.

=== "Typowy wynik generatora"

    ```html
    <div id="comp-l8x2k9" class="_2Hb5s wixui-section">
      <div class="_1Yd7p" style="width:100%;padding:24px 0 24px 0">
        <div class="_3Kf9d" style="font-size:32px;font-weight:700;
             font-family:Arial,sans-serif;color:rgb(34,34,34);
             line-height:1.2;margin:0 0 12px 0">Nasza oferta</div>
        <div class="_9Qm4x" style="font-size:16px;color:rgb(85,85,85);
             line-height:1.5">Projektujemy strony internetowe dla małych firm.</div>
      </div>
    </div>
    ```

    Sam `div`, klasy wygenerowane automatycznie, style wpisane w atrybut
    `style`. To nie jest kod konkretnego produktu — to wzorzec, który zobaczysz
    w wielu narzędziach wizualnych.

### Trzy konsekwencje, które trzeba umieć nazwać

**Brak semantyki.** W drugim przykładzie nagłówek nie jest nagłówkiem, tylko
`div`-em o dużej czcionce. Wyszukiwarka nie wie, że to tytuł sekcji. Czytnik
ekranu nie zbuduje z tego spisu treści. Użytkownik niewidomy nie przeskoczy
między nagłówkami, bo dla niego ta strona nie ma żadnego.

**Style w atrybucie `style`.** To specyficzność 1,0,0,0 — najwyższa poza
`!important`. Chcesz zmienić kolor nagłówków w całym serwisie? Musisz poprawić
każdy element osobno, bo żadna reguła z arkusza tego nie nadpisze.

**Objętość.** Trzy linijki zamieniły się w kilkanaście. Przy całej stronie
różnica idzie w setki kilobajtów, co przekłada się na czas ładowania — a to
z kolei na pozycję w wyszukiwarce.

!!! danger "Egzamin zawodowy sprawdza kod, nie wygląd"

    Na części praktycznej INF.03 oceniana jest struktura dokumentu: użycie
    znaczników semantycznych, poprawność, oddzielenie treści od prezentacji.
    Strona wyglądająca dobrze, ale zbudowana z samych `div`-ów ze stylami
    lokalnymi, straci punkty mimo poprawnego wyglądu.

---

## 4. Jak dobrać narzędzie

To jest właśnie ta umiejętność, o którą chodzi w podstawie programowej.
Pięć pytań, które zadajesz sobie przed wyborem:

**Kto będzie później aktualizował tę stronę?** Jeśli sekretariat szkoły ma sam
dopisywać ogłoszenia — potrzebny jest CMS z edytorem treści, a nie ręcznie
pisany HTML. Jeśli tylko ty — edytor kodu.

**Jak długo strona ma żyć?** Wizytówka na jedno wydarzenie może powstać
w kreatorze. Serwis rozwijany przez lata potrzebuje kodu, który da się czytać
i wersjonować.

**Czy kod musi być twój?** Kreatory z chmury trzymają stronę u siebie.
Przeniesienie jej gdzie indziej bywa niemożliwe albo bardzo kosztowne. To się
nazywa *vendor lock-in* i jest realnym ryzykiem biznesowym.

**Jakie są wymagania dotyczące dostępności?** Strony podmiotów publicznych
muszą spełniać WCAG — a to wymaga kontroli nad strukturą dokumentu, której
kreator nie daje.

**Jaki jest budżet?** VS Code jest bezpłatny. Dreamweaver to około 23 dolarów
miesięcznie. Kreator w chmurze to abonament bez końca — przestajesz płacić,
strona znika.

---

## 5. Nowoczesne środowisko pracy

:material-plus-circle: **rozszerzenie**

Współczesny sposób pracy nie jest wyborem między „wizualnie" a „ręcznie".
Edytor kodu z kilkoma dodatkami daje szybkość WYSIWYG-a bez utraty kontroli.

**Emmet** — wbudowany w VS Code. Piszesz skrót i naciskasz Tab:

```text
nav>ul>li*3>a[href="#"]{Pozycja $}
```

powstaje z tego:

```html
<nav>
  <ul>
    <li><a href="#">Pozycja 1</a></li>
    <li><a href="#">Pozycja 2</a></li>
    <li><a href="#">Pozycja 3</a></li>
  </ul>
</nav>
```

Szybciej niż przeciąganie bloków myszą — i to ty decydujesz, że `nav` jest
`nav`-em.

**Podgląd na żywo** (rozszerzenie Live Server) — strona przeładowuje się sama
przy każdym zapisie pliku. To jest „WYSIWYG" w praktycznym sensie: widzisz
efekt natychmiast, tylko źródłem pozostaje twój kod.

**Formatowanie** (Prettier) — porządkuje wcięcia jednym skrótem, więc kod
zostaje czytelny bez wysiłku.

**Narzędzia deweloperskie przeglądarki** (F12) — sprawdzasz, która reguła CSS
faktycznie zadziałała i dlaczego, testujesz układ na różnych szerokościach
ekranu, mierzysz czas ładowania. Bez tego pracujesz po omacku.

---

## 6. Edytory w systemach CMS

:material-plus-circle: **rozszerzenie**

Z tą rodziną zetkniesz się zawodowo najczęściej, bo większość stron w Polsce
stoi na systemach zarządzania treścią.

**Gutenberg** — edytor blokowy WordPressa. Treść składasz z bloków: akapit,
nagłówek, obraz, galeria, kolumny. Generuje przyzwoity, semantyczny kod,
bo bloki mają przypisane znaczniki.

**TinyMCE i CKEditor** — klasyczne edytory tekstu sformatowanego, osadzane
w panelach administracyjnych i w formularzach aplikacji. Wyglądają jak mały
Word nad polem tekstowym.

!!! warning "Wklejanie z Worda"

    Najczęstszy problem redaktorów: tekst wklejony z Worda przynosi ze sobą
    setki znaczników formatujących i śmieciowe style. Dlatego edytory mają
    przycisk **wklej jako zwykły tekst** (`Ctrl + Shift + V`). Warto tego
    nauczyć każdego, komu oddajesz stronę do prowadzenia — inaczej za pół roku
    nie poznasz własnego serwisu.

---

## 7. Kiedy WYSIWYG naprawdę wygrywa

Żeby nie zostało wrażenie, że narzędzia wizualne są bezwartościowe — są
sytuacje, w których to one są rozwiązaniem właściwym:

- **Prototyp na spotkanie z klientem.** Trzy godziny zamiast trzech dni, żeby
  ustalić kierunek. Kod i tak powstanie później.
- **Newsletter i szablony e-mail.** Kod HTML w wiadomościach e-mail to osobne
  piekło, w którym wciąż obowiązują tabele i style lokalne. Tu generator jest
  szybszy i mniej zawodny od człowieka.
- **Strona prowadzona przez osobę nietechniczną.** Klient, który sam dopisuje
  aktualności, potrzebuje edytora wizualnego — inaczej będzie dzwonił po tobie
  za każdym przecinkiem.
- **Nauka przez oglądanie.** Zbuduj coś wizualnie, a potem przeczytaj
  wygenerowany kod. To dobry sposób, żeby zobaczyć, jak układ przekłada się
  na strukturę.

---

## Ćwiczenia

### :material-console: Ćwiczenie 1 — ta sama strona dwiema drogami

Zbuduj prostą wizytówkę: nagłówek, jedna sekcja z tekstem i obrazem, stopka.

1. Najpierw w narzędziu wizualnym — użyj darmowego kreatora albo edytora
   hybrydowego wskazanego przez nauczyciela.
2. Potem to samo ręcznie w edytorze kodu, ze znacznikami semantycznymi.
3. Podejrzyj kod źródłowy obu wersji (`Ctrl + U` w przeglądarce).

Zanotuj: liczbę znaczników, liczbę atrybutów `style`, obecność znaczników
semantycznych i rozmiar pliku HTML.

### :material-console: Ćwiczenie 2 — walidacja i waga

Wrzuć obie strony do walidatora `validator.w3.org` i porównaj liczbę błędów
oraz ostrzeżeń. Następnie w narzędziach deweloperskich (F12 → zakładka
**Sieć**) sprawdź całkowity rozmiar pobranych zasobów dla każdej wersji.

### :material-console: Ćwiczenie 3 — Emmet na czas

Odtwórz strukturę menu z sekcji 5, używając wyłącznie skrótu Emmeta. Zmierz
czas. Potem zbuduj to samo, przeciągając elementy w narzędziu wizualnym,
i zmierz ponownie.

---

## Sprawdź się

Test z natychmiastową odpowiedzią. **Nie jest oceniany i nic nie wysyła.**

<div class="quiz" markdown="0">
<script type="application/json">
[
 {
  "pytanie": "Co dosłownie znaczy skrót WYSIWYG?",
  "opcje": ["What You See Is What You Get", "Web You Set Is What You Generate", "What You Style Is What You Grade", "Web Interface Style Was You Generated"],
  "poprawna": 0,
  "wyjasnienie": "„To, co widzisz, jest tym, co dostaniesz” — układasz stronę wizualnie, a kod powstaje w tle."
 },
 {
  "pytanie": "Generator zamienił nagłówek sekcji na <div> z dużą czcionką. Jaki jest tego najpoważniejszy skutek?",
  "opcje": ["Strona ładuje się wolniej", "Nagłówek przestaje być nagłówkiem dla wyszukiwarek i czytników ekranu", "Nie da się zmienić jego koloru", "Przeglądarka wyświetli błąd"],
  "poprawna": 1,
  "wyjasnienie": "Wygląd jest ten sam, ale znaczenie znika. Czytnik ekranu nie zbuduje spisu treści, a wyszukiwarka nie rozpozna hierarchii — to problem semantyki, nie estetyki."
 },
 {
  "pytanie": "Dlaczego style wpisane w atrybut style utrudniają późniejsze zmiany?",
  "opcje": ["Bo przeglądarki ich nie obsługują", "Bo mają najwyższą specyficzność i reguły z arkusza ich nie nadpiszą", "Bo są zapisywane w osobnym pliku", "Bo działają tylko w trybie deweloperskim"],
  "poprawna": 1,
  "wyjasnienie": "Styl lokalny ma specyficzność 1,0,0,0. Żeby zmienić kolor nagłówków w całym serwisie, trzeba poprawić każdy element osobno."
 },
 {
  "pytanie": "Klient chce stronę, którą jego sekretariat będzie sam aktualizował o ogłoszenia. Co proponujesz?",
  "opcje": ["Stronę pisaną ręcznie w HTML i CSS", "System CMS z edytorem treści", "Plik PDF na serwerze", "Kreator w chmurze z abonamentem dożywotnim"],
  "poprawna": 1,
  "wyjasnienie": "Decyduje odpowiedź na pytanie „kto będzie to aktualizował”. Osoba nietechniczna potrzebuje edytora treści, a nie dostępu do kodu."
 },
 {
  "pytanie": "Czym jest vendor lock-in w kontekście kreatorów stron w chmurze?",
  "opcje": ["Blokadą konta po niezapłaceniu faktury", "Uzależnieniem od dostawcy — strony nie da się łatwo przenieść gdzie indziej", "Zabezpieczeniem kodu przed kopiowaniem", "Limitem liczby podstron w darmowym planie"],
  "poprawna": 1,
  "wyjasnienie": "Strona żyje na serwerach dostawcy w jego formacie. Przeniesienie bywa niemożliwe albo bardzo kosztowne — to ryzyko biznesowe, które trzeba klientowi nazwać przed podpisaniem umowy."
 },
 {
  "pytanie": "Jak nazywa się mechanizm w VS Code, który ze skrótu nav>ul>li*3 tworzy gotową strukturę HTML?",
  "odpowiedz": ["Emmet"],
  "wyjasnienie": "Emmet jest wbudowany w VS Code. Skrót rozwijasz klawiszem Tab — szybciej niż przeciąganie bloków, a struktura pozostaje twoją decyzją."
 },
 {
  "pytanie": "W której sytuacji narzędzie wizualne jest wyborem rozsądniejszym niż pisanie kodu ręcznie?",
  "opcje": ["Przy serwisie rozwijanym przez kilka lat", "Przy stronie urzędu, która musi spełniać WCAG", "Przy szablonie wiadomości e-mail", "Przy stronie, której kod ma trafić do repozytorium"],
  "poprawna": 2,
  "wyjasnienie": "Kod HTML w wiadomościach e-mail rządzi się własnymi, archaicznymi prawami — tabele i style lokalne. Generator jest tu szybszy i mniej zawodny od człowieka."
 },
 {
  "pytanie": "Redaktor wkleja tekst z Worda do edytora CMS i strona się rozjeżdża. Co powinien zrobić?",
  "opcje": ["Zmienić przeglądarkę", "Wkleić jako zwykły tekst skrótem Ctrl + Shift + V", "Wyłączyć arkusz stylów", "Zapisać dokument jako PDF i wstawić jako obraz"],
  "poprawna": 1,
  "wyjasnienie": "Word przynosi ze sobą setki znaczników formatujących. Wklejenie jako zwykły tekst usuwa je i zostawia treść, którą CMS ostyluje po swojemu."
 }
]
</script>
</div>

---

## Praca do oddania

Z tego tematu oddajesz **kartę pracy** — jej trzon to porównanie kodu z obu
narzędzi, więc wykonaj najpierw ćwiczenia 1 i 2.

!!! info "Twoje odpowiedzi zostają na twoim komputerze"

    Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
    przycisku. Wyczyszczenie danych przeglądania usunie odpowiedzi — kiedy
    skończysz, pobierz plik.

<div class="karta-pracy" data-karta="edytory-wysiwyg"></div>

### Jak ją oddać

Zapisany plik dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
*Edytory WYSIWYG — karta pracy*.

---

## Na ocenę celującą


!!! info "Jak oddajesz zadanie na ocenę celującą"

    W karcie pracy zaznaczasz tylko, **które zadanie wybrałeś**, i opisujesz
    w kilku zdaniach, co z niego wyszło. Samą pracę — plik, kod, witrynę albo
    zrzuty z pomiarami — oddajesz **osobno**, w Dzienniku VULCAN w zadaniu
    *Zadanie na ocenę celującą: Edytory WYSIWYG i dobór narzędzi*, w ciągu **dwóch tygodni** od
    omówienia tematu.
Wybierz jedno zadanie.

1. **Przetestuj dostępność strony z kreatora.** Zbuduj prostą stronę
   w wybranym kreatorze z chmury, a potem sprawdź ją pod kątem WCAG: przejdź
   tabulatorem, zbadaj kontrast, sprawdź obecność `alt` i etykiet. Opisz, co
   dało się poprawić z poziomu kreatora, a czego nie — i wyciągnij wniosek.

2. **Oczyść wygenerowany kod.** Weź stronę z narzędzia wizualnego i przepisz
   ją ręcznie: znaczniki semantyczne, style w zewnętrznym arkuszu, ten sam
   wygląd. Podaj rozmiar pliku przed i po oraz liczbę błędów walidatora.

3. **Przygotuj rekomendację dla klienta.** Wymyśl trzy różne zlecenia — na
   przykład wizytówka fryzjera, serwis szkoły, sklep z rękodziełem — i dla
   każdego uzasadnij dobór narzędzia, odwołując się do pięciu kryteriów
   z sekcji 4. Uzasadnienie ma być argumentem, nie preferencją.

---

!!! info "Materiały uzupełniające"

    - Walidator kodu: [validator.w3.org](https://validator.w3.org/)
    - Ściąga ze skrótów Emmeta: [docs.emmet.io/cheat-sheet](https://docs.emmet.io/cheat-sheet/)
    - Wytyczne dostępności po polsku: [wcag.pl](https://wcag.pl/)
