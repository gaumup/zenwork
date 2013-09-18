jQuery(document).ready(function () {
    (function($) {
        $('#signin input:first').focus();
        $('#authTab li a').on('click', function (e) {
            var $this = $(this);
            
            if ( $this.hasClass('AuthTabDisabled') ) {
                return false;
            }

            $('.AuthTabContent').addClass('Hidden');
            $('#authTab li.Active').removeClass('Active');
            $this.parent().addClass('Active');
            $($this.attr('href')).removeClass('Hidden').find('input:first').focus();
            return false;
        });

        //save hash to cookie
        $.cookie('urlHash', window.location.hash.substr(1), {path: '/'});
    })(jQuery);
});