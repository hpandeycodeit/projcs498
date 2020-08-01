
function loadData(isFatalityChart){
  console.log(isFatalityChart)
  var parseDate = d3.timeFormat("%Y-%m-%d");
  d3.csv('https://raw.githubusercontent.com/hpandeycodeit/schoolproject/master/covid-19DS.csv' ).then(function(data){
    //console.log(data[1609]);
    var formatData = data.map(function(d) {
        return {
          date:  d3.timeParse("%m/%d/%Y")(d.date),
          //date:  d3.timeParse("%Y-%m-%d")(d.date),
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

  /*total2018 = d3.sum(
    data.filter(d => d.date ),
    d => +d.cases
  )*/


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

    /*  var maxDate = d3.max(gData, d=> new Date(d.key));
      var minDate = d3.min(gData, d=> new Date(d.key));
      minDate = new Date(minDate.setDate(minDate.getDate()+ 1));
      maxDate = new Date(maxDate.setDate(maxDate.getDate()+ 1));
      console.log(minDate);
      console.log("max is ", maxDate);*/
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

    /*  svg.append("path")
                  .datum(gData)
                  .attr("fill", "#cce5df")
                  .on("mouseover", function() { focus.style("display", null); })
                  .on("mouseout", function() { focus.style("display", "none"); })
                  .on("mousemove", mousemove)
                  .attr("d", d3.area()
                  .x(d => x(new Date(d.key)))
                  .y0(y(0))
                  .y1(d => y(d.value))

                );*/
                  // define the line

var casesLine = d3.line()
                    .x(function(d) { return x(new Date(d.key)); })
                    .y(function(d) { return y(d.value); });
svg.append("path")
      .data([gData])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
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

         // Create the text that travels along the curve of chart
        /* var focusText = svg
           .append('g')
           .append('text')
             .style("opacity", 0)
             .attr("text-anchor", "right")
             .attr("alignment-baseline", "middle")*/

        svg
          .append('rect')
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr('width', width)
          .attr('height', height)
          .on('mouseover', mouseover)
          .on('mousemove', mousemove)
          .on('mouseout', mouseout);
        // Create the circle that travels along the curve of chart

        var div = d3.select('#lineChart').append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');
      // What happens when the mouse move -> show the annotations at the right positions.
      function mouseover() {
        focus.style("opacity", 1)
        //focusText.style("opacity",1)
         div.style('display', 'inline');

      }

      function mousemove() {
        // recover coordinate we need
      /* var x0 = x.invert(d3.mouse(this)[0]);
          idx = bisect.right(gData,new Date(x0));
        selectedData = gData[idx]
        var d = d3.select(this).data()[0]
        div
          .html("x:" + selectedData.date + "  -  " + "y:" + selectedData.value)*/
          var monthNameFt = d3.timeFormat("%B");
          var dayFormat= d3.timeFormat("%d")

          var x0 = x.invert(d3.mouse(this)[0]);
        //  x0 =  x0.setDate(x0.getDate()+ 1)
          var i = bisect.left(gData, new Date(x0),1);
          selectedData = gData[i-1]
          div
          .html( monthNameFt(new Date(selectedData.key))+ " "+dayFormat(new Date(selectedData.key)) +"<hr/>" +"Total Cases: " + selectedData.value)
          .style('left', x(new Date(selectedData.key))+20 +  'px')
          .style('top', y(selectedData.value)+300 + 'px')
          focus
           .attr("cx", x(new Date(selectedData.key)))
           .attr("cy", y(selectedData.value))
          /*focusText
           //.html( monthNameFt(new Date(selectedData.key))+ " "+dayFormat(new Date(selectedData.key))  +" cases: " + selectedData.value)
           .attr("x", x(new Date(selectedData.key))+15)
           .attr("y", y(selectedData.value))*/
        }
      function mouseout() {
        focus.style("opacity", 0)
        //focusText.style("opacity", 0)
        div.style('display', 'none');

        }


    /*    var insertLinebreaks = function (d) {
          var el = d3.select(this);
          var words = d.split(' ');
          el.text('');

          for (var i = 0; i < words.length; i++) {
              var tspan = el.append('tspan').text(words[i]);
              if (i > 0)
                  tspan.attr('x', 0).attr('dy', '15');
          }
      };

      svg.selectAll('g text html').each(insertLinebreaks);*/

  /*var fData = d3.nest()
                .key(function(d) { return d.date;})
                .rollup(function(d) {
                 return d3.sum(d, function(g) {return g.deaths; });
               }).entries(data);
      console.log(fData);
  var fatalitiesLine = d3.line()
                      .x(function(d) { return x(new Date(d.key)); })
                      .y(function(d) { return y(d.value); });

svg.append("path")
    .data([fData])
    .attr("class", "fline")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", fatalitiesLine);

      var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);


      var div = d3.select('#lineChart').append('div')
          .attr('class', 'tooltip')
          .style('display', 'none');
      function mouseover(){
          div.style('display', 'inline');
      }
      var parseDate = d3.timeFormat("%m/%e/%Y").parse,
          bisectDate = d3.bisector(function(d) { return d.date; }).left,
          formatValue = d3.format(","),
          dateFormatter = d3.timeFormat("%m/%d/%y");
      function mousemove() {
              var x0 = x.invert(d3.mouse(this)[0]),
                  i = bisectDate(gData, x0, 1),
                  d0 = gData[i - 1],
                  d1 = gData[i],
                  d = x0 - d0.key > d1.key - x0 ? d1 : d0;
              focus.attr("transform", "translate(" + x(d.key) + "," + y(d.value) + ")");
              focus.select(".tooltip-date").text(dateFormatter(d.key));
              focus.select(".tooltip-likes").text(formatValue(d.value));
          }
      function mouseout(){
          div.style('display', 'none');
      }*/

      var stateGroups = d3.nest() // nest function allows to group the calculation per level of a factor
         .key(function(d) { return d.state;})
         .entries(data);
    //console.log(stateGroups)
    allKeys = stateGroups.map(function(d){return d.key})

  var dataByStatePerDay = d3.nest()
  .key(function(d) { return d.state; })
  .key(function(j) { return j.date; })
  .rollup(function(v) { return d3.sum(v, function(d) { return d.cases; }); })
  .entries(data);

  //console.log("dataByStatePerDay",dataByStatePerDay )
 //var jsonData=  JSON.parse(JSON.stringify(dataByStatePerDay))

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
//  var xs = d3.scaleTime()
//      .domain(xm).range([ 0, 100 ]).nice();

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
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  svgStates
    .append("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return color(d.key) })
      .attr("stroke-width", 1.5)
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

function getMaxDate( data ) {
  /*  var arr = [];

    data.map(function(value) {
        arr = arr.concat.apply(arr, value.values);
    });*/
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


     var fatalityLine = d3.line()
                         .x(function(d) { return x(new Date(d.key)); })
                         .y(function(d) { return y(d.value); });
     svgFatalityChart.append("path")
           .data([fatalityData])
           .attr("class", "fline")
           .attr("fill", "none")
           .attr("stroke", "steelblue")
           .attr("stroke-width", 1.5)
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
                       // Create the circle that travels along the curve of chart

       var div = d3.select('#lineChart').append('div')
           .attr('class', 'tooltip')
           .style('display', 'none');
                     // What happens when the mouse move -> show the annotations at the right positions.
     function mouseover() {
       focus.style("opacity", 1)
       //focusText.style("opacity",1)
        div.style('display', 'inline');

     }

     function mousemove() {
       // recover coordinate we need
     /* var x0 = x.invert(d3.mouse(this)[0]);
         idx = bisect.right(gData,new Date(x0));
       selectedData = gData[idx]
       var d = d3.select(this).data()[0]
       div
         .html("x:" + selectedData.date + "  -  " + "y:" + selectedData.value)*/
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
         /*focusText
          //.html( monthNameFt(new Date(selectedData.key))+ " "+dayFormat(new Date(selectedData.key))  +" cases: " + selectedData.value)
          .attr("x", x(new Date(selectedData.key))+15)
          .attr("y", y(selectedData.value))*/
       }
     function mouseout() {
       focus.style("opacity", 0)
     //      focusText.style("opacity", 0)
        div.style('display', 'none');

       }



   var stateGroups = d3.nest() // nest function allows to group the calculation per level of a factor
          .key(function(d) { return d.state;})
          .entries(data);
     //console.log(stateGroups)
     allKeys = stateGroups.map(function(d){return d.key})

     var dataByStatePerDay = d3.nest()
     .key(function(d) { return d.state; })
     .key(function(j) { return j.date; })
     .rollup(function(v) { return d3.sum(v, function(d) { return d.deaths; }); })
     .entries(data);

     //console.log("dataByStatePerDay",dataByStatePerDay )
     //var jsonData=  JSON.parse(JSON.stringify(dataByStatePerDay))

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
     .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

     // Draw the line
     svgStates
     .append("path")
       .attr("fill", "none")
       .attr("stroke", function(d){ return color(d.key) })
       .attr("stroke-width", 1.5)
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
