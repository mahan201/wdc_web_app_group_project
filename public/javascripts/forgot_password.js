

var appdiv = new Vue({
    el: "#app",
    data: {
        email: "",
        password: "",
        confirmPassword: "",
        resetCode: "",
        invalid: "hidden",
        invalidMessage: "",
        showReset: false,

        showRequirements: "none"

    },
    computed: {
        emailValid: function(){
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email);
        },
        lowerValid: function(){
          return /[a-z]/g.test(this.password);
        },
        capitalValid: function(){
          return /[A-Z]/g.test(this.password);
        },
        numberValid: function(){
          return /[0-9]/g.test(this.password);
        },
        lengthValid: function(){
          return (this.password.length >= 8);
        }
    },
    methods: {
        sendResetCode: function(){

          var xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function(){
              if(this.readyState == 4 && this.status == 200){
                appdiv.showReset = true;
              } else if (this.readyState == 4 && this.status == 401){
                appdiv.invalidMessage = "This user does not exist";
                appdiv.invalid = "visible";
              }
          };

          xhttp.open("POST","/users/sendResetCode.ajax", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send(JSON.stringify({
            email: this.email
          }));
        },

        resetPassword: function(){
          if(this.password !== this.confirmPassword){
                this.invalidMessage = "Passwords do not match.";
                this.invalid = "visible";
                return;
          }

          var xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function(){
              if(this.readyState == 4 && this.status == 200){
                 window.location.replace('/login.html');
              } else if (this.readyState == 4 && this.status == 401){
                this.invalidMessage = "Incorrect Validation Code.";
                this.invalid = "visible";
              }
          };

          xhttp.open("POST","/users/resetPassword.ajax", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send(JSON.stringify({
            email: this.email,
            resetCode: this.resetCode,
            password: this.password
          }));
        }
    }
});




