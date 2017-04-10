$(document).ready(function(){

  var body = $("body"),
      universe = $("#universe"),
      solarsys = $("#solar-system");

  var init = function() {
    body.removeClass('opening').delay(2000).queue(function() {
      $(this).removeClass('hide-UI').addClass("set-speed");
      $(this).dequeue();
    });

    $.ajax({
        url:'/solar',
        type:'GET',
        success:function(data){
            $('#solar').html(data);
        },
        error: function(data, status, err) {
            console.log(err);
        }
    });
  };

  var setView = function(view) { universe.removeClass().addClass(view); };

  $("#toggle-data").click(function(e) {
    body.toggleClass("data-open data-close");
    e.preventDefault();
  });

  $("#toggle-controls").click(function(e) {
    body.toggleClass("controls-open controls-close");
    e.preventDefault();
  });

  $("#data a").click(function(e) {
    var ref = $(this).attr("class");
    solarsys.removeClass().addClass(ref);
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });

  $(".set-view").click(function() { body.toggleClass("view-3D view-2D"); });
  $(".set-zoom").click(function() { body.toggleClass("zoom-large zoom-close"); });

  init();

});