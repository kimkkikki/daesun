$(document).ready(function(){

    $('#buttonUserName').click(function(){

        waitMe($('#lucky-name-modal'));

        $.ajax({
            url:'/luckyname?name='+$('#inputUserName')[0].value,
            type:'GET',
            success:function(data){

                $('#lucky-name-result').html(data);
                $('#lucky-name-modal').waitMe('hide');
            },
            error: function(data, status, err) {
                console.log(err);
                $('#lucky-name-modal').waitMe('hide');
            }
        });
    });

    $('#kakao-link-btn').click(function(){

        waitMe($('#lucky-name-modal-footer'));

        html2canvas($("#lucky-name-result"), {
            onrendered: function(canvas) {
                var image = canvas.toDataURL("image/png");
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
                        url = data;
                        console.log(data);
                        snsShare('kakaotalk', data, '베스트이름커플');
                        $('#lucky-name-modal-footer').waitMe('hide');

                    },
                    error: function(data, status, err) {
                        console.log(err);
                        $('#lucky-name-modal-footer').waitMe('hide');
                    }
                });
            }
        });
    });

});