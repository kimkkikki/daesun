requirejs.config({
	baseUrl: 'static/js/',
	paths: {
		'text':'../lib/text/text',
		'tpl':'../template',
	}
});

requirejs([
    'Timeline'
],
function(Timeline){

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
