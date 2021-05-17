var allTabs = ["Profile","Hotspots","Venues","Users","Signup an Admin","User History","Email Subscription","Venue History","Venue Check-In Code"];

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
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",building:"Clown Tower",street:"123 Clown Street",zip:"52876",city:"Adelaide",country:"Australia"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",building:"Clown Tower",street:"123 Clown Street",zip:"52876",city:"Adelaide",country:"Australia"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",building:"Clown Tower",street:"123 Clown Street",zip:"52876",city:"Adelaide",country:"Australia"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",building:"Clown Tower",street:"123 Clown Street",zip:"52876",city:"Adelaide",country:"Australia"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",building:"Clown Tower",street:"123 Clown Street",zip:"52876",city:"Adelaide",country:"Australia"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",building:"Clown Tower",street:"123 Clown Street",zip:"52876",city:"Adelaide",country:"Australia"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",bName:"McDonald's",phoneNum:"+112312312",checkInCode:"MCD12321",building:"Clown Tower",street:"123 Clown Street",zip:"52876",city:"Adelaide",country:"Australia"}
    ];

var userData= [
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"}
    ];

var hotspotData = [
    {creator:"abc123@gmail.com",street:"123 Hogwarts", zip:"9.75",city:"Adelaide",country:"Australia"},
    {creator:"abc123@gmail.com",street:"123 Hogwarts", zip:"9.75",city:"Adelaide",country:"Australia"},
    {creator:"abc123@gmail.com",street:"123 Hogwarts", zip:"9.75",city:"Adelaide",country:"Australia"},
    {creator:"abc123@gmail.com",street:"123 Hogwarts", zip:"9.75",city:"Adelaide",country:"Australia"},
    {creator:"abc123@gmail.com",street:"123 Hogwarts", zip:"9.75",city:"Adelaide",country:"Australia"},
    {creator:"abc123@gmail.com",street:"123 Hogwarts", zip:"9.75",city:"Adelaide",country:"Australia"},
    {creator:"abc123@gmail.com",street:"123 Hogwarts", zip:"9.75",city:"Adelaide",country:"Australia"},
    {creator:"abc123@gmail.com",street:"123 Hogwarts", zip:"9.75",city:"Adelaide",country:"Australia"},
    {creator:"abc123@gmail.com",street:"123 Hogwarts", zip:"9.75",city:"Adelaide",country:"Australia"}
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
        building: "Clown Tower",
        street: "123 Clown Street",
        zip: "9.75",
        city: "Adelaide",
        country: "Australia",


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
        venBuildingEdit: "",
        venStreetEdit: "",
        venZipCodeEdit: "",
        venCityEdit: "",
        venCountryEdit: "",
        //UserEdits
        usIdEdit: "",
        usfNameEdit: "",
        uslNameEdit: "",
        usEmailEdit: "",
        usPhoneNumEdit: "",
        //HotspotEdits
        hsCreatorEdit: "",
        hsStreetEdit: "",
        hsZipEdit: "",
        hsCityEdit: "",
        hsCountryEdit: "",
        isAddingHot: false,
        //
        venueSearch: "",
        userSearch: "",
        hotspotSearch: "",
        editingMenuIndex: 0,
        editingDivOpen: false
    },
    computed: {
        tabs: function (){
            switch(this.accountType){
                case "user":
                    return ["Profile","User History","Email Subscription"];
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
                var mixed = venue.fName.toLowerCase() + venue.lName.toLowerCase() + venue.bName.toLowerCase() + venue.checkInCode.toLowerCase() + venue.street.toLowerCase();
                if (mixed.includes(search.toLowerCase())){
                    temp.push(venue);
                }
            });
            return temp;
        },

        userDatabase: function(){
            var search = this.userSearch;
            var temp = [];
            userData.forEach(function (user){
                var mixed = user.fName.toLowerCase() + user.lName.toLowerCase() + user.ID.toLowerCase() + user.email.toLowerCase().substring(0,user.email.indexOf("@"));
                if (mixed.includes(search.toLowerCase())){
                    temp.push(user);
                }
            });
            return temp;
        },

        hotspotDatabase: function(){
            var search = this.hotspotSearch;
            var temp = [];
            hotspotData.forEach(function (hotspot){
                var mixed = hotspot.street.toLowerCase() + hotspot.city.toLowerCase() + hotspot.country.toLowerCase();
                if (mixed.includes(search.toLowerCase())){
                    temp.push(hotspot);
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
            this.venBuildingEdit = this.venueDatabase[index].building;
            this.venStreetEdit = this.venueDatabase[index].street;
            this.venZipCodeEdit = this.venueDatabase[index].zip;
            this.venCityEdit = this.venueDatabase[index].city;
            this.venCountryEdit = this.venueDatabase[index].country;
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
            this.venueDatabase[index].building = this.venBuildingEdit;
            this.venueDatabase[index].street = this.venStreetEdit;
            this.venueDatabase[index].zip = this.venZipCodeEdit;
            this.venueDatabase[index].city = this.venCityEdit;
            this.venueDatabase[index].country = this.venCountryEdit;
            //Code to have the server update the information of venue at index index.
        },

        editUserAt: function(index){
            this.usIdEdit = this.userDatabase[index].ID;
            this.usfNameEdit = this.userDatabase[index].fName;
            this.uslNameEdit = this.userDatabase[index].lName;
            this.usEmailEdit = this.userDatabase[index].email;
            this.usPhoneNumEdit = this.userDatabase[index].phoneNum;
            this.editingMenuIndex = index;
            this.editingDivOpen = true;

        },

        updateUserInfo: function(){
            this.editingDivOpen = false;
            var index = this.editingMenuIndex;
            this.userDatabase[index].ID = this.usIdEdit;
            this.userDatabase[index].fName = this.usfNameEdit;
            this.userDatabase[index].lName = this.uslNameEdit;
            this.userDatabase[index].email = this.usEmailEdit;
            this.userDatabase[index].phoneNum = this.usPhoneNumEdit;
            //Code to have the server update the information of venue at index index.
        },

        editHotspotAt: function(index){
            this.hsCreatorEdit = this.hotspotDatabase[index].creator;
            this.hsStreetEdit = this.hotspotDatabase[index].street;
            this.hsZipEdit = this.hotspotDatabase[index].zip;
            this.hsCityEdit = this.hotspotDatabase[index].city;
            this.hsCountryEdit = this.hotspotDatabase[index].country;
            this.editingMenuIndex = index;
            this.editingDivOpen = true;

        },

        updateHotspotInfo: function(){
            this.editingDivOpen = false;
            var index = this.editingMenuIndex;
            this.hotspotDatabase[index].create = this.hsCreatorEdit;
            this.hotspotDatabase[index].street = this.hsStreetEdit;
            this.hotspotDatabase[index].zip = this.hsZipEdit;
            this.hotspotDatabase[index].city = this.hsCityEdit;
            this.hotspotDatabase[index].country = this.hsCountryEdit;
            //Code to have the server update the information of venue at index index.
        },

        startAddingHotspot: function(){
            this.editingDivOpen = true;
            this.isAddingHot = true;
            this.hsStreetEdit =  "";
            this.hsZipEdit = "";
            this.hsCityEdit = "";
            this.hsCountryEdit = "";
        },

        finishAddingHotspot: function(){
            var obj = {
                creator: this.email,
                street: this.hsStreetEdit,
                zip: this.hsZipEdit,
                city: this.hsCityEdit,
                country: this.hsCountryEdit
            };
            hotspotData.unshift(obj);
            this.hotspotSearch = "a";
            this.hotspotSearch = "";
            this.isAddingHot = false;
            this.editingDivOpen = false;

            //Code to send the new hotspot to the server.
        }

    }
});


