$(document).ready(function(){

    Kakao.init('17c8317e213251d5ed0578e27ad3b8e9');
    var url = '';

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


    $('#name_share').click(function(){
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
                        url = data;
                        Kakao.Link.createTalkLinkButton({
                              container: '#share_kakao',
                              label: '이름짝꿍',
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