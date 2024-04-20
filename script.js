
document.addEventListener("DOMContentLoaded", function() {
    let pokemonList = document.querySelectorAll("#pokelist li");

    pokemonList.forEach(function(pokemon) {
        pokemon.addEventListener("click", function() {
            let pokemonName = this.querySelector("img").getAttribute("alt");
            fetchPokemonInfo(pokemonName);
            document.getElementById("pokelist").style.display = "none";
        });
    });

    // Back button functionality
    document.getElementById("back-button").addEventListener("click", function() {
        document.getElementById("pokemon-info").style.display = "none";
        document.getElementById("pokelist").style.display = "block";
    });
});

function fetchPokemonInfo(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayPokemonInfo(data);
            document.getElementById("pokemon-info").style.display = "block";
        })
        .catch(error => {
            console.log("Error fetching Pokémon data:", error);
        });
}

function displayPokemonInfo(pokemonData) {
    let pokemonInfoDiv = document.getElementById("pokemon-info");

    // Clear previous info
    pokemonInfoDiv.innerHTML = "";

    // Create elements to display Pokémon info
    let nameElement = document.createElement("h2");
    nameElement.textContent = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);

    let imageElement = document.createElement("img");
    imageElement.src = pokemonData.sprites.other.showdown.front_default;
    imageElement.alt = pokemonData.name;

    let types = pokemonData.types.map(type => type.type.name);
    let typesElement = document.createElement("p");
    typesElement.textContent = "Types: " + types.join(", ");

    pokemonInfoDiv.appendChild(nameElement);
    pokemonInfoDiv.appendChild(imageElement);
    pokemonInfoDiv.appendChild(typesElement);
}

