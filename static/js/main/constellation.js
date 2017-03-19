/**
 * Created by kimkkikki on 2017. 3. 19..
 */

$('#constellation-button').click(function() {
    var month = $('#constellation-month').val();
    var day = $('#constellation-day').val();
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