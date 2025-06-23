document.addEventListener("DOMContentLoaded", function () {
  // Referencias
  const form       = document.getElementById("form-suscripcion");
  const saludo     = document.getElementById("titulo-form");
  const inputs     = form.querySelectorAll("input");
  const nombreInput= document.getElementById("nombre");

  // 1) Saludo dinámico
  function actualizarSaludo() {
    setTimeout(() => {
      saludo.textContent = "HOLA " + nombreInput.value.toUpperCase();
    }, 0);
  }
  nombreInput.addEventListener("keydown", actualizarSaludo);
  nombreInput.addEventListener("focus",  actualizarSaludo);

  // 2) Validación inline (blur/focus)
  inputs.forEach(input => {
    input.addEventListener("blur", () => {
      mostrarError(input, validar(input));
    });
    input.addEventListener("focus", () => {
      mostrarError(input, "");
    });
  });

  // 3) Envío de formulario
  form.addEventListener("submit", e => {
    e.preventDefault();
    let errores = [];

    // Validamos cada campo
    inputs.forEach(input => {
      const mensaje = validar(input);
      mostrarError(input, mensaje);
      if (mensaje) errores.push(mensaje);
    });

    if (errores.length === 0) {
      // Recogemos datos
      const datosFinales = {};
      inputs.forEach(i => datosFinales[i.name] = i.value.trim());

      // Simulamos llamada GET a JSONPlaceholder
      fetch("https://jsonplaceholder.typicode.com/posts/1")
        .then(res => {
          if (!res.ok) throw new Error("Código: " + res.status);
          return res.json();
        })
        .then(() => {
          // Guardamos en LocalStorage
          localStorage.setItem("datosSuscripcion", JSON.stringify(datosFinales));
          // Mostramos modal de éxito
          mostrarModal(
            "¡Suscripción exitosa!",
            "Gracias por registrarte",
            JSON.stringify(datosFinales, null, 2)
          );
        })
        .catch(err => {
          // Mostramos modal de error
          mostrarModal("Error al enviar", "Ocurrió un error", err.message);
        });

    } else {
      alert("Errores encontrados:\n\n" + errores.join("\n"));
    }
  });

  // 4) Precarga desde LocalStorage
  const guardados = localStorage.getItem("datosSuscripcion");
  if (guardados) {
    const data = JSON.parse(guardados);
    inputs.forEach(i => {
      if (data[i.name]) i.value = data[i.name];
    });
    if (data.nombre) saludo.textContent = "HOLA " + data.nombre.toUpperCase();
  }
});

// 5) Función de validación
function validar(input) {
  const val = input.value.trim();
  switch (input.name) {
    case "nombre":
      return val.length > 6 && val.includes(" ")
        ? ""
        : "Debe tener más de 6 letras y un espacio.";

    case "email":
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)
        ? ""
        : "Email inválido.";

    case "password":
      // 8+ chars, al menos una letra y un número
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
        : "Teléfono inválido (solo números, min 7 dígitos).";

    case "direccion":
      return val.length >= 5 && val.includes(" ")
        ? ""
        : "Dirección inválida.";

    case "ciudad":
      return val.length >= 3
        ? ""
        : "Ciudad inválida.";

    case "cp":
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


// 6) Mostrar/ocultar error en cada input
function mostrarError(input, mensaje) {
  const errorEl = input.nextElementSibling;
  errorEl.textContent = mensaje;
  if (mensaje) input.classList.add("error-input");
  else        input.classList.remove("error-input");
}

// 7) Modal y redirección
function mostrarModal(titulo, mensaje, datos = "") {
  const modal = document.getElementById("modal");
  document.getElementById("modal-titulo").textContent  = titulo;
  document.getElementById("modal-mensaje").textContent = mensaje;
  document.getElementById("modal-datos").textContent   = datos;
  modal.classList.remove("oculto");
}

function ocultarModalYredirigir() {
  const modal = document.getElementById("modal");
  modal.classList.add("oculto");
  window.location.href = "index.html";
}

// 8) Eventos para cerrar modal
document.getElementById("modal-cerrar")
        .addEventListener("click", ocultarModalYredirigir);

window.addEventListener("click", e => {
  const modal = document.getElementById("modal");
  if (e.target === modal) ocultarModalYredirigir();
});
