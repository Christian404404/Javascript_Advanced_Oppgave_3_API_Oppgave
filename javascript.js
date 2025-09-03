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
  // I kind of understand this regEx, but I'm not 100% comfortable with it yet.
  // targets opening tag <, then [^>]* targets everything inside "<>" but not the closing bracket itself.
  // *> means 0 or more of the preceeding character(s)(bracket included), so everything inside it, with a /g global flag so it does not stop after the first match.
  // "" means replace everything found with an empty string.
  // return html.replace(/<[^>]*>/g, "");

  // init regEx / targets tag <, then [^<>] targest everything inside "<>" but not the brackets themselves.
  // *> means 0 or more of the previous character, so everything inside it, and the closing bracket.
  // /g means global, so it does not stop after the first match, it continues to the end of the string.
  // "" means replace everything found with an empty string.
  return html.replace(/<[^<>]*>/g, "");
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

      const imdbId = show.externals?.imdb;
      const imdbLink = document.createElement("a");

      if (imdbId) {
        imdbLink.href = `https://www.imdb.com/title/${imdbId}/`;
        imdbLink.textContent = "Se på IMDB";
      } else {
        imdbLink.href = `https://www.imdb.com/find?q=${encodeURIComponent(
          show.name
        )}`;
        imdbLink.textContent = "Søk på IMDB";
      }
      imdbLink.target = "_blank";
      imdbLink.rel = "noopener noreferrer";
      imdbLink.classList.add("imdb-link");

      info.appendChild(title);
      info.appendChild(summary);
      info.appendChild(imdbLink);
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
  // "/ initilizing regex, \s+ removing at least one whitespace from the front and back. /g global = doesn't stop at first match."
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
