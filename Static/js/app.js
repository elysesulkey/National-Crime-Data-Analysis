// Function for change on dropdown menu
function OptionMenu(selectedYear, selectedState) {

    // Check if value selected in dropdown
    //console.log(selectedYear, selectedState);
  
    // Read the json file for the data
    d3.json("/static/data/state_year_avg.json").then((data) => {
  
    //console.log(data);
      
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

// BAR CHART
 // Filter data for selected year and state
    var AverageEntries = Object.entries(AveragesReport[0]).slice(3,13);
    AverageEntries = AverageEntries.sort()
    console.log(AverageEntries)

    var CrimeAverages = AverageEntries.map(element => element[1])
    console.log(CrimeAverages)
  
    var CrimeType = AverageEntries.map(element => element[0]);
    console.log(CrimeType)

    // Y axis of bar chart
    const yAxis = CrimeType.map(item => item);
    
    // Define the layout and trace object, edit color and orientation
       const trace = {
       y: yAxis,
       x: CrimeAverages,
       type: 'bar',
       orientation: "h",
       text:  CrimeType,
       marker: {
          color: "#9370db",
          line: {
            width: 1
          }
        }
       },
       layout = {
       title: 'Average Reported Crime by Type',
       xaxis: {title: 'Average # Crimes Committed'},
       yaxis: {title: 'Crime Type'}
       };
 
       // Plot using Plotly
       Plotly.newPlot('bar', [trace], layout,  {responsive: true}); 

 // Initial test starts
});
}
 OptionMenu(2018, "ARIZONA")
 
 // Event on change takes the value and calls the function during dropdown selection
 d3.select("#selectedYear").on('change',() => {
   var State = d3.select("#selectedState").property("value")
  OptionMenu(d3.event.target.value, State);
 });

 d3.select("#selectedState").on('change',() => {
   var Year = d3.select("#selectedYear").property("value")
  OptionMenu(Year, d3.event.target.value);
 });
