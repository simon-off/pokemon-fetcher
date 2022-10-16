const searchForm = document.querySelector(".search-form");
const searchField = document.querySelector("#search");
const resultSection = document.querySelector(".result");

const pokeUrl = "https://pokeapi.co/api/v2/pokemon/";
const pokemon = [];

const saveData = (data) => {
  result = JSON.parse(data);
  for (const mon of Object.values(result.results)) {
    pokemon.push(mon.name);
  }
};

const updateUISuccess = (data) => {
  const result = JSON.parse(data);
  const article = document.createElement("article");
  article.addEventListener("click", () => {
    resultSection.querySelectorAll("article").forEach((el) => el.classList.remove("active"));
    article.classList.add("active");
  });
  article.innerHTML = `
  <img src="${result.sprites.front_default}" alt="${result.name}">
  <div>
    <p>${result.name}</p>
    <ul class="info">
      <li>height: ${result.height / 10}m</li>
      <li>weight: ${result.weight / 10}kg</li>
    </ul>
  </div>
  `;
  resultSection.append(article);
  let articles = document.querySelectorAll("article");
  console.log(articles);
  if (articles.length === 1) {
    article.classList.add("active");
  } else {
    articles.forEach((el) => el.classList.remove("active"));
  }
};

const updateUIError = (error) => {
  resultSection.innerHTML = "<h2>Found nothing...</h2>";
};

const responseMethod = (httpRequest, ui) => {
  if (httpRequest.readyState === 4) {
    if (httpRequest.status === 200) {
      if (ui) updateUISuccess(httpRequest.responseText);
      else saveData(httpRequest.responseText);
    } else {
      updateUIError(`${httpRequest}: ${httpRequest.responseText}`);
    }
  }
};

const createRequest = (url, ui = true) => {
  const httpRequest = new XMLHttpRequest(url);
  httpRequest.addEventListener("readystatechange", (url) => {
    responseMethod(httpRequest, ui);
  });
  httpRequest.open("GET", url);
  httpRequest.send();
};

let oldResult = [];

searchField.addEventListener("input", () => {
  if (searchField.value !== "") {
    const result = pokemon.filter((mon) => mon.includes(searchField.value.toLowerCase()));
    if (result.length > 10) result.splice(10, result.length - 10);
    if (result.toString() !== oldResult.toString()) {
      resultSection.innerHTML = "";
      result.forEach((mon) => {
        createRequest(pokeUrl + mon);
      });
    }
    oldResult = result;
  } else {
    resultSection.innerHTML = "";
    oldResult = [];
  }
});

searchForm.addEventListener("submit", (e) => e.preventDefault());

createRequest(pokeUrl + "?limit=151", false);

// TODO: Add all pokemon when no search
