$(document).ready(function() {

	console.log("Document here")
	$("#strength_stats").submit(function(){
		console.log("SEE SUBMIT");
		$.ajax({
			type: "POST",
			url: "strength_distribution",
			data: $(this).serialize(),
			success: function(data){
				var distribution = data;
				console.log(distribution);
			}
		});
	})
}) 