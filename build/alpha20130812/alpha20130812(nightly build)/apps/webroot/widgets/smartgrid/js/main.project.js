jQuery(document).ready(function () {
    window.focus();
    if ( jQuery.ui.smartgrid != undefined ) {
        jQuery(".SmartGrid").smartgrid();

        //Delivery Plan
        if ( jQuery("#deliverables").length > 0 ) {
            //add row
            jQuery("#smartgrid_insert_row").bind("click", function (e) {
                jQuery("#deliverables").smartgrid("add_new_row");
                return false;
            });

            //save
            jQuery("#save_project").bind("click", function (e) {
                OverlaysManager.get_overlays().addClass("AppOverlays");
                OverlaysManager.show_overlays();
                jQuery("#deliverables_form").submit();
                return false;
            });

            //refresh
            jQuery("#refresh_project").bind("click", function (e) {
                var is_confirm = confirm("Unsaved data will be lost ! Sure ?");
                if ( !is_confirm ) { window.focus(); }
                else {
                    OverlaysManager.get_overlays().addClass("AppOverlays");
                    OverlaysManager.show_overlays();
                    window.location.reload(true);
                }
                return false;
            });
        }

        //Charter
        if ( jQuery("#charter_environment").length > 0 ) {
            jQuery("#smartgrid_insert_row").bind("click", function (e) {
                jQuery("#charter_environment").smartgrid("add_new_row");
                return false;
            });
        }

        //Common buttons
        if ( jQuery("#save_project").length > 0 ) {
            jQuery(document).bind("keydown", function (e) {
                if ( KeyEventHelper.isCtrlHold() ) {
                    if ( e.which == 83 ) { //S -> Ctrl+S save project
                        e.preventDefault();
                        jQuery("#save_project").trigger("click");
                    }
                }
            });
        }

        if ( jQuery("#refresh_project").length > 0 ) {
            jQuery(document).bind("keydown", function (e) {
                if ( KeyEventHelper.isCtrlHold() ) {
                    if ( e.which == 116 ) { //Ctrl+F5 refresh
                        e.preventDefault();
                        jQuery("#refresh_project").trigger("click");
                    }
                }
                else if ( e.which == 116 ) { //F5
                    e.preventDefault();
                    jQuery("#refresh_project").trigger("click");
                }
            });
        }
    }
});