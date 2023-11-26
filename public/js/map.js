mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  // center: listing.geometry.coordinates, // starting position [lng, lat] //coordinates shoulld be here but previous listing donot have coordinates so i have kept it as it is
  // center: [85.324, 27.7172], //default kathmandu coordinates but use above one when you have coordinates for all listings
  //center: listing.geometry ? listing.geometry.coordinates : [85.324, 27.7172],
  center: listing.geometry ? listing.geometry.coordinates : [85.324, 27.7172],
  zoom: 10.5, // starting zoom
});

if (listing.geometry && listing.geometry.coordinates) {
  new mapboxgl.Marker({
    color: "#FF0000",
    draggable: true,
  })
    .setLngLat(
      listing.geometry ? listing.geometry.coordinates : [85.324, 27.7172]
    ) //listing.geometry.coordinates
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4> ${listing.title} </h4> <p> Exact location will be provided after booking </p>`
      )
    )
    .addTo(map);
}

