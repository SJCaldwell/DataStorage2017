      function sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
      }

$(document).ready(function() {
	$("#strength_button").click(function(){
		console.log("SEE SUBMIT");
		var bar_container = document.getElementById('strengthbar_container');
		bar_container.style.visibility = '';
		$.ajax({
			type: "POST",
			url: "strength_distribution",
			data: $("#strength_stats").serialize(),
			success: function(result){
				console.log(result);
				var user_data = result;
				var rank = user_data['user_rank']
				var num_sampled = user_data['num_sampled']
				var percentile = (rank/num_sampled) * 100;
				console.log("percentile is " + percentile);
				for (i = 0; i < percentile; i++) { 
    				var bar = document.getElementById('strengthbar')
    				bar.style.width = String(i) + "%"
				}
				var message = document.getElementById('score')
				if (percentile < 25)
					message.innerText = "Total Weenie!"
				if (percentile >= 25 && percentile < 50)
					message.innerText = "Get back in the gym!"
				if (percentile >=50 && percentile < 75)
					message.innerText = "You're pretty tough!"
				if (percentile >= 75)
					message.innerText = "SON OF ODIN!"
			}
		});
	})
}) 