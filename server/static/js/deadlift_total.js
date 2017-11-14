
//Random sample of 50 pros to the individual 
var data = [[685,0.36*100],
[780,0.416*100],
[392.36,0.422*100],
[570,0.32*100],
[455,0.44*100],
[322.5,0.403*100],
[344.73,0.395*100],
[582.5,0.412*100],
[444.52,0.367*100],
[590,0.407*100],
[476.27,0.414*100],
[181.44,0.625*100],
[685,0.365*100],
[267.5,0.467*100],
[238.14,0.448*100],
[337.5,0.429*100],
[265,0.452*100],
[630,0.397*100],
[537.5,0.423*100],
[525,0.4*100],
[485.34,0.397*100],
[789.25,0.324*100],
[702.5,0.378*100],
[685,0.369*100],
[377.5,0.450*100],
[712.5,0.418*100],
[557.5,0.386*100],
[258.55,0.491*100],
[477.5,0.393*100],
[672.5,0.394*100],
[755,0.351*100],
[610,0.393*100],
[242.5,0.464*100],
[508.02,0.384*100],
[260,0.462*100],
[525,0.452*100],
[273,0.44*100],
[158.76,0.643*100],
[342.5,0.292*100],
[520,0.394*100],
[472.5,0.386*100],
[577.5,0.403*100],
[335.66,0.426*100],
[653.67,0.368*100],
[326.59,0.646*100],
[580.6,0.3678*100],
[565,0.429*100],
[408.23,0.5338*100],
[425,0.535*100],
[710,0.394*100]]

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


