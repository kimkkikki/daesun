var blindResult;
var blindToken;
var blindList;
var blindLoopIndex;

var blindTestEnd = function(data) {
    console.log(data);
    document.getElementById('blindTestDiv').style.display = 'none';
    document.getElementById('blindResultDiv').style.display = 'block';

    document.getElementById('blindResultTitle').innerHTML = data[0].candidate;
    document.getElementById('blindResultContents').innerHTML = data[0].candidate + ' 후보의 공약을 좋아하시네요';
}

function blindNextButtonClick(button) {

    if (blindLoopIndex < 10) {
        document.getElementById('blindTestTitle').innerHTML = blindList[blindLoopIndex].title;
        document.getElementById('blindTestContents').innerHTML = blindList[blindLoopIndex].contents;
        blindLoopIndex += 1;
        blindResult.push(button.value);

    } else {
        waitMe($('#blindTestModal'));
        blindLoopIndex += 1;
        blindResult.push(button.value);

        console.log(blindResult);
        var sendPledgeResult = function(){
            $.ajax({
                url: '/apis/pledge',
                cache: false,
                headers: {
                    'Content-Type':'application/json'
                },
                async: true,
                type: 'POST',
                data: JSON.stringify({
                    'token': blindToken,
                    'list': blindResult,
                    'csrfmiddlewaretoken': '{{ csrf_token }}',
                }),
                dataType: 'json',
                success: function(data) {
                    $('#blindTestModal').waitMe('hide');
                    blindTestEnd(data);
                },
                error: function(data, status, err) {
                    $('#blindTestModal').waitMe('hide');
                    console.log(err);
                }
            });
        }

        sendPledgeResult();
    }
}

function blindTestButtonClick() {
    waitMe($('#blindTestModal'));
    var getPledgeTest = function(){
        $.ajax({
            url: '/apis/pledge',
            headers: {
                'Content-Type':'application/json'
            },
            async: true,
            type: 'GET',
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log(data);
                $('#blindTestModal').waitMe('hide');
                blindResult = new Array();
                blindToken = data.token;
                blindList = data.list;
                blindLoopIndex = 1;

                document.getElementById('blindTestTitle').innerHTML = blindList[0].title;
                document.getElementById('blindTestContents').innerHTML = blindList[0].contents;
            },
            error: function(data, status, err) {
                console.log(err);
                $('#blindTestModal').waitMe('hide');
            }
        });
    }

    getPledgeTest();
}