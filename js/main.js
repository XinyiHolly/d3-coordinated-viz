//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){

    //map frame dimensions
    var width = 960,
        height = 460;

    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create Albers equal area conic projection centered on France
    var projection = d3.geoCylindricalEqualArea()
        .precision(0.1);

    var path = d3.geoPath()
        .projection(projection);

    //use d3.queue to parallelize asynchronous data loading
    d3.queue()
        .defer(d3.csv, "data/EnergyUse.csv") //load attributes from csv
        .defer(d3.json, "data/Countries.topojson") //load background spatial data
        .await(callback);

    function callback(error, csvData, countries){
        //translate countries TopoJSON
        var worldCountries = topojson.feature(countries, countries.objects.ne_10m_admin_0_countries).features;

        //add world regions to map
        var regions = map.selectAll(".regions")
            .data(worldCountries)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "regions " + d.properties.NAME;
            })
            .attr("d", path);

        console.log(error);
        console.log(csvData);
        console.log(worldCountries);
    };
};
