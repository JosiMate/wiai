# Publikacja stron www — klienci FTP i serwery hostingowe

!!! abstract "O tym temacie"

    **3 godziny lekcyjne** · Dział II. Tworzenie i publikowanie witryn internetowych
    · efekt kształcenia **INF.03.3.8**

    Witryna, którą zbudowałeś i poprawiłeś na poprzednich zajęciach, leży na
    dysku w pracowni. Dla klienta to znaczy tyle, co nic. Dziś kończysz ten
    dział tak, jak kończy się prawdziwe zlecenie: **strona trafia na serwer
    i dostaje adres**, pod który można wysłać komukolwiek.

    Po drodze dowiesz się, dlaczego przeglądarka od kilku lat nie otwiera już
    adresów `ftp://`, czym różni się hosting od domeny i dlaczego dobry
    webmaster po wgraniu plików **sprawdza stronę jeszcze raz** — na serwerze,
    a nie na swoim dysku.

!!! success "Cele lekcji"

    Po tych zajęciach potrafisz:

    1. wyjaśnić, czym jest hosting, czym domena, i dlaczego kupuje się je osobno
    2. wskazać etapy publikacji witryny i wykonać je w kolejności
    3. rozróżnić FTP, FTPS i SFTP — podać porty, wskazać, co jest szyfrowane, i uzasadnić, którego używasz
    4. skonfigurować klienta FTP z gotowych danych dostępowych i wgrać witrynę na serwer
    5. opisać funkcje klienta: kolejka, tryb pasywny, synchronizacja, uprawnienia plików
    6. dobrać rodzaj hostingu i pakiet serwerowy do potrzeb klienta
    7. skierować domenę na serwer, ustawiając rekord DNS, i wyjaśnić, dlaczego zmiana nie działa natychmiast
    8. sprawdzić poprawność witryny **po** opublikowaniu i znaleźć przyczynę typowych usterek
    9. opublikować witrynę bez klienta FTP i porównać oba sposoby

---

## 1. Hosting i domena to dwie różne rzeczy

Nowy uczeń prawie zawsze myli te pojęcia, a na egzaminie to kosztuje punkt.

| | **Hosting** | **Domena** |
| --- | --- | --- |
| czym jest | miejsce na serwerze, gdzie leżą pliki witryny | nazwa, pod którą użytkownik ją znajduje |
| porównanie | lokal | szyld z adresem nad drzwiami |
| co kupujesz | przestrzeń dyskową, transfer, usługi serwera | **prawo do używania nazwy** przez określony czas |
| bez tego drugiego | strona działa, ale pod brzydkim adresem technicznym | nazwa nie prowadzi donikąd |

Kupuje się je osobno, bo to osobne usługi — często nawet od różnych firm.
Domeny **nie kupuje się na własność**: rejestruje się ją na okres, zwykle rok,
i przedłuża. Niezapłacona faktura oznacza, że nazwa po pewnym czasie wraca do
puli i może ją zarejestrować ktoś inny.

!!! info "Kto w Polsce prowadzi rejestr domen `.pl`"

    Rejestrem krajowej domeny `.pl` zarządza **NASK**. Domeny **nie rejestruje
    się bezpośrednio w NASK** — robi się to przez **rejestratora**, czyli firmę,
    która ma z NASK podpisaną umowę. To u rejestratora płacisz, przedłużasz
    i zmieniasz ustawienia.

    Nazwa może zawierać litery alfabetu łacińskiego, cyfry i łączniki, a jej
    długość to najwyżej 63 znaki bez końcówki.

## 2. Etapy publikacji

Kolejność nie jest dowolna. Każdy krok zakłada, że poprzedni się udał.

| Etap | Co robisz | Czego dowodzi |
| --- | --- | --- |
| 1. Przygotowanie plików | walidacja, testy, poprawne nazwy plików, strona główna nazwana `index.html` | że publikujesz coś działającego |
| 2. Wybór hostingu | dobór pakietu do potrzeb: miejsce, transfer, PHP, bazy, poczta | że nie przepłacasz i nie zabraknie zasobów |
| 3. Rejestracja domeny | wybór nazwy i rejestratora | że strona ma adres do zapamiętania |
| 4. Dane dostępowe | host, użytkownik, hasło, port, protokół | że wiesz, dokąd i czym się łączysz |
| 5. Wgranie plików | klient FTP/SFTP albo menedżer plików w panelu | że pliki są na serwerze |
| 6. Skierowanie domeny | rekordy DNS u rejestratora | że nazwa prowadzi na twój serwer |
| 7. Certyfikat HTTPS | włączenie certyfikatu w panelu hostingu | że połączenie jest szyfrowane |
| 8. **Sprawdzenie po publikacji** | otwarcie witryny z zewnątrz, na innym urządzeniu | że działa **u odbiorcy**, a nie u ciebie |

!!! quote "Zasada, którą warto zapamiętać"

    Publikacja kończy się nie wtedy, gdy klient FTP napisze „transfer
    zakończony”, tylko wtedy, gdy **otworzysz stronę z telefonu, w sieci
    komórkowej, i wszystko na niej działa**. Do tego momentu sprawdzasz własny
    dysk, a nie cudzy serwer.

## 3. FTP, FTPS, SFTP

**FTP** — *File Transfer Protocol* — powstał w czasach, gdy sieć była mała
i zaufana. Przesyła wszystko **otwartym tekstem**: nazwę użytkownika, hasło
i zawartość plików. Kto podsłucha ruch, dostaje komplet.

| | **FTP** | **FTPS** | **SFTP** |
| --- | --- | --- | --- |
| pełna nazwa | File Transfer Protocol | FTP Secure (FTP + TLS) | SSH File Transfer Protocol |
| port | **21** (dane: 20 w trybie aktywnym) | 21 z `AUTH TLS` albo 990 | **22** |
| co szyfruje | **nic** | logowanie i dane, szyfrem TLS | całą sesję, w tunelu SSH |
| na czym oparty | własny protokół | ten sam FTP + warstwa TLS | zupełnie inny protokół, część SSH |
| logowanie kluczem | nie | nie | **tak** — zamiast hasła |
| kiedy używasz | nigdy, jeśli masz wybór | gdy hosting nie daje SFTP | **domyślnie** |

!!! danger "Dlaczego przeglądarki przestały otwierać `ftp://`"

    Firefox wyłączył obsługę FTP domyślnie w wersji 88 i **usunął ją całkowicie
    w wersji 90** (2021 r.); Chrome zrobił to samo w wersji 95. Powody podane
    przez Mozillę:

    - FTP przesyła dane otwartym tekstem, więc da się je **podejrzeć, podmienić i sfałszować**;
    - serwery FTP bywały wykorzystywane do rozsyłania złośliwego oprogramowania;
    - protokół nie współpracuje z mechanizmami bezpieczeństwa współczesnej sieci — HTTPS, HSTS ani trybem „tylko HTTPS”.

    Wniosek dla ciebie: jeżeli hosting oferuje SFTP albo FTPS, a ty łączysz się
    zwykłym FTP, robisz błąd — i to taki, który na egzaminie zostanie wytknięty.

### Tryb aktywny i pasywny

To klasyczne pytanie egzaminacyjne. Chodzi o to, **kto do kogo dzwoni**, gdy
trzeba przesłać dane.

| Tryb | Kto nawiązuje połączenie dla danych | Skutek |
| --- | --- | --- |
| **aktywny** | **serwer** łączy się z powrotem do klienta | zapora i NAT po stronie klienta zwykle to blokują |
| **pasywny** | **klient** otwiera oba połączenia — sterujące i danych | działa przez zaporę i NAT; ustawienie domyślne |

W praktyce: jeżeli klient FTP łączy się, pokazuje listę katalogów i **zawiesza
się przy transferze** — prawie na pewno pracuje w trybie aktywnym. Przełączenie
na pasywny rozwiązuje sprawę.

## 4. Klient FTP w praktyce

Klient to program, który zamienia przesyłanie plików w przeciąganie ikon.
Najczęściej spotkasz:

| Program | Uwagi |
| --- | --- |
| **FileZilla** | najpopularniejszy, wieloplatformowy, dwa panele obok siebie |
| **WinSCP** | Windows; SFTP i FTPS, wygodna synchronizacja katalogów |
| **Total Commander** | FTP wbudowany w menedżera plików |
| **Cyberduck** | macOS i Windows |
| menedżer plików w panelu hostingu | działa w przeglądarce, bez instalacji — dobry do jednej poprawki |

### Dane dostępowe

Hosting podaje je po założeniu konta. Zawsze te same pięć pozycji:

```text
Host (serwer):     ftp.szprycha-4ti.pl   albo   s12.hostingodawca.pl
Użytkownik:        szprycha_ftp
Hasło:             (z panelu hostingu)
Port:              22 dla SFTP · 21 dla FTP/FTPS
Protokół:          SFTP — SSH File Transfer Protocol
```

!!! warning "Hasła do FTP nie zapisuj w kliencie na komputerze w pracowni"

    FileZilla domyślnie przechowuje hasła **w postaci jawnej** w pliku
    konfiguracyjnym. Na komputerze wspólnym oznacza to, że następna osoba
    otworzy program i zobaczy twoje konto. W pracowni wybieraj opcję pytania
    o hasło przy każdym połączeniu, a po lekcji **usuń wpis z menedżera
    połączeń**.

### Gdzie wgrywasz pliki

Po zalogowaniu nie jesteś w katalogu strony — jesteś **wyżej**. Katalog,
z którego serwer publikuje witrynę, nazywa się różnie u różnych dostawców:

| Nazwa katalogu | Gdzie spotykana |
| --- | --- |
| `public_html` | najczęściej, panele cPanel i DirectAdmin |
| `www` | część polskich hostingów |
| `htdocs` | serwery Apache, XAMPP |
| `httpdocs` | panel Plesk |

**Pliki witryny wgrywasz do środka tego katalogu, a nie obok niego.** Strona
główna musi się nazywać `index.html` — serwer szuka właśnie tej nazwy, gdy ktoś
wpisze sam adres domeny.

!!! danger "Trzy pomyłki, przez które strona „nie działa” po wgraniu"

    | Objaw | Przyczyna |
    | --- | --- |
    | zamiast strony widać listę plików | brak `index.html` w katalogu — albo plik nazwany `Index.html`, `index.HTML`, `strona.html` |
    | strona jest, ale bez stylów i obrazków | wgrano same pliki `.html`, bez katalogów `css/` i `obrazy/` — albo ścieżki w kodzie są bezwzględne, z dysku `C:` |
    | strona wgrała się „obok” | pliki trafiły do katalogu domowego zamiast do `public_html` |

    Wszystkie trzy wykrywa jedno spojrzenie na serwer po transferze.
    Dlatego etap 8 z sekcji 2 nie jest formalnością.

### Funkcje, które warto znać

| Funkcja | Do czego służy |
| --- | --- |
| **kolejka transferu** | lista plików czekających na wysłanie; widać postęp i błędy |
| **wznawianie transferu** | po zerwaniu połączenia dociąga plik od miejsca przerwania |
| **synchronizacja katalogów** | porównuje dysk z serwerem i wysyła tylko to, co się zmieniło |
| **porównanie katalogów** | podświetla pliki różniące się rozmiarem albo datą |
| **edycja pliku na serwerze** | otwiera plik w edytorze i po zapisaniu odsyła go z powrotem |
| **zmiana uprawnień (CHMOD)** | ustawia, kto może plik czytać i uruchamiać |
| **tryb transferu** | binarny albo tekstowy — dziś zostaw automatyczny |

!!! info "Uprawnienia na serwerze: 644 i 755"

    Na serwerze uniksowym obowiązuje ten sam zapis, który znasz z lekcji
    o Linuksie:

    | Wartość | Dla czego | Znaczenie |
    | --- | --- | --- |
    | `644` | pliki: `.html`, `.css`, `.jpg` | właściciel czyta i zapisuje, reszta tylko czyta |
    | `755` | katalogi i skrypty | dodatkowo prawo wejścia do katalogu i uruchomienia |

    Ustawienie plikowi `777` „żeby wreszcie zadziałało” jest klasycznym błędem
    początkującego: daje **każdemu** prawo zapisu. Tak się nie robi.

## 5. Rodzaje hostingu

Pakiet dobiera się do potrzeb klienta, a nie do tego, który brzmi
najpoważniej.

| Rodzaj | Na czym polega | Dla kogo | Koszt |
| --- | --- | --- | --- |
| **współdzielony** | wiele witryn na jednym serwerze, wspólne zasoby | wizytówka, mała firma, strona szkoły | najniższy |
| **VPS** | wydzielona maszyna wirtualna, własny system i konfiguracja | sklep, aplikacja, większy ruch | średni |
| **dedykowany** | cały fizyczny serwer tylko dla ciebie | duży serwis, wymagania wydajnościowe | wysoki |
| **chmurowy** | zasoby skalowane w miarę potrzeb, płatność za zużycie | ruch nieprzewidywalny, kampanie | zmienny |
| **statyczny** | serwer oddaje gotowe pliki, bez PHP i bazy | witryny bez części serwerowej — takie jak twoja | często bezpłatny |

### Co porównujesz, wybierając pakiet

| Parametr | O co pytać |
| --- | --- |
| przestrzeń dyskowa | ile miejsca na pliki i bazy |
| transfer | limit przesłanych danych miesięcznie — albo jego brak |
| obsługa PHP i baz | czy strona ma część serwerową; która wersja PHP |
| liczba domen i kont e-mail | ile witryn i skrzynek obsłuży pakiet |
| certyfikat SSL | czy jest w cenie (dziś powinien być) |
| kopie zapasowe | czy są, jak często, jak długo przechowywane |
| gwarancja dostępności | ile procent czasu serwer ma działać |
| wsparcie techniczne | w jakich godzinach i w jakim języku |

!!! tip "Dobór na egzaminie — jak uzasadnić wybór"

    Nie wystarczy napisać „hosting współdzielony”. Uzasadnienie ma wiązać
    **potrzebę** z **parametrem**:

    > Witryna jest statyczna, bez bazy danych, a ruch szacowany na kilkaset
    > odwiedzin miesięcznie. Wystarczy hosting współdzielony z 1 GB przestrzeni,
    > obsługą jednej domeny i certyfikatem SSL w cenie. VPS byłby zbędnym
    > kosztem i wymagałby administrowania serwerem.

## 6. Skierowanie domeny na serwer

Zarejestrowana domena jeszcze nic nie robi. Trzeba **powiedzieć systemowi nazw
domenowych**, gdzie szukać serwera. Robi się to rekordami DNS w panelu
rejestratora.

| Rekord | Co wskazuje | Przykład zastosowania |
| --- | --- | --- |
| **A** | adres IPv4 serwera | `szprycha.pl` → `192.0.2.10` |
| **AAAA** | adres IPv6 serwera | to samo, po IPv6 |
| **CNAME** | inną nazwę, pod którą ma szukać | `www.szprycha.pl` → `szprycha.pl` |
| **MX** | serwer poczty dla domeny | żeby działał adres `kontakt@szprycha.pl` |
| **NS** | serwery nazw obsługujące domenę | przeniesienie domeny do innego dostawcy |
| **TXT** | dowolny tekst | potwierdzenie własności domeny, zabezpieczenia poczty |

Drugi sposób — częstszy przy przenosinach — to zmiana **serwerów nazw (NS)** na
te wskazane przez hostingodawcę. Wtedy całą strefą zarządzasz w panelu
hostingu, a nie u rejestratora.

!!! warning "Dlaczego zmiana nie działa od razu"

    Każdy rekord DNS ma **TTL** — czas, przez który wolno przechowywać go
    w pamięci podręcznej. Dopóki nie minie, serwery na świecie podają starą
    odpowiedź. Dlatego po zmianie strona potrafi u ciebie działać, a u kolegi
    jeszcze nie.

    Praktyczny wniosek: **planowaną zmianę poprzedza się obniżeniem TTL**
    — na dzień przed ustawia się niską wartość, zmienia rekord, a po
    potwierdzeniu wraca do poprzedniej. Nie ma na to magicznego przyspieszenia;
    `ipconfig /flushdns` czyści tylko twój komputer.

## 7. HTTPS to dziś minimum

Certyfikat TLS przestał być dodatkiem dla sklepów. Przeglądarka oznacza stronę
bez HTTPS jako niezabezpieczoną, a wyszukiwarki traktują szyfrowanie jako jeden
z czynników oceny.

Na typowym hostingu włączenie certyfikatu to dziś **jedno kliknięcie w panelu**
— dostawcy korzystają z bezpłatnych certyfikatów odnawianych automatycznie.
Po włączeniu zostają jeszcze dwie rzeczy:

1. **przekierowanie** ruchu z `http://` na `https://`, żeby nikt nie wszedł starym adresem;
2. sprawdzenie, czy strona nie ładuje obrazków ani stylów po `http://` — inaczej przeglądarka zgłosi **mieszaną treść** i kłódka zniknie.

## 8. Publikacja bez klienta FTP

Wgrywanie plików ręcznie ma wady, które widać dopiero przy dziesiątej poprawce:
łatwo wysłać nie ten plik, łatwo zapomnieć o jednym, i nie ma jak **cofnąć**
zmiany.

Alternatywa: trzymasz witrynę w **repozytorium**, a serwis hostingowy sam
pobiera z niego pliki po każdym zapisaniu zmian. Tak działają **GitHub Pages**,
**Netlify** i **Cloudflare Pages** — dla witryn statycznych bezpłatnie,
z certyfikatem HTTPS w komplecie.

| | **Klient FTP** | **Publikacja z repozytorium** |
| --- | --- | --- |
| co wysyłasz | pliki, ręcznie wskazane | zapisaną zmianę — resztę robi serwis |
| ryzyko pomyłki | wysoka: nie ten plik, nie ten katalog | niska: publikuje się dokładnie to, co w repozytorium |
| cofnięcie zmiany | tylko z własnej kopii, jeśli ją masz | powrót do poprzedniej wersji, jednym poleceniem |
| historia zmian | brak | pełna, z datą i opisem każdej zmiany |
| praca zespołowa | konflikt przy dwóch osobach naraz | narzędzie zbudowane do pracy w zespole |
| część serwerowa (PHP, baza) | tak | nie — tylko strony statyczne |

!!! info "Ta strona, którą właśnie czytasz"

    Materiały twojego przedmiotu są publikowane dokładnie w ten sposób: leżą
    w repozytorium, a po zapisaniu zmiany serwis sam buduje witrynę i wystawia
    ją pod adresem. Żaden plik nie jest wgrywany ręcznie.

    Zautomatyzowanie publikacji własnej witryny jest treścią **zadania na ocenę
    celującą B** z tego działu.

## 9. Lista kontrolna po publikacji

Przejdź ją w tej kolejności — każdy punkt wyklucza jedną przyczynę usterki.

| # | Sprawdzasz | Jak |
| --- | --- | --- |
| 1 | strona otwiera się pod adresem domeny | wpisz adres w przeglądarce |
| 2 | otwiera się **z zewnątrz**, nie tylko w szkole | telefon w sieci komórkowej, Wi-Fi wyłączone |
| 3 | działa też z `www` i bez | oba adresy mają prowadzić w to samo miejsce |
| 4 | jest kłódka i adres `https://` | kliknij kłódkę, sprawdź domenę certyfikatu |
| 5 | wszystkie podstrony się otwierają | przejdź menu punkt po punkcie |
| 6 | obrazki i style się wczytały | wygląd zgodny z wersją lokalną |
| 7 | konsola nie zgłasza błędów 404 | ++f12++ → **Console** i **Network** |
| 8 | układ działa na wąskim ekranie | tryb responsywny w narzędziach deweloperskich |
| 9 | walidator nadal czysty — **po adresie**, nie z pliku | `validator.w3.org`, opcja „Validate by URI” |

!!! tip "Błąd 404 w konsoli to najczęściej wielkość liter"

    Windows nie odróżnia `Logo.png` od `logo.png`. Serwer uniksowy odróżnia.
    Strona, która działała na twoim dysku, po wgraniu gubi połowę obrazków —
    i to jest ta przyczyna w zdecydowanej większości przypadków.

---

## Ćwiczenia

Publikujesz **swoją witrynę Szprycha** — tę poprawioną na poprzedniej lekcji.
Dane dostępowe do serwera szkolnego poda nauczyciel.

### :material-console: Ćwiczenie 1 — konfiguracja klienta

Zainstaluj albo uruchom klienta FTP i utwórz połączenie z danych, które
dostałeś. Zapisz w karcie pracy: nazwę hosta, użytkownika, **port**, **wybrany
protokół** i tryb (aktywny czy pasywny).

Hasła **nie zapisuj w programie** — zaznacz pytanie przy każdym połączeniu.
Zrób zrzut okna menedżera połączeń **bez widocznego hasła**.
**Wynik — zadanie 1.**

### :material-console: Ćwiczenie 2 — wgranie witryny

Odszukaj na serwerze katalog publikacji i zapisz jego nazwę. Wgraj całą witrynę:
pliki `.html` **razem z katalogami** `css/` i obrazami.

Po transferze porównaj listę plików na dysku z listą na serwerze — użyj funkcji
porównania katalogów, jeśli klient ją ma. Zapisz liczbę wgranych plików
i rozmiar całości. **Wynik — zadanie 2.**

### :material-console: Ćwiczenie 3 — pierwsze otwarcie i usterki

Otwórz witrynę pod adresem, który podał nauczyciel. Przejdź listę kontrolną
z sekcji 9, punkt po punkcie, i zapisz wynik każdego punktu.

Jeżeli coś nie działa — **nie poprawiaj od razu**. Najpierw zapisz objaw
i swoją hipotezę, potem popraw, potem sprawdź ponownie. Tej kolejności wymaga
się w dokumentacji zawodowej. **Wynik — zadanie 3.**

### :material-console: Ćwiczenie 4 — dobór hostingu dla klienta

Klient prowadzi warsztat rowerowy. Chce witrynę-wizytówkę: pięć podstron,
galeria, formularz kontaktowy wysyłający wiadomość na adres w jego domenie.
Spodziewa się kilkuset odwiedzin miesięcznie.

Znajdź w internecie **dwie** oferty hostingu, zestaw ich parametry
w tabeli i wybierz jedną. Uzasadnienie ma wiązać potrzebę klienta
z konkretnym parametrem pakietu — wzór masz w sekcji 5.
**Wynik — zadanie 4.**

### :material-console: Ćwiczenie 5 — domena i DNS

Dla domeny `szprycha-<numer w dzienniku>.pl` zapisz, **jakie rekordy**
trzeba ustawić, żeby:

1. sama domena prowadziła na serwer o adresie `192.0.2.10`;
2. adres z `www` prowadził tam, gdzie domena bez `www`;
3. poczta pod adresem `kontakt@` trafiała na serwer `mail.hostingodawca.pl`.

Podaj typ rekordu, nazwę i wartość każdego z nich. Następnie wyjaśnij, dlaczego
po zapisaniu zmian kolega z innej sieci może przez jakiś czas widzieć starą
stronę. **Wynik — zadanie 5.**

### :material-console: Ćwiczenie 6 — publikacja bez FTP

Opublikuj tę samą witrynę drugim sposobem — z repozytorium, na hostingu
statycznym. Zapisz adres, pod którym działa.

Następnie wprowadź **jedną widoczną zmianę** (na przykład popraw tekst
w stopce) i opublikuj ją ponownie. Zmierz czas od zapisania zmiany do jej
pojawienia się na żywo i porównaj z czasem, jakiego wymagałoby wgranie tego
samego pliku klientem FTP. **Wynik i porównanie — zadanie 6.**

---

## Sprawdź się

<div class="quiz" markdown="0">
<script type="application/json">
[
  {
    "pytanie": "Czym różni się hosting od domeny?",
    "typ": "jedna",
    "opcje": [
      "To dwie nazwy tej samej usługi",
      "Hosting to miejsce na serwerze, gdzie leżą pliki; domena to nazwa, pod którą użytkownik znajduje witrynę",
      "Hosting to nazwa strony, a domena to serwer",
      "Domena jest potrzebna tylko sklepom internetowym"
    ],
    "poprawna": 1,
    "wyjasnienie": "Hosting jest lokalem, domena szyldem nad drzwiami. Kupuje się je osobno i często od różnych firm."
  },
  {
    "pytanie": "Na którym porcie domyślnie pracuje SFTP?",
    "typ": "jedna",
    "opcje": ["21", "22", "80", "990"],
    "poprawna": 1,
    "wyjasnienie": "SFTP działa w tunelu SSH, a SSH nasłuchuje na porcie 22. Port 21 to FTP i FTPS z AUTH TLS, a 990 to FTPS w trybie niejawnym."
  },
  {
    "pytanie": "Który protokół nie szyfruje niczego — ani hasła, ani przesyłanych plików?",
    "typ": "jedna",
    "opcje": ["SFTP", "FTPS", "FTP", "HTTPS"],
    "poprawna": 2,
    "wyjasnienie": "Zwykły FTP przesyła wszystko otwartym tekstem. To dlatego przeglądarki usunęły jego obsługę, a hostingi oferują FTPS albo SFTP."
  },
  {
    "pytanie": "Klient FTP łączy się i pokazuje listę katalogów, ale zawiesza się przy transferze pliku. Co sprawdzasz najpierw?",
    "typ": "jedna",
    "opcje": [
      "Czy połączenie działa w trybie pasywnym",
      "Czy hasło jest poprawne",
      "Czy plik nie jest za duży",
      "Czy domena ma rekord A"
    ],
    "poprawna": 0,
    "wyjasnienie": "W trybie aktywnym to serwer łączy się z powrotem do klienta, a zapora i NAT zwykle to blokują. Lista katalogów idzie połączeniem sterującym, więc widać ją mimo problemu."
  },
  {
    "pytanie": "Po wgraniu plików pod adresem domeny widać listę plików zamiast strony. Najbardziej prawdopodobna przyczyna?",
    "typ": "jedna",
    "opcje": [
      "Brak certyfikatu SSL",
      "Zły rekord MX",
      "Serwer pracuje w trybie aktywnym",
      "W katalogu publikacji nie ma pliku index.html albo nazwano go inaczej"
    ],
    "poprawna": 3,
    "wyjasnienie": "Serwer szuka pliku o nazwie index.html. Gdy go nie znajdzie, a ma włączone wyświetlanie zawartości katalogu, pokazuje listę plików."
  },
  {
    "pytanie": "Który rekord DNS kieruje samą domenę na adres IPv4 serwera?",
    "typ": "jedna",
    "opcje": ["CNAME", "MX", "A", "TXT"],
    "poprawna": 2,
    "wyjasnienie": "Rekord A wskazuje adres IPv4, AAAA — adres IPv6. CNAME wskazuje inną nazwę, MX serwer poczty, a TXT przechowuje dowolny tekst."
  },
  {
    "pytanie": "Zmieniłeś rekord A, ale kolega z innej sieci wciąż widzi starą stronę. Dlaczego?",
    "typ": "jedna",
    "opcje": [
      "Bo nie wgrałeś plików klientem SFTP",
      "Bo stara odpowiedź siedzi jeszcze w pamięci podręcznej serwerów DNS, dopóki nie minie TTL",
      "Bo domena wygasła",
      "Bo brakuje rekordu CNAME dla www"
    ],
    "poprawna": 1,
    "wyjasnienie": "TTL określa, jak długo wolno przechowywać rekord w pamięci podręcznej. Dlatego planowaną zmianę poprzedza się obniżeniem TTL, a nie czyszczeniem pamięci u siebie."
  },
  {
    "pytanie": "Strona działała na twoim komputerze, a po wgraniu na serwer zniknęła połowa obrazków. Co sprawdzasz w pierwszej kolejności?",
    "typ": "jedna",
    "opcje": [
      "Wielkość liter w nazwach plików — serwer uniksowy odróżnia Logo.png od logo.png",
      "Czy hosting obsługuje PHP",
      "Czy domena ma rekord AAAA",
      "Czy przeglądarka ma włączony JavaScript"
    ],
    "poprawna": 0,
    "wyjasnienie": "Windows nie rozróżnia wielkości liter w nazwach plików, a serwer uniksowy tak. To najczęstsza przyczyna błędów 404 widocznych w zakładce Network."
  },
  {
    "pytanie": "Jakie uprawnienia ustawia się zwykle plikom HTML i CSS na serwerze?",
    "typ": "jedna",
    "opcje": ["777", "000", "644", "600"],
    "poprawna": 2,
    "wyjasnienie": "644 oznacza: właściciel czyta i zapisuje, pozostali tylko czytają. Katalogi dostają 755, bo potrzebne jest prawo wejścia. 777 daje każdemu prawo zapisu i jest błędem."
  },
  {
    "pytanie": "Klient chce witrynę-wizytówkę bez bazy danych, z ruchem kilkuset odwiedzin miesięcznie. Co proponujesz?",
    "typ": "jedna",
    "opcje": [
      "Serwer dedykowany, bo daje największą wydajność",
      "Hosting współdzielony albo statyczny — zasoby w zupełności wystarczą, a VPS byłby zbędnym kosztem i pracą",
      "VPS, bo wygląda profesjonalnie",
      "Hosting chmurowy z płatnością za zużycie"
    ],
    "poprawna": 1,
    "wyjasnienie": "Pakiet dobiera się do potrzeb. Dla strony statycznej o małym ruchu droższe rozwiązania nie dają korzyści, a VPS wymaga jeszcze administrowania serwerem."
  },
  {
    "pytanie": "Jaka jest główna przewaga publikacji z repozytorium nad wgrywaniem plików klientem FTP?",
    "typ": "jedna",
    "opcje": [
      "Działa również dla stron w PHP z bazą danych",
      "Nie wymaga w ogóle dostępu do internetu",
      "Jest jedynym sposobem uzyskania certyfikatu HTTPS",
      "Publikuje się dokładnie zawartość repozytorium, jest historia zmian i da się wrócić do poprzedniej wersji"
    ],
    "poprawna": 3,
    "wyjasnienie": "Ręczne wgrywanie nie daje historii ani możliwości cofnięcia. Ograniczeniem hostingu statycznego jest natomiast brak części serwerowej — PHP i bazy tam nie działają."
  },
  {
    "pytanie": "Kiedy uznajesz publikację za zakończoną?",
    "typ": "jedna",
    "opcje": [
      "Gdy klient FTP wyświetli komunikat o zakończeniu transferu",
      "Gdy strona otworzy się poprawnie z zewnątrz, na innym urządzeniu i w innej sieci",
      "Gdy pliki znajdą się w katalogu domowym konta",
      "Gdy domena zostanie zarejestrowana"
    ],
    "poprawna": 1,
    "wyjasnienie": "Do tego momentu sprawdzasz własny dysk i własną sieć. Dopiero otwarcie strony z telefonu w sieci komórkowej dowodzi, że działa u odbiorcy."
  }
]
</script>
</div>

---

## Karta pracy

Z tego tematu oddajesz **kartę pracy** oraz **adres opublikowanej witryny**.
Kartę wypełniaj w trakcie ćwiczeń — pyta o komunikaty i pomiary, których po
poprawieniu konfiguracji już nie odtworzysz.

<div class="kp-podsumowanie" data-karta="publikacja-ftp-hosting"></div>

<span id="karta" class="kp-kotwica"></span>

???+ karta "Rozwiń kartę pracy"

    !!! info "Twoje odpowiedzi zostają na twoim komputerze"

        Formularz niczego nie wysyła. Plik Worda powstaje dopiero po kliknięciu
        przycisku. Wyczyszczenie danych przeglądania usunie odpowiedzi — kiedy
        skończysz, pobierz plik.

    !!! danger "Do karty nie wpisuj haseł"

        Karta pyta o host, użytkownika, port i protokół — **nigdy o hasło**.
        Na zrzutach ekranu zasłoń pole hasła. Dokumentacja zawodowa też nigdy
        nie zawiera haseł.

    <div class="karta-pracy" data-karta="publikacja-ftp-hosting"></div>

### Jak ją oddać

1. Pobierz kartę pracy przyciskiem pod formularzem.
2. W treści zadania w dzienniku wklej **adres opublikowanej witryny** — oba
   adresy, jeżeli wykonałeś ćwiczenie 6.
3. Plik dołącz w **Dzienniku VULCAN → Zadania domowe**, w zadaniu
   *Publikacja witryny — karta pracy*.

---

!!! info "Materiały uzupełniające"

    - Rejestr domen `.pl`: [dns.pl](https://www.dns.pl/)
    - Klient FTP/SFTP: [filezilla-project.org](https://filezilla-project.org/) · [winscp.net](https://winscp.net/)
    - Dlaczego przeglądarki usunęły FTP: [Mozilla Security Blog](https://blog.mozilla.org/security/2021/07/20/stopping-ftp-support-in-firefox-90/)
    - Bezpłatne certyfikaty TLS: [letsencrypt.org](https://letsencrypt.org/)
    - Publikacja z repozytorium: [pages.github.com](https://pages.github.com/)
    - Walidator po adresie: [validator.w3.org](https://validator.w3.org/)

*Stan sprawdzony 21 września 2026 r. Firefox usunął obsługę FTP w wersji 90
(2021 r.), Chrome w wersji 95. Adres `192.0.2.10` użyty w przykładach pochodzi
z puli dokumentacyjnej i nie należy do żadnego rzeczywistego serwera. Parametry
i ceny pakietów hostingowych zmieniają się — porównuj je zawsze na bieżąco.*
