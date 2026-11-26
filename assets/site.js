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

    // ---- card payment (call mode): after the owner confirms by phone, the guest pays on a secure Stripe page ----
    var pay = form.querySelector('[data-pay]'), payAmt = form.querySelector('[data-pay-amt]'), payBtn = form.querySelector('[data-pay-btn]');
    if (payBtn) {
      var payErr = form.querySelector('[data-pay-err]');
      payBtn.addEventListener('click', function () {
        if (!arrive.value || !depart.value || nights() <= 0) { arrive.focus(); return; }
        if (form.dataset.sample === '1') { var demo = form.querySelector('[data-pay-demo]'); if (demo) { demo.hidden = false; demo.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } return; }
        var g = form.querySelector('select:not([data-price-select])');
        payBtn.disabled = true; payErr.hidden = true;
        fetch('/api/checkout', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: payBtn.dataset.slug, room: roomSel.selectedOptions[0].dataset.key, arrive: arrive.value, depart: depart.value, guests: g ? g.value : 2, lang: lang }),
        }).then(function (r) { return r.json(); }).then(function (j) {
          if (j.url) { location.href = j.url; return; }
          if (j.taken && form.refreshAvailability) form.refreshAvailability();
          throw new Error(j.error || '');
        }).catch(function (e) {
          payBtn.disabled = false;
          payErr.textContent = (e && e.message) || (lang === 'ga' ? 'Níorbh fhéidir an leathanach íocaíochta a oscailt. Glaoigh chun áirithint a dhéanamh, le do thoil.' : 'The payment page could not be opened. Please ring to book.');
          payErr.hidden = false;
        });
      });
    }
    form.querySelectorAll('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var el = b.parentNode.querySelector('[data-copy-v]');
        var v = el.hasAttribute('data-bt-ref') ? el.textContent : el.textContent.replace(/\s+/g, ''); // IBAN copied without spaces
        var done2 = function () { var t = b.textContent; b.textContent = lang === 'ga' ? 'Cóipeáilte ✓' : 'Copied ✓'; setTimeout(function () { b.textContent = t; }, 1500); };
        if (navigator.clipboard) navigator.clipboard.writeText(v).then(done2, done2); else done2();
      });
    });
    // live site: only show the card button once card payments really work (otherwise bank transfer / call, never an error)
    var cardPart = form.querySelector('[data-card-part]');
    if (cardPart && form.dataset.sample !== '1') {
      cardPart.hidden = true;
      var btBox = form.querySelector('[data-bt]');
      var noCard = function () {
        if (btBox) { btBox.open = true; btBox.querySelector('summary').textContent = lang === 'ga' ? 'Íoc le haistriú bainc' : 'Pay by bank transfer'; }
        else if (pay) pay.classList.add('pay-off');
      };
      fetch('/api/status?slug=' + encodeURIComponent(form.dataset.slug)).then(function (r) { return r.ok ? r.json() : {}; }).then(function (j) {
        if (j.card) cardPart.hidden = false; else noCard();
      }).catch(noCard);
    }
    var paidOk = form.querySelector('[data-paid]');
    if (paidOk && /[?&]paid=1/.test(location.search)) { paidOk.hidden = false; setTimeout(function () { paidOk.scrollIntoView({ block: 'center' }); }, 300); }

    function nights() {
      if (!arrive || !arrive.value || !depart || !depart.value) return 0;
      return Math.round((new Date(depart.value) - new Date(arrive.value)) / 864e5);
    }
    function update() {
      if (!est) return;
      var n = nights();
      var o = roomSel ? roomSel.selectedOptions[0].dataset : {};
      var p = Number(o.price || 0), ph = Number(o.priceHigh || 0), hi = (o.high || '').split(',').map(Number);
      if (n <= 0) { est.textContent = ''; return; }
      // add up night by night, so summer nights use the summer price
      var sum = 0, d = new Date(arrive.value + 'T12:00:00');
      for (var k = 0; k < n; k++) { sum += ph && hi.indexOf(d.getMonth() + 1) > -1 ? ph : p; d.setDate(d.getDate() + 1); }
      var total = p ? '€' + sum.toLocaleString('en-IE') : '';
      if (pay) { pay.hidden = !(p && sum > 0); if (payAmt) payAmt.textContent = total; }
      var bt = form.querySelector('[data-bt]');
      if (bt && arrive.value) {
        // reference shows room + arrival, e.g. "CF R1 18APR", so the owner knows the booking from the bank statement
        var a0 = new Date(arrive.value + 'T12:00:00'), rid = (o.id || '').replace(/^room/i, 'R').toUpperCase();
        var ref = [bt.dataset.btPrefix, rid, ('0' + a0.getDate()).slice(-2) + ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][a0.getMonth()]].filter(Boolean).join(' ');
        bt.querySelector('[data-bt-ref]').textContent = ref;
        bt.querySelector('[data-bt-amt]').textContent = total;
      }
      if (lang === 'ga') est.textContent = n + ' oíche' + (total ? ' · thart ar ' + total : '');
      else est.textContent = n + ' night' + (n === 1 ? '' : 's') + (total ? ' · approx. ' + total : '');
    }

    // ---- live availability calendar (Airbnb-style): booked nights greyed out, pick arrival then departure ----
    var calWrap = form.querySelector('[data-cal-wrap]');
    var cal = null; // { rooms: {id: Set of booked nights}, max: 'YYYY-MM-DD', mode: 'live'|'sample', date }
    var selA = null, selD = null, view = null;
    var ga = lang === 'ga';
    var MON = ga ? ['Eanáir', 'Feabhra', 'Márta', 'Aibreán', 'Bealtaine', 'Meitheamh', 'Iúil', 'Lúnasa', 'Meán Fómhair', 'Deireadh Fómhair', 'Samhain', 'Nollaig'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var WD = ga ? ['Lu', 'Má', 'Cé', 'Dé', 'Ao', 'Sa', 'Do'] : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    var DAYS = ga ? ['Domh', 'Luan', 'Máirt', 'Céad', 'Déar', 'Aoine', 'Sath'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var addD = function (s, n) { var d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); };
    var nice = function (s) { var d = new Date(s + 'T12:00:00'); return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()].slice(0, ga ? 20 : 3); };
    var todayS = iso(today);
    var roomIds = roomSel ? Array.prototype.slice.call(roomSel.options).filter(function (o) { return o.dataset.id; }).map(function (o) { return o.dataset.id; }) : [];
    var curId = function () { return roomSel && roomSel.selectedOptions[0].dataset.id || ''; };
    // a night is booked for "any room" only if every room is booked
    var booked = function (d, id) {
      if (!cal) return false;
      if (d < todayS || d > cal.max) return true;
      if (id) return cal.rooms[id] ? cal.rooms[id].has(d) : false;
      return roomIds.every(function (r) { return cal.rooms[r] && cal.rooms[r].has(d); });
    };
    var freeRange = function (a, d, id) { for (var x = a; x < d; x = addD(x, 1)) if (booked(x, id)) return false; return true; };
    var firstFree = function (id) { for (var x = todayS; x <= cal.max; x = addD(x, 1)) if (!booked(x, id)) return x; return null; };

    function setDates() {
      arrive.value = selA || ''; depart.value = selD || '';
      update();
      var pick = form.querySelector('[data-cal-pick]');
      if (!selA) pick.textContent = ga ? 'Roghnaigh do dháta teachta' : 'Choose your arrival date';
      else if (!selD) pick.innerHTML = (ga ? 'Teacht ' : 'Arriving ') + '<b>' + nice(selA) + '</b>. ' + (ga ? 'Anois roghnaigh do dháta imeachta' : 'Now choose your departure date');
      else { var n = nights(); pick.innerHTML = '<b>' + nice(selA) + ' → ' + nice(selD) + '</b> · ' + n + (ga ? ' oíche' : n === 1 ? ' night' : ' nights'); }
      showFreeRooms();
    }
    function showFreeRooms() {
      var box = form.querySelector('[data-free-rooms]');
      if (!box) { box = document.createElement('div'); box.className = 'free-rooms'; box.setAttribute('data-free-rooms', ''); est.parentNode.insertBefore(box, est.nextSibling); }
      box.innerHTML = '';
      if (!cal || !selA || !selD || curId()) { box.hidden = true; return; }
      var opts = Array.prototype.slice.call(roomSel.options).filter(function (o) { return o.dataset.id && freeRange(selA, selD, o.dataset.id); });
      box.hidden = false;
      if (!opts.length) { box.innerHTML = '<p>' + (ga ? 'Níl aon seomra saor do na dátaí sin.' : 'No room is free for all of those nights.') + '</p>'; return; }
      box.innerHTML = '<p>' + (ga ? 'Saor do do dhátaí, roghnaigh seomra:' : 'Free for your dates. Choose a room:') + '</p>';
      opts.forEach(function (o) {
        var b2 = document.createElement('button'); b2.type = 'button'; b2.className = 'fr-btn'; b2.textContent = o.textContent;
        b2.addEventListener('click', function () { roomSel.value = o.value; roomSel.dispatchEvent(new Event('change')); });
        box.appendChild(b2);
      });
    }
    function render() {
      var host = form.querySelector('[data-cal]');
      var count = calWrap.clientWidth >= 560 ? 2 : 1;
      var id = curId(), html = '';
      for (var m = 0; m < count; m++) {
        var first = new Date(view.getFullYear(), view.getMonth() + m, 1, 12);
        html += '<div class="cal-m"><p class="cal-mt">' + MON[first.getMonth()] + ' ' + first.getFullYear() + '</p><div class="cal-g">';
        WD.forEach(function (w) { html += '<span class="cal-wd">' + w + '</span>'; });
        for (var k = 0; k < (first.getDay() + 6) % 7; k++) html += '<span></span>';
        for (var dd = new Date(first); dd.getMonth() === first.getMonth(); dd.setDate(dd.getDate() + 1)) {
          var s = iso(dd), cls = 'cal-d', dis = false;
          var isB = booked(s, id);
          if (s < todayS || s > cal.max) { cls += ' past'; dis = true; }
          else if (selA && !selD && s > selA) { if (!freeRange(selA, s, id)) { cls += ' na'; dis = true; } else if (isB) cls += ' co'; }
          else if (isB && s !== selD) { cls += ' bk'; dis = true; }
          if (s === selA) cls += ' sa'; if (s === selD) cls += ' sd';
          if (selA && selD && s > selA && s < selD) cls += ' in';
          if (s === todayS) cls += ' td';
          html += '<button type="button" class="' + cls + '" data-d="' + s + '"' + (dis ? ' disabled' : '') + '>' + dd.getDate() + '</button>';
        }
        html += '</div></div>';
      }
      host.innerHTML = html;
      var vNow = new Date(today.getFullYear(), today.getMonth(), 1, 12);
      form.querySelector('[data-cal-prev]').disabled = view <= vNow;
      var last = new Date(cal.max + 'T12:00:00');
      form.querySelector('[data-cal-next]').disabled = new Date(view.getFullYear(), view.getMonth() + count, 1, 12) > last;
    }
    function pickDay(s) {
      var id = curId();
      if (selA && !selD && s > selA && freeRange(selA, s, id)) selD = s;
      else if (!booked(s, id)) { selA = s; selD = null; }
      setDates(); render();
    }
    function startCal(data, mode) {
      cal = { rooms: {}, max: data.max || addD(todayS, 365), mode: mode, date: data.date };
      Object.keys(data.rooms || {}).forEach(function (id) {
        var set = new Set();
        data.rooms[id].forEach(function (r) { for (var x = r[0]; x < r[1]; x = addD(x, 1)) set.add(x); });
        cal.rooms[id] = set;
      });
      calWrap.hidden = false;
      form.classList.add('has-cal');
      var h = form.querySelector('[data-pb-h]'); if (h) h.textContent = h.dataset.liveText;
      var ff = firstFree(curId()) || todayS;
      view = new Date(ff.slice(0, 4), Number(ff.slice(5, 7)) - 1, 1, 12);
      form.querySelector('[data-cal-status]').innerHTML = mode === 'live'
        ? (ga ? '✓ Infhaighteacht bheo: nuashonraítear go huathoibríoch é ó Airbnb, Booking.com agus ón suíomh seo.' : '✓ Live availability: updated automatically from Airbnb, Booking.com and this website.')
        : (ga ? '<b>Suíomh samplach:</b> féilire fíor Airbnb Mary ar ' + nice(data.date) + '. Ar an suíomh beo, nuashonraíonn sé é féin ó Airbnb, Booking.com agus ón suíomh seo.' : '<b>Sample site:</b> Mary’s real Airbnb calendar on ' + nice(data.date) + ' ' + data.date.slice(0, 4) + '. On the live site it updates by itself from Airbnb, Booking.com and this website.');
      // "Next available" on each room card
      Array.prototype.slice.call(roomSel.options).forEach(function (o) {
        if (!o.dataset.id) return;
        var btn = document.querySelector('.card .btn[data-room="' + o.dataset.key.replace(/"/g, '\\"') + '"]');
        if (!btn) return;
        var old = btn.parentNode.querySelector('.avail-chip'); if (old) old.remove();
        var f = firstFree(o.dataset.id);
        var chip = document.createElement('p'); chip.className = 'avail-chip' + (f === todayS ? ' now' : '');
        chip.textContent = f ? (f === todayS ? (ga ? 'Saor anocht' : 'Free tonight') : (ga ? 'An chéad oíche shaor: ' : 'Next available: ') + nice(f) + (f.slice(0, 4) !== todayS.slice(0, 4) ? ' ' + f.slice(0, 4) : '')) : (ga ? 'Lán' : 'Fully booked');
        btn.parentNode.insertBefore(chip, btn);
      });
      setDates(); render();
    }
    if (calWrap) {
      form.querySelector('[data-cal]').addEventListener('click', function (e) { var t = e.target.closest('[data-d]'); if (t && !t.disabled) pickDay(t.dataset.d); });
      form.querySelector('[data-cal-prev]').addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1, 12); render(); });
      form.querySelector('[data-cal-next]').addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1, 12); render(); });
      roomSel.addEventListener('change', function () {
        if (!cal) return;
        if (selA && (booked(selA, curId()) || (selD && !freeRange(selA, selD, curId())))) { selA = selD = null; }
        if (!selA) { var ff = firstFree(curId()); if (ff) view = new Date(ff.slice(0, 4), Number(ff.slice(5, 7)) - 1, 1, 12); }
        setDates(); render();
      });
      addEventListener('resize', function () { if (cal) render(); });
      if (form.dataset.snapshot) {
        try { var sn = JSON.parse(form.dataset.snapshot); startCal({ rooms: sn.rooms, date: sn.date, max: sn.max || addD(sn.date, 338) }, 'sample'); } catch (e) {}
      } else {
        fetch('/api/availability?slug=' + encodeURIComponent(form.dataset.slug)).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
          if (j && j.live) startCal({ rooms: j.rooms, date: j.updated.slice(0, 10) }, 'live');
        }).catch(function () {});
      }
    }
    form.refreshAvailability = function () {
      if (!calWrap || form.dataset.snapshot) return;
      fetch('/api/availability?slug=' + encodeURIComponent(form.dataset.slug), { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (j && j.live) { selA = selD = null; startCal({ rooms: j.rooms, date: j.updated.slice(0, 10) }, 'live'); }
      }).catch(function () {});
    };

    // "Book now" buttons on room cards preselect that room
    document.querySelectorAll('[data-room]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (!roomSel) return;
        for (var i = 0; i < roomSel.options.length; i++) {
          if (roomSel.options[i].dataset.key === a.dataset.room) roomSel.selectedIndex = i;
        }
        roomSel.dispatchEvent(new Event('change'));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var noDates = depart && arrive && nights() <= 0;
      if (noDates && !(form.dataset.call && form.classList.contains('has-cal'))) { depart.focus(); return; }
      if (form.dataset.call && noDates) {
        // calendar mode, no dates picked: just ring (e.g. with a question)
        var cc = form.querySelector('[data-call-card]'), ul0 = form.querySelector('[data-call-lines]');
        ul0.innerHTML = '<li>' + (lang === 'ga' ? 'Cuir do cheist' : 'Ask your question') + '</li>';
        cc.hidden = false; cc.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        if (form.dataset.sample !== '1') setTimeout(function () { location.href = 'tel:' + form.dataset.call; }, 500);
        return;
      }
      if (form.dataset.call) {
        // call mode: show the guest what to say, then ring the owner's phone
        var fmtD = function (v) {
          var d = new Date(v + 'T12:00:00');
          if (lang !== 'ga') return d.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
          var days = ['Domhnach', 'Luan', 'Máirt', 'Céadaoin', 'Déardaoin', 'Aoine', 'Satharn'];
          var months = ['Eanáir', 'Feabhra', 'Márta', 'Aibreán', 'Bealtaine', 'Meitheamh', 'Iúil', 'Lúnasa', 'Meán Fómhair', 'Deireadh Fómhair', 'Samhain', 'Nollaig'];
          return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
        };
        var nn = nights(), g = form.querySelector('select:not([data-price-select])'), room = roomSel && roomSel.value;
        var say = lang === 'ga'
          ? ['Teacht: ' + fmtD(arrive.value), 'Imeacht: ' + fmtD(depart.value) + ' (' + nn + ' oíche)', 'Aíonna: ' + (g ? g.value : ''), 'Seomra: ' + (room || 'ar bith')]
          : ['Arriving ' + fmtD(arrive.value), 'Leaving ' + fmtD(depart.value) + ' (' + nn + ' night' + (nn === 1 ? '' : 's') + ')', (g ? g.value : '') + (g && g.value === '1' ? ' guest' : ' guests'), room ? room : 'Any room'];
        var ul = form.querySelector('[data-call-lines]'), card = form.querySelector('[data-call-card]');
        ul.innerHTML = '';
        say.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
        card.hidden = false;
        card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        if (form.dataset.sample !== '1') setTimeout(function () { location.href = 'tel:' + form.dataset.call; }, 700);
        return;
      }
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
