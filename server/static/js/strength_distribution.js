$(document).ready(function() {
	$("#strength_button").click(function(){
		console.log("SEE SUBMIT");
		$.ajax({
			type: "POST",
			url: "strength_distribution",
			data: $("#strength_stats").serialize(),
			success: function(data){
				var distribution = data;
				console.log(distribution);
			}
		});
	})
}) 