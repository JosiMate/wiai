/* Małe narzędzia wbudowane w materiał.
 *
 * Użycie:  <div class="narzedzie" data-narzedzie="hasla"></div>
 *          <div class="narzedzie" data-narzedzie="konwerter"></div>
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

  const NARZEDZIA = { hasla: narzedzieHasla, konwerter: narzedzieKonwerter };

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
