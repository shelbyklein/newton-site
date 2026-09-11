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
  let bounds = root.getBoundingClientRect();
  const arcWidth = (width, depth) => Math.min(420, Math.max(160, width * .3)) * (.85 + depth * .3);
  const arcDepth = (height, depth) => Math.min(95, Math.max(42, height * .09)) * (.7 + depth * .4);
  const reset = () => {
    const { width, height } = bounds;
    particles = seeds.map(([x, y, speed, size, phase, depth], index) => ({
      bend: phase * 14 - 7, depth, flip: phase * 360,
      node: nodes[index], phase: phase * Math.PI * 2, roll: size * 360,
      size: 34 + size * 28, horizontalSpeed: 38 + speed * 22, fallSpeed: 6 + speed * 4,
      arcWidth: arcWidth(width, depth), arcDepth: arcDepth(height, depth),
      baseY: y * height - height * .1, x: x * width, y: 0, passes: 0,
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
    frame = 0;
    if (reducedMotion.matches || document.hidden || root.dataset.userPaused === 'true') return;
    const delta = Math.min(.05, (now - previous) / 1000);
    previous = now;
    const { width, height } = bounds;
    particles.forEach((leaf) => {
      // A raised cosine dips then lifts as x increases. The falling baseline
      // makes each successive U lower, without ever reversing horizontal travel.
      leaf.x += leaf.horizontalSpeed * delta;
      leaf.baseY += leaf.fallSpeed * delta;
      leaf.phase += leaf.horizontalSpeed / leaf.arcWidth * Math.PI * 2 * delta;
      leaf.y = leaf.baseY + leaf.arcDepth * (1 - Math.cos(leaf.phase)) / 2;
      leaf.roll += (28.8 + leaf.depth * 33.6) * delta;
      leaf.flip += (39.6 + leaf.depth * 60) * delta;
      leaf.bend = Math.sin(leaf.phase * 1.7) * (7 + leaf.depth * 10);
      if (leaf.x > width + leaf.size * 2 || leaf.y > height + leaf.size * 2) {
        // Re-enter beyond the left edge; never teleport across visible content.
        leaf.passes += 1;
        leaf.x = -leaf.size * 2;
        leaf.baseY = height * (.04 + ((leaf.depth + leaf.passes * .37) % 1) * .5);
        leaf.phase = 0;
        leaf.y = leaf.baseY;
      }
      draw(leaf);
    });
    frame = requestAnimationFrame(tick);
  };
  const start = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (reducedMotion.matches || document.hidden || root.dataset.userPaused === 'true') return;
    previous = performance.now();
    frame = requestAnimationFrame(tick);
  };
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener('change', start);
  new MutationObserver(start).observe(root, { attributes: true, attributeFilter: ['data-user-paused'] });
  new ResizeObserver(() => {
    const next = root.getBoundingClientRect();
    if (!next.width || !next.height) return;
    if (!bounds.width || !bounds.height) {
      bounds = next;
      reset();
      return;
    }
    particles.forEach(leaf => {
      leaf.x *= next.width / bounds.width;
      leaf.baseY *= next.height / bounds.height;
      leaf.arcWidth = arcWidth(next.width, leaf.depth);
      leaf.arcDepth = arcDepth(next.height, leaf.depth);
    });
    bounds = next;
  }).observe(root);
  reset();
  start();
})();
