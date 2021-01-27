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

    // Initialize Function
    function init() {
        // If navigator.geolocation exists, attempt to find local weather.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions) 
          // If it does not, attempt to display last searched for item.
        } else if ( $(searchHistory[0]).text() !== "" ) {
            searchCitybyName($(searchHistory[0]).text()) 
            // If no previous searches exist, show weather for Washington DC.
            } else {
                searchCitybyName("Washington DC, USA")
            };

        // Populate previous searches.
        for ( let i = 0; i < 8; i++) {
            if (JSON.parse(localStorage.getItem("weatherDash" + i)) !== null) {
                let retObj = JSON.parse(localStorage.getItem("weatherDash" + i));
                $(searchHistory[i]).text(retObj.value); 
            }
        }

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
        // API call gets name of city at Latitude and Longitude provided.
        currentCity = $.get( citiesURL + workingLat + "," + workingLng + citiesKey + "&no_annotations=1", function(data) {
            let ctComponents = data.results[0].components
            // Checks size of city.
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
            // Set variable to populate title of Current Weather Card
            let ctInit = workingTown(ctComponents) + ", " + ctComponents.state_code + ", " + ctComponents.country;

            // If no 'state' exists, remove it.
            if (!ctComponents.state_code) { ctInit = workingTown(ctComponents) + ", " + ctComponents.country;  }

            // Populates card title.
            let ctDisplay = $("#currentCity");
            ctDisplay.text(ctInit);

            // API call returns weather of the City Name returned via the previous Location API call.
            $.get( citiesURL + ctInit + citiesKey + "&no_annotations=1", function(workingCity) {
                $.get( weatherURL + "lat=" + workingCity.results[0].geometry.lat + "&lon="  + workingCity.results[0].geometry.lng + "&exclude=hourly,minutely&appid=" + weatherKey, function(workingWeather) {
                    
                    // HTML Display Element Collections.
                    let wBackground = $("#todayWeatherC");
                    let wImage = $("#workingImage");
                    let wOutlook = $("#workingOutlook");
                    let wTemp = $("#workingTemp");
                    let wHumid = $("#workingHumid");
                    let wWind= $("#workingWind");
                    let wUV= $("#workingUV");

                    // Checks current weather conditions and adds a background to the card.
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

                    // Checks current UV rating and changes the color of the text depending on the rating.
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

                    // Sets the <img> element icon next to the Current Weather header based on the API call.
                    $(wImage).attr("src", "http://openweathermap.org/img/wn/" + workingWeather.current.weather[0].icon + ".png");
                    // Sets the attribute of the icon.
                    $(wImage).attr("alt", workingWeather.current.weather[0].description);

                    // Populates current weather data based on API call.
                    $(wOutlook).text("Outlook: " + workingWeather.current.weather[0].description); 
                    wTemp.text("Temperature: " + convertKelvin(workingWeather.current.temp) + "°F"
                    );
                    wHumid.text("Humidity: " + workingWeather.current.humidity + "%");
                    wWind.text("Wind Speed: " + workingWeather.current.wind_speed +" MPH");
                    wUV.text("UV Index: " + workingWeather.current.uvi);

                    // 5 Day Forecast HTML display elements.
                    let dBackground = $(".weatherC");
                    let dImage = $(".dayImage");
                    let dOutlook = $(".dayOutlook");
                    let dDate = $(".dayDate");
                    let dTemp = $(".dayTemp");
                    let dHumid = $(".dayHumid");
                    
                    // Populates the 5 day forecast cards.
                    for(let i = 0; i <= 4; i++) {
                        $(dImage[i]).attr("src", "http://openweathermap.org/img/wn/" + workingWeather.daily[i].weather[0].icon + ".png");
                        $(dImage[i]).attr("alt", workingWeather.daily[i].weather[0].description);
                        $(dOutlook[i]).text("O: " + workingWeather.daily[i].weather[0].description); 
                        $(dDate[i]).text(dt.local().plus({days: (i+1)}).toLocaleString(dt.DATE_MED));
                        $(dTemp[i]).text("T: " + convertKelvin(workingWeather.daily[i].temp.day) + "°F");
                        $(dHumid[i]).text("H: " + workingWeather.daily[i].humidity +"%");
                        
                        // Checks the iteration day's weather and assigns a background.
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
                });
            });
        });
    };

    // Converts Kelvin to Farenheit
    function convertKelvin(num){
        let kelv = (((num - 273.15) * 9/5) + 32).toFixed(1);
        return kelv;
    };

    // On successful geo ping, sets the dashboard based on local latitude and longitude.
    function geoSuccess(pos) {
        while(currentLat === "NAN" || currentLng === "NAN") {
            currentLat = pos.coords.latitude;
            currentLng = pos.coords.longitude;
        }

        setDashboard(currentLat, currentLng);
    };

    // On geo ping error, attempt to search again for last searched city.
    function geoError() {
        if ( $(searchHistory[0]).text() !== "" ) {
            searchCitybyName($(searchHistory[0]).text()) 
            // If no previous searches exist, show weather for Washington DC.
            } else {
                searchCitybyName("Washington DC, USA")
            };
    };

    // On Search button click, search for weather conditions and store the search item.
    $(".searchButt").on('click', function() {
        let searchVal = $(searchBar).val();
        if (searchVal === "") return;

        // Bumps the stored values up by one iteration.
        for(let i = 7; i > 0; i--) {
            if (JSON.parse(localStorage.getItem("weatherDash" + (i-1)) !== null)) {
                localStorage.setItem("weatherDash" + i, localStorage.getItem("weatherDash"+(i-1)));
        }};

        // Stores the new search in the 0 index.
        let storeObj = {"value":searchVal};
        localStorage.setItem("weatherDash" + 0, JSON.stringify(storeObj));
        $(searchCard).prepend('<p class="searchHistory">' + searchVal + '</p>');

        // Removes the least recent index if searches > 8. (Removes an HTML element regardless if searches exist or not)
        $(searchHistory[7]).remove();
        searchHistory = $(".searchHistory");

        // Populate weather data based on search.
        searchCitybyName(searchVal);
        
    });


    // Searches for weather data off of saved city name.
    $(".searchHistory").on('click', function() { 
        let _this = this;
        searchCitybyName($(_this).text());
    });


    // Searches for weather data of provided city name. Used as a sub function in multiple other functions.
    function searchCitybyName(city) {
        $.get(citiesURL + city + citiesKey, function(workingCity) {
            let searchLat = workingCity.results[0].geometry.lat;
            let searchLng = workingCity.results[0].geometry.lng;
            
            setDashboard(searchLat, searchLng);

        });
    };

});

