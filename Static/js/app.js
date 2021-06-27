// Function for change on dropdown menu
function optionChanged(Year){

    // Check if value selected in dropdown
    //console.log(selectedID);
 
    // Read the json file for the data
    d3.json("./data/cleaned_crime_data.json").then((data) => {
 
    //console.log(data);
 
    // Clear dropdown
    d3.select("#selDataset").html("");   
    
    // Select metadata array and append item ID, adds ID to dropdown
    data.metadata.forEach(item =>
         {
        //console.log(item.id);
         d3.select ("#selDataset").append('option').attr('value', item.id).text(item.id);
         });
    // Selected value passed
    d3.select("#selDataset").node().value = selectedID;
    
    // Filter Metadata for selected ID from dropdown
    const idMetadata = data.metadata.filter(item=> (item.id == Year));
       // {
       //    console.log("------------------------")
       //    console.log(item);
       //    console.log(item.id);
          
       // });
    // Check the metadata loaded for selected ID
    //console.log(idMetadata);
    
    const panelDisplay = d3.select("#sample-metadata");
    panelDisplay.html("");
    Object.entries(idMetadata[0]).forEach(item=> 
       {
          panelDisplay.append("p").text(`${item[0]}: ${item[1]}`)
       });
 
    // BAR CHART
 
    // Filter sample array data for the selected ID
    const Year = data.samples.filter(item => parseInt(item.id) == Year);
    
    // // Check values
    // console.log(typeof parseInt(item.id));
    // console.log(idSample[0].sample_values);  
    // console.log(idSample[0].otu_ids);  
    // console.log(idSample[0].otu_labels);  

    var selected_year = Year[0].selected_year.slice(0,10);
    selected_year = selected_year.reverse();
    var State = Year[0].State.slice(0,10);
    State = State.reverse();
    //var otu_label = idSample[0].otu_labels
    //otu_label = otu_label.reverse();
 
    // // Check values
    //  console.log(sampleValue);
    //  console.log(otuID);
    //  console.log(otuLabels);

    // Y axis of bar chart
    const yAxis = State.map(item);
    
    // Define the layout and trace object, edit color and orientation
       const trace = {
       y: yAxis,
       x: crime_type,
       type: 'bar',
       orientation: "h",
       //text:  otu_label,
       marker: {
          color: "#9370db",
          line: {
             width: 3
         }
        }
       },
       layout = {
       title: 'Crime Types/ State',
       xaxis: {title: 'Crime Types'},
       yaxis: {title: 'State'}
       };
 
       // Plot using Plotly
       Plotly.newPlot('bar', [trace], layout,  {responsive: true});    
       

 // GAUGE CHART

 // Gauge Chart to plot weekly washing frequency 
 const guageDisplay = d3.select("#gauge");
 guageDisplay.html(""); 
 const crimeFreq = idMetadata[0].cfreq;
 
 const guageData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: crimeFreq,
      title: { text: "<b>Crime Frequency </b><br> (Crimes per State / Year)" },
      type: "indicator",
      mode: "gauge+number",     
       gauge: {
       axis: { range: [0,9] },
       bar: { color: "#e6e6fa" },
       steps: [
          { range: [0, 1], color: "#d8bfd8" },
          { range: [1, 2], color: "#dda0dd" },
          { range: [2, 3], color: "#da70d6" },
          { range: [3, 4], color: "#ee82ee" },
          { range: [4, 5], color: "#ff00ff" },
          { range: [5, 6], color: "#ba55d3" },
          { range: [6, 7], color: "#9932cc" },
          { range: [7, 8], color: "#9400d3" },
          { range: [8, 9], color: "#8a2be2" }
                
        ],
       threshold: {
          value: crimeFreq
        }
      }
    }
  ]; 
  const gaugeLayout = {  width: 600, 
                   height: 400, 
                   margin: { t: 0, b: 0 }, 
                    };
 
 // Plot using Plotly
  Plotly.newPlot('gauge', guageData, gaugeLayout); 
 
 });
 }
 
 // Scatter Plot
// Set up chart
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append SVG group to hold chart & shift left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g") 
  .attr("height", height)
  .attr("width", width)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
// Initial paramaters
var x_property = "Violent Crime";
var y_property = "Year";

  // Update x-scale & create scales
function xScale(data, x_property) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[x_property]) * 0.8,
    d3.max(data, d => d[x_property]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}

// Create function to update x-scale when clicking axis label & create scales
function yScale(data, y_property) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[y_property]) * 0.8,
    d3.max(data, d => d[y_property]) * 1.1
    ])
    .range([height, 0]);
  return yLinearScale;
}

// Create function to update xAxis when clicking axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
  // Create function to update xAxis when clicking Y axis label
function renderyAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale); 
  yAxis.transition()
    .duration(500)
    .call(leftAxis);
  return yAxis;
}
// Create function to update circles
function renderCircles(circlesGroup, newXScale, x_property, newYScale, y_property) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[x_property]))
    .attr("cy", d => newYScale(d[y_property]));
  return circlesGroup;
}

function renderText(circleText, newXScale, x_property, newYScale, y_property) {
  circleText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[x_property]))
    .attr("y", d => newYScale(d[y_property]));
  return circleText;
}

function updateToolTip(x_property,y_property, circlesGroup) {
  console.log("update tool tip", x_property);
  var label;
 
  // Set x & y axis label on tooltip 
  if (x_property === "Murder") {
    label = "Murder:";
  }
  else if (x_property === "Rape") {
    label = "Rape:";
  }
  else if (x_property === "Robbery") {
    label = "Robbery:";
  }
  else if (x_property === "Aggravated Assault") {
    label = "Aggravated Assault:";
  }
  else if (x_property === "Property Crime") {
    label = "Property Crime:";
  }
  else if (x_property === "Burglary") {
    label = "Burglary:";
  }
  else if (x_property === "Larceny Theft") {
    label = "Larceny Theft:";
  }
  else if (x_property === "Motor Vehicle Theft") {
    label = "Motor Vehicle Theft:";
  }
  else if (x_property === "Arson") {
    label = "Arson:";
  }
  else {
    label = "Violent Crime:";
  }
 
  if (y_property === "Population") {
    ylabel = "Population:";
  }
  else if (y_property === "City") {
    ylabel = "City:";
  }
  else {
    ylabel = "Year:";
  }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
          if (x_property === "Violent Crime") {
            return (`${d.state}<br>${label} ${d[x_property]}%<br>${ylabel} ${d[y_property]}%`); 
          }
          else
          return (`${d.state}<br>${label} ${d[x_property]}<br>${ylabel} ${d[y_property]}%`);
    });
   
  //function chosen x and y tooltip
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data,this);
  })
    // on mouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data,this);
    });

  return circlesGroup;
}

  // Import Data
  d3.csv("./data/cleaned_crime_data.json").then(function (data) {
  data.forEach(d => {
    d.violentcrime = +d.violentcrime;
    d.murder = +d.murder;
    d.rape = +d.rape;
    d.robbery = +d.robbery;
    d.aggravatedassault = + d.aggravatedassault;
    d.propertycrime = +d.propertycrime;
    d.burglary = +d.burglary;
    d.larcenytheft = +d.larcenytheft;
    d.motorvehicletheft = +d.motorvehicletheft;
    d.arson = +d.arson
    d.population = +d.population
    d.city = +d.city
});

  // LinearScale functions 
  var xLinearScale = xScale(data, x_property);
  var yLinearScale = yScale(data, y_property);
 
  // Create bottom(x) and left(y) axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append axes
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  chartGroup.append("g")
    .call(leftAxis); 

  // Create circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[x_property])) 
    .attr("cy", d => yLinearScale(d[y_property])) 
    .attr("r", "15") 
    .attr("class", "stateCircle") 
    .attr("opacity", ".7");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var violentcrimeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("value", "Violent Crime")
    .classed("active", true)
    .text("Violent Crime");

  var murderLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "Murder")
    .classed("inactive", true)
    .text("Murder");

    var rapeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Rape") 
    .classed("inactive", true)
    .text("Rape");  
   
    var robberyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Robbery") 
    .classed("inactive", true)
    .text("Robbery"); 

    var aggravatedassaultLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Aggravated Assault") 
    .classed("inactive", true)
    .text("AggravatedAssault"); 

    var propertycrimeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Property Crime") 
    .classed("inactive", true)
    .text("Property Crime"); 

    var burglaryLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Burglary") 
    .classed("inactive", true)
    .text("Burglary"); 

    var larcenytheftLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Larceny Theft") 
    .classed("inactive", true)
    .text("Larceny Theft"); 

    var motorvehicletheftLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Motor Vehicle Theft") 
    .classed("inactive", true)
    .text("Motor Vehicle Theft"); 

    var arsonLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Arson") 
    .classed("inactive", true)
    .text("Arson"); 

    var yearLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -60))
    .attr("value", "Year") 
    .classed("active", true)
    .text("Year");

  var populationLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -60))
    .attr("value", "population") 
    .classed("active", true)
    .text("Population");

  var cityLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -40))
    .attr("value", "city") 
    .classed("inactive", true)
    .text("City");

  //  Add text to circle
  var circleText = chartGroup.selectAll()
    .data(data)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[x_property])) 
    .attr("y", d => yLinearScale(d[y_property])) 
    .attr("class", "stateText") 
    .attr("font-size", "9");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(x_property, y_property,circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () { 
      // get value of selection
      var value = d3.select(this).attr("value");

     if(true){   
      if (value == "Violent Crime" || value=="Murder" || value=="Rape" || value=="Robbery" || value=="Aggravated Assault" || value=="Property Crime" || value=="Burglary" || value=="Larceny Theft" || value=="Motor Vehicle Theft" || value=="Arson") { 
        console.log(value)
        // replaces x_property with value
        x_property = value;
      
        xLinearScale = xScale(data, x_property);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // changes classes to change bold text
        if (x_property === "Violent Crime") {
          violentcrimeLabel
            .classed("active", true)
            .classed("inactive", false);
          murderLabel
            .classed("active", false)
            .classed("inactive", true);
          rapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          robberyLabel
            .classed("active", false)
            .classed("inactive", true);
          aggravatedassaultLabel
            .classed("active", false)
            .classed("inactive", true); 
          propertycrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          burglaryLabel
            .classed("active", false)
            .classed("inactive", true); 
          larcenytheftLabel
            .classed("active", false)
            .classed("inactive", true);
          motorvehicletheftLabel
            .classed("active", false)
            .classed("inactive", true); 
          arsonLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Murder"){ 
        violentcrimeLabel
          .classed("active", false)
          .classed("inactive", true);
        murderLabel
          .classed("active", true)
          .classed("inactive", false);
        rapeLabel
          .classed("active", false)
          .classed("inactive", true); 
        robberyLabel
          .classed("active", false)
          .classed("inactive", true);
        aggravatedassaultLabel
          .classed("active", false)
          .classed("inactive", true); 
        propertycrimeLabel
          .classed("active", false)
          .classed("inactive", true);
        burglaryLabel
          .classed("active", false)
          .classed("inactive", true); 
        larcenytheftLabel
          .classed("active", false)
          .classed("inactive", true);
        motorvehicletheftLabel
          .classed("active", false)
          .classed("inactive", true); 
        arsonLabel
          .classed("active", false)
          .classed("inactive", true); 
        }
        else if(x_property == "Rape"){ 
          violentcrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          murderLabel
            .classed("active", false)
            .classed("inactive", true);
          rapeLabel
            .classed("active", true)
            .classed("inactive", false); 
          robberyLabel
            .classed("active", false)
            .classed("inactive", true);
          aggravatedassaultLabel
            .classed("active", false)
            .classed("inactive", true); 
          propertycrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          burglaryLabel
            .classed("active", false)
            .classed("inactive", true); 
          larcenytheftLabel
            .classed("active", false)
            .classed("inactive", true);
          motorvehicletheftLabel
            .classed("active", false)
            .classed("inactive", true); 
          arsonLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Robbery"){ 
          violentcrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          murderLabel
            .classed("active", false)
            .classed("inactive", true);
          rapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          robberyLabel
            .classed("active", true)
            .classed("inactive", false);
          aggravatedassaultLabel
            .classed("active", false)
            .classed("inactive", true); 
          propertycrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          burglaryLabel
            .classed("active", false)
            .classed("inactive", true); 
          larcenytheftLabel
            .classed("active", false)
            .classed("inactive", true);
          motorvehicletheftLabel
            .classed("active", false)
            .classed("inactive", true); 
          arsonLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Aggravated Assault"){ 
          violentcrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          murderLabel
            .classed("active", false)
            .classed("inactive", true);
          rapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          robberyLabel
            .classed("active", false)
            .classed("inactive", true);
          aggravatedassaultLabel
            .classed("active", true)
            .classed("inactive", false); 
          propertycrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          burglaryLabel
            .classed("active", false)
            .classed("inactive", true); 
          larcenytheftLabel
            .classed("active", false)
            .classed("inactive", true);
          motorvehicletheftLabel
            .classed("active", false)
            .classed("inactive", true); 
          arsonLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Property Crime"){ 
          violentcrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          murderLabel
            .classed("active", false)
            .classed("inactive", true);
          rapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          robberyLabel
            .classed("active", false)
            .classed("inactive", true);
          aggravatedassaultLabel
            .classed("active", false)
            .classed("inactive", true); 
          propertycrimeLabel
            .classed("active", true)
            .classed("inactive", false);
          burglaryLabel
            .classed("active", false)
            .classed("inactive", true); 
          larcenytheftLabel
            .classed("active", false)
            .classed("inactive", true);
          motorvehicletheftLabel
            .classed("active", false)
            .classed("inactive", true); 
          arsonLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Burglary"){ 
          violentcrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          murderLabel
            .classed("active", false)
            .classed("inactive", true);
          rapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          robberyLabel
            .classed("active", false)
            .classed("inactive", true);
          aggravatedassaultLabel
            .classed("active", false)
            .classed("inactive", true); 
          propertycrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          burglaryLabel
            .classed("active", true)
            .classed("inactive", false); 
          larcenytheftLabel
            .classed("active", false)
            .classed("inactive", true);
          motorvehicletheftLabel
            .classed("active", false)
            .classed("inactive", true); 
          arsonLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Larceny Theft"){ 
          violentcrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          murderLabel
            .classed("active", false)
            .classed("inactive", true);
          rapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          robberyLabel
            .classed("active", false)
            .classed("inactive", true);
          aggravatedassaultLabel
            .classed("active", false)
            .classed("inactive", true); 
          propertycrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          burglaryLabel
            .classed("active", false)
            .classed("inactive", true); 
          larcenytheftLabel
            .classed("active", true)
            .classed("inactive", false);
          motorvehicletheftLabel
            .classed("active", false)
            .classed("inactive", true); 
          arsonLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Motor Vehcile Theft"){ 
          violentcrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          murderLabel
            .classed("active", false)
            .classed("inactive", true);
          rapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          robberyLabel
            .classed("active", false)
            .classed("inactive", true);
          aggravatedassaultLabel
            .classed("active", false)
            .classed("inactive", true); 
          propertycrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          burglaryLabel
            .classed("active", false)
            .classed("inactive", true); 
          larcenytheftLabel
            .classed("active", false)
            .classed("inactive", true);
          motorvehicletheftLabel
            .classed("active", true)
            .classed("inactive", false); 
          arsonLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else { 
            violentcrimeLabel
              .classed("active", false)
              .classed("inactive", true);
            murderLabel
              .classed("active", false)
              .classed("inactive", true);
            rapeLabel
              .classed("active", false)
              .classed("inactive", true); 
            robberyLabel
              .classed("active", false)
              .classed("inactive", true);
            aggravatedassaultLabel
              .classed("active", false)
              .classed("inactive", true); 
            propertycrimeLabel
              .classed("active", false)
              .classed("inactive", true);
            burglaryLabel
              .classed("active", false)
              .classed("inactive", true); 
            larcenytheftLabel
              .classed("active", false)
              .classed("inactive", true);
            motorvehicletheftLabel
              .classed("active", false)
              .classed("inactive", true); 
            arsonLabel
              .classed("active", true)
              .classed("inactive", false); 
        }
      }
      else 
        // replaces y_property with value
        y_property = value;
        yLinearScale = yScale(data, y_property);  
        // changes classes to change bold text
        if (y_property === "year") {
          yearLabel
            .classed("active", true)
            .classed("inactive", false);
          cityLabel
            .classed("active", false)
            .classed("inactive", true);
          populationLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(y_property == "city"){
          cityLabel
          .classed("active", true)
          .classed("inactive", false);  
          yearLabel
          .classed("active", false)
          .classed("inactive", true);
          populationLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else {
          populationLabel
            .classed("active", true)
            .classed("inactive", false);
          yearLabel
            .classed("active", false)
            .classed("inactive", true);
          cityLabel
            .classed("active", false)
            .classed("inactive", true); 
       }
    
       // updates circles with new x values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, x_property, yLinearScale, y_property);
      // update circle text
       circleText = renderText(circleText, xLinearScale, x_property, yLinearScale, y_property); 
       // updates tooltips with new info
       circlesGroup = updateToolTip(x_property, y_property, circlesGroup);

    } 
  }); 
}).catch(function (error) {
  console.log(error);
});

 // Initial test starts at ID 940
 optionChanged(940);
 
 // Event on change takes the value and calls the function during dropdown selection
 d3.select("#selDataset").on('change',() => {
 optionChanged(d3.event.target.value);
 
 });