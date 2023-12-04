let currentPokemon;
let currentPokemonNumber = 1;
let allPokemon = [];
const batchSize = 50;
const loadPokemonButton = document.getElementById('loadButton');
const bodyClick = document.getElementById('bodyForClick');
const container = document.getElementById('pokedex');
const headerContainer = document.getElementById('header');
const footerContainer = document.getElementById('footer');
const loadingContainer = document.getElementById('loadingScreen');
const dexStyleContainer = document.getElementsByClassName('pokedex-style');
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
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


async function loadPokemon() {
    const currentScrollTop = window.scrollY;
    showLoadingScreen();
    const startPokemonNumber = currentPokemonNumber;
    const endPokemonNumber = currentPokemonNumber + 20;
    for (let i = startPokemonNumber; i < endPokemonNumber; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        allPokemon.push(currentPokemon);
    }
    currentPokemonNumber = endPokemonNumber;
    renderAllPokemon(startPokemonNumber - 1, endPokemonNumber - 1);     // start und end muss -1 gerechnet werden, um von für die nächste Funktion die richtigen Werte zu nutzen.
    window.scrollTo(0, currentScrollTop);
}


function showLoadingScreen() {
    loadPokemonButton.classList.add('d-none');
    container.style.display = 'none';
    headerContainer.style.display = 'none';
    footerContainer.style.display = 'none';
    loadingContainer.style.display = '';
    bodyClick.classList.add('d-flex');
}


function hideLoadingScreen() {
    loadPokemonButton.classList.remove('d-none');
    container.style.display = '';
    headerContainer.style.display = '';
    footerContainer.style.display = '';
    loadingContainer.style.display = 'none';
    bodyClick.classList.remove('d-flex');
}


function renderAllPokemon(start, end) {
    for (let i = start; i < end; i++) {
        const pokemon = allPokemon[i];
        const pokemonDiv = document.createElement('div');       // Erstelle einen Container für jedes Pokemon, solange die for Schleife aktiv ist.
        pokemonDiv.id = pokemon['name'];
        pokemonDiv.setAttribute('name', i);
        pokemonDiv.classList.add('pokedex-style');
        pokemonDiv.setAttribute('onclick', `showEventListener(event, '${pokemon['name']}')`);
        renderPokemon(pokemon, pokemonDiv);     // Aufrufen der Renderfunktion um die Informationen in den Container pokemonDiv zu schreiben.
        container.appendChild(pokemonDiv);      // Füge den pokemonDiv Container dem pokedex Hauptcontainer hinzu
        changeBackgroundColor(pokemon);
    }
    hideLoadingScreen();
}


function renderPokemon(pokemon, container) {
    container.innerHTML += `<h2>${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h2>
        <div class="img-buttons">
        <button id="${pokemon['name']}ButtonLeft" class="d-none left-right-button"> < </button>
        <img class="pokemon-img" src="${pokemon['sprites']['other']['official-artwork']['front_default']}">
        <button id="${pokemon['name']}ButtonRight" class="d-none left-right-button"> > </button>
        </div>
        <p id="${pokemon['name'] + 6}" class="d-none">Height: ${pokemon['height'] / 10} m</p>
        <p id="${pokemon['name'] + 7}" class="d-none">Weight: ${pokemon['weight'] / 10} kg</p>
        `;
    getTypes(pokemon, container);
    getStats(pokemon, container);
}


function getTypes(pokemon, container) {
    let typesHtml = '';
    let types = pokemon['types'];
    for (let j = 0; j < types.length; j++) {
        typesHtml += `<p id="${pokemon['name'] + (j + 8)}" class="d-none">Type: ${types[j]['type']['name'].charAt(0).toUpperCase() + types[j]['type']['name'].slice(1)}</p>`;
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
        htmlContent += `<div id=${pokemon['name'] + (i)} class="d-none stat-bar">
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


function showPokemonCard(pokemon, scrollCard) {
    let pokemonContainer = document.getElementById(pokemon);
    for (let g = 0; g < 9; g++) {
        document.getElementById(pokemon + g).classList.remove("d-none");
        document.getElementById(pokemon + g).setAttribute('onclick', `closeCard('${pokemon}', ${scrollCard})`);
    }
    showPokemonCardStyles(pokemon, pokemonContainer, scrollCard);
    hideAllCards(pokemon);
    getNextPoke(pokemon);
    getPrevPoke(pokemon);
}


function showPokemonCardStyles(pokemon, pokemonContainer, scrollCard) {
    document.getElementById(`${pokemon}ButtonLeft`).classList.remove('d-none');
    document.getElementById(`${pokemon}ButtonRight`).classList.remove('d-none');
    pokemonContainer.removeAttribute('onclick', `showEventListener(event, '${pokemon}')`);
    pokemonContainer.setAttribute('onclick', `closeCard('${pokemon}', ${scrollCard})`);
    bodyClick.setAttribute('onclick', `closeCard('${pokemon}', ${scrollCard})`);
    pokemonContainer.classList.add('show-card');
    loadPokemonButton.classList.add('d-none');
    document.getElementById(pokemon).classList.add('cursor-unset');
}


function getNextPoke(pokemon) {
    const testElement = document.getElementById(pokemon);
    let nextPoke = parseInt(testElement.getAttribute('name'), 10);
    nextPoke++;
    const newPoke = document.querySelector(`[name="${nextPoke}"]`);
    const newPokeId = newPoke ? newPoke.id : null;
    document.getElementById(`${pokemon}ButtonRight`).setAttribute('onclick', `showEventListener(event, '${newPokeId}')`);
}


function getPrevPoke(pokemon) {
    const testElement = document.getElementById(pokemon);
    let nextPoke = parseInt(testElement.getAttribute('name'), 10);
    nextPoke--;
    const newPoke = document.querySelector(`[name="${nextPoke}"]`);
    const newPokeId = newPoke ? newPoke.id : null;
    document.getElementById(`${pokemon}ButtonLeft`).setAttribute('onclick', `showEventListener(event, '${newPokeId}')`);
}


function closeCard(pokemon, scrollCard) {
    let pokemonContainer = document.getElementById(pokemon);
    for (let g = 0; g < 9; g++) {
        document.getElementById(pokemon + g).classList.add("d-none");
        pokemonContainer.removeAttribute('onclick', `closeCard('${pokemon}')`);
    }
    closeCardStyles(pokemon, pokemonContainer);
    showAllCards();
    window.scrollTo(0, scrollCard);
    event.stopPropagation();
}


function closeCardStyles(pokemon, pokemonContainer) {
    document.getElementById(`${pokemon}ButtonLeft`).classList.add('d-none');
    document.getElementById(`${pokemon}ButtonRight`).classList.add('d-none');
    pokemonContainer.setAttribute('onclick', `showEventListener(event, '${pokemon}')`);
    bodyClick.removeAttribute('onclick', `closeCard('${pokemon}')`);
    pokemonContainer.classList.remove('show-card');
    loadPokemonButton.classList.remove('d-none');
    document.getElementById(pokemon).classList.remove('cursor-unset');
    
}


function showEventListener(event, pokemon) {
    showAllCards();
    let scrollCard = window.scrollY;
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    showPokemonCard(pokemon, scrollCard);
}


function hideAllCards(pokemon) {
    for (let i = 0; i < dexStyleContainer.length; i++) {
        if (dexStyleContainer[i].id !== pokemon) {
            dexStyleContainer[i].style.display = 'none';
        }
    }
    container.style.height = '100vh';
    container.style.alignItems = 'center';
    headerContainer.classList.add('d-none');
    footerContainer.classList.add('d-none');
}


function showAllCards() {
    for (let i = 0; i < dexStyleContainer.length; i++) {
        dexStyleContainer[i].style.display = '';
    }
    container.style.height = '';
    container.style.alignItems = '';
    headerContainer.classList.remove('d-none');
    footerContainer.classList.remove('d-none');
}


// function getPokemonNameByClassNumber(pokemon) {                // Hier muss bei einem Klick die Nummer aus dem Namen übergeben werden und die id abgerufen werden.
//     let pokemonName = document.getElementById(pokemon);
//     console.log(pokemonName);
// }