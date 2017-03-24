$(document).ready(function(){

    Kakao.init('17c8317e213251d5ed0578e27ad3b8e9');

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
                        Kakao.Link.sendTalkLink({
                            label: '베스트이름커플',
                            image: {
                                src: url,
                                width: '300',
                                height: '200'
                            },
                            webButton: {
                                text: '2017daesun.com',
                                url: 'http://2017daesun.com'
                            },
                            fail: function(){
                                alert('카카오톡 앱이 설치되어 있는 모바일 기기에서만 전송 가능합니다.');
                                console.log('fail share kakaotalk');
                            }
                        });
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