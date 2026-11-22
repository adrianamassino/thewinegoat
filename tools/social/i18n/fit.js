// Localised builds only (loaded by ui.js): translated text is often longer than the English it replaces. When a
// slide/story text area overflows, shrink the font size of its text elements in 3% steps (at most to 80%) until it fits.
// Runs when the fonts are ready, before build.js measures and screenshots the page.
(function () {
  function fit() {
    document.querySelectorAll('.area,.st-area').forEach(function (a) {
      var els = Array.prototype.filter.call(a.querySelectorAll('*'), function (e) {
        return Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); });
      });
      var base = els.map(function (e) { return parseFloat(getComputedStyle(e).fontSize); });
      for (var f = 0.97; a.scrollHeight > a.clientHeight + 1 && f >= 0.8; f -= 0.03) {
        els.forEach(function (e, i) { e.style.fontSize = (base[i] * f).toFixed(1) + 'px'; });
      }
      // still too tall: shrink the drawings (inline SVG art, not the text blocks), down to 55%
      var art = Array.prototype.filter.call(a.querySelectorAll('svg'), function (g) { return !g.closest('.opts,.acts,.cta-line') && g.getBoundingClientRect().height > 60; });
      var aw = art.map(function (g) { return g.getBoundingClientRect().width; });
      for (var k = 0.9; a.scrollHeight > a.clientHeight + 1 && k >= 0.55; k -= 0.05) {
        art.forEach(function (g, i) { g.style.width = (aw[i] * k).toFixed(1) + 'px'; g.style.height = 'auto'; });
      }
      // never push the kicker/title out of the top: top-align a centred area that still overflows
      if (a.scrollHeight > a.clientHeight + 1) a.style.justifyContent = 'flex-start';
    });
  }
  // after the load event (images decoded, CSS fonts fetched) and once more when fonts report ready; fit() is idempotent
  var done = false;
  window.addEventListener('load', function () { document.fonts.ready.then(function () { if (!done) { done = true; fit(); } }); });
})();
