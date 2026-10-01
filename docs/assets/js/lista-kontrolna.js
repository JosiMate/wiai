/**
 * lista-kontrolna.js — obsługa interaktywnych list kontrolnych INF.03
 * Zapamiętuje stan odhaczenia w localStorage i wyświetla podsumowanie.
 */

(function () {
  'use strict';

  function getPageKey() {
    var path = window.location.pathname || '';
    path = path.replace(/\/index\.html$/, '').replace(/\/$/, '');
    if (!path) path = '/';
    return 'wiai-lista:' + path;
  }

  function loadSavedState(pageKey) {
    try {
      var data = localStorage.getItem(pageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveState(pageKey, state) {
    try {
      localStorage.setItem(pageKey, JSON.stringify(state));
    } catch (e) {}
  }

  function getItemText(li) {
    // Pobierz tekst punktu bez ewentualnych zagnieżdżonych list lub formularzy
    var clone = li.cloneNode(true);
    var sublists = clone.querySelectorAll('ul, ol');
    sublists.forEach(function (sub) { sub.remove(); });
    return (clone.textContent || '').trim().replace(/\s+/g, ' ');
  }

  function initChecklist() {
    var taskLists = document.querySelectorAll('.md-typeset ul.task-list');
    if (!taskLists.length) return;

    var pageKey = getPageKey();
    var savedState = loadSavedState(pageKey);

    var totalCount = 0;
    var checkedCount = 0;
    var allCheckboxes = [];

    taskLists.forEach(function (ul) {
      var items = ul.querySelectorAll('li.task-list-item');
      items.forEach(function (li) {
        var checkbox = li.querySelector('input[type="checkbox"]');
        if (!checkbox) return;

        // Odblokuj checkbox
        checkbox.removeAttribute('disabled');
        checkbox.disabled = false;

        var textKey = getItemText(li);

        if (savedState.hasOwnProperty(textKey)) {
          checkbox.checked = !!savedState[textKey];
        }

        totalCount++;
        if (checkbox.checked) checkedCount++;
        allCheckboxes.push({ box: checkbox, key: textKey });

        if (!checkbox.dataset.listener) {
          checkbox.dataset.listener = 'true';
          checkbox.addEventListener('change', function () {
            var currentSaved = loadSavedState(pageKey);
            currentSaved[textKey] = checkbox.checked;
            saveState(pageKey, currentSaved);
            updateSummary();
          });
        }
      });
    });

    if (!totalCount) return;

    var lastList = taskLists[taskLists.length - 1];

    // Znajdź lub utwórz kontener podsumowania
    var summaryDiv = document.querySelector('.lista-kontrolna-podsumowanie');
    if (!summaryDiv) {
      summaryDiv = document.createElement('div');
      summaryDiv.className = 'lista-kontrolna-podsumowanie';
      summaryDiv.style.cssText = 'margin-top: 1.5em; padding: 1em; border: 1px solid var(--md-default-foreground--divider); border-radius: 4px; background: var(--md-code-bg-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;';
      lastList.parentNode.insertBefore(summaryDiv, lastList.nextSibling);
    }

    function updateSummary() {
      var currentChecked = 0;
      allCheckboxes.forEach(function (item) {
        if (item.box.checked) currentChecked++;
      });
      var pct = Math.round((currentChecked / totalCount) * 100);

      summaryDiv.innerHTML = '' +
        '<div>' +
          '<strong>Odhaczone: ' + currentChecked + ' z ' + totalCount + ' (' + pct + '%)</strong>' +
        '</div>' +
        '<button type="button" class="md-button md-button--secondary reset-btn" style="cursor: pointer;">Wyczyść zaznaczenia</button>';

      var resetBtn = summaryDiv.querySelector('.reset-btn');
      if (resetBtn) {
        resetBtn.onclick = function () {
          try {
            localStorage.removeItem(pageKey);
          } catch (e) {}
          allCheckboxes.forEach(function (item) {
            item.box.checked = false;
          });
          updateSummary();
        };
      }
    }

    updateSummary();
  }

  function start() {
    initChecklist();
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
