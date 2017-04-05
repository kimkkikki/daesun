
function ratingDataParsing(data) {
    var result_list = [['x'], ['문재인'], ['안철수'], ['심상정'], ['남경필'], ['안희정'], ['이재명'], ['유승민'], ['홍준표'], ['손학규'], ['김진태']];
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
            case '김진태':
                result_list[10].push(obj.rating);
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

var luckyMoreButton = $('#rating-lucky-button');
var realMoreButton = $('#rating-graph-button');
var ratingSubTitle = $('#rating-subtitle');
var ratingTitle = $('#rating-title');

var before = null;
$('input[type=radio][name=rating-type-radio]').change(function () {
    var description = $('#rating-description');
    var template = $('#rating-template');
    var temp;
    if (this.value === 'lucky') {
        description.html("2017대선닷컴의 돌려돌려돌림판, 이름점, 별자리점을 이용한 방문자 결과의 합계로 계산되었습니다.<br>실제 지지율과는 전혀 상관이 없습니다.");
        luckyMoreButton.removeClass('hidden-xs-up');
        realMoreButton.addClass('hidden-xs-up');
        ratingSubTitle.text('2017대선닷컴 이용자가 뽑은');
        ratingTitle.text('우주의 기운이 돕는 후보');
        if (before === null) {
            waitMe($('#rating'));
            $.ajax({
                url: '/rating?type=all',
                headers: {
                    'Content-Type':'application/json'
                },
                type: 'GET',
                success: function(data) {
                    before = template.html();
                    template.html(data);
                    $('#rating').waitMe('hide');
                },
                error: function() {
                    alert('지지율 데이터를 가져오는데 실패하였습니다');
                    $('#rating').waitMe('hide');
                }
            });
        } else {
            temp = template.html();
            template.html(before);
            before = temp;
        }

    } else {
        description.html("리얼미터, 한국갤럽이 조사한 여론조사 결과입니다. 자세한 내용은 리얼미터, 한국갤럽 홈페이지를 참고하세요");
        realMoreButton.removeClass('hidden-xs-up');
        luckyMoreButton.addClass('hidden-xs-up');
        ratingSubTitle.text('국민들의 지지율');
        ratingTitle.text('여론조사 모아보기');
        if (before === null) {
            waitMe($('#rating'));
            $.ajax({
                url: '/rating',
                headers: {
                    'Content-Type':'application/json'
                },
                type: 'POST',
                data: JSON.stringify({
                        'type': 'real'
                    }),
                success: function(data) {
                    before = template.html();
                    template.html(data);
                    $('#rating').waitMe('hide');
                },
                error: function() {
                    alert('지지율 데이터를 가져오는데 실패하였습니다');
                    $('#rating').waitMe('hide');
                }
            });
        } else {
            temp = template.html();
            template.html(before);
            before = temp;
        }
    }
});

// 지지율 차트
var all_data = null;
var realmeter_data = null;
var gallup_data = null;
var rating_chart = null;
$('input[type=radio][name=rating-graph-radio]').change(function () {
    if (this.value === 'all') {
        ratingChartReload(all_data);
    } else if (this.value === 'realmeter') {
        if (realmeter_data === null) {
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
        if (gallup_data === null) {
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

realMoreButton.click(function() {
    if (all_data === null) {
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
                        colors: candidateColors,
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

var isLoadLuckyDetail = false;
luckyMoreButton.click(function () {
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
                isLoadLuckyDetail = true;
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