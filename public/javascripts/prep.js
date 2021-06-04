function makeRequest(method,route, headers, onSuccess){
    xhttp = new XMLHttpRequest();

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


