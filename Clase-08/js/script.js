const form     = document.getElementById('formulario');
const saludo   = document.getElementById('saludo');
const inputs   = form.querySelectorAll('input');

// 1) Manejo de saludo dinámico
inputs.forEach(input => {
  if (input.id === 'nombre') {
    const actualizarSaludo = () => {
      setTimeout(() => {
        saludo.textContent = 'HOLA ' + input.value.toUpperCase();
      }, 0);
    };
    input.addEventListener('keydown', actualizarSaludo);
    input.addEventListener('focus',  actualizarSaludo);
  }
});

// 2) Validación inline (blur / focus)
inputs.forEach(input => {
  input.addEventListener('blur', () => {
    mostrarError(input, validar(input));
  });
  input.addEventListener('focus', () => {
    mostrarError(input, '');
  });
});

// 3) Manejador de envío
form.addEventListener('submit', e => {
  e.preventDefault();
  let errores = [];

  // Validamos todos los inputs
  inputs.forEach(input => {
    const mensaje = validar(input);
    mostrarError(input, mensaje);
    if (mensaje) errores.push(mensaje);
  });

  if (errores.length === 0) {
    // --- No hay errores: recogemos datos ---
    const datos = {};
    inputs.forEach(i => datos[i.name] = i.value.trim());

    // --- Envío simulado via fetch GET ---
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(res => {
        if (!res.ok) throw new Error('Código: ' + res.status);
        return res.json();
      })
      .then(() => {
        // Guardamos los datos en LocalStorage
        localStorage.setItem('datosSuscripcion', JSON.stringify(datos));
        // Mostramos modal de éxito
        mostrarModal(
          '¡Suscripción exitosa!',
          'Gracias por registrarte',
          JSON.stringify(datos, null, 2)
        );
      })
      .catch(err => {
        // Mostramos modal de error
        mostrarModal(
          'Error al enviar',
          'Ocurrió un error',
          err.message
        );
      });

  } else {
    alert('Errores:\n\n' + errores.join('\n'));
  }
});

// 4) Carga de datos guardados al iniciar
window.addEventListener('DOMContentLoaded', () => {
  const guardados = localStorage.getItem('datosSuscripcion');
  if (guardados) {
    const data = JSON.parse(guardados);
    inputs.forEach(i => {
      if (data[i.name]) i.value = data[i.name];
    });
    // Actualizo saludo si había nombre
    if (data.nombre) saludo.textContent = 'HOLA ' + data.nombre.toUpperCase();
  }
});

// 5) Función de validación
function validar(input) {
  const val = input.value.trim();
  switch (input.name) {
    case 'nombre':
      return val.length > 6 && val.includes(' ') 
        ? '' : 'Debe tener más de 6 letras y un espacio.';
    case 'email':
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) 
        ? '' : 'Email inválido.';
    case 'password':
      return /^[A-Za-z0-9]{8,}$/.test(val) 
        ? '' : 'Mínimo 8 caracteres letras/números.';
    case 'repetirPassword':
      return val === form.password.value 
        ? '' : 'Las contraseñas no coinciden.';
    case 'edad':
      return Number(val) >= 18 
        ? '' : 'Edad mínima 18.';
    case 'telefono':
      return /^\d{7,}$/.test(val) 
        ? '' : 'Teléfono inválido (sólo números, mínimo 7 dígitos).';
    case 'direccion':
      return val.length >= 5 && val.includes(' ') 
        ? '' : 'Dirección inválida.';
    case 'ciudad':
      return val.length >= 3 
        ? '' : 'Ciudad inválida.';
    case 'codigoPostal':
      return val.length >= 3 
        ? '' : 'Código postal inválido.';
    case 'dni':
      return /^\d{7,8}$/.test(val) 
        ? '' : 'DNI debe tener 7 u 8 dígitos.';
    default:
      return '';
  }
}

// 6) Función para mostrar/ocultar errores de campo
function mostrarError(input, mensaje) {
  const errorElement = input.nextElementSibling;
  errorElement.textContent = mensaje;
  if (mensaje) {
    input.classList.add('error-input');
  } else {
    input.classList.remove('error-input');
  }
}

// 7) Funciones de modal + redirección
function mostrarModal(titulo, mensaje, datos = '') {
  const modal    = document.getElementById('modal');
  document.getElementById('modal-titulo').textContent  = titulo;
  document.getElementById('modal-mensaje').textContent = mensaje;
  document.getElementById('modal-datos').textContent   = datos;
  modal.classList.remove('oculto');
}

function ocultarModalYredirigir() {
  const modal = document.getElementById('modal');
  modal.classList.add('oculto');
  window.location.href = 'index.html';
}

// 8) Eventos para cerrar modal y redirigir
document.getElementById('modal-cerrar')
        .addEventListener('click', ocultarModalYredirigir);

window.addEventListener('click', e => {
  const modal = document.getElementById('modal');
  if (e.target === modal) ocultarModalYredirigir();
});
