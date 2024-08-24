let mapToken = Token;
    console.log(mapToken);
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

console.log(coordinates);

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color: "black"})
.setLngLat(coordinates)
.addTo(map);
