requirejs.config({
	baseUrl: 'static/js/',
	packages: [{
		name: 'agency',
		location: '../js/',
		main: 'agency.min'
	}],
	paths: {
		'text':'../lib/text/text',
		'tpl':'../template',
	}
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
