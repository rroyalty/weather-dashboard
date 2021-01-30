# Weather Dashboard

## Description 

The following is the README for the project weather-dashboard, which is the repository created for the sixth homework assignment of the UNH Bootcamp course. For the assignment, I was tasked with creating a dashboard that made API requests to an open weather API in order to present the user with current weather conditions of whichever city that they searched and also a five day forecast of that city. Previous city searches are to be saved in local storage for future use, if desired.

![Example given:](https://github.com/rroyalty/weather-dashboard/blob/main/assets/images/examples/06-server-side-apis-homework-demo.png)  

This homework wasn't so bad, I don't seem to be having very much trouble with understanding API calls. I actually spent more time on the CSS and HTML, I think, than I did the javascript for this one.

A couple notable changes I did as compared to the instructions:

Instructions said:
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast

My homework does:
WHEN I open the weather dashboard
THEN I am presented with the local forecast
WHEN The local forecast fails to display
THEN I am presented with the last searched city forecast
WHEN The local forecast fails to display AND there are no previous searches
THEN I am presented with the weather for Washington D.C.


In both the current weather and 5 day forecast I also included an "Outlook" row, since the API that I am getting from had a variety of different 'cloudy', 'rainy', etc, conditions.

## Installation

The project is a website; no installation necessary.

## Usage 

Below are the links associated with this project.  

![Website] https://rroyalty.github.io/weather-dashboard/  
![Repository] https://github.com/rroyalty/weather-dashboard  

## Screenshots of Project

![Dashboard:](https://github.com/rroyalty/weather-dashboard/blob/main/assets/images/examples/weather-screenshot.jpg)

## Credits and Resources

![ScottByers] https://github.com/switch120  
![MikeFearnley] https://michaelfearnley.com/  
![StackOverflow] https://stackoverflow.com/  
![w3schools] https://www.w3schools.com/  
![Bootstrap5.0] https://getbootstrap.com/docs/5.0/getting-started/introduction/  
![JQuery] https://jquery.com/  
![Luxon] https://moment.github.io/luxon/  
![OpenWeatherMap] https://openweathermap.org/api  
![OpenCageData] https://opencagedata.com/api  

## Badges

![Ryan](https://img.shields.io/badge/Ryan's%20Badge-Hello-green)
