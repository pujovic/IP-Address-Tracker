//Initializing the map layer
var map = L.map("map", {
  zoomControl: false,
  center: [43.325, 21.895],
  zoom: 12,
});
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

//Get DOM elements
const ip = document.querySelector("#ip");
const locationEl = document.querySelector("#location");
const timezone = document.querySelector("#timezone");
const isp = document.querySelector("#isp");
const button = document.querySelector("#button");
const input = document.querySelector("#input");

// const apiLink = >> Insert API key <<

button.addEventListener("click", searchIp);

//Fetch API data, check for errors, and display it
function getIp(link) {
  fetch(link)
    .then(async (response) => {
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }

      ip.innerHTML = data.ip;
      locationEl.innerHTML = data.location.city + ", " + data.location.country;
      timezone.innerHTML = "UTC " + data.location.timezone;
      isp.innerHTML = data.isp;
      const lat = data.location.lat;
      const lng = data.location.lng;
      map.panTo([lat, lng], 14);
      let marker = L.marker([lat, lng]).addTo(map);
    })
    .catch((error) => {
      input.value = "Invalid IP address " + `(Error: ${error})`;
      input.style.color = "red";
      console.error("There was an error!", error);
    });
}

function searchIp() {
  getIp(apiLink + "&ipAddress=" + input.value);
}

document.body.onload = function () {
  getIp(apiLink);
};
