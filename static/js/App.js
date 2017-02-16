requirejs.config({
	baseUrl: DAESUN.BASE_URL,
	//baseUrl: 'https://storage.googleapis.com/daesun2017.appspot.com/static/js/',
	packages: [{
		name: 'agency',
		location: '../js',
		main: 'agency.min'
	}]
});

requirejs([
    'Timeline',
	'agency'
],
function(Timeline, agency){

	var prevView = null, routers = null;

	/*
	 * 초기 실행함수
	 */
	function init(){
		setHandlebars();
		//Router.init();
	}

	/*
	*
	*/
	function setHandlebars(){

        Timeline.render();
        Timeline.show();

	}

	init();
})
