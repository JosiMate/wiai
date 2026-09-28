/* Małe narzędzia wbudowane w materiał.
 *
 * Użycie:  <div class="narzedzie" data-narzedzie="hasla"></div>
 *          <div class="narzedzie" data-narzedzie="konwerter"></div>
 *          <div class="narzedzie" data-narzedzie="tasma"></div>
 *
 * Wszystko liczy się w przeglądarce. Nic nie jest wysyłane — przy narzędziu
 * do haseł to nie ozdobnik, tylko warunek, żeby w ogóle wolno było go użyć.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------- siła hasła
   * Liczymy entropię w bitach: długość × log2(rozmiar alfabetu). To
   * uproszczenie — pokazuje odporność na atak siłowy, ale nie wykryje, że
   * „Haslo123!” jest w każdym słowniku. Dlatego obok liczby pokazujemy
   * ostrzeżenia o wzorcach, bo to one decydują w praktyce.
   */
  const SLABE = ["haslo", "password", "qwerty", "123456", "iloveyou", "admin",
    "zaq12wsx", "monkey", "dragon", "letmein", "polska", "kocham"];

  function ocenHaslo(h) {
    if (!h) return null;
    let alfabet = 0;
    if (/[a-z]/.test(h)) alfabet += 26;
    if (/[A-Z]/.test(h)) alfabet += 26;
    if (/[0-9]/.test(h)) alfabet += 10;
    if (/[^a-zA-Z0-9]/.test(h)) alfabet += 33;
    const bity = Math.round(h.length * Math.log2(alfabet || 1));

    const uwagi = [];
    const male = h.toLowerCase();
    if (SLABE.some((s) => male.includes(s)))
      uwagi.push("zawiera wyraz z list najczęściej łamanych haseł");
    if (/^[A-Z]?[a-z]+[0-9]{1,4}[!@#$]?$/.test(h))
      uwagi.push("ma schemat „słowo + cyfry + znak” — atakujący sprawdzają go w pierwszej kolejności");
    if (/(.)\1{2,}/.test(h)) uwagi.push("powtarza ten sam znak trzy razy z rzędu");
    if (/(012|123|234|345|456|567|678|789|abc|qwe|asd)/i.test(h))
      uwagi.push("zawiera ciąg z klawiatury lub kolejne cyfry");
    if (h.length < 12) uwagi.push("jest krótsze niż 12 znaków");

    let poziom, opis;
    if (uwagi.length && bity < 60) { poziom = 0; opis = "słabe"; }
    else if (bity < 60) { poziom = 1; opis = "przeciętne"; }
    else if (bity < 90) { poziom = 2; opis = "dobre"; }
    else { poziom = 3; opis = "bardzo dobre"; }
    if (uwagi.length && poziom > 1) poziom = 1, opis = "przeciętne mimo długości";

    return { bity, alfabet, poziom, opis, uwagi };
  }

  function narzedzieHasla(host) {
    host.innerHTML = `<div class="nz nz-hasla">
      <label class="nz-etykieta" for="nz-h">Wpisz hasło, żeby zobaczyć, co je osłabia</label>
      <input id="nz-h" type="text" autocomplete="off" spellcheck="false"
             placeholder="np. poziomka-wiatrak-27-beczka">
      <p class="nz-uwaga-prywatnosc">Liczone wyłącznie w twojej przeglądarce — nic nie jest
        wysyłane. Mimo to <strong>nie wpisuj tu hasła, którego naprawdę używasz</strong>:
        do nauki wystarczy podobne.</p>
      <div class="nz-wynik" hidden>
        <div class="nz-tor"><div class="nz-wypelnienie"></div></div>
        <p class="nz-podsumowanie"></p>
        <ul class="nz-uwagi"></ul>
      </div></div>`;

    const inp = host.querySelector("input");
    const wynik = host.querySelector(".nz-wynik");
    inp.addEventListener("input", () => {
      const o = ocenHaslo(inp.value);
      if (!o) { wynik.hidden = true; return; }
      wynik.hidden = false;
      wynik.className = "nz-wynik nz-p" + o.poziom;
      host.querySelector(".nz-wypelnienie").style.width = Math.min(100, (o.bity / 110) * 100) + "%";
      host.querySelector(".nz-podsumowanie").innerHTML =
        `Hasło <strong>${o.opis}</strong> — około <strong>${o.bity} bitów</strong> entropii
         (${inp.value.length} znaków z alfabetu ${o.alfabet}-znakowego).`;
      host.querySelector(".nz-uwagi").innerHTML = o.uwagi.length
        ? o.uwagi.map((u) => `<li>${u}</li>`).join("")
        : "<li>Nie znalazłem typowych słabości. Zostaje jeszcze jedna zasada, której żadne "
          + "narzędzie nie sprawdzi: to hasło musi być użyte tylko w jednym miejscu.</li>";
    });
  }

  /* ---------------------------------------------------------- konwerter
   * Dwójkowy, ósemkowy, dziesiętny, szesnastkowy — na żywo, w obie strony.
   * Przyda się w dziale VI.
   */
  const SYSTEMY = [["bin", "dwójkowy", 2], ["oct", "ósemkowy", 8],
                   ["dec", "dziesiętny", 10], ["hex", "szesnastkowy", 16]];

  function narzedzieKonwerter(host) {
    host.innerHTML = `<div class="nz nz-konwerter">
      ${SYSTEMY.map(([id, nazwa, p]) => `<label class="nz-wiersz">
        <span class="nz-nazwa">${nazwa} <code>(${p})</code></span>
        <input type="text" data-p="${p}" id="nz-${id}" autocomplete="off" spellcheck="false">
      </label>`).join("")}
      <p class="nz-blad" hidden></p>
      <p class="nz-bity"></p></div>`;

    const pola = [...host.querySelectorAll("input")];
    const blad = host.querySelector(".nz-blad");
    const bity = host.querySelector(".nz-bity");
    const CYFRY = "0123456789abcdef";

    pola.forEach((pole) => pole.addEventListener("input", () => {
      const p = Number(pole.dataset.p);
      const txt = pole.value.trim().toLowerCase();
      if (!txt) { pola.forEach((x) => { if (x !== pole) x.value = ""; });
                  blad.hidden = true; bity.textContent = ""; return; }
      const dozwolone = CYFRY.slice(0, p);
      if ([...txt].some((c) => !dozwolone.includes(c))) {
        blad.hidden = false;
        blad.textContent = `W systemie o podstawie ${p} można użyć tylko cyfr: ${dozwolone.split("").join(", ")}.`;
        return;
      }
      blad.hidden = true;
      const v = parseInt(txt, p);
      if (!Number.isSafeInteger(v)) {
        blad.hidden = false;
        blad.textContent = "Ta liczba jest za duża, by policzyć ją bezbłędnie w przeglądarce.";
        return;
      }
      pola.forEach((x) => { if (x !== pole) x.value = v.toString(Number(x.dataset.p)); });
      const b = v === 0 ? 1 : Math.floor(Math.log2(v)) + 1;
      bity.innerHTML = `Zapis dwójkowy zajmuje <strong>${b}</strong> bitów, czyli mieści się
        w typie o rozmiarze ${b <= 8 ? "1 bajta" : b <= 16 ? "2 bajtów" : b <= 32 ? "4 bajtów" : "8 bajtów"}.`;
    }));
  }


  /* ---------------------------------------------------------- taśma
   * Droga od kodu źródłowego do działającego programu w trzech językach
   * i miejsce, w którym wychodzi na jaw każdy z trzech rodzajów błędów.
   * Uczeń najpierw wskazuje etap, potem widzi odpowiedź — przewiduj, sprawdź.
   * Komunikaty są prawdziwe (gcc, PHP 8, Chrome), skrócone do jednej linii.
   */
  const TASMA = {
    c: {
      nazwa: "C — kompilator i linker",
      etapy: [
        ["Edytor", "piszesz <code>main.c</code> i <code>cennik.c</code>"],
        ["Preprocesor", "wkleja pliki z <code>#include</code>"],
        ["Kompilator", "tłumaczy każdy plik na kod maszynowy: <code>main.o</code>, <code>cennik.o</code>"],
        ["Linker", "łączy pliki <code>.o</code> i biblioteki w jeden <code>wycena.exe</code>"],
        ["Uruchomienie", "system wykonuje <code>wycena.exe</code> — kompilator nie jest już potrzebny"],
      ],
    },
    php: {
      nazwa: "PHP — na serwerze",
      etapy: [
        ["Edytor", "piszesz <code>wycena.php</code> w <code>htdocs</code>"],
        ["Serwer Apache", "przyjmuje żądanie i oddaje plik interpreterowi PHP"],
        ["Tłumaczenie", "PHP sprawdza składnię całego pliku i tłumaczy go na kod pośredni (opkody)"],
        ["Wykonanie", "maszyna wirtualna PHP wykonuje opkody; <code>require</code> dołącza kolejne pliki"],
        ["Odpowiedź", "przeglądarka dostaje gotowy HTML"],
      ],
    },
    js: {
      nazwa: "JavaScript — w przeglądarce",
      etapy: [
        ["Edytor", "piszesz <code>wycena.js</code>"],
        ["Pobranie", "przeglądarka pobiera skrypt razem ze stroną"],
        ["Parser", "silnik sprawdza składnię całego skryptu i tłumaczy go na kod bajtowy"],
        ["Wykonanie", "interpreter wykonuje kod bajtowy; często używane fragmenty kompilator JIT tłumaczy na kod maszynowy"],
        ["Efekt", "zmiana na stronie, wpis w konsoli"],
      ],
    },
  };
  const BLEDY = {
    brak: { nazwa: "bez błędu" },
    skladnia: { nazwa: "błąd składni" },
    funkcja: { nazwa: "wywołanie funkcji, której nie ma" },
    zero: { nazwa: "dzielenie przez zero" },
  };
  // etap: indeks etapu, na którym błąd wychodzi na jaw; -1 — nigdzie
  const WYNIKI = {
    c: {
      brak: { etap: -1, kom: "", opis: "Program kompilujesz raz. Gotowy <code>wycena.exe</code> uruchomisz na innym komputerze z tym samym systemem — bez kompilatora i bez kodu źródłowego." },
      skladnia: { etap: 2, kom: "main.c:6:36: error: expected ';' before 'return'", opis: "Kompilator nie przepuści pliku z błędem składni. Plik <code>.exe</code> w ogóle nie powstaje — nie ma czego uruchomić." },
      funkcja: { etap: 3, kom: "main.c:(.text+0x17): undefined reference to `rabat'", opis: "Kompilator przepuścił wywołanie, bo plik nagłówkowy <code>cennik.h</code> zapowiada funkcję <code>rabat</code>. Jej treści szuka dopiero linker — we wszystkich plikach <code>.o</code> i bibliotekach. Nie znalazł, więc nie złożył programu." },
      zero: { etap: 4, kom: "Floating point exception (core dumped)", opis: "Program się zbudował, a awaria przychodzi w chwili dzielenia. Kompilator tego nie widział: dzielnik był znany dopiero podczas działania programu. (Komunikat pochodzi z Linuksa — w Windows program po prostu się zamyka.)" },
    },
    php: {
      brak: { etap: -1, kom: "", opis: "Przy <strong>każdym</strong> żądaniu PHP tłumaczy plik od nowa (chyba że gotowe opkody przechowa moduł OPcache). Dlatego na serwerze musi być interpreter, a nie tylko wynik." },
      skladnia: { etap: 2, kom: "Parse error: syntax error, unexpected token \"echo\"", opis: "Nie wykonuje się <strong>nic</strong> — nawet wiersze nad błędem. PHP najpierw tłumaczy cały plik, a dopiero potem go wykonuje." },
      funkcja: { etap: 3, kom: "Fatal error: Uncaught Error: Call to undefined function rabat()", opis: "Tłumaczenie przeszło — istnienie funkcji PHP sprawdza dopiero w chwili wywołania. Wiersze nad wywołaniem już się wykonały i ich wynik jest na stronie." },
      zero: { etap: 3, kom: "Fatal error: Uncaught DivisionByZeroError: Division by zero", opis: "Od PHP 8 dzielenie przez zero przerywa skrypt w chwili wykonania tego wiersza." },
    },
    js: {
      brak: { etap: -1, kom: "", opis: "Kod źródłowy trafia do przeglądarki użytkownika i to ona go tłumaczy — dlatego każdy może go przeczytać (<kbd>Ctrl</kbd>+<kbd>U</kbd>)." },
      skladnia: { etap: 2, kom: "Uncaught SyntaxError: missing ) after argument list", opis: "Nie wykona się żadna instrukcja tego skryptu. Inne skrypty na stronie działają dalej. Uwaga: w JavaScripcie sam <strong>brak średnika</strong> zwykle błędem nie jest — silnik wstawia go sam. Tu zabrakło nawiasu." },
      funkcja: { etap: 3, kom: "Uncaught ReferenceError: rabat is not defined", opis: "Instrukcje przed tym wierszem już się wykonały, kolejne — nie. Błąd wyszedł dopiero wtedy, gdy program doszedł do wywołania." },
      zero: { etap: -1, kom: "450 / 0 → Infinity", opis: "<strong>JavaScript nie zgłasza tu błędu.</strong> Wynikiem jest <code>Infinity</code>, a <code>0 / 0</code> daje <code>NaN</code>. Program liczy dalej ze złą wartością — taki błąd znajdzie tylko test albo debugger.", ostrzezenie: true },
    },
  };

  function narzedzieTasma(host) {
    let jezyk = "php", blad = "skladnia", odkryte = false;
    host.innerHTML = `<div class="nz nz-tasma">
      <div class="nz-tasma-wybor" role="group" aria-label="Język">
        ${Object.entries(TASMA).map(([k, v]) => `<button type="button" data-j="${k}">${v.nazwa}</button>`).join("")}
      </div>
      <div class="nz-tasma-wybor" role="group" aria-label="Błąd">
        ${Object.entries(BLEDY).map(([k, v]) => `<button type="button" data-b="${k}">${v.nazwa}</button>`).join("")}
      </div>
      <p class="nz-tasma-pytanie"></p>
      <ol class="nz-tasma-etapy"></ol>
      <button type="button" class="nz-tasma-nigdzie">Nigdzie — program działa bez komunikatu</button>
      <div class="nz-tasma-wynik" aria-live="polite"></div></div>`;
    const etapy = host.querySelector(".nz-tasma-etapy");
    const pytanie = host.querySelector(".nz-tasma-pytanie");
    const wynik = host.querySelector(".nz-tasma-wynik");
    const nigdzie = host.querySelector(".nz-tasma-nigdzie");

    function rysuj(zgadniety) {
      const w = WYNIKI[jezyk][blad];
      host.querySelectorAll("[data-j]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.j === jezyk));
      host.querySelectorAll("[data-b]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.b === blad));
      const pokaz = odkryte || blad === "brak";
      etapy.innerHTML = TASMA[jezyk].etapy.map(([n, o], i) => {
        let stan = "";
        if (pokaz) {
          if (w.etap === -1 || i < w.etap) stan = "ok";
          else if (i === w.etap) stan = "stop";
          else stan = "pominiety";
          if (w.ostrzezenie && i === TASMA[jezyk].etapy.length - 1) stan = "uwaga";
        }
        const tag = pokaz ? "div" : "button type=\"button\"";
        return `<li class="nz-etap ${stan ? "nz-etap-" + stan : ""}"><${tag} data-i="${i}">
          <strong>${i + 1}. ${n}</strong><span>${o}</span></${pokaz ? "div" : "button"}></li>`;
      }).join("");
      nigdzie.hidden = pokaz;
      if (blad === "brak") {
        pytanie.textContent = "Tak wygląda droga programu, gdy wszystko jest w porządku. Wybierz rodzaj błędu powyżej.";
      } else if (!pokaz) {
        pytanie.innerHTML = "<strong>Przewiduj:</strong> na którym etapie ten błąd wyjdzie na jaw? Kliknij etap.";
      } else {
        pytanie.innerHTML = "";
      }
      if (!pokaz) { wynik.innerHTML = ""; return; }
      let ocena = "";
      if (zgadniety !== undefined) {
        ocena = zgadniety === w.etap
          ? `<p class="nz-tasma-ocena nz-trafione">Dobrze przewidziane.</p>`
          : `<p class="nz-tasma-ocena nz-chybione">Nie tym razem — zobacz, dlaczego.</p>`;
      }
      wynik.innerHTML = ocena
        + (w.kom ? `<pre class="nz-tasma-kom"><code></code></pre>` : "")
        + `<p>${w.opis}</p>`
        + (blad !== "brak" ? `<button type="button" class="nz-tasma-znowu">Spróbuj z innym językiem</button>` : "");
      if (w.kom) wynik.querySelector("code").textContent = w.kom;
      const znowu = wynik.querySelector(".nz-tasma-znowu");
      if (znowu) znowu.addEventListener("click", () => {
        const kl = Object.keys(TASMA);
        jezyk = kl[(kl.indexOf(jezyk) + 1) % kl.length]; odkryte = false; rysuj();
      });
    }

    host.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || !host.contains(b)) return;
      if (b.dataset.j) { jezyk = b.dataset.j; odkryte = false; rysuj(); }
      else if (b.dataset.b) { blad = b.dataset.b; odkryte = false; rysuj(); }
      else if (b.dataset.i !== undefined) { odkryte = true; rysuj(Number(b.dataset.i)); }
      else if (b === nigdzie) { odkryte = true; rysuj(-1); }
    });
    rysuj();
  }

  const NARZEDZIA = { hasla: narzedzieHasla, konwerter: narzedzieKonwerter, tasma: narzedzieTasma };

  function start() {
    document.querySelectorAll(".narzedzie[data-narzedzie]").forEach((host) => {
      if (host.dataset.gotowe) return;
      const f = NARZEDZIA[host.dataset.narzedzie];
      if (!f) return;
      host.dataset.gotowe = "1";
      f(host);
    });
  }

  if (typeof document$ !== "undefined") document$.subscribe(start);
  else document.addEventListener("DOMContentLoaded", start);
})();
