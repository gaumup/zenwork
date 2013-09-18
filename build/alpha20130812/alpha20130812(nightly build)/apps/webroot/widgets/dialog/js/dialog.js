jQuery(document).ready(function () {
    //Common Dialog
    jQuery(".CommonDialog").draggable({
        handle: "> h3"
    });
    jQuery(".CommonDialog > h3")
        .attr("title", "Drag to move")
        .bind("mousedown", function (e) {
            jQuery(".CommonDialogTop").removeClass("CommonDialogTop");
            jQuery(this).parent().addClass("CommonDialogTop");
            jQuery(this).parent().find("input[type='text']").eq(0).focus();
        });
    jQuery(".CommonDialog").bind("click", function (e) {
        if ( jQuery(this).hasClass("CommonDialogTop") ) { return; }
        jQuery(".CommonDialogTop").removeClass("CommonDialogTop");
        jQuery(this).addClass("CommonDialogTop");
        if ( jQuery(this).find("input:focus[type='text']").length == 0 ) {
            jQuery(this).find("input[type='text']").eq(0).focus();
        }
        e.stopPropagation();
    });
    jQuery(".CommonDialog > a.DialogMin").bind("click", function (e) {
        jQuery(this)
            .toggleClass("Min")
            .parent().find("> .DialogContainer, > .Button").toggle();
        jQuery(this).attr("title", jQuery(this).hasClass("Min") ? "Maximize" : "Minimize");
        if ( jQuery(this).hasClass("Min") ) {
            jQuery(this).parent().find("input[type='text']").eq(0).focus();
        }
        return false;
    });

    if ( jQuery(".CancelBtn").length > 0 ) {
        jQuery(".CancelBtn").live("click", function (e) {
            OverlaysManager.get_overlays().removeClass("NoLoading");
            OverlaysManager.hide_overlays();
            jQuery(".CommonDialogTop").hide().removeClass("CommonDialogTop");
            return false;
        });

        jQuery(document).bind("keydown", function (e) {
            if ( e.which == 27 ) { //escape
                jQuery(".CommonDialogTop .CancelBtn").trigger("click");
            }
        });
    }
});