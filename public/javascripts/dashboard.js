var allTabs = ["Profile","Hotspots","Venues","Users","Signup an Admin","User History","Email Subscription","Venue History","Venue Check-In Code"];

var venueHistoryFull= [];

var userHistoryFull= [];

var venueData= [];

var userData= [
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"},
    {email:"abc123@gmail.com",fName:"Bill",lName:"Gates",phoneNum:"+112312312",ID:"IC12321313"}
    ];

var hotspotData = [];


var appdiv = new Vue({
    el: "#app",
    data: {
        session: {},
        showLogout: false,
        loggedIn: false,
        //Demonstration Data
        accountType: "user",
        //Profile Data
        selectedTab: "Profile",
        editing: false,
        user: "",
        firstName: "",
        lastName: "",
        phoneNum: "",
        icPsprt:"",
        businessName: "",
        buildingName: "",
        streetName: "",
        zipCode: "",
        city: "",
        country: "",

        emailUpdateFlag: false,


        searchTerm: "",

        //User Data
        weeklyNotifications: true,
        visitedHotspotNoti: true,

        //Admin Sign Up models
        adminSUfirstName: "",
        adminSUlastName: "",
        adminSUphoneNum: "",
        adminSUemail: "",
        adminSUpassword: "",
        adminSUconfirmPassword: "",
        adminSUmessage: "",

        //Venue Data
        checkInCode: "",

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
        hsLng: 0,
        hsLat: 0,
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
                   var formatted = checkIn.checkInCode + " | " + checkIn.businessName + " | " + checkIn.phoneNum + " | " + checkIn.time + (checkIn.isHotspot ? " | HOTSPOT" : "");
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
                   var formatted = checkIn.firstName + " | " + checkIn.lastName + " | " + checkIn.phoneNum + " | " + checkIn.time;
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
                var mixed = venue.firstName.toLowerCase() + venue.lastName.toLowerCase() + venue.businessName.toLowerCase() + venue.checkInCode.toLowerCase();
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
                var mixed = user.firstName.toLowerCase() + user.lastName.toLowerCase() + user.icPsprt.toLowerCase() + user.email.toLowerCase().substring(0,user.email.indexOf("@"));
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

        anyEmpty: function(){
            var mixed = [];
            if (this.accountType == "user"){
                mixed = [this.firstName,this.lastName,this.phoneNum];
            } else if (this.accountType == "venue"){
                mixed = [this.firstName,this.lastName,this.phoneNum,this.businessName];

            } else {
                mixed = [this.firstName,this.lastName];
            }

            if(mixed.includes("")){
                return true;
            } else {
                return false;
            }

        },

        updateInfo: function(){
            if(!this.anyEmpty()){
                console.log("SENT");
                this.editing = false;

                var obj = {
                    accountType: "admin",
                    email: this.user,
                    firstName: this.firstName,
                    lastName: this.lastName
                };

                if(this.accountType === "user"){
                    obj.accountType = "user";
                    obj.phoneNum = this.phoneNum;
                    obj.icPsprt = this.icPsprt;
                } else if (this.accountType === "venue"){
                    obj.accountType = "venue";
                    obj.businessName = this.businessName;
                }

                var xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 500){
                        alert("Internal Server Error. Please try again later.");
                    }
                };


                xhttp.open("POST","/users/updateInfo.ajax", true);

                xhttp.setRequestHeader("Content-type", "application/json");

                xhttp.send(JSON.stringify(obj));
            }

        },

        updateEmailInfo: function(){
            appdiv.emailUpdateFlag = false;
            //If the current checkbox states are the same as
            if(this.weeklyNotifications === Boolean(this.session.weeklyHotspotNoti) && this.visitedHotspotNoti === Boolean(this.session.venueHotspotNoti)){
                return;
            }

            //Code to send the email preferences to the server.
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    console.log("UPDATED");
                   appdiv.emailUpdateFlag = true;
                   appdiv.session.weeklyHotspotNoti = Number(appdiv.weeklyNotifications);
                   appdiv.session.venueHotspotNoti = Number(appdiv.visitedHotspotNoti);
                } else if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                }
            };


            xhttp.open("POST","/users/"+this.user+"/updateEmailPref.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({weeklyNotifications: this.weeklyNotifications, visitedHotspot: this.visitedHotspotNoti}));
        },

        editVenueAt: function(index){
            this.editingMenuIndex = index;
            this.venfNameEdit = this.venueDatabase[index].firstName;
            this.venlNameEdit = this.venueDatabase[index].lastName;
            this.venbNameEdit = this.venueDatabase[index].businessName;
            this.venEmailEdit = this.venueDatabase[index].email;
            this.venPhoneNumEdit = this.venueDatabase[index].phoneNum;

            makeRequest("GET","users/"+this.venEmailEdit+"/venueAddress.ajax",{},function(result){
                var res = JSON.parse(result)[0];

                appdiv.venBuildingEdit = res.buildingName;
                appdiv.venStreetEdit = res.streetName;
                appdiv.venZipCodeEdit = res.zipCode;
                appdiv.venCityEdit = res.city;
                appdiv.venCountryEdit = res.country;

                appdiv.venBuildingEditOri = res.buildingName;
                appdiv.venStreetEditOri = res.streetName;
                appdiv.venZipCodeEditOri = res.zipCode;
                appdiv.venCityEditOri = res.city;
                appdiv.venCountryEditOri = res.country;

                appdiv.editingDivOpen = true;
            });


        },

        updateVenueInfo: function(){
            this.editingDivOpen = false;
            var index = this.editingMenuIndex;

            //If nothing is changed. dont call the server.
            if(
                this.venueDatabase[index].firstName === this.venfNameEdit &&
                this.venueDatabase[index].lastName === this.venlNameEdit &&
                this.venueDatabase[index].businessName === this.venbNameEdit &&
                this.venueDatabase[index].email === this.venEmailEdit &&
                this.venueDatabase[index].phoneNum === this.venPhoneNumEdit
                ){
                    this.updateVenueAddress();
                    return;
                }

            this.venueDatabase[index].firstName = this.venfNameEdit;
            this.venueDatabase[index].lastName = this.venlNameEdit;
            this.venueDatabase[index].businessName = this.venbNameEdit;
            this.venueDatabase[index].email = this.venEmailEdit;
            this.venueDatabase[index].phoneNum = this.venPhoneNumEdit;

            var obj = this.venueDatabase[index];
            obj.accountType = "venue";

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                }
            };


            xhttp.open("POST","/users/updateInfo.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify(obj));

            this.updateVenueAddress();

        },

        updateVenueAddress: function(){
            var index = this.editingMenuIndex;

            if(
                this.venBuildingEditOri === this.venBuildingEdit &&
                this.venStreetEditOri === this.venStreetEdit &&
                this.venZipCodeEditOri === this.venZipCodeEdit &&
                this.venCityEditOri === this.venCityEdit &&
                this.venCountryEditOri === this.venCountryEdit
                ) {return;}


            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
              if(this.readyState == 4 && this.status == 200){
                var result = JSON.parse(this.response);

                appdiv.updateVenueAddressSend(result[0].lon,result[0].lat);
              }
            };

            var address = [this.venBuildingEdit,this.venStreetEdit,this.venZipCodeEdit,this.venCityEdit,this.venCountryEdit].reduce((acc,val) => acc = acc + val + ", ", "");
            address = address.slice(0,address.length-2);

            xhttp.open("GET","https://us1.locationiq.com/v1/search.php?key=pk.4e874fdbdccdbc06c6bf9becc4b7fadf&format=json&q=" + encodeURIComponent(address), true);

            xhttp.send();
        },

        updateVenueAddressSend: function(lng,lat){
            var obj = {};
            obj.venue = this.venEmailEdit;
            obj.buildingName = this.venBuildingEdit;
            obj.streetName = this.venStreetEdit;
            obj.zipCode = this.venZipCodeEdit;
            obj.city = this.venCityEdit;
            obj.country = this.venCountryEdit;
            obj.lng = lng;
            obj.lat = lat;

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                }
            };


            xhttp.open("POST","/users/update-venueAddress.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify(obj));

        },

        editUserAt: function(index){
            this.usIdEdit = this.userDatabase[index].icPsprt;
            this.usfNameEdit = this.userDatabase[index].firstName;
            this.uslNameEdit = this.userDatabase[index].lastName;
            this.usEmailEdit = this.userDatabase[index].email;
            this.usPhoneNumEdit = this.userDatabase[index].phoneNum;
            this.editingMenuIndex = index;
            this.editingDivOpen = true;

        },

        updateUserInfo: function(){
            this.editingDivOpen = false;
            var index = this.editingMenuIndex;
            this.userDatabase[index].icPsprt = this.usIdEdit;
            this.userDatabase[index].firstName = this.usfNameEdit;
            this.userDatabase[index].lastName = this.uslNameEdit;
            this.userDatabase[index].email = this.usEmailEdit;
            this.userDatabase[index].phoneNum = this.usPhoneNumEdit;

            var obj = this.userDatabase[index];

            obj.accountType = "user";

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                }
            };


            xhttp.open("POST","/users/updateInfo.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify(obj));

            this.updateVenueAddress();
            //Code to have the server update the information of venue at index index.
        },

        editHotspotAt: function(index){
            this.hsCreatorEdit = this.hotspotDatabase[index].creator;
            this.hsStreetEdit = this.hotspotDatabase[index].street;
            this.hsZipEdit = this.hotspotDatabase[index].zipCode;
            this.hsCityEdit = this.hotspotDatabase[index].city;
            this.hsCountryEdit = this.hotspotDatabase[index].country;
            this.editingMenuIndex = index;
            this.editingDivOpen = true;

        },

        updateHotspotInfo: function(){
            this.editingDivOpen = false;
            var index = this.editingMenuIndex;

            if(
                this.hotspotDatabase[index].street === this.hsStreetEdit &&
                this.hotspotDatabase[index].zipCode === this.hsZipEdit &&
                this.hotspotDatabase[index].city === this.hsCityEdit &&
                this.hotspotDatabase[index].country === this.hsCountryEdit
                ) {return;}

            this.hotspotDatabase[index].street = this.hsStreetEdit;
            this.hotspotDatabase[index].zipCode = this.hsZipEdit;
            this.hotspotDatabase[index].city = this.hsCityEdit;
            this.hotspotDatabase[index].country = this.hsCountryEdit;
            //Code to have the server update the information of venue at index index.

            //Use the Forward Geocoding API to get lng lat coordinates.
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
              if(this.readyState == 4 && this.status == 200){
                var result = JSON.parse(this.response);

                appdiv.hotspotDatabase[appdiv.editingMenuIndex].lng = result[0].lon;
                appdiv.hotspotDatabase[appdiv.editingMenuIndex].lat = result[0].lat;
                appdiv.updateHotspotInfoSend();
              }
            };

            var address = [this.hsStreetEdit,this.hsZipEdit,this.hsCityEdit,this.hsCountryEdit].reduce((acc,val) => acc = acc + val + ", ", "");
            address = address.slice(0,address.length-2);

            xhttp.open("GET","https://us1.locationiq.com/v1/search.php?key=pk.4e874fdbdccdbc06c6bf9becc4b7fadf&format=json&q=" + encodeURIComponent(address), true);

            xhttp.send();

        },

        updateHotspotInfoSend: function(){
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                }
            };


            xhttp.open("POST","/users/update-hotspot.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify(this.hotspotDatabase[this.editingMenuIndex]));
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
            var combined = [this.hsStreetEdit, this.hsZipEdit, this.hsCityEdit,this.hsCountryEdit];
            if(combined.includes("") || combined.includes(" ")){
                alert("Fields cannot be empty");
                return;
            }

            //Use the Forward Geocoding API to get lng lat coordinates.
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
              if(this.readyState == 4 && this.status == 200){
                var result = JSON.parse(this.response);

                appdiv.hsLng = result[0].lon;
                appdiv.hsLat = result[0].lat;
                appdiv.finishAddingHotspotSend();
              } else if (this.readyState == 4 && this.status == 404){
                  alert("Could not find the location of the hotspot. Please change the address and try again.");
              }
            };

            var address = [this.hsStreetEdit,this.hsZipEdit,this.hsCityEdit,this.hsCountryEdit].reduce((acc,val) => acc = acc + val + ", ", "");
            address = address.slice(0,address.length-2);

            xhttp.open("GET","https://us1.locationiq.com/v1/search.php?key=pk.4e874fdbdccdbc06c6bf9becc4b7fadf&format=json&q=" + encodeURIComponent(address), true);

            xhttp.send();

        },

        finishAddingHotspotSend: function(){
            var obj = {
                id: hotspotData.length+1,
                creator: this.user,
                street: this.hsStreetEdit,
                zip: this.hsZipEdit,
                city: this.hsCityEdit,
                country: this.hsCountryEdit,
                lng: this.hsLng,
                lat: this.hsLat
            };
            hotspotData.unshift(obj);
            this.hotspotSearch = "a";
            this.hotspotSearch = "";
            this.isAddingHot = false;
            this.editingDivOpen = false;

            //Code to send the new hotspot to the server.
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                }
            };


            xhttp.open("POST","/users/add-hotspot.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify(obj));
        },

        deleteHotspot: function(){
            this.editingDivOpen = false;
            var idDelete = this.hotspotDatabase[this.editingMenuIndex].id;
            var indexDelete = 0;
            hotspotData.forEach( function(hotspot,index){
              if (hotspot.id === idDelete){
                  indexDelete = index;
              }
            });

            hotspotData.splice(indexDelete,1);


            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                }
            };


            xhttp.open("POST","/users/delete-hotspot.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({id: idDelete}));

            this.hotspotSearch = "a";
            this.hotspotSearch = "";
        },

        deleteVenue: function(){
            this.editingDivOpen = false;
            var idDelete = this.venueDatabase[this.editingMenuIndex].email;
            var indexDelete = 0;
            venueData.forEach( function(venue,index){
              if (venue.email === idDelete){
                  indexDelete = index;
              }
            });

            venueData.splice(indexDelete,1);


            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                }
            };


            xhttp.open("POST","/users/delete-venue.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({email: idDelete}));

            this.venueSearch = "a";
            this.venueSearch = "";
        },

        deleteUser: function(){
            this.editingDivOpen = false;
            var idDelete = this.userDatabase[this.editingMenuIndex].email;
            var indexDelete = 0;
            userData.forEach( function(user,index){
              if (user.email === idDelete){
                  indexDelete = index;
              }
            });

            userData.splice(indexDelete,1);


            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                }
            };


            xhttp.open("POST","/users/delete-user.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({email: idDelete}));

            this.userSearch = "a";
            this.userSearch = "";
        },

        signUpAdmin: function(){
            if(this.adminSUpassword !== this.adminSUpassword){
                this.adminSUmessage = "Passwords must match.";
                return;
            }
            var obj = {
                firstName: this.adminSUfirstName,
                lastName: this.adminSUlastName,
                phoneNum: this.adminSUphoneNum,
                email: this.adminSUemail,
                password: this.adminSUpassword
            };

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    appdiv.adminSUmessage = "Successfully signed up!";
                } else if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                } else if (this.readyState == 4 && this.status == 400){
                    appdiv.adminSUmessage = "This admin already exists.";
                }
            };


            xhttp.open("POST","/users/admin-signup.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify(obj));

        }

    }
});


function setup(){
    if(appdiv.accountType === "user"){
        appdiv.weeklyNotifications = Boolean(appdiv.session.weeklyHotspotNoti);
        appdiv.visitedHotspotNoti = Boolean(appdiv.session.venueHotspotNoti);

        makeRequest("GET","users/"+appdiv.user+"/checkInHistory.ajax",{},function(result){
            var res = JSON.parse(result);
            res.forEach(function(row){
                var temp = new Date(row.time);
                row.time = temp.toLocaleString();
            });
            userHistoryFull = res;
            //Trigger the function for userHistory computed property.
            var temp = appdiv.searchTerm;
            appdiv.searchTerm = "";
            appdiv.searchTerm = temp;

        });

    } else if(appdiv.accountType === "venue"){
        makeRequest("GET","users/venueAddress.ajax",{},function(result){
            var res = JSON.parse(result)[0];

            Object.keys(res).forEach(key => appdiv[key] = res[key]);
        });

        makeRequest("GET","users/venueHistory.ajax",{},function(result){
            var res = JSON.parse(result);
            res.forEach(function(row){
                var temp = new Date(row.time);
                row.time = temp.toLocaleString();
            });
            venueHistoryFull = res;
        });


    } else if(appdiv.accountType === "admin"){

        makeRequest("GET","hotspots.ajax",{},function(result){
            var res = JSON.parse(result);
            hotspotData = res;
        });

        makeRequest("GET","users/venue-details.ajax",{},function(result){
            var res = JSON.parse(result);
            venueData = res;
        });

        makeRequest("GET","users/user-details.ajax",{},function(result){
            var res = JSON.parse(result);
            userData = res;
        });
    }
}


makeRequest("GET","users/details.ajax",{},function(result){
    appdiv.session = JSON.parse(result);
    Object.keys(appdiv.session).forEach((val) => appdiv[val] = appdiv.session[val]);

    setup();
});
