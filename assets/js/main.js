/* ==========================================================================
   Писатели и места Липецкого края — scripts
   ----------------------------------------------------------------------------
   Всё, что делает этот файл, — необязательное улучшение.
   Без него страницы читаются целиком: никаких данных в JS не хранится,
   контент живёт в HTML. Никаких внешних библиотек.
   ========================================================================== */

(function () {
  'use strict';

  /**
   * Фильтр по категориям.
   * Разметка: контейнер [data-filter] с кнопками [data-filter-value]
   * и список, элементы которого помечены [data-cat].
   */
  function initFilters() {
    var panels = document.querySelectorAll('[data-filter]');

    Array.prototype.forEach.call(panels, function (panel) {
      var target = document.querySelector(panel.getAttribute('data-target'));
      if (!target) return;

      var items = target.querySelectorAll('[data-cat]');
      var buttons = panel.querySelectorAll('[data-filter-value]');
      var counter = panel.querySelector('[data-count]');

      function apply(value) {
        var shown = 0;

        Array.prototype.forEach.call(items, function (item) {
          var match = value === 'all' || item.getAttribute('data-cat') === value;
          item.classList.toggle('is-hidden', !match);
          // заголовки групп тоже помечены data-cat, но в счётчик не попадают
          if (match && item.classList.contains('entry')) shown++;
        });

        Array.prototype.forEach.call(buttons, function (btn) {
          btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter-value') === value));
        });

        if (counter) {
          counter.textContent = 'показано записей: ' + shown;
        }
      }

      Array.prototype.forEach.call(buttons, function (btn) {
        btn.addEventListener('click', function () {
          apply(btn.getAttribute('data-filter-value'));
        });
      });

      panel.removeAttribute('hidden');
      apply('all');

      // Ссылки указателя ведут к записям; если запись скрыта фильтром,
      // сбрасываем фильтр, чтобы переход действительно сработал.
      document.querySelectorAll('.toc a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function () {
          var target = document.getElementById(link.getAttribute('href').slice(1));
          if (target && target.classList.contains('is-hidden')) {
            apply('all');
          }
        });
      });
    });
  }

  /**
   * Плавный переход к записи, открытой по якорю, и отметка активной
   * позиции в указателе (CSS :target уже подсвечивает саму запись).
   */
  function focusTarget() {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (el && typeof el.focus === 'function') {
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  }

  /** Подпись «обновлено» в подвале — чтобы страница не врала о свежести. */
  function stampRevision() {
    var el = document.querySelector('[data-revised]');
    if (!el) return;
    el.textContent = el.getAttribute('data-revised');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initFilters();
      focusTarget();
      stampRevision();
    });
  } else {
    initFilters();
    focusTarget();
    stampRevision();
  }
})();
