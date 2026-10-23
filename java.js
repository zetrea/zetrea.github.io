/* ==========================================================
   ✏️  CONFIGURACIÓN: aquí cambias tus textos y tu playlist
   ========================================================== */
const CONFIG = {
    para: "NOMBRE",                 // nombre de ella
    de: "TU NOMBRE",                // tu nombre
    titulo: "Canciones para ti",    // título del casete

    // Spotify > tu playlist > Compartir > Copiar enlace
    // https://open.spotify.com/playlist/XXXXXXXX  →  pega solo XXXXXXXX
    playlistId: "1ogiKHLT2E6VzGX2Jv6aAZ?si=5bd3b3165d8646b3",   // ← playlist de ejemplo

    // La carta: cada línea es un párrafo y se "escribe" sola
    nota: [
        "Hola, mi vida.",
        "Hice esta playlist pensando en ti, porque hay cosas que se dicen mejor con canciones.",
        "Cada una me recuerda a ti: tu risa, tus abrazos, tus días buenos y hasta los normales.",
        "Así que dale play, escucha con calma, y al final tengo una pregunta para ti…"
    ],
    firma: "Con cariño, TU NOMBRE",

    // La notita amarilla pegada al casete
    notaCasete: [
        "Lado A: tú y yo riéndonos.",
        "Lado B: yo extrañándote ya.",
        "Dale play."
    ],
    firmaCasete: "TU NOMBRE",

    pregunta: "¿Quieres ser mi novia?",
    subpregunta: "Piénsalo… pero no mucho 😉",
    textoSi: "¡Sí! 💖",
    textoNo: "No",
    mensajesNo: ["", "¿Segura? 🥺", "Piénsalo bien…", "Mira qué grande está el sí 😏", "Anda, di que sí 💗"],
    finalTitulo: "¡Dijo que sí! 💖",
    finalTexto: "Gracias por hacerme el más feliz. Esto apenas empieza.",

    // Botón escondido "Hay más aquí" (abre un ramo con un mensajito)
    mensajeExtra: "Este ramo es solo para ti. Cada flor es una razón por la que me gustas.",

    // ⏱️ Velocidad de lectura (súbelos si quieres que tarde más)
    msPorLetra: 55,            // ms que tarda en escribirse cada letra
    pausaParrafo: 2200,        // pausa al terminar cada párrafo
    pausaAntesPregunta: 4500   // pausa después de la firma, antes de que aparezca la pregunta
};

/* ==========================================================
   Utilidades
   ========================================================== */
const $ = s => document.querySelector(s);
const rnd = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const lerp = (a, b, t) => a + (b - a) * t;

/* ==========================================================
   Flores dibujadas con SVG: pétalos con luz en el borde y sombra en la base
   ========================================================== */
const PAL = {            // [punta clara, medio, base oscura]
    pink: ['#ffe9f0', '#f58fb0', '#c9406c'],
    blush: ['#fffaf7', '#fbd1d8', '#e48fa4'],
    cream: ['#fffef8', '#f7ebd2', '#d9c196'],
    red: ['#fb8aa0', '#c9244a', '#7a0b28'],
    coral: ['#ffe9dc', '#f7a79b', '#d9615f'],
    lilac: ['#f6ecf8', '#cda8dc', '#8a60aa']
};
(function buildDefs() {
    let s = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>';
    for (const k in PAL) {
        const [a, b, c] = PAL[k];
        s += `<radialGradient id="gr-${k}" cx="50%" cy="65%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;
        s += `<linearGradient id="gl-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".42" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
    }
    for (const k of ['lilac', 'pink']) {
        s += `<g id="fl-${k}">` + [[-6, 0], [6, 0], [0, -6], [0, 6]].map(([x, y]) =>
            `<circle cx="${x}" cy="${y}" r="7" fill="url(#gr-${k})" stroke="rgba(90,50,130,.25)" stroke-width=".8"/>`).join('') +
            `<circle r="2" fill="#f6e7a8"/></g>`;
    }
    s += `<radialGradient id="cs"><stop offset="0" stop-color="rgba(90,10,40,.5)"/><stop offset="1" stop-color="rgba(90,10,40,0)"/></radialGradient>`;
    s += `<linearGradient id="gr-petal" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffe3ec"/><stop offset="1" stop-color="#f27aa1"/></linearGradient>`;
    $('#defs').innerHTML = s + '</defs></svg>';
})();

const P_ROSE = 'M0 0C-50-8-60-66 0-82C60-66 50-8 0 0Z';
const P_PEONY = 'M0 0C-46-4-72-44-46-72C-40-82-30-80-24-86C-14-94-6-86 0-90C6-86 14-94 24-86C30-80 40-82 46-72C72-44 46-4 0 0Z';
const P_LILY = 'M0 0C-20-26-24-66 0-100C24-66 20-26 0 0Z';
const P_CHERRY = 'M0 0C-24-4-38-34-16-54C-9-60-3-55 0-48C3-55 9-60 16-54C38-34 24-4 0 0Z';

function rose(k) {
    let s = '<circle r="84" fill="rgba(110,20,50,.15)"/>';
    [[7, 1, 0], [6, .8, 26], [5, .6, 12], [4, .42, 48], [3, .27, 20]].forEach(([n, sc, off], ring) => {
        const o = off + rnd(0, 40);
        for (let i = 0; i < n; i++) {
            const tr = `rotate(${(o + i * 360 / n).toFixed(1)}) scale(${(sc * rnd(.94, 1.06)).toFixed(3)})`;
            s += `<g transform="${tr}"><path d="${P_ROSE}" fill="url(#gl-${k})" stroke="rgba(120,20,60,.32)" stroke-width="${(1.2 / sc).toFixed(2)}"/>` +
                (ring < 2 ? `<path d="M0-8C-5-30-5-52 0-68" stroke="rgba(255,255,255,.3)" stroke-width="2.2" fill="none" stroke-linecap="round"/>` : '') + '</g>';
        }
    });
    return s + '<circle r="26" fill="url(#cs)"/><path d="M-5 -2C-6-8 4-9 5-3C6 3-3 6-5 1" stroke="rgba(255,255,255,.35)" stroke-width="1.4" fill="none"/>';
}
function peony(k) {
    let s = '<circle r="90" fill="rgba(110,20,50,.13)"/>';
    [[9, 1], [8, .84], [7, .66], [6, .5], [5, .34]].forEach(([n, sc]) => {
        const o = rnd(0, 50);
        for (let i = 0; i < n; i++)
            s += `<path d="${P_PEONY}" fill="url(#gl-${k})" stroke="rgba(150,90,80,.3)" stroke-width="${(1.1 / sc).toFixed(2)}" transform="rotate(${(o + i * 360 / n).toFixed(1)}) scale(${(sc * rnd(.94, 1.06)).toFixed(3)})"/>`;
    });
    s += '<circle r="22" fill="url(#cs)"/><circle r="8" fill="#f6d77a"/>';
    for (let i = 0; i < 11; i++) {
        const a = rnd(0, 6.283), r = rnd(4, 15);
        s += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="2.2" fill="#e9b53c"/>`;
    }
    return s;
}
function lily(k) {
    let s = '';
    const o = rnd(0, 60);
    for (let i = 0; i < 3; i++)
        s += `<path d="${P_LILY}" fill="url(#gl-${k})" opacity=".85" transform="rotate(${(o + 30 + i * 120).toFixed(1)}) scale(.92)"/>`;
    for (let i = 0; i < 3; i++) {
        s += `<g transform="rotate(${(o + i * 120).toFixed(1)})"><path d="${P_LILY}" fill="url(#gl-${k})" stroke="rgba(190,60,100,.32)" stroke-width="1.2"/>` +
            `<path d="M0-8V-84" stroke="rgba(200,70,110,.4)" stroke-width="2.2"/>` +
            [-26, -36, -46, -56, -66].map(y => `<circle cx="${rnd(-5, 5).toFixed(1)}" cy="${y}" r="1.6" fill="rgba(170,40,80,.55)"/>`).join('') + '</g>';
    }
    for (let i = 0; i < 6; i++)
        s += `<g transform="rotate(${(o + i * 60 + 20).toFixed(1)})"><line y2="-40" stroke="#d8a8a0" stroke-width="1.4"/><ellipse cy="-44" rx="3" ry="6.5" fill="#b85a20"/></g>`;
    return s + '<circle r="5" fill="#e9c46a"/>';
}
function hydra(k) {
    let s = '<circle r="76" fill="rgba(90,50,110,.15)"/>';
    const n = 30;
    for (let i = 0; i < n; i++) {
        const a = i * 2.39996, r = 70 * Math.sqrt((i + .5) / n);
        s += `<use href="#fl-${pick(['lilac', k])}" transform="translate(${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}) rotate(${rnd(0, 90).toFixed(0)}) scale(${rnd(.85, 1.25).toFixed(2)})"/>`;
    }
    return s;
}
function daisy() {
    let s = '<circle r="74" fill="rgba(110,70,40,.10)"/>';
    const n = 15, o = rnd(0, 30);
    for (let i = 0; i < n; i++)
        s += `<ellipse cy="-46" rx="9.5" ry="34" fill="#fffdf7" stroke="rgba(190,150,110,.38)" stroke-width="1.2" transform="rotate(${(o + i * 360 / n).toFixed(1)})"/>`;
    s += '<circle r="17" fill="#f2c14e" stroke="#d99a2b" stroke-width="2"/><circle r="9" fill="#e0a02a" opacity=".55"/>';
    for (let i = 0; i < 9; i++) s += `<circle cx="${rnd(-11, 11).toFixed(1)}" cy="${rnd(-11, 11).toFixed(1)}" r="1.4" fill="#b87a14"/>`;
    return s;
}
function cherry(k) {
    let s = '<g transform="scale(1.42)"><circle r="60" fill="rgba(150,50,80,.10)"/>';
    const o = rnd(0, 72);
    for (let i = 0; i < 5; i++)
        s += `<path d="${P_CHERRY}" fill="url(#gl-${k})" stroke="rgba(190,80,110,.4)" stroke-width="1.2" transform="rotate(${(o + i * 72).toFixed(1)})"/>`;
    s += '<circle r="10" fill="rgba(210,70,110,.38)"/>';
    for (let i = 0; i < 9; i++)
        s += `<g transform="rotate(${i * 40})"><line y2="-20" stroke="#e58aa8" stroke-width="1"/><circle cy="-22" r="2.2" fill="#f4d27a"/></g>`;
    return s + '</g>';
}
const BUILD = { rose, peony, lily, hydra, daisy, cherry };

function randomFlower() {
    const r = Math.random();
    if (r < .24) return ['rose', pick(['pink', 'pink', 'blush', 'coral'])];
    if (r < .33) return ['rose', 'red'];
    if (r < .53) return ['peony', pick(['cream', 'blush', 'cream', 'pink'])];
    if (r < .68) return ['lily', pick(['pink', 'blush', 'coral'])];
    if (r < .80) return ['hydra', pick(['lilac', 'pink'])];
    if (r < .90) return ['cherry', pick(['blush', 'pink'])];
    return ['daisy', 'cream'];
}
function makeFlower(size) {
    const [type, k] = randomFlower();
    const d = document.createElement('div');
    d.className = 'fl';
    d.style.width = d.style.height = size + 'px';
    d.innerHTML = `<svg viewBox="-100 -100 200 200">${BUILD[type](k)}</svg>`;
    return d;
}

/* ==========================================================
   Sello de cera, sobre, destellos
   ========================================================== */
const SEAL_SVG = `<svg viewBox="0 0 60 60"><defs><radialGradient id="sg" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#f0728a"/><stop offset="1" stop-color="#a81e3c"/></radialGradient></defs>
  <path d="M30 3C38 2 43 6 49 10C55 16 58 22 57 31C58 40 53 48 46 53C38 58 28 59 20 55C11 51 4 43 3 33C2 22 8 12 16 7C21 4 26 3 30 3Z" fill="url(#sg)"/>
  <circle cx="30" cy="30" r="20" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.6"/>
  <path d="M30 42C14 31 18 19 26 20C29 20.5 30 23 30 24C30 23 31 20.5 34 20C42 19 46 31 30 42Z" fill="rgba(255,225,230,.92)"/>
  <ellipse cx="19" cy="14" rx="7" ry="3.5" fill="rgba(255,255,255,.35)" transform="rotate(-35 19 14)"/></svg>`;
document.querySelectorAll('#seal .half').forEach(h => h.innerHTML = SEAL_SVG);
$('#envTo').textContent = `Para ${CONFIG.para}`;

const STAR = c => `<svg width="22" height="22" viewBox="-12 -12 24 24"><path d="M0-10L2.6-2.6L10 0L2.6 2.6L0 10L-2.6 2.6L-10 0L-2.6-2.6Z" fill="${c}"/></svg>`;
(function envSparkles() {
    const w = $('#envWrap');
    for (let i = 0; i < 9; i++) {
        const s = document.createElement('span');
        s.className = 'spk';
        s.innerHTML = STAR(pick(['#fff', '#ffd7a0', '#ffb3c6']));
        s.style.left = rnd(0, 92) + '%'; s.style.top = rnd(0, 90) + '%';
        s.style.animationDelay = rnd(0, 2.6) + 's';
        s.style.animationDuration = rnd(2.2, 3.6) + 's';
        w.appendChild(s);
    }
})();
function burst(x, y, n) {
    const layer = $('#top');
    for (let i = 0; i < n; i++) {
        const s = document.createElement('div');
        s.style.cssText = 'position:absolute;left:0;top:0';
        s.innerHTML = STAR(pick(['#fff', '#ffe2a8', '#ffb3c6', '#ffd1dc']));
        layer.appendChild(s);
        const a = rnd(0, 6.283), d = rnd(90, 320);
        s.animate([
            { transform: `translate(${x}px,${y}px) scale(.2) rotate(0)`, opacity: 1 },
            { transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d - 40}px) scale(${rnd(.8, 1.8)}) rotate(${rnd(90, 360)}deg)`, opacity: 0 }
        ], { duration: rnd(1100, 2200), easing: 'cubic-bezier(.1,.8,.3,1)' }).onfinish = () => s.remove();
    }
}
function pulse(x, y) {
    const p = document.createElement('div');
    p.className = 'pulse';
    p.style.left = x + 'px'; p.style.top = y + 'px';
    $('#top').appendChild(p);
    p.animate([{ transform: 'scale(.2)', opacity: .95 }, { transform: 'scale(16)', opacity: 0 }],
        { duration: 1800, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => p.remove();
}

/* ==========================================================
   Pétalos que caen (en la portada y en el cuarto)
   ========================================================== */
function petalFall(host, max) {
    if (host.querySelectorAll('.ptl').length > max) return;
    const W = innerWidth, H = innerHeight, sz = rnd(12, 22), x0 = rnd(0, W);
    const p = document.createElement('div');
    p.className = 'ptl';
    p.innerHTML = `<svg width="${sz}" height="${sz * 1.4}" viewBox="-14 -36 28 38"><path d="M0 0C-14-6-16-24 0-34C16-24 14-6 0 0Z" fill="url(#gr-petal)" opacity=".92"/></svg>`;
    host.appendChild(p);
    p.animate([
        { transform: `translate(${x0}px,-40px) rotate(0)`, opacity: 0 },
        { opacity: .95, offset: .08 },
        { transform: `translate(${x0 + rnd(-130, 130)}px,${H * .45}px) rotate(${rnd(120, 220)}deg)`, offset: .5 },
        { transform: `translate(${x0 + rnd(-220, 220)}px,${H + 40}px) rotate(${rnd(360, 520)}deg)`, opacity: .8 }
    ], { duration: rnd(9000, 15000), easing: 'linear' }).onfinish = () => p.remove();
}
let introTimer = setInterval(() => petalFall($('#introFx'), 9), 1500);
for (let i = 0; i < 4; i++) setTimeout(() => petalFall($('#introFx'), 9), i * 400);

/* ==========================================================
   Ramo que crece desde el sobre, llena la pantalla y se dispersa
   ========================================================== */
const BLOOM_MS = 5600;

function startBloom() {
    clearInterval(introTimer);
    const bloom = $('#bloom');
    const W = innerWidth, H = innerHeight, S = Math.min(W, H);
    const r = $('#env').getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2 - 30;
    const avg = Math.max(150, Math.min(300, S * .34));
    const step = avg * .62;

    pulse(cx, cy);
    burst(cx, cy, 26);

    const backing = document.createElement('div');
    backing.className = 'backing';
    bloom.appendChild(backing);
    backing.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 2400, delay: 1200, fill: 'both', easing: 'ease-in' });

    const items = [];
    for (let layer = 0; layer < 2; layer++) {
        const off = layer ? step / 2 : 0, st = layer ? step * 1.15 : step;
        for (let y = -step * .5 + off; y < H + step; y += st)
            for (let x = -step * .5 + off; x < W + step; x += st)
                items.push({
                    px: x + rnd(-.35, .35) * step,
                    py: y + rnd(-.35, .35) * step,
                    size: avg * (layer ? .75 : 1) * rnd(.75, 1.25)
                });
    }
    const dist = it => Math.hypot(it.px - cx, it.py - cy);
    const maxD = Math.max(...items.map(dist));
    items.forEach(it => { it.nd = dist(it) / maxD; it.delay = Math.pow(it.nd, .9) * 3200 + rnd(0, 250); it.rot = rnd(-25, 25); });
    items.sort(() => Math.random() - .5);

    for (const it of items) {
        const f = makeFlower(it.size);
        it.el = f;
        f.style.left = (it.px - it.size / 2) + 'px';
        f.style.top = (it.py - it.size / 2) + 'px';
        bloom.appendChild(f);
        f.animate([
            { transform: `translate(${cx - it.px}px,${cy - it.py}px) scale(.08) rotate(${rnd(-90, -50)}deg)`, opacity: 0 },
            { opacity: 1, offset: .3 },
            { transform: `translate(0,0) scale(1.1) rotate(${it.rot * .5}deg)`, opacity: 1, offset: .78 },
            { transform: `translate(0,0) scale(1) rotate(${it.rot}deg)`, opacity: 1 }
        ], { duration: rnd(1900, 2500), delay: it.delay, easing: 'cubic-bezier(.22,.9,.3,1)', fill: 'both' });
    }

    // 1) el ramo cubre todo → 2) se dispersa como pétalos y deja ver el cuarto
    setTimeout(() => {
        $('#intro').style.display = 'none';
        $('#scene').classList.add('show');
        $('#scene').removeAttribute('aria-hidden');
        for (const it of items) {
            it.el.animate([
                { transform: `translate(0,0) scale(1) rotate(${it.rot}deg)`, opacity: 1 },
                { transform: `translate(${rnd(-50, 50)}px,${-rnd(70, 190)}px) scale(1.3) rotate(${it.rot + rnd(25, 80)}deg)`, opacity: 0 }
            ], { duration: 1500, delay: it.nd * 1600, easing: 'ease-in', fill: 'forwards' });
        }
        backing.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1700, delay: 500, fill: 'forwards' });
    }, BLOOM_MS);
    setTimeout(() => { $('#garden').classList.add('go'); $('#cassWrap').classList.add('drop'); }, BLOOM_MS + 900);
    setTimeout(startFx, BLOOM_MS + 1600);
    setTimeout(() => { bloom.remove(); startReading(); }, BLOOM_MS + 3400);
}

/* ==========================================================
   Pared, enredaderas, repisa con objetos
   ========================================================== */
(function wall() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><g fill="none" stroke="#d58f9f" stroke-width="1.4" stroke-linecap="round" opacity=".5">` +
        [[38, 20], [113, 95]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 40C-2 22 2 6 0-14"/><path d="M0 24C-10 20-14 12-14 6M0 14C10 10 14 2 14-4M0 4C-8 0-10-6-10-10"/><circle cx="0" cy="-18" r="3.4" fill="#e7a9b8" stroke="none"/></g>`).join('') + `</g></svg>`;
    $('#wall').style.backgroundImage = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}"), linear-gradient(180deg,#f2cfcc,#e8b8be)`;
})();

function cubic(p0, p1, p2, p3, t) {
    const u = 1 - t;
    return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
}
function vineSVG(len) {
    const P = [[30, 0], [10, len * .25], [50, len * .55], [28, len]];
    let s = `<svg viewBox="0 0 60 ${len}" width="60" height="${len}"><path d="M${P[0]} C${P[1]} ${P[2]} ${P[3]}" fill="none" stroke="#6f9f68" stroke-width="2.2" stroke-linecap="round"/>`;
    const n = Math.round(len / 18);
    for (let i = 1; i <= n; i++) {
        const [x, y] = cubic(P[0], P[1], P[2], P[3], i / (n + .5));
        const side = i % 2 ? 1 : -1;
        s += `<path d="M0 0C-8-8-14 2 0 13C14 2 8-8 0 0Z" fill="${pick(['#78ad72', '#6a9f66', '#86b97c'])}" stroke="rgba(50,90,50,.3)" stroke-width=".7" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(side * rnd(40, 100)).toFixed(0)}) scale(${rnd(.8, 1.3).toFixed(2)})"/>`;
    }
    return s + '</svg>';
}
(function vines() {
    const host = $('#vines');
    [['v1', '10vw', 230], ['v2', '14.5vw', 150], ['v3', '', 200]].forEach(([c, left, len], i) => {
        const d = document.createElement('div');
        d.className = 'vine ' + c;
        if (left) d.style.left = left; else d.style.right = '11vw';
        d.style.animationDelay = (-i * 2) + 's';
        d.innerHTML = vineSVG(len);
        host.appendChild(d);
    });
})();

function dryBranch(x0, y0, tx, ty) {
    const c = [(x0 + tx) / 2 + rnd(-24, 24), (y0 + ty) / 2];
    let s = `<path d="M${x0} ${y0}Q${c[0].toFixed(0)} ${c[1].toFixed(0)} ${tx} ${ty}" stroke="#a58a6a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    for (let t = .3; t < .95; t += .14) {
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * c[0] + t * t * tx, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * c[1] + t * t * ty;
        s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rnd(4, 6).toFixed(1)}" fill="${pick(['#f6c7d3', '#fde7ee', '#f0a9bd'])}"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="1.5" fill="#e9b53c"/>`;
    }
    return s;
}
function plume(x0, y0, tx, ty) {
    let s = `<path d="M${x0} ${y0}Q${(x0 + tx) / 2} ${(y0 + ty) / 2 + 10} ${tx} ${ty}" stroke="#b99f7d" stroke-width="1.6" fill="none"/>`;
    for (let i = 0; i < 9; i++) {
        const t = .45 + i * .06, x = lerp(x0, tx, t) + rnd(-2, 2), y = lerp(y0, ty, t);
        s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)}q${(-9 - i).toFixed(0)} -6 ${(-14 - i).toFixed(0)} -2M${x.toFixed(0)} ${y.toFixed(0)}q${(9 + i).toFixed(0)} -6 ${(14 + i).toFixed(0)} -2" stroke="#e7d3b3" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
    }
    return s;
}
function vaseSVG() {
    return `<svg viewBox="0 0 150 280" width="150"><g>${dryBranch(75, 170, 30, 60)}${dryBranch(75, 170, 116, 52)}${dryBranch(75, 170, 64, 18)}${dryBranch(75, 170, 96, 96)}${plume(75, 170, 48, 28)}${plume(75, 170, 104, 30)}</g>
   <defs><linearGradient id="vg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e3c8b2"/><stop offset=".4" stop-color="#fbeee0"/><stop offset="1" stop-color="#d9bba4"/></linearGradient></defs>
   <path d="M60 160H90C92 168 96 176 104 196C112 226 108 258 98 268Q75 276 52 268C42 258 38 226 46 196C54 176 58 168 60 160Z" fill="url(#vg)" stroke="#c9a88f" stroke-width="1.5"/>
   <ellipse cx="75" cy="160" rx="16" ry="4.5" fill="#d9bba4" stroke="#c9a88f"/>
   <path d="M46 214Q75 224 104 214" stroke="#f0a9bd" stroke-width="5" fill="none"/>
   ${[56, 66, 76, 86, 96].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 224 : 220}" r="2" fill="#9fc29a"/>`).join('')}</svg>`;
}
function booksSVG() {
    return `<svg viewBox="0 0 180 150" width="180">
   <path d="M30 98C20 86 26 70 42 70C54 70 58 76 58 84C70 76 90 80 92 96" fill="none" stroke="#6f9f68" stroke-width="0"/>
   <rect x="10" y="118" width="160" height="26" rx="3" fill="#9bb08c" stroke="#7a9070"/><rect x="10" y="124" width="160" height="3" fill="#cfe0c0"/><rect x="18" y="134" width="144" height="2" fill="#7a9070" opacity=".5"/>
   <rect x="22" y="92" width="136" height="26" rx="3" fill="#e6a1b4" stroke="#c97c92"/><rect x="22" y="98" width="136" height="3" fill="#fbd3df"/><circle cx="48" cy="109" r="4" fill="#fff3d6"/>
   <g transform="rotate(-2 90 78)"><rect x="16" y="66" width="140" height="26" rx="3" fill="#f0d9a6" stroke="#cbb27a"/><rect x="16" y="72" width="140" height="3" fill="#fff3cf"/></g>
   <path d="M110 66L106 40H140L136 66Z" fill="#d98a63" stroke="#b36a45"/><rect x="104" y="36" width="38" height="8" rx="2" fill="#e3996f" stroke="#b36a45"/>
   <path d="M122 36C118 18 106 12 98 14C104 24 112 30 122 36Z" fill="#78ad72"/><path d="M122 36C128 16 142 10 150 14C142 24 134 30 122 36Z" fill="#6a9f66"/><path d="M122 36C121 20 123 8 123 2C127 12 126 26 122 36Z" fill="#86b97c"/>
   <path d="M104 50C90 56 84 70 88 86C94 96 98 100 100 108" fill="none" stroke="#6f9f68" stroke-width="2"/>
   ${[[92, 64], [88, 78], [96, 94]].map(([x, y]) => `<path d="M0 0C-8-8-14 2 0 13C14 2 8-8 0 0Z" fill="#78ad72" transform="translate(${x} ${y}) rotate(${rnd(-40, 40).toFixed(0)}) scale(.8)"/>`).join('')}</svg>`;
}
function candleSVG() {
    return `<svg viewBox="0 0 80 130" width="70">
   <defs><radialGradient id="cg"><stop offset="0" stop-color="rgba(255,226,150,.9)"/><stop offset="1" stop-color="rgba(255,226,150,0)"/></radialGradient>
   <linearGradient id="fg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff9a3c"/><stop offset=".6" stop-color="#ffd36b"/><stop offset="1" stop-color="#fff6c8"/></linearGradient></defs>
   <circle class="candle-glow" cx="40" cy="38" r="38" fill="url(#cg)"/>
   <rect x="14" y="62" width="52" height="62" rx="9" fill="rgba(255,255,255,.55)" stroke="#d9c3b0" stroke-width="1.5"/>
   <rect x="19" y="72" width="42" height="48" rx="6" fill="#fff2d9"/><ellipse cx="40" cy="72" rx="21" ry="4" fill="#ffe7b8"/>
   <path d="M40 72V54" stroke="#5a463d" stroke-width="2" stroke-linecap="round"/>
   <path class="flame" d="M40 54C30 44 36 34 40 24C44 34 50 44 40 54Z" fill="url(#fg)"/>
   <path d="M20 76V118" stroke="rgba(255,255,255,.7)" stroke-width="3" stroke-linecap="round"/></svg>`;
}
$('#sillItems').innerHTML = `<div class="it-vase">${vaseSVG()}</div><div class="it-candle">${candleSVG()}</div><div class="it-books">${booksSVG()}</div>`;

/* ==========================================================
   Jardín que crece detrás de la ventana
   ========================================================== */
function plantSVG(w, H, delay) {
    const [type, k] = randomFlower();
    const top = 340 - H, bx = rnd(-26, 26), ex = rnd(-14, 14);
    const P = [[60, 340], [60 + bx, 340 - H * .35], [60 - bx, 340 - H * .7], [60 + ex, top]];
    let s = `<svg viewBox="-30 0 180 340" style="--d:${delay}s"><path class="stem" pathLength="1" d="M${P[0]} C${P[1]} ${P[2]} ${P[3]}" fill="none" stroke="#5f9a62" stroke-width="3.6" stroke-linecap="round"/>`;
    [.28, .46, .64].forEach((t, i) => {
        const [x, y] = cubic(P[0], P[1], P[2], P[3], t);
        const left = i % 2 === 0;
        s += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${left ? -150 : -30}) scale(${rnd(.9, 1.4).toFixed(2)})"><path class="leaf" style="--t:${(0.5 + t * 1.6).toFixed(2)}s" d="M0 0C10-9 30-9 42 0C30 9 10 9 0 0Z" fill="${pick(['#6fae6f', '#7fbb78', '#5f9a62'])}" stroke="rgba(40,90,50,.25)" stroke-width=".8"/></g>`;
    });
    if (Math.random() < .5) {            // un botoncito de flor en una ramita
        const [bx2, by2] = cubic(P[0], P[1], P[2], P[3], .55), dir = Math.random() < .5 ? -1 : 1;
        s += `<path class="stem" pathLength="1" d="M${bx2.toFixed(1)} ${by2.toFixed(1)}q${dir * 14} -8 ${dir * 22} -26" fill="none" stroke="#5f9a62" stroke-width="2.4" stroke-linecap="round"/>` +
            `<g transform="translate(${(bx2 + dir * 22).toFixed(1)} ${(by2 - 26).toFixed(1)}) rotate(${dir * 20})"><g class="leaf" style="--t:2.4s"><path d="M0 0C-7-3-8-14 0-20C8-14 7-3 0 0Z" fill="#f08fae" stroke="rgba(160,50,80,.35)" stroke-width=".8"/><path d="M-6 2C-3 -1 3 -1 6 2C3 6-3 6-6 2Z" fill="#6fae6f"/></g></g>`;
    }
    const sc = rnd(.3, .42);
    s += `<g transform="translate(${P[3][0]} ${top})"><g class="head"><g transform="scale(${sc.toFixed(2)})">${BUILD[type](k)}</g></g></g></svg>`;
    return s;
}
function buildGarden() {
    const g = $('#garden');
    g.innerHTML = '';
    const W = $('#win').clientWidth || innerWidth, n = Math.max(10, Math.min(26, Math.floor(W / 62)));
    const list = [];
    for (let i = 0; i < n; i++) {
        const x = (i + .5) / n * W + rnd(-.3, .3) * (W / n);
        const cf = Math.min(1, Math.abs(x / W - .5) * 2);
        const w = lerp(80, 150, Math.pow(cf, 1.1)) * (W < 760 ? .8 : 1) * rnd(.85, 1.15);
        const H = Math.max(110, Math.min(275, lerp(120, 270, Math.pow(cf, 1.2)) + rnd(-20, 30)));
        list.push({ x, w, H });
    }
    list.sort((a, b) => a.w - b.w);
    list.forEach(p => {
        const d = document.createElement('div');
        d.className = 'plant';
        d.style.left = (p.x - p.w / 2) + 'px';
        d.style.width = p.w + 'px';
        d.style.height = (p.w * 340 / 180) + 'px';
        d.style.animationDelay = (-rnd(0, 5)) + 's';
        d.innerHTML = plantSVG(p.w, p.H, rnd(0, 1.6));
        g.appendChild(d);
    });
    // pasto al frente
    let gr = '<svg class="grass" viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true">';
    for (let grp = 0; grp < 3; grp++) {
        gr += `<g style="animation-delay:${-grp * 1.3}s">`;
        for (let i = 0; i < 70; i++) {
            const x = rnd(0, 1000), h = rnd(26, 70);
            gr += `<path d="M${x.toFixed(0)} 90Q${(x + rnd(-8, 8)).toFixed(0)} ${(90 - h * .6).toFixed(0)} ${(x + rnd(-16, 16)).toFixed(0)} ${(90 - h).toFixed(0)}" stroke="${pick(['#78ad72', '#6a9f66', '#8fc184', '#5f9a62'])}" stroke-width="${rnd(2, 3.6).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
        }
        gr += '</g>';
    }
    g.insertAdjacentHTML('beforeend', gr + '</svg>');
}
buildGarden();

(function ambient() {
    const pol = $('#pollen'), fire = $('#fireflies');
    for (let i = 0; i < 34; i++) {
        const e = document.createElement('i');
        e.style.left = rnd(0, 100) + '%'; e.style.top = rnd(25, 95) + '%';
        e.style.animationDelay = rnd(0, 9) + 's'; e.style.animationDuration = rnd(7, 12) + 's';
        pol.appendChild(e);
    }
    for (let i = 0; i < 16; i++) {
        const e = document.createElement('i');
        e.style.left = rnd(2, 98) + '%'; e.style.top = rnd(55, 92) + '%';
        e.style.animationDelay = rnd(0, 7) + 's'; e.style.animationDuration = rnd(6, 11) + 's';
        fire.appendChild(e);
    }
})();

/* ---------- parallax suave con el mouse ---------- */
(function parallax() {
    const layers = [...document.querySelectorAll('.layer[data-d]')];
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('pointermove', e => {
        if (e.pointerType === 'touch') return;
        tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5;
    });
    (function loop() {
        cx += (tx - cx) * .06; cy += (ty - cy) * .06;
        for (const l of layers) {
            const d = +l.dataset.d;
            l.style.transform = `translate(${(-cx * d).toFixed(2)}px,${(-cy * d * .6).toFixed(2)}px)`;
        }
        requestAnimationFrame(loop);
    })();
})();

/* ==========================================================
   Mariposas
   ========================================================== */
function butterfly() {
    const [c1, c2] = pick([['#ffb3c6', '#f28aa8'], ['#ffd28a', '#f4a259'], ['#d9b8ff', '#b48be8'], ['#fff0a8', '#f2c14e']]);
    const d = document.createElement('div');
    d.className = 'bf';
    const wing = m => `<path d="M0 0C${-8 * m}-18 ${-26 * m}-20 ${-28 * m}-8C${-29 * m} 0 ${-14 * m} 2 0 0Z" fill="${c1}" stroke="rgba(120,60,90,.35)" stroke-width=".8"/>` +
        `<path d="M0 0C${-6 * m} 8 ${-20 * m} 18 ${-22 * m} 8C${-23 * m} 2 ${-10 * m} 0 0 0Z" fill="${c2}" stroke="rgba(120,60,90,.35)" stroke-width=".8"/>` +
        `<circle cx="${-17 * m}" cy="-8" r="2.4" fill="rgba(255,255,255,.7)"/>`;
    d.innerHTML = `<svg viewBox="-30 -24 60 48" width="${rnd(38, 52).toFixed(0)}"><g class="wl">${wing(1)}</g><g class="wr">${wing(-1)}</g>` +
        `<ellipse rx="1.8" ry="9" fill="#5a3a45"/><path d="M0-8C-3-14-6-16-8-16M0-8C3-14 6-16 8-16" stroke="#5a3a45" stroke-width=".8" fill="none"/></svg>`;
    $('#fx').appendChild(d);
    const W = innerWidth, H = innerHeight, pts = [];
    for (let i = 0; i < 7; i++) pts.push([rnd(-.05, 1.05) * W, rnd(.08, .78) * H]);
    let prev = pts[0][0];
    const kf = pts.map(([x, y]) => {
        const dir = x >= prev ? 1 : -1; prev = x;
        return { transform: `translate(${x.toFixed(0)}px,${y.toFixed(0)}px) scaleX(${dir}) rotate(${rnd(-14, 14).toFixed(0)}deg)`, easing: 'ease-in-out' };
    });
    kf.push({ ...kf[0] });
    d.animate(kf, { duration: rnd(28000, 44000), iterations: Infinity, delay: -rnd(0, 20000) });
    d.querySelectorAll('.wl,.wr').forEach(w => w.style.animationDuration = rnd(.26, .42) + 's');
}
function startFx() {
    for (let i = 0; i < 4; i++) butterfly();
    petalFall($('#fx'), 18);
    setInterval(() => petalFall($('#fx'), 18), 1100);
}

/* ==========================================================
   El casete (tarjeta con título, casete, playlist y nota)
   ========================================================== */
$('#kicker').textContent = `Para ${CONFIG.para} · De ${CONFIG.de}`;
$('#titulo').textContent = CONFIG.titulo;
(function liner() {
    const l = $('#liner');
    CONFIG.notaCasete.forEach(t => { const p = document.createElement('p'); p.textContent = t; l.appendChild(p); });
    const s = document.createElement('p'); s.className = 'ls'; s.textContent = CONFIG.firmaCasete; l.appendChild(s);
})();

function leafSprig(x, y, rot, sc = 1) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><path d="M0 0V-40" stroke="#7e8f66" stroke-width="1.6"/>` +
        [-10, -20, -30].map(yy => `<ellipse cx="-7" cy="${yy}" rx="8" ry="3.4" transform="rotate(-35 -7 ${yy})" fill="#8fa176"/><ellipse cx="7" cy="${yy - 4}" rx="8" ry="3.4" transform="rotate(35 7 ${yy - 4})" fill="#8fa176"/>`).join('') +
        `<circle cy="-42" r="3.4" fill="#e58aa8"/><circle cy="-42" r="1.3" fill="#f6e0a0"/></g>`;
}
function screw(x, y) {
    return `<circle cx="${x}" cy="${y}" r="6.5" fill="url(#ca-brass)" stroke="#8a7447" stroke-width="1"/><path d="M${x - 3.6} ${y - 3.6}L${x + 3.6} ${y + 3.6}" stroke="#6a5530" stroke-width="1.5"/><circle cx="${x - 1.8}" cy="${y - 2}" r="1.6" fill="rgba(255,255,255,.55)"/>`;
}
function reel(cx, cy, cls) {
    let teeth = '';
    for (let i = 0; i < 6; i++) teeth += `<rect x="${cx - 1.7}" y="${cy - 9.5}" width="3.4" height="5.6" rx="1" fill="#f3ecd8" transform="rotate(${i * 60} ${cx} ${cy})"/>`;
    return `<g class="reel" style="transform-origin:${cx}px ${cy}px">` +
        `<circle class="pack ${cls}" cx="${cx}" cy="${cy}" r="21.5" fill="url(#ca-tape)" stroke="#3a2b25" stroke-width="1"/>` +
        `<circle cx="${cx}" cy="${cy}" r="14" fill="#2b2323"/><circle cx="${cx}" cy="${cy}" r="12.2" fill="#f3ecd8" stroke="#cbbf9c"/>` +
        `<circle cx="${cx}" cy="${cy}" r="8.6" fill="#2b2323"/>${teeth}<circle cx="${cx}" cy="${cy}" r="3.2" fill="#f3ecd8"/></g>`;
}
function cassetteSVG() {
    const shell = 'M16 4H344Q356 4 356 16V170Q356 176 352 182L336 218Q333 228 322 228H38Q27 228 24 218L8 182Q4 176 4 170V16Q4 4 16 4Z';
    return `<svg id="cass" class="cass" viewBox="0 0 360 232" role="button" aria-label="Casete: pausar o reproducir">
  <defs>
    <linearGradient id="ca-shell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d3dbbd"/><stop offset=".55" stop-color="#b8c4a0"/><stop offset="1" stop-color="#9eae86"/></linearGradient>
    <linearGradient id="ca-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9b690"/><stop offset="1" stop-color="#8e9c78"/></linearGradient>
    <radialGradient id="ca-brass" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#e8d19a"/><stop offset="1" stop-color="#9a7e44"/></radialGradient>
    <radialGradient id="ca-tape" cx="40%" cy="35%" r="80%"><stop offset="0" stop-color="#7a5e50"/><stop offset="1" stop-color="#3f2e27"/></radialGradient>
    <linearGradient id="ca-glare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="ca-shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <pattern id="ca-ging" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#f8c1d0"/><rect width="3" height="6" fill="#ee8fa9" opacity=".65"/><rect width="6" height="3" fill="#ee8fa9" opacity=".65"/></pattern>
    <clipPath id="ca-win"><rect x="92" y="94" width="176" height="48" rx="24"/></clipPath>
  </defs>
  <path d="${shell}" fill="url(#ca-shell)" stroke="#8a9873" stroke-width="2"/>
  <path d="${shell}" transform="translate(180 116) scale(.972) translate(-180 -116)" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.4"/>
  <rect x="16" y="7" width="328" height="5" rx="2.5" fill="rgba(255,255,255,.4)"/>
  <!-- etiqueta -->
  <rect x="26" y="20" width="308" height="132" rx="9" fill="#f6f0dc" stroke="#d6cdae" stroke-width="1.4"/>
  <rect x="26" y="20" width="308" height="25" rx="9" fill="#ebe3c8"/><rect x="26" y="34" width="308" height="11" fill="#ebe3c8"/>
  <circle cx="47" cy="32.5" r="9" fill="#e8879f"/><text x="47" y="37" text-anchor="middle" font-family="Newsreader,Georgia,serif" font-weight="500" font-size="12" fill="#fff">A</text>
  <text x="62" y="36" font-family="Newsreader,Georgia,serif" font-style="italic" font-size="11" fill="#6b6a4a">Lado A</text>
  <text x="318" y="36" text-anchor="end" font-family="Newsreader,Georgia,serif" font-size="9.5" letter-spacing="1.4" fill="#8a8764">C-90 · STEREO ♥</text>
  <path d="M50 74H310M50 94H310" stroke="#b9c5d8" stroke-width="1"/>
  <text id="cLabel1" x="180" y="71" text-anchor="middle" font-family="Caveat,'Segoe Script',cursive" font-weight="600" font-size="27" fill="#3f4a35"></text>
  <text id="cLabel2" x="180" y="91" text-anchor="middle" font-family="Caveat,'Segoe Script',cursive" font-size="16" fill="#8a4a5a"></text>
  ${leafSprig(54, 142, -6, .85)}${leafSprig(72, 128, 14, .7)}${leafSprig(306, 142, 6, .85)}${leafSprig(288, 128, -14, .7)}${leafSprig(48, 100, -16, .6)}${leafSprig(312, 100, 16, .6)}
  <!-- ventanilla -->
  <rect x="92" y="94" width="176" height="48" rx="24" fill="#2b2323" stroke="#1c1616" stroke-width="2"/>
  <rect x="128" y="132" width="104" height="4" fill="#5a463d"/><rect x="128" y="133" width="104" height="1" fill="rgba(255,255,255,.18)"/>
  ${reel(128, 118, 'pl')}${reel(232, 118, 'pr')}
  <path d="M92 94H214L168 142H92Z" fill="url(#ca-glare)" clip-path="url(#ca-win)"/>
  <rect x="26" y="146" width="308" height="3" fill="#e8879f"/><rect x="26" y="149" width="308" height="3" fill="#9fb08a"/>
  <!-- zona inferior -->
  <path d="M40 176H320L334 216Q336 223 328 223H32Q24 223 26 216Z" fill="url(#ca-dark)" stroke="#7f8d69" stroke-width="1.4"/>
  <circle cx="88" cy="200" r="8" fill="#4a5640"/><circle cx="88" cy="200" r="5" fill="#cdd6b6"/><circle cx="88" cy="200" r="2.6" fill="#4a5640"/>
  <circle cx="272" cy="200" r="8" fill="#4a5640"/><circle cx="272" cy="200" r="5" fill="#cdd6b6"/><circle cx="272" cy="200" r="2.6" fill="#4a5640"/>
  ${[150, 171, 192].map(x => `<rect x="${x}" y="190" width="18" height="14" rx="3" fill="#59664c"/><rect x="${x + 1.5}" y="191.5" width="15" height="4" rx="2" fill="rgba(255,255,255,.18)"/>`).join('')}
  <circle class="ledc" cx="318" cy="186" r="3.2"/>
  ${screw(18, 18)}${screw(342, 18)}${screw(16, 160)}${screw(344, 160)}${screw(180, 164)}
  <!-- pegatinas -->
  <g transform="translate(106 164) rotate(-6)"><path d="M0 0L-24-12Q-30-3-24 12Z" fill="url(#ca-ging)" stroke="#c85a78" stroke-width=".9"/><path d="M0 0L24-12Q30-3 24 12Z" fill="url(#ca-ging)" stroke="#c85a78" stroke-width=".9"/><circle r="5.5" fill="#e87b99" stroke="#c85a78" stroke-width=".9"/></g>
  <g transform="translate(252 164)">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<ellipse cy="-8" rx="3.6" ry="6.5" fill="#fffdf7" stroke="#d9c9a8" stroke-width=".6" transform="rotate(${i * 45})"/>`).join('')}<circle r="4.4" fill="#f2c14e"/></g>
  <path transform="translate(292 163) scale(.52)" d="M0 12C-22-4-14-22-4-20C-1-19.5 0-16 0-14C0-16 1-19.5 4-20C14-22 22-4 0 12Z" fill="#e8879f" stroke="#c85a78" stroke-width="1.6"/>
  <path d="M10 8H350" stroke="url(#ca-shine)" stroke-width="0"/>
  </svg>`;
}
$('#cassBox').innerHTML = cassetteSVG();
$('#cLabel1').textContent = CONFIG.titulo;
$('#cLabel2').textContent = `para ${CONFIG.para} · de ${CONFIG.de}`;

// el casete se inclina un poco al pasar el mouse
(function tilt() {
    const el = $('#cass'), wrap = $('#cassWrap');
    wrap.addEventListener('pointermove', e => {
        if (e.pointerType === 'touch') return;
        const r = wrap.getBoundingClientRect();
        el.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 14 + 'deg');
        el.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - .5)) * 14 + 'deg');
    });
    wrap.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
})();

/* ==========================================================
   La carta: flores prensadas y textos
   ========================================================== */
$('#to').textContent = `Para ${CONFIG.para},`;
$('#sigText').textContent = CONFIG.firma;
$('#q').textContent = CONFIG.pregunta;
$('#sq').textContent = CONFIG.subpregunta;
$('#yes').textContent = CONFIG.textoSi;
$('#no').textContent = CONFIG.textoNo;
CONFIG.nota.forEach(t => {
    const p = document.createElement('p');
    p.dataset.text = t;
    p.innerHTML = '<span class="t"></span><span class="r"></span>';
    p.querySelector('.r').textContent = t;
    $('#paras').appendChild(p);
});
$('#corner').innerHTML = `<svg viewBox="-100 -100 200 200">
  <g fill="#6fae6f" stroke="rgba(60,100,60,.35)" stroke-width="1">
    <ellipse cx="-30" cy="42" rx="40" ry="12" transform="rotate(-30 -30 42)"/>
    <ellipse cx="35" cy="50" rx="38" ry="11" transform="rotate(25 35 50)"/>
    <ellipse cx="-2" cy="62" rx="34" ry="10" transform="rotate(-85 -2 62)" fill="#7fbb78"/></g>
  <g transform="translate(-6 2) scale(.52)">${rose('pink')}</g>
  <g transform="translate(46 -38) scale(.32)">${peony('cream')}</g>
  <g transform="translate(-56 -34) scale(.26)">${daisy()}</g>
  <g transform="translate(52 38) scale(.2)">${hydra('lilac')}</g></svg>`;

/* ==========================================================
   Ramo escondido ("Hay más aquí")
   ========================================================== */
function bouquetSVG() {
    const flowers = [['rose', 'pink', 110, 76, .62], ['peony', 'cream', 60, 100, .46], ['lily', 'pink', 160, 96, .5], ['daisy', '', 84, 44, .3], ['hydra', 'lilac', 140, 50, .36], ['cherry', 'blush', 36, 72, .28], ['cherry', 'pink', 186, 66, .28]];
    const stems = [[110, 76], [60, 100], [160, 96], [84, 44], [140, 50], [36, 72], [186, 66]]
        .map(([x, y]) => `<path d="M110 168Q${(110 + x) / 2} ${(168 + y) / 2 + 10} ${x} ${y}" stroke="#5f9a62" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
    return `<svg class="bq-svg" viewBox="0 0 220 250">${stems}
    <path d="M70 120C54 124 44 134 40 146C60 140 72 132 80 124Z" fill="#6fae6f"/><path d="M150 120C166 124 176 134 180 146C160 140 148 132 140 124Z" fill="#78ad72"/>
    ${flowers.map(([t, k, x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">${BUILD[t](k)}</g>`).join('')}
    <path d="M50 134L170 134L126 246L94 246Z" fill="#e3c9a0" stroke="#c4a578" stroke-width="1.4"/>
    <path d="M58 140L110 160L162 140L124 242L96 242Z" fill="rgba(255,214,224,.95)" stroke="#e9a3b8" stroke-width="1.2"/>
    <path d="M110 160L104 242M110 160L116 242" stroke="rgba(190,100,130,.35)" stroke-width="1.2"/>
    <g transform="translate(110 196)"><path d="M0 0L-26-14Q-32 0-26 14Z" fill="#d9567f" stroke="#a83a60"/><path d="M0 0L26-14Q32 0 26 14Z" fill="#d9567f" stroke="#a83a60"/><path d="M-4 6L-14 34M4 6L14 34" stroke="#d9567f" stroke-width="5" stroke-linecap="round"/><circle r="6" fill="#e87b99" stroke="#a83a60"/></g>
  </svg>`;
}
$('#bq').innerHTML = bouquetSVG();
$('#popText').textContent = CONFIG.mensajeExtra;
$('#more').addEventListener('click', () => $('#pop').classList.toggle('show'));
$('#popX').addEventListener('click', () => $('#pop').classList.remove('show'));

/* ==========================================================
   Spotify
   ========================================================== */
let spotify = null, wantPlay = false;
window.onSpotifyIframeApiReady = IFrameAPI => {
    IFrameAPI.createController(
        $('#embed'),
        { uri: 'spotify:playlist:' + CONFIG.playlistId, width: '100%', height: innerWidth > 760 ? 232 : 152 },
        c => {
            spotify = c;
            c.addListener('playback_update', e => $('#cass').classList.toggle('playing', !e.data.isPaused));
            if (wantPlay) { try { c.play(); } catch (e) { } }
        }
    );
};
(function () {
    const s = document.createElement('script');
    s.src = 'https://open.spotify.com/embed/iframe-api/v1';
    s.async = true;
    document.body.appendChild(s);
})();
function startMusic() {
    wantPlay = true;
    if (spotify) { try { spotify.play(); } catch (e) { } }
}
$('#cass').addEventListener('click', () => { if (spotify) { try { spotify.togglePlay(); } catch (e) { } } });

/* ==========================================================
   Abrir el sobre
   ========================================================== */
let opened = false;
function openEnvelope() {
    if (opened) return;
    opened = true;
    $('#envWrap').setAttribute('aria-expanded', 'true');
    $('#env').classList.add('open');
    $('#hint').style.opacity = 0;
    const r = $('#seal').getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 12);     // el sello se rompe
    startMusic();                                              // el clic permite que arranque el audio
    setTimeout(startBloom, 1700);
}
$('#envWrap').addEventListener('click', openEnvelope);

/* ==========================================================
   La carta se escribe sola, con tiempo para leerla
   ========================================================== */
let skip = false, lastUser = 0;
const scroller = $('#scroller');
['wheel', 'touchmove', 'keydown'].forEach(ev => scroller.addEventListener(ev, () => { lastUser = Date.now(); }, { passive: true }));
const caret = document.createElement('i');
caret.className = 'caret';
const sleep = (ms, force) => new Promise(r => setTimeout(r, skip && !force ? 0 : ms));

function followCaret() {
    if (Date.now() - lastUser < 3500) return;
    const b = caret.getBoundingClientRect().bottom, H = innerHeight;
    if (b > H - 150) scroller.scrollBy({ top: b - (H - 190), behavior: 'smooth' });
}
async function typeP(p) {
    const text = p.dataset.text, t = p.querySelector('.t'), r = p.querySelector('.r');
    p.insertBefore(caret, r);
    for (let i = 1; i <= text.length; i++) {
        if (skip) { t.textContent = text; r.textContent = ''; return; }
        t.textContent = text.slice(0, i);
        r.textContent = text.slice(i);
        if (i % 10 === 0) followCaret();
        const ch = text[i - 1];
        let d = CONFIG.msPorLetra * rnd(.55, 1.45);
        if (',;:'.includes(ch)) d += 220; else if ('.!?…'.includes(ch)) d += 520;
        await sleep(d);
    }
    followCaret();
}
async function startReading() {
    $('#skip').addEventListener('click', () => { skip = true; $('#skip').style.display = 'none'; });
    await sleep(700);
    for (const p of document.querySelectorAll('#paras p')) {
        await typeP(p);
        await sleep(CONFIG.pausaParrafo);
    }
    caret.remove();
    $('#skip').style.display = 'none';
    $('#sig').classList.add('in');
    followCaret();
    await sleep(CONFIG.pausaAntesPregunta, true);      // tiempo extra para terminar de leer
    showAsk();
}

/* ==========================================================
   La pregunta (aparece al final de la carta, sin taparla)
   ========================================================== */
function showAsk() {
    $('#ask').classList.add('show');
    $('#more').classList.add('show');
    setTimeout(() => $('#ask').scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
}

const yes = $('#yes'), no = $('#no');
let dodges = 0;
function dodge(e) {
    if (e && e.cancelable) e.preventDefault();
    if (no.parentElement !== document.body) {
        const r = no.getBoundingClientRect();
        document.body.appendChild(no);
        Object.assign(no.style, {
            position: 'fixed', left: r.left + 'px', top: r.top + 'px', zIndex: 80, margin: 0,
            transition: 'left .35s cubic-bezier(.3,1.4,.5,1), top .35s cubic-bezier(.3,1.4,.5,1)'
        });
    }
    const yr = yes.getBoundingClientRect();
    const W = innerWidth, H = innerHeight, bw = no.offsetWidth, bh = no.offsetHeight;
    let x, y, tries = 0;
    do {
        x = rnd(16, W - bw - 16); y = rnd(16, H - bh - 16); tries++;
    } while (tries < 25 && Math.hypot(x + bw / 2 - (yr.left + yr.width / 2), y + bh / 2 - (yr.top + yr.height / 2)) < 190);
    no.style.left = x + 'px';
    no.style.top = y + 'px';
    dodges++;
    yes.style.transform = `scale(${Math.min(1 + dodges * .1, 1.7)})`;
    $('#noMsg').textContent = CONFIG.mensajesNo[Math.min(dodges, CONFIG.mensajesNo.length - 1)];
}
no.addEventListener('pointerenter', dodge);
no.addEventListener('pointerdown', dodge);
no.addEventListener('touchstart', dodge, { passive: false });
no.addEventListener('click', dodge);

yes.addEventListener('click', () => {
    $('#q').textContent = CONFIG.finalTitulo;
    $('#sq').textContent = CONFIG.finalTexto;
    $('#sq').style.marginBottom = '0';
    $('#btns').style.display = 'none';
    $('#noMsg').style.display = 'none';
    no.remove();
    celebrate();
});

/* ---------- ¡dijo que sí! ---------- */
function celebrate() {
    const layer = document.createElement('div');
    layer.className = 'rainlayer';
    document.body.appendChild(layer);
    const W = innerWidth, H = innerHeight;
    for (let i = 0; i < 26; i++) {
        const size = rnd(60, 130), f = makeFlower(size);
        f.style.left = (W / 2 - size / 2) + 'px'; f.style.top = (H / 2 - size / 2) + 'px';
        layer.appendChild(f);
        const a = rnd(0, 6.283), d = rnd(W * .2, Math.max(W, H) * .75);
        f.animate([
            { transform: 'translate(0,0) scale(.1) rotate(0)', opacity: 1 },
            { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(1) rotate(${rnd(-200, 200)}deg)`, opacity: 1, offset: .7 },
            { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 90}px) scale(.9) rotate(${rnd(-260, 260)}deg)`, opacity: 0 }
        ], { duration: rnd(2200, 3400), easing: 'cubic-bezier(.15,.8,.3,1)', fill: 'forwards' }).onfinish = () => f.remove();
    }
    burst(W / 2, H / 2, 40);
    setInterval(() => {
        const size = rnd(46, 96), f = makeFlower(size);
        f.style.left = rnd(-size / 2, W - size / 2) + 'px';
        f.style.top = (-size) + 'px';
        layer.appendChild(f);
        f.animate([
            { transform: `translateY(0) rotate(${rnd(-40, 40)}deg)` },
            { transform: `translateY(${H + size * 2}px) rotate(${rnd(200, 520)}deg)` }
        ], { duration: rnd(4500, 8500), easing: 'linear' }).onfinish = () => f.remove();
    }, 200);
}