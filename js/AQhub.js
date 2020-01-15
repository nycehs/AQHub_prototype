
// Create and initialize variables
let nyccasData = [];
let neighborhoodData =[];
let selectedNeighborhood = ['BK09'];  //document.querySelector("#ntaField")
let selectedName = '';
let dPM = 0;
let dNO2 = 0;
let dBuildingEmissions = 0;
let dBuildingDensity = 0;
let dTrafficDensity = 0;
let dIndustrial = 0;

const sbmt = document.querySelector("#ntaSubmitButton"); //creates a constant to hold the submit button query selector
sbmt.addEventListener('click',dataChange); // listens for button clicks to change neighborhood, changes data

//the d3 code below loads the data from a CSV file and dumps it into global javascript object variable.
d3.csv("./data/NTA_tertilesWpm_no2.csv").then(function(data) {
    //console.log(data); // [{"Hello": "world"}, …]
    nyccasData=data;
    neighborhoodData = nyccasData.filter(function (sf){
            return sf.NTACode === selectedNeighborhood;
        });
    console.log(nyccasData);
    console.log(selectedNeighborhood);
    console.log(neighborhoodData);
    });     

// dataChange function updates selected neighborhood, then filter nyccas data and get new neighborhood data, then adds to DOM
function dataChange() {
    selectedNeighborhood = document.querySelector("#ntaField").value;
    neighborhoodData = nyccasData.filter(function (sf){
            return sf.NTACode === selectedNeighborhood;
        });
    selectedName = neighborhoodData[0].NTAName;
    dPM = neighborhoodData[0].Avg_annavg_PM25;
    dNO2 = neighborhoodData[0].Avg_annavg_NO2;
    dBuildingEmissions = neighborhoodData[0].tertile_buildingemissions;
    dBuildingDensity = neighborhoodData[0].tertile_buildingdensity;
    dTrafficDensity = neighborhoodData[0].tertile_trafficdensity;
    dIndustrial = neighborhoodData[0].tertile_industrial;
    document.querySelector("#NTA").innerHTML = 'Your neighborhood: <h3><span style="font-weight:bold;color:#15607a">' + selectedName + '</span></h3>';
    document.querySelector("#NTA2").innerHTML = selectedName;
    document.querySelector("#NTA3").innerHTML = selectedName;
    document.querySelector("#PM").innerHTML = dPM + ' μg/m<sup>3</sup>';
    document.querySelector("#NO2").innerHTML = dNO2 + ' ppb';
    document.querySelector("#BuildingEmissions").innerHTML = 'Building emissions<br><h5>' + tertileTranslate(dBuildingEmissions) + '</h5>';
    document.querySelector("#BuildingDensity").innerHTML = 'Building density<br><h5>' + tertileTranslate(dBuildingDensity) + '</h5>';
    document.querySelector("#TrafficDensity").innerHTML = 'Traffic density<br><h5>' + tertileTranslate(dTrafficDensity) + '</h5>';
    document.querySelector("#Industrial").innerHTML = 'Industrial area<br><h5>' + tertileTranslate(dIndustrial) + '</h5>';

    console.log('changed');
    console.log(selectedNeighborhood);
    
    }

    //var spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
    var spec = "./js/PMmapSpec.vl.json"
    vegaEmbed('#PMmap', spec).then(function(result) {
      // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
      //result.view.insert('selectedNabe',selectedNeighborhood).run()
    }).catch(console.error);


        //var spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
        var spec = "./js/BEmapSpec.vl.json"
        vegaEmbed('#BEmap', spec).then(function(result) {
          // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
          //result.view.insert('selectedNabe',selectedNeighborhood).run()
        }).catch(console.error);

        //var spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
        var spec = "./js/BDmapSpec.vl.json"
        vegaEmbed('#BDmap', spec).then(function(result) {
          // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
          //result.view.insert('selectedNabe',selectedNeighborhood).run()
        }).catch(console.error);

        //var spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
        var spec = "./js/IndustrialmapSpec.vl.json"
        vegaEmbed('#Industrialmap', spec).then(function(result) {
          // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
          //result.view.insert('selectedNabe',selectedNeighborhood).run()
        }).catch(console.error);


        //var spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
        var spec = "./js/TrafficmapSpec.vl.json"
        vegaEmbed('#Trafficmap', spec).then(function(result) {
          // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
          //result.view.insert('selectedNabe',selectedNeighborhood).run()
        }).catch(console.error);


//Returns block-level badges for the tabs
function tertileTranslate(tertileVal) {
    if (tertileVal==="3") {return '<span class="badge badge-worse btn-block">high</span>'}
    else if (tertileVal==="2") { return '<span class="badge badge-medium btn-block">medium</span>'}
    else {return '<span class="badge badge-better btn-block">low</span>'};
}

//Returns in-line badges for text
function tertileTranslate2(tertileVal) {
  if (tertileVal==="3") {return '<span class="badge badge-worse">high</span>'}
  else if (tertileVal==="2") { return '<span class="badge badge-medium">medium</span>'}
  else {return '<span class="badge badge-better">low</span>'};
}
