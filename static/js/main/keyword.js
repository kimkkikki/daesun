/**
 * Created by kimkkikki on 2017. 3. 21..
 */
var fullDate = new Date();
var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) :(fullDate.getMonth()+1);
var currentDate = fullDate.getFullYear() + "-" + twoDigitMonth + "-" + fullDate.getDate();
var today = currentDate;
var issueKeywords = {};
var isLoadTodayKeyword = false;

$('#keyword-date').html(' ' + currentDate + ' ');

$('.keyword-date-button').click(function () {
    if (this.value == 'yesterday') {
        fullDate.setDate(fullDate.getDate() - 1);
    } else {
        fullDate.setDate(fullDate.getDate() + 1);
    }
    twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) :(fullDate.getMonth()+1);
    currentDate = fullDate.getFullYear() + "-" + twoDigitMonth + "-" + fullDate.getDate();
    if (currentDate == today) {
        $('#keyword-tomorrow-button').prop('disabled', true);
    } else {
        $('#keyword-tomorrow-button').prop('disabled', false);
    }
    $('#keyword-date').html(' ' + currentDate + ' ');
    loadKeyword(currentDate);
});

$('#space').waypoint(function() {
    if (!isLoadTodayKeyword) {
        loadKeyword(currentDate);
    }
});
$('#keyword').waypoint(function () {
    if (!isLoadTodayKeyword) {
        loadKeyword(currentDate);
    }
});
$('#press').waypoint(function() {
    if (!isLoadTodayKeyword) {
        loadKeyword(currentDate);
    }
});

function loadKeyword(date) {
    if (date in issueKeywords) {
        $('#keyword-body').html(issueKeywords[date]);

        $('.keyword').on('click', function () {
            keywordClick(this.title);
        });
    } else {
        waitMe($('#keyword'));
        isLoadTodayKeyword = true;
        $.ajax({
                url: '/keyword?date=' + currentDate,
                headers: {
                    'Content-Type':'application/json'
                },
                type: 'GET',
                success: function(data) {
                    issueKeywords[date] = data;
                    $('#keyword-body').html(data);
                    $('#keyword').waitMe('hide');

                    $('.keyword').on('click', function () {
                        keywordClick(this.title);
                    });
                },
                error: function(data, status, err) {
                    console.log(err);
                    $('#keyword').waitMe('hide');
                }
            });
    }
}

function keywordClick(data) {
    waitMe($('#keyword'));
    $.ajax({
            url: '/news',
            headers: {
                'Content-Type':'application/json'
            },
            type: 'POST',
			data: JSON.stringify({
                    'keywords': data
                }),
            success: function(data) {
                $('#keyword-modal-body').html(data);
                var keywordModal = $('#keyword-modal');
                keywordModal.modal('show');
                $('#keyword').waitMe('hide');
            },
            error: function(data, status, err) {
                console.log(err);
                $('#keyword').waitMe('hide');
            }
        });
}