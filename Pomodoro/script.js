var pomodoro_time = 1500;
var long_break_time = 600;
var short_break_time = 300;
var secs = 1500;
var reset_secs = 1500;
var anim;

function onDocLoad()
{
    document.getElementById('counter').className = '';
    setLinkPos();
}

function countDown( seconds )
{
    // reset_secs = seconds;
    if (anim)
    {
        clearTimeout(anim);
    }
    document.getElementById('counter').className = '';
    var minutes = Math.floor(seconds/60);
    var seconds_only = seconds % 60;
    document.getElementById('minutes').innerHTML = minutes+':';
    if (seconds_only.toString().length == 1)
    {
        document.getElementById('seconds').innerHTML = '0'+ seconds_only;
    }
    else
    {
        document.getElementById('seconds').innerHTML = seconds_only;
    }
    seconds -= 1;
    console.log(seconds);
    if (seconds >= 0)
    {
        anim = setTimeout(function() { countDown(seconds); }, 1000);
    }
    if (seconds === 0)
    {
        document.getElementById('alarm').play();
        document.getElementById('counter').className = 'animated shake';
    }
}

function stopTimer()
{
    if (anim)
    {
        clearTimeout(anim);
    }
    secs = parseInt(document.getElementById('seconds').innerHTML) + (parseInt(document.getElementById('minutes').innerHTML) *60);
}

function resetTimer()
{
    if (anim)
    {
        clearTimeout(anim);
    }
    secs = reset_secs;
    var seconds = reset_secs;
    var minutes = Math.floor(seconds/60);
    var seconds_only = seconds % 60;
    document.getElementById('minutes').innerHTML = minutes+':';
    if (seconds_only.toString().length == 1)
    {
        document.getElementById('seconds').innerHTML = '0'+ seconds_only;
    }
    else
    {
        document.getElementById('seconds').innerHTML = seconds_only;
    }
}

function setSeconds( id, seconds )
{
    document.getElementById('pomodoro').className = 'clickable';
    document.getElementById('pomodoro').title = 'Pomodoro mode';
    document.getElementById('pomodoro').onclick = function() { setSeconds("pomodoro", pomodoro_time); };
    document.getElementById('5min').className = 'clickable';
    document.getElementById('5min').title = 'Short break';
    document.getElementById('5min').onclick = function() { setSeconds("5min", short_break_time); };
    document.getElementById('10min').className = 'clickable';
    document.getElementById('10min').title = 'Long break';
    document.getElementById('10min').onclick = function() { setSeconds("10min", long_break_time); };
    document.getElementById('counter').className = '';
    var elem = document.getElementById(id);
    elem.className = 'active';
    elem.onclick = '';
    elem.title = '';
    clearTimeout(anim);
    secs = seconds;
    reset_secs = seconds;
    var minutes = Math.floor(seconds/60);
    var seconds_only = seconds % 60;
    document.getElementById('minutes').innerHTML = minutes+':';
    if (seconds_only.toString().length == 1)
    {
        document.getElementById('seconds').innerHTML = '0'+ seconds_only;
    }
    else
    {
        document.getElementById('seconds').innerHTML = seconds_only;
    }
}

function saveSettings()
{
    pomodoro_time = document.getElementById("pomodoro_time").value * 60;
    if (isNaN(pomodoro_time))
    {
        alert('There was a problem saving one of your settings. Resetting to default value.');
        pomodoro_time = 25*60;
    }
    short_break_time = document.getElementById("short_break").value * 60;
    if (isNaN(short_break_time))
    {
        alert('There was a problem saving one of your settings. Resetting to default value.');
        short_break_time = 5*60;
    }
    long_break_time = document.getElementById("long_break").value * 60;
    if (isNaN(long_break_time))
    {
        alert('There was a problem saving one of your settings. Resetting to default value.');
        long_break_time = 10*60;
    }
    setSeconds('pomodoro', pomodoro_time);
}

function setLinkPos()
{
    var div_width = 80;
    var w = window.innerWidth;
    var d = document.getElementById('links');
    d.style.textAlign = 'right';
    d.style.height = 'auto';
    d.style.width = div_width + 'px';
    d.style.position = 'absolute';
    // d.style.left = w - div_width + 'px';
    d.style.right = '10px';
    d.style.top = '10px';
}

$(window).on("orientationchange", function()
{
    if(window.orientation == 0) // Portrait
    {
        var d = document.getElementById('content');
        d.style.position = 'relative';
        d.style.left = null;
        d.style.top = null;
    }
    else // Landscape
    {
        var d = document.getElementById('content');
        d.style.height = 'auto';
        d.style.width = 'auto';
        d.style.position = 'absolute';
        d.style.left = '250px';
        d.style.top = '0px';
    }
});
