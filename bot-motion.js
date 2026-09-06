(() => {
  const start = () => {
    for (const region of document.querySelectorAll('.motion-region')) {
      if (region.dataset.motionReady === 'true') continue;
      region.dataset.motionReady = 'true';
      const control = region.querySelector('[data-motion-toggle]');
      const updateVisibility = () => {
        region.dataset.pageHidden = String(document.hidden);
      };
      updateVisibility();
      document.addEventListener('visibilitychange', updateVisibility);
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) => {
          region.dataset.inView = String(entry.isIntersecting);
        }, { threshold: 0 });
        observer.observe(region);
      } else {
        region.dataset.inView = 'true';
      }
      control?.addEventListener('click', () => {
        const paused = region.dataset.userPaused !== 'true';
        region.dataset.userPaused = String(paused);
        control.setAttribute('aria-pressed', String(paused));
        control.textContent = paused ? 'Resume animations' : 'Pause animations';
      });
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
