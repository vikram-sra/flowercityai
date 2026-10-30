// Ported from Waveism (waveism.duar.one). The hero is the "Sensitivity" scene from
// modules/chaos.html: a crystalline icosahedron wireframe whose vertices diverge
// exponentially while it is disturbed, then heal. A Byotone-style dust cloud morphs
// into a different Waveism model for each chapter and drifts away from the pointer.
import {
  AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Group, IcosahedronGeometry,
  LineBasicMaterial, LineSegments, PerspectiveCamera, Points, Quaternion, Scene, ShaderMaterial, Vector3, WebGLRenderer, WireframeGeometry,
} from 'three';

const CALM = new Color(0xacffce);
const STRESSED = new Color(0xff9c8a);
const MAX_CHAOS = 1.9;
const MORPH_SECONDS = 3.6;

function gaussian() {
  return Math.sqrt(-2 * Math.log(Math.random() || 1e-6)) * Math.cos(2 * Math.PI * Math.random());
}

// ---- Waveism models, each returning `count` points sized to fit a ~32-unit radius ----
function ring(count) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2, r = 36 + gaussian() * 4.5;
    out.set([Math.cos(a) * r, Math.sin(a) * r, gaussian() * 5], i * 3);
  }
  return out;
}
// chaos.html · Lorenz attractor (σ=10, ρ=28, β=8/3), sampled along one RK4 trajectory.
function lorenz(count) {
  const out = new Float32Array(count * 3);
  const f = (x, y, z) => [10 * (y - x), x * (28 - z) - y, x * y - (8 / 3) * z];
  let p = [0.1, 0, 0];
  const dt = 0.005, stride = 3;
  for (let step = 0, i = 0; i < count; step++) {
    const k1 = f(...p), k2 = f(p[0] + k1[0] * dt / 2, p[1] + k1[1] * dt / 2, p[2] + k1[2] * dt / 2);
    const k3 = f(p[0] + k2[0] * dt / 2, p[1] + k2[1] * dt / 2, p[2] + k2[2] * dt / 2), k4 = f(p[0] + k3[0] * dt, p[1] + k3[1] * dt, p[2] + k3[2] * dt);
    p = p.map((v, j) => v + dt / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    if (step > 800 && step % stride === 0) { out.set([p[0] * 0.95 + gaussian() * 0.15, (p[2] - 25) * 0.95, p[1] * 0.5], i * 3); i++; }
  }
  return out;
}
// resonance.html · Chladni plate: particles gather on the nodal lines of a degenerate (n,m) mode.
function chladni(count, n = 3, m = 5) {
  const out = new Float32Array(count * 3);
  const amp = (u, v) => Math.sin(n * Math.PI * u) * Math.sin(m * Math.PI * v) - Math.sin(m * Math.PI * u) * Math.sin(n * Math.PI * v);
  for (let i = 0; i < count;) {
    const u = Math.random(), v = Math.random();
    if (Math.abs(amp(u, v)) > 0.05) continue;
    out.set([(u - 0.5) * 60, (v - 0.5) * 60, gaussian() * 0.6], i * 3); i++;
  }
  return out;
}
// wave_theory.html · a single disturbance spreading as a calm radial wave.
function ripple(count) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(Math.random()) * 36, a = Math.random() * Math.PI * 2;
    out.set([Math.cos(a) * r, Math.sin(r * 0.42) * 4 * Math.exp(-r / 40), Math.sin(a) * r], i * 3);
  }
  return out;
}
// wormhole.html · Morris–Thorne embedding r(l) = √(l² + b₀²): a traversable shortcut.
function wormhole(count, throat = 7) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const l = (Math.random() * 2 - 1) * 30, a = Math.random() * Math.PI * 2, r = Math.sqrt(l * l + throat * throat) * 0.9;
    out.set([Math.cos(a) * r, l, Math.sin(a) * r], i * 3);
  }
  return out;
}
// cosmic.html · a two-armed spiral galaxy: growth from a small bright core.
function galaxy(count) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.7) * 34, arm = (i % 2) * Math.PI;
    const a = arm + r * 0.22 + gaussian() * 0.32 / (r * 0.06 + 0.5);
    out.set([Math.cos(a) * r, Math.sin(a) * r, gaussian() * 1.6 * (1 - r / 40)], i * 3);
  }
  return out;
}
// fabric.html · the metric well: a mass bending the grid of space beneath it.
function well(count) {
  const out = new Float32Array(count * 3), side = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const x = ((i % side) / (side - 1) - 0.5) * 70, z = (Math.floor(i / side) / (side - 1) - 0.5) * 70, r = Math.hypot(x, z);
    out.set([x + gaussian() * 0.12, -90 / (r + 7) + 6, z + gaussian() * 0.12], i * 3);
  }
  return out;
}

// Per chapter: model, resting tilt [x, y, z], which axis it slowly turns on, and whether the wireframe shows.
const CHAPTERS = {
  A: { shape: 'ring', tilt: [0, 0, 0], spin: 'z', wire: true },
  B: { shape: 'lorenz', tilt: [0.15, 0, 0], spin: 'y' },
  C: { shape: 'chladni', tilt: [-0.35, 0, 0], spin: 'z' },
  D: { shape: 'ripple', tilt: [0.55, 0, 0], spin: 'y' },
  E: { shape: 'wormhole', tilt: [0.25, 0, 1.25], spin: 'y' },
  F: { shape: 'galaxy', tilt: [-0.9, 0, 0], spin: 'z' },
  G: { shape: 'well', tilt: [0.45, 0, 0], spin: 'y' },
  H: { shape: 'ring', tilt: [0, 0, 0], spin: 'z', wire: true },
};
const BUILDERS = { ring, lorenz, chladni, ripple, wormhole, galaxy, well };

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const approach = (value, target, rate, dt) => value + (target - value) * (1 - Math.exp(-rate * dt));

export function createChaosField(canvas, { grabZone, onFrame, reduced = false, startChaos = 1 } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  // 1.5× is visually identical for soft dots and thin lines, at roughly half the pixels of 2×.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(60, 1, 0.1, 2000);

  // Sensitivity wireframe
  const group = new Group();
  scene.add(group);
  const wire = new WireframeGeometry(new IcosahedronGeometry(20, 4));
  const material = new LineBasicMaterial({ color: CALM.clone(), transparent: true, opacity: 0.42, depthTest: false });
  const mesh = new LineSegments(wire, material);
  const original = wire.attributes.position.array.slice();
  group.add(mesh);

  // Morphing dust
  const count = window.innerWidth < 700 ? 3500 : 7000;
  const shapes = {};
  // Every model is scaled so its 95th-percentile radius is the same, so shapes feel proportional.
  const shapeFor = (name) => {
    if (shapes[name]) return shapes[name];
    const built = BUILDERS[name](count);
    if (name !== 'ring') {
      const radii = new Float32Array(count);
      for (let i = 0; i < count; i++) radii[i] = Math.hypot(built[i * 3], built[i * 3 + 1], built[i * 3 + 2]);
      radii.sort();
      const k = 33 / Math.max(1, radii[Math.floor(count * 0.95)]);
      for (let i = 0; i < built.length; i++) built[i] *= k;
    }
    return (shapes[name] = built);
  };
  const from = shapeFor('ring').slice(), to = shapeFor('ring'), base = from.slice();
  const offset = new Float32Array(count * 3);
  const rnd = Float32Array.from({ length: count }, Math.random);
  const delay = new Float32Array(count);
  const dustGeometry = new BufferGeometry();
  const positions = new Float32BufferAttribute(from.slice(), 3);
  dustGeometry.setAttribute('position', positions);
  dustGeometry.setAttribute('aSeed', new Float32BufferAttribute(rnd, 1));
  const dustMaterial = new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSize: { value: 3.4 }, uRatio: { value: renderer.getPixelRatio() }, uOpacity: { value: 1.0 }, uDensity: { value: 0.4 } },
    vertexShader: `
      attribute float aSeed; uniform float uTime, uSize, uRatio; varying float vSeed; varying float vDepth;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float breathe = 1.0 + 0.18 * sin(uTime * 0.7 + aSeed * 6.2831);
        gl_PointSize = uSize * uRatio * (0.55 + aSeed * 0.9) * breathe * (62.0 / -mv.z);
        vSeed = aSeed; vDepth = clamp((mv.z + 100.0) / 60.0, 0.0, 1.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uOpacity, uDensity; varying float vSeed; varying float vDepth;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float soft = smoothstep(0.5, 0.0, d);
        float keep = 1.0 - smoothstep(uDensity - 0.08, uDensity, vSeed);
        gl_FragColor = vec4(vec3(1.0), soft * keep * uOpacity * (0.6 + vSeed * 0.4) * (0.7 + vDepth * 0.3));
      }`,
    transparent: true, depthWrite: false, blending: AdditiveBlending,
  });
  const dust = new Points(dustGeometry, dustMaterial);
  scene.add(dust);

  const state = {
    chaos: reduced ? 0 : startChaos, shown: reduced ? 0 : startChaos, dragging: false, lastX: 0, lastY: 0, dragX: 0.2, dragY: 0, time: 0,
    chapter: CHAPTERS.A, target: to, dir: 1, morph: 1, wire: 1,
    tilt: [0, 0, 0], spinY: 0, spinZ: 0, spinVelocity: 0,
    pointerX: 0, pointerY: 0, lookX: 0, lookY: 0, pointerActive: false, lastPointer: 0,
    lastScroll: window.scrollY,
  };
  group.rotation.x = state.dragX;

  function resize() {
    const width = window.innerWidth, height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 1 ? 62 / Math.max(camera.aspect, 0.5) * 0.72 : 62;
    camera.updateProjectionMatrix();
    if (reduced) renderer.render(scene, camera);
  }

  // dir: 1 when scrolling down (the new shape sweeps in from the bottom, like the page),
  // -1 when scrolling up (it sweeps in from the top).
  function setShape(letter, dir = 1) {
    const chapter = CHAPTERS[letter];
    if (!chapter || chapter === state.chapter) return;
    state.dir = dir;
    const next = shapeFor(chapter.shape);
    from.set(base);
    state.target = next;
    state.chapter = chapter;
    state.morph = 0;
    for (let i = 0; i < count; i++) {
      const y = Math.max(-40, Math.min(40, next[i * 3 + 1])) / 80 + 0.5; // 0 = bottom, 1 = top
      delay[i] = (dir > 0 ? y : 1 - y) * 0.3 + rnd[i] * 0.05;
    }
    if (reduced) { base.set(next); state.morph = 1; state.tilt = [...chapter.tilt]; state.wire = chapter.wire ? 1 : 0; draw(0); renderer.render(scene, camera); }
  }

  // Pointer in the dust's local space, plus the camera's view direction in that space.
  const pointerLocal = new Vector3(), viewLocal = new Vector3(), inverse = new Quaternion();
  function updatePointerLocal() {
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    pointerLocal.set(state.pointerX * halfH * camera.aspect, state.pointerY * halfH, 0);
    dust.updateMatrixWorld();
    dust.worldToLocal(pointerLocal);
    viewLocal.set(0, 0, -1).applyQuaternion(inverse.copy(dust.quaternion).invert());
  }

  function draw(dt) {
    // Morph: each particle sets off at its own moment, so shapes flow rather than snap.
    dustMaterial.uniforms.uTime.value = state.time;
    const u = dustMaterial.uniforms.uOpacity;
    u.value = approach(u.value, state.chapter.wire ? 0.85 : 0.55, 1.2, dt);
    const density = dustMaterial.uniforms.uDensity;
    density.value = approach(density.value, state.chapter.wire ? 0.4 : 1.08, 1.2, dt);
    const morphing = state.morph < 1;
    if (morphing) {
      state.morph = Math.min(1, state.morph + dt / MORPH_SECONDS);
      const target = state.target;
      for (let i = 0; i < count; i++) {
        const t = ease(Math.min(1, Math.max(0, (state.morph - delay[i]) / 0.62)));
        const j = i * 3;
        const x = from[j] + (target[j] - from[j]) * t;
        const y = from[j + 1] + (target[j + 1] - from[j + 1]) * t;
        const z = from[j + 2] + (target[j + 2] - from[j + 2]) * t;
        // A slight swirl on the way makes the cloud flow instead of sliding in straight lines.
        const lift = Math.sin(Math.PI * t), a = lift * 0.35 * state.dir, c = Math.cos(a), n = Math.sin(a);
        base[j] = x * c - z * n;
        base[j + 1] = y + lift * 3 * state.dir;
        base[j + 2] = x * n + z * c;
      }
    }

    // Particles part gently around the pointer, then drift back.
    const reach = 11, push = 6;
    const active = state.pointerActive && !reduced;
    if (!active && !state.offsetLive && !morphing) return;
    if (active) updatePointerLocal();
    let largest = 0;
    const follow = 1 - Math.exp(-3 * dt);
    const arr = positions.array;
    for (let i = 0; i < count; i++) {
      const j = i * 3;
      let tx = 0, ty = 0, tz = 0;
      if (active) {
        const dx = base[j] - pointerLocal.x, dy = base[j + 1] - pointerLocal.y, dz = base[j + 2] - pointerLocal.z;
        const along = dx * viewLocal.x + dy * viewLocal.y + dz * viewLocal.z;
        const px = dx - along * viewLocal.x, py = dy - along * viewLocal.y, pz = dz - along * viewLocal.z;
        const d = Math.sqrt(px * px + py * py + pz * pz);
        if (d < reach && d > 0.001) { const s = (1 - d / reach) ** 2 * push / d; tx = px * s; ty = py * s; tz = pz * s; }
      }
      offset[j] += (tx - offset[j]) * follow;
      offset[j + 1] += (ty - offset[j + 1]) * follow;
      offset[j + 2] += (tz - offset[j + 2]) * follow;
      arr[j] = base[j] + offset[j];
      arr[j + 1] = base[j + 1] + offset[j + 1];
      arr[j + 2] = base[j + 2] + offset[j + 2];
      const o = Math.abs(offset[j]) + Math.abs(offset[j + 1]) + Math.abs(offset[j + 2]);
      if (o > largest) largest = o;
    }
    state.offsetLive = largest > 0.003;
    positions.needsUpdate = true;
  }

  function update(dt) {
    state.time += dt;
    if (state.dragging) state.chaos = Math.min(MAX_CHAOS, Math.max(0.03, state.chaos) * Math.exp(0.9 * dt));
    else state.chaos *= Math.pow(0.99, dt * 60);
    if (performance.now() - state.lastPointer > 2500) state.pointerActive = false;

    // Sensitivity wireframe: the displayed disturbance eases toward the real one, and the
    // offset is a smooth field of the vertex position, so neighbours move together
    // (no per-vertex jitter) and shared vertices never tear apart.
    state.shown = approach(state.shown, state.chaos, 2.2, dt);
    const chaos = state.shown, t = state.time, amp = chaos * 3.1, pos = wire.attributes.position.array;
    const wireLive = state.wire > 0.01 && (amp > 0.002 || state.wireDirty);
    state.wireDirty = amp > 0.002;
    if (wireLive) for (let i = 0; i < pos.length; i += 3) {
      const x = original[i], y = original[i + 1], z = original[i + 2];
      pos[i] = x + Math.sin(x * 0.085 + y * 0.06 + t * 0.7) * amp;
      pos[i + 1] = y + Math.sin(y * 0.085 + z * 0.07 + t * 0.8) * amp;
      pos[i + 2] = z + Math.sin(z * 0.085 + x * 0.075 + t * 0.6) * amp;
    }
    if (wireLive) wire.attributes.position.needsUpdate = true;
    state.wire = approach(state.wire, state.chapter.wire ? 1 : 0, 1.6, dt);
    material.color.lerpColors(CALM, STRESSED, Math.min(1, chaos / 1.0));
    material.opacity = (0.42 + Math.min(0.3, chaos * 0.15)) * state.wire;
    group.visible = state.wire > 0.01;
    group.scale.setScalar(0.7 + 0.3 * state.wire);

    // Rotation: drag + soft look toward the pointer + a slow spin nudged by scrolling.
    state.lookX = approach(state.lookX, state.pointerY * 0.18, 1.8, dt);
    state.lookY = approach(state.lookY, state.pointerX * 0.28, 1.8, dt);
    group.rotation.x = approach(group.rotation.x, state.dragX - state.lookX, 3, dt);
    group.rotation.y = approach(group.rotation.y, state.dragY + state.lookY, 3, dt);
    mesh.rotation.y += 0.07 * dt;

    const scrolled = window.scrollY - state.lastScroll;
    state.lastScroll = window.scrollY;
    state.spinVelocity = Math.max(-0.006, Math.min(0.006, approach(state.spinVelocity, 0, 1.2, dt) + scrolled * 0.00002));
    const spin = 0.025 * dt + state.spinVelocity + chaos * 0.06 * dt;
    if (state.chapter.spin === 'y') state.spinY += spin; else state.spinZ += spin;
    state.tilt = state.tilt.map((v, k) => approach(v, state.chapter.tilt[k], 0.9, dt));
    dust.rotation.set(state.tilt[0] - state.lookX, state.tilt[1] + state.spinY + state.lookY, state.tilt[2] + state.spinZ);
    dust.scale.setScalar(1 + chaos * 0.1 * state.wire);

    draw(dt);
  }

  let frame = 0, last = performance.now(), tick = 0;
  function loop(now) {
    frame = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    renderer.render(scene, camera);
    if (onFrame) onFrame(state.shown / MAX_CHAOS);
  }

  const down = (event) => {
    if (event.button > 0 || event.target.closest('a,button,input,summary')) return;
    state.dragging = true;
    state.lastX = event.clientX; state.lastY = event.clientY;
  };
  const move = (event) => {
    state.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
    state.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
    state.pointerActive = true;
    state.lastPointer = performance.now();
    if (!state.dragging) {
      // Moving over the first shape stirs it gently, even without pressing.
      if (state.wire > 0.5 && state.lastMoveX !== undefined) {
        const speed = Math.hypot(event.clientX - state.lastMoveX, event.clientY - state.lastMoveY);
        state.chaos = Math.min(0.75, state.chaos + speed * 0.0014);
      }
      state.lastMoveX = event.clientX; state.lastMoveY = event.clientY;
      return;
    }
    state.dragY += (event.clientX - state.lastX) * 0.004;
    state.dragX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, state.dragX + (event.clientY - state.lastY) * 0.004));
    state.lastX = event.clientX; state.lastY = event.clientY;
  };
  const up = () => { state.dragging = false; };
  const leave = () => { state.pointerActive = false; };
  const visibility = () => {
    if (reduced) return;
    cancelAnimationFrame(frame);
    if (!document.hidden) { last = performance.now(); frame = requestAnimationFrame(loop); }
  };

  resize();
  window.addEventListener('resize', resize);
  if (!reduced) {
    grabZone?.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    frame = requestAnimationFrame(loop);
  } else {
    update(0);
    renderer.render(scene, camera);
    onFrame?.(0);
  }

  return {
    setShape,
    disturb(amount = 1.2) { state.chaos = amount; },
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      grabZone?.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
      wire.dispose(); material.dispose(); dustGeometry.dispose(); dustMaterial.dispose(); renderer.dispose();
    },
  };
}
