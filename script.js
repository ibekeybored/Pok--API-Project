

// Anime.js animation for sliding in the pokedex img
document.addEventListener("DOMContentLoaded", function() {
    anime({
        targets: '#pokedex',
        translateY: ['-100%', 0], // Slide in from the top
        duration: 1000, // Animation duration in milliseconds
        easing: 'easeInOutQuad', // Easing function
        delay: 250 // Delay before starting the animation
    });
});

// Anime.js animation for fading in the pokedex screen
document.addEventListener("DOMContentLoaded", function() {
    anime({
        targets: '#pokelist', // Targets the pokedex_screen div
        opacity: [0, 1], // Animate opacity from 0 to 1
        easing: 'linear', // Easing function
        duration: 500, // Animation duration in milliseconds
        delay: 1250
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let pokemonList = document.getElementById("pokelist");
    let pokemonListUl = pokemonList.querySelector("ul");

    // Array to store promises for fetch requests
    let fetchPromises = [];

    for (let i = 1; i <= 151; i++) {
        // Push each fetch promise to the array
        fetchPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
            .then(response => response.json())
            .then(pokemonData => {
                // Create list item
                let listItem = document.createElement("li");

                // Create image element
                let image = document.createElement("img");
                image.src = pokemonData.sprites["versions"]["generation-v"]["black-white"]["animated"]["front_default"];
                image.alt = pokemonData.name; // Set alt attribute to the pokemon's name
                image.setAttribute("class", "pokemon-gif");

                // Create span element
                let span = document.createElement("span");
                span.textContent = `${String(pokemonData.id).padStart(3, '0')} ${pokemonData.name}`;
                span.setAttribute("class", "pokemon-name");

                // Append image to list item
                listItem.appendChild(image);

                // Append span to list item
                listItem.appendChild(span);

                // Add click event listener to each Pokemon list item
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

            // Append sorted list items to the ul element
            listItems.forEach(listItem => pokemonListUl.appendChild(listItem));

        })

        .catch(error => console.error('Error fetching Pokémon data:', error));
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
    weightElement.textContent = `Weight: ${(pokemonData.weight * 0.220462).toFixed(2)} lbs`;

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

