(() => {
  function init() {
    const trunk = document.querySelector('.tree-trunk');
    if (!trunk || trunk.dataset.ready) return;
    trunk.dataset.ready = 'true';

    function fitBark() {
      const tile = trunk.firstElementChild;
      if (!tile) return;
      const height = tile.getBoundingClientRect().height;
      if (!height) return;
      const count = Math.ceil(trunk.clientHeight / height) + 1;
      while (trunk.children.length < count) trunk.appendChild(tile.cloneNode());
      while (trunk.children.length > count) trunk.lastElementChild.remove();
    }

    // Alternating reflected strips join bottom-to-bottom, then top-to-top:
    // the exact same bark pixels meet, without a mismatched repeating edge.
    fitBark();
    if ('ResizeObserver' in window) new ResizeObserver(fitBark).observe(trunk);
    else window.addEventListener('resize', fitBark);
    window.addEventListener('load', fitBark, { once: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
