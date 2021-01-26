$(document).ready(function() {

    const dt=luxon.DateTime;

    const weatherKey = "dc35c92a93f41b8b8d2a3cb13f096b47"
    const weatherURL = "https://api.openweathermap.org/data/2.5/onecall?"     // lat={lat}&lon={lon}&exclude={part}&appid={API key}

    const citiesKey = "&key=6fa477f4e23440d282eae33f025aa4c9"
    const citiesURL = "https://api.opencagedata.com/geocode/v1/json?q="  // q=PLACENAME&key=YOUR-API-KEY

    let currentLat = "NAN"
    let currentLng = "NAN"
    let currentCity = ""

    init();


 
    let weatherData = $.get( citiesURL + "Boston" + citiesKey + "&no_annotations=1", function(data) {
        $.get( weatherURL + "lat=" + data.results[0].geometry.lat + "&lon="  + data.results[0].geometry.lng + "&appid=" + weatherKey, function(data2) {
            return data2;
        });
    });

    function init() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                while(currentLat === "NAN" || currentLng === "NAN") {
                    currentLat = position.coords.latitude;
                    currentLng = position.coords.longitude;
                }
                
                currentCity = $.get( citiesURL + currentLat + "," + currentLng + citiesKey + "&no_annotations=1", function(data) {
                    let ctComponents = data.results[0].components
                    let ctInit = ctComponents.village + ", " + ctComponents.state_code + ", " + ctComponents.country;
                    let ctDisplay = $("#currentCity");
                    ctDisplay.text(ctInit);
                });

            }); } else {alert("Location could not be retrieved.")};

        startClock();
    };

    function startClock() {
        let dtInit = dt.local().weekdayLong + ", " + dt.local().toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        let dtDisplay = $("#currentDay");

        setInterval (function() {
            dtDisplay.text(dtInit);
            dtInit = dt.local().weekdayLong  + ", " + dt.local().plus({seconds: 1}).toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        }, 1000);
    };

});

