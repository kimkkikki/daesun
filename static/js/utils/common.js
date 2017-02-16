(function(){
	window.DAESUN = window.DAESUN || {};

    DAESUN.HOST = ''
	DAESUN.BASE_URL = '';

	console.log(location.hostname)

    switch(location.hostname){
		case 'localhost':
			DAESUN.BASE_URL = 'static/js/';
		break;
		default:
			DAESUN.BASE_URL = 'https://storage.googleapis.com/daesun2017.appspot.com/static/js/';
		break;
	}
})();

(function(DAESUN){
	DAESUN.util = {};

	Object.assign(DAESUN.util,{

		parseHash : function(){
			var hash;

			if(!location.hash.length){
				return null;
			}

			hash = location.hash.split('/');

			hash[0] = hash[0].replace('#','');

			return hash;
		},

		millisecondToTime:function(s){
			var ms = s % 1000;
			s = (s - ms) / 1000;
			var secs = s % 60;
			s = (s - secs) / 60;
			var mins = s % 60;
			var hrs = (s - mins) / 60;

			return hrs + '시간 ' + mins + '분 ' + secs + '초';
		}

	})
})(DAESUN);
