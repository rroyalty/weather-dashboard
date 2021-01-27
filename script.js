$(document).ready(function() {

    // Luxon
    const dt=luxon.DateTime;

    // Weather API
    const weatherKey = "dc35c92a93f41b8b8d2a3cb13f096b47"
    const weatherURL = "https://api.openweathermap.org/data/2.5/onecall?"     // lat={lat}&lon={lon}&exclude={part}&appid={API key}

    // Geolocation API
    const citiesKey = "&key=6fa477f4e23440d282eae33f025aa4c9"
    const citiesURL = "https://api.opencagedata.com/geocode/v1/json?q="  // PLACENAME&key=YOUR-API-KEY

    // Define Current latitude, longitude, city.
    let currentLat = "NAN"
    let currentLng = "NAN"
    let currentCity = ""

    // JavaScript geolocation opions.
    let geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    let searchCard = $(".searchHistoryC");
    let searchHistory = $(".searchHistory");
    let searchBar = $("#citySearch");

    // Initialize
    init();

    // Initialize Fucntion
    function init() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions) 
        } else {alert("Location could not be retrieved.")};

        // Start Clock
        startClock();
    };

    // Function Start Clock
    function startClock() {
        let dtInit = dt.local().weekdayLong + ", " + dt.local().toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        let dtDisplay = $("#currentDay");

        setInterval (function() {
            dtDisplay.text(dtInit);
            dtInit = dt.local().weekdayLong  + ", " + dt.local().plus({seconds: 1}).toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        }, 1000);
    };

    // Generate Dashboard Weather Reports
    function setDashboard(workingLat, workingLng) {
        currentCity = $.get( citiesURL + workingLat + "," + workingLng + citiesKey + "&no_annotations=1", function(data) {
            let ctComponents = data.results[0].components
            let workingTown = function(x) {
                switch(false) {
                    case !x.city:
                        return x.city
                    break;
                    case !x.town:
                        return x.town
                    break;
                    case !x.village:
                        return x.village
                    break;
                    default:
                        return "East Bumfuck"
                }
            } 
            let ctInit = workingTown(ctComponents) + ", " + ctComponents.state_code + ", " + ctComponents.country;
            let ctDisplay = $("#currentCity");
            ctDisplay.text(ctInit);

            $.get( citiesURL + ctInit + citiesKey + "&no_annotations=1", function(workingCity) {
                $.get( weatherURL + "lat=" + workingCity.results[0].geometry.lat + "&lon="  + workingCity.results[0].geometry.lng + "&exclude=hourly,minutely&appid=" + weatherKey, function(workingWeather) {

                    let wBackground = $("#todayWeatherC");
                    let wImage = $("#workingImage");
                    let wOutlook = $("#workingOutlook");
                    let wTemp = $("#workingTemp");
                    let wHumid = $("#workingHumid");
                    let wWind= $("#workingWind");
                    let wUV= $("#workingUV");

                    switch(true) {
                        case workingWeather.current.weather[0].main == "Rain" || workingWeather.current.weather[0].main == "Drizzle" :
                            $(wBackground).addClass("rainImg");
                        break;
                        case workingWeather.current.weather[0].main == "Snow":
                            $(wBackground).addClass("snowImg");
                        break;
                        case workingWeather.current.weather[0].main == "Clear":
                            $(wBackground).addClass("sunImg");
                        break;
                        case workingWeather.current.weather[0].main == "Thunderstorm":
                            $(wBackground).addClass("thunderImg");
                        break;
                        case workingWeather.current.weather[0].main == "Clouds":
                            $(wBackground).addClass("cloudImg");
                        break;
                        default:
                            $(wBackground).addClass("fogImg");
                    }

                    switch(true) {
                        case workingWeather.current.uvi < 3:
                            $(wUV).addClass("uvGood");
                        break;
                        case workingWeather.current.uvi < 6:
                            $(wUV).addClass("uvOK");
                        break;
                        case workingWeather.current.uvi < 8:
                            $(wUV).addClass("uvBad");
                        break;
                        case workingWeather.current.uvi < 11:
                            $(wUV).addClass("uvVBad");
                        break;
                        default:
                            $(wUV).addClass("uvXTreme");
                    }

                    $(wImage).attr("src", "http://openweathermap.org/img/wn/" + workingWeather.current.weather[0].icon + ".png");
                    $(wImage).attr("alt", workingWeather.current.weather[0].description);

                    $(wOutlook).text("Outlook: " + workingWeather.current.weather[0].description); 
                    wTemp.text("Temperature: " + convertKelvin(workingWeather.current.temp) + "°F"
                    );
                    wHumid.text("Humidity: " + workingWeather.current.humidity + "%");
                    wWind.text("Wind Speed: " + workingWeather.current.wind_speed +" MPH");
                    wUV.text("UV Index: " + workingWeather.current.uvi);

                    let dBackground = $(".weatherC");
                    let dImage = $(".dayImage");
                    let dOutlook = $(".dayOutlook");
                    let dDate = $(".dayDate");
                    let dTemp = $(".dayTemp");
                    let dHumid = $(".dayHumid");

                    for(let i = 0; i <= 4; i++) {
                        $(dImage[i]).attr("src", "http://openweathermap.org/img/wn/" + workingWeather.daily[i].weather[0].icon + ".png");
                        $(dImage[i]).attr("alt", workingWeather.daily[i].weather[0].description);
                        $(dOutlook[i]).text("O: " + workingWeather.daily[i].weather[0].description); 
                        $(dDate[i]).text(dt.local().plus({days: (i+1)}).toLocaleString(dt.DATE_MED));
                        $(dTemp[i]).text("T: " + convertKelvin(workingWeather.daily[i].temp.day) + "°F");
                        $(dHumid[i]).text("H: " + workingWeather.daily[i].humidity +"%");
                        
                        console.log(workingWeather.daily[i].weather[0].main);

                        switch(true) {
                            case workingWeather.daily[i].weather[0].main == "Rain" || workingWeather.daily[i].weather[0].main == "Drizzle" :
                                $(dBackground[i]).addClass("rainImg");
                            break;
                            case workingWeather.daily[i].weather[0].main == "Snow":
                                $(dBackground[i]).addClass("snowImg");
                            break;
                            case workingWeather.daily[i].weather[0].main == "Clear":
                                $(dBackground[i]).addClass("sunImg");
                            break;
                            case workingWeather.daily[i].weather[0].main == "Thunderstorm":
                                $(dBackground[i]).addClass("thunderImg");
                            break;
                            case workingWeather.daily[i].weather[0].main == "Clouds":
                                $(dBackground[i]).addClass("cloudImg");
                            break;
                            default:
                                $(dBackground[i]).addClass("fogImg");
                        }
                    }

                    console.log(workingWeather);
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

        setDashboard(currentLat, currentLng);
    };

    function geoError(err) {
        console.log(err);
    };

    $(".searchButt").on('click', function(event) {
        event.preventDefault();
        let searchVal = $(searchBar).val();
        if (searchVal === "") return;

        console.log(citiesURL + searchVal + citiesKey);
        $.get(citiesURL + searchVal + citiesKey, function(workingCity) {
            let searchLat = workingCity.results[0].geometry.lat;
            let searchLng = workingCity.results[0].geometry.lng;
            localStorage.setItem(searchVal, searchLat + ", " + searchLng);
            $(searchCard).prepend('<p class="searchHistory">' + searchVal + '</p>');
            $(searchHistory[7]).remove();
            searchHistory = $(".searchHistory");

        })
        
    });


});

