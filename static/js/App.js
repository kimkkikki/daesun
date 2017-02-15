/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
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
