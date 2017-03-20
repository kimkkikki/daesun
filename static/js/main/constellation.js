/**
 * Created by kimkkikki on 2017. 3. 19..
 */

var month = null;
var month_button = $('#constellation-month');
var day = null;
var day_button = $('#constellation-day');
$('.constellation-month').click(function () {
    month = this.value;
    month_button.html(this.value + '월');
});
$('.constellation-day').click(function () {
    day = this.value;
    day_button.html(this.value + '일');
});

$('#constellation-button').click(function() {
    if (month == null || day == null) {
        alert('생일을 입력해야 합니다');
        return;
    }
    waitMe($('#lucky'));
    $.ajax({
            url: '/constellation',
            headers: {
                'Content-Type':'application/json'
            },
            cache: false,
            type: 'POST',
            data: JSON.stringify({
                'month': Number(month),
                'day': Number(day)
            }),
            success: function(data) {
                $('#constellation-result').html(data);
                $('#constellation-modal').modal('show');
                $('#lucky').waitMe('hide');
            },
            error: function(data, status, err) {
                console.log(err);
                $('#lucky').waitMe('hide');
            }
        });
});