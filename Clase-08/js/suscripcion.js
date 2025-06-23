document.addEventListener("DOMContentLoaded", () => {
  // Referencias
  const form        = document.getElementById("formulario");
  const saludo      = document.getElementById("saludo");
  const inputs      = form.querySelectorAll("input");
  const nombreInput = document.getElementById("nombre");

  // 1) Saludo dinámico
  nombreInput.addEventListener("input", () => {
    saludo.textContent = "HOLA " + nombreInput.value.trim().toUpperCase();
  });

  // 2) Validación inline (blur / focus)
  inputs.forEach(input => {
    input.addEventListener("blur",  () => mostrarError(input, validar(input)));
    input.addEventListener("focus", () => mostrarError(input, ""));
  });

  // 3) Envío de formulario
  form.addEventListener("submit", e => {
    e.preventDefault();
    const errores = [];

    inputs.forEach(input => {
      const msg = validar(input);
      mostrarError(input, msg);
      if (msg) errores.push(msg);
    });

    if (errores.length) {
      alert("Errores:\n\n" + errores.join("\n"));
      return;
    }

    // Si todo OK, guardo y notifico
    const datos = {};
    inputs.forEach(i => datos[i.name] = i.value.trim());
    localStorage.setItem("datosSuscripcion", JSON.stringify(datos));
    alert("¡Suscripción exitosa!");
  });

  // 4) Precarga desde localStorage
  const guardados = localStorage.getItem("datosSuscripcion");
  if (guardados) {
    const data = JSON.parse(guardados);
    inputs.forEach(i => { if (data[i.name]) i.value = data[i.name] });
    if (data.nombre) saludo.textContent = "HOLA " + data.nombre.toUpperCase();
  }
});

// Función de validación
function validar(input) {
  const val = input.value.trim();
  switch (input.name) {
    case "nombre":
      return val.length > 6 && val.includes(" ")
        ? ""
        : "Debe tener más de 6 caracteres y un espacio.";
    case "email":
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)
        ? ""
        : "Email inválido.";
    case "password":
      return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(val)
        ? ""
        : "Mínimo 8 caracteres, al menos una letra y un número.";
    case "repetirPassword":
      return val === document.getElementById("password").value
        ? ""
        : "Las contraseñas no coinciden.";
    case "edad":
      return Number(val) >= 18
        ? ""
        : "Edad mínima 18.";
    case "telefono":
      return /^\d{7,}$/.test(val)
        ? ""
        : "Teléfono inválido (sólo números, min. 7 dígitos).";
    case "direccion":
      return val.length >= 5 && val.includes(" ")
        ? ""
        : "Dirección inválida.";
    case "ciudad":
      return val.length >= 3
        ? ""
        : "Ciudad inválida.";
    case "codigoPostal":
      return val.length >= 3
        ? ""
        : "Código postal inválido.";
    case "dni":
      return /^[0-9]{7,8}$/.test(val)
        ? ""
        : "DNI debe tener 7 u 8 dígitos.";
    default:
      return "";
  }
}

// Mostrar u ocultar mensaje de error
function mostrarError(input, mensaje) {
  const err = input.nextElementSibling;
  err.textContent = mensaje;
  input.classList.toggle("error-input", !!mensaje);
}
