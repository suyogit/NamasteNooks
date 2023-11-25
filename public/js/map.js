mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [85.342, 27.6915], // starting position [lng, lat] //coordinates shoulld be here but previous listing donot have coordinates so i have kept it as it is
  zoom: 10.5, // starting zoom
});

const marker = new mapboxgl.Marker({
  color: "#FF0000",
  draggable: true,
})
  .setLngLat(coordinates) //listing.geometry.coordinates
  .addTo(map);

