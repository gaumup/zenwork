jQuery(document).ready(function() {
    //use for upload avatar
    //listening on file upload selected
    jQuery("#input_upload_avatar").bind("change", function (e) {
        window.parent.Zenwork.UserAvatar.start_upload_avatar();
        jQuery("#upload_avatar").submit();
    });

    //communicate with parent
    if ( jQuery("#upload_filename").length > 0 ) {
        window.parent.Zenwork.UserAvatar.upload_avatar_callback({
            upload_path: jQuery("#upload_path").val(),
            upload_filename: jQuery("#upload_filename").val(),
            error: ''
        });
    }
    if ( jQuery("#error").length > 0 ) {
        window.parent.Zenwork.UserAvatar.upload_avatar_callback({
            upload_path: '',
            upload_filename: '',
            error: jQuery("#error").val()
        });
    }

    //use for gantt/resource plan (Project+Resource)
    //listening on file upload selected
    jQuery("#input_upload_file").bind("change", function (e) {
        window.parent.start_upload_file();
        jQuery("#upload_file").submit();
    });

    //communicate with parent
    if ( jQuery("#upload_file_id").length > 0 ) {
        window.parent.upload_file_callback({
            upload_file_id: jQuery("#upload_file_id").val(),
            upload_file_name: jQuery("#upload_file_name").val(),
            error: '',
            task_id: jQuery("#task_id").val()
        });
    }
    if ( jQuery("#error").length > 0 ) {
        window.parent.upload_file_callback({
            upload_file_id: '',
            upload_file_name: jQuery("#upload_file_name").val(),
            error: jQuery("#error").val(),
            task_id: jQuery("#task_id").val()
        });
    }
});