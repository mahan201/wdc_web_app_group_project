var allTabs = ["Profile","Hotspots","Venues","Users","Signup an Admin","User History","Have I been to a Hotspot?","Email Subscription","Venue History","Venue Check-In Code"];

var venueHistoryFull= [
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"},
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"},
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"},
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"},
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"},
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"}
    ];

var userHistoryFull= [
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"},
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"},
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"},
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"},
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"},
    {firstName: "Mahan",lastName: "Noorbahr",phoneNo: "0123456789",time: "10-5-2021 13:05"}
    ];

var appdiv = new Vue({
    el: "#app",
    data: {
        //Profile Data
        accountType: "venue",
        selectedTab: "Profile",
        editing: false,
        firstName: "Talhah",
        lastName: "Zubayer",
        phoneNum: "0123456789",
        email: "abc@gmail.com",
        businessName: "McDonalds",
        address: "123 Clown Street, Adelaide",


        //Venue History Data
        searchTerm: "",
        venueCheckInCode: "MCD1231234"
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
        },

        //Venue Data
        venueHistory: function(){
            var search = this.searchTerm;
            var temp = [];
            venueHistoryFull.forEach(function (checkIn) {
               if ((checkIn.firstName.toLowerCase().includes(search.toLowerCase())) || (checkIn.lastName.toLowerCase().includes(search.toLowerCase()))){
                   var formatted = checkIn.firstName + " " + checkIn.lastName + " " + checkIn.phoneNo + " " + checkIn.time;
                   temp.push(formatted);
               }
            });
            console.log(temp);
            return temp;
        }
    },
    methods: {
        loadMap: function(){
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


