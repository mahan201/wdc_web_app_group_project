
var appdiv = new Vue({
    el: "#app",
    data: {
        email: "",
        password: ""
    },
    methods: {
        logIn: function(){
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                   window.location.replace('/');
                } else if (this.readyState == 4 && this.status == 500){
                    alert("Incorrect email or password!");
                }
            };


            xhttp.open("POST","/users/login.ajax", true);

            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({email: this.email, password: this.password}));
        }
    }
});

function getCodes(){
    //Will be replaced with server code to get a list of valid venue check-in codes.
    appdiv.codes = ["ABC123","XYZ456","JQK789"];
}

getCodes();