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

$('.blood-share-button').click(function () {
    var sns = this.value;
    waitMe($('#blood-modal'));
    html2canvas(document.getElementById('blood-modal-contents'), {
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
                    snsShare(sns, data, '대선후보 혈액형 궁합 결과');
                    $('#blood-modal').waitMe('hide');
                },
                error: function(data, status, err) {
                    $('#blood-modal').waitMe('hide');
                    console.log(err);
                }
            });
        }
    });
});

$('.zodiac-share-button').click(function () {
    var sns = this.value;
    waitMe($('#zodiac-modal'));
    html2canvas(document.getElementById('zodiac-modal-contents'), {
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
                    snsShare(sns, data, '대선후보 띠별궁합 결과');
                    $('#zodiac-modal').waitMe('hide');
                },
                error: function(data, status, err) {
                    $('#zodiac-modal').waitMe('hide');
                    console.log(err);
                }
            });
        }
    });
});

$('.total-share-button').click(function () {
    var sns = this.value;
    waitMe($('#total-modal'));
    html2canvas(document.getElementById('total-modal-contents'), {
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
                    snsShare(sns, data, '운명이 점지해준 후보');
                    $('#total-modal').waitMe('hide');
                },
                error: function(data, status, err) {
                    $('#total-modal').waitMe('hide');
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

$('#total-button').click(function() {
    var totalZodiac = $('#total-zodiac').val();
    var totalConstellation = $('#total-constellation').val();
    var totalName = $('#total-name').val();
    var totalBlood = $('#total-blood').val();
    if (totalZodiac === 'None') {
        alert('띠를 선택해주세요')
    } else if (totalConstellation === 'None') {
        alert('별자리를 선택해주세요')
    } else if (totalBlood === 'None') {
        alert('혈액형을 선택해주세요')
    } else if (totalName === '') {
        alert('이름을 입력해주세요')
    } else {
        waitMe($('#lucky'));
        $.ajax({
                url: '/total',
                headers: {
                    'Content-Type':'application/json'
                },
                cache: false,
                type: 'POST',
                data: JSON.stringify({
                    'zodiac': totalZodiac,
                    'blood': totalBlood,
                    'constellation': totalConstellation,
                    'name': totalName
                }),
                success: function(data) {
                    $('#total-result').html(data);
                    $('#total-modal').modal('show');
                    $('#lucky').waitMe('hide');
                },
                error: function(data, status, err) {
                    console.log(err);
                    $('#lucky').waitMe('hide');
                }
            });
    }
});