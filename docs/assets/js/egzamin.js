/**
 * egzamin.js — widżet testu oraz widżet postępu INF.03
 */

(function () {
  'use strict';

  var BASE_URL = new URL('../egzamin/pytania.json', document.currentScript ? document.currentScript.src : window.location.href).href;
  var OBSZARY_URL = new URL('../egzamin/obszary.json', document.currentScript ? document.currentScript.src : window.location.href).href;

  var pytaniaCache = null;
  var obszaryCache = null;

  function safeStorageGet(key) {
    try {
      var val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch (e) {
      return null;
    }
  }

  function safeStorageSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  function fetchJSON(url, callback) {
    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) { callback(null, data); })
      .catch(function (err) { callback(err, null); });
  }

  function loadData(callback) {
    if (pytaniaCache && obszaryCache) {
      return callback(null, pytaniaCache, obszaryCache);
    }
    fetchJSON(OBSZARY_URL, function (errObs, obszary) {
      if (errObs) return callback(errObs);
      obszaryCache = obszary;
      fetchJSON(BASE_URL, function (errPyt, pytania) {
        if (errPyt) return callback(errPyt);
        pytaniaCache = pytania;
        callback(null, pytaniaCache, obszaryCache);
      });
    });
  }

  function shuffle(array) {
    var arr = array.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  // --- WIDŻET TESTU ---

  function initTestWidget(container) {
    if (container.dataset.initialized) return;
    container.dataset.initialized = 'true';

    var tryb = container.dataset.tryb || 'trening';

    loadData(function (err, pytania, obszary) {
      if (err) {
        container.innerHTML = '<div class="admonition danger"><p class="admonition-title">Błąd</p><p>Nie udało się wczytać bazy pytań.</p></div>';
        return;
      }

      if (tryb === 'trening') {
        renderTreningSetup(container, pytania, obszary);
      } else {
        renderPelnySetup(container, pytania, obszary);
      }
    });
  }

  function renderTreningSetup(container, pytania, obszary) {
    var html = '' +
      '<div class="egzamin-card" style="padding: 1.5em; border: 1px solid var(--md-default-foreground--divider); border-radius: 8px; background: var(--md-bg-color); margin-bottom: 1em;">' +
        '<h3>Trening z wybranego obszaru</h3>' +
        '<form class="egzamin-form">' +
          '<div style="margin-bottom: 1em;">' +
            '<label><strong>Wybierz obszar(y):</strong></label><br>' +
            '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; margin-top: 8px;">';

    obszary.forEach(function (obs) {
      var count = pytania.filter(function (q) { return q.obszar === obs.id; }).length;
      html += '<label style="display: flex; align-items: center; gap: 6px;"><input type="checkbox" name="obszar" value="' + obs.id + '" checked> ' + obs.nazwa + ' (' + count + ')</label>';
    });

    html += '' +
            '</div>' +
          '</div>' +
          '<div style="margin-bottom: 1.5em;">' +
            '<label><strong>Liczba pytań:</strong></label> ' +
            '<select name="liczba" style="padding: 4px 8px; font-size: 1em;">' +
              '<option value="10">10 pytań</option>' +
              '<option value="20">20 pytań</option>' +
              '<option value="0">Wszystkie dostępne z wybranych obszarów</option>' +
            '</select>' +
          '</div>' +
          '<button type="button" class="md-button md-button--primary start-btn">Rozpocznij trening</button>' +
        '</form>' +
      '</div>';

    container.innerHTML = html;

    var startBtn = container.querySelector('.start-btn');
    startBtn.onclick = function () {
      var checkedObs = Array.from(container.querySelectorAll('input[name="obszar"]:checked')).map(function (cb) { return cb.value; });
      if (!checkedObs.length) {
        alert('Wybierz przynajmniej jeden obszar!');
        return;
      }
      var l = parseInt(container.querySelector('select[name="liczba"]').value, 10);

      var filtered = pytania.filter(function (q) { return checkedObs.indexOf(q.obszar) !== -1; });
      var selected = shuffle(filtered);
      if (l > 0 && l < selected.length) {
        selected = selected.slice(0, l);
      }

      startQuizSession(container, selected, 'trening', obszary);
    };
  }

  function renderPelnySetup(container, pytania, obszary) {
    var html = '' +
      '<div class="egzamin-card" style="padding: 1.5em; border: 1px solid var(--md-default-foreground--divider); border-radius: 8px; background: var(--md-bg-color); margin-bottom: 1em;">' +
        '<h3>Pełny test egzaminacyjny INF.03</h3>' +
        '<p>Test składa się z <strong>40 pytań zamkniętych</strong> (lub wszystkich dostępnych w banku). Czas trwania: <strong>60 minut</strong>. Próg zaliczenia wynosi <strong>50%</strong> (20 punktów).</p>' +
        '<button type="button" class="md-button md-button--primary start-btn">Rozpocznij pełny test</button>' +
      '</div>';

    container.innerHTML = html;

    container.querySelector('.start-btn').onclick = function () {
      var selected = pytania.slice();
      if (selected.length > 40) {
        selected = shuffle(selected).slice(0, 40);
      } else {
        selected = shuffle(selected);
      }
      startQuizSession(container, selected, 'pelny', obszary);
    };
  }

  function startQuizSession(container, pytaniaList, tryb, obszary) {
    if (!pytaniaList.length) {
      container.innerHTML = '<div class="admonition warning"><p class="admonition-title">Brak pytań</p><p>Brak pytań spełniających kryteria.</p></div>';
      return;
    }

    // Mieszanie opcji dla każdego pytania
    var sessionQuestions = pytaniaList.map(function (q) {
      var opts = q.opcje.map(function (text, idx) {
        return { text: text, isCorrect: idx === q.poprawna };
      });
      opts = shuffle(opts);
      return {
        raw: q,
        shuffledOpcje: opts
      };
    });

    var state = {
      tryb: tryb,
      questions: sessionQuestions,
      currentIndex: 0,
      answers: {}, // index -> chosenOptionIndex
      flagged: {}, // index -> bool
      finished: false,
      timerSeconds: 60 * 60,
      intervalId: null
    };

    // Przyspieszony timer dla testowania na localhost / 127.0.0.1
    var isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    var urlParams = new URLSearchParams(window.location.search);
    if (isLocalhost && urlParams.has('czas')) {
      var customSec = parseInt(urlParams.get('czas'), 10);
      if (!isNaN(customSec) && customSec > 0) {
        state.timerSeconds = customSec;
      }
    }

    renderQuizUI(container, state, obszary);

    if (tryb === 'pelny') {
      state.intervalId = setInterval(function () {
        state.timerSeconds--;
        var timerEl = container.querySelector('.egzamin-timer');
        if (timerEl) {
          var m = Math.floor(state.timerSeconds / 60);
          var s = state.timerSeconds % 60;
          timerEl.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
        }
        if (state.timerSeconds <= 0) {
          clearInterval(state.intervalId);
          finishQuiz(container, state, obszary);
        }
      }, 1000);
    }
  }

  function renderQuizUI(container, state, obszary) {
    var qObj = state.questions[state.currentIndex];
    var q = qObj.raw;
    var total = state.questions.length;
    var currIndex = state.currentIndex;

    var html = '<div class="egzamin-quiz-box" style="border: 1px solid var(--md-default-foreground--divider); border-radius: 8px; padding: 1.5em; background: var(--md-bg-color);">';

    // Nagłówek
    html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1em; flex-wrap: wrap; gap: 10px;">';
    html += '<div><strong>Pytanie ' + (currIndex + 1) + ' z ' + total + '</strong></div>';

    if (state.tryb === 'pelny') {
      var m = Math.floor(state.timerSeconds / 60);
      var s = state.timerSeconds % 60;
      var timerStr = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
      html += '<div style="font-size: 1.2em; font-weight: bold; color: var(--md-accent-fallback-color);" class="egzamin-timer">' + timerStr + '</div>';
    }
    html += '</div>';

    // Pasek postępu/nawigacji po numerach (dla pełnego)
    html += '<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 1.5em;">';
    state.questions.forEach(function (sq, idx) {
      var isAns = state.answers.hasOwnProperty(idx);
      var isFlag = !!state.flagged[idx];
      var isCurr = idx === currIndex;

      var bg = 'var(--md-code-bg-color)';
      var color = 'inherit';
      var border = '1px solid var(--md-default-foreground--divider)';

      if (isAns) bg = 'var(--md-primary-fallback-color--light, #e0e7ff)';
      if (isFlag) border = '2px solid #f59e0b';
      if (isCurr) border = '2px solid var(--md-primary-fallback-color, #3f51b5)';

      html += '<button type="button" class="q-nav-btn" data-idx="' + idx + '" style="min-width: 28px; height: 28px; padding: 2px 6px; font-size: 0.85em; border-radius: 4px; background: ' + bg + '; border: ' + border + '; cursor: pointer;">' + (idx + 1) + '</button>';
    });
    html += '</div>';

    // Treść pytania
    html += '<div style="font-size: 1.1em; font-weight: 500; margin-bottom: 1em;">' + escapeHTML(q.pytanie) + '</div>';

    if (q.kod) {
      html += '<pre style="background: var(--md-code-bg-color); padding: 1em; border-radius: 4px; overflow-x: auto; font-family: monospace; font-size: 0.9em; margin-bottom: 1em;"><code>' + escapeHTML(q.kod) + '</code></pre>';
    }

    // Opcje odpowiedzi
    var letters = ['A', 'B', 'C', 'D'];
    var chosenOpt = state.answers[currIndex];

    html += '<div class="egzamin-options" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5em;">';
    qObj.shuffledOpcje.forEach(function (opt, oIdx) {
      var checked = chosenOpt === oIdx ? 'checked' : '';
      var optStyle = 'padding: 10px 14px; border: 1px solid var(--md-default-foreground--divider); border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; background: var(--md-bg-color);';

      if (chosenOpt === oIdx) {
        optStyle += ' border-color: var(--md-primary-fallback-color, #3f51b5); background: var(--md-code-bg-color);';
      }

      html += '<label style="' + optStyle + '">';
      html += '<input type="radio" name="option" value="' + oIdx + '" ' + checked + '> ';
      html += '<strong>' + letters[oIdx] + '.</strong> ' + escapeHTML(opt.text);
      html += '</label>';
    });
    html += '</div>';

    // Wyjaśnienie w trybie trening po zaznaczeniu
    if (state.tryb === 'trening' && chosenOpt !== undefined) {
      var selectedIsCorrect = qObj.shuffledOpcje[chosenOpt].isCorrect;
      var alertClass = selectedIsCorrect ? 'success' : 'danger';
      var alertTitle = selectedIsCorrect ? 'Poprawna odpowiedź!' : 'Błędna odpowiedź!';

      html += '<div class="admonition ' + alertClass + '" style="margin-bottom: 1.5em;">';
      html += '<p class="admonition-title">' + alertTitle + '</p>';
      html += '<p>' + escapeHTML(q.wyjasnienie) + '</p>';
      if (q.temat) {
        var linkUrl = q.temat.startsWith('https://') ? q.temat : new URL('../' + q.temat, window.location.href).href;
        html += '<p style="margin-top: 8px;"><a href="' + linkUrl + '" target="_blank" class="md-button md-button--secondary">Powtórz temat</a></p>';
      }
      html += '</div>';
    }

    // Przyciski akcji
    html += '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">';
    html += '<div>';
    if (currIndex > 0) {
      html += '<button type="button" class="md-button prev-btn" style="margin-right: 8px;">Poprzednie</button>';
    }
    if (currIndex < total - 1) {
      html += '<button type="button" class="md-button md-button--primary next-btn">Następne</button>';
    }
    html += '</div>';

    html += '<div>';
    if (state.tryb === 'pelny') {
      var flagText = state.flagged[currIndex] ? 'Odznacz "wrócę do tego"' : 'Oznacz "wrócę do tego"';
      html += '<button type="button" class="md-button flag-btn" style="margin-right: 8px;">' + flagText + '</button>';
      html += '<button type="button" class="md-button finish-btn" style="background: #ef4444; color: white; border: none;">Zakończ test</button>';
    }
    html += '</div>';

    html += '</div>';

    // Pasek potwierdzenia zakończenia testu (modal-like wewnątrz widżetu)
    html += '<div class="finish-confirm-box" style="display: none; margin-top: 1.5em; padding: 1em; background: var(--md-code-bg-color); border: 2px solid #f59e0b; border-radius: 6px;">';
    html += '<p><strong>Czy na pewno chcesz zakończyć test?</strong></p>';
    var unansweredCount = total - Object.keys(state.answers).length;
    if (unansweredCount > 0) {
      html += '<p style="color: #f59e0b;">Pozostało nieodpowiedzialnych pytań: ' + unansweredCount + '</p>';
    }
    html += '<div style="display: flex; gap: 10px; margin-top: 10px;">';
    html += '<button type="button" class="md-button confirm-yes-btn" style="background: #ef4444; color: white;">Tak, zakończ</button>';
    html += '<button type="button" class="md-button confirm-no-btn">Kontynuuj test</button>';
    html += '</div></div>';

    html += '</div>';

    container.innerHTML = html;

    // Podpięcie zdarzeń
    attachQuizEvents(container, state, obszary);
  }

  function attachQuizEvents(container, state, obszary) {
    // Nawigacja pytań
    container.querySelectorAll('.q-nav-btn').forEach(function (btn) {
      btn.onclick = function () {
        state.currentIndex = parseInt(btn.dataset.idx, 10);
        renderQuizUI(container, state, obszary);
      };
    });

    // Wybór opcji
    container.querySelectorAll('input[name="option"]').forEach(function (radio) {
      radio.onchange = function () {
        state.answers[state.currentIndex] = parseInt(radio.value, 10);
        renderQuizUI(container, state, obszary);
      };
    });

    var prevBtn = container.querySelector('.prev-btn');
    if (prevBtn) {
      prevBtn.onclick = function () {
        state.currentIndex--;
        renderQuizUI(container, state, obszary);
      };
    }

    var nextBtn = container.querySelector('.next-btn');
    if (nextBtn) {
      nextBtn.onclick = function () {
        state.currentIndex++;
        renderQuizUI(container, state, obszary);
      };
    }

    var flagBtn = container.querySelector('.flag-btn');
    if (flagBtn) {
      flagBtn.onclick = function () {
        state.flagged[state.currentIndex] = !state.flagged[state.currentIndex];
        renderQuizUI(container, state, obszary);
      };
    }

    var finishBtn = container.querySelector('.finish-btn');
    var confirmBox = container.querySelector('.finish-confirm-box');
    if (finishBtn && confirmBox) {
      finishBtn.onclick = function () {
        confirmBox.style.display = 'block';
      };
      container.querySelector('.confirm-no-btn').onclick = function () {
        confirmBox.style.display = 'none';
      };
      container.querySelector('.confirm-yes-btn').onclick = function () {
        if (state.intervalId) clearInterval(state.intervalId);
        finishQuiz(container, state, obszary);
      };
    }

    // Obsługa klawiatury (1-4 / A-D, strzałki)
    if (!container.dataset.keyListener) {
      container.dataset.keyListener = 'true';
      document.addEventListener('keydown', function (e) {
        if (!container.contains(document.activeElement) && document.activeElement !== document.body) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

        var key = e.key.toUpperCase();
        var optionIndex = -1;
        if (key === '1' || key === 'A') optionIndex = 0;
        if (key === '2' || key === 'B') optionIndex = 1;
        if (key === '3' || key === 'C') optionIndex = 2;
        if (key === '4' || key === 'D') optionIndex = 3;

        if (optionIndex !== -1) {
          var radios = container.querySelectorAll('input[name="option"]');
          if (radios[optionIndex]) {
            radios[optionIndex].checked = true;
            state.answers[state.currentIndex] = optionIndex;
            renderQuizUI(container, state, obszary);
          }
        } else if (e.key === 'ArrowRight' && state.currentIndex < state.questions.length - 1) {
          state.currentIndex++;
          renderQuizUI(container, state, obszary);
        } else if (e.key === 'ArrowLeft' && state.currentIndex > 0) {
          state.currentIndex--;
          renderQuizUI(container, state, obszary);
        }
      });
    }
  }

  function finishQuiz(container, state, obszary) {
    state.finished = true;
    var total = state.questions.length;
    var correctCount = 0;
    var obszarStats = {}; // obszarId -> { total: 0, correct: 0 }
    var wrongQuestions = [];

    state.questions.forEach(function (qObj, idx) {
      var q = qObj.raw;
      var obs = q.obszar;
      if (!obszarStats[obs]) obszarStats[obs] = { total: 0, correct: 0 };
      obszarStats[obs].total++;

      var chosen = state.answers[idx];
      var isCorrect = chosen !== undefined && qObj.shuffledOpcje[chosen].isCorrect;

      if (isCorrect) {
        correctCount++;
        obszarStats[obs].correct++;
      } else {
        wrongQuestions.push({
          id: q.id,
          pytanie: q.pytanie,
          wyjasnienie: q.wyjasnienie,
          temat: q.temat,
          obszar: obs
        });
      }
    });

    var scorePct = Math.round((correctCount / total) * 100);
    var passed = scorePct >= 50;

    // Zapis w localStorage
    var history = safeStorageGet('wiai-egzamin-historie') || [];
    var attemptRecord = {
      data: new Date().toISOString(),
      tryb: state.tryb,
      wynik: scorePct,
      zdane: passed,
      punkty: correctCount + ' / ' + total,
      obszary: obszarStats,
      bledyIds: wrongQuestions.map(function (w) { return w.id; })
    };
    history.push(attemptRecord);
    safeStorageSet('wiai-egzamin-historie', history);

    // Zapis statystyk poszczególnych błędnych pytań
    var freqMap = safeStorageGet('wiai-egzamin-bledy-freq') || {};
    wrongQuestions.forEach(function (w) {
      freqMap[w.id] = (freqMap[w.id] || 0) + 1;
    });
    safeStorageSet('wiai-egzamin-bledy-freq', freqMap);

    // Render wyników
    var html = '<div class="egzamin-wyniki" style="border: 1px solid var(--md-default-foreground--divider); border-radius: 8px; padding: 1.5em; background: var(--md-bg-color);">';

    html += '<h2>Wynik testu: ' + scorePct + '% (' + correctCount + ' / ' + total + ')</h2>';
    if (passed) {
      html += '<div class="admonition success"><p class="admonition-title">Egzamin ZDANY!</p><p>Uzyskano wymagany próg 50%.</p></div>';
    } else {
      html += '<div class="admonition danger"><p class="admonition-title">Egzamin NIEZDANY</p><p>Próg zaliczenia wynosi 50%.</p></div>';
    }

    html += '<h3>Wynik w podziale na obszary:</h3><ul style="list-style: none; padding: 0;">';
    obszary.forEach(function (obs) {
      if (obszarStats[obs.id]) {
        var st = obszarStats[obs.id];
        var pct = Math.round((st.correct / st.total) * 100);
        html += '<li style="margin-bottom: 8px;"><strong>' + obs.nazwa + ':</strong> ' + st.correct + ' / ' + st.total + ' (' + pct + '%)</li>';
      }
    });
    html += '</ul>';

    if (wrongQuestions.length > 0) {
      html += '<h3 style="margin-top: 1.5em;">Lista błędnych odpowiedzi:</h3>';
      html += '<div style="display: flex; flex-direction: column; gap: 12px;">';
      wrongQuestions.forEach(function (w) {
        html += '<div style="padding: 1em; border: 1px solid var(--md-default-foreground--divider); border-radius: 6px; background: var(--md-code-bg-color);">';
        html += '<div><strong>' + escapeHTML(w.pytanie) + '</strong></div>';
        html += '<div style="margin-top: 6px; font-size: 0.9em; color: var(--md-default-foreground--subtle);">' + escapeHTML(w.wyjasnienie) + '</div>';
        if (w.temat) {
          var linkUrl = w.temat.startsWith('https://') ? w.temat : new URL('../' + w.temat, window.location.href).href;
          html += '<div style="margin-top: 8px;"><a href="' + linkUrl + '" target="_blank" class="md-button md-button--secondary" style="font-size: 0.85em;">Powtórz temat</a></div>';
        }
        html += '</div>';
      });
      html += '</div>';
    }

    html += '<div style="margin-top: 2em; display: flex; gap: 10px;">';
    html += '<button type="button" class="md-button md-button--primary restart-btn">Uruchom ponownie</button>';
    html += '</div>';

    html += '</div>';

    container.innerHTML = html;

    container.querySelector('.restart-btn').onclick = function () {
      delete container.dataset.initialized;
      initTestWidget(container);
    };
  }

  // --- WIDŻET POSTĘPU ---

  function initPostepWidget(container) {
    if (container.dataset.initialized) return;
    container.dataset.initialized = 'true';

    loadData(function (err, pytania, obszary) {
      if (err) {
        container.innerHTML = '<div class="admonition danger"><p class="admonition-title">Błąd</p><p>Nie udało się wczytać danych egzaminu.</p></div>';
        return;
      }

      var history = safeStorageGet('wiai-egzamin-historie') || [];
      var freqMap = safeStorageGet('wiai-egzamin-bledy-freq') || {};

      var html = '';

      // Tabela historii
      html += '<h3>Historia podejść</h3>';
      if (!history.length) {
        html += '<p><em>Brak zapisanych podejść do testów. Rozwiąż swój pierwszy trening lub test próbny!</em></p>';
      } else {
        html += '<div style="overflow-x: auto;"><table class="md-typeset__table" style="width: 100%; border-collapse: collapse;">';
        html += '<thead><tr><th>Data</th><th>Tryb</th><th>Punkty</th><th>Wynik</th><th>Status</th></tr></thead><tbody>';

        history.slice().reverse().forEach(function (rec) {
          var d = new Date(rec.data);
          var dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          var statusBadge = rec.zdane ? '<span style="color: green; font-weight: bold;">Zdany</span>' : '<span style="color: red; font-weight: bold;">Niezdany</span>';
          var trybStr = rec.tryb === 'pelny' ? 'Pełny test' : 'Trening';

          html += '<tr><td>' + dateStr + '</td><td>' + trybStr + '</td><td>' + rec.punkty + '</td><td>' + rec.wynik + '%</td><td>' + statusBadge + '</td></tr>';
        });

        html += '</tbody></table></div>';
      }

      // Podsumowanie wg obszarów z ostatnich podejść
      html += '<h3 style="margin-top: 2em;">Wynik wg obszarów</h3>';

      var obszarOverall = {}; // obsId -> { correct: 0, total: 0 }
      history.forEach(function (rec) {
        if (rec.obszary) {
          Object.keys(rec.obszary).forEach(function (obsId) {
            if (!obszarOverall[obsId]) obszarOverall[obsId] = { correct: 0, total: 0 };
            obszarOverall[obsId].correct += rec.obszary[obsId].correct;
            obszarOverall[obsId].total += rec.obszary[obsId].total;
          });
        }
      });

      html += '<div style="display: flex; flex-direction: column; gap: 12px;">';
      var weakestObszar = null;
      var lowestPct = 101;

      obszary.forEach(function (obs) {
        var st = obszarOverall[obs.id] || { correct: 0, total: 0 };
        var pct = st.total > 0 ? Math.round((st.correct / st.total) * 100) : 0;

        if (st.total > 0 && pct < lowestPct) {
          lowestPct = pct;
          weakestObszar = obs;
        }

        html += '<div>';
        html += '<div style="display: flex; justify-content: space-between; font-size: 0.9em; margin-bottom: 4px;">';
        html += '<span><strong>' + obs.nazwa + '</strong></span>';
        html += '<span>' + (st.total > 0 ? pct + '% (' + st.correct + '/' + st.total + ')' : 'Brak danych') + '</span>';
        html += '</div>';

        html += '<div style="width: 100%; height: 12px; background: var(--md-code-bg-color); border-radius: 6px; overflow: hidden;">';
        html += '<div style="width: ' + pct + '%; height: 100%; background: ' + (pct >= 50 ? '#22c55e' : '#ef4444') + ';"></div>';
        html += '</div>';
        html += '</div>';
      });
      html += '</div>';

      // Najsłabszy obszar z rekomendacją
      if (weakestObszar) {
        html += '<div class="admonition warning" style="margin-top: 1.5em;">';
        html += '<p class="admonition-title">Twój najsłabszy obszar: ' + weakestObszar.nazwa + ' (' + lowestPct + '%)</p>';
        html += '<p>Zalecamy wykonanie dodatkowego treningu z tego zakresu.</p>';
        var testPageUrl = new URL('../egzamin/test.md', window.location.href).href;
        html += '<p><a href="' + testPageUrl + '" class="md-button md-button--primary">Przejdź do treningu</a></p>';
        html += '</div>';
      }

      // Często błędne pytania
      var sortedFreq = Object.keys(freqMap).map(function (qId) {
        return { id: qId, count: freqMap[qId] };
      }).sort(function (a, b) { return b.count - a.count; }).slice(0, 5);

      if (sortedFreq.length > 0) {
        html += '<h3 style="margin-top: 2em;">Pytania, na które najczęściej odpowiadasz źle</h3>';
        html += '<div style="display: flex; flex-direction: column; gap: 8px;">';

        sortedFreq.forEach(function (item) {
          var qObj = pytania.find(function (p) { return p.id === item.id; });
          if (qObj) {
            html += '<div style="padding: 10px; border: 1px solid var(--md-default-foreground--divider); border-radius: 6px; background: var(--md-code-bg-color); font-size: 0.9em;">';
            html += '<div><strong>' + escapeHTML(qObj.pytanie) + '</strong> (Liczba błędów: ' + item.count + ')</div>';
            if (qObj.temat) {
              var linkUrl = qObj.temat.startsWith('https://') ? qObj.temat : new URL('../' + qObj.temat, window.location.href).href;
              html += '<div style="margin-top: 4px;"><a href="' + linkUrl + '" target="_blank">Powtórz temat &raquo;</a></div>';
            }
            html += '</div>';
          }
        });

        html += '</div>';
      }

      // Przycisk czyszczenia historii
      html += '<div style="margin-top: 2em; padding-top: 1em; border-top: 1px solid var(--md-default-foreground--divider);">';
      html += '<button type="button" class="md-button clear-history-btn">Wyczyść historię wyników</button>';
      html += '</div>';

      container.innerHTML = html;

      var clearBtn = container.querySelector('.clear-history-btn');
      if (clearBtn) {
        clearBtn.onclick = function () {
          try {
            localStorage.removeItem('wiai-egzamin-historie');
            localStorage.removeItem('wiai-egzamin-bledy-freq');
          } catch (e) {}
          delete container.dataset.initialized;
          initPostepWidget(container);
        };
      }
    });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function start() {
    document.querySelectorAll('.egzamin-test').forEach(initTestWidget);
    document.querySelectorAll('.egzamin-postep').forEach(initPostepWidget);
  }

  if (typeof document$ !== 'undefined') {
    document$.subscribe(start);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }
})();
