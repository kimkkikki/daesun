/**
 * Created by kimkkikki on 2017. 3. 24..
 */

$('#slot-guide-button').click(function () {
    $('#slot-guide-modal').modal('show');
});

function share_facebook(){
    waitMe($('#slot-modal'));
    domtoimage.toJpeg(document.getElementById('slot-result-detail'), { quality: 0.95 })
        .then(function (dataUrl) {
        $.ajax({
            url:'/apis/upload',
            headers: {
                'Content-Type':'application/json'
            },
            data: JSON.stringify({
                'image': dataUrl
            }),
            type:'POST',
            success:function(data){
                console.log(data);
                $('#slot-modal').waitMe('hide');
                //snsShare('facebook', data, null);
                $('#your_name').removeAttr('disabled');
                $('#add_honor').removeAttr('disabled');
            },
            error: function(data, status, err) {
                $('#slot-modal').waitMe('hide');
                console.log(err);
            }
        });
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
        $('#slot-modal').waitMe('hide');
    });
}

function share_kakaotalk(){
    waitMe($('#slot-modal'));
    domtoimage.toJpeg(document.getElementById('slot-result-detail'), { quality: 0.95 })
        .then(function (dataUrl) {
            $.ajax({
                url:'/apis/upload',
                headers: {
                    'Content-Type':'application/json'
                },
                data: JSON.stringify({
                    'image': dataUrl
                }),
                type:'POST',
                success:function(data){
                    console.log(data);
                    $('#slot-modal').waitMe('hide');
                    snsShare('kakaotalk', data, null);
                    $('#your_name').removeAttr('disabled');
                    $('#add_honor').removeAttr('disabled');
                },
                error: function(data, status, err) {
                    $('#slot-modal').waitMe('hide');
                    console.log(err);
                }
            });
        })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
        $('#slot-modal').waitMe('hide');
    });
}

var slot_candidates = ['문재인', '안철수', '안희정', '홍준표', '이재명', '남경필', '심상정', '손학규', '유승민'];
var slot_count = 0;
var slot_result_count;
var slot_result_candidate;
var machine1 = $("#slot-machine-1").slotMachine({
                active	: Math.floor(Math.random() * 10),
                delay	: 500
            });
var machine2 = $("#slot-machine-2").slotMachine({
                active	: Math.floor(Math.random() * 10),
                delay	: 500
            });
var machine3 = $("#slot-machine-3").slotMachine({
                active	: Math.floor(Math.random() * 10),
                delay	: 500
            });

var result_1, result_2, result_3;
var slotModalCount = $('#slot-machine-count');
function onComplete(active){
    switch(this.element[0].id){
        case 'slot-machine-1':
            result_1 = active;
            break;
        case 'slot-machine-2':
            result_2 = active;
            break;
        case 'slot-machine-3':
            slot_count++;
            slotModalCount.html('총 ' + slot_count + '번 돌리셨습니다');
            result_3 = active;

            slotStart.prop('disabled', false);
            if (result_1 == result_2 && result_2 == result_3) {
                waitMe($('#slot'));
                slot_result_candidate = slot_candidates[result_1];
                slot_result_count = slot_count;
                $.ajax({
                        url: '/slot',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        async: true,
                        type: 'POST',
                        data: JSON.stringify({
                            'type': 'slot',
                            'candidate': slot_candidates[result_1],
                            'count': slot_count
                        }),
                        success: function(data) {
                            $('#slot-result').html(data);
                            $('#slot-modal').modal('show');
                            //TODO 슬롯 카운트 초기화 언제?
                            slot_count = 0;
                            $('#slot').waitMe('hide');
                        },
                        error: function(data, status, err) {
                            console.log(err);
                            $('#slot').waitMe('hide');
                        }
                    });
            } else {
                var messages = ['까비 다시 도전해보세요', '후보 고르기 슆지 않죠. 다시고고!', '힘내세요. 다시 도전!', '슬슬 포기단계? 힘내서 고고!', '확률은 확률일 뿐. 다시 도전!', 'ㅠㅠ', '까비요.'];
                slotModalCount.attr('data-original-title', messages[Math.floor((Math.random() * 8))])
                  .tooltip('show');
            }
            break;
    }
}

var slotStart = $('#slot-start');

slotStart.click(function(){
    slotStart.prop('disabled', true);
    machine1.shuffle(5, onComplete);
    machine2.shuffle(10, onComplete);
    machine3.shuffle(15, onComplete);
    $('#slot-machine-count').tooltip('hide');
});

function check(){
    if( $('#your_name')[0].disabled == true){
        $('#add-honor-form').attr('data-original-title', '소셜 공유 후에 명예의 전당에 등록하실 수 있습니다').tooltip('show');
    }else{
        $('#add-honor-form').removeAttr('data-original-title');
    }
}


$(document).ready(function(){

    $('#add_honor').click(function () {
    alert('click');
        $.ajax({
            url: '/apis/slot/add',
            headers: {
                'Content-Type':'application/json'
            },
            async: true,
            type: 'POST',
            data: $('#form').serialize(),
            success: function(data) {
                console.log('done');
                $('#slot').waitMe('hide');
            },
            error: function(data, status, err) {
                console.log(err);
                $('#slot').waitMe('hide');
            }
        });
    });

});