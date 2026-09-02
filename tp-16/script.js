// ==========================================================
// Trabajo Práctico N° 16 - PokéDex
// ==========================================================

let offset = 0;
let limite = 151;

// Función para pedir los Pokémon a la PokéAPI
function cargarPokemon() {
  // Mostramos el spinner de carga (Power Up)
  document.getElementById('spinner').style.display = 'block';

  // Hacemos el pedido a la API con fetch y .then()
  fetch('https://pokeapi.co/api/v2/pokemon?limit=' + limite + '&offset=' + offset)
    .then(function(respuesta) {
      return respuesta.json();
    })
    .then(function(datos) {
      // Ocultamos el spinner cuando llegan los datos
      document.getElementById('spinner').style.display = 'none';

      let contenedor = document.getElementById('lista-pokemon');

      // Recorremos la lista para crear las columnas en orden
      for (let i = 0; i < datos.results.length; i++) {
        let numero = offset + i + 1;

        // Creamos la columna responsiva con Bootstrap (Power Up)
        let columna = document.createElement('div');
        columna.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
        columna.id = 'pokemon-' + numero;
        contenedor.appendChild(columna);

        // Pedimos los datos individuales de cada Pokémon para obtener su imagen y tipos
        fetch('https://pokeapi.co/api/v2/pokemon/' + numero)
          .then(function(res) {
            return res.json();
          })
          .then(function(info) {
            llenarTarjeta(info);
          });
      }

      // Mostramos el botón para cargar más Pokémon (Power Up)
      document.getElementById('btn-cargar-mas').style.display = 'inline-block';

      // Actualizamos el offset para la siguiente carga
      offset = offset + datos.results.length;
    });
}

// Función para llenar la tarjeta con nombre, imagen, tipos y botón (Power Up)
function llenarTarjeta(pokemon) {
  let columna = document.getElementById('pokemon-' + pokemon.id);
  if (!columna) {
    return;
  }

  // Obtenemos la imagen oficial
  let imagenUrl = pokemon.sprites.other['official-artwork'].front_default;
  if (!imagenUrl) {
    imagenUrl = pokemon.sprites.front_default;
  }

  // Obtenemos los tipos del Pokémon con un bucle for
  let tiposHtml = '';
  for (let i = 0; i < pokemon.types.length; i++) {
    let nombreTipo = pokemon.types[i].type.name;
    tiposHtml += '<span class="badge-tipo tipo-' + nombreTipo + '">' + nombreTipo + '</span>';
  }

  // Armamos la tarjeta con Nombre, Imagen, Tipos y Botón
  columna.innerHTML = `
    <div class="card h-100 shadow-sm text-center p-3 pokemon-card">
      <img src="${imagenUrl}" class="card-img-top" alt="${pokemon.name}">
      <div class="card-body d-flex flex-column justify-content-between p-0 mt-2">
        <h5 class="card-title">#${pokemon.id} ${pokemon.name}</h5>
        <div class="my-2">
          ${tiposHtml}
        </div>
        <button class="btn btn-danger btn-sm mt-2" onclick="verDetalle(${pokemon.id})">
          Ver información
        </button>
      </div>
    </div>
  `;
}

// Función para ver la información adicional en el Modal al presionar el botón
function verDetalle(id) {
  // Pedimos la información completa del Pokémon a la API
  fetch('https://pokeapi.co/api/v2/pokemon/' + id)
    .then(function(respuesta) {
      return respuesta.json();
    })
    .then(function(pokemon) {
      // 1. Nombre y Foto
      document.getElementById('modal-nombre').innerText = '#' + pokemon.id + ' ' + pokemon.name.toUpperCase();
      
      let foto = pokemon.sprites.other['official-artwork'].front_default;
      if (!foto) {
        foto = pokemon.sprites.front_default;
      }
      document.getElementById('modal-foto').src = foto;

      // 2. Altura y Peso (la API los da en decímetros y hectogramos)
      document.getElementById('modal-altura').innerText = (pokemon.height / 10) + ' m';
      document.getElementById('modal-peso').innerText = (pokemon.weight / 10) + ' kg';

      // 3. Tipos (con bucle for)
      let tiposHtml = '';
      for (let i = 0; i < pokemon.types.length; i++) {
        let nombreTipo = pokemon.types[i].type.name;
        tiposHtml += '<span class="badge-tipo tipo-' + nombreTipo + '">' + nombreTipo + '</span>';
      }
      document.getElementById('modal-tipos').innerHTML = tiposHtml;

      // 4. Habilidades (Al menos una habilidad)
      let habilidadesHtml = '';
      for (let i = 0; i < pokemon.abilities.length; i++) {
        habilidadesHtml += '<li class="text-capitalize">' + pokemon.abilities[i].ability.name + '</li>';
      }
      document.getElementById('modal-habilidades').innerHTML = habilidadesHtml;

      // 5. Movimientos (Al menos cuatro movimientos)
      let movimientosHtml = '';
      let cantidad = pokemon.moves.length;
      if (cantidad > 6) {
        cantidad = 6;
      }
      for (let i = 0; i < cantidad; i++) {
        movimientosHtml += '<span class="badge bg-secondary me-1 mb-1">' + pokemon.moves[i].move.name + '</span>';
      }
      document.getElementById('modal-movimientos').innerHTML = movimientosHtml;

      // Mostramos el modal de Bootstrap
      let modal = new bootstrap.Modal(document.getElementById('modal-pokemon'));
      modal.show();
    });
}

// Función para el botón "Cargar más Pokémon" (Power Up)
function cargarMas() {
  limite = 20;
  cargarPokemon();
}

// Evento al cargar la página
window.onload = function() {
  cargarPokemon();
  document.getElementById('btn-cargar-mas').addEventListener('click', cargarMas);
};
