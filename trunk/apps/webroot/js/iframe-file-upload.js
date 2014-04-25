jQuery(document).ready(function() {
    (function ($) {
        //use for upload avatar
        //listening on file upload selected
        $("#input_upload_avatar").bind("change", function (e) {
            window.parent.Zenwork.UserAvatar.start_upload_avatar();
            $("#upload_avatar").submit();
        });

        //communicate with parent
        if ( $("#upload_filename").length > 0 ) {
            window.parent.Zenwork.UserAvatar.upload_avatar_callback({
                upload_path: $("#upload_path").val(),
                upload_filename: $("#upload_filename").val(),
                error: ''
            });
        }
        if ( $("#error").length > 0 ) {
            window.parent.Zenwork.UserAvatar.upload_avatar_callback({
                upload_path: '',
                upload_filename: '',
                error: $("#error").val()
            });
        }

        //use for gantt/resource plan (Project+Resource)
        //listening on file upload selected
        $("#input_upload_file").bind("change", function (e) {
            window.parent.start_upload_file();
            $("#upload_file").submit();
        });

        //communicate with parent
        if ( $("#upload_file_id").length > 0 ) {
            window.parent.upload_file_callback({
                upload_file_id: $("#upload_file_id").val(),
                upload_file_name: $("#upload_file_name").val(),
                error: '',
                task_id: $("#task_id").val()
            });
        }
        if ( $("#error").length > 0 ) {
            window.parent.upload_file_callback({
                upload_file_id: '',
                upload_file_name: $("#upload_file_name").val(),
                error: $("#error").val(),
                task_id: $("#task_id").val()
            });
        }
    })(jQuery);
});