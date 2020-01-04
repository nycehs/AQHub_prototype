
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
let specPMmap = "./js/PMmapSpec.vl.json";
let specPMbar = "./js/PMbarSpec.vl.json";
let specNOmap = "./js/NOmapSpec.vl.json";
let specNObar = "./js/NObarSpec.vl.json";
const embed_opt = {"mode": "vega-lite"};  

const sbmt = document.querySelector("#ntaSubmitButton"); //creates a constant to hold the submit button query selector
sbmt.addEventListener('click',dataChange); // listens for button clicks to change neighborhood, changes data

//the d3 code below loads the NTA map data
let nta_topojson = d3.json("https://grantpezeshki.github.io/NYC-topojson/NTA.json")

//the d3 code below loads the data from a CSV file and dumps it into global javascript object variable.
d3.csv("./data/NTA_tertilesWpm_no2.csv").then(function(data) {
    //console.log(data); // [{"Hello": "world"}, …]
    nyccasData=data;
    neighborhoodData = data.filter(function (sf){
            return sf.NTACode == selectedNeighborhood;
        });
    console.log(nyccasData);
    console.log(selectedNeighborhood);
    console.log(neighborhoodData);
    });     

const el = document.getElementById('PMbar');
let view = vegaEmbed("#PMbar", specPMbar, embed_opt)
        .catch(error => showError(el, error))
            .then((res) =>  res.view
            .insert("nyccasData", nyccasData)
            .run());

vegaEmbed('#PMmap', specPMmap).then(function(result) {
    // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
    //result.view.insert('selectedNabe',selectedNeighborhood).run()
    result.view.run();
}).catch(console.error);

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
    document.querySelector("#NTA").innerHTML = 'NTA: ' + selectedNeighborhood + ' ' + selectedName;
    document.querySelector("#PM").innerHTML = 'PM: ' + dPM;
    document.querySelector("#NO2").innerHTML = 'NO2: ' + dNO2;
    document.querySelector("#BuildingEmissions").innerHTML = 'BuildingEmissions: ' + tertileTranslate(dBuildingEmissions);
    document.querySelector("#BuildingDensity").innerHTML = 'BuildingDensity: ' + tertileTranslate(dBuildingDensity);
    document.querySelector("#TrafficDensity").innerHTML = 'TrafficDensity: ' + tertileTranslate(dTrafficDensity);
    document.querySelector("#Industrial").innerHTML = 'Industrial: ' + tertileTranslate(dIndustrial);

    vegaEmbed("#PMbar", specPMbar, embed_opt)
        .catch(error => showError(el, error))
            .then((res) =>  res.view
            .insert("nyccasData", nyccasData)
            .run());

    console.log('changed');
    console.log(selectedNeighborhood);
    
    }



function tertileTranslate(tertileVal) {
    if (tertileVal==="1") {return 'Low'}
    else if (tertileVal==="2") { return 'Medium'}
    else {return 'High'};
}
