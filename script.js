
// Selecting the pokedex div to slide in from the top
const pokedex = document.querySelector("#pokedex");

// GSAP animation for sliding in the div from the top
gsap.fromTo(pokedex, { y: "-100%" }, { y: "0%", duration: 1, ease: "cubicBezier(0.25, 0.1, 0.25, 1)", delay: 0.5 });

// Selecting the pokelist div to fade in elements
const pokelist = document.querySelector("#pokelist");

// GSAP animation for fading in the div's content
gsap.fromTo(pokelist, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "linear", delay: 1.25 });


// Using PokeAPI to populate the #pokelist li elements with img and span tags
document.addEventListener("DOMContentLoaded", async function() {
    // Selecting the pokelist container
    const pokemonList = document.getElementById("pokelist");
    // Selecting the unordered list inside the pokelist container
    const pokemonListUl = pokemonList.querySelector("ul");

    // Loop through each Pokemon from 1 to 151
    for (let i = 1; i <= 151; i++) {
        try {
            // Fetch data for the current Pokemon from the PokeAPI
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const pokemonData = await response.json();

            // Create a list item for the current Pokemon
            const listItem = document.createElement("li");
            // Create an image element for the Pokemon's sprite
            const image = document.createElement("img");
            // Set the source and alt attributes of the image
            image.src = pokemonData.sprites.versions["generation-v"]["black-white"].animated.front_default;
            image.alt = pokemonData.name;
            image.setAttribute("class", "pokemon-gif");

            // Create a span element for the Pokemon's name and ID
            const span = document.createElement("span");
            // Format the Pokemon's ID and name
            span.textContent = `${String(pokemonData.id).padStart(3, '0')} ${pokemonData.name}`;
            span.setAttribute("class", "pokemon-name");

            // Append the image and span to the list item
            listItem.appendChild(image);
            listItem.appendChild(span);

            // Add a click event listener to the list item
            listItem.addEventListener("click", function() {
                // Get the name of the clicked Pokemon
                const pokemonName = this.querySelector("img").getAttribute("alt");
                // Fetch additional info for the clicked Pokemon
                fetchPokemonInfo(pokemonName);
                // Hide the pokelist container
                document.getElementById("pokelist").style.display = "none";
            });

            // Append the list item to the unordered list
            pokemonListUl.appendChild(listItem);
        } catch (error) {
            // Handle errors if fetching data fails
            console.error('Error fetching Pokemon data:', error);
        }
    }
});

// Function that makes API calls to gather Pokemon data
async function fetchPokemonInfo(pokemonName) {
    // Construct the URL for fetching Pokemon info
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    try {
        // Fetch data for the specified Pokemon
        const response = await fetch(url);
        const data = await response.json();
        // Display the fetched Pokemon info
        displayPokemonInfo(data);
        // Show the pokemon-info container
        document.getElementById("pokemon-info").style.display = "block";
    } catch (error) {
        // Handle errors if fetching data fails
        console.error("Error fetching Pokémon data:", error);
    }
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

