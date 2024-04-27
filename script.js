
// Selecting the pokedex div to slide in from the top
const pokedex = document.querySelector("#pokedex");

// GSAP animation for sliding in the div from the top
gsap.fromTo(pokedex, { y: "-100%" }, { y: "0%", duration: 1, ease: "cubicBezier(0.25, 0.1, 0.25, 1)", delay: 0.5 });

// Selecting the pokelist div to fade in elements
const pokelist = document.querySelector("#pokelist");

// GSAP animation for fading in the div's content
gsap.fromTo(pokelist, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "linear", delay: 1.25 });


// Using PokeAPI to populate the #pokelist li elements with img and span tags
document.addEventListener("DOMContentLoaded", function() {
    let pokemonList = document.getElementById("pokelist");
    let pokemonListUl = pokemonList.querySelector("ul");

    // Array to store promises for fetch requests, we will use this to ensure the Pokemon are populated in correct Pokedex order
    let fetchPromises = [];

    for (let i = 1; i <= 151; i++) {
        // Push each fetch promise to the array
        fetchPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
            .then(response => response.json())
            .then(pokemonData => {
                // Create list item
                let listItem = document.createElement("li");

                // Create image element for small pokemon gif
                let image = document.createElement("img");
                image.src = pokemonData.sprites["versions"]["generation-v"]["black-white"]["animated"]["front_default"];
                image.alt = pokemonData.name;
                image.setAttribute("class", "pokemon-gif");

                // Create span element for #pokelist Pokemon name and Pokedex number
                let span = document.createElement("span");
                span.textContent = `${String(pokemonData.id).padStart(3, '0')} ${pokemonData.name}`;
                span.setAttribute("class", "pokemon-name");

                // Append image to list item
                listItem.appendChild(image);

                // Append span to list item
                listItem.appendChild(span);

                // Add click event listener to each Pokemon list item to hide pokelist when Pokemon name clicked and reveal #pokemon-info div
                listItem.addEventListener("click", function() {
                    let pokemonName = this.querySelector("img").getAttribute("alt");
                    fetchPokemonInfo(pokemonName);
                    document.getElementById("pokelist").style.display = "none";
                });

                // Return the list item
                return listItem;
            })
            .catch(error => console.error('Error fetching Pokemon data:', error))
        );
    }

    // Wait for all fetch requests to complete
    Promise.all(fetchPromises)
        .then(listItems => {
            // Sort list items based on their Pokedex number
            listItems.sort(function(a, b){return parseInt(a.textContent.split(' ')[0]) - parseInt(b.textContent.split(' ')[0])});

            // Append sorted list items to the #pokelist ul element
            listItems.forEach(listItem => pokemonListUl.appendChild(listItem));

        })

        .catch(error => console.error('Error fetching Pokémon data:', error));
});


// Function that makes API calls to gather Pokemon data
function fetchPokemonInfo(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Call Function to display data gathered in pokemon-info div
            displayPokemonInfo(data);
            document.getElementById("pokemon-info").style.display = "block";
        })
        .catch(error => {
            console.log("Error fetching Pokémon data:", error);
        });
}

// Function to create elements for pokemon-info div
function displayPokemonInfo(pokemonData) {
    let pokemonInfoDiv = document.getElementById("pokemon-info");

    // Clear previous info
    pokemonInfoDiv.innerHTML = "";

    // Create h2 elements to display Pokémon name
    let nameElement = document.createElement("h2");
    nameElement.textContent = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);

    // Element that contains Pokemon cry audio
    let pokemonCry = new Audio(pokemonData.cries.latest);

    // Button to play Pokemon cry audio
    let cryButton = document.createElement("button");
    cryButton.setAttribute("id", "pokemon-cry")

    // Create an <i> element for the audio icon
    let audioIcon = document.createElement("i");
    audioIcon.classList.add("fa-solid", "fa-volume-high");
    cryButton.appendChild(audioIcon);
    cryButton.addEventListener("click", function() {
        pokemonCry.play();
    });

    // Create an img element for the large Pokemon gif
    let imageElement = document.createElement("img");
    imageElement.src = pokemonData.sprites.other.showdown.front_default;
    imageElement.alt = pokemonData.name;

    // Pokemon type info
    let types = pokemonData.types.map(type => type.type.name);
    let typesElement = document.createElement("p");
    typesElement.setAttribute("id", "pokeTypes");
    typesElement.textContent = "Types: " + types.join(", ");

    // Pokemon weight info converted to lbs in a p tag
    let weightElement = document.createElement("p");
    weightElement.setAttribute("id", "weight")
    weightElement.textContent = `Weight: ${(pokemonData.weight * 0.220462).toFixed(2)} lbs`;

    // Pokemon height info converted to feet and inches in a p tag
    let heightElement = document.createElement("p");
    heightElement.setAttribute("id", "height");
    heightElement.textContent = `Height: ${Math.floor(pokemonData.height * 0.328084)}ft ${Math.round(((pokemonData.height * 0.328084) - Math.floor(pokemonData.height * 0.328084)) * 12)}in`;

    // Back button used to go back to pokelist from pokemon-info
    let backButton = document.createElement("button");
    backButton.setAttribute("id", "backButton");
    backButton.textContent = "Back";

    // Back button functionality
    backButton.addEventListener("click", function() {
        document.getElementById("pokemon-info").style.display = "none";
        document.getElementById("pokelist").style.display = "block";
    });

    // Add all elements to the pokemon-info div
    pokemonInfoDiv.appendChild(nameElement);
    pokemonInfoDiv.appendChild(imageElement);
    pokemonInfoDiv.appendChild(typesElement);
    pokemonInfoDiv.appendChild(cryButton);
    pokemonInfoDiv.appendChild(weightElement);
    pokemonInfoDiv.appendChild(heightElement);
    pokemonInfoDiv.appendChild(backButton);
}

