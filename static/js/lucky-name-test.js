$(document).ready(function(){

    $('#buttonUserName').click(function(){

        waitMe($('#lucky-name-modal'));

        $.ajax({
            url:'/apis/luckyname?name='+$('#inputUserName')[0].value,
            type:'GET',
            success:function(data){
                result = data.list;

                $('#your_name')[0].textContent = $('#inputUserName')[0].value;
                $('#lucky_name_result_rest')[0].textContent = null;
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

                        var image = new Image();
                        image.setAttribute("src", getImage(obj.candidate));
                        image.setAttribute("class","img-responsive img-circle");
                        image.setAttribute("style", "width:60px;")

                        node.append(text);
                        node.appendChild(image);
                        $('#lucky_name_result_rest')[0].appendChild(node);
                        //$('#lucky_name_result_rest')[0].appendChild(image);
                    }
                }
                destroy();
                draw('to', data.to_nodes, 'lucky_name_result_to');
                draw('from', data.from_nodes, 'lucky_name_result_from');

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
            imageUrl += 'ahn2.jpg';
        }else if(candidate =='안철수'){
            imageUrl += 'ahn1.jpg';
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



    var network_from = null;
    var network_to = null;

    function destroy() {

        if (network_from !== null) {
            network_from.destroy();
            network_from = null;
        }
        if (network_to !== null) {
            network_to.destroy();
            network_to = null;
        }
    }

    function draw(to_from, nodeList, target) {


        var nodes = [];
        var edges = [];

        for(var i=0; i < nodeList.length ;i++){
            nodes.push(nodeList[i]);
        }

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
        var container = document.getElementById(target);
        var data = {
            nodes: nodes,
            edges: edges
        };

        var options = {
            autoResize:true,
            height: '100%',
            width: '100%',
            nodes: {
                font: {
                  size: 50, // px
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
        if(to_from == 'to') {
            network_to = new vis.Network(container, data, options);
        }else{
            network_from = new vis.Network(container, data, options);
        }
    }

    $('#name_share').click(function(){
        html2canvas($("#lucky_name_best"), {
            onrendered: function(canvas) {
                theCanvas = canvas;
                document.body.appendChild(canvas);

                // Convert and download as image
                var image = Canvas2Image.convertToImage(canvas);
                $("#img-out").append(image);



                console.log(Canvas2Image.getSrc(canvas));

                Kakao.init('17c8317e213251d5ed0578e27ad3b8e9');
                // // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.

                Kakao.Link.createTalkLinkButton({
                  container: '#name_share',
                  label: '당신의후보에게투표하세요',
                  image: {
                    src: "",
                    width: '300',
                    height: '200'
                  },
                  webButton: {
                    text: '2017daesun.com',
                    url: 'http://2017daesun.com'
                  }
                });

                // Clean up
                //document.body.removeChild(canvas);
            }
        });
    });

});