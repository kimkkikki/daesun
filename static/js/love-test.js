
$(document).ready(function(){
    var data_set;

    var url = "/apis/lovetest";

    $.ajax({
            url: url,
            headers: {
                'Content-Type':'application/json'
            },
            async: true,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                data_set = data;
                draw(data_set);
            },
            error: function(data, status, err) {
                console.log(err);
            }
    });

    function draw(data_set){
        // create an array with nodes
        var nodes = new vis.DataSet([
            {id: 1, shape: 'circularImage', image: 'https://storage.googleapis.com/daesun2017.appspot.com/static/img/moon.jpeg', label:"문재인", x:300 , y:100},
            {id: 2, shape: 'circularImage', image: 'https://storage.googleapis.com/daesun2017.appspot.com/static/img/hee.jpg', label:"안희정", x:300 , y:400},
            {id: 3, shape: 'circularImage', image: 'https://storage.googleapis.com/daesun2017.appspot.com/static/img/lee.png', label:"이재명", x:500 , y:400},
            {id: 4, shape: 'circularImage', image: 'https://storage.googleapis.com/daesun2017.appspot.com/static/img/ahn.jpeg', label:"안철수", x:500 , y:100},
            {id: 5, shape: 'circularImage', image: 'https://storage.googleapis.com/daesun2017.appspot.com/static/img/you.jpg', label:"유승민", x:100 , y:100},
            {id: 6, shape: 'circularImage', image: 'https://storage.googleapis.com/daesun2017.appspot.com/static/img/hwang.jpg', label:"황교안", x:100 , y:400}
        ]);

        // create an array with edges
        var edges = new vis.DataSet(data_set);

        // create a network
        var container = document.getElementById('mynetwork');

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
           autoResize: true,
           nodes: {
              borderWidth: 4,
              size: 40,
              fixed: {
                  x:true,
                  y:true
              },
              color: {
                border: '#848484'
              }

           },
           edges: {
              length: 300,
              color: {
                color: '#848484'
              },

           },
           physics: false,
           interaction: {
              dragNodes: false,// do not allow dragging nodes
              zoomView: false, // do not allow zooming
              dragView: false  // do not allow dragging
           }
          };

        // initialize your network!
        var network = new vis.Network(container, data, options);
    }
});