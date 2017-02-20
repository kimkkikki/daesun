$(document).ready(function(){
    var end = 0;
    var endApis = function() {
        if (end < 2) {
            end++;
        } else {
            $('#chemistry').waitMe('hide');
            end = 0;
        }
    }
	var nameluckUrl = "/apis/name?name=";
	var nameLuckData;
	var userName = '';
	var nameLuckScoreToSort = []
	var nameLuckScoreFromSort = []

	var getNameLuckList = function(){
	    waitMe($('#chemistry'));
		$.ajax({
			url: nameluckUrl + userName,
			headers: {
		        'Content-Type':'application/json'
		    },
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				nameLuckData = data;

				// 내가 후보를 생각하는 이름점
				nameLuckScoreToSort = nameLuckData.list.slice(0); //깊은 복사
				nameLuckScoreToSort.sort(function(a,b){
					return b.score_to-a.score_to
				})
				createNameLuck(nameLuckScoreToSort);
				
				// 후보가 나를 생각하는 이름점
				// nameLuckScoreFromSort = nameLuckData.list.slice(0); //깊은 복사
				// nameLuckScoreFromSort.sort(function(a,b){
				// 	return b.score_from-a.score_from
				// })
				// createNameLuck(nameLuckScoreFromSort);

                $('#chemistry').waitMe('hide');
			},
			error: function(data, status, err) {
				console.log(err);
                $('#chemistry').waitMe('hide');
			}
		});
	}

	var createNameLuck = function(nameLuckData){
		var nameLuckData = nameLuckData;
		
		for(var i=0; i< nameLuckData.length; i++){
			var userToCandidate = nameLuckData[i].candidate + ' ' + nameLuckData[i].score_to + '% 만큼 좋아해요.';
			var updown_pic ='';
			// var candidateToUser = nameLuckData[i].candidate + ' → ' + userName + ' ' + nameLuckData[i].score_from + '% 만큼 좋아해요.'
			if (nameLuckData[i].candidate === '안희정')
				updown_pic = 'hee';
			else if (nameLuckData[i].candidate === '남경필')
				updown_pic = 'nam';
			else if (nameLuckData[i].candidate === '문재인')
				updown_pic = 'moon';
			else if (nameLuckData[i].candidate === '안철수')
				updown_pic = 'ahn';
			else if (nameLuckData[i].candidate === '이재명')
				updown_pic = 'lee';
			else if (nameLuckData[i].candidate === '황교안')
				updown_pic = 'hwang';

			if (nameLuckData[i].score_to >= 50){
				updown_pic += '_up.jpg';
			} else {
				updown_pic += '_down.jpg';
			}


			// <a href="#blindChemistryModal" data-toggle="modal">
			$("#panelGroup").append(
			            "<div class='col-xs-12 col-md-6'>"+
			                "<div class='panel panel-default'>"+
			                    "<div class='panel-body'>"+
			                    	"<div class='row'>"+
			                            "<div class='col-xs-4 vcenter'>"+
	                                        "<h3><strong>"+(i+1)+"위</strong></h3>"+
	                                        "<h4>"+nameLuckData[i].candidate+"</h4>"+
			                            "</div>"+
			                            "<div class='col-xs-4 vcenter'>"+
			                            	"<div style='text-align: center'>"+
											    "<div style='display: inline-block;'>"+
					                                "<span class='helper'></span>"+
					                                "<img src='/static/img/nameLuck_pic/"+updown_pic+"' class='img-circle img-responsive'/>"+
				                                "</div>"+
			                                "</div>"+
			                            "</div>"+
			                            "<div class='col-xs-4 vcenter'>"+
			                                "<h3><strong>"+nameLuckData[i].score_to+" %</strong></h3>"+
			                            "</div>"+
		                            "</div>"+
			                    "</div>"+
			                "</div>"+
			            "</div>")
		}
	}

	//modal open
	$('#blindChemistryModal').on('shown.bs.modal', function () {
		getNameLuckList();
		$('#snsBtnGroup').removeClass('displayNone');
	});
	//modal close
	$('#blindChemistryModal').on('hidden.bs.modal', function () {
		$('#panelGroup').empty();
		$('#snsBtnGroup').addClass('displayNone');
	});
	
	$('#buttonUserName').click(function(){
		var input_name = $('#inputUserName')
		var isValidate = name_validation(input_name);

		if (isValidate){
			userName = input_name.val();
			//show modal
			$('#blindChemistryModal').modal({
		        show: true
		    });		
		} else {
			input_name.focus();
		}
	});

	var name_validation = function(name){
		var name_value = name.val();
		name_value.trim(); //공백 제거
		var name_length = name_value.length;
		if( name_value == "")
		{
			$('#inputUserName').val("");
			// alert("이름을 입력하세요.");
			return false;
		} else {
			var kor_check = /([^가-힣\x20])/i;
			if (kor_check.test(name_value)) {
				alert("한글만 입력하세요.");
				$('#inputUserName').val("");
				return false;
			} else {
				if( name_length < 2 || name_length > 4 ) {
					alert("2글자 이상 입력하세요.");
					$('#inputUserName').val("");
					return false;
				} else {
					return true;
				}
			}
		}
	}

	$('.snsBtnGroup > a').click(function(){
		var sns = $(this).attr("id");
		var url = 'www.2017daesun.com'
		var txt = '2017 대선 닷컴을 소개합니다.';
		sendSns(sns, url, txt);
	});

	var fnCopy = function() {
	    html2canvas($("#divSource"), {
	        //allowTaint: true,
	        //taintTest: false,
	        useCORS: true,
	        proxy: '/etc/proxy_image',
	        onrendered: function(canvas) {
	            var image = canvas.toDataURL();
	            $("#imgTarget").attr("src", image);
	            meta.page.notify("Image Target 영역에 이미지가 생성되었습니다.");
	        }
	    });
	}

	var fnDownload = function () {
		html2canvas($('#panelGroup'), {
			useCORS: true,
	        proxy: '/etc/proxy_image',
		  	onrendered: function(canvas) {
		  		var image = canvas.toDataURL();
	            meta.cmn.submitHiddenForm("/etc/bypass_image", { image : image });
		  }
		});
	}
	
	function sendSns(sns, url, txt)
	{
	    var o;
	    var _url = encodeURIComponent(url);
	    var _txt = encodeURIComponent(txt);
	    var _br  = encodeURIComponent('\r\n');
	 
	    switch(sns)
	    {
	        case 'facebook':
	            o = {
	                method:'popup',
	                url:'http://www.facebook.com/sharer/sharer.php?u=' + _url
	            };
	            break;
	 
	        case 'twitter':
	            o = {
	                method:'popup',
	                url:'http://twitter.com/intent/tweet?text=' + _txt + '&url=' + _url
	            };
	            break;
	 
	        case 'kakaotalk':
	            o = {
	                method:'web2app',
	                param:'sendurl?msg=' + _txt + '&url=' + _url + '&type=link&apiver=2.0.1&appver=2.0&appid=dev.epiloum.net&appname=' + encodeURIComponent('Epiloum 개발노트'),
	                a_store:'itms-apps://itunes.apple.com/app/id362057947?mt=8',
	                g_store:'market://details?id=com.kakao.talk',
	                a_proto:'kakaolink://',
	                g_proto:'scheme=kakaolink;package=com.kakao.talk'
	            };
	            break;
	 
	        case 'kakaostory':
	            o = {
	                method:'web2app',
	                param:'posting?post=' + _txt + _br + _url + '&apiver=1.0&appver=2.0&appid=dev.epiloum.net&appname=' + encodeURIComponent('Epiloum 개발노트'),
	                a_store:'itms-apps://itunes.apple.com/app/id486244601?mt=8',
	                g_store:'market://details?id=com.kakao.story',
	                a_proto:'storylink://',
	                g_proto:'scheme=kakaolink;package=com.kakao.story'
	            };
	            break;
	 
	        case 'band':
	            o = {
	                method:'web2app',
	                param:'create/post?text=' + _txt + _br + _url,
	                a_store:'itms-apps://itunes.apple.com/app/id542613198?mt=8',
	                g_store:'market://details?id=com.nhn.android.band',
	                a_proto:'bandapp://',
	                g_proto:'scheme=bandapp;package=com.nhn.android.band'
	            };
	            break;
	 
	        default:
	            alert('지원하지 않는 SNS입니다.');
	            return false;
	    }
	 
	    switch(o.method)
	    {
	        case 'popup':
	            window.open(o.url);
	            break;
	 
	        case 'web2app':
	            if(navigator.userAgent.match(/android/i))
	            {
	                // Android
	                setTimeout(function(){ location.href = 'intent://' + o.param + '#Intent;' + o.g_proto + ';end'}, 100);
	            }
	            else if(navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i))
	            {
	                // Apple
	                setTimeout(function(){ location.href = o.a_store; }, 200);          
	                setTimeout(function(){ location.href = o.a_proto + o.param }, 100);
	            }
	            else
	            {
	                alert('이 기능은 모바일에서만 사용할 수 있습니다.');
	            }
	            break;
	    }
	}
});