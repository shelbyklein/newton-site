(() => {
  const root = document.querySelector('.falling-leaves');
  if (!root || root.dataset.particlesReady) return;
  root.dataset.particlesReady = 'true';
  const nodes = [...root.querySelectorAll('.falling-leaf')];
  const seeds = [
    [.04, .18, .72, .61, .17, .34], [.19, .57, .43, .37, .79, .72],
    [.35, .31, .84, .79, .43, .18], [.53, .75, .58, .49, .06, .91],
    [.71, .41, .94, .70, .62, .49], [.88, .08, .36, .54, .28, .81],
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let particles = [];
  let previous = performance.now();
  const reset = () => {
    const { width, height } = root.getBoundingClientRect();
    particles = seeds.map(([x, y, speed, size, phase, depth], index) => ({
      bend: phase * 14 - 7, depth, drift: (phase - .5) * .22, flip: phase * 360,
      node: nodes[index], phase: phase * Math.PI * 2, roll: size * 360,
      size: 34 + size * 28, speed: .45 + speed * .32, x: x * width, y: y * height - height * .35,
    }));
  };
  const draw = (leaf) => {
    leaf.node.style.transform = `translate3d(${leaf.x}px, ${leaf.y}px, 0) scale(${.68 + leaf.depth * .42})`;
    leaf.node.style.setProperty('--fall-leaf-bend', `${leaf.bend}deg`);
    leaf.node.style.setProperty('--fall-leaf-flip', `${leaf.flip}deg`);
    leaf.node.style.setProperty('--fall-leaf-roll', `${leaf.roll}deg`);
    leaf.node.style.setProperty('--fall-leaf-size', `${leaf.size}px`);
    leaf.node.style.setProperty('--fall-leaf-opacity', `${.07 + leaf.depth * .11}`);
  };
  const tick = (now) => {
    if (reducedMotion.matches || document.hidden) return;
    const delta = Math.min(32, now - previous) / 16.667;
    previous = now;
    const { width, height } = root.getBoundingClientRect();
    particles.forEach((leaf) => {
      leaf.phase += delta * (.028 + leaf.depth * .022);
      const breeze = Math.sin(leaf.phase) * (.28 + leaf.depth * .24);
      leaf.drift += (breeze - leaf.drift) * .012 * delta;
      leaf.x += leaf.drift * delta;
      leaf.y += leaf.speed * delta;
      leaf.roll += (.48 + leaf.depth * .56) * delta;
      leaf.flip += (.66 + leaf.depth) * delta;
      leaf.bend = Math.sin(leaf.phase * 1.7) * (7 + leaf.depth * 10);
      if (leaf.y > height + leaf.size * 2) {
        leaf.y = -leaf.size * (1 + leaf.depth);
        leaf.x = ((leaf.x + width * (.18 + leaf.depth * .23)) % (width + leaf.size)) - leaf.size;
      }
      if (leaf.x < -leaf.size * 2) leaf.x += width + leaf.size * 2;
      if (leaf.x > width + leaf.size) leaf.x -= width + leaf.size * 2;
      draw(leaf);
    });
    frame = requestAnimationFrame(tick);
  };
  const start = () => {
    cancelAnimationFrame(frame);
    if (reducedMotion.matches) return;
    previous = performance.now();
    reset();
    frame = requestAnimationFrame(tick);
  };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
  reducedMotion.addEventListener('change', start);
  window.addEventListener('resize', start, { passive: true });
  start();
})();
