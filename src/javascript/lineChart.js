
function loadData(isFatalityChart){
  console.log(isFatalityChart)
  var parseDate = d3.timeFormat("%Y-%m-%d");
  d3.csv('https://raw.githubusercontent.com/hpandeycodeit/schoolproject/master/ds/covid-19DS.csv' ).then(function(data){
    var formatData = data.map(function(d) {
        return {
          date:  d3.timeParse("%m/%d/%Y")(d.date),
          cases:  parseInt(d.cases),
          state: d.state,
          deaths: parseInt(d.deaths)
        };
    });

    if(isFatalityChart)
    {
        plotFatalityLineChart(formatData);
    }
    else{
      plotLine(formatData);
    }

  });
}


function plotLine(data)
{



var margin = {top: 10, right: 30, bottom: 50, left: 80};
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var width=1100;
  var height=400;
  var gData = d3.nest()
            .key(function(d) { return d.date;})
            .rollup(function(d) {
             return d3.sum(d, function(g) {return g.cases; });
           }).entries(data);



  var svg = d3.select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleTime()
        .domain(d3.extent(gData, function(d) {
          return new Date(d.key);
        })).range([ 0, width ]);

      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 30) + ")")
      .style("text-anchor", "middle")
      .text("Months");

        var y = d3.scaleLinear()
              .domain([0, d3.max(gData,function(d){
                return d.value;
              })])
              .range([ height, 0 ]);
      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Cases Count");
      svg.append("g")
              .call(d3.axisLeft(y));


var startDate = new Date(gData[0].key)
var endDate = new Date(gData[59].key)
 svg
    .append("line")
      .attr("x1", x( startDate) )
      .attr("x2", x( endDate) )
      .attr("y1", - 3000000)
      .attr("y2", y(5000))
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "4")

svg
    .append("text")
    .attr("x", x( endDate) + 10)
    .attr("y", 10)
    .text("Spike in confirmed cases observed after this point: March 20th" )
    .style("font-size", "15px")

var casesLine = d3.line()
                    .x(function(d) { return x(new Date(d.key)); })
                    .y(function(d) { return y(d.value); });
svg.append("path")
      .data([gData])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", casesLine);


      var totalLength = d3.select(".line").node().getTotalLength();

      d3.selectAll(".line")
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      var bisect = d3.bisector(d => new Date(d.key));

        var focus = svg
           .append('g')
           .append('circle')
             .style("fill", "none")
             .attr("stroke", "blue")
             .attr('r', 4)
             .style("opacity", 0);


        svg
          .append('rect')
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr('width', width)
          .attr('height', height)
          .on('mouseover', mouseover)
          .on('mousemove', mousemove)
          .on('mouseout', mouseout);

        var div = d3.select('#lineChart').append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');
      function mouseover() {
        focus.style("opacity", 1)
         div.style('display', 'inline');

      }

      function mousemove() {
  
          var monthNameFt = d3.timeFormat("%B");
          var dayFormat= d3.timeFormat("%d")

          var x0 = x.invert(d3.mouse(this)[0]);
          var i = bisect.left(gData, new Date(x0));
          selectedData = gData[i]
          div
          .html( monthNameFt(new Date(selectedData.key))+ " "+dayFormat(new Date(selectedData.key)) +"<hr/>" +"Total Cases: " + selectedData.value)
          .style('left', x(new Date(selectedData.key))+20 +  'px')
          .style('top', y(selectedData.value)+300 + 'px')
          focus
           .attr("cx", x(new Date(selectedData.key)))
           .attr("cy", y(selectedData.value))
  
        }
      function mouseout() {
        focus.style("opacity", 0)
        div.style('display', 'none');

        }



      var stateGroups = d3.nest()
         .key(function(d) { return d.state;})
         .entries(data);
    allKeys = stateGroups.map(function(d){return d.key})

  var dataByStatePerDay = d3.nest()
  .key(function(d) { return d.state; })
  .key(function(j) { return j.date; })
  .rollup(function(v) { return d3.sum(v, function(d) { return d.cases; }); })
  .entries(data);
  dataByStatePerDay = dataByStatePerDay.slice().sort((a, b) => d3.ascending(a.key, b.key))



 var heightSub = 210
 var widthSub = 210
 var marginSub = {top: 30, right: 0, bottom: 30, left: 50},
    widthMargin = widthSub - marginSub.left - marginSub.right,
    heightMargin = heightSub - marginSub.top - marginSub.bottom;

    var svgStates = d3.select("#stateLineChart")
    .selectAll("uniqueChart")
    .data(dataByStatePerDay)
    .enter()
    .append("svg")
      .attr("width", widthMargin + marginSub.left + marginSub.right)
      .attr("height", heightMargin + marginSub.top + marginSub.bottom)
    .append("g")
      .attr("transform",
            "translate(" + marginSub.left + "," + marginSub.top + ")");


var maxDate = getMaxDate(dataByStatePerDay);
var minDate = getMinDate(dataByStatePerDay);
var tickVals= [minDate, maxDate];


var xs = d3.scaleTime()
  .domain([minDate, maxDate]).range([ 0, widthMargin ]);


  svg.append("g")
          .call(d3.axisLeft(y));


  var ys = d3.scaleLinear()
          .domain([0, d3.max(dataByStatePerDay,function(d,i){
            var length = d.values.length;
            return d.values[length-1].value+100000;
          })]).range([ heightMargin, 0 ]);
  svgStates
      .append("g")
      .attr("transform", "translate(0," + heightMargin + ")")
      .call(d3.axisBottom(xs).tickFormat(d3.timeFormat("%b")));
  svgStates.append("g")
    .call(d3.axisLeft(ys).ticks(5));


  // color palette
  var color = d3.scaleOrdinal()
    .domain(allKeys)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#4B0082','#a65628','#f781bf','#4682B4'])

  // Draw the line
  svgStates
    .append("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return color(d.key) })
      .attr("stroke-width", 2.5)
      .attr("d", function(d){
        return d3.line()
          .x(function(dt,i) {
            return xs(new Date(dt.key));
          })
          .y(function(cs,i) {
            return ys(+cs.value);
          })
          (d.values)
      })

  svgStates
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", 5)
    .attr("x", 2)
    .text(function(d){ return(d.key)})
    .style("fill", function(d){ return color(d.key) })


}

function getMaxDate( data ) {

    var max = d3.max(data.map(function(array) {

      var dt = new Date(d3.max(array.values, d=> (new Date(d.key)).getTime()))
        dt.setDate(dt.getDate()+ 1);
      return  dt;
}));
return max;
}

function getMinDate(data)
{
  var min = d3.min(data.map(function(array) {
    var dt  = new Date(d3.min(array.values, d=> (new Date(d.key)).getTime()));
    dt.setDate(dt.getDate()+ 1);
    return  dt;
}));
return min;
}

function plotFatalityLineChart(data)
{
  var margin = {top: 10, right: 30, bottom: 50, left: 80};
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var width=1100;
  var height=400;
  var fatalityData = d3.nest()
            .key(function(d) { return d.date;})
            .rollup(function(d) {
             return d3.sum(d, function(g) {return g.deaths; });
           }).entries(data);


     var svgFatalityChart = d3.select("#fatalitisChart")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform",
               "translate(" + margin.left + "," + margin.top + ")");

     var x = d3.scaleTime()
       .domain(d3.extent(fatalityData, function(d) {
         return new Date(d.key);
       })).range([ 0, width ]);

     svgFatalityChart.append("text")
     .attr("transform",
           "translate(" + (width/2) + " ," +
                          (height + margin.top + 30) + ")")
     .style("text-anchor", "middle")
     .text("Months");



     svgFatalityChart.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));

     var y = d3.scaleLinear()
           .domain([0, d3.max(fatalityData,function(d){
             return d.value;
           })])
           .range([ height, 0 ]);

     svgFatalityChart.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left)
     .attr("x",0 - (height / 2))
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("Deaths Count");
     svgFatalityChart.append("g")
             .call(d3.axisLeft(y));


var startDate = new Date(fatalityData[0].key)
var endDate = new Date(fatalityData[62].key)
 svgFatalityChart
    .append("line")
      .attr("x1", x( startDate)) 
      .attr("x2", x( endDate) )
      .attr("y1", - 2500000)
      .attr("y2", y(500))
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "4")

svgFatalityChart
    .append("text")
    .attr("x", x(endDate) + 10)
    .attr("y", 10)
    .text("Spike in deaths observed after this point: March 23rd" )
    .style("font-size", "15px")


     var fatalityLine = d3.line()
                         .x(function(d) { return x(new Date(d.key)); })
                         .y(function(d) { return y(d.value); });
     svgFatalityChart.append("path")
           .data([fatalityData])
           .attr("class", "fline")
           .attr("fill", "none")
           .attr("stroke", "steelblue")
           .attr("stroke-width", 2.5)
           .attr("stroke-linejoin", "round")
           .attr("stroke-linecap", "round")
           .attr("d", fatalityLine);


    var totalLength = d3.select(".fline").node().getTotalLength();

   d3.selectAll(".fline")
     .attr("stroke-dasharray", totalLength + " " + totalLength)
     .attr("stroke-dashoffset", totalLength)
     .transition()
     .duration(5000)
     .ease(d3.easeLinear)
     .attr("stroke-dashoffset", 0);

    var bisect = d3.bisector(d => new Date(d.key));

     var focus = svgFatalityChart
        .append('g')
        .append('circle')
          .style("fill", "none")
          .attr("stroke", "blue")
          .attr('r', 4)
          .style("opacity", 0);


     svgFatalityChart
       .append('rect')
       .style("fill", "none")
       .style("pointer-events", "all")
       .attr('width', width)
       .attr('height', height)
       .on('mouseover', mouseover)
       .on('mousemove', mousemove)
       .on('mouseout', mouseout);

       var div = d3.select('#lineChart').append('div')
           .attr('class', 'tooltip')
           .style('display', 'none');
     function mouseover() {
       focus.style("opacity", 1)
        div.style('display', 'inline');

     }

     function mousemove() {

         var monthNameFt = d3.timeFormat("%B");
         var dayFormat= d3.timeFormat("%d")

         var x0 = x.invert(d3.mouse(this)[0]);
         var i = bisect.left(fatalityData, new Date(x0));
         selectedData = fatalityData[i]
         div
         .html( monthNameFt(new Date(selectedData.key))+ " "+dayFormat(new Date(selectedData.key)) +"<hr/>" +"Total Cases: " + selectedData.value)
         .style('left', x(new Date(selectedData.key))+20 +  'px')
         .style('top', y(selectedData.value)+260 + 'px')
         focus
          .attr("cx", x(new Date(selectedData.key)))
          .attr("cy", y(selectedData.value))

       }
     function mouseout() {
       focus.style("opacity", 0)
        div.style('display', 'none');

       }



   var stateGroups = d3.nest() 
          .key(function(d) { return d.state;})
          .entries(data);
     allKeys = stateGroups.map(function(d){return d.key})

     var dataByStatePerDay = d3.nest()
     .key(function(d) { return d.state; })
     .key(function(j) { return j.date; })
     .rollup(function(v) { return d3.sum(v, function(d) { return d.deaths; }); })
     .entries(data);

     dataByStatePerDay = dataByStatePerDay.slice().sort((a, b) => d3.ascending(a.key, b.key))

     var heightSub = 210
     var widthSub = 210
     var marginSub = {top: 30, right: 0, bottom: 30, left: 50},
     widthMargin = widthSub - marginSub.left - marginSub.right,
     heightMargin = heightSub - marginSub.top - marginSub.bottom;

     var svgStates = d3.select("#stateFatalityLineChart")
     .selectAll("uniqueChart")
     .data(dataByStatePerDay)
     .enter()
     .append("svg")
       .attr("width", widthMargin + marginSub.left + marginSub.right)
       .attr("height", heightMargin + marginSub.top + marginSub.bottom)
     .append("g")
       .attr("transform",
             "translate(" + marginSub.left + "," + marginSub.top + ")");

     // Add X axis --> it is a date format


     var maxDate = getMaxDate(dataByStatePerDay);
     var minDate = getMinDate(dataByStatePerDay);
     var tickVals= [minDate, maxDate];
     //  var xs = d3.scaleTime()
     //      .domain(xm).range([ 0, 100 ]).nice();

     var xs = d3.scaleTime()
     .domain([minDate, maxDate]).range([ 0, widthMargin ]);



     var ys = d3.scaleLinear()
           .domain([0, d3.max(dataByStatePerDay,function(d,i){
             var length = d.values.length;
             return d.values[length-1].value+15000;
           })]).range([ heightMargin, 0 ]);
     svgStates
       .append("g")
       .attr("transform", "translate(0," + heightMargin + ")")
       .call(d3.axisBottom(xs).tickFormat(d3.timeFormat("%b")));
     svgStates.append("g")
     .call(d3.axisLeft(ys).ticks(5));


     // color palette
     var color = d3.scaleOrdinal()
     .domain(allKeys)
     .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#4B0082','#a65628','#f781bf','#4682B4'])

     // Draw the line
     svgStates
     .append("path")
       .attr("fill", "none")
       .attr("stroke", function(d){ return color(d.key) })
       .attr("stroke-width", 2.5)
       .attr("d", function(d){
         return d3.line()
           .x(function(dt,i) {
             return xs(new Date(dt.key));
           })
           .y(function(cs,i) {
             return ys(+cs.value);
           })
           (d.values)
       })

     // Add titles
     svgStates
     .append("text")
     .attr("text-anchor", "start")
     .attr("y", 5)
     .attr("x", 2)
     .text(function(d){ return(d.key)})
     .style("fill", function(d){ return color(d.key) })


}


function selectCasesOrFatalities(val)
{
  if(val == "fatalities")
  {
    document.getElementById("fatalitisChartDiv").style.display =  "block";
    document.getElementById("casesDiv").style.display = "none";
  }else {
    document.getElementById("fatalitisChartDiv").style.display = "none";
    document.getElementById("casesDiv").style.display =  "block";
  }

}
