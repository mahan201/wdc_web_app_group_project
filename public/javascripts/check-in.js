Vue.use(Dropdown);

var appdiv = new Vue({
    el: "#app",
    data: {
        session: {},
        showLogout: false,


        codes: [],
        codeSearchTerm: "",
        failed: false,
        passed: false,


        code: "",
        email: "",
        fName: "",
        lName: "",
        pNum: "",
        IDNum: ""
    },
    computed: {
        signedIn: function(){
            return this.session.loggedIn;
        },
        accountType: function(){
            return this.session.accountType;
        },
        firstName: function(){
            return this.session.firstName;
        },

        codesDropDown: function(){
            var temp = [];
            this.codes.forEach(val => temp.push({name: val.checkInCode, id: val.checkInCode}));
            return temp;
        }
    },
    methods: {
        onCodeSelect: function(selection){
                this.code = selection.name;
        },

        filteredCodes: function(term){
            // var temp = [];
            // this.codes2.forEach(val => (val.name.includes(term)) && temp.push({name: val.checkInCode, id: val.checkInCode}));
            // return temp;
        },

        checkIn: function(event){
            var valid = false;
            var venueEmail = "";
            this.codes.forEach(function(venue) {
                if(venue.checkInCode === appdiv.code){
                  valid = true;
                  venueEmail = venue.email;
                }
            });
            if(valid){

                var details = {venue: venueEmail};

                if(!this.signedIn || this.accountType !== "user"){
                    details.email = this.email;
                    details.firstName = this.fName;
                    details.lastName = this.lName;
                    details.phoneNum = this.pNum;
                    details.passport = this.IDNum;
                }

                //Code to send the data to the server.
                xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200){
                       appdiv.passed = true;
                       appdiv.failed = false;
                    } else if (this.readyState == 4 && this.status == 500){
                        this.failed = true;
                        this.passed = false;
                    }
                };

                xhttp.open("POST","/users/check-in.ajax", true);

                xhttp.setRequestHeader("Content-type","application/json");

                xhttp.send(JSON.stringify(details));
            } else {
                this.failed = true;
                this.passed = false;
            }

        }
    }
});

makeRequest("GET","users/details.ajax",{},function(result){
    appdiv.session = JSON.parse(result);
});

makeRequest("GET","users/check-in-codes.ajax",{},function(result){
        appdiv.codes = JSON.parse(result);
    });
