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

function makeRequest(method,route, headers, onSuccess){
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
           onSuccess(this.response);
        }
    };

    if(Object.keys(headers).length > 0){
        route += "?";
        for(const property in headers){
            route += property + "=" + headers[property] + "&";
        }
        route = route.slice(0,route.length-1);
    }

    console.log(route);

    xhttp.open(method,route, true);

    xhttp.send();
}

function setup(){

    makeRequest("GET","/hotspots.ajax",{columns:"lng,lat"}, function(response){
        hotspots = JSON.parse(response);
        hotspots.forEach(function(cords){
            let ltlng = new mapboxgl.LngLat(cords.lng,cords.lat);
            let marker = new mapboxgl.Marker({color:"#FF0000"})
            .setLngLat(ltlng)
            .addTo(map);
        });
    });


}


setup();

