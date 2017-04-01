$(document).ready(function(){

    $('#buttonUserName').click(function(){

        inputName = $('#inputUserName')[0];

        strarr = new Array(inputName.value.length);
        schar = new Array('/','.','>','<',',','?','}','{',' ','\\','|','(',')','+','=');
        for (i=0; i<inputName.value.length; i++)    {
            for (j=0; j<schar.length; j++)        {
                if (schar[j] ==inputName.value.charAt(i))
                {
                    alert("이름은 한글입력만 가능합니다.");
                    return false;
                }
                else
                    continue;
            }
            strarr[i] = inputName.value.charAt(i)
            if ((strarr[i] >=0) && (strarr[i] <=9))
            {
                alert("이름에 숫자가 있습니다. 이름은 한글입력만 가능합니다.");
                return false;
            }
            else if ((strarr[i] >='a') && (strarr[i] <='z'))
            {
                alert("이름에 알파벳이 있습니다. 이름은 한글입력만 가능합니다.");
                return false;
            }
            else if ((strarr[i] >='A') && (strarr[i] <='Z'))
            {
                alert("이름에 알파벳이 있습니다. 이름은 한글입력만 가능합니다.");
                return false;
            }
            else if ((escape(strarr[i]) > '%60') && (escape(strarr[i]) <'%80') )
            {
                alert("이름에 특수문자가 있습니다. 이름은 한글입력만 가능합니다.");
                return false;
            }
            else
            {
                continue;
            }
        }

        waitMe($('#lucky-name-modal'));

        $.ajax({
            url:'/luckyname?name='+inputName.value,
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