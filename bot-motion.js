(() => {
  const start = () => {
    const regions = [...document.querySelectorAll('.motion-region')];
    if (!regions.length || regions.every(region => region.dataset.motionReady === 'true')) return;
    const controls = [...document.querySelectorAll('[data-motion-toggle]')];
    let paused = false;
    const updateVisibility = () => {
      for (const region of regions) {
        region.dataset.pageHidden = String(document.hidden);
      }
    };
    const updatePlayback = () => {
      for (const region of regions) region.dataset.userPaused = String(paused);
      for (const control of controls) {
        control.setAttribute('aria-pressed', String(paused));
        control.textContent = paused ? 'Resume animations' : 'Pause animations';
      }
    };
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          for (const entry of entries) entry.target.dataset.inView = String(entry.isIntersecting);
        }, { threshold: 0 })
      : null;
    for (const region of regions) {
      region.dataset.motionReady = 'true';
      if (observer) observer.observe(region);
      else region.dataset.inView = 'true';
    }
    updateVisibility();
    updatePlayback();
    document.addEventListener('visibilitychange', updateVisibility);
    for (const control of controls) {
      control.addEventListener('click', () => {
        paused = !paused;
        updatePlayback();
      });
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
