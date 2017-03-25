/**
 * Created by kimkkikki on 2017. 3. 24..
 */

$('#slot-share-facebook').click(function () {
    console.log('slot-share candidate : ' + slot_result_candidate + ', count : ' + slot_result_count);

    waitMe($('#slot-modal'));
    html2canvas($('#slot-modal-body'), {
        onrendered: function (canvas) {
            var image = canvas.toDataURL("image/jpeg");
            $.ajax({
                url:'/apis/upload',
                headers: {
                    'Content-Type':'application/json'
                },
                data: JSON.stringify({
                    'image': image
                }),
                type:'POST',
                success:function(data){
                    console.log(data);
                    $('#slot-modal').waitMe('hide');
                    snsShare('facebook', data, null);
                },
                error: function(data, status, err) {
                    $('#slot-modal').waitMe('hide');
                    console.log(err);
                }
            });
        }
    });
});

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
            var slotModalCount = $('#slot-machine-count');
            slotModalCount.html('#' + slot_count);
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
                slotModalCount.tooltip('show');
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

$('#slot-honor-button').click(function () {
    waitMe($('#slot'));
    $.ajax({
            url: '/slot/honor',
            headers: {
                'Content-Type':'application/json'
            },
            async: true,
            type: 'GET',
            success: function(data) {
                $('#slot-honor-result').html(data);
                $('#slot-honor-modal').modal('show');
                $('#slot').waitMe('hide');
            },
            error: function(data, status, err) {
                console.log(err);
                $('#slot').waitMe('hide');
            }
        });

});