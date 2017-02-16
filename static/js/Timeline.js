define([
   'module',
   'text!tpl/timeline.html'
   ],
   function(module, Timeline){

	'use strict'
 	module.exports = new (Backbone.View.extend({
 		el: '#timeline',
        initialize:function(){
        },
        render:function(){
            this.$el.html(Timeline);

            if(this.prevView != null){
    			this.prevView.hide();
    		}
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
