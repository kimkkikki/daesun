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

        var url = 'http://imgnews.naver.com/image/082/2017/02/21/20170221000028_0_99_20170222115012.jpg';

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
                        console.log(data);
                        url = 'http://2017daesun.com/' + data;
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
                            }
                        });
                    },
                    error: function(data, status, err) {
                        console.log(err);
                    }
                });
            },
        });
    });

});