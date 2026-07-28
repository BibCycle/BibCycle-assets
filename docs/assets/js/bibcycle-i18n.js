(function () {
  'use strict';

  function resolveLang() {
    var stored = localStorage.getItem('bibcycle-lang');
    if (stored) return stored;
    var browserLang = (navigator.language || '').toLowerCase();
    if (browserLang.indexOf('zh-cn') === 0 || browserLang.indexOf('zh-sg') === 0) return 'zh-CN';
    if (browserLang.indexOf('en') === 0) return 'en';
    return 'zh-TW';
  }

  function highlightWingTerm(text) {
    return text.replace(/翼使/g, '<span class="wing-term">翼使</span>');
  }

  function applyLang(lang) {
    window.activeLang = lang;
    localStorage.setItem('bibcycle-lang', lang);
    var common = window.BibCycleCommonDictionary || {};
    var page = window.BibCyclePageDictionary || {};
    var dict = Object.assign({}, common[lang] || {}, page[lang] || {});
    if (!Object.keys(dict).length) return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = dict[key];
      if (val === undefined) return;
      var isZh = lang === 'zh-TW' || lang === 'zh-CN';
      var shouldHighlightWingTerm = isZh && val.includes('翼使') && el.tagName !== 'TITLE' && key !== 'how-resource-btn' && !el.classList.contains('faq-q');
      if (el.getAttribute('data-i18n-html') === 'true') {
        el.innerHTML = shouldHighlightWingTerm ? highlightWingTerm(val) : val;
      } else if (shouldHighlightWingTerm) {
        el.innerHTML = highlightWingTerm(val);
      } else {
        el.textContent = val;
      }
    });

    document.documentElement.lang = lang === 'zh-TW' ? 'zh-TW' : lang === 'zh-CN' ? 'zh-CN' : 'en';
    var serif = lang === 'en' ? "'Noto Serif', serif" : (lang === 'zh-CN' ? "'Noto Serif SC', 'Noto Serif TC', serif" : "'Noto Serif TC', serif");
    document.documentElement.style.setProperty('--serif', serif);
    var sans = lang === 'en' ? "'Noto Sans', sans-serif" : (lang === 'zh-CN' ? "'Noto Sans SC', 'Noto Sans TC', sans-serif" : "'Noto Sans TC', sans-serif");
    document.documentElement.style.setProperty('--sans', sans);
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    window.BibCycleScroll?.refreshMetrics();
  }

  window.applyLang = applyLang;
  window.BibCycleI18n = { applyLang: applyLang };
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.getAttribute('data-lang')); });
  });
  applyLang(resolveLang());
}());
