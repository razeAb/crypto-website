const apiLink =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";

let searchText = "";
const searchInput = document.getElementById("searchInput");
let listOfCoins = [];
let finalResult = [];

searchInput.addEventListener("keyup", (e) => {
  const searchInputValue = e.target.value.toUpperCase().trim();
  searchText = searchInputValue;
  const filteredSearch = listOfCoins.filter((coin) => {
    if (!searchInputValue) {
      return true;
    }

    const coinSymbol = coin.symbol.toUpperCase();
    return coinSymbol.includes(searchInputValue);
  });
  finalResult = filteredSearch;
  console.log(finalResult, searchInputValue);
  displayData(finalResult);
});

const example = document.getElementById("example");
example.addEventListener("submit", (e) => {
  e.preventDefault();
});

fetch(apiLink)
  .then((response) => response.json())
  .then((data) => {
    console.log("API has been fetched");


    // Sort the data based on the market_cap_rank property
    const sortedList = data.sort((a, b) => a.market_cap_rank - b.market_cap_rank);

    // Slice the data to get only the first 100 coins
    const sliceList = sortedList.slice(0, 100);
    finalResult = sliceList;
    listOfCoins = sliceList;
    displayData(finalResult);
  })
  .catch((error)=>{
    console.error("API fetch error:", error);
    alert("API didnt fetch. please try again later");
  });

async function getCoinData(id) {
  try {
    const cachedData = localStorage.getItem("cachedData");
    if (cachedData) {
      const data = JSON.parse(cachedData);
      console.log("Using cached data");
      return data;
    }

    console.log("Fetching data from API");
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/" + id);
      const jsonData = await response.json();
      localStorage.setItem("cachedData", JSON.stringify(jsonData));
      console.log("API data saved to cache");
      return jsonData;
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

function addToFavorites(cryptoId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(cryptoId)) {
    favorites.push(cryptoId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Added to Favorites!");
  } else {
    alert("Already in Favorites!");
  }
}

function displayData(data) {
  console.log({ data });
  const container = document.getElementById("card-container");
  let row = document.createElement("div");
  row.setAttribute("id", "row");
  row.className = "row row-cols-1 row-cols-md-3 g-4";

  data.forEach((crypto, index) => {
    if (index % 3 === 0) {
      container.appendChild(row);
      row = document.createElement("div");
      row.className = "row row-cols-1 row-cols-md-3 g-4";
    }

    const col = document.createElement("div");
    col.className = "col";
    const card = document.createElement("div");
    card.className = "card";
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = crypto.name;
    const cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.textContent = crypto.symbol.toUpperCase();
    const moreInfo = document.createElement("button");
    moreInfo.className = "moreInfo";
    moreInfo.textContent = "More Info";
    const switchButton = document.createElement("label");
    switchButton.className = "switch";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const sliderRound = document.createElement("span");
    sliderRound.className = "slider round";

    const batata = document.createElement("div");
    batata.className = "moreInfoDiv";
    const cardImg = document.createElement("img");
    cardImg.src = crypto.image;

    let batataShown = false;

    const addbatata = async () => {
      const coinData = await getCoinData(crypto.id);
      batata.textContent = `
      
      usd: $${coinData.market_data.current_price.usd}
      eur: €${coinData.market_data.current_price.eur}
      ils: ₪${coinData.market_data.current_price.ils}
      `;
      batataShown = true;
      batata.appendChild(cardImg);
      cardBody.appendChild(batata);
    };

    const removebatata = () => {
      batataShown = false;
      cardBody.removeChild(batata);
    };

    moreInfo.addEventListener("click", () => {
      if (batataShown) {
        removebatata();
      } else {
        addbatata();
      }
    });

    switchButton.appendChild(checkbox);
    switchButton.appendChild(sliderRound);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(moreInfo);
    cardBody.appendChild(switchButton);

    card.appendChild(cardBody);

    col.appendChild(card);

    row.appendChild(col);
  });

  container.appendChild(row);
}
