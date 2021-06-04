

var appdiv = new Vue({
    el: "#app",
    data: {
        signedIn: false,
        codes: [],
        failed: false,
        passed: false,
        code: "",
        email: "",
        fName: "",
        lName: "",
        pNum: "",
        IDNum: ""
    },
    methods: {
        checkIn: function(event){
            if(this.codes.includes(this.code)){
                //Code to send the data to the server.
                xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200){
                       appdiv.passed = true;
                       appdiv.failed = false;
                    } else if (this.readyState == 4 && this.status == 500){
                        alert("Internal server issue. Please try again later!");
                    }
                };

                xhttp.open("POST","/users/check-in.ajax", true);

                xhttp.setRequestHeader("Content-type","application/json");

                xhttp.send(JSON.stringify({
                    venue: "acb@mcd.com",
                    email: this.email,
                    firstName: this.fName,
                    lastName: this.lName,
                    phoneNum: this.pNum,
                    passport: this.IDNum
                }));
            } else {
                this.failed = true;
                this.passed = false;
            }

        }
    }
});

function getCodes(){
    //Will be replaced with server code to get a list of valid venue check-in codes.
    appdiv.codes = ["ABC123","XYZ456","JQK789"];
}

getCodes();