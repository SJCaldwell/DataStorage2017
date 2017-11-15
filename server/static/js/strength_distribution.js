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
				for (i = 0; i < percentile + 1; i++) { 
    				var bar = document.getElementById('strengthbar')
    				bar.style.width = String(i) + "%"
				}
				var message = document.getElementById('score')
				if (percentile < 25)
					message.innerText = "Weenie!"
				if (percentile >= 25 && percentile < 50)
					message.innerText = "Meh."
				if (percentile >=50 && percentile < 75)
					message.innerText = "Not bad!"
				if (percentile >= 75)
					message.innerText = "ODIN SPAWN!"
			}
		});
	})
}) 