var scores = {};
var sectionMap = {1:1,2:1,3:1,4:1,5:2,6:2,7:2,8:2,9:3,10:3,11:3,12:3,13:4,14:4,15:4,16:4};
var circumference = 2 * Math.PI * 70;
var countTimer;

function rate(btn, qId, val) {
  var options = btn.parentElement.querySelectorAll('.rating-btn');
  for (var i = 0; i < options.length; i++) {
    options[i].classList.remove('selected');
  }
  btn.classList.add('selected');
  scores[qId] = val;
  var q = document.getElementById('q-' + qId);
  if (q) q.classList.add('answered');
  updateAll();
}

function updateAll() {
  var totals = {1:0,2:0,3:0,4:0};
  var counts = {1:0,2:0,3:0,4:0};
  var keys = Object.keys(scores);
  var answered = keys.length;

  for (var i = 0; i < keys.length; i++) {
    var q = parseInt(keys[i]);
    var s = sectionMap[q];
    totals[s] += scores[q];
    counts[s]++;
  }

  var total = 0;
  for (var s = 1; s <= 4; s++) {
    var scoreEl = document.getElementById('s' + s + '-score');
    var card = document.getElementById('card-' + s);
    var chip = document.getElementById('chip-' + s);
    var dot = document.getElementById('dot-' + s);
    if (counts[s] > 0) {
      if (scoreEl) scoreEl.textContent = totals[s];
      total += totals[s];
      if (counts[s] === 4) {
        if (card) card.classList.add('complete');
        if (chip) { chip.classList.remove('active'); chip.classList.add('complete'); }
        if (dot) { dot.classList.remove('partial'); dot.classList.add('done'); dot.textContent = String.fromCharCode(10003); }
      } else {
        if (card) card.classList.remove('complete');
        if (chip) { chip.classList.add('active'); chip.classList.remove('complete'); }
        if (dot) dot.classList.add('partial');
      }
    } else {
      if (scoreEl) scoreEl.textContent = String.fromCharCode(8212);
      if (card) card.classList.remove('complete');
    }
  }

  var pbFill = document.getElementById('pb-fill');
  var pbCount = document.getElementById('pb-count');
  if (pbFill) pbFill.style.width = (answered / 16 * 100) + '%';
  if (pbCount) pbCount.textContent = answered + ' / 16';

  var ringEl = document.getElementById('ring-fill');
  if (ringEl) {
    ringEl.style.strokeDasharray = circumference;
    ringEl.style.strokeDashoffset = circumference - (total / 80 * circumference);
    if (total >= 64) ringEl.style.stroke = '#34d399';
    else if (total >= 40) ringEl.style.stroke = '#fbbf24';
    else if (total > 0) ringEl.style.stroke = '#f87171';
    else ringEl.style.stroke = '#fbbf24';
  }

  animateCount('total-score', total);

  var solid = document.getElementById('tier-solid');
  var pains = document.getElementById('tier-pains');
  var emergency = document.getElementById('tier-emergency');
  if (solid) solid.classList.remove('visible');
  if (pains) pains.classList.remove('visible');
  if (emergency) emergency.classList.remove('visible');

  if (answered >= 12) {
    if (total >= 64 && solid) solid.classList.add('visible');
    else if (total >= 40 && pains) pains.classList.add('visible');
    else if (emergency) emergency.classList.add('visible');
  }

  if (answered === 16) launchConfetti();
}

function animateCount(id, target) {
  if (countTimer) clearInterval(countTimer);
  var el = document.getElementById(id);
  if (!el) return;
  var current = parseInt(el.textContent) || 0;
  var steps = 16;
  var step = 0;
  countTimer = setInterval(function() {
    step++;
    el.textContent = Math.round(current + (target - current) * step / steps);
    if (step >= steps) {
      el.textContent = target;
      clearInterval(countTimer);
    }
  }, 25);
}

function launchConfetti() {
  var colors = ['#fbbf24','#2563eb','#1a2744','#34d399','#f87171','#ffffff'];
  for (var i = 0; i < 80; i++) {
    (function(i) {
      setTimeout(function() {
        var el = document.createElement('div');
        el.classList.add('confetti-piece');
        el.style.left = (Math.random() * 100) + 'vw';
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.width = (Math.random() * 8 + 5) + 'px';
        el.style.height = (Math.random() * 8 + 5) + 'px';
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        el.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        document.body.appendChild(el);
        setTimeout(function() {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 4000);
      }, i * 25);
    })(i);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    var btn = e.target;
    if (btn && btn.classList.contains('rating-btn')) {
      var qId = parseInt(btn.getAttribute('data-qid'));
      var val = parseInt(btn.getAttribute('data-val'));
      if (qId && val) rate(btn, qId, val);
    }
  });
});
