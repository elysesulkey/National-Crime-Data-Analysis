function buildHeatMap(yearData, year) {
    
    if (d3.select("#mapid").attr("class")){
       
    }
    else {
        console.log("else")
        var map = L.map('mapid').setView([37.8, -96], 4); 
  
    }
    

    var geojson;

    // USED MAPBOX API KEY
    var mapboxAccessToken = "pk.eyJ1IjoidmFuaWUyMDIwIiwiYSI6ImNrcWZ1bDVyYTBzM2MycnBleGNkOWQ5bHAifQ.eaxti1dzNG3CNobYVbShQQ";
    
    ///FUNCTION TO GIVE POPOUT INFO

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>U.S. Violent Crime Data</h4>' + (props ?
            '<b>' + props.name + '</b><br />' + props.density + ' people per 100,000'
            : 'Hover over a state');
    };

    info.addTo(map);


    //Heat Map Colors
    function getColor(d) {
        return d > 750 ? '#800026' :
            d > 700 ? '#BD0026' :
                d > 650 ? '#E31A1C' :
                    d > 500 ? '#FC4E2A' :
                        d > 400 ? '#FD8D3C' :
                            d > 200 ? '#FEB24C' :
                                d > 100 ? '#FED976' :
                                    '#FFEDA0';
    }


    ///adds the listeners on our state layers
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    ///click listener that zooms to the state
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    ///Defines event listener for a mouse over event
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }

    ///This is what happens on Mouseout
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    ///This is fill Color that depends on feature.properties.density
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }




    ///MADE LEGEND IN BOTTOM RIGHTHAND CORNER OF MAP
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend')
        grades = [750, 700, 650, 500, 400, 200, 100]
        // return d > 1 ? '#800026' :
        // d > .9 ? '#BD0026' :
        //     d > .7 ? '#E31A1C' :s
        //         d > .5 ? '#FC4E2A' :
        //             d > .4 ? '#FD8D3C' :
        //                 d > .2 ? '#FEB24C' :
        //                     d > .1 ? '#FED976' :
        //                         '#FFEDA0';,
        //labels = [0, 100, 250, 450, 600, 750];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<div style="margin-top: 1px;"><i style="background:' + getColor(grades[i] + .3) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '</div><br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        id: 'mapbox/light-v9',
        attribution: `${year} US Crime Data`,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapboxAccessToken
    }).addTo(map);


    geojson = L.geoJson(yearData, { style: style, onEachFeature: onEachFeature }).addTo(map);
}
var d3yearSelected = d3.select("#yearselection").property("value")
if (d3yearSelected == 2019) {
    yearData = statesData2019
}
if (d3yearSelected == 2018) {
    yearData = statesData2018
}
buildHeatMap(yearData, `${d3yearSelected}`)

function heatmapyearchange(yearSelected) {
    // d3.select("#mapid").html("")
    var yearData;
    console.log(yearSelected)
    var heatmapyearlink = `/map/${yearSelected}`
    window.location.href = heatmapyearlink
    window.location.replace(heatmapyearlink)
}



