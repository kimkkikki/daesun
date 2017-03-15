$(document).ready(function(){
    $('#buttonUserName').click(function(){
        $.ajax({
            url:'/apis/luckyname?name='+$('#inputUserName')[0].value,
            type:'GET',
            success:function(data){
                console.log(data.list)
                draw(data.nodes);
            }
        });
        return false;
    });


        var nodes = null;
        var edges = null;
        var network = null;
        var directionInput ='DU';

        function destroy() {
            if (network !== null) {
                network.destroy();
                network = null;
            }
        }

        function draw(data) {
            destroy();
            nodes = [];
            edges = [];
            var connectionCount = [];

            for(var i=0; i < data.length ;i++){
                nodes.push(data[i]);
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
            var container = document.getElementById('mynetwork');
            var data = {
                nodes: nodes,
                edges: edges
            };

            var options = {
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