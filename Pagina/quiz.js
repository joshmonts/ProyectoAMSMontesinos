// Estado inicial del usuario en almacenamiento local
let estadoUsuario = JSON.parse(localStorage.getItem('usuarioIA')) || null;

document.addEventListener('DOMContentLoaded', () => {
  if (estadoUsuario) {
    mostrarDashboard();
  }
});

// Registro de usuario (RF-06)
document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const nombre = document.getElementById('reg-name').value.trim();
  const correo = document.getElementById('reg-email').value.trim();

  estadoUsuario = {
    nombre,
    correo,
    mod1: false,
    mod2: false,
    mod3: false,
    calificacion: 0
  };

  guardarEstado();
  mostrarDashboard();
});

// Inicio de sesión (RF-06)
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const correo = document.getElementById('login-email').value.trim();

  if (!estadoUsuario) {
    estadoUsuario = {
      nombre: correo.split('@')[0],
      correo,
      mod1: false,
      mod2: false,
      mod3: false,
      calificacion: 0
    };
  }
  guardarEstado();
  mostrarDashboard();
});

function guardarEstado() {
  localStorage.setItem('usuarioIA', JSON.stringify(estadoUsuario));
}

function mostrarDashboard() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('nav-user').classList.remove('hidden');
  document.getElementById('user-greeting').textContent = `Hola, ${estadoUsuario.nombre}`;
  volverDashboard();
  actualizarBarraProgreso();
}

function cerrarSesion() {
  localStorage.removeItem('usuarioIA');
  estadoUsuario = null;
  location.reload();
}

function abrirVista(idVista) {
  document.getElementById('dashboard-section').classList.add('hidden');
  document.getElementById('modulo1-view').classList.add('hidden');
  document.getElementById('modulo2-view').classList.add('hidden');
  document.getElementById('modulo3-view').classList.add('hidden');

  document.getElementById(idVista).classList.remove('hidden');
}

function volverDashboard() {
  document.getElementById('modulo1-view').classList.add('hidden');
  document.getElementById('modulo2-view').classList.add('hidden');
  document.getElementById('modulo3-view').classList.add('hidden');
  document.getElementById('dashboard-section').classList.remove('hidden');
  actualizarBarraProgreso();
}

function completarModulo(numero) {
  if (numero === 1) estadoUsuario.mod1 = true;
  if (numero === 2) estadoUsuario.mod2 = true;
  guardarEstado();
  alert(`¡Módulo ${numero} completado! Tu progreso ha sido actualizado.`);
  volverDashboard();
}

function actualizarBarraProgreso() {
  let completados = 0;
  if (estadoUsuario.mod1) completados++;
  if (estadoUsuario.mod2) completados++;
  if (estadoUsuario.mod3) completados++;

  const porcentaje = Math.round((completados / 3) * 100);
  document.getElementById('progress-bar-fill').style.width = `${porcentaje}%`;
  document.getElementById('progress-text').textContent = `${porcentaje}% Completado`;
}

// Lógica de Evaluación Automática (RF-04, RF-05 y corrección BUG-02)
document.getElementById('quiz-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const respuestasCorrectas = {
    q1: 'b',
    q2: 'b',
    q3: 'a',
    q4: 'b'
  };

  let aciertos = 0;
  const totalPreguntas = Object.keys(respuestasCorrectas).length;

  // Validar que no queden preguntas sin responder (BUG-02)
  for (let pregunta of Object.keys(respuestasCorrectas)) {
    const seleccionada = document.querySelector(`input[name="${pregunta}"]:checked`);
    if (!seleccionada) {
      alert('Por favor responde todas las preguntas antes de enviar la evaluación.');
      return;
    }
    if (seleccionada.value === respuestasCorrectas[pregunta]) {
      aciertos++;
    }
  }

  const calificacion = (aciertos / totalPreguntas) * 100;
  const resultBox = document.getElementById('quiz-result');
  resultBox.classList.remove('hidden', 'result-pass', 'result-fail');

  if (calificacion >= 80) {
    estadoUsuario.mod3 = true;
    estadoUsuario.calificacion = calificacion;
    guardarEstado();
    actualizarBarraProgreso();

    resultBox.classList.add('result-pass');
    resultBox.innerHTML = `¡Felicidades! Aprobaste la evaluación con <strong>${calificacion}/100</strong> (${aciertos} de ${totalPreguntas} aciertos). Tu progreso se ha actualizado.`;
  } else {
    resultBox.classList.add('result-fail');
    resultBox.innerHTML = `Obtuviste <strong>${calificacion}/100</strong> (${aciertos} de ${totalPreguntas} aciertos). Necesitas al menos 80/100 para aprobar. Revisa los módulos e inténtalo de nuevo.`;
  }
});
