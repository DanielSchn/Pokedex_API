let currentPokemon;


async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/4'; // Can use Number or Name. 4 is charmander
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log('Current Pokemon is: ', currentPokemon);
    renderPokemon();
}



function renderPokemon() {
    document.getElementById('pokemonName').innerHTML = `${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}`;
    document.getElementById('pokemonImage').src = currentPokemon['sprites']['other']['official-artwork']['front_shiny'];
    document.getElementById('type').innerHTML = `Type: ${currentPokemon['types']['0']['type']['name'].charAt(0).toUpperCase() + currentPokemon['types']['0']['type']['name'].slice(1)}`;
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


function getStats() {
    let stats = currentPokemon['stats'];
    let htmlContent = '';

    for (let i = 0; i < stats.length; i++) {
        const statName = stats[i]['stat']['name'];
        const baseStat = stats[i]['base_stat'];
        const filledBarWidth = baseStat + '%';

        htmlContent += `
        <div class="stat-bar">
        <div class="filled-bar" style="width: ${filledBarWidth};"></div>
        <div class="stat-text">${statName}: ${baseStat}</div>
    </div>`;
    }

    document.getElementById('stats').innerHTML = htmlContent;
}