async function getOpenseaStatsBySlug(slug) {
    const options = { method: 'GET', headers: { Accept: 'application/json' } };

    let response = await fetch('https://api.opensea.io/api/v1/collection/' + slug + '/stats', options);
    let data = await response.json();

    return data;
}

async function getEthPriceInOtherCurrencies(currency = 'USD,EUR') {
    let response = await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=" + currency + "", {
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

async function getLowestPriceOfAssetByContractAndId(contract, id = null) {
    const options = { method: 'GET' };

    let params = new URLSearchParams({
        asset_contract_address: contract,
        order_by: 'sale_date',
        order_direction: 'desc',
        offset: 0,
        limit: 1
    });

    if (id !== null) {
        params.append('token_ids', id);
    }

    let response = await fetch('https://api.opensea.io/api/v1/assets?' + params.toString(), options);
    let data = await response.json();

    return parseFloat(ethers.utils.formatEther(data.assets[0].last_sale.total_price));
}

function toggleFiat(button) {
    if (button.innerHTML === "Show FIAT prices") {
        button.innerHTML = 'Hide FIAT prices';
    } else {
        button.innerHTML = 'Show FIAT prices';
    }

    var elms = document.getElementsByClassName("fiat-values");

    for (elm of elms) {
        if (elm.style.display === "none") {
            elm.style.display = "inline-block";
        } else {
            elm.style.display = "none";
        }
    }
}

const tokenAddressPlanets = '0x7deb7bce4d360ebe68278dee6054b882aa62d19c';
const tokenIdPlanetUranus = 7;
const tokenIdPlanetDarkMoon = 3;
const tokenIdPlanetNeptune = 8;
const tokenIdPlanetSaturn = 6;
const tokenIdPlanetJupiter = 5;
const tokenIdPlanetMars = 4;
const tokenIdPlanetVenus = 1;
const tokenIdPlanetEarth = 2;
const tokenIdPlanetMercury = 0;
const tokenIdPlanetPluto = 9;
const tokenIdPlanetMoon = 10;

const tokenAddressMintpass = '0x797a48c46be32aafcedcfd3d8992493d8a1f256b';
const tokenIdMintpassOne = 0;

const tokenAddressFoundersDao = '0xd0a07a76746707f6d6d36d9d5897b14a8e9ed493';

const tokenAddressPunksComicOne = '0x5ab21ec0bfa0b29545230395e3adaca7d552c948';
const tokenAddressPunksComicOneSpecial = '0xa9c0a07a7cb84ad1f2ffab06de3e55aab7d523e8';
const tokenAddressPunksComicTwo = '0x128675d4fddbc4a0d3f8aa777d8ee0fb8b427c2f';

window.addEventListener('load', async function () {
    ethPrices = await getEthPriceInOtherCurrencies();
    ethPriceInUsd = ethPrices.USD;
    ethPriceInEur = ethPrices.EUR;

    var formatEth = function (value, withFiat = false) {
        var formattedValue = value.toFixed(2) + ' Ξ';

        if (withFiat) {
            formattedValue += ' <span class="fiat-values" style="display: none;">('
            formattedValue += 'USD: ' + (value * ethPriceInUsd).toFixed(2).toLocaleString();
            formattedValue += '/';
            formattedValue += 'EUR: ' + (value * ethPriceInEur).toFixed(2).toLocaleString();
            formattedValue += ')</span>';
        }

        return formattedValue;
    };

    var punksComicOne = getLowestPriceOfAssetByContractAndId(tokenAddressPunksComicOne);
    var foundersDao = getLowestPriceOfAssetByContractAndId(tokenAddressFoundersDao);
    var mintpassOne = getLowestPriceOfAssetByContractAndId(tokenAddressMintpass, tokenIdMintpassOne);
    var metahero = getOpenseaStatsBySlug('metahero-generative');

    var planetMercury = getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, tokenIdPlanetMercury);
    var planetVenus = getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, tokenIdPlanetVenus);
    var planetEarth = getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, tokenIdPlanetEarth);
    var planetMars = getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, tokenIdPlanetMars);
    var planetJupiter = getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, tokenIdPlanetJupiter);
    var planetSaturn = getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, tokenIdPlanetSaturn);
    var planetUranus = getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, tokenIdPlanetUranus);
    var planetNeptune = getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, planetNeptune);
    var planetPluto = getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, tokenIdPlanetPluto);
    var planetMoon = getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, tokenIdPlanetMoon);
    

    var genesisSet = [punksComicOne, foundersDao, mintpassOne, metahero];
    var planetSet = [planetMercury, planetVenus, planetEarth, planetMars, planetJupiter, planetSaturn, planetUranus, planetNeptune, planetPluto, planetMoon];

    Promise.all(genesisSet).then(function (values) {
        var setValue = 0.00;

        for (value of values) {
            if (typeof value === 'object') {
                setValue += value.stats.floor_price;
                continue;
            }
            
            setValue += value;
        }

        var elm = this.document.getElementById('floor-set-genesis');

        elm.innerHTML = formatEth(setValue, true);
    });

    Promise.all(planetSet).then(function (values) {
        var setValue = 0.00;

        for (value of values) {
            setValue += value;
        }

        var elm = this.document.getElementById('floor-set-planets');

        elm.innerHTML = formatEth(setValue, true);
    });

    metahero.then(function (statsMetahero) {
        var elm = this.document.getElementById('floor-metahero');

        elm.innerHTML = formatEth(statsMetahero.stats.floor_price, true);
    });

    getOpenseaStatsBySlug('metaherouniverse').then(function (statsMetaheroCore) {
        var elm = this.document.getElementById('floor-metahero-core');

        elm.innerHTML = formatEth(statsMetaheroCore.stats.floor_price, true);
    });

    mintpassOne.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-metahero-mintpass-one');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    punksComicOne.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-punks-comic-one');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    getLowestPriceOfAssetByContractAndId(tokenAddressPunksComicOneSpecial).then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-punks-comic-one-special');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    getLowestPriceOfAssetByContractAndId(tokenAddressPunksComicTwo).then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-punks-comic-two');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    foundersDao.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-founders-dao');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetMercury.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-mercury');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetVenus.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-venus');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetEarth.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-earth');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    getLowestPriceOfAssetByContractAndId(tokenAddressPlanets, tokenIdPlanetDarkMoon).then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-dark-moon');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetMars.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-mars');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetJupiter.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-jupiter');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetSaturn.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-saturn');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetUranus.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-uranus');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetNeptune.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-neptune');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetPluto.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-pluto');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetMoon.then(function (lowestPrice) {
        var elm = this.document.getElementById('floor-planets-moon');

        elm.innerHTML = formatEth(lowestPrice, true);
    });
})