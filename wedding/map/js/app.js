"use strict";

$.getJSON("data/items.json", function(data)
{
    main(data);
});

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

function instantiateMarkers(items, zoomLevel)
{
    var markerArray = new Array();
    var newIcon = null;
    $.each(items, function(index, element)
    {
        if (zoomLevel >= 17)
        {
            newIcon = new CustomIcon(
            {
                iconUrl: element.iconUrl
            });
        }
        else
        {
            newIcon = L.AwesomeMarkers.icon(
            {
                icon: element.iconType,
                markerColor: element.color,
                prefix: 'fa',
            });
        }
        var newMarker = L.marker([element.lat, element.lon],
        {
            icon: newIcon
        });
        newMarker.bindPopup("<div class='infobox'>" +
                          "<h2>"+element.name+"</h2>" +
                          "<img src='" + element.picture +"' class='writerpic'/>"+
                          "<p class='writerdes'>"+element.description+"</p>" +
                          "<div style='clear:both;'></div>"+
                          "</div>");
        markerArray.push(newMarker);
    });
    return markerArray;
}

function addMarkerLayers(markers, map)
{
    $.each(markers, function(index, marker)
    {
        map.addLayer(marker);
    });
}

function removeMarkerLayers(markers, map)
{
    $.each(markers, function(index, marker)
    {
        map.removeLayer(marker);
    });
}

function main(items)
{
    var map = L.map('map');
    var added = true;
    var markers = null;

    map.on("load", function (loadArg)
    {
        markers = instantiateMarkers(items, loadArg.target._zoom);
        addMarkerLayers(markers, map);
    });

    map.on("zoomend", function (zoomArg)
    {
        removeMarkerLayers(markers, map);
        markers = instantiateMarkers(items, zoomArg.target._zoom);
        addMarkerLayers(markers, map);
    });

    map.setView([48.18459, 15.64022], 17);
    L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
    {
        attribution: 'Map data &copy; 2014 OpenStreetMap contributors',
    }).addTo(map);
}
