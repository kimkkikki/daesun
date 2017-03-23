AOS.init();

$('[data-toggle="tooltip"]').tooltip();

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

$(".navbar ul li a[href^='#']").on('click', function(e) {
   e.preventDefault();

   var hash = this.hash;

   // animate
   $('html, body').animate({
       scrollTop: $(hash).offset().top
     }, 300, function(){

       // when done, add hash to url
       // (default click behaviour)
       window.location.hash = hash;
     });

});

function waitMe(element) {
    element.waitMe({
        effect : 'facebook',
        text : '로딩 중입니다',
        bg : 'rgba(255,255,255,0.7)',
        color : '#000',
        maxSize : '',
        textPos : 'vertical',
        fontSize : '',
        source : ''
    });
}

var csrftoken = Cookies.get('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
