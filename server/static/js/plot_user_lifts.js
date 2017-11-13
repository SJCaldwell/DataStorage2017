var pageInitialized = false;
$( document ).ready(function() {
if (pageInitialized)
	return
pageInitialized = true;
i = 1
counts = []
totals = []
$('#user_lifts tr').each(function(row, tr){
	counts.push(i)
	var total = $(tr).find('td:eq(5)').text() //total
	totals.push(parseFloat(total))
    i = i + 1;
});

counts.reverse()

function two1dto2d(c, a, b) {
  for (var i = 0; i < a.length; i++) {
    c.push([a[i], b[i]]);
  }
}
lift_data = []
two1dto2d(lift_data, counts, totals)

var datasets = [
  {
    lineColor : 'rgba(220,220,220,1)',
    pointColor : 'rgba(220,220,220,1)',
    pointStrokeColor : '#fff',
    data : lift_data
  }
]

console.log(lift_data)


var ctx = document.getElementById('lift_canvas').getContext('2d');

var xy = new Xy(ctx);
console.log("gonna draw")
xy.draw(datasets);
});