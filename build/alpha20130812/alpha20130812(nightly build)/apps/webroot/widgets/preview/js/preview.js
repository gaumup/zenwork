 (function ($) {
    Zenwork.Preview = new function () { //Singleton
        var register = [];
        this.bind = function (options) {
            var options = $.extend({}, {
                on: '.ZWPreview'
            }, options);
            //if element which selector have been init before, return
            if ( register.indexOf(options.on) > -1 ) { return false; }
            register.push(options.on);

            var id = 'zwPreview';
            if ( $('#'+id).length > 0 ) { id += Math.random().substr(0, 4); }
            $('<div id="'+id+'" class="ZWPreview Loading Hidden"></div>').appendTo('body');

            $(document).on('mouseenter', '.ZWPreview', function (e) {
                var target = $(e.currentTarget);
                if ( !target.parent().hasClass('GifFile')
                    && !target.parent().hasClass('JpegFile')
                    && !target.parent().hasClass('PngFile')
                ) { return false; }

                //loading box
                $('#'+id)
                    .removeClass('Hidden')
                    .css({
                        width: 80,
                        height: 80
                    })
                    .position({
                        my: 'right bottom+5',
                        at: 'left top',
                        of: target,
                        within: window,
                        collision: 'flip'
                    });

                var img = new Image();
                img.onload = function () {
                    $('#'+id)
                        .html(img)
                        .removeClass('Loading')
                        .css({
                            width: 'auto',
                            height: 'auto',
                            top: 0,
                            left: 0
                        })
                        .position({
                            my: 'right bottom+5',
                            at: 'left top',
                            of: target,
                            within: window,
                            collision: 'flipfit'
                        });
                }
                img.title = target.attr('title');
                img.alt = target.attr('title');
                img.src = target.data('source');
                e.stopPropagation();
            });
            $(document).on('mouseleave', '.ZWPreview', function (e) {
                $('#'+id).addClass('Hidden').empty();
                e.stopPropagation();
            });
        }
    }
})(jQuery);