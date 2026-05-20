/* owlos.fx — shared live-editor + tweak runtime
   © 2026 owlos s.r.o. · MIT License
   Source-of-truth: <script id="effect-source" type="text/x-effect"> in the
   detail page. fxEditor uses it for both iframe.srcdoc and the editor. */
function fxEditor(opts) {
  var iframe = document.getElementById('stage');
  var code   = document.getElementById('code');
  var ctrls  = opts.controls;
  var sourceEl = document.getElementById('effect-source');

  var state = {};
  var sourceHtml = sourceEl ? sourceEl.textContent.replace(/^\s*\n/, '').replace(/<\\\/script>/g, '</script>') : '';

  /* Initial render: srcdoc from inline source, editor from same */
  if (sourceHtml) {
    iframe.srcdoc = sourceHtml;
    code.value = sourceHtml;

    /* Parse default PARAMS for slider sync */
    var m = sourceHtml.match(/window\.PARAMS\s*=\s*window\.PARAMS\s*\|\|\s*(\{[\s\S]*?\});/);
    if (m) {
      try { state = (new Function('return ' + m[1]))(); } catch (e) { state = {}; }
    }
    ctrls.forEach(function(c){
      var el = document.getElementById(c.id);
      if (el && state[c.key] !== undefined) {
        el.value = state[c.key];
        var valEl = c.val ? document.getElementById(c.val) : null;
        if (valEl) valEl.textContent = c.format ? c.format(state[c.key]) : state[c.key];
      }
    });
  } else {
    code.value = '/* no <script id="effect-source"> found in this page */';
  }

  function pushLive(){
    var w = iframe.contentWindow;
    if (!w || !w.PARAMS) return;
    Object.keys(state).forEach(function(k){ w.PARAMS[k] = state[k]; });
    if (typeof w.__seed === 'function') w.__seed();
  }

  function syncEditor(){
    if (!sourceHtml) return;
    var keys = Object.keys(state);
    var body = keys.map(function(k){
      var v = state[k];
      var formatted = (typeof v === 'string') ? "'" + v + "'" : v;
      return '  ' + k + ': ' + formatted;
    }).join(',\n');
    var block = 'window.PARAMS = window.PARAMS || {\n' + body + '\n};';
    code.value = code.value.replace(/window\.PARAMS\s*=\s*window\.PARAMS\s*\|\|\s*\{[\s\S]*?\};/, block);
  }

  ctrls.forEach(function(c){
    var el = document.getElementById(c.id);
    if (!el) return;
    var valEl = c.val ? document.getElementById(c.val) : null;
    function update(){
      var v;
      if (el.type === 'range') v = parseFloat(el.value);
      else v = el.value;
      state[c.key] = v;
      if (valEl) valEl.textContent = c.format ? c.format(v) : v;
      pushLive();
      syncEditor();
    }
    el.addEventListener('input', update);
    if (el.tagName === 'SELECT') el.addEventListener('change', update);
  });

  document.getElementById('b-apply').addEventListener('click', function(){
    var html = code.value;
    var m = html.match(/window\.PARAMS\s*=\s*window\.PARAMS\s*\|\|\s*(\{[\s\S]*?\});/);
    if (m) {
      try {
        var parsed = (new Function('return ' + m[1]))();
        Object.keys(parsed).forEach(function(k){ state[k] = parsed[k]; });
        ctrls.forEach(function(c){
          var el = document.getElementById(c.id);
          if (el && state[c.key] !== undefined) {
            el.value = state[c.key];
            var valEl = c.val ? document.getElementById(c.val) : null;
            if (valEl) valEl.textContent = c.format ? c.format(state[c.key]) : state[c.key];
          }
        });
      } catch(e){}
    }
    iframe.srcdoc = html;
    toast('Applied — iframe reloaded');
  });

  var resetBtn = document.getElementById('b-reset');
  if (resetBtn) resetBtn.addEventListener('click', function(){
    code.value = sourceHtml;
    iframe.srcdoc = sourceHtml;
    /* re-parse defaults */
    var m = sourceHtml.match(/window\.PARAMS\s*=\s*window\.PARAMS\s*\|\|\s*(\{[\s\S]*?\});/);
    if (m) {
      try {
        state = (new Function('return ' + m[1]))();
        ctrls.forEach(function(c){
          var el = document.getElementById(c.id);
          if (el && state[c.key] !== undefined) {
            el.value = state[c.key];
            var valEl = c.val ? document.getElementById(c.val) : null;
            if (valEl) valEl.textContent = c.format ? c.format(state[c.key]) : state[c.key];
          }
        });
      } catch(e){}
    }
    toast('Reset to defaults');
  });

  document.getElementById('b-copy').addEventListener('click', function(){
    code.select();
    try {
      navigator.clipboard.writeText(code.value).then(function(){ toast('Copied — full HTML in clipboard'); });
    } catch (e) {
      document.execCommand('copy');
      toast('Copied to clipboard');
    }
  });

  document.getElementById('b-download').addEventListener('click', function(){
    var blob = new Blob([code.value || sourceHtml], { type:'text/html;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = opts.filename || 'effect.html';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 200);
    toast('Downloaded ' + (opts.filename || 'effect.html'));
  });

  function toast(msg){
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function(){ t.style.transition = 'opacity .3s'; t.style.opacity = '0'; }, 1600);
    setTimeout(function(){ t.remove(); }, 2000);
  }
}
