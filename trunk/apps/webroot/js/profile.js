$(document).ready(function () {
    (function ($) {
        /**
         * Singleton Class Public
         * convenient for all public use var, const, method
         */
        var Public = new function () {
            this.ROOT_URL = $('#rootUrl').val();
            this.LOGGED_IN_UID = $('#loggedInUserID').val();
            this.UPLOAD_URL; //relative path to ROOT_URL
            this.dialog_opt = {
                open: function() {
                    $('.ui-widget-overlay').hide().fadeIn('fast');
                },
                beforeClose: function() {
                    $('.ui-widget-overlay').remove();
                    $('<div />', {
                        'class':'ui-widget-overlay'
                    }).css(
                        {
                            height: $('body').outerHeight(),
                            width: $('body').outerWidth(),
                            zIndex: 1001
                        }
                    ).appendTo('body').fadeOut(function(){
                        $(this).remove();
                    });
                },
                show: 'fade',
                hide: 'fade'
            }

            /* Equivalent to native alert box
             */
            this.alert = function (dialog_title, dialog_message, option) {
                $(':focus').blur();
                $('#alert_dialog .DialogContent').html(dialog_message);
                option = $.extend({}, {
                    title: dialog_title
                }, option);
                $('#alert_dialog').dialog('option', option).dialog('open');
            }

            /* Equivalent to native comfirm box
             * - option { confirmed:Function, canceled:Function, dialog:$.dialog.option }
             */
            this.confirm = function (dialog_title, dialog_message, option) {
                $(':focus').blur();
                $('#confirm_dialog .DialogContent').html(dialog_message);
                var dialog_option = $.extend({}, {
                    title: dialog_title,
                    modal: true
                }, option.dialog);
                $('#confirm_dialog').dialog('option', dialog_option).dialog('open');

                $('#confirm_dialog').unbind('change').bind('change', function(e, confirm) {
                    if ( confirm && option.confirmed != undefined ) { option.confirmed(); }
                    else if ( !confirm && option.canceled != undefined ) { option.canceled(); }
                });
            }

            /* Convenient method to close current active dialog
             * parameter: type(message|alert|confirm)
             */
            this.hide_msgbox = function (type/*message|alert|confirm*/) {
                $('#'+type+'_dialog').dialog('close');
                $('#'+type+'_dialog .DialogContent').empty();
                if ( type == 'confirm' ) {
                    $('#confirm_dialog_yes').removeAttr('disabled').removeClass('CommonBtnDisabled');
                    $('#confirm_dialog_no').removeAttr('disabled').removeClass('CommonBtnDisabled');
                }
            }

            this.message = function (dialog_title, dialog_message, option) {
                $(':focus').blur();
                $('#info_dialog .DialogContent').html(dialog_message);
                option = $.extend({}, {
                    title: dialog_title,
                    dialogClass: 'AlertBox',
                    closeOnEscape: false,
                    height: 80
                }, option);
                $('#info_dialog').dialog('option', option).dialog('open');
                $('.AlertBox .ui-dialog-titlebar-close').remove();
                return $('#info_dialog');
            }

            //constructor
            if ( $().dialog != undefined ) {
                var opt = $.extend(this.dialog_opt, {
                    autoOpen: false,
                    modal: true,
                    width: 300
                });
                $("#confirm_dialog").removeClass("Hidden").dialog(opt);
                $("#alert_dialog").removeClass("Hidden").dialog(opt);
                $("#info_dialog").removeClass("Hidden").dialog(opt);

                $("#confirm_dialog_yes").bind('click', function(e) {
                    if ( $(this).is(":disabled") ) { return; }
                    $("#confirm_dialog .DialogFooter .CommonBtn").attr("disabled", "disabled").addClass("CommonBtnDisabled");
                    $("#confirm_dialog").trigger("change", [true]);
                    return false;
                });
                $(".CloseDialogBtn").bind('click', function(e) {
                    if ( $(this).is(":disabled") ) { return; }
                    $($(this).attr("rel")).dialog("close");
                    $($(this).attr("rel") + " .DialogContent").empty();
                    $("#confirm_dialog").trigger("change", [false]);
                    return false;
                });
            }
        }

        /**
         * Singleton Class UserAvatar
         * use to manipulate update/edit/remove user's avatar
         * next update: refactoring later to adapt upload and edit image
         */
        Zenwork.UserAvatar = new function () {
            var global_timer = null;
            var avatar_model_save_btn = {
                status: {
                    unsaved: 'Save changes',
                    updated: 'Saved',
                    processing: 'Saving...'
                }
            }
            var edit_avatar_info = {};

            /* open modal to edit|crop image use for avatar
             */
            function _startEditAvatar () {
                $('#upload_avatar_modal')
                    .removeClass('Hidden')
                    .dialog('option', {
                        position: {
                            my: 'center center',
                            at: 'center top+160',
                            of: window,
                            collision: 'fit'
                        }
                    })
                    .dialog('open');
            }

            /* convenient method to show success message box
             */
            function _showSuccessMsg (msg, callback) {
                if ( global_timer != null ) { clearTimeout(global_timer); }
                $('#upload_avatar_msgbox').stop()
                    .addClass('SuccessBox')
                    .find('#upload_avatar_response').eq(0).html(msg).end().end()
                    .hide().removeClass('Hidden').fadeIn('medium', function () {
                        global_timer = setTimeout(function () {
                            $('#upload_avatar_msgbox').fadeOut('medium', function () {
                                $('#upload_avatar_msgbox').addClass('Hidden');
                            });
                        }, 2000);
                    });
                if ( callback !== undefined ) { callback(); }
            }

            /* convenient method to show error message box
             */
            function _showErrorMsg (err) {
                $('#upload_avatar_msgbox').stop()
                    .addClass('ErrorBox')
                    .find('#upload_avatar_response').eq(0).html(err).end().end()
                    .hide().removeClass('Hidden').fadeIn('medium');
            }

            /* called when edit avatar model open
             */
            function on_edit_avatar_modal_open () {
                edit_avatar_info = {};
                var max_width = 600;
                var img = new Image();
                img.onload = function (e) {
                    if ( img.width > max_width ) {
                        img.height = img.height*max_width/img.width;
                        img.width = max_width;
                    }
                    edit_avatar_info.scale_width = img.width;
                    edit_avatar_info.scale_height = img.height;
                    $(img)
                        .removeClass('Hidden')
                        .Jcrop({
                            aspectRatio: 1,
                            addClass: 'jcrop-dark',
                            onSelect: function (c) {
                                $('#save_changes_avatar').html('<span>'+avatar_model_save_btn.status.unsaved+'</span>').removeClass('CommonBtnDisabled');
                                edit_avatar_info.x = c.x;
                                edit_avatar_info.y = c.y;
                                edit_avatar_info.w = c.w;
                                edit_avatar_info.h = c.h;
                            }
                        });
                    $('#save_changes_avatar').html('<span>'+avatar_model_save_btn.status.updated+'</span>').addClass('CommonBtnDisabled');
                }
                img.src = $('img#avatar').attr('src');
                $('#avatar_edit_image').html(img);
                $(img).addClass('Hidden');
            }

            /* called from 'iframe-file-upload.js'
             * prepare avatar view before upload image
             */
            this.start_upload_avatar = function () {
                $('img#avatar').hide();
            }

            /* called from 'iframe-file-upload.js'
             * called when image file successfully uploaded to server
             */
            this.upload_avatar_callback = function (/*Object*/data) {
                if ( data.error == '' ) { //success
                    $('#edit_avatar_context_menu').addClass('Hidden');

                    //update '#profileAvatar' on master and '#avatar' on edit form
                    $('img#profileAvatar, img#avatar').attr('src', Public.ROOT_URL+'/'+data.upload_path+'/'+data.upload_filename+'?'+(new Date().valueOf()));
                    $('img#profileAvatar').fadeIn('medium');
                    $('img#avatar').fadeIn('medium');

                    //display edit && remove avatar link
                    $('a[href="#edit_avatar"]').eq(0).removeClass('Hidden');
                    $('a[href="#remove_avatar"]').eq(0).removeClass('Hidden');

                    _showSuccessMsg('Avatar is upload successfully', function () { _startEditAvatar() });
                }
                else { //failure
                    $('img#avatar').show();
                    _showErrorMsg(data.error);
                }
            }

            //constructor
            if ( $('#edit_avatar').length > 0 ) {
                $('#upload_avatar_modal').dialog({
                    autoOpen: false,
                    resizable: false,
                    modal: true,
                    title: 'Edit your own avatar',
                    width: 700,
                    height: 'auto',
                    open: function (event, ui) {
                        on_edit_avatar_modal_open();
                    },
                    close: function () {
                        $('#upload_avatar_modal').addClass('Hidden');
                        $('#avatar_edit_image').empty();
                    }
                });
                $('#edit_avatar').bind('click', function (e) {
                    $('#edit_avatar_context_menu')
                        .removeClass('Hidden')
                        .position({
                            my: 'left top',
                            at: 'right top',
                            offset: '0 -1px',
                            of: $(this),
                            collision: 'flip'
                        });
                    return false;
                });
                /* handle links on context menu
                 */
                $('#edit_avatar_context_menu a').bind('click', function (e) {
                    switch ( $(this).attr('href') ) {
                        case '#upload_avatar':
                            break;
                        case '#edit_avatar':
                            _startEditAvatar();
                            break;
                        case '#remove_avatar':
                            Public.confirm('Confirm delete?', '<p>You are about to <strong>delete current avatar</strong>, this action <strong>can not be undone.</strong><br /><br /><strong>Confirm ?</strong></p>', {
                                confirmed: function (e) {
                                    Public.hide_msgbox('confirm');
                                    $('img#avatar').css({opacity: 0.5});
                                    $.ajax({
                                        type: 'post',
                                        url: Public.ROOT_URL+'/auth/removeAvatar/'+Public.LOGGED_IN_UID,
                                        dataType: 'json',
                                        success: function (response, textStatus, jqXHR) {
                                            if ( response == true ) {
                                                //hide edit && remove avatar link
                                                $('a[href="#edit_avatar"]').eq(0).addClass('Hidden');
                                                $('a[href="#remove_avatar"]').eq(0).addClass('Hidden');

                                                $('img#profileAvatar').attr('src', Public.ROOT_URL+'/images/default-avatar.png'+'?'+(new Date().valueOf()));

                                                $('img#avatar')
                                                    .attr('src', Public.ROOT_URL+'/images/default-avatar-fullsize.png'+'?'+(new Date().valueOf()))
                                                    .css({opacity: 1});

                                                if ( global_timer != null ) { clearTimeout(global_timer); }
                                                $('#upload_avatar_msgbox').stop()
                                                    .addClass('SuccessBox')
                                                    .find('#upload_avatar_response').eq(0).html('Avatar is removed :)').end().end()
                                                    .hide().removeClass('Hidden').fadeIn('medium', function () {
                                                        global_timer = setTimeout(function () {
                                                            $('#upload_avatar_msgbox').fadeOut('medium', function () {
                                                                $('#upload_avatar_msgbox').addClass('Hidden')
                                                            });
                                                        }, 2000);
                                                    });
                                            }
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {}
                                    });
                                },
                                canceled: function (e) {}
                            });

                            break;
                    }
                    $('#edit_avatar_context_menu').addClass('Hidden');
                    return false;
                });
                $('#edit_avatar_context_menu').bind('click', function (e) {
                    e.stopPropagation();
                });
                $(document).bind('click', function (e) {
                    if ( !$('#edit_avatar_context_menu').hasClass('Hidden') ) {
                        $('#edit_avatar_context_menu').addClass('Hidden');
                    }
                });
                /* edit avatar on modal
                 */
                $('#save_changes_avatar').bind('click', function (e) {
                    if ( $(this).hasClass('CommonBtnDisabled') ) { return false; }
                    var self = $(this);
                    $(this).html('<span>'+avatar_model_save_btn.status.processing+'</span>').addClass('CommonBtnDisabled');
                    $.ajax({
                        type: 'post',
                        url: Public.ROOT_URL+'/auth/editAvatar/'+Public.LOGGED_IN_UID,
                        data: edit_avatar_info,
                        dataType: 'json',
                        success: function (response, textStatus, jqXHR) {
                            if ( response.success == true ) {
                                self.text(avatar_model_save_btn.status.updated).addClass('Disabled');
                                $('#upload_avatar_modal').addClass('Hidden').dialog('close');
                                $('img#profileAvatar, img#avatar').attr('src', response.img_path+'?'+(new Date().valueOf()));
                                _showSuccessMsg('Avatar is updated :)');
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {}
                    });
                    return false;
                });
                $('#cancel_changes_avatar').bind('click', function (e) {
                    $('#upload_avatar_modal').addClass('Hidden').dialog('close');
                    return false;
                });
            }
        }
    })(jQuery);
});