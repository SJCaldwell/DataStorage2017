//Random sample of 50 pros to the individual 

var data = [[75,120.2],
[100,102.06],
[82.5, 155],
[93,117.5],
[140,170.1],
[125,185],
[56,61.23],
[63,47.5],
[52,42.5],
[125,54.43],
[84,80],
[67.5,81.65],
[90,90.72],
[125,151.95],
[110,192.78],
[66,125],
[110,152.5],
[110,92.99],
[56,105],
[60,92.5],
[74,110],
[140,170.1],
[140,207.5],
[100,115],
[105,107.5],
[100,122.47],
[82.5,122.5],
[120,162.5],
[57,60],
[67.5,79.38],
[82.5,55],
[82.5,133.81],
[75,125],
[72,47.5],
[93,107.5],
[100,162.5],
[105,175],
[56,55],
[93,230],
[74,125],
[125,111.13],
[125,197.5],
[82.5,83.91],
[125,208.65],
[75,135],
[75,125],
[82.5,87.5],
[67.5,97.5],
[72,57.5],
[52,27.5]]

//New data point          
var data1 = [1,5]

    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = 960 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom;
    
    var x = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d[0]; })])
              .range([ 0, width ]);
    
    var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d[1]; })])
            .range([ height, 0 ]);
 
    var chart = d3.select('body')
  .append('svg:svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .attr('class', 'chart')

    var main = chart.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'main')   
        
    // draw the x axis
    var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');

  
    main.append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .attr('class', 'main axis date')
  .call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left');

    main.append('g')
  .attr('transform', 'translate(0,0)')
  .attr('class', 'main axis date')
  .call(yAxis);

    var g = main.append("svg:g"); 
    
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("svg:circle")
          .attr("cx", function (d,i) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 8);


