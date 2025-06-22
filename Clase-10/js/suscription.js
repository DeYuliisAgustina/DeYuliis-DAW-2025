document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-suscripcion");
  const nombreInput = document.getElementById("nombre");
  const tituloForm = document.getElementById("titulo-form");

  // saludo dinámico
  nombreInput.addEventListener("keydown", () => {
    setTimeout(() => {
      tituloForm.textContent = "HOLA " + nombreInput.value.toUpperCase();
    }, 0);
  });

  const campos = {
    nombre: {
      input: document.getElementById("nombre"),
      error: document.getElementById("error-nombre"),
      validar: v => v.length > 6 && v.includes(" "),
      mensaje: "Debe tener más de 6 letras y un espacio."
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("error-email"),
      validar: v => /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(v),
      mensaje: "Debe ser un email válido."
    },
    password: {
      input: document.getElementById("password"),
      error: document.getElementById("error-password"),
      validar: v => /^[a-zA-Z0-9]{8,}$/.test(v),
      mensaje: "Debe tener al menos 8 caracteres con letras y números."
    },
    repassword: {
      input: document.getElementById("repassword"),
      error: document.getElementById("error-repassword"),
      validar: v => v === document.getElementById("password").value,
      mensaje: "Las contraseñas no coinciden."
    },
    edad: {
      input: document.getElementById("edad"),
      error: document.getElementById("error-edad"),
      validar: v => Number.isInteger(+v) && +v >= 18,
      mensaje: "Debe ser mayor o igual a 18."
    },
    telefono: {
      input: document.getElementById("telefono"),
      error: document.getElementById("error-telefono"),
      validar: v => /^[0-9]{7,}$/.test(v),
      mensaje: "Solo números, al menos 7 dígitos."
    },
    direccion: {
      input: document.getElementById("direccion"),
      error: document.getElementById("error-direccion"),
      validar: v => v.length >= 5 && /\d/.test(v) && /[a-zA-Z]/.test(v) && v.includes(" "),
      mensaje: "Debe tener letras, números y un espacio."
    },
    ciudad: {
      input: document.getElementById("ciudad"),
      error: document.getElementById("error-ciudad"),
      validar: v => v.length >= 3,
      mensaje: "Debe tener al menos 3 caracteres."
    },
    cp: {
      input: document.getElementById("cp"),
      error: document.getElementById("error-cp"),
      validar: v => v.length >= 3,
      mensaje: "Debe tener al menos 3 caracteres."
    },
    dni: {
      input: document.getElementById("dni"),
      error: document.getElementById("error-dni"),
      validar: v => /^[0-9]{7,8}$/.test(v),
      mensaje: "Debe tener 7 u 8 dígitos."
    }
  };

  // eventos blur/focus para validación inline
  Object.values(campos).forEach(({ input, error, validar, mensaje }) => {
    input.addEventListener("blur", () => {
      if (!validar(input.value.trim())) error.textContent = mensaje;
    });
    input.addEventListener("focus", () => {
      error.textContent = "";
    });
  });

  // envío de formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let errores = [];

    Object.entries(campos).forEach(([key, { input, validar, mensaje, error }]) => {
      const v = input.value.trim();
      if (!validar(v)) {
        error.textContent = mensaje;
        errores.push(`${key}: ${mensaje}`);
      }
    });

    if (errores.length) {
      alert("Errores encontrados:\n\n" + errores.join("\n"));
      return;
    }

    const datosFinales = {};
    Object.entries(campos).forEach(([key, { input }]) => {
      datosFinales[key] = input.value.trim();
    });

    // enviamos por GET con query params
    const qs = new URLSearchParams(datosFinales).toString();
    fetch(`https://jsonplaceholder.typicode.com/?${qs}`)
      .then(res => {
        if (!res.ok) throw new Error("Código: " + res.status);
        return res.json();
      })
      .then(() => {
        localStorage.setItem("datosSuscripcion", JSON.stringify(datosFinales));
        mostrarModal("¡Suscripción exitosa!", "Gracias por registrarte", JSON.stringify(datosFinales, null, 2));
      })
      .catch(err => {
        mostrarModal("Error al enviar", "Ocurrió un error", err.message);
      });
  });

  // precarga desde LocalStorage
  const guardados = localStorage.getItem("datosSuscripcion");
  if (guardados) {
    const data = JSON.parse(guardados);
    Object.entries(data).forEach(([k, v]) => {
      if (campos[k]) campos[k].input.value = v;
    });
    tituloForm.textContent = "HOLA " + (data.nombre || "").toUpperCase();
  }

  // modal
  const modal = document.getElementById("modal");
  document.getElementById("modal-cerrar").addEventListener("click", () => {
    modal.classList.add("oculto");
  });
  window.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("oculto");
  });

  function mostrarModal(titulo, mensaje, datos = "") {
    document.getElementById("modal-titulo").textContent = titulo;
    document.getElementById("modal-mensaje").textContent = mensaje;
    document.getElementById("modal-datos").textContent = datos;
    modal.classList.remove("oculto");
  }
});
