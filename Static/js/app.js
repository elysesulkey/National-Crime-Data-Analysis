// Function for change on dropdown menu
function OptionMenu(selectedYear, selectedState) {

    // Check if value selected in dropdown
    console.log(selectedYear, selectedState);
  
    // Read the json file for the data
    d3.json("../data/state_year_avg.json").then((data) => {
  
    //console.log(data);
  
    // Clear dropdown
    d3.select("#selectedYear", "#selectedState").html("");
      
    // Select year & append to dropdown
    let YearOption = [...new Set(data.map(item => item.Year))];
      d3.select("#selectedYear")
        .selectAll("option")
          .data(YearOption)
        .enter()
          .append("option")
          .text(item => item)
          .attr("value", item => item);
        
    // Select state & append to dropdown
    let StateOption = [...new Set(data.map(item => item.State))].sort();
      d3.select("#selectedState")
        .selectAll("option")
          .data(StateOption)
        .enter()
          .append("option")
          .text(item => item)
          .attr("value", item => item);     

    // Selected value passed
    d3.select("#selectedYear", "#selectedState").node().value = selectedYear, selectedState;

    // Filter data for selected year and state
    const AveragesReport = data.filter(item => (item.Year == selectedYear && item.State == selectedState));

    // Check the loaded report data
    console.log(AveragesReport);
    
    const panelDisplay = d3.select("#ReportInfo");
    panelDisplay.html("");
    Object.entries(AveragesReport[0]).forEach(item=> 
       {
          panelDisplay.append("p").text(`${item[0]}: ${item[1]}`)
       });
  });
  }

 // Initial test starts
 OptionMenu(2018, "ARIZONA")
 
 // Event on change takes the value and calls the function during dropdown selection
 d3.select("#selectedYear", "#selectedState").on('change',() => {
  OptionMenu(d3.event.target.value);
 });
