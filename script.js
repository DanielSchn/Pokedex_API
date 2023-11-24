let currentPokemon;
let currentPokemonNumber = 1;
let allPokemon = [];

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


// async function loadPokemon() {
//     let randomNumber = Math.floor(Math.random() * 300) + 1;
//     let url = `https://pokeapi.co/api/v2/pokemon/${randomNumber}`; // Can use Number or Name. 4 is charmander
//     let response = await fetch(url);
//     currentPokemon = await response.json();
//     console.log('Current Pokemon is: ', currentPokemon);
//     renderPokemon();
// }


async function loadPokemon() {
    if (currentPokemonNumber <= 15) {
        let url = `https://pokeapi.co/api/v2/pokemon/${currentPokemonNumber}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        allPokemon.push(currentPokemon);
        currentPokemonNumber++;
        loadPokemon();
    } else {
        console.log("All Pokemon loaded!");
        renderAllPokemon();
    } 
}


function renderAllPokemon() {
    const container = document.getElementById('pokedex');
    allPokemon.forEach((pokemon) => {
        // Erstelle einen Container für jedes Pokemon
        const pokemonDiv = document.createElement('div');
        pokemonDiv.id = pokemon['name'];
        pokemonDiv.classList.add('pokedexStyle');
        pokemonDiv.setAttribute('onclick', `showEventListener(event, '${pokemon['name']}')`);
        // Setze die Informationen in den Container
        renderPokemon(pokemon, pokemonDiv);
        // Füge den Container dem Hauptcontainer hinzu
        container.appendChild(pokemonDiv);
        changeBackgroundColor(pokemon);
    });
}


function renderPokemon(pokemon, container) {
    container.innerHTML += `<h2>${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h2>
        <img src="${pokemon['sprites']['other']['dream_world']['front_default']}">
        <p id="${pokemon['name']+6}" class="dNone">Height: ${pokemon['height'] / 10} m</p>
        <p id="${pokemon['name']+7}" class="dNone">Weight: ${pokemon['weight'] / 10} kg</p>`;
    getTypes(pokemon, container);
    getStats(pokemon, container);
}



function getTypes(pokemon, container) {
    let typesHtml = '';
    let types = pokemon['types'];
    for (let j = 0; j < types.length; j++) {
        typesHtml += `<p id="${pokemon['name']+(j+8)}" class="dNone">Type: ${types[j]['type']['name'].charAt(0).toUpperCase() + types[j]['type']['name'].slice(1)}</p>`;
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
        htmlContent += `<div id=${pokemon['name']+(i)} class="dNone stat-bar">
            <div class="filled-bar" style="width: ${filledBarWidth};"></div>
            <div class="stat-text">${statName}: ${baseStat}</div>
        </div>`;
    }
    container.innerHTML += htmlContent;
}


function changeBackgroundColor(pokemon) {
    const typeForColor = pokemon['types'][0]['type']['name'];
    defineColor(typeForColor, pokemon['name']);
}


function defineColor(typeForColor, pokemon) {
    const color = getColorForType(typeForColor);
    document.getElementById(pokemon).style.backgroundColor = color;
    console.log(typeForColor, pokemon);
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
        document.getElementById(pokemon+g).classList.remove("dNone");
        document.getElementById(pokemon+g).setAttribute('onclick', `closeCard('${pokemon}')`);   
    }
    document.getElementById(pokemon).removeAttribute('onclick', `showEventListener(event, '${pokemon}')`);
    document.getElementById(pokemon).setAttribute('onclick', `closeCard('${pokemon}')`);
    document.getElementById('bodyForClick').setAttribute('onclick', `closeCard('${pokemon}')`);
    document.getElementById(pokemon).classList.add('showCard');
}



function closeCard(pokemon) {
    for (let g = 0; g < 9; g++) {
        document.getElementById(pokemon+g).classList.add("dNone");
        document.getElementById(pokemon).removeAttribute('onclick', `closeCard('${pokemon}')`);    
    }
    document.getElementById(pokemon).setAttribute('onclick', `showEventListener(event, '${pokemon}')`);
    document.getElementById('bodyForClick').removeAttribute('onclick', `closeCard('${pokemon}')`);
    document.getElementById(pokemon).classList.remove('showCard');
    event.stopPropagation();
}


function showEventListener(event, pokemon) {
    console.log(pokemon);
    if (event.stopPropagation) {
        event.stopPropagation();
    } 
    showPokemonCard(pokemon);
}