

var appdiv = new Vue({
    el: "#app",
    data: {
        accountType: "user",
        selectedTab: 0
    },
    computed: {
        tabs: function (){
            return ["Profile","Hotspots","Venues","Users","Signup an Admin","User History","Have I been to a Hotspot?","Email Subscription","Venue History","Venue Check-In Code"];
        },
        tabsBool: function(){
            var temp = [];
            var i;
            this.tabs.forEach(_ => temp.push(false));
            temp[this.selectedTab] = true;
            console.log(temp);
            return temp;
        }
    },
    methods: {

    }
});
