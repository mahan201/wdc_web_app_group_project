

var appdiv = new Vue({
    el: "#app",
    data: {
        signedIn: true,
        codes: [],
        failed: false,
        passed: false,
        code: "",
        fName: "",
        lName: "",
        pNum: "",
        IDNum: ""
    },
    methods: {
        checkIn: function(event){
            if(this.codes.includes(this.code)){

                this.passed = true;
                this.failed = false;
                return;
            }
            this.failed = true;
            this.passed = false;
        }
    }
});

function getCodes(){
    //Will be replaced with server code to get a list of valid venue check-in codes.
    appdiv.codes = ["ABC123","XYZ456","JQK789"];
}

getCodes();