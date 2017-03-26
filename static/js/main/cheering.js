$(document).ready(function(){
    var ip = '';
    $.ajax({
        url: 'https://jsonip.com/',
        dataType: "jsonp",
        success: function (data) {
            var splits = data.ip.split('.');
            ip = splits[0] + '.' + splits[1] + '.' + '***' + '.' + splits[3];
        }
    });
    var page = 1;

    var cheering_candidate_select = null;
    var cheering_candidate_button = $('#cheering-candidate-button');
    $('.cheering-candidate-select').click(function () {
        cheering_candidate_select = this.value;
        cheering_candidate_button.html(this.value);
    });

    $('#post-cheering').click(function() {
        if (cheering_candidate_select == null) {
            alert('대선후보를 선택해야 합니다');
            return;
        }

        var message = $("#cheering-message").val();
        if (message == null || message == '') {
            alert('메세지를 입력하세요');
            return;
        }

        var writer = $("#cheering-writer").val();
        if (writer == '') {
            writer = ip;
        }

        waitMe($('#cheering'));
        $.ajax({
			url: '/cheering',
			headers: {
		        'Content-Type':'application/json'
		    },
		    async: true,
			type: 'POST',
			data: JSON.stringify({
                    'candidate': cheering_candidate_select,
                    'message': message,
                    'ip': writer
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