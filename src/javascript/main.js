
function main(isFatalityChart)
{
  load(isFatalityChart);  //createChart();

}

function load(isFatalityChart){
  const data = d3.csv('https://raw.githubusercontent.com/hpandeycodeit/schoolproject/master/covid-19DS.csv' ).then(function(data){
    console.log(data[35]);
    var formatData = data.map(function(d) {
        return {
          date:  d3.timeParse("%m/%d/%Y")(d.date),
          //date:  d3.timeParse("%Y-%m-%d")(d.date),
          cases:  parseInt(d.cases),
          state: d.state,
          deaths: parseInt(d.deaths)
        };
    });
    logger(formatData,isFatalityChart);
  });

}

function logger(data,isFatalityChart) {
	//console.log(data);
  if(isFatalityChart)
  {
    plotBarsFatality(data);
  }
  else {
    plotBars(data);
  }


}

function sort(sortOption)
{
  var sortVal =sortOption;

  console.log(sortVal);
  data.sort(function (b, a) {
              if(sortVal == "ascending")
              {
                return b.cases - a.cases;
              }else {
                return a.cases - b.cases;
              }

         });
}
function plotBars(covidData)
{
console.log(d3.max(covidData,d =>new Date(d.date)))
maxDate= d3.max(covidData,d =>new Date(d.date));
console.log("maxdate",maxDate)
data = covidData.filter(function(d){
  return  (new Date(d.date).getTime() == maxDate.getTime()) });
console.log(data)


data.sort(function (b, a) {

              return a.cases - b.cases;

       });

var width=900;
var height=700;
var margin = 130;
//var margin  = {top: 30, right: 0, bottom: 30, left: 50};

var x=d3.scaleLinear().domain([0,450000]).range([0,width]);

d3.select("svg").append("text")
.attr("transform",
      "translate(" + (width/2 + 100) + " ," +
                     (height + margin + 50) + ")")
.style("text-anchor", "middle")
.text("Cases Count");



y= d3.scaleBand().domain(data.map(function(d){
  return d.state;
}))
.padding(.9)
.range([0,height]);

d3.select("svg").append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 )
.attr("x",0 - (height / 2))
.attr("dy", "1em")
.style("text-anchor", "middle")
.text("States");

var stateGroups = d3.nest() // nest function allows to group the calculation per level of a factor
   .key(function(d) { return d.state;})
   .entries(data);
console.log(stateGroups)
allKeys = stateGroups.map(function(d){return d.key})
var color = d3.scaleOrdinal()
  .domain(allKeys)
  .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

var myColor = d3.scaleLinear().domain([0,52]).range(["red", "orange"]);

//x.domain([0, d3.max(data, function(d) { return d;})]);
d3.select("svg")
     .attr("width",width+2*margin)
     .attr("height",height+2*margin)
     .append("g")
     .attr("transform","translate("+margin+","+margin+")")
     .selectAll("rect").data(data).enter().append("rect")
     .on("mouseover", mouseover)
     .on('mousemove', mousemove)
  .on("mouseout", mouseout)
    .attr("x", 0)
   . attr("y", function(d,i){
          return y(d.state);})
   .attr("width", 0)
    .transition()
   .duration(1500)
    .delay(function (d, i) {
    return i * 150;
  })
    .attr("width", function(d,i){
       return  x(d.cases);})
    .attr("height", function(d,i){
             return   y.bandwidth()+10; })
    .attr("fill",function(d){
      return color(d.state);

    })


d3.select("svg")
     .append("g")
     .attr("transform","translate("+margin+","+margin+")")
     .call(d3.axisLeft(y));

d3.select("svg")
     .append("g")
     .attr("transform","translate("+margin+","+(height+margin)+")")
     .call(d3.axisBottom(x));


     // tooltips
         var div = d3.select('#chart').append('div')
             .attr('class', 'tooltip')
             .style('display', 'none');
         function mouseover(){
             div.style('display', 'inline');
         }
         function mousemove(){
             var d = d3.select(this).data()[0]
             div
                 .html(d.state + '<hr/>' +"cases: " +d.cases)
                 .style('left', (d3.event.pageX - 34) + 'px')
                 .style('top', (d3.event.pageY - 12) + 'px');
         }
         function mouseout(){
             div.style('display', 'none');
         }

/*d3.select("svg")
.selectAll("rect")
.transition()
.duration(800)
.attr("y", function(d) {
    console.log("yyy", y(d.value)) ;
  return y(d);
})
.attr("height", function(d) {

  return height - y(d);
})
.delay(function(d,i){
  console.log(i) ;
  return(i*100)
});*/



}

function plotBarsFatality(covidData){

  console.log(d3.max(covidData,d =>new Date(d.date)))
  maxDate= d3.max(covidData,d =>new Date(d.date));
  console.log("maxdate",maxDate)
  data = covidData.filter(function(d){
    return  (new Date(d.date).getTime() == maxDate.getTime()) });
  console.log(data)


  data.sort(function (b, a) {

                return a.deaths - b.deaths;

         });

  var width=900;
  var height=700;
  var margin = 130;

  var x=d3.scaleLinear().domain([0,50000]).range([0,width]);
  d3.select("svg").append("text")
  .attr("transform",
        "translate(" + (width/2 + 100) + " ," +
                       (height + margin + 50) + ")")
  .style("text-anchor", "middle")
  .text("Deaths Count");





  y= d3.scaleBand().domain(data.map(function(d){
    return d.state;
  }))
  .padding(.9)
  .range([0,height]);

  d3.select("svg").append("text")
  .attr("transform", "rotate(-90)")
  .attr("y",20)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("States");

  var stateGroups = d3.nest() // nest function allows to group the calculation per level of a factor
     .key(function(d) { return d.state;})
     .entries(data);
  console.log(stateGroups)
  allKeys = stateGroups.map(function(d){return d.key})
  var color = d3.scaleOrdinal()
    .domain(allKeys)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  var myColor = d3.scaleLinear().domain([0,52]).range(["red", "orange"]);

  //x.domain([0, d3.max(data, function(d) { return d;})]);
  d3.select("svg")
       .attr("width",width+2*margin)
       .attr("height",height+2*margin)
       .append("g")
       .attr("transform","translate("+margin+","+margin+")")
       .selectAll("rect").data(data).enter().append("rect")
       .on("mouseover", mouseover)
       .on('mousemove', mousemove)
    .on("mouseout", mouseout)
      .attr("x", 0)
     . attr("y", function(d,i){
            return y(d.state);})
     .attr("width", 0)
      .transition()
     .duration(1500)
      .delay(function (d, i) {
      return i * 150;
    })
      .attr("width", function(d,i){
         return  x(d.deaths);})
      .attr("height", function(d,i){
               return   y.bandwidth()+10; })
      .attr("fill",function(d){
        return color(d.state);

      })


  d3.select("svg")
       .append("g")
       .attr("transform","translate("+margin+","+margin+")")
       .call(d3.axisLeft(y));

  d3.select("svg")
       .append("g")
       .attr("transform","translate("+margin+","+(height+margin)+")")
       .call(d3.axisBottom(x));


       // tooltips
           var div = d3.select('#chartD').append('div')
               .attr('class', 'tooltip')
               .style('display', 'none');
           function mouseover(){
               div.style('display', 'inline');
           }
           function mousemove(){
               var d = d3.select(this).data()[0]
               div
                   .html(d.state + '<hr/>' +"cases: " +d.deaths)
                   .style('left', (d3.event.pageX - 34) + 'px')
                   .style('top', (d3.event.pageY - 12) + 'px');
           }
           function mouseout(){
               div.style('display', 'none');
           }




}
