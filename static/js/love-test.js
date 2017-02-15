$(document).ready(function(){
    var data_set;

    var url = "/apis/lovetest";

    var dataList = function(){
        $.ajax({
            url: url,
            headers: {
                'Content-Type':'application/json'
            },
            async: false,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                data_set = data;
            },
            error: function(data, status, err) {
                console.log(err);
            }
        });
    }
    dataList();

    // create an array with nodes
    var nodes = new vis.DataSet([
        {id: 1, shape: 'circularImage', image: '{% static 'img/moon.jpeg' %}', label:"문재인",  x: 300, y: 10},
        {id: 2, shape: 'circularImage', image: '{% static 'img/hee.jpg' %}', label:"안희정", x: 50, y: 30},
        {id: 3, shape: 'circularImage', image: '{% static 'img/lee.png' %}', label:"이재명", x: 0, y: 40},
        {id: 4, shape: 'circularImage', image: '{% static 'img/ahn.jpeg' %}', label:"안철수", x: 500, y: 40},
        {id: 5, shape: 'circularImage', image: '{% static 'img/you.jpg' %}', label:"유승민", x: 300, y: 30},
        {id: 6, shape: 'circularImage', image: '{% static 'img/hwang.jpg' %}', label:"황교안", x: 100, y:40}
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
              x:false,
              y:false
          },
          color: {
            border: '#848484'
          }

       },
       edges: {
          length: 200,
          color: {
            color: '#848484'
          }
       },
       physics: {
          stabilization: {
              enabled: true,
              fit: true
            },
       },
       interaction:{
             zoomView: false
       },
      };

    // initialize your network!
    var network = new vis.Network(container, data, options);

});