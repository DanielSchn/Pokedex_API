let currentPokemon;

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


async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/166'; // Can use Number or Name. 4 is charmander
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log('Current Pokemon is: ', currentPokemon);
    renderPokemon();
}



function renderPokemon() {
    document.getElementById('pokemonName').innerHTML = `${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}`;
    document.getElementById('pokemonImage').src = currentPokemon['sprites']['other']['official-artwork']['front_shiny'];
    getTypes();
    document.getElementById('pokemonHeight').innerHTML = `Height: ${currentPokemon['height'] / 10} m`;
    document.getElementById('pokemonWeigth').innerHTML = `Weight: ${currentPokemon['weight'] / 10} kg`;
    getStats();
}


// function getStats() {
//     let stats = currentPokemon['stats'];
//     for (let i = 0; i < stats.length; i++) {
//         document.getElementById('stats').innerHTML += `<br>${stats[i]['stat']['name']}: ${stats[i]['base_stat']}`;

//     }
// }


function getTypes() {
    let typesHtml = '';
    let types = currentPokemon['types'];
    for (let j = 0; j < types.length; j++) {
        typesHtml += `Type ${j+1}: ${types[j]['type']['name'].charAt(0).toUpperCase() + types[j]['type']['name'].slice(1)}<br>`;    
    }
    document.getElementById('type').innerHTML = typesHtml;
    const typeForColor = types['0']['type']['name'];
    changeBackgroundColor(typeForColor);
    console.log(typeForColor);
}


function getStats() {
    let stats = currentPokemon['stats'];
    let htmlContent = '';
    for (let i = 0; i < stats.length; i++) {
        const statName = stats[i]['stat']['name'];
        const baseStat = stats[i]['base_stat'];
        const filledBarWidth = baseStat + 'px';
        htmlContent += `<div class="stat-bar">
        <div class="filled-bar" style="width: ${filledBarWidth};"></div>
        <div class="stat-text">${statName}: ${baseStat}</div>
    </div>`;
    }
    document.getElementById('stats').innerHTML = htmlContent;
}


function changeBackgroundColor(typeForColor) {
    const color = getColorForType(typeForColor);
    document.getElementById('pokedex').style = `background-color: ${color};`;
}


function getColorForType(type) {
    if (typeColors[type] !== undefined) {
      return typeColors[type];
    } else {
      return "unknownColor";
    }
  }