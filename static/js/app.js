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
          color: "cornflowerblue",
          line: {
            width: 1
          }
        }
       },
       layout = {
       title: '<b> Average Reported Crime by Type',
       xaxis: {title: 'Average # Crimes Reported'},
       yaxis: {title: 'Crime Category', automargin: true}
       };
 
       // Plot using Plotly
       Plotly.newPlot('bar', [trace], layout,  {responsive: true}); 

// GAUGE CHART

 // Gauge Chart to plot weekly washing frequency 
 const guageDisplay = d3.select("#gauge");
 guageDisplay.html(""); 

 var ReportTotalCrime = CrimeAverages.reduce((a,b) => a + b, 0);
 console.log(ReportTotalCrime)

 var PopulationLine = Object.entries(AveragesReport[0]).slice(2,3)
 var ReportPopulation = (PopulationLine.map(element => element[1])).reduce((a,b) => a + b, 0);
 console.log(ReportPopulation)

 const crimefreq = (ReportTotalCrime / ReportPopulation) * 100

 console.log(crimefreq)
  
 const guageData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: crimefreq,
      title: { text: "<b> Crime Experience Frequency (Total Crimes/Population)" },
      type: "indicator",
      mode: "gauge+number",    

       gauge: {
       axis: { range: [0,100] },
      
       
       steps: [
          { range: [0, 20], color: "green" },
          { range: [20,40], color: "lightgreen"},
          { range: [40, 60], color: "yellow" },
          { range: [60, 80], color: "orange" },
          { range: [80, 100], color: "red" }     
        ],
       threshold: {
          value: crimefreq
        }
      }
    }
  ]; 
  const gaugeLayout = {  width:650, 
                   height: 400, 
                   margin: { t: 0, b: 0 }, 
                    };
 
 // Plot using Plotly
  Plotly.newPlot('gauge', guageData, gaugeLayout);   
 });
 }
 
 // Initial test starts
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
