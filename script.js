const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ANCHO = canvas.width;
const ALTO = canvas.height;
const HORIZONTE_Y = 480;

let regAlAbierto = false;
let tiempo = 0;

function togglePestana(id) {
  const panelObjetivo = document.getElementById(`panel-${id}`);
  const yaEstaVisible = panelObjetivo.classList.contains('visible');

  cerrarPaneles();

  if (!yaEstaVisible) {
    panelObjetivo.classList.add('visible');
    const botones = document.querySelectorAll('.btn-pestana');
    botones.forEach(b => {
      if (b.getAttribute('onclick').includes(id)) {
        b.classList.add('activo');
      }
    });
  }
}

function cerrarPaneles() {
  const paneles = document.querySelectorAll('.panel-contenido');
  const botones = document.querySelectorAll('.btn-pestana');
  paneles.forEach(p => p.classList.remove('visible'));
  botones.forEach(b => b.classList.remove('activo'));
}

function abrirRegalo() {
  document.getElementById('tarjeta-regalo').classList.add('oculto');
  document.getElementById('btn-inicio').style.display = 'block';
  regAlAbierto = true;
  iniciarTypewriter();
}

function volverInicio() {
  document.getElementById('tarjeta-regalo').classList.remove('oculto');
  document.getElementById('btn-inicio').style.display = 'none';
  cerrarPaneles();
  regAlAbierto = false;
  textoActual = "";
  indexChar = 0;
}

const mensajeTexto = "¡Para Yudi, con mucho cariño!";
let textoActual = "";
let indexChar = 0;

function iniciarTypewriter() {
  if (indexChar < mensajeTexto.length && regAlAbierto) {
    textoActual += mensajeTexto[indexChar];
    indexChar++;
    setTimeout(iniciarTypewriter, 60);
  }
}

// --- Elementos de Fondo ---
const estrellas = Array.from({ length: 35 }, () => ({
  x: Math.random() * ANCHO,
  y: Math.random() * 320,
  r: Math.random() * 1.8 + 0.5,
  alpha: Math.random()
}));

const petalosCaidos = Array.from({ length: 16 }, () => ({
  x: Math.random() * ANCHO,
  y: Math.random() * HORIZONTE_Y,
  vy: Math.random() * 1.2 + 0.8,
  vx: Math.random() * 0.5 - 0.25,
  rot: Math.random() * Math.PI * 2,
  vRot: Math.random() * 0.05 - 0.025
}));

const luciernagas = Array.from({ length: 14 }, () => ({
  x: Math.random() * ANCHO,
  y: Math.random() * (HORIZONTE_Y - 100) + 100,
  r: Math.random() * 2 + 1,
  fase: Math.random() * Math.PI * 2
}));

// --- Palabras Flotantes ---
const LISTA_PALABRAS = [
  "Guapa", "Hermosa", "Niña linda", 
  "Eres increíble", "Una gran mujer", "Valiente", 
  "Especial", "Luminosa"
];

const palabrasFlotantes = [];

function crearPalabraFlotante() {
  const texto = LISTA_PALABRAS[Math.floor(Math.random() * LISTA_PALABRAS.length)];
  palabrasFlotantes.push({
    texto: texto,
    x: Math.random() * (ANCHO - 200) + 100,
    y: ALTO - 60,
    vy: Math.random() * 0.6 + 0.5,
    alpha: 0,
    fase: Math.random() * Math.PI * 2,
    fadingIn: true
  });
}

// --- Corazones en las Manos y Clic ---
const corazonesManos = [];
const corazonesClic = [];

canvas.addEventListener('click', (e) => {
  if (!regAlAbierto) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = 0; i < 5; i++) {
    corazonesClic.push({
      x: x + (Math.random() - 0.5) * 30,
      y: y,
      vy: Math.random() * 2 + 1.5,
      alpha: 1.0,
      size: Math.random() * 8 + 14
    });
  }
});

// --- Funciones de Dibujo ---
function dibujarFondo() {
  let gradCielo = ctx.createLinearGradient(0, 0, 0, HORIZONTE_Y);
  gradCielo.addColorStop(0, '#0F0A2D');
  gradCielo.addColorStop(1, '#FF825A');
  ctx.fillStyle = gradCielo;
  ctx.fillRect(0, 0, ANCHO, HORIZONTE_Y);

  let gradSol = ctx.createRadialGradient(680, 290, 10, 680, 290, 80);
  gradSol.addColorStop(0, '#FFF6D5');
  gradSol.addColorStop(0.3, '#FFC46B');
  gradSol.addColorStop(1, 'transparent');
  ctx.fillStyle = gradSol;
  ctx.beginPath();
  ctx.arc(680, 290, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#255C30';
  ctx.beginPath();
  ctx.arc(200, HORIZONTE_Y + 120, 220, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1F4F28';
  ctx.beginPath();
  ctx.arc(750, HORIZONTE_Y + 100, 200, 0, Math.PI * 2);
  ctx.fill();

  let gradSuelo = ctx.createLinearGradient(0, HORIZONTE_Y, 0, ALTO);
  gradSuelo.addColorStop(0, '#285A28');
  gradSuelo.addColorStop(1, '#081E0C');
  ctx.fillStyle = gradSuelo;
  ctx.fillRect(0, HORIZONTE_Y, ANCHO, ALTO - HORIZONTE_Y);
}

function dibujarGirasol(cx, cy, escala) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(escala, escala);

  ctx.strokeStyle = '#228B22';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-10, 120, 0, 240);
  ctx.stroke();

  ctx.fillStyle = '#1E5B16';
  ctx.beginPath();
  ctx.ellipse(-35, 100, 30, 15, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(35, 140, 30, 15, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  let gradHalo = ctx.createRadialGradient(0, 0, 20, 0, 0, 110);
  gradHalo.addColorStop(0, 'rgba(255, 239, 176, 0.35)');
  gradHalo.addColorStop(1, 'rgba(255, 239, 176, 0)');
  ctx.fillStyle = gradHalo;
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.fill();

  const petalos = 22;
  for (let capa = 0; capa < 2; capa++) {
    const rLong = capa === 0 ? 110 : 90;
    const offset = capa === 0 ? 0 : Math.PI / petalos;
    
    for (let i = 0; i < petalos; i++) {
      let ang = (i * (Math.PI * 2 / petalos)) + offset;
      ctx.save();
      ctx.rotate(ang);
      
      let gradP = ctx.createLinearGradient(0, 0, 0, -rLong);
      gradP.addColorStop(0, '#E8A400');
      gradP.addColorStop(0.7, '#FFD700');
      gradP.addColorStop(1, '#FFE066');
      
      ctx.fillStyle = gradP;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-16, -rLong / 2, 0, -rLong);
      ctx.quadraticCurveTo(16, -rLong / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.fillStyle = '#3B2219';
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.fill();

  const goldenAngle = 137.5 * (Math.PI / 180);
  for (let i = 0; i < 70; i++) {
    let r = Math.sqrt(i) * 4.5;
    let theta = i * goldenAngle;
    let x = r * Math.cos(theta);
    let y = r * Math.sin(theta);
    ctx.fillStyle = (i % 4 === 0) ? '#FFC300' : '#8B4513';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// --- Pareja Tomada de la Mano ---
function dibujarPareja(cx, cy, escala) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(escala, escala);

  const piel = "#F1C27D";
  
  // Él (Izquierda)
  ctx.fillStyle = "#2B3A67";
  ctx.fillRect(-22, -30, 8, 30);
  ctx.fillRect(-12, -30, 8, 30);
  ctx.fillStyle = "#3F7CAC";
  ctx.fillRect(-25, -65, 22, 35);
  ctx.fillStyle = piel;
  ctx.beginPath(); ctx.arc(-14, -78, 10, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#4B3621";
  ctx.beginPath(); ctx.arc(-14, -82, 10, Math.PI, Math.PI*2); ctx.fill();

  ctx.strokeStyle = piel;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-5, -50);
  ctx.lineTo(2, -42);
  ctx.stroke();

  // Ella (Derecha)
  ctx.fillStyle = "#E75480";
  ctx.beginPath();
  ctx.moveTo(10, -30); ctx.lineTo(38, 0); ctx.lineTo(2, 0); ctx.closePath();
  ctx.fill();
  ctx.fillRect(13, -65, 16, 38);
  ctx.fillStyle = piel;
  ctx.beginPath(); ctx.arc(21, -76, 10, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#2E1A0F";
  ctx.fillRect(11, -84, 20, 45);

  ctx.strokeStyle = piel;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(13, -50);
  ctx.lineTo(6, -42);
  ctx.stroke();

  // Punto de Manos Unidas
  ctx.fillStyle = piel;
  ctx.beginPath();
  ctx.arc(4, -42, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// --- Bucle Principal ---
function animar() {
  tiempo++;
  ctx.clearRect(0, 0, ANCHO, ALTO);

  dibujarFondo();

  // Estrellas Titilantes
  estrellas.forEach(e => {
    e.alpha += (Math.random() - 0.5) * 0.05;
    e.alpha = Math.max(0.2, Math.min(1, e.alpha));
    ctx.fillStyle = `rgba(255, 255, 255, ${e.alpha})`;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
  });

  if (regAlAbierto) {
    dibujarGirasol(180, 480, 0.45);
    dibujarGirasol(780, 490, 0.4);
    dibujarGirasol(475, 410, 1.0);

    const parejX = 310;
    const parejY = 560;
    const parejEscala = 1.1;
    dibujarPareja(parejX, parejY, parejEscala);

    // Corazones desde las manos
    if (tiempo % 25 === 0) {
      corazonesManos.push({
        x: parejX + 4 * parejEscala + (Math.random() - 0.5) * 6,
        y: parejY - 42 * parejEscala,
        vy: Math.random() * 1.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.6,
        alpha: 1.0,
        size: Math.random() * 6 + 12
      });
    }

    for (let i = corazonesManos.length - 1; i >= 0; i--) {
      let c = corazonesManos[i];
      c.y -= c.vy;
      c.x += c.vx;
      c.alpha -= 0.012;
      if (c.alpha <= 0) {
        corazonesManos.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(255, 51, 102, ${c.alpha})`;
      ctx.font = `${c.size}px Arial`;
      ctx.fillText("❤️", c.x, c.y);
    }

    // Palabras Flotantes
    if (tiempo % 110 === 0 && palabrasFlotantes.length < 6) {
      crearPalabraFlotante();
    }

    for (let i = palabrasFlotantes.length - 1; i >= 0; i--) {
      let p = palabrasFlotantes[i];
      p.y -= p.vy;
      p.fase += 0.03;
      let xOscilada = p.x + Math.sin(p.fase) * 15;

      if (p.fadingIn) {
        p.alpha += 0.02;
        if (p.alpha >= 0.85) p.fadingIn = false;
      } else {
        p.alpha -= 0.006;
      }

      if (p.alpha <= 0 || p.y < 120) {
        palabrasFlotantes.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.fillStyle = `rgba(255, 235, 150, ${p.alpha})`;
      ctx.font = "italic bold 22px 'Dancing Script', Georgia, serif";
      ctx.shadowColor = `rgba(0, 0, 0, ${p.alpha * 0.8})`;
      ctx.shadowBlur = 6;
      ctx.fillText(p.texto, xOscilada, p.y);
      ctx.restore();
    }

    // Pétalos Cayendo
    petalosCaidos.forEach(p => {
      p.y += p.vy;
      p.x += Math.sin(tiempo * 0.03 + p.y) * 0.8;
      p.rot += p.vRot;
      if (p.y > ALTO) p.y = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.ellipse(0, 0, 4, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Luciérnagas
    luciernagas.forEach(l => {
      l.fase += 0.05;
      let alpha = (Math.sin(l.fase) + 1) / 2;
      ctx.fillStyle = `rgba(255, 244, 176, ${alpha})`;
      ctx.beginPath();
      ctx.arc(l.x + Math.sin(l.fase) * 15, l.y + Math.cos(l.fase) * 10, l.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Corazones por Clic
    for (let i = corazonesClic.length - 1; i >= 0; i--) {
      let c = corazonesClic[i];
      c.y -= c.vy;
      c.alpha -= 0.015;
      if (c.alpha <= 0) {
        corazonesClic.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(255, 51, 102, ${c.alpha})`;
      ctx.font = `bold ${c.size}px Arial`;
      ctx.fillText("❤️", c.x, c.y);
    }

    // Título Principal Centrado y Elegante
    if (textoActual.length > 0) {
      ctx.save();
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 44px 'Dancing Script', Georgia, cursive";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillText(textoActual, ANCHO / 2, 150);
      ctx.restore();
    }

    if (indexChar >= mensajeTexto.length) {
      ctx.save();
      ctx.fillStyle = "#FFE9A8";
      ctx.font = "italic bold 18px Georgia";
      ctx.textAlign = "right";
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 6;
      ctx.fillText("ATT: Bryan", ANCHO - 40, ALTO - 30);
      ctx.restore();
    }
  }

  requestAnimationFrame(animar);
}

animar();