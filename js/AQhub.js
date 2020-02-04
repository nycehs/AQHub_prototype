
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
let tabShown = 'tab-01-a';
//let tabSpec = '';

//const trafficMapSpec = "./js/TrafficmapSpec.vl.json";    //These spec definitions were moved to a tab function
//const industrialMapSpec = "./js/IndustrialmapSpec.vl.json";
//const BDmapSpec = "./js/BDmapSpec.vl.json";
//const BEmapSpec = "./js/BEmapSpec.vl.json";

const sbmt = document.querySelector("#ntaSubmitButton"); //creates a constant to hold the submit button query selector
sbmt.addEventListener('click',dataChange); // listens for button clicks to change neighborhood, changes data

//the d3 code below loads the NTA map data
let nta_topojson = d3.json("https://grantpezeshki.github.io/NYC-topojson/NTA.json")

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
    dPM = numRound(dPM);
    dNO2 = neighborhoodData[0].Avg_annavg_NO2;
    dNO2 = numRound(dNO2);
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

    loadMap(tabShown);

    console.log('changed');
    console.log(selectedNeighborhood);
    
    }
// rounding function lets us round all numbers the same
function numRound(x) {
  return Number.parseFloat(x).toFixed(1);
}

// jquery commands track tab changes
$(document).ready(function(){
  $(document).alert('hi from jquery');
  $(".nav-pills a").click(function(){
    $(this).tab('show');
  });
  $('.nav-pills a').on('shown.bs.tab', function(event){
    tabShown = $(event.target).attr('aria-controls');         // active tab
   // var y = $(event.relatedTarget).text();  // previous tab
    $(".act span").text(tabShown);
    $(".prev span").text("did it again");
    loadMap(tabShown);
  });
});

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

  //Returns map insert/update div IDs
  function mapUpdateID(tabShown) {
    if (tabShown==="tab-01-a") {
        return '#BEmap';
      }
    else if (tabShown==="tab-01-d") {
        return '#BDmap';
      }
    else if (tabShown==="tab-01-b") {
        return '#Industrialmap';
      }
    else if (tabShown==="tab-01-c") {
        return '#Trafficmap';
      }
    else {console.log('Error: not sure which map to update')};
    }

  //Returns map specs for proper tab context
  function mapUpdateSpec(tabShown) {
    if (tabShown==="tab-01-a") {
        return "./js/BEmapSpec.vl.json";
      }
    else if (tabShown==="tab-01-d") {
        return "./js/BDmapSpec.vl.json";
      }
    else if (tabShown==="tab-01-b") {
        return "./js/IndustrialmapSpec.vl.json";
      }
    else if (tabShown==="tab-01-c") {
        return "./js/TrafficmapSpec.vl.json";
      }
    else {console.log('Error: not sure which map to update')};
    }

  //create a function to load the Building Density map. Invoked when user clicks the tab or when neighborhood changes.
  function loadMap(){
    //console.log(mapUpdateID(tabShown));
    vegaEmbed(mapUpdateID(tabShown), mapUpdateSpec(tabShown)).then(function(result) {
      // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
      //result.view.insert('selectedNabe',selectedNeighborhood).run()
    }).catch(console.error);
  }

    /*   //These scripts load the maps initially but once a neighborhood is selected this is not needed

    //var spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
    var PMmapSpec = "./js/PMmapSpec.vl.json"
    vegaEmbed('#PMmap', PMmapSpec).then(function(result) {
      // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
      //result.view.insert('selectedNabe',selectedNeighborhood).run()
    }).catch(console.error);


    // these load the maps initially. 

    vegaEmbed('#BEmap', BEmapSpec).then(function(result) {
      // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
      //result.view.insert('selectedNabe',selectedNeighborhood).run()
    }).catch(console.error);

    vegaEmbed('#BDmap', BDmapSpec).then(function(result) {
      // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
      //result.view.insert('selectedNabe',selectedNeighborhood).run()
    }).catch(console.error);

    vegaEmbed('#Industrialmap', industrialMapSpec).then(function(result) {
      // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
      //result.view.insert('selectedNabe',selectedNeighborhood).run()
    }).catch(console.error);

    vegaEmbed('#Trafficmap', trafficMapSpec).then(function(result) {
      // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
      //result.view.insert('selectedNabe',selectedNeighborhood).run()
    }).catch(console.error);
 */




