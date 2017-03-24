/**
 * Created by kimkkikki on 2017. 3. 24..
 */

Kakao.init('17c8317e213251d5ed0578e27ad3b8e9');

window.fbAsyncInit = function() {
    FB.init({
      appId      : '149936898862655',
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/ko_KR/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function snsShare(sns, imageUrl, title) {
    if (sns == 'facebook') {
        console.log(sns);
        FB.ui({
            method: 'share',
            picture : imageUrl,
            href: 'https://2017daesun.com'
        }, function(response){
            if (response && !response.error_code) {
                console.log("Facebook Share Success : " + JSON.stringify(response));
            } else {
                console.log("Facebook Share Failure : " + JSON.stringify(response));
            }
        });
    } else if (sns == 'twitter') {
        console.log(sns);
    } else if (sns == 'kakaotalk') {
        console.log(sns);
        Kakao.Link.sendTalkLink({
            label: title,
            image: {
                src: imageUrl,
                width: '300',
                height: '200'
            },
            webButton: {
                text: '2017대선닷컴',
                url: 'https://2017daesun.com'
            },
            fail: function(){
                alert('카카오톡 앱이 설치되어 있는 모바일 기기에서만 전송 가능합니다.');
                console.log('fail share kakaotalk');
            }
        });
    } else {
        alert('지원하지 않는 SNS 입니다');
        console.log(sns);
    }
}
