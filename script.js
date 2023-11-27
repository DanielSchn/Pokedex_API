let currentPokemon;
let currentPokemonNumber = 1;
let allPokemon = [];
const batchSize = 50;

const typeColors = {
    "normal": "#A8A89A",
    "fighting": "#A64C3D",
    "flying": "#89B6E4",
    "poison": "#854EB6",
    "ground": "#946736",
    "rock": "#A7985E",
    "bug": "#84AC32",
    "ghost": "#623D63",
    "steel": "#9999A8",
    "fire": "#E23B19",
    "water": "#308DCA",
    "grass": "#5BA856",
    "electric": "#E4C425",
    "psychic": "#E25A72",
    "ice": "#6CBAAD",
    "dragon": "#4F66A9",
    "dark": "#463E3E",
    "fairy": "#D282CD"
};


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');   // Abrufen der Daten mit dem Attribut w3-include-html und speichern in einem Array
    for (let i = 0; i < includeElements.length; i++) {                      // For Schleife zum abarbeiten aller Elemente mit dem Attribut w3-include-html
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");                     // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


// async function loadPokemon() {
//     await includeHTML();
//     showLoadingScreen();
//     if (currentPokemonNumber <= 10) {
//         let url = `https://pokeapi.co/api/v2/pokemon/${currentPokemonNumber}`;
//         let response = await fetch(url);
//          currentPokemon = await response.json(); 
//         allPokemon.push(currentPokemon);
//         currentPokemonNumber++;
//         loadPokemon();
//     } else {
//         renderAllPokemon();
//         hideLoadingScreen();
//     } 
// }


async function loadPokemon() {
    showLoadingScreen();
    await includeHTML();
    const startPokemonNumber = currentPokemonNumber;
    const endPokemonNumber = currentPokemonNumber + 50;
    for (let i = startPokemonNumber; i < endPokemonNumber; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        allPokemon.push(currentPokemon);
    }
    currentPokemonNumber = endPokemonNumber;
    renderAllPokemon(startPokemonNumber-1, endPokemonNumber);
    hideLoadingScreen();
}



function showLoadingScreen() {
    document.getElementById('loadButton').style.display = 'none';
    document.getElementById('pokedex').style.display = 'none';
    document.getElementById('header').style.display = 'none';
    document.getElementById('footer').style.display = 'none';
    document.getElementById('loadingScreen').style.display = '';
    document.getElementById('bodyForClick').classList.add('d-flex');
}


function hideLoadingScreen(){
    document.getElementById('loadButton').style.display = '';
    document.getElementById('pokedex').style.display = '';
    document.getElementById('header').style.display = '';
    document.getElementById('footer').style.display = '';
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('bodyForClick').classList.remove('d-flex');
}


// function renderAllPokemon() {
//     const container = document.getElementById('pokedex');
//     allPokemon.forEach((pokemon) => {
//         // Erstelle einen Container für jedes Pokemon
//         const pokemonDiv = document.createElement('div');
//         pokemonDiv.id = pokemon['name'];
//         pokemonDiv.classList.add('pokedex-style');
//         pokemonDiv.setAttribute('onclick', `showEventListener(event, '${pokemon['name']}')`);
//         // Setze die Informationen in den Container
//         renderPokemon(pokemon, pokemonDiv);
//         // Füge den Container dem Hauptcontainer hinzu
//         container.appendChild(pokemonDiv);
//         changeBackgroundColor(pokemon);
//     });
// }

function renderAllPokemon(start, end) {
    const container = document.getElementById('pokedex');
    for (let i = start; i < end - 1; i++) {
        const pokemon = allPokemon[i];
        // Erstelle einen Container für jedes Pokemon
        const pokemonDiv = document.createElement('div');
        console.log(pokemon);
        pokemonDiv.id = pokemon['name'];
        pokemonDiv.classList.add('pokedex-style');
        pokemonDiv.setAttribute('onclick', `showEventListener(event, '${pokemon['name']}')`);
        // Setze die Informationen in den Container
        renderPokemon(pokemon, pokemonDiv);
        // Füge den Container dem Hauptcontainer hinzu
        container.appendChild(pokemonDiv);
        changeBackgroundColor(pokemon);
    }
}



function renderPokemon(pokemon, container) {
    container.innerHTML += `<h2>${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h2>
        <img class="pokemon-img" src="${pokemon['sprites']['other']['official-artwork']['front_default']}">
        <p id="${pokemon['name']+6}" class="d-none">Height: ${pokemon['height'] / 10} m</p>
        <p id="${pokemon['name']+7}" class="d-none">Weight: ${pokemon['weight'] / 10} kg</p>`;
    getTypes(pokemon, container);
    getStats(pokemon, container);
}



function getTypes(pokemon, container) {
    let typesHtml = '';
    let types = pokemon['types'];
    for (let j = 0; j < types.length; j++) {
        typesHtml += `<p id="${pokemon['name']+(j+8)}" class="d-none">Type: ${types[j]['type']['name'].charAt(0).toUpperCase() + types[j]['type']['name'].slice(1)}</p>`;
    }
    container.innerHTML += typesHtml;
}


function getStats(pokemon, container) {
    let stats = pokemon['stats'];
    let htmlContent = '';
    for (let i = 0; i < stats.length; i++) {
        const statName = stats[i]['stat']['name'];
        const baseStat = stats[i]['base_stat'];
        const filledBarWidth = baseStat + 'px';
        htmlContent += `<div id=${pokemon['name']+(i)} class="d-none stat-bar">
            <div class="filled-bar" style="width: ${filledBarWidth};"></div>
            <div class="stat-text">${statName}: ${baseStat}</div>
        </div>`;
    }
    container.innerHTML += `<div class="stat-bar-div">${htmlContent}</div>`;
}


function changeBackgroundColor(pokemon) {
    const typeForColor = pokemon['types'][0]['type']['name'];
    defineColor(typeForColor, pokemon['name']);
}


function defineColor(typeForColor, pokemon) {
    const color = getColorForType(typeForColor);
    document.getElementById(pokemon).style.backgroundColor = color;
}


function getColorForType(type) {
    if (typeColors[type] !== undefined) {
        return typeColors[type];
    } else {
        return "unknownColor";
    }
}


function showPokemonCard(pokemon) {
    for (let g = 0; g < 9; g++) {
        document.getElementById(pokemon+g).classList.remove("d-none");
        document.getElementById(pokemon+g).setAttribute('onclick', `closeCard('${pokemon}')`);   
    }
    document.getElementById(pokemon).removeAttribute('onclick', `showEventListener(event, '${pokemon}')`);
    document.getElementById(pokemon).setAttribute('onclick', `closeCard('${pokemon}')`);
    document.getElementById('bodyForClick').setAttribute('onclick', `closeCard('${pokemon}')`);
    document.getElementById(pokemon).classList.add('show-card');
    hideAllCards(pokemon);
}



function closeCard(pokemon) {
    for (let g = 0; g < 9; g++) {
        document.getElementById(pokemon+g).classList.add("d-none");
        document.getElementById(pokemon).removeAttribute('onclick', `closeCard('${pokemon}')`);    
    }
    document.getElementById(pokemon).setAttribute('onclick', `showEventListener(event, '${pokemon}')`);
    document.getElementById('bodyForClick').removeAttribute('onclick', `closeCard('${pokemon}')`);
    document.getElementById(pokemon).classList.remove('show-card');
    showAllCards();
    event.stopPropagation();
}


function showEventListener(event, pokemon) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } 
    showPokemonCard(pokemon);
}

function hideAllCards(pokemon) {
    let elements = document.getElementsByClassName('pokedex-style');
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].id !== pokemon) {
            elements[i].style.display = 'none';
        } 
    }
    document.getElementById('pokedex').style.height = '100vh';
    document.getElementById('pokedex').style.alignItems = 'center';
}


function showAllCards() {
    let elements = document.getElementsByClassName('pokedex-style');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = '';
    }
    document.getElementById('pokedex').style.height = '';
    document.getElementById('pokedex').style.alignItems = '';
}