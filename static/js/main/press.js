/**
 * Created by kimkkikki on 2017. 3. 19..
 */

var isLoadChart = false;
$('#lucky').waypoint(function () {
    if (!isLoadChart) {
        createPressChart();
    }
});
$('#press').waypoint(function() {
    if (!isLoadChart) {
        createPressChart();
    }
});
$('#donate').waypoint(function() {
    if (!isLoadChart) {
        createPressChart();
    }
});

function createPressChart() {
    var count = 0;
    isLoadChart = true;
    waitMe($('#press'));

    $.ajax({
            url: '/apis/cp/daily',
            headers: {
                'Content-Type':'application/json'
            },
            type: 'GET',
            success: function(data) {
                var result_list = [['x'], ['문재인'], ['안철수'], ['심상정'], ['남경필'], ['안희정'], ['이재명'], ['유승민']];
                for (var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    result_list[0].push(obj.date);
                    result_list[1].push(obj.moon);
                    result_list[2].push(obj.ahn);
                    result_list[3].push(obj.sim);
                    result_list[4].push(obj.nam);
                    result_list[5].push(obj.hee);
                    result_list[6].push(obj.lee);
                    result_list[7].push(obj.you);
                }

                c3.generate({
                    bindto: '#press-chart-line',
                    data: {
                        x: 'x',
                        columns: result_list
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%Y-%m-%d'
                            }
                        }
                    }
                });

                if (count == 0) {
                    count++;
                } else {
                    $('#press').waitMe('hide');
                }
            },
            error: function(data, status, err) {
                console.log(err);
            }
        });
    $.ajax({
            url: '/apis/cp/group',
            headers: {
                'Content-Type':'application/json'
            },
            type: 'GET',
            success: function(data) {
                var result = [['문재인', 0], ['이재명', 0], ['안희정', 0], ['유승민', 0], ['심상정', 0], ['안철수', 0], ['남경필', 0]];

                for (var i = 0; i < data.length; i++) {
                    result[0][1] += data[i].moon;
                    result[1][1] += data[i].lee;
                    result[2][1] += data[i].hee;
                    result[3][1] += data[i].you;
                    result[4][1] += data[i].sim;
                    result[5][1] += data[i].ahn;
                    result[6][1] += data[i].nam;
                }

                press_chart = c3.generate({
                    bindto: '#press-chart-pie',
                    data: {
                        columns: result,
                        type : 'pie'
                    }
                });

                if (count == 0) {
                    count++;
                } else {
                    $('#press').waitMe('hide');
                }
            },
            error: function(data, status, err) {
                console.log(err);
            }
        });
}
