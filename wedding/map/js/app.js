"use strict";

$.getJSON("data/items.json", function(data)
{
    main(data);
});

(function (window, document, undefined) {
    'use strict';
    L.PartyIcon = {};
    L.PartyIcon.version = '1.0';
    L.PartyIcon.Icon = L.Icon.extend(
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
    L.PartyIcon.icon = function(options)
    {
        return new L.PartyIcon.Icon(options);
    };
}(this, document));

(function (window, document, undefined) {
    'use strict';
    L.PartyMap = {};
    L.PartyMap.version = '1.0';
    L.PartyMap.Map = L.Map.extend(
    {
        addMarkers: function (items)
        {
            var markerArray = new Array();
            var newIcon = null;
            var _theMap = this;
            $.each(items, function(index, element)
            {
                if (_theMap._zoom >= 17)
                {
                    newIcon = L.PartyIcon.icon(
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
                _theMap._bindPopup(
                        newMarker, element.name, element.picture, element.description);
                markerArray.push(newMarker);
            });
            this._markers = markerArray;
            this.addLayers(markerArray);
        },
        removeMarkers: function()
        {
            if (this._markers != null)
            {
                this.removeLayers(this._markers);
            }
            this._markers = null;
        },
        addPaths: function (paths)
        {
            var pathsArray = new Array();
            var _theMap = this;

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
                _theMap._bindPopup(
                    newPath, element.name, element.picture, element.description);
                pathsArray.push(newPath);
            });
            this._paths = pathsArray;
            this.addLayers(pathsArray);
        },
        addLayers: function(items)
        {
            var _theMap = this;
            $.each(items, function(index, item)
            {
                _theMap.addLayer(item);
            });
        },
        removeLayers: function(items)
        {
            var _theMap = this;
            $.each(items, function(index, item)
            {
                _theMap.removeLayer(item);
            });
        },
        _bindPopup: function(element, name, picture, description)
        {
            element.bindPopup("<div class='infobox'>" +
              "<h2>"+name+"</h2>" +
              "<img src='" + picture +"' class='writerpic'/>"+
              "<p class='writerdes'>"+description+"</p>" +
              "<div style='clear:both;'></div>"+
              "</div>");
        }
    });

    L.PartyMap.map = function(options)
    {
        return new L.PartyMap.Map(options);
    };
}(this, document));

function main(data)
{
    var map = L.PartyMap.map('map');
    var added = true;
    var markers = null;
    var paths = null;

    map.on("load", function (loadArg)
    {
        map.addPaths(data.paths);
    });

    map.on("zoomend", function (zoomArg)
    {
        map.removeMarkers();
        map.addMarkers(data.items);
    });

    map.setView(data.config.center, data.config.zoomLevel);
    L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
    {
        attribution: 'Map data &copy; 2014 OpenStreetMap contributors',
    }).addTo(map);
}
