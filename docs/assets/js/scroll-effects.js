/* BibCycle Scroll System v2.1 — classic script, intentionally not a module. */
(function () {
  'use strict';

  var MOBILE_BREAKPOINT = 960;
  var DIRECTION_THRESHOLD = 8;
  var root = document.documentElement;
  var nav = document.querySelector('[data-scroll-nav]');
  var navInner = nav && nav.querySelector('[data-scroll-nav-inner]');
  var hero = document.querySelector('[data-scroll-hero]');
  var mobileCta = document.getElementById('mobile-cta-bar');
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var progressLine = null;
  var framePending = false;
  var metricsFramePending = false;
  var metrics = { documentHeight: 0, maxScroll: 0, heroBoundary: 0 };
  var directionTravel = 0;
  var lastTimestamp = performance.now();
  var navMode = resolveNavMode();
  var state = {
    y: window.scrollY || 0,
    lastY: window.scrollY || 0,
    delta: 0,
    direction: 'down',
    velocity: 0,
    progress: 0,
    atTop: true,
    pastHero: false,
    isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
    navMode: navMode,
    reduced: reducedMotionQuery.matches
  };

  function resolveNavMode() {
    if (!nav) return 'none';
    var mode = nav.getAttribute('data-scroll-nav-mode');
    if (!mode || mode === 'fixed' || mode === 'static') return mode || 'fixed';
    console.warn('BibCycleScroll: unrecognised nav mode on ' + (nav.id ? '#' + nav.id : nav.tagName.toLowerCase()) + '; using fixed.');
    return 'fixed';
  }

  function prefersReducedMotion() {
    return reducedMotionQuery.matches;
  }

  function scrollToEl(el, opts) {
    if (!el || typeof el.scrollIntoView !== 'function') return;
    var options = opts || {};
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: options.block || 'start',
      inline: options.inline || 'nearest'
    });
  }

  function scheduleMetrics() {
    if (metricsFramePending) return;
    metricsFramePending = true;
    requestAnimationFrame(function () {
      metricsFramePending = false;
      metrics.documentHeight = Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0);
      metrics.maxScroll = Math.max(0, metrics.documentHeight - window.innerHeight);
      metrics.heroBoundary = hero ? Math.max(hero.offsetHeight, 0.6 * window.innerHeight) : 0;
      scheduleFrame();
    });
  }

  function refreshMetrics() {
    scheduleMetrics();
  }

  function scheduleFrame() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(renderFrame);
  }

  function renderFrame(timestamp) {
    framePending = false;
    var y = window.scrollY || window.pageYOffset || 0;
    var delta = y - state.lastY;
    var elapsed = Math.max(1, timestamp - lastTimestamp);
    var absDelta = Math.abs(delta);

    if (absDelta > 0) {
      directionTravel += delta;
      if (Math.abs(directionTravel) > DIRECTION_THRESHOLD) {
        state.direction = directionTravel > 0 ? 'down' : 'up';
        directionTravel = 0;
      }
    }

    state.y = y;
    state.delta = delta;
    state.velocity = absDelta / elapsed;
    state.progress = Math.min(1, Math.max(0, y / Math.max(1, metrics.maxScroll)));
    state.atTop = y <= 60;
    state.isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    state.pastHero = !!hero && y > metrics.heroBoundary;

    /* Reads above are complete; writes begin here. */
    if (progressLine) {
      progressLine.style.setProperty('--scroll-progress', String(state.progress));
      progressLine.style.opacity = state.atTop ? '0' : '1';
    }
    if (nav && state.navMode === 'fixed') {
      nav.classList.toggle('scrolled', !state.atTop);
      if (state.isMobile) {
        nav.classList.remove('compact');
        if (!state.reduced && hero) nav.classList.toggle('is-hidden', state.direction === 'down' && state.pastHero);
        else nav.classList.remove('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
        if (!state.reduced) nav.classList.toggle('compact', !state.atTop && state.direction === 'down');
        else nav.classList.remove('compact');
      }
    }
    if (mobileCta) mobileCta.classList.toggle('visible', state.pastHero);

    state.lastY = y;
    lastTimestamp = timestamp;
  }

  function debouncedMetrics() {
    clearTimeout(debouncedMetrics.timer);
    debouncedMetrics.timer = setTimeout(refreshMetrics, 150);
  }

  window.addEventListener('scroll', function () {
    scheduleFrame();
  }, { passive: true });
  window.addEventListener('resize', debouncedMetrics, { passive: true });
  window.addEventListener('load', refreshMetrics, { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshMetrics);
  if (window.ResizeObserver) new ResizeObserver(debouncedMetrics).observe(document.documentElement);
  document.addEventListener('toggle', function (event) {
    if (event.target.closest && event.target.closest('#faq')) refreshMetrics();
  }, true);

  function updateReducedMotion(event) {
    state.reduced = event.matches;
    scheduleFrame();
  }
  if (reducedMotionQuery.addEventListener) reducedMotionQuery.addEventListener('change', updateReducedMotion);
  else reducedMotionQuery.addListener(updateReducedMotion);

  if (nav && nav.getAttribute('data-scroll-nav-mode') === 'fixed' && navInner) {
    navInner.addEventListener('transitionrun', function () { navInner.classList.add('is-transitioning'); });
    navInner.addEventListener('transitionend', function () { navInner.classList.remove('is-transitioning'); });
  }

  if (root.hasAttribute('data-scroll-progress')) {
    progressLine = document.createElement('div');
    progressLine.className = 'bibcycle-scroll-progress';
    progressLine.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressLine);
  }

  window.BibCycleScroll = {
    prefersReducedMotion: prefersReducedMotion,
    scrollToEl: scrollToEl,
    refreshMetrics: refreshMetrics,
    state: state
  };

  refreshMetrics();
  scheduleFrame();
}());
