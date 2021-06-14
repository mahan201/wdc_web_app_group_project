/*
This javascript file contacts functions and code that is
used by nearly all pages on our website.
*/

//A function to simply making requests to the server.
//Streamlines request making.
function makeRequest(method,route, headers, onSuccess){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
           onSuccess(this.response);
        }
    };

    if(Object.keys(headers).length > 0){
        route += "?";
        for(const property in headers){
            route += property + "=" + headers[property] + "&";
        }
        route = route.slice(0,route.length-1);
    }

    xhttp.open(method,route, true);

    xhttp.send();
}

//Since you can logout from nearly every page on the website, we include this function in this file.
function logout(){
    if(appdiv.session.OpenID){
        var auth2 = gapi.auth2.getAuthInstance();
          auth2.signOut().then(function () {
            console.log('User signed out.');
          });
    }


      makeRequest("GET","/users/logout.ajax",{},function(res){
          window.location.replace('/');
      });
}

//In order to call gapi.auth2.getAuthInstance() in logout(), we need to load auth2 from the gapi.
//This is loaded by the sign in button but since not every page has the sign in button
//we manually load it
function onLoad() {
      gapi.load('auth2', function() {
        gapi.auth2.init();
      });
    }

