const resultado = document.getElementById("zona-resultado");
const btnTodos = document.getElementById("btn-todo");
const form = document.getElementById("form-filtro");

function mostrarPersonajes(personajes) {
  resultado.innerHTML = "";
  personajes.forEach((personaje) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${personaje.image}" alt="${personaje.name}" width="100" style="border-radius:8px;"><br>
      <strong>${personaje.name}</strong><br>
      Estado: ${personaje.status} | Especie: ${personaje.species} | Género: ${personaje.gender}
    `;
    resultado.appendChild(div);
  });
}

function mostrarError(mensaje) {
  resultado.innerHTML = `<p>${mensaje}</p>`;
}

btnTodos.addEventListener("click", () => {
  fetch("https://rickandmortyapi.com/api/character")
    .then((res) => {
      if (!res.ok) throw new Error("Error al obtener personajes");
      return res.json();
    })
    .then((data) => mostrarPersonajes(data.results))
    .catch((err) => mostrarError(err.message));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const params = new URLSearchParams();
  [
    ["name", "filtro-nombre"],
    ["status", "filtro-estado"],
    ["species", "filtro-especie"],
    ["type", "filtro-tipo"],
    ["gender", "filtro-genero"]
  ].forEach(([campo, id]) => {
    const valor = document.getElementById(id).value.trim();
    if (valor) params.append(campo, valor);
  });

  fetch(`https://rickandmortyapi.com/api/character/?${params.toString()}`)
    .then((res) => {
      if (!res.ok) throw new Error("No se encontraron personajes con esos filtros");
      return res.json();
    })
    .then((data) => mostrarPersonajes(data.results))
    .catch((err) => mostrarError(err.message));
});
