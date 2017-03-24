/**
 * Created by kimkkikki on 2017. 3. 24..
 */

var isCalendarLoad = false;
$('#calendar-button-1, #calendar-button-2, #calendar-button-3, #calendar-button-4, #calendar-button-5').click(function () {
    if (!isCalendarLoad) {
        waitMe($('#calendar-modal'));
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }
        if(mm<10) {
            mm='0'+mm
        }

        $.ajax({
                url: "/apis/sns",
                headers: {
                    'Content-Type':'application/json'
                },
                async: true,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    $('#calendar').fullCalendar({
                        header: {
                            left: 'prev,next',
                            right: 'listDay, listWeek, month'
                        },
                        views: {
                            listDay: { buttonText: '일간' },
                            listWeek: { buttonText: '주간' },
                            month: { buttonText: '월간' }
                        },
                        locale : 'ko',
                        defaultView: 'listDay',
                        defaultDate: yyyy + '-' + mm + '-' + dd,
                        navLinks: true, // can click day/week names to navigate views
                        editable: true,
                        eventLimit: true, // allow "more" link when too many events
                        events: data,
                        eventOrder: "start"
                    });
                    $('#calendar-modal').waitMe('hide');
                    isCalendarLoad = true;
                },
                error: function(data, status, err) {
                    console.log(err);
                    $('#calendar-modal').waitMe('hide');
                }
        });
    }
});