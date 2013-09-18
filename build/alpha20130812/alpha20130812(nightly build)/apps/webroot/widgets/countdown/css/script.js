jQuery(document).ready(function(){
	/* ---- Countdown timer ---- */
    (function ($) {
        $('#counter').countdown({
            timestamp : new Date('August 12, 2013 09:00:00')
        });
    })(jQuery);

});

