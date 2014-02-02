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
        var newMarker = L.marker([element.lat, element.lng],
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

function instantiatePaths(paths)
{
    var pathsArray = new Array();

    $.each(paths, function(index, element)
    {
        var pointList = new Array();
        $.each(element.points, function(index, point)
        {
            pointList.push(L.latLng(point.lat, point.lng));
        });
        var newPath = L.polyline(pointList,
            {
                color: element.color,
                weight: 6,
                oppacity: 0.5,
                smoothFactor: 1
            });
        newPath.bindPopup("<div class='infobox'>" +
                          "<h2>"+element.name+"</h2>" +
                          "<img src='" + element.picture +"' class='writerpic'/>"+
                          "<p class='writerdes'>"+element.description+"</p>" +
                          "<div style='clear:both;'></div>"+
                          "</div>");
        pathsArray.push(newPath);
    });
    return pathsArray;
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

function addPathLayers(p, map)
{
    $.each(p, function(index, path)
    {
        map.addLayer(path);
    });
}

function main(data)
{
    var map = L.map('map');
    var added = true;
    var markers = null;
    var paths = null;

    map.on("load", function (loadArg)
    {
        // add items to be shown to map
        markers = instantiateMarkers(data.items, loadArg.target._zoom);
        addMarkerLayers(markers, map);

        // add paths
        paths = instantiatePaths(data.paths);
        addPathLayers(paths, map);
    });

    map.on("zoomend", function (zoomArg)
    {
        removeMarkerLayers(markers, map);
        markers = instantiateMarkers(data.items, zoomArg.target._zoom);
        addMarkerLayers(markers, map);
    });

    map.setView(data.config.center, data.config.zoomLevel);
    L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
    {
        attribution: 'Map data &copy; 2014 OpenStreetMap contributors',
    }).addTo(map);
}
