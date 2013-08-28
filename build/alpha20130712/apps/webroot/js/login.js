jQuery(document).ready(function () {
    var slideShow = $('#slideShow');
    var imgs = slideShow.find('img');
    var loadedImgCount = 0;
    var _loadedImgsCallback_ = function () {
        if ( slideShow.length > 0 && jQuery.fn.orbit != undefined ) {
            slideShow.orbit({
                animation: 'horizontal-slide', // fade, horizontal-slide, vertical-slide, horizontal-push
                animationSpeed: 200, // how fast animtions are
                timer: true, // true or false to have the timer
                advanceSpeed: 4000, // if timer is enabled, time between transitions
                pauseOnHover: false, // if you hover pauses the slider
                startClockOnMouseOut: false, // if clock should start on MouseOut
                startClockOnMouseOutAfter: 1000, // how long after MouseOut should the timer start again
                directionalNav: true, // manual advancing directional navs
                captions: false, // do you want captions?
                captionAnimation: 'fade', // fade, slideOpen, none
                captionAnimationSpeed: 800, // if so how quickly should they animate in
                bullets: true, // true or false to activate the bullet navigation
                bulletThumbs: false, // thumbnails for the bullets
                bulletThumbLocation: '', // location from this file where thumbs will be
                afterSlideChange: function () {}
            });
        }
    }
    imgs.each(function () {
        var imgObj = new Image();
        imgObj.onload = function () {
            loadedImgCount++;
            if ( loadedImgCount === imgs.length ) {
                _loadedImgsCallback_();
            }
        }
        imgObj.src = $(this).attr('src');
    });

    //recent update box
    var recent_update_box = jQuery("#recent_update_box");
    var recent_update_box_trigger = jQuery("#top_slidedown_box_trigger");
    var recent_update_box_close = jQuery("#top_slidedown_box_close");
    var offset = recent_update_box.outerHeight() - recent_update_box_trigger.outerHeight();
    recent_update_box.css({
        top: -offset
    });
    //open
    recent_update_box_trigger.bind("click", function (e) {
        recent_update_box.animate({
            top: 0
        }, "fast", function (e) {
            recent_update_box_trigger.addClass("Hidden");
            recent_update_box_close.removeClass("Hidden");
        });

        return false;
    });
    //close
    recent_update_box_close.bind("click", function (e) {
        recent_update_box.animate({
            top: -offset
        }, "fast", function (e) {
            recent_update_box_close.addClass("Hidden");
            recent_update_box_trigger.removeClass("Hidden");
        });

        return false;
    });
});