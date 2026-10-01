# Część praktyczna — lista kontrolna

Użyj poniższej interaktywnej listy kontrolnej przed oddaniem dowolnego zadania praktycznego z zakresu kwalifikacji **INF.03**. Odhacz kolejne punkty, aby upewnić się, że nie przeoczyłeś żadnego wymogu formalnego ani technicznego.

---

## 1. Baza danych (SQL / MariaDB / phpMyAdmin)

- [ ] Utworzono bazę danych o dokładnej nazwie podanej w treści polecenia (z uwzględnieniem wielkości liter).
- [ ] Zaimportowano do bazy dostarczony plik `.sql` (lub utworzono wymagane tabele i relacje z kluczami głównymi i obcymi).
- [ ] Zapytania SQL zapisano w osobnym pliku tekstowym/skrypcie (np. `kwerendy.txt`) z czytelnym oznaczeniem numerów zadań (np. *Zapytanie 1: ...*).
- [ ] Zrzuty ekranów z wynikami wykonania kwerend zapisano w wymaganym formacie obrazu (np. PNG/JPG) pod wskazanymi nazwami plików.
- [ ] Przetestowano poprawne działanie wszystkich zapytań `SELECT`, `INSERT`, `UPDATE` lub `DELETE` w phpMyAdmin.

---

## 2. Witryna i układ graficzny (HTML5 i CSS3)

- [ ] Struktura plików i katalogów jest zgodna z poleceniem (np. plik główny `index.html` lub `index.php`).
- [ ] Użyto semantycznych znaczników HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- [ ] Tytuł strony w sekcji `<head>` (`<title>`) jest zgodny z treścią zadania.
- [ ] Arkusz stylów wyodrębniono do osobnego pliku `.css` i poprawnie dołączono za pomocą znacznika `<link>`.
- [ ] Kolory tła, czcionek, marginesy (`margin`), dopełnienia (`padding`) oraz wymiary bloków odpowiadają wytycznym ze scenopisu/rysunku w arkuszu.
- [ ] Dokument przechodzi walidację w walidatorze W3C bez błędów składniowych.

---

## 3. Skrypt po stronie klienta (JavaScript)

- [ ] Skrypt pobiera wartości z pól formularza za pomocą właściwego identyfikatora (`document.getElementById`).
- [ ] Zastosowano konwersję typów (np. `parseInt()` / `parseFloat()`) przy pobieraniu danych liczbowych z pól tekstowych.
- [ ] Poprawnie obsłużono zdarzenia użytkownika (np. kliknięcie przycisku `onclick` lub zdarzenie `submit` formularza).
- [ ] Wynik działania skryptu wyświetla się w wyznaczonym bloku HTML (np. w `<div id="wynik">`).
- [ ] Skrypt przetestowano w konsoli przeglądarki (F12 / Developer Tools) pod kątem braku błędów wykonania.

---

## 4. Skrypt po stronie serwera (PHP 8)

- [ ] Nawiązano połączenie z bazą danych MariaDB/MySQL za pomocą funkcji `mysqli_connect()` lub obiektu PDO z poprawnymi parametrami (host, user, password, dbname).
- [ ] Sprawdzono i odebrano dane z formularza metodą `$_POST` lub `$_GET` z weryfikacją obecności zmiennych (`isset()`).
- [ ] Zapytanie SQL wykonano poprawnie (`mysqli_query()`), a wyniki pobrano w pętli (np. `mysqli_fetch_array()` / `mysqli_fetch_row()`).
- [ ] Wygenerowano wynikowy kod HTML z danymi z bazy zgodnie z makietą z zadania.
- [ ] Bezpośrednio po zakończeniu operacji zamknięto połączenie z bazą danych (`mysqli_close()`).

---

## 5. Czynności końcowe i sprawdzające

- [ ] Wszystkie nazwy plików, katalogów oraz rozszerzenia zgadzają się co do litery (pamiętaj o małych/dużych literach w Windows/Linux).
- [ ] Strona została przetestowana w przeglądarce pod adresem serwera lokalnego `http://localhost/...` (a nie nagłówkiem `file:///...`).
- [ ] Zapisano stan wszystkich otwartych plików w edytorze kodu na kilka minut przed upływem czasu egzaminu.

---

*Stan odhaczenia punktów jest automatycznie zachowywany w Twojej przeglądarce.*
