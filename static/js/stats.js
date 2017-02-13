$(document).ready(function(){

	// var press_url = "http://daesun2017.appspot.com/apis/cp/group";
	var press_url = "cp.json";
	// var daily_url = "http://daesun2017.appspot.com/apis/cp/daily";
	var daily_url = "date.json";

	var press_data;
	var total_moon=0;
	var total_lee=0;
	var total_hee=0;
	var total_you=0;
	var total_hwang=0;
	var total_ahn=0;
	var total_nam=0;

	var getPressList = function(){
		$.ajax({
			url: press_url,
			headers: {
		        'Content-Type':'application/json'
		    },
		    async: false,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				press_data = data;

				//누적치
				for (var i=0; i<press_data.length; i++){
					total_moon = total_moon +press_data[i].moon
					total_lee  = total_lee + press_data[i].lee
					total_hee  = total_hee + press_data[i].hee
					total_you  = total_you + press_data[i].you
					total_hwang= total_hwang+press_data[i].hwang
					total_ahn  = total_ahn + press_data[i].ahn
					total_nam  = total_nam + press_data[i].nam
				}
			},
			error: function(data, status, err) {
				console.log(err);
			}
		});
	}

	//언론사별 대선 주자 언급 횟수
	getPressList();
	var total_data = [
	            ['문재인', total_moon],
	            ['이재명', total_lee], 
	            ['안희정', total_hee], 
	            ['유승민', total_you], 
	            ['황교안', total_hwang],
	            ['안철수', total_ahn],
	            ['남경필', total_nam]]

	var press_chart = c3.generate({
		bindto: '#press_chart',
	    data: {
	        // iris data from R
	        columns: total_data,
	        type : 'pie',
	        onclick: function (d, i) { console.log("onclick", d, i); },
	        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
	        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
	    }
	});

	$("#selectBox").change(function(){
       console.log($(this).val());
       if ($(this).val() == 'total'){
	       	press_chart = c3.generate({
				bindto: '#press_chart',
			    data: {
			        // iris data from R
			        columns: total_data,
			        type : 'pie',
			        onclick: function (d, i) { console.log("onclick", d, i); },
			        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
			        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
			    }
			});
       } else {
       	    //선택한 것과 데이터의 이름이 같은 것 찾기	
	       for (var i=0; i < press_data.length; i++){
		   		if ($(this).val() == press_data[i].cp){
		   			var temp_press_data = []
		   			temp_press_data.push(['문재인', press_data[i].moon])
		   			temp_press_data.push(['이재명', press_data[i].lee])
		   			temp_press_data.push(['안희정', press_data[i].hee])
					temp_press_data.push(['유승민', press_data[i].you])
					temp_press_data.push(['황교안', press_data[i].hwang])
					temp_press_data.push(['안철수', press_data[i].ahn])
					temp_press_data.push(['남경필', press_data[i].nam])

				    press_chart = c3.generate({
						bindto: '#press_chart',
					    data: {
					        // iris data from R
					        columns: temp_press_data,
					        type : 'pie',
					        onclick: function (d, i) { console.log("onclick", d, i); },
					        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
					        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
					    }
					});
		   		}
		   }
       }
	});

	///////////////////////////////////////////////////////////////////////////

	var daily_data;

	var getDailyList = function(){
		$.ajax({
			url: daily_url,
			headers: {
		        'Content-Type':'application/json'
		    },
		    async: false,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				daily_data = data;
			},
			error: function(data, status, err) {
				console.log(err);
			}
		});
	}
	//날짜별 대선 주자 언급 횟수
	getDailyList();

	var timeMenu = ['x']
	var moon 	= ['문재인']
	var lee 	= ['이재명']
	var hee 	= ['안희정']
	var you 	= ['유승민']
	var hwang 	= ['황교안']
	var ahn 	= ['안철수']
	// var nam 	= ['남경필']

	for (var i=0; i< daily_data.length; i++){
		timeMenu.push(daily_data[i].date)
		moon.push(daily_data[i].moon)
		lee.push(daily_data[i].lee)
		hee.push(daily_data[i].hee)
		you.push(daily_data[i].you)
		hwang.push(daily_data[i].hwang)
		ahn.push(daily_data[i].ahn)
		// nam.push(daily_data[i].nam)
	}

	var daily_chart = c3.generate({
		bindto: '#daily_chart',
	    data: {
	        x: 'x',
	        columns: [
	            timeMenu,
	            moon,
	            lee,
	            hee,
	            you,
	            hwang,
	            ahn
	        ]
	    },
	    axis: {
	        x: {
	            type: 'timeseries',
	            tick: {
	                format: '%Y-%m-%d'
	            }
	        }
	    }
	});

});