AOS.init();

$('[data-toggle="tooltip"]').tooltip();

$('.nav-link').on('click', function(){
    $('#navbar-collapse').collapse('hide')
});

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

var candidateColors = { 문재인: '#1870B9', 안철수: '#036241', 심상정: '#FFCA08', 유승민: '#01B1EC', 홍준표: '#C9151E' };

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-96916102-1', 'auto');
ga('send', 'pageview');

var config = {
apiKey: "AIzaSyDGwgCakCmplpZmlFaR9QePGwEHagS56fI",
authDomain: "daesun2017.firebaseapp.com",
databaseURL: "https://daesun2017.firebaseio.com",
projectId: "daesun2017",
storageBucket: "daesun2017.appspot.com",
messagingSenderId: "948214494481"
};
firebase.initializeApp(config);