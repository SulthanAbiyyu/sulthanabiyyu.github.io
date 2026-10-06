(function () {
  var root = document.getElementById('journey');
  var data = document.getElementById('journey-data');
  var card = document.getElementById('journey-card');
  if (!root || !data || !card) return;

  var N;
  try { N = JSON.parse(data.textContent); } catch (e) { return; }
  if (!N || !N.length) return;

  var LANES = { main: 0, research: 1, lab: 2 };
  var LANE_X = [14, 38, 62];
  var TEXT_X = 86;
  var W = 372;
  var ROW = { major: 34, minor: 26 };
  var NS = 'http://www.w3.org/2000/svg';

  // y positions: major rows breathe, minor rows sit tighter
  var ys = [], y = 14;
  for (var i = 0; i < N.length; i++) {
    var h = ROW[N[i].tier] || ROW.minor;
    y += h / 2;
    ys.push(y);
    y += h / 2;
  }
  var H = y + 10;

  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('class', 'journey-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Timeline of education, roles and projects');

  var idx = {};
  N.forEach(function (n, i) { idx[n.id] = i; });

  var edges = [];
  function edge(d, lane, dashed) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('class', 'journey-edge');
    p.setAttribute('stroke', 'var(--lane-' + lane + ')');
    if (dashed) p.setAttribute('stroke-dasharray', '3 3');
    p.dataset.lane = lane;
    edges.push(p); svg.appendChild(p);
  }

  // one spine per lane, from its first commit to its last
  Object.keys(LANES).forEach(function (lane) {
    var members = N.map(function (n, i) { return n.lane === lane ? i : -1; })
                   .filter(function (i) { return i >= 0; });
    if (!members.length) return;
    var x = LANE_X[LANES[lane]], xm = LANE_X[0];
    var a = members[0], b = members[members.length - 1];
    // a side lane breaks out of main one row above its first commit
    var startY = lane === 'main' ? ys[a] : ys[Math.max(a - 1, 0)];
    edge(lane === 'main'
      ? 'M' + x + ' ' + ys[a] + ' L' + x + ' ' + ys[b]
      : 'M' + xm + ' ' + startY + ' C' + xm + ' ' + (startY + 13) + ' ' + x + ' ' +
        (startY + 4) + ' ' + x + ' ' + (startY + 17) + ' L' + x + ' ' + ys[b],
      lane);
  });

  // the one inferred link: alignment research feeding the LLM work at LNK
  if (idx.anakbaik !== undefined && idx.lnk !== undefined) {
    var xr = LANE_X[1], xm2 = LANE_X[0], ya = ys[idx.anakbaik], yb = ys[idx.lnk];
    edge('M' + xr + ' ' + ya + ' C' + xr + ' ' + (ya + 14) + ' ' + xm2 + ' ' +
         (yb - 14) + ' ' + xm2 + ' ' + yb, 'research', true);
  }

  var nodes = [];
  N.forEach(function (n, i) {
    var x = LANE_X[LANES[n.lane] || 0], cy = ys[i];
    var h = ROW[n.tier] || ROW.minor;
    var major = n.tier === 'major';
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'journey-node is-' + n.tier);
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', n.url ? 'link' : 'button');
    g.setAttribute('aria-label', n.title + ', ' + n.year);
    g.dataset.lane = n.lane; g.dataset.i = i;
    g.innerHTML =
      '<rect class="journey-hit" x="0" y="' + (cy - h / 2) + '" width="' + W +
        '" height="' + h + '" fill="transparent"></rect>' +
      '<circle class="journey-halo" cx="' + x + '" cy="' + cy + '" r="' +
        (major ? 8 : 6.5) + '" stroke="var(--lane-' + n.lane + ')"></circle>' +
      '<circle class="journey-dot" cx="' + x + '" cy="' + cy + '" r="' +
        (major ? 4 : 2.8) + '" stroke="var(--lane-' + n.lane + ')"></circle>' +
      '<text class="journey-yr" x="' + TEXT_X + '" y="' + (cy - (major ? 4 : 3)) + '">' +
        n.year + '</text>' +
      '<text class="journey-lbl" x="' + TEXT_X + '" y="' + (cy + (major ? 9 : 8)) + '">' +
        (n.title.length > 42 ? n.title.slice(0, 41) + '…' : n.title) + '</text>';
    svg.appendChild(g); nodes.push(g);
  });

  var scroller = document.getElementById('journey-scroll') || root;
  var list = document.getElementById('journey-list');
  if (list) list.remove();
  scroller.appendChild(svg);

  var pinned = null;
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function show(i) {
    var n = N[i];
    root.classList.add('is-focused');
    nodes.forEach(function (g) { g.classList.toggle('is-on', +g.dataset.i === i); });
    edges.forEach(function (p) { p.classList.toggle('is-on', p.dataset.lane === n.lane); });
    var html = '<p class="journey-card-meta">' + esc(n.meta) + '</p>' +
      '<h3 class="journey-card-title">' + esc(n.title) + '</h3>';
    if (n.highlight) html += '<span class="journey-card-hl">' + esc(n.highlight) + '</span>';
    if (n.body && n.body.length) {
      html += '<ul>' + n.body.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>';
    }
    if (n.stack && n.stack.length) {
      html += '<div class="journey-card-stack">' +
        n.stack.map(function (s) { return '<em>' + esc(s) + '</em>'; }).join('') + '</div>';
    }
    if (n.url) html += '<a class="journey-card-link" href="' + esc(n.url) + '">Read more</a>';
    card.innerHTML = html;
    card.classList.add('is-visible');
  }
  function clear() {
    root.classList.remove('is-focused');
    nodes.forEach(function (g) { g.classList.remove('is-on'); });
    edges.forEach(function (p) { p.classList.remove('is-on'); });
    card.classList.remove('is-visible');
  }

  nodes.forEach(function (g) {
    var i = +g.dataset.i;
    g.addEventListener('mouseenter', function () { if (pinned === null) show(i); });
    g.addEventListener('focus', function () { show(i); });
    g.addEventListener('blur', function () { if (pinned === null) clear(); });
    // tap pins the detail, because touch has no hover
    g.addEventListener('click', function (e) {
      e.preventDefault();
      if (pinned === i) { pinned = null; clear(); } else { pinned = i; show(i); }
    });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (N[i].url) window.location.href = N[i].url; else show(i);
      }
    });
  });
  root.addEventListener('mouseleave', function () {
    if (pinned !== null) return;
    var a = document.activeElement;
    if (!a || !a.classList || !a.classList.contains('journey-node')) clear();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pinned !== null) { pinned = null; clear(); }
  });

  // The graph is taller than the box it sits in, so play through it once on load
  // to show there is more below. Any interaction ends it permanently.
  function playthrough() {
    var stopped = false;
    var max = 0;
    function stop() { stopped = true; }
    ['wheel', 'touchstart', 'pointerdown', 'mousemove', 'focusin', 'keydown']
      .forEach(function (ev) {
        scroller.addEventListener(ev, stop, { passive: true, once: true });
      });
    var DOWN = 6500, HOLD = 900, UP = 1800, t0 = null;
    function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function frame(ts) {
      if (stopped) return;
      if (t0 === null) t0 = ts;
      var e = ts - t0;
      if (e < DOWN) scroller.scrollTop = max * ease(e / DOWN);
      else if (e < DOWN + HOLD) scroller.scrollTop = max;
      else if (e < DOWN + HOLD + UP) scroller.scrollTop = max * (1 - ease((e - DOWN - HOLD) / UP));
      else { scroller.scrollTop = 0; return; }
      requestAnimationFrame(frame);
    }
    setTimeout(function () {
      // measured here, not at call time: the SVG has only just been laid out
      max = scroller.scrollHeight - scroller.clientHeight;
      if (stopped || max < 24) return;
      requestAnimationFrame(frame);
    }, 1600);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    edges.forEach(function (p, k) {
      var L = p.getTotalLength();
      p.style.setProperty('--len', L);
      p.style.setProperty('--d', (k * 130) + 'ms');
    });
    nodes.forEach(function (g, k) { g.style.setProperty('--d', (240 + k * 42) + 'ms'); });
    root.classList.add('is-drawing');
    playthrough();
  }
})();
