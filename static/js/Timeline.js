define([
   'module',
   'Model'
   ],
   function(module, Model){

	'use strict'
 	module.exports = new (Backbone.View.extend({
 		el: '#timeline',
        pageNum : 1,
        timelineData : [],
        events :{
            'click #visualization': 'onItemClick',
            'click .d-timeline-more-btn' : 'onTimelineMoreClick'
 		},
        initialize:function(){
            this.timelineKeywordTpl = this.$el.find('.d-timeline-keyword-tpl').html();
        },
        render:function(){
            this.getKeyword();
        },
        onTimelineMoreClick:function(e){
            this.pageNum += 1;
            this.getKeyword();
        },
        onItemClick:function(e){
            var props = this.timeline.getEventProperties(e);

            if(props.item == null) return;

            var news_data = _.find(this.timelineData,function(item){
                return item.id === props.item
            })
            this.setNews(news_data)
        },
        /**
        * 대선주자 리스트 호출
        */
        getKeyword : function(){
            Model.getKeyword({
                'param' : this.pageNum,
                'success' : Function.prototype.bind.call(this.getKeywordSuccess,this),
                'error' : Function.prototype.bind.call(this.getKeywordError,this)
            })
        },
        /**
        * 대선주자 리스트 호출 성공
        */
        getKeywordSuccess : function(data, textStatus, jqXHR){
            this.setDataModify(data)
            // if(textStatus === 'success' && jqXHR === 200){
            //     this.setDataModify(data)
            // } else {
            //     alert('타임라인 부분에서 오류가 발생하였습니다.')
            // }
        },
        /**
        * 대선주자 리스트 호출 실패
        */
        getKeywordError : function(jsXHR, textStatus, errorThrown){
            alert('타임라인 부분에서 에러가 발생하였습니다.')
        },

        setDataModify : function(data){

            var modify_data = _.map(data,function(item){
                    _.each(item.data,function(data_item){
                        data_item.created_at = item.created_at;
                    })
                return item
            })

            var modifyData = [];

            for(var i=0; i<modify_data.length; i++) {

                for(var j=0; j<modify_data[i].data.length; ++j) {

                    var obj = {
                        start : new Date(modify_data[i].created_at)
                    }

                    var candiate = modify_data[i].data[j].candidate;

                    obj.content = '<div class="title">' + candiate + '</div>';

                    var keyword = ''
                    var panelClass = '';

                    for(var k=0; k<modify_data[i].data[j].keywords.length; ++k) {
                        keyword += '<span class="label label-info" style="margin-right:5px">' + modify_data[i].data[j].keywords[k].keyword + '</span>'
                    }

                    obj.content += '<div style="margin-bottom:5px;">' + keyword + '</div>';

                    obj.keywords = modify_data[i].data[j].keywords;

                    switch(candiate){
                        case '문재인':
                        case '이재명':
                        case '안희정':
                            obj.className = "d-together-item"
                            panelClass = 'panel-primary';
                        break;
                        case '유승민':
                        case '남경필':
                            obj.className = 'd-right-item';
                            panelClass = 'panel-info';
                        break;
                        case '황교안':
                            obj.className = 'd-freekorea-item';
                            panelClass = 'panel-danger';
                        break;
                        case '안철수':
                            obj.className = 'd-people-item';
                            panelClass = 'panel-success';
                        break;
                        default:
                            obj.className = 'd-etc-item';
                            panelClass = 'panel-default';
                        break;
                    }

                    _.each(modify_data[i].data[j].keywords,function(item){
                        item.panelClass = panelClass;
                    })

                    modifyData.push(obj);

                    obj = null;
                }

            }

            this.setTimeline(modifyData);
        },

        setTimeline : function(data){

            var container = document.getElementById('visualization');

            if(this.pageNum > 1){
                this.timelineData = this.timelineData.concat(data)
                this.items.add(data)
                this.timeline.setOptions({
                    min : new Date( moment(data[data.length-1].start).subtract(1,'hours')),
                })
            } else {
                this.timelineData = data;

                this.items = new vis.DataSet(this.timelineData);

                var options = {
                    editable: true,
                    margin: { item: 20,axis: 40 },
                    zoomable : false,
                    min : new Date( moment(data[data.length-1].start).subtract(1,'hours')),
                    max : new Date( moment(data[0].start).add(1,'hours')),
                    editable : { remove : false},
                    locale: 'ko'
                };
                this.timeline = new vis.Timeline(container, this.items, options);

                this.timeline.zoomIn(0.8);
                this.timeline.moveTo(new Date( moment(data[0].start).add(1,'hours')))

                this.timeline.on('rangechanged',Function.prototype.bind.call(this.onRangechanged,this) )
            }

            console.log(this.timelineData)
        },
        onRangechanged : function(e){
            if( moment(e.start).format('HH:mm') == moment( this.timeline.range.options.min ).format('HH:mm'))  {
                this.$el.find('.d-timeline-more-btn').removeClass('displayNone')
            } else {
                this.$el.find('.d-timeline-more-btn').addClass('displayNone')
            }
        },
        setNews:function(item){
            var template = Handlebars.compile(this.timelineKeywordTpl);
            this.$el.find('.d-timeline-keyword-list').html(template({'keywords':item.keywords}));
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
