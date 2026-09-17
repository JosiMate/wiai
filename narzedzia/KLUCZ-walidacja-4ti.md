# Klucz — „Szprycha, wersja do naprawy”

**Witryny i aplikacje internetowe · klasa 4TI · temat „Walidacja poprawności kodu HTML i CSS (W3C) oraz testowanie w przeglądarkach”**

Ten plik leży w `narzedzia/`, czyli **poza `docs/`** — nie trafia na GitHub Pages i uczeń go nie zobaczy.

Wygenerowany silnikiem **Nu Html Checker 26.9.16 (e63d468)** — tym samym, który stoi za `validator.w3.org`. Jeżeli serwis W3C zdąży się zaktualizować, liczby mogą drgnąć o jeden; lista usterek zostaje ta sama. Klucz odtwarza `narzedzia/gen_klucz.py`.

Źródło paczki leży w `narzedzia/paczka/`. Po zmianie w niej przepakuj archiwum poleceniem `cd narzedzia/paczka && zip -r ../../docs/pliki/walidacja-start.zip .` i uruchom ten skrypt jeszcze raz.

## `index.html` — 9 błędów, 5 ostrzeżeń

| Wiersz | Rodzaj | Komunikat walidatora | O czym to uczy |
| ---: | --- | --- | --- |
| 15 | błąd | Text not allowed in element “ul” in this context. | w liście mogą stać wyłącznie elementy li — tekst „Menu:” trzeba przenieść do nagłówka albo do atrybutu aria-label |
| 26 | błąd | End tag “b” violates nesting rules. | znaczniki muszą się zamykać w odwrotnej kolejności niż otwierały; <b><i></b></i> to klasyka |
| 26 | błąd | No “i” element in scope but a “i” end tag seen. | drugi komunikat tego samego błędu — jedna poprawka gasi oba; dobry moment, żeby pokazać, że liczba komunikatów to nie liczba usterek |
| 27 | błąd | An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images. | brak opisu alternatywnego; to jednocześnie błąd walidacji i bariera dostępności — wraca w części o WAVE |
| 57 | błąd | The “center” element is obsolete. Use CSS instead. | element wycofany z HTML5; wygląd należy do CSS, nie do znaczników |
| 72 | błąd | Duplicate ID “kontakt”. | identyfikator musi być unikalny w całym dokumencie — inaczej odnośnik kotwicowy i skrypty trafiają zawsze w pierwszy |
| 86 | błąd | End tag for  “body” seen, but there were unclosed elements. | niezamknięty element footer; przeglądarka domyka po cichu, walidator nie |
| 84 | błąd | Unclosed element “footer”. | drugi komunikat tej samej usterki co wyżej |
| 31 | błąd | The heading “h3” (with computed level 3) follows the heading “h1” (with computed level 1), skipping 1 heading level. | przeskok poziomów nagłówków — h1 potem h3; struktura dokumentu ma być ciągła |
| 32 | ostrzeżenie | The “border” attribute on the “table” element is obsolete. Consider specifying “img { border: 0; }” in CSS instead. | OSTRZEŻENIE, nie błąd — strona przejdzie walidację z tym atrybutem. Usunąć i tak, bo wygląd należy do CSS. Dobry przykład ostrzeżenia, które warto potraktować poważnie. |
| 56 | ostrzeżenie | Section lacks heading. Consider using “h2”-“h6” elements to add identifying headings to all sections, or else use a “div” element instead for any cases where no heading is needed. | OSTRZEŻENIE. Dwa wystąpienia. Poprawne rozwiązanie to albo dodać nagłówek, albo zamienić section na div — obie odpowiedzi uznajemy, jeśli uczeń uzasadni wybór. |
| 62 | ostrzeżenie | The first occurrence of ID “kontakt” was here. | OSTRZEŻENIE towarzyszące błędowi o powtórzonym identyfikatorze — samo z siebie nie jest usterką, tylko wskazaniem drugiego miejsca. |
| 78 | ostrzeżenie | Section lacks heading. Consider using “h2”-“h6” elements to add identifying headings to all sections, or else use a “div” element instead for any cases where no heading is needed. | OSTRZEŻENIE. Dwa wystąpienia. Poprawne rozwiązanie to albo dodać nagłówek, albo zamienić section na div — obie odpowiedzi uznajemy, jeśli uczeń uzasadni wybór. |
| 2 | ostrzeżenie | Consider adding a “lang” attribute to the “html” start tag to declare the language of this document. | OSTRZEŻENIE, ale traktujemy je jak błąd: bez lang="pl" czytnik ekranu przeczyta polski tekst po angielsku. Na egzaminie zawodowym to punkt. |

## `kontakt.html` — 6 błędów, 0 ostrzeżeń

| Wiersz | Rodzaj | Komunikat walidatora | O czym to uczy |
| ---: | --- | --- | --- |
| 16 | błąd | Duplicate attribute “href”. | ten sam atrybut podany dwa razy; przeglądarka bierze pierwszy, co bywa źródłem „odnośnik prowadzi nie tam, gdzie napisałem” |
| 25 | błąd | The “font” element is obsolete. Use CSS instead. | element wycofany, jak center |
| 34 | błąd | Start tag “a” seen but an element of the same type was already open. | odnośnik w odnośniku — niedozwolone zagnieżdżenie |
| 34 | błąd | Stray end tag “a”. | skutek tego samego zagnieżdżenia |
| 35 | błąd | Element “img” is missing one or more of the following attributes: “src”, “srcset”. | obrazek bez źródła; uczeń zwykle widzi najpierw pustą ramkę, a dopiero walidator mówi dlaczego |
| 36 | błąd | Stray end tag “span”. | znacznik zamykający bez otwierającego |

## `uslugi.html` — 0 błędów, 0 ostrzeżeń

Plik jest poprawny. **To jest ta strona, której uczeń ma nie poprawiać** — jeżeli zgłasza w niej usterki, walidował zły plik albo poprawiał na oko.

**Razem w trzech plikach HTML: 15 błędów i 5 ostrzeżeń.**

## `css/style.css` — 7 usterek

Walidatora CSS W3C (`jigsaw.w3.org`) nie da się uruchomić lokalnie, więc arkusz sprawdzony jest parserem `css-tree` zgodnym ze specyfikacją. Serwis W3C może pogrupować komunikaty inaczej — **oceniaj listę usterek, nie ich liczbę**.

| Wiersz | Co jest nie tak |
| ---: | --- |
| 19 | colour zamiast color — literówka w nazwie właściwości; deklaracja jest po cichu pomijana, a tekst zostaje w kolorze domyślnym |
| 28 | padding: 16 24px — pierwsza wartość bez jednostki; cała deklaracja odpada, przez co pasek nagłówka traci wewnętrzne marginesy |
| 34 | brak średnika po font-size: 24px — następna deklaracja (font-weight) zostaje wciągnięta do wartości i przepadają obie; logo jest małe i nie jest pogrubione |
| 35 | skutek braku średnika po font-size — parser gubi się w tym miejscu i zgłasza to jako osobną usterkę |
| 48 | color: #fffff — pięć znaków zamiast trzech albo sześciu; odnośniki w nawigacji zostają domyślnie niebieskie zamiast białych |
| 91 | text-align: centre — pisownia brytyjska; CSS zna tylko center, przez co tabela cennika jest wyrównana do lewej |
| 153 | brak zamykającego nawiasu klamrowego bloku `@media` na końcu pliku — reguły responsywne działają, ale plik jest niepoprawny |

## Czego nie ma w paczce, a warto przy okazji pokazać

- **Brak `<meta name="viewport">` w `index.html` i `kontakt.html`.** Walidator tego nie zgłasza, a strona na telefonie wygląda źle. `uslugi.html` ten znacznik ma — dobre porównanie w trybie responsywnym.
- **Odnośnik „Regulamin” prowadzi do `#`.** Poprawny HTML, bezużyteczny link — to znajduje testowanie, nie walidacja.
- **Pola formularza nie mają etykiet `<label>`.** Zero błędów W3C, komplet błędów w WAVE. To jest sedno rozróżnienia walidacja ≠ dostępność.
- **Za niski kontrast cytatów w sekcji „Opinie”.** Szary `#a8b0bd` na tle `#f6f7f9` to **2,04 : 1** przy wymaganych 4,5 : 1. Walidator CSS tego nie zgłasza, bo zapis jest poprawny — znajduje to dopiero WAVE albo ręczne sprawdzenie kontrastu. Żółty `#fca311` na granacie `#14213d` daje 7,90 : 1 i jest w porządku; ćwiczenie 5 każe podać obie liczby.
- **Przeskok nagłówków h1 → h3** w `index.html` walidator jednak zgłasza — warto pokazać, że granica między „poprawność” a „dostępność” nie jest ostra.

