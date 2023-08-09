/* ********* 

  BTI225 – Assignment 06
  Published Site: https://bti225-a6.netlify.app/

  I declare that this assignment is my own work in accordance with
  Seneca Academic Policy. No part of this assignment has been
  copied manually or electronically from any other source
  (including web sites) or distributed to other students.

  Please update the following with your information:

  Name:       Preet Dineshkumar Patel
  Student ID: 123845224
  Date:       08/08/2023
 
********* */

const { artists, songs } = window;
console.log({ artists, songs }, "App Data");


function buildMenu() {
  let menu = document.getElementById("menu");
  let ul = document.createElement("ul");
  menu.innerHTML = "";

  for (let i = 0; i < artists.length; i++) {
    ul.innerHTML += `<li onclick='showSelectedArtist("${artists[i].id}")'>${artists[i].name}</li>&nbsp;`;
  }

  menu.appendChild(ul);
}

function showSelectedArtist(artistID) {
  let selectedArtistContainer = document.getElementById("selected-artist");
  let selectedArtistInfo = document.getElementById("artist-info");

  let selectedArtist = artists.find((artist) => artist.id == artistID);

  selectedArtistContainer.innerHTML = `<h3>${selectedArtist.name}</h3>`;
  selectedArtistInfo.innerHTML = `
  <p>[ <a target="_blank" href="${selectedArtist.links[0].url}">${selectedArtist.links[0].name}</a> ,
   <a target="_blank" href="${selectedArtist.links[1].url}">${selectedArtist.links[1].name}</a> ]</p>`;

  showCardsByArtist(artistID);
}

async function showCardsByArtist(artistID) {
  let artistsSongs = songs.filter((song) => song.artistId == artistID);
  let cardContainer = document.getElementById("card-container");
  const songFormDiv = document.getElementById("song-form");
  cardContainer.innerHTML = ""; // clear out the card container
  songFormDiv.classList.add("hidden");
  for (let i = 0; i < artistsSongs.length; i++) {
    const minutes = Math.floor(artistsSongs[i].duration / 60);
    const seconds = artistsSongs[i].duration % 60;
    let card = document.createElement("div");
    const quote = await getRandomQuotes();
    card.classList.add("card");
    card.setAttribute("data-songid", artistsSongs[i].id);

    card.innerHTML = `<div id="img-container"><div id="play-button"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="black" class="bi bi-play-fill" viewBox="0 0 16 16">
    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
    </svg></div><img class="fade-in" src=${
      artistsSongs[i].album.imageURL
    }></img></div>
    <p>${
      artistsSongs[i].title.length < 18
        ? artistsSongs[i].title
        : artistsSongs[i].title.slice(0, 18) + "..."
    }</p>
    <span>Album : ${
      artistsSongs[i].album.name.length < 18
        ? artistsSongs[i].album.name
        : artistsSongs[i].album.name.slice(0, 18) + "..."
    }</span><br/>
    <span>Year : ${artistsSongs[i].year}</span><br/>
    <span>Duration : ${minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }</span><br/>
    <p id="quote">"${
      quote.length < 90 ? quote : quote.slice(0, 90) + "..."
    }"</p>
    
    `;

    cardContainer.appendChild(card);
  }
  const cards = document.querySelectorAll(".card");
  Array.from(cards).forEach((element) => {
    element.addEventListener("click", () => {
      const songID = element.getAttribute("data-songid");
      showSongForm(songID);
      // making a smooth scroll to the bottom so user can see the from.
      const bottom = document.querySelector("#song-form");
      bottom.scrollIntoView({ behavior: "smooth" });
    });
  });
}

async function getRandomQuotes() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();
    return data.quote;
  } catch (error) {
    console.error(error);
    return "";
  }
}

function showSongForm(songID) {
  const songForm = document.getElementById("song-form");
  // Show the form
  songForm.classList.remove("hidden");
  const song = songs.find((song) => song.id === songID);

  // Populate the form fields with the values from the found song
  document.getElementById("songID").value = song.id;
  document.getElementById("artistID").value = song.artistId;
  document.getElementById("title").value = song.title;
  document.getElementById("year").value = song.year;
  document.getElementById("duration").value = song.duration;
}

document.addEventListener("DOMContentLoaded", function () {
  buildMenu(); // Loads the menu
  showSelectedArtist(artists[0].id); // Loads the information of the first artist

  const songFormDiv = document.getElementById("song-form");
  const songForm = document.getElementById("form");

  songForm.onsubmit = function (event) {
    event.preventDefault();

    // Get the form input values
    const songId = document.getElementById("songID").value;
    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const duration = document.getElementById("duration").value;

    // Update the song information in the "songs" array
    const songIndex = songs.findIndex((song) => song.id === songId);
    if (songIndex !== -1) {
      songs[songIndex].title = title;
      songs[songIndex].year = year;
      songs[songIndex].duration = duration;
    }

    // Get the artistId from the hidden field
    const artistId = document.getElementById("artistID").value;

    // Hide the form after submission
    songFormDiv.classList.add("hidden");

    // Re-render all the songs of the current artist to show the recent updates
    showCardsByArtist(artistId);
    // just scrolling to the top for a smooth trasistion
    const top = document.querySelector("header");
    top.scrollIntoView({ behavior: "smooth" });
    // Return false to prevent default form submission
    return false;
  };
});
