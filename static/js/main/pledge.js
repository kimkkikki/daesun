/**
 * Created by kimkkikki on 2017. 3. 24..
 */

var isLoadPledgeRank = false;
$('#pledge-rank-button').click(function () {
    if (!isLoadPledgeRank) {
        waitMe($('#pledge'));
        $.ajax({
            url: '/pledge?type=rank',
            headers: {
                'Content-Type':'application/json'
            },
            type: 'GET',
            success: function(data) {
                $('#pledge-rank').html(data);
                $('#pledge-rank-modal').modal('show');
                $('#pledge').waitMe('hide');
                isLoadPledgeRank = true;
            },
            error: function(data, status, err) {
                console.log(err);
                $('#pledge').waitMe('hide');
            }
        });
    } else {
        $('#pledge-rank-modal').modal('show');
    }
});

var blindResult;
var blindToken;
var blindList;
var blindLoopIndex;

$('#pledge-test-start-button').click(function () {
    console.log('pledge start');
    waitMe($('#pledge'));
    $.ajax({
        url: '/apis/pledge',
        headers: {
            'Content-Type':'application/json'
        },
        dataType: 'json',
        cache: false,
        type: 'GET',
        success: function(data) {
            blindResult = [];
            blindToken = data.token;
            blindList = data.list;
            blindLoopIndex = 1;

            $('#pledge-test-title').html(blindList[0].title);
            $('#pledge-test-contents').html(blindList[0].contents);
            $('#pledge-test-count').html('1/' + blindList.length);
            $('#pledge').waitMe('hide');
            $('#pledge-test-modal').modal('show');
        },
        error: function(data, status, err) {
            console.log(err);
            $('#pledge').waitMe('hide');
        }
    });
});

$('#pledge-test-button-1, #pledge-test-button-2, #pledge-test-button-3').click(function () {
    if (blindLoopIndex < 10) {
        $('#pledge-test-title').html(blindList[blindLoopIndex].title);
        $('#pledge-test-contents').html(blindList[blindLoopIndex].contents);
        $('#pledge-test-count').html((blindLoopIndex + 1) + '/' + blindList.length);
        blindLoopIndex += 1;
        blindResult.push(this.value);
    } else {
        waitMe($('#pledge-test-modal'));
        blindLoopIndex += 1;
        blindResult.push(this.value);

        console.log(blindResult);
        $.ajax({
                url: '/pledge',
                cache: false,
                headers: {
                    'Content-Type':'application/json'
                },
                async: true,
                type: 'POST',
                data: JSON.stringify({
                    'token': blindToken,
                    'list': blindResult
                }),
                success: function(data) {
                    var testModal = $('#pledge-test-modal');
                    testModal.waitMe('hide');
                    testModal.modal('hide');
                    $('#pledge-result').html(data);
                    $('#pledge-result-modal').modal('show');
                },
                error: function(data, status, err) {
                    $('#pledge-test-modal').waitMe('hide');
                    console.log(err);
                }
            });
    }
});