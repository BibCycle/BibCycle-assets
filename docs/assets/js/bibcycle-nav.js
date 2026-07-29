(function () {
  'use strict';
  var nav = document.querySelector('.bc-nav');
  if (!nav) return;
  var toggle = nav.querySelector('.bc-nav__toggle');
  var panel = document.getElementById(toggle && toggle.getAttribute('aria-controls'));
  if (!toggle || !panel) return;
  var desktop = window.matchMedia('(min-width: 960px)');
  var focusable = 'a[href], button:not([disabled])';

  function closeMenu(returnFocus) {
    nav.classList.remove('is-menu-open');
    document.body.classList.remove('bc-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }
  function openMenu() {
    nav.classList.add('is-menu-open');
    document.body.classList.add('bc-menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    var first = panel.querySelector(focusable);
    if (first) first.focus();
  }
  toggle.addEventListener('click', function () {
    if (toggle.getAttribute('aria-expanded') === 'true') closeMenu(false); else openMenu();
  });
  document.addEventListener('keydown', function (event) {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); return; }
    if (event.key !== 'Tab') return;
    var items = [toggle].concat(Array.prototype.slice.call(panel.querySelectorAll(focusable))).filter(function (el) { return !el.hasAttribute('hidden') && el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('pointerdown', function (event) {
    if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target)) closeMenu(false);
  });
  panel.addEventListener('click', function (event) {
    if (event.target === panel) closeMenu(false);
  });
  function onResize() { if (desktop.matches) closeMenu(false); }
  if (desktop.addEventListener) desktop.addEventListener('change', onResize); else desktop.addListener(onResize);
  window.addEventListener('resize', onResize, { passive: true });
}());
