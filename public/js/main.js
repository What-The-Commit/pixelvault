async function getOpenseaStatsBySlug(slug) {
    const options = { method: 'GET', headers: { Accept: 'application/json' } };

    let response = await fetch('https://api.opensea.io/api/v1/collection/' + slug + '/stats', options);
    let data = await response.json();

    return data;
}

async function getEthPriceInOtherCurrencies(currency = 'USD,EUR') {
    let response = await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms="+currency+"", {
        "headers": {
            "accept": "application/json"
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    });

    let data = await response.json();

    return data;
}

window.addEventListener('load', async function () {
    ethPrices = await getEthPriceInOtherCurrencies();
    ethPriceInUsd = ethPrices.USD;
    ethPriceInEur = ethPrices.EUR;

    getOpenseaStatsBySlug('planetdaos').then(function (statsPlanets) {
        this.document.getElementById('floor-planets').innerText = statsPlanets.stats.floor_price.toFixed(2) + ' Ξ (USD: ' + (statsPlanets.stats.floor_price * ethPriceInUsd).toFixed(2).toLocaleString() + ' / EUR: ' + (statsPlanets.stats.floor_price * ethPriceInEur).toFixed(2).toLocaleString() + ')';
    });

    getOpenseaStatsBySlug('metahero-generative').then(function (statsMetahero) {
        this.document.getElementById('floor-metahero').innerText = statsMetahero.stats.floor_price.toFixed(2) + ' Ξ (USD: ' + (statsMetahero.stats.floor_price * ethPriceInUsd).toFixed(2).toLocaleString() + ' / EUR: ' + (statsMetahero.stats.floor_price * ethPriceInEur).toFixed(2).toLocaleString() + ')';
    });

    getOpenseaStatsBySlug('metaherouniverse').then(function (statsMetaheroCore) {
        this.document.getElementById('floor-metahero-core').innerText = statsMetaheroCore.stats.floor_price.toFixed(2) + ' Ξ (USD: ' + (statsMetaheroCore.stats.floor_price * ethPriceInUsd).toFixed(2).toLocaleString() + ' / EUR: ' + (statsMetaheroCore.stats.floor_price * ethPriceInEur).toFixed(2).toLocaleString() + ')';
    });

    getOpenseaStatsBySlug('punks-comic').then(function (statsPunksComic) {
        this.document.getElementById('floor-punks-comic').innerText = statsPunksComic.stats.floor_price.toFixed(2) + ' Ξ (USD: ' + (statsPunksComic.stats.floor_price * ethPriceInUsd).toFixed(2).toLocaleString() + ' / EUR: ' + (statsPunksComic.stats.floor_price * ethPriceInEur).toFixed(2).toLocaleString() + ')';
    });
})