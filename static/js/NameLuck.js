$(document).ready(function(){

	// var nameluckUrl = "http://daesun2017.appspot.com/apis/name?name=";
	
	var nameLuckUrl = "/dummy/nameLuck.json";

	var nameLuckData;
	var userName = '';
	var nameLuckScoreToSort = []
	var nameLuckScoreFromSort = []
	var getNameLuckList = function(){
		$.ajax({
			// 적용할 때, 아래 코드의 주석을 풀어줘야 합니다.
			url: nameLuckUrl,// + userName,
			headers: {
		        'Content-Type':'application/json'
		    },
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				nameLuckData = data;
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
			},
			error: function(data, status, err) {
				console.log(err);
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

			$("#panelGroup").append(
			            "<div class='col-xs-12 col-md-6'>"+
			                "<div class='panel panel-default'>"+
			                    "<div class='panel-body'>"+
		                            "<div class='col-xs-4 text-center vcenter'>"+
	                                    "<div class='col-xs-12'>"+
	                                        // "<p style='font-size:30px;'><strong>"+nameLuckData[i].candidate+"</strong></p>"+
	                                        "<span class='align-middle'><p style='font-size:20px;'><strong>"+(i+1)+"위<br>"+nameLuckData[i].candidate+"</strong></p></span>"+
	                                    "</div>"+
		                            "</div>"+
		                            "<div class='col-xs-4 text-center vcenter'>"+
		                                // "<img src='/img/nameLuck_pic/"+updown_pic+"' class='img-circle'/>"+
		                                "<img src='/img/nameLuck_pic/"+updown_pic+"' width='100px' height='100px' class='img-circle'/>"+
		                            "</div>"+
		                            "<div class='col-xs-4 text-center vcenter'>"+
		                                "<p style='font-size:20px;'><strong>"+nameLuckData[i].score_to+"%</strong></p>"+
		                            "</div>"+
			                    "</div>"+
			                "</div>"+
			            "</div>")
		}
	}

	var justOne = false;
	$('#buttonUserName').click(function(){
		$('#panelGroup').empty();
		if(userName !== $('#inputUserName').val()){
			userName = $('#inputUserName').val();
			justOne = false;
		}
		//이름점 리스트
		if (justOne === false){
			getNameLuckList();
			justOne = true;
		}
	});

	$('.snsBtnGroup > a').click(function(){
		var sns = $(this).attr("id");
		var url = 'www.2017daesun.com'
		var txt = '2017 대선 닷컴을 소개합니다.';
		sendSns(sns, url, txt);
	});

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

/////vis.js library 사용한 버전. 별로////

// var nodes = null;
// var edges = null;
// var network = null;

// function destroy() {
//     if (network !== null) {
//         network.destroy();
//         network = null;
//     }
// }

// function draw() {
//     destroy();
//     // randomly create some nodes and edges
//     var nodeCount = 21;
//     var data = getScaleFreeNetwork(nodeCount)

//     // create a network
//     var container = document.getElementById('mynetwork');
//     var options = {
//         layout: {
//             hierarchical: {
//             	parentCentralization: true,
//             	enabled: true, 
//                 direction: 'DU',
//                 levelSeparation: 80
                
//             }
//         },
// 	    physics: {
// 	    	enabled: true
// 	    },
// 	    nodes: {
// 		    fixed: false,
// 		    level: 6
// 	    }
//     };

//     network = new vis.Network(container, data, options);

//     // add event listeners
//     network.on('select', function (params) {
//         document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
//     });
// }

// function getScaleFreeNetwork(nodeCount) {
// 	var nodes = [];
// 	var edges = [];
// 	// var connectionCount = [];
// 	var to = 0;
// 	var from = 0;
// 	var depth = 1;
// 	var level = 0;
// 	// randomly create some nodes and edges
//   	for (var i = 0; i < nodeCount; i++) {
//   		if(i===1 || i===3 || i===6 || i===10 || i===15){
//   			level = level + 1;
//   		}
// 	    nodes.push({
// 	      id: i,
// 	      label: String(i),
// 	      level: level
// 	    });
// 	}

// 	for (var i = 0; i < 15; i++) {
// 		to = i; // 0 일 때, from 1, 2
	
// 		if(i===1 || i===3 || i===6 || i===10){
// 			depth = depth + 1;
// 		}

// 		from = i+depth;
// 		console.log(i+': '+from)
// 		edges.push({
// 		  to: to,
// 		  from: from
// 		});

// 		from = from + 1;

// 		edges.push({
// 		  to: to,
// 		  from: from
// 		});

// 		console.log(i+': '+from)
	
// 	}
	  
//   console.log(nodes)
//   console.log(edges)
  
//   return {nodes:nodes, edges:edges};
// }