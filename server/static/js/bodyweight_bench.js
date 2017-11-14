
//Random sample of 50 pros to the individual 

var data = [[77.2, (175/77.2)],
[59.8,(77.5/59.8)],
[73.2,(162.5/73.2)],
[90,(187.5/90)],
[56.25,(95/56.25)],
[123.45,(315/123.45)],
[186.6,(155/186.6)],
[62.05,(122.47/62.05)],
[80.74,(235.87/80.74)],
[80.5,(100/80.5)],
[76.48,(147.42/76.48)],
[86.9,(185/86.9)],
[119.5,(215/119.5)],
[74.98,(163.29/74.98)],
[67.45,(210/67.45)],
[72.57,(150/72.57)],
[60.1,(122.5/60.1)],
[88.27,(154.22/88.27)],
[66.9,(180/66.9)],
[136.08,(240.4/136.08)],
[66,(137.5/66)],
[94.35,(125/94.35)],
[82.1,(125/82.1)],
[89.95,(192.78/89.95)],
[131.3,(325/131.3)],
[114.25,(285/114.25)],
[125.1,(182.5/125.1)],
[91.6,(297.5/91.6)],
[55.3,(122.5/55.3)],
[81.6,(177.5/81.6)],
[87.6,(140/87.6)],
[106.5,(290/106.5)],
[109.4,(310/109.4)],
[180.53,(225/180.53)],
[51.7,(75/51.7)],
[125.9,(400/125.9)],
[117.7,(227.5/117.7)],
[72.76,(167.83/72.76)],
[68.76,(138.35/68.76)],
[43.6,(110/43.6)],
[116.2,(210/116.2)],
[92.44,(181.44/92.44)],
[67.22,(102.06/67.22)],
[82.5,(175/82.5)],
[99.1,(237.5/99.1)],
[61.9,(82.5/61.9)],
[96.89,(251.74/96.89)],
[73.48,(161.03/73.48)],
[70.7,(165/70.7)],
[74.03,(156.49/74.03)]]

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


