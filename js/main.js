
var events = [
    'zoomlevelschange', 'resize', 'unload',
    'viewreset', 'load', 'zoomstart',
    'movestart', 'zoom', 'move',
    'zoomend', 'moveend'
];

function setupListener(map, name) {
    var eventRow = document.getElementById(name);
    map.on(name, function () {
        eventRow.className = 'event active';
        var timeout = setTimeout(function () {
            eventRow.className = 'event inactive';
        }, 1000);

    });
}

function initialize() {
    //populateTable();
    var mapDiv = document.getElementById('map');
    var map = L.map('map');
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'
    }).addTo(map);
    for (var i = 0; i < events.length; i++) {
        setupListener(map, events[i]);
    }
    map.setView([51.505, -0.09], 13, { /*zoomAnimation: false*/ });
    window.map = map;
    map.on('moveend', _.debounce(function () {
        var ne = map.getBounds().getNorthEast();
        var sw = map.getBounds().getSouthWest();
        var ne_dist = turf.distance([ne.lng, ne.lat], [sw.lng, sw.lat], { units: 'meters' });
        var nw = map.getBounds().getNorthWest();
        var nw_dist = turf.distance([ne.lng, ne.lat], [nw.lng, nw.lat], { units: 'meters' });
        $('#bbox').html("<div>" + "NE:" + map.getBounds().getNorthEast().lng.toFixed(2) + "," +
            "NW:" + map.getBounds().getNorthWest().lng.toFixed(2) + "," +
            "SE:" + map.getBounds().getSouthEast().lng.toFixed(2) + "," +
            "SW:" + map.getBounds().getSouthWest().lng.toFixed(2) + "," +
            "diagonal:" + ne_dist.toFixed(2) + "," +
            "ne-nw:" + nw_dist.toFixed(2) +
            "</div>");
    }, 1000));
}

function populateTable() {
    var eventsTable = document.getElementById('events');
    var content = '';
    for (var i = 0; i < events.length; i++) {
        content += '<div class="event" id="' + events[i] + '">' + events[i] +
            '</div>';
    }
    eventsTable.innerHTML = content;
}

initialize();


