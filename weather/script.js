var storm = false;
var update_timer = null;
var api_key = 'a516be324e3e6bbbbecbd08879031c90';

var localization = {};
localization.wind_text = [ "wind speed&nbsp;(Bft.)&nbsp;", "Windstärke&nbsp;(Bft.)&nbsp;" ];
localization.humid_text = [ "Humidity&nbsp;", "Luftfeuchtigkeit&nbsp;" ];
localization.title = [ "Weather Widget", "Wetterstation" ];
localization.owm = [ "Weather data retrieved from ", "Wetterdaten von " ];
localization.owm_link = "<a href=\"http://openweathermap.org\" target=\"_blank\" title=\"openweathermap.org\">OpenWeatherMap</a>.";

var settings = {language:"English", units:"Metric", interval:900, use_coord:true, update_coord:false, show_switch:true, show_thermo:false};

var geodata = {city:"Berlin", ccode:"DE", latitude:"52.5", longitude:"13.4"};

function getLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(parsePosition, showError, {timeout:5000});
    }
    else
    {
        alert( "Geolocation is not supported by this browser." );
        console.warn( "Geolocation is not supported by this browser." );
        settings.use_coord = false;
        document.getElementById('city').readOnly = false;
        document.getElementById('city-btn').removeAttribute('disabled');
        document.getElementById('geo-btn').setAttribute('disabled', '');
        return false;
    }
}

function parsePosition(position) 
{
    geodata.latitude = Round(position.coords.latitude, 2);
    geodata.longitude = Round(position.coords.longitude, 2);
    setCookie('lat', geodata.latitude, 2);
    setCookie('lon', geodata.longitude, 2);
    getCityName();
    return position;
}

function showError(error)
{
    settings.use_coord = false;
    switch(error.code)
    {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            console.warn("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            console.warn("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            console.warn("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            console.warn("An unknown error occurred.");
            break;
        default:
            alert("An unknown error occurred.");
            console.warn("An unknown error occurred.");
            break;
    }
}

function getWeatherData()
{
    console.log("getWeatherData");

    if ( settings.update_coord )
    {
        getLocation();
    }

    getSettings();

    var xmlhttp = new XMLHttpRequest();
    var url = "http://api.openweathermap.org/data/2.5/weather?";
    if (settings.use_coord)
    {
        url += "lat=";
        url += geodata.latitude;
        url += "&lon=";
        url += geodata.longitude;
    }
    else
    {
        url += "&q=";
        url += geodata.city;
        url += ",";
        url += geodata.ccode;
    }
    url += ("&appid=" + api_key);
    url += "&units=metric&mode=json";
    url += ("&lang=" + lcode);
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var myArr = JSON.parse(xmlhttp.responseText);
            parseData(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function parseData(arr)
{
    var icon_source = arr["weather"][0]["icon"];
    var icon = new Image();
    icon.src = "http://openweathermap.org/img/w/" + icon_source + ".png" ;
    document.getElementById("icon").src = icon.src;
    var loc = arr["name"];
    geodata.city = loc;
    document.getElementById("location").innerHTML = loc;
    // console.log(loc);
    geodata.ccode = arr["sys"]["country"];
    document.getElementById("country_code").innerHTML = geodata.ccode;
    document.getElementById("country").value = geodata.ccode;
    document.getElementById("city").value = geodata.city;
    var temperature = Round(parseFloat(arr["main"]["temp"]), 1);
    if (settings.units == "Metric")
    {
        document.getElementById("temperature").innerHTML = temperature;
        document.getElementById("temperature").innerHTML += "&nbsp;&deg;C";
    }
    else
    {
        document.getElementById("temperature").innerHTML = celsiusToFahrenheit(temperature);
        document.getElementById("temperature").innerHTML += "&nbsp;&deg;F";
    }
    // console.log(temperature);
    var description = arr["weather"][0]["description"];
    document.getElementById("description").innerHTML = description;
    // console.log(description);
    var humidity = arr["main"]["humidity"];
    if (settings.language == "English")
    {
        document.getElementById("humidity").innerHTML = localization.humid_text[0];
        document.getElementById("heading").innerHTML = localization.title[0];
    }
    else
    {
        document.getElementById("humidity").innerHTML = localization.humid_text[1];
        document.getElementById("heading").innerHTML = localization.title[1];
    }
    document.getElementById("humidity").innerHTML += humidity + "&nbsp;%";
    var windspeed = arr["wind"]["speed"];
    if (settings.language == "English")
    {
        document.getElementById("wind").innerHTML = localization.wind_text[0];
    }
    else
    {
        document.getElementById("wind").innerHTML = localization.wind_text[1];
    }
    document.getElementById("wind").innerHTML += mpsToBft(windspeed);
    if (storm)
    {
    	  document.getElementById("wind").style.color = "red";
    	  document.getElementById("wind").style.fontWeight = "bolder";
    	  document.getElementById("wind").title = "Very strong wind or storm in your area!";
    }
    else
    {
    	  document.getElementById("wind").style.color = document.querySelector("body").style.color;
    	  document.getElementById("wind").style.fontWeight = "normal";
    	  document.getElementById("wind").title = "";
    }
    if (settings.language == "English")
    {
        document.getElementById("data_source").innerHTML = localization.owm[0];
    }
    else
    {
        document.getElementById("data_source").innerHTML = localization.owm[1];
    }
    document.getElementById("data_source").innerHTML += localization.owm_link;
    if (settings.show_switch === false)
    {
        document.getElementById("switch_container").style.display = 'none';
    }
    else
    {
        document.getElementById("switch_container").style.display = '';
    }
    // TODO thermometer!
}

function fillSettings()
{
    if (settings.units == 'Metric')
    {
        document.getElementById('Metric').checked = true;
        document.getElementById('Imperial').checked = false;
    }
    if (settings.units == 'Imperial')
    {
        document.getElementById('Metric').checked = false;
        document.getElementById('Imperial').checked = true;
    }
    if (settings.language == 'English')
    {
        document.getElementById('English').checked = true;
        document.getElementById('Deutsch').checked = false;
    }
    else
    {
        document.getElementById('Deutsch').checked = true;
        document.getElementById('English').checked = false;
    }
    if (settings.use_coord === true)
    {
        document.getElementById('geo-btn').removeAttribute('disabled');
        document.getElementById('city-btn').setAttribute('disabled', '');
        document.getElementById("city").readOnly = true;
        document.getElementById("city_rb").checked = false;
        document.getElementById("use_geodata").checked = true;
        document.getElementById('check_loc').removeAttribute('disabled');
        document.getElementById('check_loc').checked = settings.update_coord;
    }
    else
    {
        document.getElementById('geo-btn').setAttribute('disabled', '');
        document.getElementById('city-btn').removeAttribute('disabled');
        document.getElementById("city").readOnly = false;
        document.getElementById("city_rb").checked = true;
        document.getElementById("use_geodata").checked = false;
        document.getElementById('check_loc').checked = false;
        document.getElementById('check_loc').setAttribute('disabled', '');
    }
    document.getElementById('interval').value = settings.interval / 60;
    document.getElementById('country').value = geodata.ccode;
    document.getElementById('city').value = geodata.city;
    if (settings.show_switch === true)
    {
        document.getElementById('show_switch').checked = true;
    }
    else
    {
        document.getElementById('show_switch').checked = false;
    }
    if (settings.show_thermo === true)
    {
        document.getElementById('show_thermo').checked = true;
    }
    else
    {
        document.getElementById('show_thermo').checked = false;
    }
    console.log('settings.show_switch: ' + settings.show_switch);
    console.log('settings.show_thermo: ' + settings.show_thermo);
}

function saveSettings()
{
    if (document.getElementById('English').checked)
    {
        settings.language = 'English';
        setCookie('lang', 'English', 2);
    }
    else
    {
        settings.language = 'Deutsch';
        setCookie('lang', 'Deutsch', 2);
    }
    if (document.getElementById('Metric').checked)
    {
        settings.units = 'Metric';
        setCookie('units', 'Metric', 2);
        document.getElementById('celsius_switch').checked = true;
    }
    else
    {
        settings.units = 'Imperial';
        setCookie('units', 'Imperial', 2);
        document.getElementById('celsius_switch').checked = false;
    }
    settings.use_coord = !(document.getElementById('city_rb').checked);
    settings.update_coord = document.getElementById('check_loc').checked;
    settings.show_switch = document.getElementById('show_switch').checked;
    settings.show_thermo = document.getElementById('show_thermo').checked;
    setCookie('show_switch', settings.show_switch, 2);
    setCookie('show_thermo', settings.show_thermo, 2);
    if (settings.show_switch === false)
    {
        document.getElementById('switch_container').style.display = 'none';
    }
    else
    {
        document.getElementById('switch_container').style.display = '';
    }
    console.log('use_coord =' + settings.use_coord);
    geodata.ccode = document.getElementById('country').value;
    geodata.city = document.getElementById('city').value;
    setCookie('ccode', geodata.ccode, 2);
    setCookie('city', geodata.city, 2);
    var interval = document.getElementById('interval').value;
    settings.interval = interval * 60;
    setCookie('interval', settings.interval, 2);
    if (interval > 0)
    {
        update_timer = setInterval(getWeatherData, settings.interval * 1000);
    }
    else if (update_timer)
    {
    	  clearInterval(update_timer);
    }
    getWeatherData();
}

function toggleCelsiusBtn()
{
    var bool = document.getElementById('celsius_switch').checked;
    console.log(bool);
    if (bool === true)
    {
        settings.units = 'Metric';
        setCookie('units', 'Metric', 2);
	  var tmp = document.getElementById('temperature').innerHTML;
	  console.log(tmp);
	  tmp = tmp.replace(new RegExp('\s*°[CF]$'), '');
	  tmp = parseFloat(tmp);
	  document.getElementById('temperature').innerHTML = fahrenheitToCelsius(tmp).toString() + '&nbsp;&deg;C';
    }
    else
    {
        settings.units = 'Imperial';
        setCookie('units', 'Imperial', 2);
	  var tmp = document.getElementById('temperature').innerHTML;
	  tmp = tmp.replace(new RegExp('\s*°[CF]$'), '');
	  tmp = parseFloat(tmp);
	  document.getElementById('temperature').innerHTML = celsiusToFahrenheit(tmp).toString() + '&nbsp;&deg;F';
    }
}

function toggleCityRb()
{
    var bool = document.getElementById('city_rb').checked;
    console.log(bool);
    if (bool === true)
    {
        document.getElementById('geo-btn').setAttribute('disabled', '');
        document.getElementById('city-btn').removeAttribute('disabled');
        document.getElementById('city').readOnly = false;
        document.getElementById('check_loc').checked = false;
        document.getElementById('check_loc').setAttribute('disabled', '');
        settings.use_coord = false;
        settings.update_coord = false;
    }
    else
    {
        document.getElementById('geo-btn').removeAttribute('disabled');
        document.getElementById('city-btn').setAttribute('disabled', '');
        document.getElementById('city').readOnly = true;
        document.getElementById('check_loc').removeAttribute('disabled');
        settings.use_coord = true;
    }
}

function validateUpdateTime()
{
    var time = document.getElementById('interval').value;
    if (time <= 2 && time > 0)
    {
    	  alert('Your update interval is extremely short! Suggested interval: 10 to 30 minutes.');
    }
    if (time >= 240)
    {
    	  alert('Your update interval is very long! Suggested interval: 10 to 30 minutes.');
    }
    document.getElementById('interval').focus();
}

function toggleCheckLoc()
{
    bool = document.getElementById('check_loc').checked;
    console.log(bool);
    if (bool === true)
    {
        settings.update_coord = true;
    }
    else
    {
        settings.update_coord = false;
    }
}

function getCityName()
{
    console.log("getCityName");
    settings.use_coord = true;
    document.getElementById("country").value = "...";
    document.getElementById("city").value = "requesting data ...";

    var lcode = "en";
    if (settings.language == "Deutsch")
    {
        lcode = "de";
    }

    var xmlhttp = new XMLHttpRequest();
    var url = "http://api.openweathermap.org/data/2.5/weather?";
    url += "lat=";
    url += geodata.latitude;
    url += "&lon=";
    url += geodata.longitude;
    url += ("&appid=" + api_key);
    url += "&units=metric&mode=json";
    url += ("&lang=" + lcode);
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var myArr = JSON.parse(xmlhttp.responseText);
            var loc = myArr["name"];
            geodata.city = loc;
            document.getElementById("location").innerHTML = loc;
            geodata.ccode = myArr["sys"]["country"];
            document.getElementById("country_code").innerHTML = geodata.ccode;
            document.getElementById("country").value = geodata.ccode;
            document.getElementById("city").value = geodata.city;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function testLocation()
{
    console.log("testLocation");

    var lcode = "en";
    if (settings.language == "Deutsch")
    {
        lcode = "de";
    }
    testcity = document.getElementById("city").value;
    testcountry = document.getElementById("country").value;

    var xmlhttp = new XMLHttpRequest();
    var url = "http://api.openweathermap.org/data/2.5/weather?";
    url += ("&q=" + testcity);
    url += ("," + testcountry);

    url += ("&appid=" + api_key);
    url += "&units=metric&mode=json";
    url += ("&lang=" + lcode);
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var myArr = JSON.parse(xmlhttp.responseText);
            // console.log(myArr);
            if ( myArr["cod"] == 404 )
            {
                alert("Apparently openweathermap.org does not recognize your place name.");
		}
            try
            {
                geodata.city = myArr["name"];
                geodata.ccode = myArr["sys"]["country"];
		}
            catch (e)
            {
                alert("Apparently openweathermap.org does not recognize your place name.");
                // return false;
		}
            document.getElementById("country").value = geodata.ccode;
            document.getElementById("city").value = geodata.city;
            alert('openweathermap.org says your location is ' + geodata.city + ', ' + geodata.ccode + '. Looks fine for me so far. Try searching for your place at their site if this is not correct.');
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function mpsToBft(mps)
{
    storm = false;
    if (mps > 18)
    {
        storm = true;
    }
    if (mps < 0.3)
    {
        return 0;
    }
    else if (mps < 1.6)
    {
        return 1;
    }
    else if (mps < 3.4)
    {
        return 2;
    }
    else if (mps < 5.5)
    {
        return 3;
    }
    else if (mps < 8.0)
    {
        return 4;
    }
    else if (mps < 10.8)
    {
        return 5;
    }
    else if (mps < 13.9)
    {
        return 6;
    }
    else if (mps < 17.2)
    {
        return 7;
    }
    else if (mps < 20.8)
    {
	  return 8;
    }
    else if (mps < 24.5)
    {
        return 9;
    }
    else if (mps < 28.5)
    {
        return 10;
    }
    else if (mps < 32.7)
    {
        return 11;
    }
    else
    {
        return 12;
    }
}

function celsiusToFahrenheit(degrees)
{
    return Round( degrees * (9/5) + 32, 1 );
}

function fahrenheitToCelsius(degrees)
{
    return Round( (degrees - 32) * (5/9), 1 );
}

function Round(Number, DecimalPlaces)
{
    return Math.round(parseFloat(Number) * Math.pow(10, DecimalPlaces)) / Math.pow(10, DecimalPlaces);
}

function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i=0; i<ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0)==' ')
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0)
        {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function getSettings()
{
    var t = getCookie('lang');
    if ( t !== "" )
    {
        settings.language = t;
    }
    lcode = "en";
    if (settings.language == "Deutsch")
    {
        lcode = "de";
    }
    t = getCookie('units');
    if ( t !== "" )
    {
        settings.units = t;
    }
    t = getCookie('interval');
    if ( t !== "" )
    {
        settings.interval = t;
    }
    t = getCookie('city');
    if ( t !== "" )
    {
        geodata.city = t;
    }
    t = getCookie('ccode');
    if ( t !== "" )
    {
        geodata.ccode = t;
    }
    t = getCookie('lat');
    if ( t !== "" )
    {
        geodata.latitude = t;
    }
    t = getCookie('lon');
    if ( t !== "" )
    {
        geodata.longitude = t;
    }
    t = getCookie('show_switch');
    if ( t == "true" )
    {
        console.log("t: " + t);
	  settings.show_switch = true;
    }
    else
    {
        console.log("t: " + t);
	  settings.show_switch = false;
    }
    t = getCookie('show_thermo');
    if ( t == "true" )
    {
        console.log("t: " + t);
        settings.show_thermo = true;
    }
    else
    {
        console.log("t: " + t);
        settings.show_thermo = false;
    }
    t = null;
}