document.addEventListener("DOMContentLoaded", () => {
  const form       = document.getElementById("form-suscripcion");
  const saludo     = document.getElementById("titulo-form");
  const inputs     = form.querySelectorAll("input");
  const nombreInput= document.getElementById("nombre");

  // Saludo dinámico
  function actualizarSaludo() {
    saludo.textContent = "HOLA " + nombreInput.value.toUpperCase();
  }
  nombreInput.addEventListener("keydown", actualizarSaludo);
  nombreInput.addEventListener("focus",  actualizarSaludo);

  // Validación inline
  inputs.forEach(input => {
    input.addEventListener("blur", () => {
      const msg = validar(input);
      mostrarError(input, msg);
    });
    input.addEventListener("focus", () => mostrarError(input, ""));
  });

});

// 5) Función de validación
function validar(input) {
  const val = input.value.trim();
  switch (input.name) {
    case "nombre":
      return val.length > 6 && val.includes(" ")
        ? "" : "Debe tener más de 6 letras y un espacio.";
    case "email":
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)
        ? "" : "Email inválido.";
    case "password":
      return /^[A-Za-z0-9]{8,}$/.test(val)
        ? "" : "Mínimo 8 caracteres letras/números.";
    case "repassword":
      return val === document.getElementById("password").value
        ? "" : "Las contraseñas no coinciden.";
    case "edad":
      return Number(val) >= 18
        ? "" : "Edad mínima 18.";
    case "telefono":
      return /^\d{7,}$/.test(val)
        ? "" : "Teléfono inválido (sólo números, mínimo 7 dígitos).";
    case "direccion":
      return val.length >= 5 && val.includes(" ")
        ? "" : "Dirección inválida.";
    case "ciudad":
      return val.length >= 3
        ? "" : "Ciudad inválida.";
    case "cp":
      return val.length >= 3
        ? "" : "Código postal inválido.";
    case "dni":
      return /^[0-9]{7,8}$/.test(val)
        ? "" : "DNI debe tener 7 u 8 dígitos.";
    default:
      return "";
  }
}
function mostrarError(input, mensaje) {
  const err = input.nextElementSibling;
  err.textContent = mensaje;
}

