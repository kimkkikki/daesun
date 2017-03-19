$(document).ready(function(){

    $('#buttonUserName').click(function(){

        waitMe($('#lucky-name-modal'));

        $.ajax({
            url:'/apis/luckyname?name='+$('#inputUserName')[0].value,
            type:'GET',
            success:function(data){
                result = data.list;
                $('#your_name')[0].textContent = $('#inputUserName')[0].value;

                for(var i=0; i< result.length ; i++ ){
                    var obj = result[i];
                    console.log(obj);
                    if(i==0){
                        $('#best_candidate')[0].textContent = obj.candidate;
                        $('#best_score')[0].textContent = obj.score + '점';

                        $('#best_candidate_picture')[0].src= getImage(obj.candidate);

                    }else{
                        var node = document.createElement("span");
                        var text = document.createTextNode((i+1) + '등 ' + obj.candidate +' ' + obj.score + '점');
                        //var image = new Image();
                        //image.setAttribute("src", getImage(obj.candidate));
                        node.append(text);
                        $('#lucky_name_result_rest')[0].appendChild(node);
                        //$('#lucky_name_result_rest')[0].appendChild(image);
                    }
                }
                draw(data.nodes);

                $('#lucky-name-modal').waitMe('hide');
            },
            error: function(data, status, err) {
                console.log(err);
                $('#lucky-name-modal').waitMe('hide');
            }
        });
    });


    function getImage(candidate){

        var imageUrl = '/static/img/candidate/';

        if(candidate == '문재인'){
            imageUrl += 'moon.jpg';
        }else if(candidate =='안희정'){
            imageUrl += 'ahn1.jpg';
        }else if(candidate =='안철수'){
            imageUrl += 'ahn2.jpg';
        }else if(candidate =='홍준표'){
            imageUrl += 'hong.jpg';
        }else if(candidate =='황교안'){
            imageUrl += 'hwang.jpg';
        }else if(candidate =='이재명'){
            imageUrl += 'lee.jpg';
        }else if(candidate =='남경필'){
            imageUrl += 'nam.jpg';
        }else if(candidate =='심상정'){
            imageUrl += 'sim.jpg';
        }else if(candidate =='손학규'){
            imageUrl += 'son.jpg';
        }else if(candidate =='유승민'){
            imageUrl += 'you.jpg';
        }
        return imageUrl;
    }


    var nodes = null;
    var edges = null;
    var network = null;

    function destroy() {
        if (network !== null) {
            network.destroy();
            network = null;
        }
    }

    function draw(nodeList) {

        destroy();
        nodes = [];
        edges = [];

        for(var i=0; i < nodeList.length ;i++){
            nodes.push(nodeList[i]);
        }

        // 6개
        // - 10
        /*
         7자
          - 12 2*(7-1)
          - 10 2*5
          - 8 2*4
          - 6 2*3
          - 4 2*2

         6자
          - 10 2*5

          - 8 2*4
          - 6 2*3
          - 4 2*2

         5자
          - 8 2*4
          - 6
          - 4
         */
        // 이름 3글자인 사람들
        name_length = 6;
        var left = 0;
        var right = name_length;
        var left_name = 99;
        var right_name = 0;

        for(var time =0; time < 2; time++){

            for(var last = 0; last < 6;last++){
                edges.push({from: left_name-- , to: right_name++});
            }

            for(var i= name_length - 1; i*2 >= 4; i--){
                for(var j = 0; j <i; j++) {
                    edges.push({from: left, to: right})
                    edges.push({from: left + 1, to: right})
                    left++;
                    right++;
                }
                left++;
            }
            left += 2;
            right += name_length;
            right_name = left;

        }
        console.log(edges);

        // create a network
        var container = document.getElementById('lucky_name_result');
        var data = {
            nodes: nodes,
            edges: edges
        };

        var options = {
            height: '100%',
            width: '100%',
            edges: {
                smooth: {
                    type: 'cubicBezier',
                    forceDirection: 'horizontal',
                    roundness: 0.4
                }
            },
            nodes: {
                font: {
                  size: 40, // px
                 },
                color: {
                  background: '#ffffff',
                }
            },
            layout: {
                hierarchical: {
                    direction: 'DU'
                }
            },
            physics: {
                forceAtlas2Based: {
                  springLength: 100
                },
                maxVelocity: 11,
                minVelocity: 0.37,
                solver: 'forceAtlas2Based'
            }
        };
        network = new vis.Network(container, data, options);

    }

});


[{'id': 93, 'label': '문', 'level': 5},
    {'id': 92, 'label': '송', 'level': 5},
    {'id': 91, 'label': '재', 'level': 5},
    {'id': 90, 'label': '민', 'level': 5},
    {'id': 89, 'label': '인', 'level': 5},
    {'id': 88, 'label': '정', 'level': 5},
    {'id': 20, 'label': 8, 'level': 4},
    {'id': 21, 'label': 5, 'level': 4},
    {'id': 22, 'label': 6, 'level': 4},
    {'id': 23, 'label': 7, 'level': 4},
    {'id': 24, 'label': 4, 'level': 4},
    {'id': 25, 'label': 6, 'level': 4},
    {'id': 26, 'label': 3, 'level': 3},
    {'id': 27, 'label': 1, 'level': 3},
    {'id': 28, 'label': 3, 'level': 3},
    {'id': 29, 'label': 1, 'level': 3},
    {'id': 30, 'label': 0, 'level': 3},
    {'id': 31, 'label': 4, 'level': 2},
    {'id': 32, 'label': 4, 'level': 2},
    {'id': 33, 'label': 4, 'level': 2},
    {'id': 34, 'label': 1, 'level': 2},
    {'id': 35, 'label': 8, 'level': 1},
    {'id': 36, 'label': 8, 'level': 1},
    {'id': 37, 'label': 5, 'level': 1},
    {'id': 38, 'label': 6, 'level': 0},
    {'id': 39, 'label': 3, 'level': 0}]
