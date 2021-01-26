$(document).ready(function() {

    const dt=luxon.DateTime;

    const weatherKey = "dc35c92a93f41b8b8d2a3cb13f096b47"
    const weatherURL = "https://api.openweathermap.org/data/2.5/onecall?"     // lat={lat}&lon={lon}&exclude={part}&appid={API key}

    const citiesKey = "&key=6fa477f4e23440d282eae33f025aa4c9"
    const citiesURL = "https://api.opencagedata.com/geocode/v1/json?q="  // PLACENAME&key=YOUR-API-KEY

    let currentLat = "NAN"
    let currentLng = "NAN"
    let currentCity = ""

    let geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    init();

    function init() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions) 
        } else {alert("Location could not be retrieved.")};

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

    function setDashboard(workingLat, workingLng) {
        currentCity = $.get( citiesURL + workingLat + "," + workingLng + citiesKey + "&no_annotations=1", function(data) {
            let ctComponents = data.results[0].components
            let workingTown = function(x) {
                if ( !x ) { return "East Bumfuck" }
                else { return x };
            } 
            let ctInit = workingTown(ctComponents.village) + ", " + ctComponents.state_code + ", " + ctComponents.country;
            let ctDisplay = $("#currentCity");
            ctDisplay.text(ctInit);

            $.get( citiesURL + ctInit + citiesKey + "&no_annotations=1", function(workingCity) {
                $.get( weatherURL + "lat=" + workingCity.results[0].geometry.lat + "&lon="  + workingCity.results[0].geometry.lng + "&appid=" + weatherKey, function(workingWeather) {
                    let wTemp = $("#workingTemp");
                    let wHumid = $("#workingHumid");
                    let wWind= $("#workingWind");
                    let wUV= $("#workingUV");

                    wTemp.text("Temperature: " + convertKelvin(workingWeather.current.temp) + "°F"
                    );
                    wHumid.text("Humidity: " + workingWeather.current.humidity + "%");
                    wWind.text("Wind Speed: " + workingWeather.current.wind_speed +" MPH");
                    wUV.text("UV Index: " + workingWeather.current.uvi);

                    let dDate = $(".dayDate");
                    let dTemp = $(".dayTemp");
                    let dHumid = $(".dayHumid");

                    for(let i = 0; i <= 4; i++) {
                        $(dDate[i]).text(dt.local().plus({days: (i+1)}).toLocaleString(dt.DATE_MED));
                        $(dTemp[i]).text("Temperature: " + convertKelvin(workingWeather.daily[i+1].temp.day) + "°F");
                        $(dHumid[i]).text("Humidity: " + workingWeather.daily[i+1].humidity +"%");
                    }
                });
            });
        });
    };

    function convertKelvin(num){
        let kelv = (((num - 273.15) * 9/5) + 32).toFixed(1);
        return kelv;
    };

    function geoSuccess(pos) {
        while(currentLat === "NAN" || currentLng === "NAN") {
            currentLat = pos.coords.latitude;
            currentLng = pos.coords.longitude;
        }

        console.log(currentLat);
        console.log(currentLng);
        
        setDashboard(currentLat, currentLng);
    };

    function geoError(err) {
        console.log(err);
    };

});

