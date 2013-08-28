/*
 * depends:
 * - jQuery
 * - autoresize.js
 * - json.js
 * - zenwork.js
 * - plupload.js
 */

Zenwork.Comment = { //Singleton
    EVENT: {
        POST: 'post.ZWComment',
        DELETED: 'deleted.ZWComment',
        INPUT_RESIZED: 'resized.ZWComment',
        DELETED_ATTACHMENT: 'deletedAttachment.ZWComment'
    },
    isInit: false,
    inputBox: '',
    observer: null,
    attachmentList: '',
    uploader: null,
    tmpData: '',
    init: function (containerID) {
        Zenwork.Comment.attachmentList = $('#commentBoxAttachment');
        Zenwork.Comment.inputBox = $('#streamCommentInputBox');
        Zenwork.Comment.inputBox.autoresize({
            container: containerID,
            buffer: 1,
            animate: false,
            resizeOnStart: true,
            onresize: function () {
                Zenwork.Comment.inputBox.scrollTop(1000000000);
                if ( Zenwork.Comment.observer !== null ) {
                    Zenwork.Comment.observer.trigger(Zenwork.Comment.EVENT.INPUT_RESIZED);
                } 
            }
        });
        setTimeout(function () {
            Zenwork.Comment.inputBox.focus();
        }, 1);
        Zenwork.Comment.inputBox.on('keydown', function (e) {
            if ( e.which == 9 ) {
                $($(this).attr('rel')).focus();
                e.preventDefault();
            }
        });

        //init upload
        if ( window.plupload != undefined && window.plupload.Uploader != undefined ) {
            Zenwork.Comment.uploader = uploader = new plupload.Uploader({
                runtimes : 'gears,html5,flash,silverlight,browserplus',
                multiple_queues: true,
                max_file_size : '10mb',
                flash_swf_url : '/plupload/js/plupload.flash.swf',
                silverlight_xap_url : '/plupload/js/plupload.silverlight.xap',
                browse_button : 'streamBrowseFileBtn', //id: which button click to open browse files
                container : 'streamCommentInputBoxWrapper', //id: container for this component
                drop_element: 'streamCommentInputBoxWrapper', //limit to some runtimes
                url : $('#streamCommentForm').attr('action'), //url for upload handler on server-side
                filters: Zenwork.Uploader.filters
            });

            uploader.bind('Init', function(up, params) {});

            uploader.init();

            uploader.bind('FilesAdded', function(up, files) {
                $.each(files, function(i, file) {
                    var tmp = file.name.split('.');
                    Zenwork.Comment.attachmentList.prepend(
                        '<li id="'+file.id+'">'+file.name+' <a class="CommentBoxAttachmentRemoveBtn" href="#" title="">Remove</a></li>'
                    );
                });

                up.refresh(); // Reposition Flash/Silverlight

                Zenwork.Comment.inputBox.focus();
            });

            uploader.bind('UploadProgress', function(up, file) {});

            uploader.bind('UploadComplete', function(up, files) { //all files uploaded
                $.get(Zenwork.Root+'/app/getComment/'+Zenwork.Comment.tmpData.cid, function (data) {
                    Zenwork.Comment.render(data, files.length);
                    up.splice();
                });
            });

            //only fire if 'filters' is used
            uploader.bind('Error', function(up, err) {
                if ( err.code == -600 ) {
                    err.message = 'Max file size is '+up.settings.max_file_size.toReadableSize();
                }
                Zenwork.Comment.attachmentList.prepend('<li class="StreamUploadError" id="'+err.file.id+'"><strong>Error:</strong> '+err.message+'<br /><strong>File:</strong> '+err.file.name+'<a class="CommentBoxAttachmentRemoveBtn CommentBoxAttachmentErrorRemoveBtn" href="#" title="">Remove</a></li>');

                up.refresh(); // Reposition Flash/Silverlight
            });
        }

        if ( Zenwork.Comment.isInit ) { return Zenwork.Comment; }
        Zenwork.Comment.isInit = true;
        Zenwork.Comment.render = function (data, attachment) {
            attachment = attachment !== undefined ? attachment : 0;
            Zenwork.Comment.tmpData = '';
            Zenwork.Comment.attachmentList.empty();
            Zenwork.Comment.inputBox.val('').focus();
            $('#streamCommentList').prepend(data);
            if ( Zenwork.Comment.observer !== null ) {
                Zenwork.Comment.observer.trigger(Zenwork.Comment.EVENT.POST, [data, attachment]);
            }
            $('#postCommentBtn').removeClass('Pending');
        }
        $(document).on('click', '#postCommentBtn', function (e) {
            if ( $(e.currentTarget).hasClass('Pending') ) { return false; }
            if ( Zenwork.Comment.inputBox.val() == '' ) {
                Zenwork.Comment.inputBox.focus();
                return false;
            }
            if ( Zenwork.Comment.post != undefined ) { Zenwork.Comment.post.abort(); }
            var $target = $(e.currentTarget).addClass('Pending');
            Zenwork.Comment.post = $.ajax({
                type: 'POST',
                url: $target.attr('href'),
                dataType: 'json', //receive from server
                contentType: 'json', //send to server
                data: JSON.stringify({
                    comment: Zenwork.Comment.inputBox.val(),
                    attachment: Zenwork.Comment.uploader.files.length > 0 ? true : false
                }),
                success: function (response, textStatus, jqXHR) {
                    if ( response == 404 ) {
                        $('.StreamCommentInputBox').html(
                            '<div class="MsgBoxWrapper ErrorBox">'+
                            '    <div class="MsgBox">'+
                            '        <p>'+Zenwork.Exception.MESSAGE['404']+'</p>'+
                            '    </div>'+
                            '</div>'
                        );
                        return Zenwork.Exception._404();
                    }
                    Zenwork.Comment.tmpData = response;
                    if ( response.attachment ) {
                        Zenwork.Comment.uploader.settings.url = Zenwork.Root+'/app/uploadCommentAttachment/'+response.sid+'/'+response.cid;
                        Zenwork.Comment.uploader.start();
                    }
                    else {
                        Zenwork.Comment.render(response.data);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
            return false;
        });
        $(document).on('click', '.StreamCommentRemove', function (e) {
            var $target = $(e.target);
            if ( $target.hasClass('Disabled') ) { return false; }
            var $item = $($target.attr('rel')).addClass('Deleting');
            Zenwork.Window.confirm('Sure?',
                function () {
                    if ( Zenwork.Comment.post != undefined ) { Zenwork.Comment.post.abort(); }
                    Zenwork.Comment.post = $.ajax({
                        type: 'POST',
                        url: $target.attr('href'),
                        success: function (data, textStatus, jqXHR) {
                            var attachments = $item.find('.StreamCommentAttachmentList li').length;
                            $item.remove();
                            if ( Zenwork.Comment.observer !== null ) {
                                Zenwork.Comment.observer.trigger(Zenwork.Comment.EVENT.DELETED, attachments);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if ( textStatus !== 'abort' ) {
                                alert('Really sorry for this, network error! Please try again!');
                            }
                        }
                    });
                },
                function () {
                    $item.removeClass('Deleting');
                }
            );
            return false;
        });
        $(document).off('ZWRemoveAttachment');
        $(document).on('click.ZWRemoveAttachment', '.StreamAttachmentRemoveBtn', function (e) {
            var $target = $(e.target);
            if ( $target.hasClass('Disabled') ) { return false; }
            var $item = $target.parent().addClass('Deleting');;
            var postUrl = $target.attr('href');
            if ( postUrl == '#' ) {
                $target.parent().remove();
            }
            else {
                Zenwork.Window.confirm('Sure?',
                    function () {
                        if ( Zenwork.Comment.post != undefined ) { Zenwork.Comment.post.abort(); }
                        Zenwork.Comment.post = $.ajax({
                            type: 'POST',
                            url: postUrl,
                            //dataType: 'json', //receive from server
                            //contentType: 'json', //send to server
                            success: function (data, textStatus, jqXHR) {
                                Zenwork.Comment.render(data);
                                $target.parent().remove();
                                if ( Zenwork.Comment.observer !== null ) {
                                    Zenwork.Comment.observer.trigger(Zenwork.Comment.EVENT.DELETED_ATTACHMENT);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if ( textStatus !== 'abort' ) {
                                    alert('Really sorry for this, network error! Please try again!');
                                }
                            }
                        });
                    },
                    function () {
                        $item.removeClass('Deleting');
                    }
                )
            }
            return false;
        });
        $(document).on('click', '.SCommentViewFull', function (e) {
            var $this = $(e.currentTarget);
            var parent = $this.parent();
            parent.html($this.find('span.SCommentFullMsg').text().replace(/\n/g, '<br />'));
            return false;
        });

        $(document).on('click', '.CommentBoxAttachmentRemoveBtn', function (e) {
            var $target = $(e.target);
            if ( $target.hasClass('CommentBoxAttachmentErrorRemoveBtn') ) {
                $target.parent().remove();
            }
            else {
                Zenwork.Window.confirm('Sure?', function () {
                    $target.parent().remove();
                });
            }
            return false;
        });
        $(document).on('dragover dragenter', '#streamCommentInputBoxWrapper', function (e) {
            $(e.target).addClass('StreamAttachmentHelperDragOver');
            e.stopPropgation();
        });
        $(document).on('dragover dragenter', '#streamCommentInputBoxWrapper *', function (e) {
            $('#streamCommentInputBoxWrapper').addClass('StreamAttachmentHelperDragOver');
            e.stopPropgation();
        });
        $(document).on('drop', '#streamCommentInputBoxWrapper', function (e) {
            $(e.target).removeClass('StreamAttachmentHelperDragOver');
        });
        $(document).on('dragover', function (e) {
            $('#streamCommentInputBoxWrapper').removeClass('StreamAttachmentHelperDragOver');
        });
    }
}