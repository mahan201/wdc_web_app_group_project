var map;
var session = {};

makeRequest("GET","users/details.ajax",{},function(result){
    appdiv.received = true;
    session = JSON.parse(result);
});

var appdiv = new Vue({
    el : "#app",
    data : {
        received: false,
        showLogout: false
    },
    computed: {
        loggedIn: function(){
            if(this.received){
                return session.loggedIn;
            }
        },
        firstName: function(){
            if(this.received){
                return session.firstName;
            }
        }
    }
});

//Function from prep.js
makeRequest("GET","/users/mapHistory.ajax",{}, function(response){
        var hotspots = JSON.parse(response);
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFoYW4yMDEiLCJhIjoiY2tvbXZwcmZ2MGFycjJvcG81dHFvbjI4dyJ9.YRrp93j6OerxskDUK17mWg';
        map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [hotspots[0].lng,hotspots[0].lat],
        zoom: 11
        });

        hotspots.forEach(function(cords){
            let ltlng = new mapboxgl.LngLat(cords.lng,cords.lat);
            let marker = new mapboxgl.Marker({color:"#FF0000"})
            .setLngLat(ltlng)
            .addTo(map);
        });
    });

