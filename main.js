const searchBox = document.querySelector("#search-box");
const pokeList = document.querySelector("#pokemon-list");
const btn = document.querySelector("#search");

window.addEventListener("load", (event) => {
  loadPokemons();
});

btn.addEventListener("click", () => loadPokemon(searchBox.value.trim()));

async function loadPokemon(searchTerm) {
  const URL = `https://pokeapi.co/api/v2/pokemon/${searchTerm}/`;
  const result = await fetch(URL);
  const data = await result.json();
  console.log(data);
  let { name, id, types, weight, base_experience } = data;
  let artWork = data.sprites.other["official-artwork"].front_default;
  const abilitiesList=[];
  for(let i=0; i < data.abilities.length; i++){
    abilitiesList.push(data.abilities[i].ability.name)

  }
  console.log(abilitiesList)
  pokeList.innerHTML = `
            <div class= "poke-container">
            <div class="art-work">
                <img src="${artWork}">
            </div>
            <div class="poke-properties">
                <ul class="details-list">
                <li><span>Name:</span> ${name}</li>
                <li><span>Id:</span> ${id}</li>
                <li><span>Weight:</span> ${weight}</li>
                <li><span>Base experience:</span> ${base_experience}</li>
                <li><span>Abilities:</span> ${abilitiesList}</li>
                </ul> 
                <button class="return-btn" onclick="loadPokemons()">Return</button>
            </div>
            </div>
            
            `;
}

// loadPokemon("clefairy");

async function loadPokemons() {
  const result = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=31&offset=0`
  );

  const pokemons = await result.json();
  console.log(pokemons);
  pokeList.innerHTML = "";
  for (let i = 0; i < pokemons.results.length; i++) {
    const more_results = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemons.results[i].name}/`
    );
    const details = await more_results.json();
    let pokemon = document.createElement("div");
    pokemon.classList.add("pokemon-item");
    pokemon.dataset.id = details.id;
    pokemon.innerHTML = `
            <div class="pokemon-info">
            <div class= "card">
            <div class="poke-thumbnail">
                <img src="${details.sprites.other["official-artwork"].front_default}">
            </div>
                <h3>${pokemons.results[i].name}</h3>
            </div>
            </div>
        `;
    pokeList.append(pokemon);
  }

  loadPokemonDetails();
}

function loadPokemonDetails() {
  const pokes = pokeList.querySelectorAll(".pokemon-item");
  pokes.forEach((pokemonItem) => {
    pokemonItem.addEventListener("click", async () => {
      const URL = `https://pokeapi.co/api/v2/pokemon/${pokemonItem.dataset.id}/`;
      const result = await fetch(URL);
      const data = await result.json();
      console.log(data);
      loadPokemon(`${pokemonItem.dataset.id}`);
    });
  });
}
