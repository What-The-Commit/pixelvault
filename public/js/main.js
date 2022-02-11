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

async function fetchPriceInWeth(pool) {
    let response = await fetch("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3", {
        "body": "{\"query\":\"\\n  {\\n    pool(id: \\\"" + pool + "\\\") {\\n      token1Price\\n    }\\n  }\\n\"}",
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    });

    let data = await response.json();

    return data.data.pool.token1Price;
}

async function addTokenToMetamask(address, symbol, decimals = 18) {
    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: address, // The address that the token is at.
                    symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: decimals, // The number of decimals in the token
                },
            },
        });
    } catch (error) {
        console.error(error);
    }
}

function toggleFiat(button) {
    if (button.innerHTML === "Show FIAT prices") {
        button.innerHTML = 'Hide FIAT prices';
    } else {
        button.innerHTML = 'Show FIAT prices';
    }

    let elms = document.getElementsByClassName("fiat-values");

    for (const elm of elms) {
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
const tokenAddressPunksComicTwoEliteApeCoins = '0xd0b53410454370a482979c0adaf3667c6308a801';
const tokenIdPunksComicTwoEliteApeCoins = 0;

const tokenAddressEliteApeBiz = '0x15d164340c1548fa74fa1b98c24a3ea24fefb177';
const tokenAddressEliteApeKingBlackBored = '0xb8e4b186256085ed360278cb86afc968f06a7ec3';
const tokenAddressEliteApeBba = '0xa173846434d21c1a0eb7740d47f629da89436af5';
const tokenAddressEliteApeTropo = '0x67e341b0b06f9a805896737a73ef55f2226692e3';
const tokenAddressEliteApeKiki = '0x37f02e4fa5f28a25baf64566083c717c387761d0';
const tokenAddressEliteApeGoldRilla = '0xce29001d6748c531b420163b88ff58ed326d7337';
const tokenAddressEliteApeHanzo = '0xa379cec69303e3ec0fea64d9298f126658276f63';
const tokenAddressEliteApeLoneStar = '0x2f2e1edf30bf7bfa8ba13c8c16bf3347f0e238ff';

const powAddress = '0xc0793782d11dd9bf7b3a7a5a74614f1debe1da2e';
const punksAddress = '0xa80ccc104349d2ee29998c54d6e6488012f8afe0';

const tokenAddressCollabAdidas = '0x28472a58a490c5e09a238847f66a68a47cc76f0f';
const tokenIdCollabAdidas = 0;

const tokenAddressMetahero = '0x6dc6001535e15b9def7b0f6a20a2111dfa9454e2';
const tokenAddressMetaheroCore = '0xfb10b1717c92e9cc2d634080c3c337808408d9e1';

const stakingAddressMetahero = '0x6ce31a42058f5496005b39272c21c576941dbfe9';
const stakingAddressPunksComic = '0xb7bceb36c5f0f8ec1fb67aaeeed2d7252112ea21';

const erc1155Abi = [
    "function totalSupply(uint256 id) public view returns (uint256)",
    "function balanceOf(address account, uint256 id) external view returns (uint256)",
    "function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory)",
];

const erc721Abi = [
    "function totalSupply() external view returns (uint256)",
    "function balanceOf(address owner) external view returns (uint256 balance)",
    "function ownerOf(uint256 tokenId) external view returns (address owner)"
];

const ethersProvider = new ethers.providers.JsonRpcProvider('https://speedy-nodes-nyc.moralis.io/4bdc28473b549df902238ed0/eth/mainnet');

const apiHost = 'https://api.what-the-commit.com';

window.addEventListener('load', async function () {
    await getEthPrices();
    await createTraitsTable(tokenAddressMetahero);

    loadFloorPricesForTraits(tokenAddressMetahero);

    refreshPrices();
    refreshTotalSupplies();
    updateLastUpdatedFields();

    /*setInterval(function () {
        refreshPrices();
        refreshTotalSupplies();
        updateLastUpdatedFields();
    }, 60*5*1000);*/
})

async function getBalanceOfFromContractByOwner(contractAddress, owner) {
    let contract = new ethers.Contract(contractAddress, erc721Abi, ethersProvider);
    let balance = ethers.BigNumber.from("1");

    try {
        balance = await contract.balanceOf(owner);
    } catch (e) {
        console.error(e);
        return balance;
    }

    return balance;
}

async function getTotalSupplyByContractAddressAndType(contractAddress, type, tokenId = null) {
    const body = {
        "type": type
    };

    if (tokenId !== null) {
        body['filters'] = [
            {
                "key": "tokenId",
                "value": tokenId
            }
        ];
    }

    let response = await fetch(apiHost+'/nft/'+contractAddress+'/total-supply', {method: 'POST', body: JSON.stringify(body), headers: {"Content-Type": "application/json;charset=UTF-8"}});
    let responseData = await response.json();

    try {
        return parseInt(responseData);
    } catch (error) {
        return 0;
    }
}

async function updateLastUpdatedFields() {
    var lastUpdated = new Date().toLocaleString(navigator.language);
    var updatedFields = this.document.getElementsByClassName('last-updated-floor-value');

    for (updatedField of updatedFields) {
        updatedField.innerHTML = '<b>' + lastUpdated + '</b>';
    }
}

async function refreshTotalSupplies() {
    getTotalSupplyByContractAddressAndType(tokenAddressMintpass, 'ERC1155', tokenIdMintpassOne).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-mintpass-one');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPunksComicTwoEliteApeCoins, 'ERC1155', tokenIdPunksComicTwoEliteApeCoins).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-punks-comic-two-elite-ape-entry-coins');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetMercury).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-mercury');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetVenus).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-venus');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetEarth).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-earth');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetDarkMoon).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-dark-moon');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetMars).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-mars');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetJupiter).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-jupiter');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetSaturn).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-saturn');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetUranus).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-uranus');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetNeptune).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-neptune');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetPluto).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-pluto');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressPlanets, 'ERC1155', tokenIdPlanetMoon).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-planet-moon');

        elm.innerHTML = totalSupply.toString();
    });

    var metaheroSupply = getTotalSupplyByContractAddressAndType(tokenAddressMetahero, 'ERC721');
    var metaheroStaked = getBalanceOfFromContractByOwner(tokenAddressMetahero, stakingAddressMetahero);

    metaheroSupply.then(function (totalSupply) {
        let elm = this.document.getElementById('supply-metahero');

        elm.innerHTML = totalSupply.toString();
    });

    Promise.all([metaheroSupply, metaheroStaked]).then(function (values) {
        let elmAbs = document.getElementById('staking-metahero');
        let elmPercentage = document.getElementById('staking-metahero-percentage');
        var supply = parseInt(values[0]);
        var metaheroStaked = values[1].toNumber();

        elmAbs.innerText = metaheroStaked;
        elmPercentage.innerText = (metaheroStaked / supply * 100).toFixed();
    });


    var punksComicSupply = getTotalSupplyByContractAddressAndType(tokenAddressPunksComicOne, 'ERC721');
    var punksComicStaked = getBalanceOfFromContractByOwner(tokenAddressPunksComicOne, stakingAddressPunksComic);

    Promise.all([punksComicSupply, punksComicStaked]).then(function (values) {
        let elmAbs = document.getElementById('staking-punks-comic');
        let elmPercentage = document.getElementById('staking-punks-comic-percentage');
        var supply = parseInt(values[0]);
        var punksComicStaked = values[1].toNumber();

        elmAbs.innerText = punksComicStaked;
        elmPercentage.innerText = (punksComicStaked / supply * 100).toFixed();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressMetaheroCore, 'ERC721').then(function (totalSupply) {
        let elm = this.document.getElementById('supply-metahero-core');

        elm.innerHTML = totalSupply.toString();
    });

    getTotalSupplyByContractAddressAndType(tokenAddressCollabAdidas, 'ERC1155', tokenIdCollabAdidas).then(function (totalSupply) {
        let elm = this.document.getElementById('supply-collab-adidas');

        elm.innerHTML = totalSupply.toString();
    });
}

async function getTraitsWithValuesForContract(contractAddress) {
    let responseTraits = await fetch(apiHost+'/nft/'+contractAddress+'/distinct/traits.type', {method: 'POST'});
    let responseDataTraits = await responseTraits.json();

    let traitsWithValues = {};

    for (const trait of responseDataTraits) {
        const body = {
            "filters": [
                {
                    "key": "traits.type",
                    "value": trait
                }
            ]
        };

        let responseValues = await fetch(apiHost+'/nft/'+contractAddress+'/distinct/traits.value', {method: 'POST', body: JSON.stringify(body), headers: {"Content-Type": "application/json"}});
        let responseDataValues = await responseValues.json();

        if (!Array.isArray(traitsWithValues[trait])) {
            traitsWithValues[trait] = [];
        }

        traitsWithValues[trait].push(...responseDataValues[0].distinctTraits);
    }

    return traitsWithValues;
}

async function createTraitsTable(contractAddress) {
    const traitsWithValues = await getTraitsWithValuesForContract(contractAddress);

    let entries = Object.entries(traitsWithValues);
    entries.sort((a, b) => a[1].length - b[1].length);

    let tableHeadFromValues = '';
    let tableBodyFromValues = '';

    for (const traitWithValues of entries) {
        let trait = traitWithValues[0];
        let values = traitWithValues[1];

        let align = values.length < 4 ? 'text-align: center;' : 'text-align: left;';

        tableHeadFromValues = '';
        tableBodyFromValues = '<tr>';

        tableBodyFromValues += `<td style="min-width: 95px;width:95px;">${trait}</td>`;

        for (const value of values) {
            tableHeadFromValues += `<th style="${align}">${value}</th>`;
            tableBodyFromValues += `<td style="${align}" id="floor-metahero-${trait.toLowerCase().replace(' ', '-')}-${value.toLowerCase().replace(' ', '-')}"></td>`;
        }

        tableBodyFromValues += '</tr>';

        const tableTemplate = `
        <table class="table table-borderless pv-table">
        <thead style="color: var(--pv-green);">
        <tr>
        <th style="color: white; ${align}">Trait</th>
        ${tableHeadFromValues}
        </tr>
        </thead>
        <tbody>
        ${tableBodyFromValues}
        </tbody>
        </table>
    `;

        document.getElementById('traits-table').innerHTML = document.getElementById('traits-table').innerHTML + tableTemplate;
    }
}

async function getFloorPriceForContract(contractAddress) {
    let response = await fetch(apiHost+'/nft/'+contractAddress+'/lowest-price', {method: 'POST', headers: {"Content-Type": "application/json;charset=UTF-8"}});
    let responseData = await response.json();

    try {
        return parseFloat(responseData[0].order.price['$numberDecimal']);
    } catch (error) {
        return 0.00;
    }
}

async function getFloorPriceForContractAndTokenId(contractAddress, tokenId) {
    const body = {
        "filters": [
            {
                "key": "tokenId",
                "value": tokenId
            }
        ]
    };

    let response = await fetch(apiHost+'/nft/'+contractAddress+'/lowest-price', {method: 'POST', body: JSON.stringify(body), headers: {"Content-Type": "application/json;charset=UTF-8"}});
    let responseData = await response.json();

    try {
        return parseFloat(responseData[0].order.price['$numberDecimal']);
    } catch (error) {
        return 0.00;
    }
}

async function getFloorPriceForTraitAndValue(contractAddress, trait, value) {
    const body = {
        "filters": [
            {
                "key": "traits.type",
                "value": trait
            },
            {
                "key": "traits.value",
                "value": value
            }
        ]
    };

    let response = await fetch(apiHost+'/nft/'+contractAddress+'/lowest-price', {method: 'POST', body: JSON.stringify(body), headers: {"Content-Type": "application/json;charset=UTF-8"}});
    let responseData = await response.json();

    try {
        return parseFloat(responseData[0].order.price['$numberDecimal']);
    } catch (error) {
        return 0.00;
    }
}

async function loadFloorPricesForTraits(contractAddress) {
    const traitsWithValues = await getTraitsWithValuesForContract(contractAddress);

    let entries = Object.entries(traitsWithValues);
    entries.sort((a, b) => a[1].length - b[1].length);

    for (const traitWithValues of entries) {
        let trait = traitWithValues[0];
        let values = traitWithValues[1];

        for (const value of values) {
            let floorPriceElementId = `floor-metahero-${trait.toLowerCase().replace(' ', '-')}-${value.toLowerCase().replace(' ', '-')}`;

            getFloorPriceForTraitAndValue(contractAddress, trait, value).then(function (floorPrice) {
                document.getElementById(floorPriceElementId).innerHTML = floorPrice === 0.00 ? 'N/A' : formatEth(floorPrice, true);
            }).catch(error => console.log(error));
        }
    }
}

function formatEth(value, withFiat = false) {
    if (value <= 0) {
        return 'N/A';
    }

    let formattedValue = value.toFixed(2) + ' Ξ';

    if (withFiat) {
        formattedValue += ' <span class="fiat-values" style="display: none;">('
        formattedValue += 'USD: ' + (value * ethPriceInUsd).toFixed(2).toLocaleString();
        formattedValue += '/';
        formattedValue += 'EUR: ' + (value * ethPriceInEur).toFixed(2).toLocaleString();
        formattedValue += ')</span>';
    }

    return formattedValue;
}

let ethPriceInUsd;
let ethPriceInEur;

async function getEthPrices() {
    ethPrices = await getEthPriceInOtherCurrencies();
    ethPriceInUsd = ethPrices.USD;
    ethPriceInEur = ethPrices.EUR;
}

async function refreshPrices() {
    fetchPriceInWeth(powAddress).then(function (powPriceInWeth) {
        let elm = this.document.getElementById('token-price-pow');
        elm.innerHTML = '$' + (powPriceInWeth * ethPriceInUsd).toFixed(2).toLocaleString();
    });

    fetchPriceInWeth(punksAddress).then(function (punksPriceInWeth) {
        let elm = this.document.getElementById('token-price-punks');
        elm.innerHTML = '$' + (punksPriceInWeth * ethPriceInUsd).toFixed(2).toLocaleString();
    });

    var punksComicOne = getFloorPriceForContract(tokenAddressPunksComicOne);
    var foundersDao = getFloorPriceForContract(tokenAddressFoundersDao);
    var mintpassOne = getFloorPriceForContractAndTokenId(tokenAddressMintpass, tokenIdMintpassOne);
    var metahero = getFloorPriceForContract(tokenAddressMetahero);

    var planetMercury = getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetMercury);
    var planetVenus = getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetVenus);
    var planetEarth = getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetEarth);
    var planetMars = getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetMars);
    var planetJupiter = getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetJupiter);
    var planetSaturn = getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetSaturn);
    var planetUranus = getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetUranus);
    var planetNeptune = getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetNeptune);
    var planetPluto = getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetPluto);
    var planetMoon = getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetMoon);

    var collabAdidas = getFloorPriceForContractAndTokenId(tokenAddressCollabAdidas, tokenIdCollabAdidas);

    var genesisSet = [punksComicOne, foundersDao, mintpassOne, metahero];
    var planetSet = [planetMercury, planetVenus, planetEarth, planetMars, planetJupiter, planetSaturn, planetUranus, planetNeptune, planetPluto, planetMoon];

    Promise.all(genesisSet).then(function (values) {
        let setValue = 0.00;

        for (const value of values) {
            setValue += value;
        }

        let elm = this.document.getElementById('floor-set-genesis');

        elm.innerHTML = formatEth(setValue, true);
    });

    Promise.all(planetSet).then(function (values) {
        let setValue = 0.00;

        for (const value of values) {
            setValue += value;
        }

        let elm = this.document.getElementById('floor-set-planets');

        elm.innerHTML = formatEth(setValue, true);
    });

    metahero.then(function (statsMetahero) {
        let elm = this.document.getElementById('floor-metahero');

        elm.innerHTML = formatEth(statsMetahero, true);
    });

    getFloorPriceForContract(tokenAddressMetaheroCore).then(function (statsMetaheroCore) {
        let elm = this.document.getElementById('floor-metahero-core');

        elm.innerHTML = formatEth(statsMetaheroCore, true);
    });

    mintpassOne.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-metahero-mintpass-one');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    punksComicOne.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-punks-comic-one');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    getFloorPriceForContract(tokenAddressPunksComicOneSpecial).then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-punks-comic-one-special');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    getFloorPriceForContract(tokenAddressPunksComicTwo).then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-punks-comic-two');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    getFloorPriceForContractAndTokenId(tokenAddressPunksComicTwoEliteApeCoins, tokenIdPunksComicTwoEliteApeCoins).then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-punks-comic-two-elite-ape-entry-coins');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    getFloorPriceForContract(tokenAddressEliteApeBiz).then(function (statsEliteApe) {
        let elm = this.document.getElementById('floor-eliteape-biz');

        elm.innerHTML = formatEth(statsEliteApe, true);
    });

    getFloorPriceForContract(tokenAddressEliteApeKingBlackBored).then(function (statsEliteApe) {
        let elm = this.document.getElementById('floor-eliteape-king-black-bored');

        elm.innerHTML = formatEth(statsEliteApe, true);
    });

    getFloorPriceForContract(tokenAddressEliteApeBba).then(function (statsEliteApe) {
        let elm = this.document.getElementById('floor-eliteape-bba');

        elm.innerHTML = formatEth(statsEliteApe, true);
    });

    getFloorPriceForContract(tokenAddressEliteApeTropo).then(function (statsEliteApe) {
        let elm = this.document.getElementById('floor-eliteape-tropo');

        elm.innerHTML = formatEth(statsEliteApe, true);
    });

    getFloorPriceForContract(tokenAddressEliteApeKiki).then(function (statsEliteApe) {
        let elm = this.document.getElementById('floor-eliteape-kiki');

        elm.innerHTML = formatEth(statsEliteApe, true);
    });

    getFloorPriceForContract(tokenAddressEliteApeGoldRilla).then(function (statsEliteApe) {
        let elm = this.document.getElementById('floor-eliteape-gold-rilla');

        elm.innerHTML = formatEth(statsEliteApe, true);
    });

    getFloorPriceForContract(tokenAddressEliteApeHanzo).then(function (statsEliteApe) {
        let elm = this.document.getElementById('floor-eliteape-hanzo');

        elm.innerHTML = formatEth(statsEliteApe, true);
    });

    getFloorPriceForContract(tokenAddressEliteApeLoneStar).then(function (statsEliteApe) {
        let elm = this.document.getElementById('floor-eliteape-lone-star');

        elm.innerHTML = formatEth(statsEliteApe, true);
    });

    foundersDao.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-founders-dao');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetMercury.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-mercury');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetVenus.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-venus');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetEarth.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-earth');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    getFloorPriceForContractAndTokenId(tokenAddressPlanets, tokenIdPlanetDarkMoon).then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-dark-moon');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetMars.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-mars');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetJupiter.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-jupiter');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetSaturn.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-saturn');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetUranus.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-uranus');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetNeptune.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-neptune');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetPluto.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-pluto');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    planetMoon.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-planets-moon');

        elm.innerHTML = formatEth(lowestPrice, true);
    });

    collabAdidas.then(function (lowestPrice) {
        let elm = this.document.getElementById('floor-collab-adidas');

        elm.innerHTML = formatEth(lowestPrice, true);
    });
}