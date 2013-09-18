/*
 * depends on:
 * - zenwork.js
 * - jQuery
 * - zeroclipboard
 */

jQuery(document).ready(function () {
    (function($) {
        //social
        Zenwork.Social = {
            openShareBox: function () {
                Zenwork.Plugins.autocomplete(sharedEmailsInput, $('#emailsList'), {
                    isMultiple: true,
                    remoteDatasource: Zenwork.Root+'/auth/searchEmail',
                    autocomplete: {
                        minLength: 0
                    }
                });
                sharedEmailsInput.focus();
                $('#shareToBtn').bind('click', function (evt) {
                    var target = $(evt.target);
                    if ( target.hasClass('CommonBtnDisabled') ) { return false; }
                    var sharedEmails = sharedEmailsInput.val().replace(/\s+/g, '');
                    if ( sharedEmails === '' ) {
                        sharedEmailsInput.focus();
                        $('#invalidEmailsError')
                            .removeClass('Hidden')
                            .find('p:first').html('Please enter at least 1 email to share!');
                    }
                    else {
                        target.addClass('CommonBtnDisabled');
                        $('#invalidEmailsError')
                            .addClass('Hidden')
                            .find('p:first').empty();
                        Zenwork.Social.shareViaEmail(evt);
                    }
                    return false;
                });
                //clipboard
                var shareUrlInput = $('#sharedUrl');
                var clipboard = new Zenwork.Clipboard(shareUrlInput);
                clipboard.on('complete', function (client, args) {
                    shareUrlInput.select();
                    Zenwork.Notifier.notify('Text copied!', 2);
                });
            },
        
            shareViaEmail: function () {
                var target = $(e.target);
                $('#sharedEmails, #sharedMessage').attr('disabled', 'disabled');
                $.ajax({
                    type: 'POST',
                    dataType: 'json', //receive from server
                    contentType: 'json', //send to server
                    url: target.attr('href'),
                    data: JSON.stringify({
                        url: $('#sharedUrl').val(),
                        recipients: $('#sharedEmails').val(),
                        message: $('#sharedMessage').val()
                    }),
                    success: function (data, textStatus, jqXHR) {
                        Zenwork.Notifier.notify('Shared successfully!', 2);
                        $('#sharedEmails').val(data.valid);
                        if ( data.invalid !== '' ) {
                            $('#invalidEmailsError')
                                .removeClass('Hidden')
                                .find('p:first').html('<strong>Invalid emails: </strong>'+data.invalid);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if ( textStatus !== 'abort' ) {
                            alert('Really sorry for this, network error! Please try again!');
                        }
                    },
                    complete: function (jqXHR, textStatus) {
                        $('#sharedEmails, #sharedMessage').removeAttr('disabled');
                        target.removeClass('CommonBtnDisabled');
                    }
                });
            }
        }
    })(jQuery);
});