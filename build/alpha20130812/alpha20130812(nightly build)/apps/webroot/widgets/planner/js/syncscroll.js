/* jQuery syncscroll by gaumup(ukhome@gmail.com) */
/**
 * @use:
 *  - create syncscroll between 2 or more content block
 * @depends:
 *	- jQuery core
 *	- jQuery widget
 *  - Core
 * @change log:
 *  - v1.0
 */

//make sure DOM are ready
(function($) {
	$.widget('ui.syncscroll', {
        widgetNamespace: 'syncscroll',
        widgetEventPrefix: 'syncscroll',

        //private member
            EVENT: {
                SCROLLX: 'scrollX',
                SCROLLY: 'scrollY'
            },

        //options
            options: {
                content: jQuery('#ganttTimelineList'), //required
                clip: jQuery('#gantTimelineClip'), //required
                syncClip: jQuery('#streamListClip') //optional
            },

        //constructor
            _create: function () {
                var self = this;
                var element = this.element;
                var opts = this.options;

                element.css({
                    width: Core.SCROLLBAR_SIZE + 1 //min width must > scrollbar size
                });
                this._update();

                element.bind('scroll.syncscroll', function (e) {
                    var $this = $(this);
                    var scrollTopValue = $.getScrollY($this);
                    if ( Math.abs(scrollTopValue - $.getScrollY(opts.clip)) > 5 ) {
                        $.scrollY(opts.clip, scrollTopValue);
                        if ( opts.syncClip != undefined ) {
                            $.scrollY(opts.syncClip, scrollTopValue);
                        }
                    }
                    if ( scrollTopValue >= element.find('> div').eq(0).height() - element.height() ) {
                        //scroll to end action
                    }

                    self._trigger(self.EVENT.SCROLLY, e);
                });
                element.bind('mouseenter.syncscroll', function (e) {
                    element.removeClass('Hidden').addClass('Hover').scrollTop($.getScrollY(opts.clip));
                });
                element.bind('mouseleave.syncscroll', function (e) {
                    element.addClass('Hidden').removeClass('Hover');
                });

                this._handleScrollMousewheel(opts.clip);
                if ( opts.syncClip != undefined ) {
                    this._handleScrollMousewheel(opts.syncClip);
                }
            },

        //destructor
            destroy: function () {},

        //public method
            update: function () {
                this._update();
            },
            show: function () {
                this.element.removeClass('Hidden').scrollTop(this.options.clip.scrollTop());
            },

        //private method
            _handleScrollMousewheel: function (target) {
                var self = this;
                var opts = this.options;
                var element = this.element;
                var mousewheelOffset = 30;
                target.mousewheel(function(e, delta) {
                    var scrollValue = $.getScrollY(element);
                    scrollValue = delta < 0 ? (scrollValue + mousewheelOffset) : (scrollValue - mousewheelOffset);
                    if ( scrollValue < 0 ) { scrollValue = 0; }
                    $.scrollY(element, scrollValue);
                    e.preventDefault();
                    self._trigger(self.EVENT.SCROLLY, e, delta);
                });
            },
            _update: function () {
                this.element.css({
                    top: this.options.container.position().top + this.options.clip.position().top,
                    height: this.options.clip.outerHeight()
                });
                this.element.find('> div').eq(0).css({
                    height: this.options.content.outerHeight()
                });
            }
    });

    //version
    $.extend($.ui.syncscroll, {
        version: '1.0'
    });
})(jQuery);