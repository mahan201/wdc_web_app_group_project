
var appdiv = new Vue({
    el: "#app",
    data: {
        email: "",
        password: "",
        invalid: "hidden"
    },
    methods: {
        logIn: function(){
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                   window.location.replace('/');
                } else if (this.readyState == 4 && this.status == 500){
                    alert("Internal Server Error. Please try again later.");
                } else if (this.readyState == 4 && this.status == 401){
                    console.log("FAILED LOGIN");
                    appdiv.invalid = "visible";
                }
            };


            xhttp.open("POST","/users/login.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({email: this.email, password: this.password}));
        }
    }
});