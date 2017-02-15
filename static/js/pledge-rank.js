$(document).ready(function(){
    waitMe($('#pledgeRank'));
	var getRanks = function(){
		$.ajax({
			url: '/apis/pledge/rank',
			headers: {
		        'Content-Type':'application/json'
		    },
		    async: true,
			type: 'GET',
			dataType: 'json',
            cache: false,
			success: function(data) {
			    var result = '';
			    $.each(data, function(i, obj) {
                    result += '<tr><td>'
                            + (i + 1)
                            + '</td><td>'
                            + obj.title
                            + '</td><td>'
                            + obj.candidate
                            + '</td><td>'
                            + obj.like
                            + '</td><td>'
                            + obj.unlike
                            + '</td></tr>';
			    });
			    $('#rankTable').append(result);
                $('#pledgeRank').waitMe('hide');
			},
			error: function(data, status, err) {
				console.log(err);
                $('#pledgeRank').waitMe('hide');
			}
		});
	}

	getRanks();
});