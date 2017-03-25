
function ratingDataParsing(data) {
    var result_list = [['x'], ['문재인'], ['안철수'], ['심상정'], ['남경필'], ['안희정'], ['이재명'], ['유승민'], ['홍준표'], ['손학규']];
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        if (!result_list[0].includes(obj.date)) {
            for (var j = 0; j < result_list.length; j++) {
                if (result_list[0].length > result_list[j].length) {
                    result_list[j].push(0);
                }
            }
            result_list[0].push(obj.date);
        }

        switch (obj.candidate) {
            case '문재인':
                result_list[1].push(obj.rating);
                break;
            case '안철수':
                result_list[2].push(obj.rating);
                break;
            case '심상정':
                result_list[3].push(obj.rating);
                break;
            case '남경필':
                result_list[4].push(obj.rating);
                break;
            case '안희정':
                result_list[5].push(obj.rating);
                break;
            case '이재명':
                result_list[6].push(obj.rating);
                break;
            case '유승민':
                result_list[7].push(obj.rating);
                break;
            case '홍준표':
                result_list[8].push(obj.rating);
                break;
            case '손학규':
                result_list[9].push(obj.rating);
                break;
        }
    }

    for (var k = 0; k < result_list.length; k++) {
        if (result_list[0].length > result_list[k].length) {
            result_list[k].push(0);
        }
    }

    return result_list;
}

function ratingChartReload(data) {
    rating_chart.load({
        columns: data
    });
}

// 지지율 차트
var all_data = null;
var realmeter_data = null;
var gallup_data = null;
var rating_chart = null;
$('input[type=radio][name=rating-graph-radio]').change(function () {
    if (this.value == 'all') {
        ratingChartReload(all_data);
    } else if (this.value == 'realmeter') {
        if (realmeter_data == null) {
            waitMe($('#rating-modal'));
            $.ajax({
                url: '/apis/rating?cp=realmeter',
                headers: {
                    'Content-Type':'application/json'
                },
                async: true,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    realmeter_data = ratingDataParsing(data);
                    ratingChartReload(realmeter_data);
                    $('#rating-modal').waitMe('hide');
                },
                error: function(data, status, err) {
                    console.log(err);
                    $('#rating-modal').waitMe('hide');
                }
            });
        } else {
            ratingChartReload(realmeter_data);
        }
    } else {
        if (gallup_data == null) {
            waitMe($('#rating-modal'));
            $.ajax({
                url: '/apis/rating?cp=gallup',
                headers: {
                    'Content-Type':'application/json'
                },
                async: true,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    gallup_data = ratingDataParsing(data);
                    ratingChartReload(gallup_data);
                    $('#rating-modal').waitMe('hide');
                },
                error: function(data, status, err) {
                    console.log(err);
                    $('#rating-modal').waitMe('hide');
                }
            });
        } else {
            ratingChartReload(gallup_data);
        }
    }
});
$('#rating-graph-button').click(function() {
    if (all_data == null) {
        waitMe($('#rating-modal'));
        $.ajax({
            url: '/apis/rating',
            headers: {
                'Content-Type':'application/json'
            },
            async: true,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                all_data = ratingDataParsing(data);
                rating_chart = c3.generate({
                    bindto: '#ratingChart',
                    data: {
                        x: 'x',
                        columns: all_data
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
                $('#rating-modal').waitMe('hide');
            },
            error: function(data, status, err) {
                console.log(err);
                $('#rating-modal').waitMe('hide');
            }
        });
    }
});


$('#rating-lucky-button').click(function () {
    var isLoadLuckyDetail = false;
    if (!isLoadLuckyDetail) {
        waitMe($('#rating'));
        $.ajax({
            url: '/rating?type=detail',
            headers: {
                'Content-Type':'application/json'
            },
            type: 'GET',
            success: function(data) {
                $('#lucky-rating-modal-body').html(data);
                $('#rating').waitMe('hide');
                sLoadLuckyDetail = true;
                $('#lucky-rating-modal').modal('show');
            },
            error: function() {
                alert('우주의기운 지지율을 가져오는데 실패하였습니다');
                $('#rating').waitMe('hide');
            }
        });
    } else {
        $('#lucky-rating-modal').modal('show');
    }
});