$(document).ready(function() {

    const weatherURL = "https://api.openweathermap.org/data/2.5/onecall?"
    const weatherKey = "dc35c92a93f41b8b8d2a3cb13f096b47"
    // lat={lat}&lon={lon}&exclude={part}&appid={API key}

    const citiesURL = "https://api.opencagedata.com/geocode/v1/json?q="
    const citiesKey = "6fa477f4e23440d282eae33f025aa4c9"
    // q=PLACENAME&key=YOUR-API-KEY
 
    let weatherData = $.get( citiesURL + "Boston&key=" + citiesKey + "&no_annotations=1", function(data) {
        $.get( weatherURL + "lat=" + data.results[0].geometry.lat + "&lon="  + data.results[0].geometry.lng + "&appid=" + weatherKey, function(data2) {
            return data2;
        })
    })

});

