const form = document.getElementById('formulario');
const saludo = document.getElementById('saludo');
const inputs = form.querySelectorAll('input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let errores = [];

  inputs.forEach(input => {
    const mensaje = validar(input);
    mostrarError(input, mensaje);
    if (mensaje) errores.push(mensaje);
  });

  if (errores.length === 0) {
    alert("Formulario enviado correctamente");
    window.location.href = "index.html"; // Cambialo por el nombre de tu archivo si es distinto
  } else {
    alert("Errores:\n\n" + errores.join('\n'));
  }

});

inputs.forEach(input => {
  input.addEventListener('blur', () => {
    mostrarError(input, validar(input));
  });

  input.addEventListener('focus', () => {
    mostrarError(input, '');
  });

  if (input.id === 'nombre') {
    const actualizarSaludo = () => {
      setTimeout(() => {
        saludo.textContent = 'HOLA ' + input.value.toUpperCase();
      }, 0);
    };

    input.addEventListener('keydown', actualizarSaludo);
    input.addEventListener('focus', actualizarSaludo);
  }
});

function validar(input) {
  const val = input.value.trim();
  switch (input.name) {
    case 'nombre':
      return val.length > 6 && val.includes(' ') ? '' : 'Debe tener más de 6 letras y un espacio.';
    case 'email':
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) ? '' : 'Email inválido.';
    case 'password':
      return /^[A-Za-z0-9]{8,}$/.test(val) ? '' : 'Mínimo 8 caracteres letras/números.';
    case 'repetirPassword':
      return val === form.password.value ? '' : 'Las contraseñas no coinciden.';
    case 'edad':
      return Number(val) >= 18 ? '' : 'Edad mínima 18.';
    case 'telefono':
      return /^\d{7,}$/.test(val) ? '' : 'Teléfono inválido (sólo números, mínimo 7 dígitos).';
    case 'direccion':
      return val.length >= 5 && val.includes(' ') ? '' : 'Dirección inválida.';
    case 'ciudad':
      return val.length >= 3 ? '' : 'Ciudad inválida.';
    case 'codigoPostal':
      return val.length >= 3 ? '' : 'Código postal inválido.';
    case 'dni':
      return /^\d{7,8}$/.test(val) ? '' : 'DNI debe tener 7 u 8 dígitos.';
    default:
      return '';
  }
}

function mostrarError(input, mensaje) {
  const errorElement = input.nextElementSibling;
  errorElement.textContent = mensaje;

  if (mensaje) {
    input.classList.add('error-input');
  } else {
    input.classList.remove('error-input');
  }
}