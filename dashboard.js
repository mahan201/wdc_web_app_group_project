var allTabs = ["Profile","Hotspots","Venues","Users","Signup an Admin","User History","Have I been to a Hotspot?","Email Subscription","Venue History","Venue Check-In Code"];


var appdiv = new Vue({
    el: "#app",
    data: {
        accountType: "admin",
        selectedTab: "Profile",
        editing: false,
        firstName: "Talhah",
        lastName: "Zubayer",
        phoneNum: "0123456789",
        email: "abc@gmail.com",
        businessName: "McDonalds",
        address: "123 Clown Street, Adelaide"
        
    },
    computed: {
        tabs: function (){
            switch(this.accountType){
                case "user":
                    return ["Profile","User History","Have I been to a Hotspot?","Email Subscription"];
                case "venue":
                    return ["Profile","Venue History","Venue Check-In Code"];
                case "admin":
                    return ["Profile","Hotspots","Venues","Users","Signup an Admin"];
            }
        },
        tabsBool: function(){
            var temp = [];
            allTabs.forEach(_ => temp.push(false));

            temp[allTabs.indexOf(this.selectedTab)] = true;
            return temp;
        }
    },
    methods: {
        loadMap: function(){
            console.log("HELLO");
                mapboxgl.accessToken = 'pk.eyJ1IjoibWFoYW4yMDEiLCJhIjoiY2tvbXZwcmZ2MGFycjJvcG81dHFvbjI4dyJ9.YRrp93j6OerxskDUK17mWg';
                var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [138.6062277,-34.920603],
                zoom: 11
                });
        }

    }
});


