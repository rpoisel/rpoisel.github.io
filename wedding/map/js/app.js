var items = [
{
    "lat": 48.1831,
    "lon": 15.63780,
    "iconUrl": "img/quercher.png",
    "msg": "Ort der Sause"
},
{
    "lat": 48.18297,
    "lon": 15.6388,
    "iconUrl": "img/kirche.png",
    "msg": "Ort der Trause"
}];

var CustomIcon = L.Icon.extend(
{
    options:
    {
        //shadowUrl: '../docs/images/leaf-shadow.png',
        //iconSize:     [50, 50],
        //shadowSize:   [50, 64],
        iconAnchor: [30, 30],
        //shadowAnchor: [4, 62],
        popupAnchor: [-3, -25]
    }
});

function instantiateMarkers(items)
{
    var markerArray = new Array();
    _.each(items, function(element)
    {
        var newIcon = new CustomIcon(
        {
            iconUrl: element.iconUrl
        });
        var newMarker = L.marker([element.lat, element.lon],
        {
            icon: newIcon
        });
        newMarker.bindPopup(element.msg);
        markerArray.push(newMarker);
    });
    return markerArray;
}

function addMarkerLayers(markers, map)
{
    _.each(markers, function(marker)
    {
        map.addLayer(marker);
    });
}

function removeMarkerLayers(markers, map)
{
    _.each(markers, function(marker)
    {
        map.removeLayer(marker);
    });
}

var map = L.map('map').setView([48.18459, 15.64022], 17);
L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
{
    attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
}).addTo(map);

var markers = instantiateMarkers(items);
addMarkerLayers(markers, map);
var added = true;

map.on("zoomend", function (zoomArg)
{
    if (zoomArg.target._zoom >= 17)
    {
        if (!added)
        {
            addMarkerLayers(markers, map);
            added = true;
        }
    }
    else
    {
        if (added)
        {
            removeMarkerLayers(markers, map);
            added = false;
        }
    }
});
