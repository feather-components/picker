;(function(factory){
if(typeof define == 'function' && define.amd){
    //seajs or requirejs environment
    define(['jquery', 'class', 'overlay'], factory);
}else if(typeof module === 'object' && typeof module.exports == 'object'){
    module.exports = factory(
        require('jquery'),
        require('class'),
        require('overlay')
    );
}else{
    factory(window.jQuery, window.jQuery.klass, window.jQuery.overlay);
}
})(function($, Class, Overlay){

return $.picker = Class.extend('Event', {
    initialize: function(options){
        this.options = $.extend({
            container: document.body,
            dom: null,
            className: '',
            closeAfterSelect: true,
            closeOnWindowScroll: true
        }, options);

        this.create();
        this.initEvent();
    },

    create: function(){
        var self = this, options = self.options;

        if(options.dom){
            self.$dom = $(options.dom);
            self.$overlay = new Overlay({
                autoOpen: false,
                className: 'ui3-picker ' + (options.className || '')
            });
            self.$picker = self.$overlay.$;
        }else{
            self.$picker = $('<div class="ui3-picker">').addClass(options.className);
            self.$picker.appendTo(options.container);
        }
    },

    initEvent: function(){
        var self = this;

        if(!self.$dom) return;

        self.$picker.click(function(e){
            e.stopPropagation();
        });

        self.o2s(self.$dom, 'click', function(e){
            self.open();
        });

        self.o2s(document, 'click', function(e){
            var target = e.target;

            if(target !== self.$dom.get(0) && target !== self.$picker.get(0) && !self.$picker.has(target).length){
                self.close();
            }
        });

        if(self.$dom){
            self.options.closeAfterSelect && self.on('select', function(){
                self.close();
            });

            self.options.closeOnWindowScroll && self.o2s(window, 'mousewheel', function(){
                self.close();
            })
        }
    },

    open: function(){
        var self = this;

        if(self.$overlay){
            self.$overlay.open();
            self.resetPosition();
        }
    },

    close: function(){
        var self = this;
        self.$overlay && self.$overlay.close();
    },

    resetPosition: function(){
        var self = this;

        if(!self.$overlay) return;

        var xy = self.$dom.offset(), size = self.$overlay.getSize();
        var scrollTop = $(window).scrollTop();

        if(scrollTop + $(window).height() < xy.top + size.height){
            self.$overlay.setPos(xy.left, xy.top - size.height - 1);
        }else{
            self.$overlay.setPos(xy.left, xy.top + self.$dom.outerHeight() + 1);
        }
    },

    destroy: function(){
        var self = this;

        self.$overlay && self.$overlay.destroy();
        self.$overlay = null;
        self.$picker = null;
        self.$dom && self.ofs(self.$dom, 'click');
        self.options.closeOnWindowScroll && self.ofs(window, 'mousewheel');
    }
});

});