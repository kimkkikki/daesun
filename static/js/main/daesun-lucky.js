/**
 * Created by kimkkikki on 2017. 3. 19..
 */

$('.constellation-button').click(function () {
    var sns = this.value;
    waitMe($('#constellation-modal'));
    html2canvas(document.getElementById('constellation-modal-contents'), {
        useCORS: true,
        onrendered: function(canvas) {
            var image = canvas.toDataURL('image/jpeg', 0.9);
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
                    snsShare(sns, data, '대선후보 별자리 궁합 결과');
                    $('#constellation-modal').waitMe('hide');
                },
                error: function(data, status, err) {
                    $('#constellation-modal').waitMe('hide');
                    console.log(err);
                }
            });
        }
    });
});

$('#constellation-button').click(function() {
    var selectConstellation = $('#constellation-select').val();
    if (selectConstellation === 'None') {
        alert('별자리를 선택해주세요')
    } else {
        waitMe($('#constellation-lucky'));
        $.ajax({
                url: '/constellation',
                headers: {
                    'Content-Type':'application/json'
                },
                cache: false,
                type: 'POST',
                data: JSON.stringify({
                    'constellation': selectConstellation
                }),
                success: function(data) {
                    $('#constellation-result').html(data);
                    $('#constellation-modal').modal('show');
                    $('#constellation-lucky').waitMe('hide');
                },
                error: function(data, status, err) {
                    console.log(err);
                    $('#constellation-lucky').waitMe('hide');
                }
            });
    }
});

$('#blood-type-button').click(function() {
    var selectBlood = $('#blood-type').val();
    if (selectBlood === 'None') {
        alert('혈액형을 선택해주세요')
    } else {
        waitMe($('#lucky'));
        $.ajax({
                url: '/blood',
                headers: {
                    'Content-Type':'application/json'
                },
                cache: false,
                type: 'POST',
                data: JSON.stringify({
                    'blood': selectBlood
                }),
                success: function(data) {
                    $('#blood-result').html(data);
                    $('#blood-modal').modal('show');
                    $('#lucky').waitMe('hide');
                },
                error: function(data, status, err) {
                    console.log(err);
                    $('#lucky').waitMe('hide');
                }
            });
    }
});

$('#zodiac-type-button').click(function() {
    var selectZodiac = $('#zodiac-type').val();
    if (selectZodiac === 'None') {
        alert('띠를 선택해주세요')
    } else {
        waitMe($('#lucky'));
        $.ajax({
                url: '/zodiac',
                headers: {
                    'Content-Type':'application/json'
                },
                cache: false,
                type: 'POST',
                data: JSON.stringify({
                    'zodiac': selectZodiac
                }),
                success: function(data) {
                    $('#zodiac-result').html(data);
                    $('#zodiac-modal').modal('show');
                    $('#lucky').waitMe('hide');
                },
                error: function(data, status, err) {
                    console.log(err);
                    $('#lucky').waitMe('hide');
                }
            });
    }
});