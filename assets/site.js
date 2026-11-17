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
    var pct = calc.querySelector('[name=pct]');
    var share = calc.querySelector('[name=share]');
    var out = {
      paid: calc.querySelector('[data-out=paid]'),
      saved: calc.querySelector('[data-out=saved]'),
      payback: calc.querySelector('[data-out=payback]'),
      shareLbl: calc.querySelector('[data-out=share]'),
    };
    var price = Number(calc.dataset.price || 570);
    var ga = calc.dataset.lang === 'ga';
    var fmt = function (n) { return '€' + Math.round(n).toLocaleString('en-IE'); };
    var run = function () {
      var r = Math.max(0, Number(rate.value) || 0);
      var n = Math.max(0, Number(nightsIn.value) || 0);
      var p = Math.max(0, Number(pct.value) || 0) / 100;
      var s = Math.max(0, Number(share.value) || 0) / 100;
      var paid = r * n * p;
      var saved = paid * s;
      out.paid.textContent = fmt(paid);
      out.saved.textContent = fmt(saved);
      out.shareLbl.textContent = Math.round(s * 100) + '%';
      var perNight = r * p;
      var nightsToPay = perNight > 0 ? Math.ceil(price / perNight) : 0;
      out.payback.textContent = perNight > 0
        ? (ga ? nightsToPay + ' oíche curtha in áirithe go díreach' : nightsToPay + ' direct nights')
        : '–';
    };
    calc.addEventListener('input', run);
    run();
  }

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

  // ---- remember language choice ----
  document.querySelectorAll('a.lang').forEach(function (a) {
    a.addEventListener('click', function () { try { localStorage.setItem('lang', a.getAttribute('hreflang')); } catch (e) {} });
  });
})();
