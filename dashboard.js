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
    {checkInCode: "MCD12387", businessName: "McDonald's",phoneNo: "0123456789",time: "10-5-2021 13:05", isHotspot: true},
    {checkInCode: "MCD12387", businessName: "McDonald's",phoneNo: "0123456789",time: "10-5-2021 13:05", isHotspot: false},
    {checkInCode: "MCD12387", businessName: "McDonald's",phoneNo: "0123456789",time: "10-5-2021 13:05", isHotspot: true},
    {checkInCode: "MCD12387", businessName: "McDonald's",phoneNo: "0123456789",time: "10-5-2021 13:05", isHotspot: false},
    {checkInCode: "MCD12387", businessName: "McDonald's",phoneNo: "0123456789",time: "10-5-2021 13:05", isHotspot: true},
    {checkInCode: "MCD12387", businessName: "McDonald's",phoneNo: "0123456789",time: "10-5-2021 13:05", isHotspot: false}
    ];

var venueData= [
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",address:"123 clown street, Adelaide", edited: false},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",address:"123 clown street, Adelaide", edited: false},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",address:"123 clown street, Adelaide", edited: false},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",address:"123 clown street, Adelaide", edited: false},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",address:"123 clown street, Adelaide", edited: false},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",address:"123 clown street, Adelaide", edited: false},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",address:"123 clown street, Adelaide", edited: false}
    ];

var appdiv = new Vue({
    el: "#app",
    data: {
        //Profile Data
        accountType: "admin",
        selectedTab: "Profile",
        editing: false,
        firstName: "Talhah",
        lastName: "Zubayer",
        phoneNum: "0123456789",
        email: "abc@gmail.com",
        businessName: "McDonalds",
        address: "123 Clown Street, Adelaide",


        searchTerm: "",

        //User Data
        weeklyNotifications: true,
        visitedHotspotNoti: true,

        //Venue Data
        venueCheckInCode: "MCD1231234",

        //Admin Data
        //VenueEdits
        venfNameEdit: "",
        venlNameEdit: "",
        venbNameEdit: "",
        venEmailEdit: "",
        venPhoneNumEdit: "",
        venAddressEdit: "",
        //
        venueSearch: "",
        userSearch: "",
        hotspotSearch: "",
        editingDivOpen: false,
        editingVenueIndex: 0,
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

        //User Data
        userHistory: function(){
            var search = this.searchTerm;
            var temp = [];
            userHistoryFull.forEach(function (checkIn) {
               if ((checkIn.checkInCode.toLowerCase().includes(search.toLowerCase())) || (checkIn.businessName.toLowerCase().includes(search.toLowerCase()))){
                   var formatted = checkIn.checkInCode + " | " + checkIn.businessName + " | " + checkIn.phoneNo + " | " + checkIn.time + " | " + (checkIn.isHotspot ? "HOTSPOT" : "");
                   temp.push(formatted);
               }
            });
            return temp;
        },

        //Venue Data
        venueHistory: function(){
            var search = this.searchTerm;
            var temp = [];
            venueHistoryFull.forEach(function (checkIn) {
               if ((checkIn.firstName.toLowerCase().includes(search.toLowerCase())) || (checkIn.lastName.toLowerCase().includes(search.toLowerCase()))){
                   var formatted = checkIn.firstName + " | " + checkIn.lastName + " | " + checkIn.phoneNo + " | " + checkIn.time;
                   temp.push(formatted);
               }
            });
            return temp;
        },

        //Admin venue list
        venueDatabase: function(){
            var search = this.venueSearch;
            var temp = [];
            venueData.forEach(function (venue){
                var mixed = venue.fName.toLowerCase() + venue.lName.toLowerCase() + venue.bName.toLowerCase() + venue.checkInCode.toLowerCase() + venue.address.toLowerCase();
                if (mixed.includes(search.toLowerCase())){
                    temp.push(venue);
                }
            });
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
        },

        historyMapView: function(){
          window.location.href = '/historyMapView.html';
        },

        updateInfo: function(){
            this.editing = false;
            //Code to send the changed info to the server.
        },

        updateEmailInfo: function(){
          //Code to send the email preferences to the server.
        },

        editVenueAt: function(index){
            this.venfNameEdit = this.venueDatabase[index].fName;
            this.venlNameEdit = this.venueDatabase[index].lName;
            this.venbNameEdit = this.venueDatabase[index].bName;
            this.venEmailEdit = this.venueDatabase[index].email;
            this.venPhoneNumEdit = this.venueDatabase[index].phoneNum;
            this.venAddressEdit = this.venueDatabase[index].address;
            this.editingMenuIndex = index;
            this.editingDivOpen = true;

        },

        updateVenueInfo: function(){
            this.editingDivOpen = false;
            var index = this.editingMenuIndex;
            this.venueDatabase[index].fName = this.venfNameEdit;
            this.venueDatabase[index].lName = this.venlNameEdit;
            this.venueDatabase[index].bName = this.venbNameEdit;
            this.venueDatabase[index].email = this.venEmailEdit;
            this.venueDatabase[index].phoneNum = this.venPhoneNumEdit;
            this.venueDatabase[index].address = this.venAddressEdit;
            //Code to have the server update the information of venue at index index.
        }

    }
});


