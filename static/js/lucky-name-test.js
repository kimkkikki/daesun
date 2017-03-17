$(document).ready(function(){

    $('#buttonUserName').click(function(){

        waitMe($('#lucky-name-modal'));

        $.ajax({
            url:'/apis/luckyname?name='+$('#inputUserName')[0].value,
            type:'GET',
            success:function(data){
                console.log(data.list)
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

        edges.push({from: 0, to: 6});
        edges.push({from: 1, to: 6});
        edges.push({from: 1, to: 7});
        edges.push({from: 2, to: 7});
        edges.push({from: 2, to: 8});
        edges.push({from: 3, to: 8});
        edges.push({from: 3, to: 9});
        edges.push({from: 4, to: 9});
        edges.push({from: 4, to: 10});
        edges.push({from: 5, to: 10});
        edges.push({from: 6, to: 11});
        edges.push({from: 7, to: 11});
        edges.push({from: 7, to: 12});
        edges.push({from: 8, to: 12});
        edges.push({from: 8, to: 13});
        edges.push({from: 9, to: 13});
        edges.push({from: 9, to: 14});
        edges.push({from: 10, to: 14});
        edges.push({from: 11, to: 15});
        edges.push({from: 12, to: 15});
        edges.push({from: 12, to: 16});
        edges.push({from: 13, to: 16});
        edges.push({from: 13, to: 17});
        edges.push({from: 14, to: 17});
        edges.push({from: 15, to: 18});
        edges.push({from: 16, to: 18});
        edges.push({from: 16, to: 19});
        edges.push({from: 17, to: 19});


        // create a network
        var container = document.getElementById('lucky_name_result');
        var data = {
            nodes: nodes,
            edges: edges
        };

        var options = {
            autoResize: true,
            height: '100%',
            width: '50%',
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
            physics:false
        };
        network = new vis.Network(container, data, options);

    }

});