const resultadoZona = document.getElementById("zona-resultado");
const botonTodo = document.getElementById("btn-todo");
const botonBuscar = document.getElementById("btn-busqueda");
const formulario = document.getElementById("form-filtro");

// Mostrar todos los personajes
botonTodo.addEventListener("click", () => {
  resultadoZona.innerHTML = "Cargando...";
  fetch("https://rickandmortyapi.com/api/character")
    .then((resp) => {
      if (!resp.ok) throw new Error("Error al obtener personajes");
      return resp.json();
    })
    .then((info) => renderCards(info.results))
    .catch((err) => renderError(err.message));
});

// Hacer foco en el primer campo al tocar "Buscar"
botonBuscar.addEventListener("click", () => {
  document.getElementById("filtro-nombre").focus();
});

// Filtrar personajes
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const params = new URLSearchParams();
  [
    ["name", "filtro-nombre"],
    ["status", "filtro-estado"],
    ["species", "filtro-especie"],
    ["type", "filtro-tipo"],
    ["gender", "filtro-genero"]
  ].forEach(([api, id]) => {
    const valor = document.getElementById(id).value.trim();
    if (valor) params.append(api, valor);
  });
  resultadoZona.innerHTML = "Buscando...";
  fetch(`https://rickandmortyapi.com/api/character/?${params.toString()}`)
    .then((r) => {
      if (!r.ok) throw new Error("No se encontraron personajes con esos filtros");
      return r.json();
    })
    .then((data) => renderCards(data.results))
    .catch((err) => renderError(err.message));
});

function renderCards(lista) {
  resultadoZona.innerHTML = "";
  lista.forEach((p) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}"><br>
      <strong>${p.name}</strong><br>
      Estado: ${p.status} | Especie: ${p.species} | Género: ${p.gender}
    `;
    resultadoZona.appendChild(div);
  });
}
function renderError(msj) {
  resultadoZona.innerHTML = `<div class="error">${msj}</div>`;
}
