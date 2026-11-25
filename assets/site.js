// Shared front-end for studio + client sites. No dependencies.
(function () {
  'use strict';

  // ---- booking/contact forms: post to a form inbox, or hand over to WhatsApp/email ----
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var lang = form.dataset.lang || 'en';
    var arrive = form.querySelector('[data-arrive]');
    var depart = form.querySelector('[data-depart]');
    var roomSel = form.querySelector('[data-price-select]');
    var est = form.querySelector('[data-estimate]');
    var today = new Date();
    var iso = function (d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };

    if (arrive && depart) {
      arrive.min = iso(today);
      depart.min = iso(new Date(today.getTime() + 864e5));
      arrive.addEventListener('change', function () {
        if (!arrive.value) return;
        var next = new Date(arrive.value + 'T12:00:00');
        next.setDate(next.getDate() + 1);
        depart.min = iso(next);
        if (!depart.value || depart.value <= arrive.value) depart.value = iso(next);
        update();
      });
      depart.addEventListener('change', update);
      if (roomSel) roomSel.addEventListener('change', update);
    }

    function nights() {
      if (!arrive || !arrive.value || !depart || !depart.value) return 0;
      return Math.round((new Date(depart.value) - new Date(arrive.value)) / 864e5);
    }
    function update() {
      if (!est) return;
      var n = nights();
      var p = roomSel ? Number(roomSel.selectedOptions[0].dataset.price || 0) : 0;
      if (n <= 0) { est.textContent = ''; return; }
      var total = p ? '€' + (n * p).toLocaleString('en-IE') : '';
      if (lang === 'ga') est.textContent = n + ' oíche' + (total ? ' · thart ar ' + total : '');
      else est.textContent = n + ' night' + (n === 1 ? '' : 's') + (total ? ' · approx. ' + total : '');
    }

    // "Book now" buttons on room cards preselect that room
    document.querySelectorAll('[data-room]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (!roomSel) return;
        for (var i = 0; i < roomSel.options.length; i++) {
          if (roomSel.options[i].dataset.key === a.dataset.room) roomSel.selectedIndex = i;
        }
        update();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (depart && arrive && nights() <= 0) { depart.focus(); return; }
      var lines = [];
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === 'checkbox' || !el.value) return;
        data[el.name] = el.value;
        lines.push(el.name + ': ' + el.value);
      });
      var biz = form.dataset.biz || '';
      var head = {
        booking: lang === 'ga' ? 'Iarratas áirithinte – ' : 'Booking request – ',
        quote: lang === 'ga' ? 'Iarratas ar mheastachán – ' : 'Quote request – ',
        contact: lang === 'ga' ? 'Teachtaireacht – ' : 'Enquiry – ',
      }[form.dataset.kind] || '';
      var n = nights();
      if (n > 0) lines.push((lang === 'ga' ? 'Oícheanta: ' : 'Nights: ') + n);
      var text = head + biz + '\n\n' + lines.join('\n');
      var ok = form.querySelector('[data-ok]');
      var done = function () { if (ok) { ok.hidden = false; ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } };

      if (form.dataset.sample === '1') {
        // demo mode: show what the owner would receive, send nothing
        alert((lang === 'ga' ? 'Suíomh samplach é seo. Seo an teachtaireacht a gheobhadh an t-úinéir:\n\n' : 'This is a sample site. Here is the message the owner would receive:\n\n') + text);
        done();
        return;
      }
      if (form.dataset.endpoint) {
        data._subject = head + biz;
        fetch(form.dataset.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset(); done();
        }).catch(function () { handOff(text); });
        return;
      }
      handOff(text);
      done();
    });

    function handOff(text) {
      if (form.dataset.wa) {
        window.open('https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      } else if (form.dataset.email) {
        location.href = 'mailto:' + form.dataset.email + '?subject=' + encodeURIComponent(text.split('\n')[0]) + '&body=' + encodeURIComponent(text);
      }
    }
  });

  // ---- commission calculator (studio site) ----
  var calc = document.querySelector('[data-calc]');
  if (calc) {
    var rate = calc.querySelector('[name=rate]');
    var nightsIn = calc.querySelector('[name=nights]');
    var price = Number(calc.dataset.price || 570);
    var ga = calc.dataset.lang === 'ga';
    var fmt = function (n) { return '€' + Math.round(n).toLocaleString('en-IE'); };
    var run = function () {
      var paid = Math.max(0, Number(rate.value) || 0) * Math.max(0, Number(nightsIn.value) || 0) * 0.15;
      var r0 = Math.max(0, Number(rate.value) || 0);
      var perNight = r0 * 0.15 - (r0 * 0.015 + 0.25); // commission saved minus card fee
      var saved = Math.max(0, Math.round((Math.max(0, Number(nightsIn.value) || 0) / 4) * perNight / 10) * 10);
      calc.querySelector('[data-out=paid]').textContent = fmt(paid);
      calc.querySelector('[data-out=saved]').textContent = fmt(saved);
      var months = saved > 0 ? Math.ceil(price / (saved / 12)) : 0;
      calc.querySelector('[data-out=payback]').innerHTML = !saved ? '' : months <= 12
        ? (ga ? 'Chlúdódh do choigilt costas an tsuímh (€570) i thart ar <b>' + months + ' mí</b>. Ina dhiaidh sin, is airgead breise duit é, gach bliain.' : 'Your savings would cover the cost of the website (€570) in about <b>' + months + (months === 1 ? ' month' : ' months') + '</b>. After that, the savings are extra money for you, every year.')
        : months <= 24
        ? (ga ? 'Chlúdódh do choigilt costas an tsuímh (€570) i thart ar <b>' + months + ' mí</b>.' : 'Your savings would cover the cost of the website (€570) in about <b>' + months + ' months</b>.')
        : (ga ? 'Thógfadh sé thart ar <b>' + months + ' mí</b> an suíomh €570 a chlúdach. Is fiú fós é, ach tógfaidh sé tamall é a íoc as.' : 'It would take about <b>' + months + ' months</b> to cover the €570 website. It still pays off, just more slowly for a quieter B&B.');
    };
    calc.addEventListener('input', run);
    run();
  }

  // ---- open now / closed now (Irish time) ----
  document.querySelectorAll('.open-now[data-open]').forEach(function (el) {
    try {
      var spec = JSON.parse(el.dataset.open), ga = el.dataset.lang === 'ga';
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Dublin', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
      var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
      var now = Number(get('hour')) * 60 + Number(get('minute'));
      var today = spec[day], open = false, closes = '';
      if (today) { var r = today.split('-'), a = r[0].split(':'), b = r[1].split(':'); open = now >= a[0] * 60 + +a[1] && now < b[0] * 60 + +b[1]; closes = r[1]; }
      el.classList.add(open ? 'is-open' : 'is-closed');
      el.textContent = open ? (ga ? 'Oscailte anois · dúnann ag ' + closes : 'Open now · closes ' + closes) : (ga ? 'Dúnta anois' : 'Closed now');
      el.hidden = false;
    } catch (e) {}
  });

  // ---- reveal on scroll ----
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  // ---- header shadow after scrolling ----
  var top = document.querySelector('.top');
  if (top) { var onS = function () { top.classList.toggle('scrolled', window.scrollY > 10); }; addEventListener('scroll', onS, { passive: true }); onS(); }

  // ---- photo viewer: tap a photo to see it full size; swipe / arrows to move through its set ----
  var lbImgs = document.querySelectorAll('img[data-lb]');
  if (lbImgs.length) {
    var ga = document.documentElement.lang === 'ga';
    var box = document.createElement('div');
    box.className = 'lbox'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<button type="button" class="lb-x" aria-label="' + (ga ? 'Dún' : 'Close') + '">×</button>' +
      '<button type="button" class="lb-p" aria-label="' + (ga ? 'Roimhe seo' : 'Previous') + '">‹</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-n" aria-label="' + (ga ? 'Ar aghaidh' : 'Next') + '">›</button>';
    document.body.appendChild(box);
    var bImg = box.querySelector('img'), bCap = box.querySelector('figcaption'), set = [], at = 0, lastFocus = null;
    var show = function (i) {
      at = (i + set.length) % set.length;
      var el = set[at];
      bImg.src = el.getAttribute('data-full') || el.src; bImg.alt = el.alt;
      bCap.textContent = (el.alt ? el.alt + '  ·  ' : '') + (at + 1) + ' / ' + set.length;
      var nx = set[(at + 1) % set.length]; if (nx) { var pre = new Image(); pre.src = nx.getAttribute('data-full') || nx.src; }
    };
    var open = function (group, i) {
      set = Array.prototype.slice.call(document.querySelectorAll('img[data-lb="' + group + '"]'));
      if (!set.length) return;
      lastFocus = document.activeElement; box.hidden = false; document.documentElement.classList.add('lb-on');
      box.classList.toggle('single', set.length < 2); show(i || 0); box.querySelector('.lb-x').focus();
    };
    var close = function () { box.hidden = true; document.documentElement.classList.remove('lb-on'); bImg.removeAttribute('src'); if (lastFocus) lastFocus.focus(); };
    lbImgs.forEach(function (el) {
      el.tabIndex = 0; el.setAttribute('role', 'button');
      var go = function () { var g = el.getAttribute('data-lb'); var all = document.querySelectorAll('img[data-lb="' + g + '"]'); open(g, Array.prototype.indexOf.call(all, el)); };
      el.addEventListener('click', go);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    document.querySelectorAll('[data-lb-open]').forEach(function (b) { b.addEventListener('click', function () { open(b.getAttribute('data-lb-open'), 0); }); });
    box.querySelector('.lb-x').addEventListener('click', close);
    box.querySelector('.lb-p').addEventListener('click', function () { show(at - 1); });
    box.querySelector('.lb-n').addEventListener('click', function () { show(at + 1); });
    box.addEventListener('click', function (e) { if (e.target === box || e.target.tagName === 'FIGURE') close(); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(at - 1); else if (e.key === 'ArrowRight') show(at + 1);
    });
    var sx = null;
    box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(at + (dx < 0 ? 1 : -1)); sx = null; });
  }

  // ---- remember language choice ----
  document.querySelectorAll('a.lang').forEach(function (a) {
    a.addEventListener('click', function () { try { localStorage.setItem('lang', a.getAttribute('hreflang')); } catch (e) {} });
  });
})();
