 // Scatter Chart
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
 var y_property = "2018";
 
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
   if (x_property === "Violent Crime") {
     label = "Violent Crime:";
    }
   else if (x_property === "Murder") {
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
   else {
     label = "Arson:";
    }
 
   if (y_property === "2018") {
     ylabel = "2018:";
    }
   else 
     ylabel = "2019:";
   }
   var toolTip = d3.tip()
     .attr("class", "d3-tip")
     .offset([80, -60])
     .html(function (d) {
           if (x_property === "Violent Crime") {
             return (`${d.State}<br>${label} ${d[x_property]}%<br>${ylabel} ${d[y_property]}%`); 
           }
           else
           return (`${d.State}<br>${label} ${d[x_property]}<br>${ylabel} ${d[y_property]}%`);
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

    //return circlesGroup;
    //}

  // Import Data
  d3.csv("/static/data/state_year_avg.csv").then(function (data) {
  data.forEach(d => {
    d.ViolentCrime = +d.ViolentCrime;
    d.Murder = +d.Murder;
    d.Rape = +d.Rape;
    d.Robbery = +d.Robbery;
    d.AggravatedAssault = + d.AggravatedAssault;
    d.PropertyCrime = +d.PropertyCrime
    d.Burglary = +d.Burglary;
    d.LarcenyTheft = +d.LarcenyTheft;
    d.MotorVehicleTheft = +d.MotorVehicleTheft;
    d.Arson = +d.Arson;
    d.Year(2018) = + d.Year(2018);
    d.Year(2019) = +d.Year(2018)
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

  var ViolentCrimeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("value", "Violent Crime")
    .classed("active", true)
    .text("Violent Crime");

  var MurderLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "Murder")
    .classed("inactive", true)
    .text("Murder");

  var RapeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Rape") 
    .classed("inactive", true)
    .text("Rape");  

  var RobberyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("value", "Robbery")
    .classed("active", true)
    .text("Robbery");

  var AggravatedAssaultLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "Aggravated Assault")
    .classed("inactive", true)
    .text("Aggravated Assault");

  var PropertyCrimeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Property Crime") 
    .classed("inactive", true)
    .text("Property Crime"); 
  
  var BurglaryLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("value", "Burglary")
    .classed("active", true)
    .text("Burglary");

  var LarcenyTheftLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "Larceny")
    .classed("inactive", true)
    .text("Larceny Theft");

  var MotorVehicleTheftLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Motor Vehicle Theft") 
    .classed("inactive", true)
    .text("Motor Vehicle Theft");   
  
    var ArsonLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "Arson") 
    .classed("inactive", true)
    .text("Arson");    

  var Year2018Label = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -60))
    .attr("value", "2018") 
    .classed("active", true)
    .text("2018");

  var Year2019Label = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -40))
    .attr("value", "2019") 
    .classed("inactive", true)
    .text("2019");

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
      if (value == "Violent Crime" || value=="Murder" || value=="Rape" ||value == "Robbery" || value=="Aggravated Assault" || value=="Property Crime" || value == "Burglary" || value=="Larceny Theft" || value=="Motor Vehicle Theft" || value=="Arson") { 
        console.log(value)
        // replaces x_property with value
        x_property = value;
      
        xLinearScale = xScale(data, x_property);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // changes classes to change bold text
        if (x_property === "Arson") {
          ArsonLabel
            .classed("active", true)
            .classed("inactive", false);
          MotorVehicleLabel
            .classed("active", false)
            .classed("inactive", true);
          LarcenyTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          BurglaryLabel
            .classed("active", false)
            .classed("inactive", true);
          PropertyCrimeLabel
            .classed("active", true)
            .classed("inactive", false);
          AggravatedAssaultLabel
            .classed("active", false)
            .classed("inactive", true);
          RobberyLabel
            .classed("active", true)
            .classed("inactive", false);
          RapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          MurderLabel
            .classed("active", false)
            .classed("inactive", true);     
          ViolentCrimeLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Motor Vehicle Theft"){
          MotorVehicleLabel
            .classed("active", true)
            .classed("inactive", false);
          ArsonLabel
            .classed("active", false)
            .classed("inactive", true);
          LarcenyTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          BurglaryLabel
            .classed("active", false)
            .classed("inactive", true);
          PropertyCrimeLabel
            .classed("active", true)
            .classed("inactive", false);
          AggravatedAssaultLabel
            .classed("active", false)
            .classed("inactive", true);
          RobberyLabel
            .classed("active", true)
            .classed("inactive", false);
          RapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          MurderLabel
            .classed("active", false)
            .classed("inactive", true);     
          ViolentCrimeLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Larceny Theft"){
          LarcenyTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          ArsonLabel
            .classed("active", false)
            .classed("inactive", true);
          MotorVehicleTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          BurglaryLabel
            .classed("active", false)
            .classed("inactive", true);
          PropertyCrimeLabel
            .classed("active", true)
            .classed("inactive", false);
          AggravatedAssaultLabel
            .classed("active", false)
            .classed("inactive", true);
          RobberyLabel
            .classed("active", true)
            .classed("inactive", false);
          RapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          MurderLabel
            .classed("active", false)
            .classed("inactive", true);     
          ViolentCrimeLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Burglary"){
          BurglaryLabel
            .classed("active", true)
            .classed("inactive", false);
          ArsonLabel
            .classed("active", false)
            .classed("inactive", true);
          MotorVehicleTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          LarcenyTheftLabel
            .classed("active", false)
            .classed("inactive", true);
          PropertyCrimeLabel
            .classed("active", true)
            .classed("inactive", false);
          AggravatedAssaultLabel
            .classed("active", false)
            .classed("inactive", true);
          RobberyLabel
            .classed("active", true)
            .classed("inactive", false);
          RapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          MurderLabel
            .classed("active", false)
            .classed("inactive", true);     
          ViolentCrimeLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Property Crime"){
          PropertyCrimeLabel
            .classed("active", true)
            .classed("inactive", false);
          ArsonLabel
            .classed("active", false)
            .classed("inactive", true);
          MotorVehicleTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          LarcenyTheftLabel
            .classed("active", false)
            .classed("inactive", true);
          BurglaryLabel
            .classed("active", true)
            .classed("inactive", false);
          AggravatedAssaultLabel
            .classed("active", false)
            .classed("inactive", true);
          RobberyLabel
            .classed("active", true)
            .classed("inactive", false);
          RapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          MurderLabel
            .classed("active", false)
            .classed("inactive", true);     
          ViolentCrimeLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Aggravated Assault"){
          PropertyCrimeLabel
            .classed("active", true)
            .classed("inactive", false);
          ArsonLabel
            .classed("active", false)
            .classed("inactive", true);
          MotorVehicleTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          LarcenyTheftLabel
            .classed("active", false)
            .classed("inactive", true);
          BurglaryLabel
            .classed("active", true)
            .classed("inactive", false);
          PropertyCrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          RobberyLabel
            .classed("active", true)
            .classed("inactive", false);
          RapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          MurderLabel
            .classed("active", false)
            .classed("inactive", true);     
          ViolentCrimeLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Robbery"){
          RobberyLabel
            .classed("active", true)
            .classed("inactive", false);
          ArsonLabel
            .classed("active", false)
            .classed("inactive", true);
          MotorVehicleTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          LarcenyTheftLabel
            .classed("active", false)
            .classed("inactive", true);
          BurglaryLabel
            .classed("active", true)
            .classed("inactive", false);
          PropertyCrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          AggravatedAssaultLabel
            .classed("active", true)
            .classed("inactive", false);
          RapeLabel
            .classed("active", false)
            .classed("inactive", true); 
          MurderLabel
            .classed("active", false)
            .classed("inactive", true);     
          ViolentCrimeLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Rape"){
          RapeLabel
            .classed("active", true)
            .classed("inactive", false);
          ArsonLabel
            .classed("active", false)
            .classed("inactive", true);
          MotorVehicleTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          LarcenyTheftLabel
            .classed("active", false)
            .classed("inactive", true);
          BurglaryLabel
            .classed("active", true)
            .classed("inactive", false);
          PropertyCrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          RobberyLabel
            .classed("active", true)
            .classed("inactive", false);
          AggravatedAssaultLabel
            .classed("active", false)
            .classed("inactive", true); 
          MurderLabel
            .classed("active", false)
            .classed("inactive", true);     
          ViolentCrimeLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "Murder"){
          MurderLabel
            .classed("active", true)
            .classed("inactive", false);
          ArsonLabel
            .classed("active", false)
            .classed("inactive", true);
          MotorVehicleTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          LarcenyTheftLabel
            .classed("active", false)
            .classed("inactive", true);
          BurglaryLabel
            .classed("active", true)
            .classed("inactive", false);
          PropertyCrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          RobberyLabel
            .classed("active", true)
            .classed("inactive", false);
          AggravatedAssaultLabel
            .classed("active", false)
            .classed("inactive", true); 
          RapeLabel
            .classed("active", false)
            .classed("inactive", true);     
          ViolentCrimeLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else 
          ViolentCrimeLabel
            .classed("active", true)
            .classed("inactive", false);
          ArsonLabel
            .classed("active", false)
            .classed("inactive", true);
          MotorVehicleTheftLabel
            .classed("active", true)
            .classed("inactive", false);
          LarcenyTheftLabel
            .classed("active", false)
            .classed("inactive", true);
          BurglaryLabel
            .classed("active", true)
            .classed("inactive", false);
          PropertyCrimeLabel
            .classed("active", false)
            .classed("inactive", true);
          RobberyLabel
            .classed("active", true)
            .classed("inactive", false);
          AggravatedAssaultLabel
            .classed("active", false)
            .classed("inactive", true); 
          MurderLabel
            .classed("active", false)
            .classed("inactive", true);     
          RapeLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
      } 
      else
        // replaces y_property with value
        y_property = value;
        yLinearScale = yScale(data, y_property);  
        // changes classes to change bold text
        if (y_property === "2018") {
          Year2018Label
            .classed("active", true)
            .classed("inactive", false);
          Year2019Label
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          Year2019Label
            .classed("active", true)
            .classed("inactive", false);
          Year2018Label
            .classed("active", false)
            .classed("inactive", true); 
        }
    
       // updates circles with new x values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, x_property, yLinearScale, y_property);
       // update circle text
       circleText = renderText(circleText, xLinearScale, x_property, yLinearScale, y_property); 
       // updates tooltips with new info
       circlesGroup = updateToolTip(x_property, y_property, circlesGroup);

    }) 
 // }); 
//}).catch(function (error) {
 // console.log(error);
});