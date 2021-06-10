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

function logout(){
    var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });

      makeRequest("GET","/users/logout.ajax",{},function(res){
          window.location.replace('/');
      });
}


function onLoad() {
      gapi.load('auth2', function() {
        gapi.auth2.init();
      });
    }

