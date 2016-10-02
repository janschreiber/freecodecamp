var getChannelData = function(user) {

    var clientID = "kz0298j2x1610gtajdg7tw1e83rqjyt",
        missingLogo = "img/missing.jpg";

    // Main ajax function that gets data for each channel.
    $.ajax({
        url: 'https://api.twitch.tv/kraken/streams/' + user,
        dataType: "json",
        headers: {
            'Client-ID': clientID
        },

        // (0) If the channel is not found:
        statusCode: {
            404: function() {
                $("#contentTable").append("<tr class='offline notfound'><td><img src='" + missingLogo + "'></td><td>" + user + "<br>User not found</td><td></td></tr>");
            }
        },

        // (1) Log errors to the console:
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(textStatus, errorThrown);
        },

        // (2) If the channel is found:
        success: function(data) {

            // (2.1) If the user is currently offline, launch a second ajax request:
            if (data.stream === null) {
                $.ajax({
                    url: 'https://api.twitch.tv/kraken/channels/' + user,
                    dataType: "json",
                    headers: {
                        'Client-ID': clientID
                    },
                    success: function(data) {
                        // Check if something is missing:
                        var logo = data.logo, displayName = data.display_name, status = data.status;
                        if (logo === null) {
                            logo = missingLogo;
                        }
                        if (displayName === null) {
                            displayName = user;
                        }
                        if (status === null) {
                            status = "";
                        }
                        // Append the data obtained to the content table:
                        $("#contentTable").append("<tr class='offline'><td><a href='" + data.url + "' title='" + data.url + "' target='_blank'><img src=" + logo + "></a></td><td><b>" + displayName + "</b><br><small>" + status + "</small></td><td class='right-column'><small>offline</small></td></tr>");
                        //console.log(data);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error(textStatus, errorThrown);
                    }
                });
            }

            // (2.2) If the user is online:
            else {
                // Handle missing logo, just in case:
                var logo = data.stream.channel.logo;
                if (data.stream.channel.logo === null) {
                    logo = missingLogo;
                }
                // Append the data obtained to the content table:
                $("#contentTable").append("<tr class='online'><td><a href='" + data.stream.channel.url + "' title='" + data.stream.channel.url + "' target='_blank'><img src='" + logo + "'></a></td><td><b>" + data.stream.channel.display_name + "</b><br><small>" + data.stream.channel.status + "</small></td><td class='right-column'><small>live</small></td></tr>");
            }
        }
    });
};

var refreshAll = function() {
    var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", 
                    "RobotCaleb", "noobs2ninjas", "brunofin", "medrybw", "comster404"];
    $("#contentTable").empty();
    for (var i = 0; i < channels.length; i++) {
        setTimeout(getChannelData, 5 * i, channels[i]);
    }
};

$(document).ready(function() {
    refreshAll();
    $("#onlineBtn").click(function() {
        $(".offline").hide();
        $(".online").show();
        $("#onlineBtn").addClass("active");
        $("#offlineBtn").removeClass("active");
        $("#allBtn").removeClass("active");
    });
    $("#offlineBtn").click(function() {
        $(".offline").show();
        $(".online").hide();
        $("#offlineBtn").addClass("active");
        $("#onlineBtn").removeClass("active");
        $("#allBtn").removeClass("active");
    });
    $("#allBtn").click(function() {
        $(".offline").show();
        $(".online").show();
        $("#allBtn").addClass("active");
        $("#onlineBtn").removeClass("active");
        $("#offlineBtn").removeClass("active");
    });
    $("#refreshBtn").click(function() {
        refreshAll();
        $("#allBtn").addClass("active");
        $("#onlineBtn").removeClass("active");
        $("#offlineBtn").removeClass("active");
    });
});
