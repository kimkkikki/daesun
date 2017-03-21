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


    $('#name_share').click(function(){
        html2canvas($("#lucky-name-result"), {
            onrendered: function(canvas) {
                var image = canvas.toDataURL("image/png");
                //console.log(image)
                // Convert and download as image
                //var image = Canvas2Image.convertToImage(canvas);
                //console.log(image.currentSrc)
                //$("#img-out").append(canvas);
                //var image = canvas.toDataURL();

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
                        console.log(data)
                        kakaotalk(data)
                    },
                    error: function(data, status, err) {
                        console.log(err);
                    }
                });
            },
        });
    });

    function kakaotalk(url){
        Kakao.init('17c8317e213251d5ed0578e27ad3b8e9');
                // // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.

        Kakao.Link.createTalkLinkButton({
          container: '#name_share',
          label: '당신의후보에게투표하세요',
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

        // Clean up
        //document.body.removeChild(canvas);
    }

});