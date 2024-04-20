
document.addEventListener("DOMContentLoaded", function() {
    let pokemonList = document.querySelectorAll("#pokelist li");

    pokemonList.forEach(function(pokemon) {
        pokemon.addEventListener("click", function() {
            let pokemonName = this.querySelector("img").getAttribute("alt");
            fetchPokemonInfo(pokemonName);
            document.getElementById("pokelist").style.display = "none";
        });
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

    // Element that contains Pokemon cry audio
    let pokemonCry = new Audio(pokemonData.cries.latest);

    // Button to play cry audio
    let cryButton = document.createElement("button");
    cryButton.setAttribute("id", "pokemon-cry")

    // Create an <i> element for the audio icon
    let audioIcon = document.createElement("i");
    audioIcon.classList.add("fa-solid", "fa-volume-high");
    cryButton.appendChild(audioIcon);
    cryButton.addEventListener("click", function() {
        pokemonCry.play();
    });

    let imageElement = document.createElement("img");
    imageElement.src = pokemonData.sprites.other.showdown.front_default;
    imageElement.alt = pokemonData.name;

    let types = pokemonData.types.map(type => type.type.name);
    let typesElement = document.createElement("p");
    typesElement.setAttribute("id", "pokeTypes");
    typesElement.textContent = "Types: " + types.join(", ");

    let weightElement = document.createElement("p");
    weightElement.setAttribute("id", "weight")
    weightElement.textContent = `Weight: ${(pokemonData.weight * 0.0220462).toFixed(2)} lbs`;

    let heightElement = document.createElement("p");
    heightElement.setAttribute("id", "height");
    heightElement.textContent = `Height: ${Math.floor(pokemonData.height * 0.328084)}ft ${Math.round(((pokemonData.height * 0.328084) - Math.floor(pokemonData.height * 0.328084)) * 12)}in`;


    let backButton = document.createElement("button");
    backButton.setAttribute("id", "backButton");
    backButton.textContent = "Back";

    // Back button functionality
    backButton.addEventListener("click", function() {
        document.getElementById("pokemon-info").style.display = "none";
        document.getElementById("pokelist").style.display = "block";
    });

    pokemonInfoDiv.appendChild(nameElement);
    pokemonInfoDiv.appendChild(imageElement);
    pokemonInfoDiv.appendChild(typesElement);
    pokemonInfoDiv.appendChild(cryButton);
    pokemonInfoDiv.appendChild(weightElement);
    pokemonInfoDiv.appendChild(heightElement);
    pokemonInfoDiv.appendChild(backButton);
}

