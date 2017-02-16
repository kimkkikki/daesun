/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
define([
		'module'
	],
	function(module){

		module.exports = new (Backbone.Model.extend({
			getKeyword:function(option){
                $.ajax({
                    url: DAESUN.HOST + '/apis/timeline',
                    method : 'GET',
                    //data : JSON.stringify({'username':option.id,'password':option.pwd}),
                    dataType : 'json',
                    contentType:"application/json; charset=UTF-8",
                    success : option.success,
					error : option.error
                    // success : function(data, textStatus, jqXHR){
                    //     console.log(data)
                    // },
                    // error : function(jsXHR, textStatus, errorThrown){
                    //     console.log(jsXHR)
                    // }
                });
			},

			getBooks:function(option){
                $.ajax({
                    url: DAESUN.HOST + '/apis/books',
                    method : 'GET',
                    data : {'query':option.query,'display':option.display,'start':option.start},
                    dataType : 'json',
                    contentType:"application/json; charset=UTF-8",
                    success : option.success,
					error : option.error
                    // success : function(data, textStatus, jqXHR){
                    //     console.log(data)
                    // },
                    // error : function(jsXHR, textStatus, errorThrown){
                    //     console.log(jsXHR)
                    // }
                });
			},
			getPressList:function(option){
				$.ajax({
					url: DAESUN.HOST + '/apis/cp/group',
					type: 'GET',
					dataType: 'json',
					success : option.success,
					error : option.error
				});
			}
		}))
	}
)
