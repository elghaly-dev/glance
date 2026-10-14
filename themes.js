(function () {
  var KEY = 'house-theme';
  var CHATTING = {
    bg: '#5a4fc0',
    bg2: '#6a5fd0',
    card: '#0d0b1f',
    card2: '#17142f',
    line: '#1c1838',
    line2: '#2e2856',
    text: '#ffffff',
    muted: '#b9b3e6',
    gold: '#c9c2ff',
    gold2: '#e2deff',
    dot: '#c9c2ff'
  };
  var THEMES = {
    midnight: CHATTING,
    dawn: { bg: '#f4f1ea', bg2: '#ebe6dc', card: '#fffaf3', card2: '#f5efe6', line: '#ddd6c8', line2: '#cfc7b8', text: '#1a1814', muted: '#5c574e', gold: '#0f766e', gold2: '#115e59', dot: '#0f766e' },
    nord: { bg: '#2e3440', bg2: '#3b4252', card: '#2e3440', card2: '#3b4252', line: '#434c5e', line2: '#4c566a', text: '#eceff4', muted: '#d8dee9', gold: '#88c0d0', gold2: '#8fbcbb', dot: '#88c0d0' },
    solarized: { bg: '#002b36', bg2: '#073642', card: '#073642', card2: '#0a4050', line: '#586e75', line2: '#657b83', text: '#eee8d5', muted: '#93a1a1', gold: '#b58900', gold2: '#cb4b16', dot: '#b58900' },
    dracula: { bg: '#282a36', bg2: '#343746', card: '#21222c', card2: '#282a36', line: '#44475a', line2: '#6272a4', text: '#f8f8f2', muted: '#bd93f9', gold: '#50fa7b', gold2: '#8be9fd', dot: '#bd93f9' },
    ocean: { bg: '#0b1c24', bg2: '#12262e', card: '#12262e', card2: '#183038', line: '#1f3a44', line2: '#2ec4b6', text: '#d8f3ff', muted: '#7fadb8', gold: '#2ec4b6', gold2: '#6fe0d4', dot: '#2ec4b6' }
  };
  var LABELS = { midnight: 'Midnight', dawn: 'Dawn', nord: 'Nord', solarized: 'Solarized', dracula: 'Dracula', ocean: 'Ocean' };
  var ORDER = ['midnight', 'dawn', 'nord', 'solarized', 'dracula', 'ocean'];

  function apply(name) {
    if (!(name in THEMES)) name = 'midnight';
    var t = THEMES[name];
    var r = document.documentElement;
    r.setAttribute('data-theme', name);
    r.style.setProperty('--bg', t.bg);
    r.style.setProperty('--bg-2', t.bg2 || t.bg);
    r.style.setProperty('--card', t.card);
    r.style.setProperty('--card-2', t.card2 || t.card);
    r.style.setProperty('--line', t.line);
    r.style.setProperty('--line-2', t.line2 || t.line);
    r.style.setProperty('--text', t.text);
    r.style.setProperty('--muted', t.muted);
    r.style.setProperty('--gold', t.gold);
    r.style.setProperty('--gold-2', t.gold2 || t.gold);
    try { localStorage.setItem(KEY, name); } catch (e) { /* ignore */ }
    document.querySelectorAll('[data-theme-item]').forEach(function (el) {
      el.classList.toggle('on', el.getAttribute('data-theme-item') === name);
    });
    var cur = document.getElementById('themeCur');
    if (cur) cur.textContent = LABELS[name];
  }

  function mount() {
    if (document.getElementById('themeMenu')) return;
    var wrap = document.createElement('div');
    wrap.className = 'theme-wrap';
    wrap.id = 'themeMenu';
    wrap.innerHTML = '<button type="button" class="theme-btn" id="themeOpen"><i class="theme-dot"></i><span id="themeCur">Midnight</span></button>';
    var panel = document.createElement('div');
    panel.className = 'theme-panel';
    panel.innerHTML = '<p>Choose theme</p>';
    ORDER.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'theme-item';
      b.setAttribute('data-theme-item', k);
      b.innerHTML = '<i style="background:' + THEMES[k].dot + '"></i><span>' + LABELS[k] + '</span><span class="ck">\u2713</span>';
      b.onclick = function () { apply(k); wrap.classList.remove('open'); };
      panel.appendChild(b);
    });
    wrap.appendChild(panel);
    var host = document.querySelector('.topbar .header-right') || document.querySelector('.topbar');
    if (host) host.appendChild(wrap);
    document.getElementById('themeOpen').onclick = function (e) { e.stopPropagation(); wrap.classList.toggle('open'); };
    document.addEventListener('click', function () { wrap.classList.remove('open'); });
  }

  var start = 'midnight';
  try { start = localStorage.getItem(KEY) || 'midnight'; } catch (e) { /* ignore */ }
  if (!(start in THEMES)) start = 'midnight';
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { mount(); apply(start); });
  } else {
    mount();
    apply(start);
  }
})();
