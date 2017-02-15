define([
   'module',
   'text!tpl/timeline.html',
   'text!tpl/template.html',
   'Handlebars',
   'Model',
   'backbone',
   'vis',
   'moment'
   ],
   function(module, Timeline, Template, Handlebars, Model, Backbone, vis, moment){

	'use strict'
 	module.exports = new (Backbone.View.extend({
 		el: '.d-timeline',
        prevView: null,
        timeLineListTpl:'',
        timelineData : null,
        timelineKeywordTpl : '',
        timeline : null,
        events :{
            'click #visualization': 'onItemClick'
 		},
        onItemClick:function(e){
            var props = this.timeline.getEventProperties(e)
            console.log(props);

            if(props.item == null) return;

            var news_data = _.find(this.timelineData,function(item){
                return item.id === props.item
            })

            this.setNews(news_data)
        },
        setNews:function(item){
            console.log(item.keywords)
            var template = Handlebars.compile(this.timelineKeywordTpl);
            this.$el.find('.d-timeline-keyword-list').html(template({'keywords':item.keywords}));
        },
        initialize:function(){
            console.log( new Date(moment('2017-02-14 16:00:00')) )
        },
        render:function(mainMenu){

            this.$el.html(Timeline);

            if(this.prevView != null){
    			this.prevView.hide();
    		}


            //this.timeLineListTpl     = $(Template).find('.d-timeline-tpl').html();
            this.timeLineListTpl2     = $(Template).find('.d-timeline2-tpl').html();
            this.timelineKeywordTpl = $(Template).find('.d-timeline-keyword-tpl').html();


            this.getKeyword();
            // this.setTimeline2();
        },
        getKeyword : function(){
            Model.getKeyword({
                'success' : Function.prototype.bind.call(this.getKeywordSuccess,this),
                'error' : Function.prototype.bind.call(this.getKeywordError,this)
            })
        },
        getKeywordSuccess : function(data, textStatus, jqXHR){
            //var template = Handlebars.compile(this.timeLineListTpl);
            //this.$el.find('.timeline-list').html(template({'list':data}));
            //this.setTimeline();
            this.setDataModify(data)

        },
        getKeywordError : function(jsXHR, textStatus, errorThrown){

        },

        setDataModify : function(data){

            var modify_data = _.map(data,function(item){

                    _.each(item.data,function(data_item){
                        data_item.created_at = item.created_at;
                    })

                return item
            })

            this.timelineData = [];

            for(var i=0; i<modify_data.length; i++) {

                for(var j=0; j<modify_data[i].data.length; ++j) {

                    var obj = {
                        start : new Date(modify_data[i].created_at)
                    }

                    obj.content = '<div class="title" data-index="0">' + modify_data[i].data[j].candidate + '</div>';

                    var keyword = ''

                    for(var k=0; k<modify_data[i].data[j].keywords.length; ++k) {

                        keyword += modify_data[i].data[j].keywords[k].keyword;

                    }

                    obj.content += '<div>' + keyword + '</div>';

                    obj.keywords = modify_data[i].data[j].keywords

                    this.timelineData.push(obj);

                    obj = null;
                }



                console.log(this.timelineData)
            }

            //console.log(reData)
            this.setTimeline();
        },


        setTimeline2 : function(){
            var template = Handlebars.compile(this.timeLineListTpl2);
            //this.$el.find('.timeline-list').html(template({'list':data}));


            var container = document.getElementById('visualization');

            // var options = {
            //     zoomable : false,
            //     min : new Date(2010,8,4,6,0,0),
            //     max : new Date(2010,8,4,21,0,0),
            //
            //     editable : {
            //         remove : false
            //     },
            //     template : template
            //
            // };

            var items = new vis.DataSet([
              // round of 16
              {
                player1: '이재명',
                keyword1: '김동근',
                keyword2: '이민향',
                keyword3: '송민정',
                start: '2014-08-04 09:00'
              },
              {
                player1: '문재인',
                keyword1: '김동근',
                keyword2: '이민향',
                keyword3: '송민정',
                start: '2014-08-04 09:00'
              },
              {
                player1: '안희정',
                keyword1: '김동근',
                keyword2: '이민향',
                keyword3: '송민정',
                start: '2014-08-04 09:00'
              },
              {
                player1: '황교안',
                keyword1: '김동근',
                keyword2: '이민향',
                keyword3: '송민정',
                start: '2014-08-04 12:00'
              },
              {
                player1: '이재명',
                keyword1: '김동근',
                keyword2: '이민향',
                keyword3: '송민정',
                start: '2014-08-04 12:00'
              },
              {
                player1: '문재인',
                keyword1: '김동근',
                keyword2: '이민향',
                keyword3: '송민정',
                start: '2014-08-04 12:00'
              },
              {
                player1: '안희정',
                keyword1: '김동근',
                keyword2: '이민향',
                keyword3: '송민정',
                start: '2014-08-04 15:00'
              },
              {
                player1: '황교안',
                keyword1: '김동근',
                keyword2: '이민향',
                keyword3: '송민정',
                start: '2014-08-04 15:00'
               },
               {
                 player1: '황교안',
                 keyword1: '김동근',
                 keyword2: '이민향',
                 keyword3: '송민정',
                 start: '2014-08-04 15:00'
               }
            ]);

            var options = {
              // specify a template for the items
              template: template,
              //zoomable : false,
            };

            // Create a Timeline
            var timeline = new vis.Timeline(container, items, options);
        },
        setTimeline : function(){


            var ktest = [
                {id:'1',content:'aaa'},
                {id:'2',content:'bbb'},
                {id:'3',content:'ccc'}
            ]

            console.log(_.filter(ktest,function(item){
                return item.id === '1';
            }))


            var container = document.getElementById('visualization');


            // console.log(this.timelineData)
            // console.log(sss)
            // console.log(sss[sss.length-1].start)
            //
            console.log(moment(this.timelineData[this.timelineData.length-1].start))
            console.log(new Date( moment(this.timelineData[this.timelineData.length-1].start).add(2,'hours')) )

            var kkk = [
              {start: new Date(2010,8,4,9,0,0), content: '<div class="title" data-index="0">문재인</div><div>김동근,이민향,송민정</div>'},
              {start: new Date(2010,8,4,9,0,0), content: '<div class="title" data-index="1">문재인</div><div>김동근,이민향,송민정</div>'},
              {start: new Date(2010,8,4,9,0,0), content: '<div class="title" data-index="2">문재인</div><div>김동근,이민향,송민정</div>'},
              {start: new Date(2010,8,4,12,0,0), content: '<div class="title" data-index="2">이재명</div><div>김동근,이민향,송민정</div>'},
              {start: new Date(2010,8,4,12,0,0), content: '<div class="title" data-index="3">이재명</div><div>김동근,이민향,송민정</div>'},
              {start: new Date(2010,8,4,12,0,0), content: '<div class="title" data-index="4">이재명</div><div>김동근,이민향,송민정</div>'},
              {start: new Date(2010,8,4,15,0,0), content: '<div class="title" data-index="5">안희정</div><div>김동근,이민향,송민정</div>'},
              {start: new Date(2010,8,4,15,0,0), content: '<div class="title" data-index="6">안희정</div><div>김동근,이민향,송민정</div>'},
              {start: new Date(2010,8,4,15,0,0), content: '<div class="title" data-index="7">안희정</div><div>김동근,이민향,송민정</div>'}
            ]
            // note that months are zero-based in the JavaScript Date object
            var items = new vis.DataSet(this.timelineData);

            var options = {
              editable: true,
              margin: {
                item: 20,
                axis: 40
            },
             //timeAxis: {scale: 'hour', step: 3},
            // timeAxis : {
            //     scale: 'day',
            //     step : 10
            // },
                zoomable : false,
                min : new Date( moment(this.timelineData[this.timelineData.length-1].start).subtract(1,'hours')),
                max : new Date( moment(this.timelineData[0].start).add(1,'hours')),

                editable : {
                    remove : false
                }

            };

            this.timeline = new vis.Timeline(container, items, options);
             this.timeline.zoomIn(0.8);
             this.timeline.moveTo(new Date( moment(this.timelineData[0].start).add(1,'hours')))

             console.log(this.timeline)

             this.timeline.on('rangechanged',function(e){
                 console.log(moment(e.start).format('HH:mm'))
                 console.log("sdfdsfs")

                 if(moment(e.start).format('HH:mm') == moment( options.min ).format('HH:mm') ){
                     $('.d-timeline-more').removeClass('displayNone')
                     $('.d-timeline-body').removeClass('col-xs-12').addClass('col-xs-11')
                 } else {
                     $('.d-timeline-more').addClass('displayNone')
                      $('.d-timeline-body').removeClass('col-xs-11').addClass('col-xs-12')
                 }
             })




            //  var btnLoad = document.getElementById('left');
             //
            //  function loadData(){
            //      //items.clear();
            //      items.add([
            //        {start: new Date(2010,8,4,6,0,0), content: '<div class="title" data-index="8">문재인2</div><div>김동근,이민향,송민정</div><span>김동근,이민향,송민정</span>'},
            //        {start: new Date(2010,8,4,6,0,0), content: '<div class="title" data-index="9">문재인2</div><div>김동근,이민향,송민정</div><span>김동근,이민향,송민정</span>'},
            //        {start: new Date(2010,8,4,6,0,0), content: '<div class="title" data-index="10">문재인2</div><div>김동근,이민향,송민정</div><span>김동근,이민향,송민정</span>'},
            //      ]);
             //
            //    // adjust the timeline window such that we see the loaded data
            //    //timeline.fit();
             //
            //    timeline.setOptions({
            //        min : new Date(2010,8,4,1,0,0),
            //    })
            //  }
             //
            //  btnLoad.onclick = loadData

             //$('#visualization').removeClass('displayNone');

             this.$el.find('.d-timeline-more-btn').bind('click',function(e){
                 items.add([
                   {start: new Date(2010,8,4,6,0,0), content: '<div class="title" data-index="8">문재인2</div><div>김동근,이민향,송민정</div><span>김동근,이민향,송민정</span>'},
                   {start: new Date(2010,8,4,6,0,0), content: '<div class="title" data-index="9">문재인2</div><div>김동근,이민향,송민정</div><span>김동근,이민향,송민정</span>'},
                   {start: new Date(2010,8,4,6,0,0), content: '<div class="title" data-index="10">문재인2</div><div>김동근,이민향,송민정</div><span>김동근,이민향,송민정</span>'},
                 ]);

               // adjust the timeline window such that we see the loaded data
               //timeline.fit();

               this.timeline.setOptions({
                   min : new Date(2010,8,4,1,0,0),
               })
             })

            //  this.$el.find('#visualization').on('click',function(e){
            //      var props = timeline.getEventProperties(e)
            //      console.log(props);
             //
            //      _.find(sss,function(item){
            //          return item.id === props.item
            //      })
            //  })

            //  document.getElementById('visualization').onclick = function (event) {
            //      var props = timeline.getEventProperties(event)
            //      console.log(props);
             //
            //      _.find(sss,function(item){
            //          return item.id === props.item
            //      })
             //
            //      //items.getCustomTime(props.)
            //    }

            //  console.log(this.$el.find('.vis-item-content').find('.title').text())
             //
            //     this.$el.find('.vis-item-content').bind('click',function(e){
            //         //console.log($(this).find('.vis-item-content').html())
            //         //e.preventDefault();
            //      console.log("1234")
            //      //console.log($(e.target).data('index'))
            //      //console.log(kkk[$(e.target).find('.title').data('index')])
            //      //$('.d-timeline-keyword-list').html(JSON.stringify(kkk[$(e.currentTarget).find('.title').data('index')]));
            //  })
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
