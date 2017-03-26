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
        domtoimage.toJpeg(document.getElementById('lucky-name-content'), { quality: 0.95 })
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
                        url = data;
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
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
                $('#lucky-name-modal').waitMe('hide');
            });
    });
});