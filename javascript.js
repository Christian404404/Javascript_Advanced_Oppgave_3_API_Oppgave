const API_URL_QUERY = "https://api.tvmaze.com/search/shows?q=";
const showContainer = document.getElementById("shows");
const searchButton = document.getElementById("search-button");
const resetSearchResults = document.getElementById("reset-button");
const searchInput = document.getElementById("search-input");

function removeAllContent() {
  showContainer.replaceChildren();
}

function printMsg(message) {
  removeAllContent();
  const msg = document.createElement("p");
  msg.textContent = message;
  showContainer.appendChild(msg);
}

function regexRemoveTags(html) {
  if (!html) return "Ingen oppsumering ble funnet.";
  return html.replace(/<[^>]*>/g, "");
}

async function findShows(userSearch) {
  printMsg("Laster inn...");

  try {
    const response = await fetch(
      `${API_URL_QUERY}${encodeURIComponent(userSearch)}`
    );
    const data = await response.json();

    removeAllContent();

    if (data.length === 0) {
      printMsg("Ingen resultater med dette søket.");
      return;
    }

    data.forEach((item) => {
      const show = item.show;

      const card = document.createElement("div");
      card.classList.add("show-card");

      const noImgFound = "img/404-error-page-free-download-free-vector.jpg";
      const image = document.createElement("img");
      image.src = show.image?.medium || noImgFound;
      image.alt = show.name;
      if (!show.image?.medium) {
        image.classList.add("notFound-img");
      }

      const info = document.createElement("div");
      info.classList.add("info");

      const title = document.createElement("h2");
      title.textContent = show.name;

      const summary = document.createElement("p");
      summary.textContent =
        regexRemoveTags(show.summary) ||
        "Ingen oppsumering ble funnet for denne serien.";

      info.appendChild(title);
      info.appendChild(summary);
      card.appendChild(image);
      card.appendChild(info);
      showContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Feil ved henting av data:", err);
    printMsg("En feil har oppstått, prøv igjen senere.");
  }
}

searchButton.addEventListener("click", () => {
  // "/ initilizing regex, \s+ removing at least one whitespace in front or back. /g global = doesn't stop at first match."
  const userSearch = searchInput.value.trim().replace(/\s+/g, " ");
  if (userSearch) {
    findShows(userSearch);
  }
});

resetSearchResults.addEventListener("click", () => {
  removeAllContent();
  searchInput.value = "";
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});

// Used this for initial testing, might add it in back later just to have something on load.
// window.addEventListener("DOMContentLoaded", () => {
//   findShows("office");
// });
