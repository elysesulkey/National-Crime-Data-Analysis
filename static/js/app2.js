// D3 Animated Scatter Plot

// Function for change on dropdown menu


// Section 1: Pre-Data Setup
// ===========================
// Before we code any data visualizations,
// we need to at least set up the width, height and margins of the graph.
// Note: I also added room for label text as well as text padding,
// though not all graphs will need those specifications.

// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));


// Designate the height of the graph
var height = width - width / 4.7;

// Margin spacing for graph
var margin = 20;

// space for placing words
var labelArea = 200;

// padding for the text at the bottom and left axes
var tPadBot = 90;
var tPadLeft = 120;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

function yearChanged(yearSelected) {
  console.log(yearSelected)
  // Import our CSV data with d3's .csv import method.
  d3.csv("static/data/state_year_avg.csv").then(function (data) {
    // Visualize the data
    visualize(data, yearSelected);
    // console.log(data)
  });
}


// Import our CSV data with d3's .csv import method.
d3.csv("static/data/state_year_avg.csv").then(function (data) {
  // Visualize the data
  visualize(data, "2018");
  // console.log(data)
});

// 3. Create our visualization function
// ====================================
// We called a "visualize" function on the data obtained with d3's .csv method.
// This function handles the visual manipulation of all elements dependent on the data.
function visualize(incomingData, yearSelected) {
  svg.html("")

  // Set the radius for each dot that will appear in the graph.
  // Note: Making this a function allows us to easily call
  // it in the mobility section of our code.
  var circRadius;
  function crGet() {
    if (width <= 530) {
      circRadius = 5;
    }
    else {
      circRadius = 10;
    }
  }
  crGet();

  // The Labels for our Axes

  // A) Bottom Axis
  // ==============

  // We create a group element to nest our bottom axes labels.
  svg.append("g").attr("class", "xText");
  // xText will allows us to select the group without excess code.
  var xText = d3.select(".xText");

  // We give xText a transform property that places it at the bottom of the chart.
  // By nesting this attribute in a function, we can easily change the location of the label group
  // whenever the width of the window changes.
  function xTextRefresh() {
    xText.attr(
      "transform",
      "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
    );
  }
  xTextRefresh();

  // Now we use xText to append three text SVG files, with y coordinates specified to space out the values.
  // 
  xText
    .append("text")
    .attr("y", -70)
    .attr("data-name", "Violent Crime")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("Violent Crimes");

  xText
    .append("text")
    .attr("y", -50)
    .attr("data-name", "Murder")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Murders");

  xText
    .append("text")
    .attr("y", -30)
    .attr("data-name", "Rape")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Rapes");

  xText
    .append("text")
    .attr("y", -10)
    .attr("data-name", "Robbery")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Robberies");

  xText
    .append("text")
    .attr("y", 10)
    .attr("data-name", "Aggravated Assault")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Aggravated Assaults");

  xText
    .append("text")
    .attr("y", 30)
    .attr("data-name", "Property Crime")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Property Crimes");

  xText
    .append("text")
    .attr("y", 50)
    .attr("data-name", "Burglary")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Burglaries");

  xText
    .append("text")
    .attr("y", 70)
    .attr("data-name", "Larceny Theft")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Larceny Thefts");

  xText
    .append("text")
    .attr("y", 90)
    .attr("data-name", "Motor Vehicle Theft")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Motor Vehicle Thefts");

  xText
    .append("text")
    .attr("y", 110)
    .attr("data-name", "Arson")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Arsons");


  // B) Left Axis
  // ============

  // Specifying the variables like this allows us to make our transform attributes more readable.
  var leftTextX = margin + tPadLeft;
  var leftTextY = (height + labelArea) / 2 - labelArea;

  // We add a second label group, this time for the axis left of the chart.
  svg.append("g").attr("class", "yText");

  // yText will allows us to select the group without excess code.
  var yText = d3.select(".yText");

  // Like before, we nest the group's transform attr in a function
  // to make changing it on window change an easy operation.
  function yTextRefresh() {
    yText.attr(
      "transform",
      "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
  }
  yTextRefresh();

  // Now we append the text.
  // 1. Population
  yText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "Population")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Population");

  
  // 2. Import our .csv file.
  // ========================
  // This data file includes state-by-state demographic data from the US Census
  // and measurements from health risks obtained
  // by the Behavioral Risk Factor Surveillance System.
  // PART 1: Essential Local Variables and Functions
  // =================================
  // curX and curY will determine what data gets represented in each axis.
  // We designate our defaults here, which carry the same names
  // as the headings in their matching .csv data file.

  var theData = incomingData.filter(state => state.Year == yearSelected);
  console.log(theData)
  var curX = "Violent Crime";
  var curY = "Population";

  // We also save empty variables for our the min and max values of x and y.
  // this will allow us to alter the values in functions and remove repetitious code.
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // This function allows us to set up tooltip rules (see d3-tip.js).
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function (d) {
      // x key
      var theX;
      // Grab the state name.
      var theState = "<div>" + d.State + "</div>";
      // Snatch the y value's key and value.
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      // If the x key is poverty
      if (curX === "Violent Crime") {
        // Grab the x key and a version of the value formatted to show percentage
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        // Otherwise
        // Grab the x key and a version of the value formatted to include commas after every third digit.
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      // Display what we capture.
      return theState + theX + theY;
    });
  // Call the toolTip function.
  svg.call(toolTip);

  // PART 2: D.R.Y!
  // ==============
  // These functions remove some repitition from later code.
  // This will be more obvious in parts 3 and 4.

  // a. change the min and max for x
  function xMinMax() {
    // min will grab the smallest datum from the selected column.
    xMin = d3.min(theData, function (d) {
      return parseFloat(d[curX]) * 0.90;
    });

    // .max will grab the largest datum from the selected column.
    xMax = d3.max(theData, function (d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  // b. change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(theData, function (d) {
      return parseFloat(d[curY]) * 0.90;
    });

    // .max will grab the largest datum from the selected column.
    yMax = d3.max(theData, function (d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  // c. change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }

  // Part 3: Instantiate the Scatter Plot
  // ====================================
  // This will add the first placement of our data and axes to the scatter plot.

  // First grab the min and max values of x and y.
  xMinMax();
  yMinMax();

  // With the min and max values now defined, we can create our scales.
  // Notice in the range method how we include the margin and word area.
  // This tells d3 to place our circles in an area starting after the margin and word area.
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin - labelArea, margin]);

  // We pass the scales into the axis methods to create the axes.
  // Note: D3 4.0 made this a lot less cumbersome then before. Kudos to mbostock.
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Determine x and y tick counts.
  // Note: Saved as a function for easy mobile updates.
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  // We append the axes in group elements. By calling them, we include
  // all of the numbers, borders and ticks.
  // The transform attribute specifies where to place the axes.
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("#scatter circle").data(theData).enter();

  // We append the circles for each row of data (or each state, in this case).
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function (d) {
      return xScale(d[curX]);
    })
    .attr("cy", function (d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function (d) {
      return "stateCircle " + d.abbr;
    })
    // Hover rules
    .on("mouseover", function (d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function (d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // With the circles on our graph, we need matching labels.
  // Let's grab the state abbreviations from our data
  // and place them in the center of our dots.
  theCircles
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function (d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function (d) {
      return xScale(d[curX]);
    })
    .attr("dy", function (d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function (d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function (d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  // Part 4: Make the Graph Dynamic
  // ==========================
  // This section will allow the user to click on any label
  // and display the data it references.

  // Select all axis text and add this d3 click event.
  d3.selectAll(".aText").on("click", function () {

    // Make sure we save a selection of the clicked text,
    // so we can reference it without typing out the invoker each time.
    var self = d3.select(this);

    // We only want to run this on inactive labels.
    // It's a waste of the processor to execute the function
    // if the data is already displayed on the graph.
    if (self.classed("inactive")) {
      // Grab the name and axis saved in label.
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      // When x is the saved axis, execute this:
      if (axis === "x") {
        // Make curX the same as the data name.
        curX = name;

        // Change the min and max of the x-axis
        xMinMax();

        // Update the domain of x.
        xScale.domain([xMin, xMax]);

        // Now use a transition when we update the xAxis.
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll('#scatter circle').each(function(a) {
          d3.select(this)
            .transition()
            .duration(300)
            .attr("cx", function (d) {
         
              return xScale(d[curX]);
            })

        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function () {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dx", function (d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
      else {
        // When y is the saved axis, execute this:
        // Make curY the same as the data name.
        curY = name;

        // Change the min and max of the y-axis.
        yMinMax();

        // Update the domain of y.
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("#scatter circle").each(function () {
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3
            .select(this)
            .transition()
            .attr("cy", function (d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function () {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dy", function (d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
    }
  });

  // Part 5: Mobile Responsive
  // =========================
  // With d3, we can call a resize function whenever the window dimensions change.
  // This make's it possible to add true mobile-responsiveness to our charts.
  d3.select(window).on("resize", resize);

  // One caveat: we need to specify what specific parts of the chart need size and position changes.
  function resize() {
    // Redefine the width, height and leftTextY (the three variables dependent on the width of the window).
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    // Apply the width and height to the svg canvas.
    svg.attr("width", width).attr("height", height);

    // Change the xScale and yScale ranges
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    // With the scales changes, update the axes (and the height of the x-axis)
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    // Update the ticks on each axis.
    tickCount();

    // Update the labels.
    xTextRefresh();
    yTextRefresh();

    // Update the radius of each dot.
    crGet();

    // With the axis changed, let's update the location and radius of the state circles.
    d3
      .selectAll("circle")
      .attr("cy", function (d) {
        return yScale(d[curY]);
      })
      .attr("cx", function (d) {
        return xScale(d[curX]);
      })
      .attr("r", function () {
        return circRadius;
      });

    // We need change the location and size of the state texts, too.
    d3
      .selectAll(".stateText")
      .attr("dy", function (d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function (d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
  }
}

// // Scatter Chart
// // Set up chart
// var svgWidth = 900;
// var svgHeight = 600;

// var margin = {
//   top: 20,
//   right: 40,
//   bottom: 100,
//   left: 100
// };

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// // Create an SVG wrapper, append SVG group to hold chart & shift left and top margins.
// var svg = d3.select("#scatter")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

// var chartGroup = svg.append("g")
//   .attr("height", height)
//   .attr("width", width)
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Initial paramaters
// var x_property = "Violent Crime";
// var y_property = "2018";

// // Update x-scale & create scales
// function xScale(data, x_property) {
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(data, d => d[x_property]) * 0.8,
//     d3.max(data, d => d[x_property]) * 1.2
//     ])
//     .range([0, width]);
//   return xLinearScale;
// }

// // Create function to update x-scale when clicking axis label & create scales
// function yScale(data, y_property) {
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(data, d => d[y_property]) * 0.8,
//     d3.max(data, d => d[y_property]) * 1.1
//     ])
//     .range([height, 0]);
//   return yLinearScale;
// }

// // Create function to update xAxis when clicking axis label
// function renderXAxis(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);
//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);
//   return xAxis;
// }

// // Create function to update xAxis when clicking Y axis label
// function renderyAxis(newYScale, yAxis) {
//   var leftAxis = d3.axisLeft(newYScale);
//   yAxis.transition()
//     .duration(500)
//     .call(leftAxis);
//   return yAxis;
// }

// // Create function to update circles
// function renderCircles(circlesGroup, newXScale, x_property, newYScale, y_property) {
//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[x_property]))
//     .attr("cy", d => newYScale(d[y_property]));
//   return circlesGroup;
// }

// function renderText(circleText, newXScale, x_property, newYScale, y_property) {
//   circleText.transition()
//     .duration(1000)
//     .attr("x", d => newXScale(d[x_property]))
//     .attr("y", d => newYScale(d[y_property]));
//   return circleText;
// }

// function updateToolTip(x_property, y_property, circlesGroup) {
//   console.log("update tool tip", x_property);
//   var label;

//   // Set x & y axis label on tooltip 
//   if (x_property === "Violent Crime") {
//     label = "Violent Crime:";
//   }
//   else if (x_property === "Murder") {
//     label = "Murder:";
//   }
//   else if (x_property === "Rape") {
//     label = "Rape:";
//   }
//   else if (x_property === "Robbery") {
//     label = "Robbery:";
//   }
//   else if (x_property === "Aggravated Assault") {
//     label = "Aggravated Assault:";
//   }
//   else if (x_property === "Property Crime") {
//     label = "Property Crime:";
//   }
//   else if (x_property === "Burglary") {
//     label = "Burglary:";
//   }
//   else if (x_property === "Larceny Theft") {
//     label = "Larceny Theft:";
//   }
//   else if (x_property === "Motor Vehicle Theft") {
//     label = "Motor Vehicle Theft:";
//   }
//   else {
//     label = "Arson:";
//   }

//   if (y_property === "2018") {
//     ylabel = "2018:";
//   }
//   else
//     ylabel = "2019:";

//   var toolTip = d3.tip()
//     .attr("class", "d3-tip")
//     .offset([80, -60])
//     .html(function (d) {
//       if (x_property === "Violent Crime") {
//         return (`${d.State}<br>${label} ${d[x_property]}%<br>${ylabel} ${d[y_property]}%`);
//       }
//       else
//         return (`${d.State}<br>${label} ${d[x_property]}<br>${ylabel} ${d[y_property]}%`);
//     });

//   //function chosen x and y tooltip
//   circlesGroup.call(toolTip);
//   circlesGroup.on("mouseover", function (data) {
//     toolTip.show(data, this);
//   })
//     // on mouseout event
//     .on("mouseout", function (data, index) {
//       toolTip.hide(data, this);
//     });

//   //return circlesGroup;
//   //}
// }
// // Import Data
// d3.csv("/static/data/state_year_avg.csv").then(function (data) {
//   data.forEach(d => {
//     d.ViolentCrime = +d.ViolentCrime;
//     d.Murder = +d.Murder;
//     d.Rape = +d.Rape;
//     d.Robbery = +d.Robbery;
//     d.AggravatedAssault = + d.AggravatedAssault;
//     d.PropertyCrime = +d.PropertyCrime
//     d.Burglary = +d.Burglary;
//     d.LarcenyTheft = +d.LarcenyTheft;
//     d.MotorVehicleTheft = +d.MotorVehicleTheft;
//     d.Arson = +d.Arson;
//     d.Year["2018"] = +d.Year["2018"];
//     d.Year["2019"] = +d.Year["2019"]
//   });

//   // LinearScale functions 
//   var xLinearScale = xScale(data, x_property);
//   var yLinearScale = yScale(data, y_property);

//   // Create bottom(x) and left(y) axis functions
//   var bottomAxis = d3.axisBottom(xLinearScale);
//   var leftAxis = d3.axisLeft(yLinearScale);

//   // Append axes
//   var xAxis = chartGroup.append("g")
//     .attr("transform", `translate(0, ${height})`)
//     .call(bottomAxis);

//   chartGroup.append("g")
//     .call(leftAxis);

//   // Create circles
//   var circlesGroup = chartGroup.selectAll("circle")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("cx", d => xLinearScale(d[x_property]))
//     .attr("cy", d => yLinearScale(d[y_property]))
//     .attr("r", "15")
//     .attr("class", "stateCircle")
//     .attr("opacity", ".7");

//   // Create group for two x-axis labels
//   var labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);

//   var ViolentCrimeLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 15)
//     .attr("value", "Violent Crime")
//     .classed("active", true)
//     .text("Violent Crime");

//   var MurderLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 30)
//     .attr("value", "Murder")
//     .classed("inactive", true)
//     .text("Murder");

//   var RapeLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 45)
//     .attr("value", "Rape")
//     .classed("inactive", true)
//     .text("Rape");

//   var RobberyLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 15)
//     .attr("value", "Robbery")
//     .classed("active", true)
//     .text("Robbery");

//   var AggravatedAssaultLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 30)
//     .attr("value", "Aggravated Assault")
//     .classed("inactive", true)
//     .text("Aggravated Assault");

//   var PropertyCrimeLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 45)
//     .attr("value", "Property Crime")
//     .classed("inactive", true)
//     .text("Property Crime");

//   var BurglaryLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 15)
//     .attr("value", "Burglary")
//     .classed("active", true)
//     .text("Burglary");

//   var LarcenyTheftLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 30)
//     .attr("value", "Larceny")
//     .classed("inactive", true)
//     .text("Larceny Theft");

//   var MotorVehicleTheftLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 45)
//     .attr("value", "Motor Vehicle Theft")
//     .classed("inactive", true)
//     .text("Motor Vehicle Theft");

//   var ArsonLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 45)
//     .attr("value", "Arson")
//     .classed("inactive", true)
//     .text("Arson");

//   var Year2018Label = labelsGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("x", (margin.left) * 2.5)
//     .attr("y", 0 - (height - 60))
//     .attr("value", "2018")
//     .classed("active", true)
//     .text("2018");

//   var Year2019Label = labelsGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("x", (margin.left) * 2.5)
//     .attr("y", 0 - (height - 40))
//     .attr("value", "2019")
//     .classed("inactive", true)
//     .text("2019");

//   //  Add text to circle
//   var circleText = chartGroup.selectAll()
//     .data(data)
//     .enter()
//     .append("text")
//     .text(d => d.abbr)
//     .attr("x", d => xLinearScale(d[x_property]))
//     .attr("y", d => yLinearScale(d[y_property]))
//     .attr("class", "stateText")
//     .attr("font-size", "9");

//   // updateToolTip function above csv import
//   var circlesGroup = updateToolTip(x_property, y_property, circlesGroup);

//   // x axis labels event listener
//   labelsGroup.selectAll("text")
//     .on("click", function () {
//       // get value of selection
//       var value = d3.select(this).attr("value");

//       if (true) {
//         if (value == "Violent Crime" || value == "Murder" || value == "Rape" || value == "Robbery" || value == "Aggravated Assault" || value == "Property Crime" || value == "Burglary" || value == "Larceny Theft" || value == "Motor Vehicle Theft" || value == "Arson") {
//           console.log(value)
//           // replaces x_property with value
//           x_property = value;

//           xLinearScale = xScale(data, x_property);

//           // updates x axis with transition
//           xAxis = renderXAxis(xLinearScale, xAxis);

//           // changes classes to change bold text
//           if (x_property === "Arson") {
//             ArsonLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             MotorVehicleLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             LarcenyTheftLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             BurglaryLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             PropertyCrimeLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             AggravatedAssaultLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             RobberyLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             RapeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MurderLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ViolentCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else if (x_property == "Motor Vehicle Theft") {
//             MotorVehicleLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             ArsonLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             LarcenyTheftLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             BurglaryLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             PropertyCrimeLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             AggravatedAssaultLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             RobberyLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             RapeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MurderLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ViolentCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else if (x_property == "Larceny Theft") {
//             LarcenyTheftLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             ArsonLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MotorVehicleTheftLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             BurglaryLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             PropertyCrimeLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             AggravatedAssaultLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             RobberyLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             RapeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MurderLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ViolentCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else if (x_property == "Burglary") {
//             BurglaryLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             ArsonLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MotorVehicleTheftLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             LarcenyTheftLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             PropertyCrimeLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             AggravatedAssaultLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             RobberyLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             RapeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MurderLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ViolentCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else if (x_property == "Property Crime") {
//             PropertyCrimeLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             ArsonLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MotorVehicleTheftLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             LarcenyTheftLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             BurglaryLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             AggravatedAssaultLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             RobberyLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             RapeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MurderLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ViolentCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else if (x_property == "Aggravated Assault") {
//             PropertyCrimeLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             ArsonLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MotorVehicleTheftLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             LarcenyTheftLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             BurglaryLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             PropertyCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             RobberyLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             RapeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MurderLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ViolentCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else if (x_property == "Robbery") {
//             RobberyLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             ArsonLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MotorVehicleTheftLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             LarcenyTheftLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             BurglaryLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             PropertyCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             AggravatedAssaultLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             RapeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MurderLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ViolentCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else if (x_property == "Rape") {
//             RapeLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             ArsonLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MotorVehicleTheftLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             LarcenyTheftLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             BurglaryLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             PropertyCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             RobberyLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             AggravatedAssaultLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MurderLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ViolentCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else if (x_property == "Murder") {
//             MurderLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             ArsonLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             MotorVehicleTheftLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             LarcenyTheftLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             BurglaryLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             PropertyCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             RobberyLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             AggravatedAssaultLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             RapeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ViolentCrimeLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else
//             ViolentCrimeLabel
//               .classed("active", true)
//               .classed("inactive", false);
//           ArsonLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           MotorVehicleTheftLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           LarcenyTheftLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           BurglaryLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           PropertyCrimeLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           RobberyLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           AggravatedAssaultLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           MurderLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           RapeLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//       }
//       else {
//         // replaces y_property with value
//         y_property = value;
//       yLinearScale = yScale(data, y_property);
//       }
//       // changes classes to change bold text
//       if (y_property === "2018") {
//         Year2018Label
//           .classed("active", true)
//           .classed("inactive", false);
//         Year2019Label
//           .classed("active", false)
//           .classed("inactive", true);
//       }
//       else {
//         Year2019Label
//           .classed("active", true)
//           .classed("inactive", false);
//         Year2018Label
//           .classed("active", false)
//           .classed("inactive", true);
//       }

//       // updates circles with new x values
//       circlesGroup = renderCircles(circlesGroup, xLinearScale, x_property, yLinearScale, y_property);
//       // update circle text
//       circleText = renderText(circleText, xLinearScale, x_property, yLinearScale, y_property);
//       // updates tooltips with new info
//       circlesGroup = updateToolTip(x_property, y_property, circlesGroup);

//     })
//   // }); 
//   //}).catch(function (error) {
//   // console.log(error);
// });