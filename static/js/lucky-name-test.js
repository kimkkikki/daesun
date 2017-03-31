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

    $('.share-name-lucky').click(function(){
        var id = this.id;
        waitMe($('#lucky-name-modal'));
        html2canvas(document.getElementById('lucky-name-image'), {
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
                    cache: false,
                    type:'POST',
                    success:function(data){
                        console.log(data);
                        if( id == 'name-share-facebook'){
                            snsShare('facebook', data, null);
                        }else if( id =='name-share-kakaotalk') {
                            snsShare('kakaotalk', data, '베스트이름커플');
                        }
                        $('#lucky-name-modal').waitMe('hide');

                    },
                    error: function(data, status, err) {
                        console.log(err);
                        $('#lucky-name-modal').waitMe('hide');
                    }
                });
            }
        });
    });
});