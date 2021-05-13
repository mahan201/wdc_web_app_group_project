
var codes = ["ABC123","XYZ456","JQK789"]

var appdiv = new Vue({
    el: "#app",
    data: {
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
            if(codes.includes(this.code)){
                if(this.fname !== "" && this.lname !== "" && this.pNum !== "" && this.IDNum !== ""){
                    this.passed = true;
                    this.failed = false;
                    return;
                }
            }
            this.failed = true;
            this.passed = false;
        }
    }
})