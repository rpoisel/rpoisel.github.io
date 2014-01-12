"use strict";

$.getJSON("data/items.json", function(data)
{
    console.log(data);
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

function instantiateMarkers(items)
{
    var markerArray = new Array();
    $.each(items, function(index, element)
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
    var map = L.map('map').setView([48.18459, 15.64022], 17);
    L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
    {
        attribution: 'Map data &copy; 2014 OpenStreetMap contributors',
    }).addTo(map);

    var markers = instantiateMarkers(items);
    var added = true;
    addMarkerLayers(markers, map);

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
}
