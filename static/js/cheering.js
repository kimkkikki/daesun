
$(document).ready(function(){
    var ip = '';
    $.get('http://jsonip.com/', function(r){
        var splits = r.ip.split('.');
        ip = splits[0] + '.' + splits[1] + '.' + '***' + '.' + splits[3];
    });
    var page = 1;

    $('#post-cheering').click(function() {
        var candidate_select = document.getElementById("cheering-candidate");
        var candidate = candidate_select.options[candidate_select.selectedIndex].text;
        var message = document.getElementById("cheering-message").value;

        waitMe($('#cheering'));

        $.ajax({
			url: '/cheering',
			headers: {
		        'Content-Type':'application/json'
		    },
		    async: true,
			type: 'POST',
			data: JSON.stringify({
                    'candidate': candidate,
                    'message': message,
                    'ip': ip
                }),
			success: function(data) {
                $('#cheering-table').html(data);
                $('#cheering').waitMe('hide');
                page = 1;
			},
			error: function() {
                alert('응원메세지 등록이 실패하였습니다');
                $('#cheering').waitMe('hide');
			}
		});
    });

    $('#cheering-more').click(function() {
        waitMe($('#cheering'));
        $.ajax({
			url: '/cheering?page=' + page,
			headers: {
		        'Content-Type':'application/json'
		    },
		    async: true,
			type: 'GET',
			success: function(data) {
                $('#cheering-table').append(data);
                $('#cheering').waitMe('hide');
                page++;
			},
			error: function() {
                $('#cheering').waitMe('hide');
			}
		});
    });
});