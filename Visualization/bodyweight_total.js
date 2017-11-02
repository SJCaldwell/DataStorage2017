//var d3 = require("d3");

//Data from a the data set

//Random sample of 50 pros to the individual 

var data = [[73.6,512.6],
[73.4,465.5],
[96.89,201.85],
[104.87,508.02],
[122,692.5],
[62.7,65],
[90.7,127.5],
[87.8,440],
[51.35,381.02],
[90.4,550],
[70,445],
[81.8,512.5],
[103.6,517.5],
[78.3,295],
[65,410],
[59.6,399.16],
[56.3,332.5],
[73,67.5],
[65.4,497.5],
[99,670],
[81.74,784.71],
[92.9,442.5],
[115.5,771.1],
[88.36,621.42],
[60,427.5],
[88.6,200],
[72.2,30],
[100.9,115],
[74.8,255],
[101.2,492.15],
[88.6,132.5],
[144.33,821],
[91.8,181.5],
[84.55,365.14],
[74.98,619.15],
[101.4,580],
[88.63,240.4],
[99.43,911.72],
[81.01,467.2],
[73.48,319.78],
[86.9,565],
[66.81,60],
[74,407.5],
[54.5,337.5],
[81.4,230],
[98.79,403.7],
[104.69,247.21],
[89.36,798.32],
[56,70],
[57,322.5]];
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


