/**
 * Created by kimkkikki on 2017. 3. 19..
 */

var isLoadChart = false;
$('#pledge').waypoint(function () {
    if (!isLoadChart) {
        createPressChart();
    }
});
$('#press').waypoint(function() {
    if (!isLoadChart) {
        createPressChart();
    }
});
$('#keyword').waypoint(function() {
    if (!isLoadChart) {
        createPressChart();
    }
});

var pressDailyDict = {'all': null, 'asiae': null, 'chosun': null, 'donga': null, 'edaily': null, 'hani': null, 'heraldcorp': null,
    'ichannela': null, 'joins': null, 'jtbc': null, 'kbs': null, 'khan': null, 'kmib': null, 'mbc': null, 'mbn': null,
    'mk': null, 'mt': null, 'munhwa': null, 'news1': null, 'newsis': null, 'ohmynews': null, 'sbs': null, 'sedaily': null,
    'segye': null, 'seoul': null, 'sisain': null, 'tvchosun': null, 'yonhap': null, 'ytn': null};

var pressGroupDict = {'all': null, 'asiae': null, 'chosun': null, 'donga': null, 'edaily': null, 'hani': null, 'heraldcorp': null,
    'ichannela': null, 'joins': null, 'jtbc': null, 'kbs': null, 'khan': null, 'kmib': null, 'mbc': null, 'mbn': null,
    'mk': null, 'mt': null, 'munhwa': null, 'news1': null, 'newsis': null, 'ohmynews': null, 'sbs': null, 'sedaily': null,
    'segye': null, 'seoul': null, 'sisain': null, 'tvchosun': null, 'yonhap': null, 'ytn': null};

var dailyChart, groupChart;

$('#press-select').change(function () {
    var daily = pressDailyDict[this.value];
    var group = pressGroupDict[this.value];

    groupChart.load({
        columns: group
    });
    if (daily == null) {
        var value = this.value;
        waitMe($('#press'));
        $.ajax({
            url: '/apis/cp/daily?cp=' + value,
            headers: {
                'Content-Type':'application/json'
            },
            type: 'GET',
            success: function(data) {
                $('#press').waitMe('hide');
                var cp_daily_result = dailyDataParsing(data);
                pressDailyDict[value] = cp_daily_result;
                dailyChart.load({
                    columns: cp_daily_result
                });
            },
            error: function(data, status, err) {
                $('#press').waitMe('hide');
                console.log(err);
            }
        });
    } else {
        dailyChart.load({
            columns: daily
        });
    }
});

function dailyDataParsing(data) {
    var result_list = [['x'], ['문재인'], ['안철수'], ['심상정'], ['남경필'], ['안희정'], ['이재명'], ['유승민'], ['홍준표']];
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
        result_list[8].push(obj.hong);
    }

    return result_list
}

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
                var result_list = dailyDataParsing(data);
                pressDailyDict['all'] = result_list;

                dailyChart = c3.generate({
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
                var result = [['문재인', 0], ['이재명', 0], ['안희정', 0], ['유승민', 0], ['심상정', 0], ['안철수', 0], ['남경필', 0], ['홍준표', 0]];

                for (var i = 0; i < data.length; i++) {
                    result[0][1] += data[i].moon;
                    result[1][1] += data[i].lee;
                    result[2][1] += data[i].hee;
                    result[3][1] += data[i].you;
                    result[4][1] += data[i].sim;
                    result[5][1] += data[i].ahn;
                    result[6][1] += data[i].nam;
                    result[7][1] += data[i].hong;
                    pressGroupDict[data[i]['cp']] = [['문재인', data[i].moon], ['이재명', data[i].lee], ['안희정', data[i].hee],
                        ['유승민', data[i].you], ['심상정', data[i].sim], ['안철수', data[i].ahn], ['남경필', data[i].nam], ['홍준표', data[i].hong]];
                }
                pressGroupDict['all'] = result;

                groupChart = c3.generate({
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
