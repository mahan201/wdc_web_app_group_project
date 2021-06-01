mapboxgl.accessToken = 'pk.eyJ1IjoibWFoYW4yMDEiLCJhIjoiY2tvbXZwcmZ2MGFycjJvcG81dHFvbjI4dyJ9.YRrp93j6OerxskDUK17mWg';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [138.6062277,-34.920603],
zoom: 11
});

var hotspots = [
    {lat: -34.872733, long: 138.607408},
    {lat: -34.903095, long: 138.539703},
    {lat: -34.886994, long: 138.583152}
    ];


function setHotspots(lst){
    lst.forEach(function(cords){
        let ltlng = new mapboxgl.LngLat(cords.long,cords.lat);
        let marker = new mapboxgl.Marker({color:"#FF0000"})
        .setLngLat(ltlng)
        .addTo(map);
    });
}

setHotspots(hotspots);

