/*
 * depends:
 * - jQuery
 * - plupload(http://www.plupload.com/)
 * - zenwork.js
 */

Zenwork.Uploader = { //Singleton
    EVENT: {
        UPLOADED: 'uploaded.ZWUploader',
        DELETED: 'deleted.ZWUploader'
    },
    isInit: false,
    ext: {
        'bmp': 'ImageFile BmpFile',
        'gif': 'ImageFile GifFile',

        'jpe': 'ImageFile JpegFile',
        'jpg': 'ImageFile JpegFile',
        'jpeg': 'ImageFile JpegFile',
        'pjpeg': 'ImageFile JpegFile',

        'png': 'ImageFile PngFile',
        'xpng': 'ImageFile PngFile',

        'svg': 'ImageFile SvgFile',
        'svgz': 'ImageFile SvgFile',

        'tif': 'ImageFile TiffFile',
        'tiff': 'ImageFile TiffFile',

        'txt': 'TextFile TxtFile',
        'asc': 'TextFile TxtFile',

        'css': 'TextFile CssFile',

        'xhtml': 'TextFile HtmlFile',
        'html': 'TextFile HtmlFile',
        'htm': 'TextFile HtmlFile',
        'stm': 'TextFile HtmlFile',

        'xml': 'TextFile XmlFile',

        'rtf': 'TextFile RtfFile',
        'rtx': 'TextFile RtfFile',

        'js': 'TextFile JsFile',
        'zip': 'ArchivedFile ZipFile',

        'mp3': 'AudioFile',
        'aif': 'AudioFile',
        'aifc': 'AudioFile',
        'aiff': 'AudioFile',
        'au': 'AudioFile',
        'kar': 'AudioFile',
        'mid': 'AudioFile',
        'midi': 'AudioFile',
        'mp2': 'AudioFile',
        'mp3': 'AudioFile',
        'mpga': 'AudioFile',
        'ra': 'AudioFile',
        'ram': 'AudioFile',
        'rm': 'AudioFile',
        'rpm': 'AudioFile',
        'snd': 'AudioFile',
        'tsi': 'AudioFile',
        'wav': 'AudioFile',
        'wma': 'AudioFile',

        'flv': 'VideoFile',
        'fli': 'VideoFile',
        'avi': 'VideoFile',
        'qt': 'VideoFile',
        'mov': 'VideoFile',
        'movie': 'VideoFile',
        'mp2': 'VideoFile',
        'mpa': 'VideoFile',
        'mpv2': 'VideoFile',
        'mpe': 'VideoFile',
        'mpeg': 'VideoFile',
        'mpg': 'VideoFile',
        'mp4': 'VideoFile',
        'viv': 'VideoFile',
        'vivo': 'VideoFile',
        'wmv': 'VideoFile',

        'eps': 'AppFile EpsFile',
        'ps': 'AppFile PsFile',
        'psd': 'AppFile PsdFile',
        'ai': 'AppFile AiFile',
        'swf': 'AppFile SwfFile',
        'pdf': 'PdfFile',

        'doc': 'WordFile',
        'docx': 'WordFile',

        'xls': 'ExcelFile',
        'xlsx': 'ExcelFile',

        'ppt': 'PowerPointFile',
        'pptx': 'PowerPointFile'
    },
    filters: [
        {title : 'Text files', extensions: 'js,txt,asc,css,xhtml,html,htm,stm,xml,rtf,rtx'},
        {title : 'Video files', extensions: 'flv,fli,avi,qt,mov,movie,mp2,mpa,mpv2,mpe,mpeg,mpg,mp4,viv,vivo,wmv'},
        {title : 'Audio files', extensions: 'mp3,aif,aifc,aiff,au,kar,mid,midi,mp2,mp3,mpga,ra,ram,rm,rpm,snd,tsi,wav,wma'},
        {title : 'Graphic files', extensions: 'eps,ps,psd,ai,swf,pdf'},
        {title : 'Document files', extensions: 'doc,docx,xls,xlsx,ppt,pptx'},
        {title : 'Image files', extensions: 'bmp,jpg,gif,png,xpng,jpe,jpeg,pjpeg,svg,svgz,tif,tiff'},
        {title : 'Zip files', extensions: 'zip'}
    ],
    observer: null,
    init: function () {
        if ( window.plupload != undefined && window.plupload.Uploader != undefined ) {
            uploader = new plupload.Uploader({
                runtimes : 'gears,html5,flash,silverlight,browserplus',
                multiple_queues: true,
                max_file_size : '10mb',
                flash_swf_url : '/plupload/js/plupload.flash.swf',
                silverlight_xap_url : '/plupload/js/plupload.silverlight.xap',
                browse_button : 'streamBrowseFileBtn', //id: which button click to open browse files
                container : 'streamBrowseDropbox', //id: container for this component
                drop_element: 'streamBrowseDropbox', //limit to some runtimes
                url : $('#streamAttachmentForm').attr('action'), //url for upload handler on server-side
                filters: Zenwork.Uploader.filters
            });

            uploader.bind('Init', function(up, params) {
                //plupload init callback
            });

            uploader.init();

            uploader.bind('BeforeUpload', function(up, files) {
                $('#streamBrowseDropbox').removeClass('StreamAttachmentHelperDragOver');
            });

            uploader.bind('FilesAdded', function(up, files) {
                $.each(files, function(i, file) {
                    var tmp = file.name.split('.');
                    fileExt = Zenwork.Uploader.ext[tmp[tmp.length-1].toLowerCase()];
                    if ( tmp.length == 1 ) { fileExt = ''; }
                    $('#streamAttachmentList').prepend(
                        '<li class="StreamUploading '+' '+fileExt+'" id="'+file.id+'">'+
                        '    <div class="UploadProgress"></div>'+
                        '    <a target="_blank" class="StreamCommonLnk StreamAttachmentDownloadLnk ZWPreview" href="#" title="Download"><strong>'+file.name+'</strong>&nbsp;('+Number(file.size).toReadableSize()+')</a><br />'+
                        '    <small class="Invisible"><strong class="StreamUploader"></strong>&nbsp;added&nbsp;<em class="StreamAttachmentTime">a second ago</em></small>'+
                        '    <a class="Invisible Disabled StreamDialogRemoveBtn StreamAttachmentRemoveBtn" title="Remove" href="'+file.id+'">Remove</a>'+
                        '</li>'
                    );
                });

                up.refresh(); // Reposition Flash/Silverlight

                up.start();
            });

            uploader.bind('UploadProgress', function(up, file) {
                var $item = $('#' + file.id);
                $item.find('.UploadProgress').css({
                    width: $item.outerWidth()*file.percent/100
                });
            });
            uploader.bind('FileUploaded', function(up, file, data) {
                response = JSON.parse(data.response);
                if ( response == 404 ) {
                    up.stop();
                    $('.StreamAttachmentBox').html(
                        '<div class="MsgBoxWrapper ErrorBox">'+
                        '    <div class="MsgBox">'+
                        '        <p>'+Zenwork.Exception.MESSAGE['404']+'</p>'+
                        '    </div>'+
                        '</div>'
                    );
                    return Zenwork.Exception._404();
                }
                if ( response.success ) {
                    $('#'+file.id)
                        .removeClass('StreamUploading')
                        .find('.UploadProgress').remove().end()
                        .find('.StreamAttachmentDownloadLnk')
                            .attr('href', response.downloadUrl)
                            .attr('data-source', response.previewUrl)
                            .end()
                        .find('.StreamAttachmentRemoveBtn')
                            .removeClass('Disabled')
                            .attr('href', response.removeUrl)
                            .end()
                        .find('.StreamUploader').html(response.uploader).end()
                        .find('.Invisible').removeClass('Invisible');

                    if ( Zenwork.Uploader.observer !== null ) {
                        Zenwork.Uploader.observer.trigger(Zenwork.Uploader.EVENT.UPLOADED, response);
                    }
                }
                else {
                    $('#'+file.id)
                        .removeClass('StreamUploading')
                        .addClass('StreamUploadError')
                        .find('.UploadProgress').remove().end()
                        .html('<strong>Error:</strong> '+response.err+'<br /><strong>File:</strong> '+ file.name+'<a class="StreamDialogRemoveBtn StreamAttachmentRemoveBtn" href="#" title="Remove">Remove</a>');
                }
            });

            //only fire if 'filters' is used
            uploader.bind('Error', function(up, err) {
                if ( err.code == -600 ) {
                    err.message = 'Max file size is '+up.settings.max_file_size.toReadableSize();
                }
                $('#streamAttachmentList').prepend('<li class="StreamUploadError"><strong>Error:</strong> '+err.message+'<br /><strong>File:</strong> '+ err.file.name+'<a class="StreamDialogRemoveBtn StreamAttachmentRemoveBtn" href="#" title="Remove">Remove</a></li>');

                up.refresh(); // Reposition Flash/Silverlight
            });
        }

        if ( Zenwork.Uploader.isInit ) { return Zenwork.Uploader; }
        Zenwork.Uploader.isInit = true;
        $(document).off('click.ZWRemoveAttachment');
        $(document).on('click.ZWRemoveAttachment', '.StreamAttachmentRemoveBtn', function (e) {
            var $target = $(e.target);
            if ( $target.hasClass('Disabled') ) { return false; }
            var $item = $target.parent().addClass('Deleting');
            var postUrl = $target.attr('href');
            if ( postUrl == '#' ) {
                $target.parent().remove();
            }
            else {
                if ( !confirm('Sure?') ) {
                    $item.removeClass('Deleting');
                    return false;
                }
                if ( Zenwork.Uploader.post != undefined ) { Zenwork.Uploader.post.abort(); }
                Zenwork.Uploader.post = $.ajax({
                    type: 'POST',
                    url: postUrl,
                    //dataType: 'json', //receive from server
                    //contentType: 'json', //send to server
                    success: function (data, textStatus, jqXHR) {
                        $target.parent().remove();
                        if ( Zenwork.Uploader.observer !== null ) {
                            Zenwork.Uploader.observer.trigger(Zenwork.Uploader.EVENT.DELETED);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //TODO: handling error
                        alert('Really sorry for this, network error! Please try again!');
                    }
                });
            }
            e.preventDefault();
        });
        $(document).on('dragover dragenter', '#streamBrowseDropbox', function (e) {
            $(e.target).addClass('StreamAttachmentHelperDragOver');
            e.stopPropgation();
        });
        $(document).on('dragover dragenter', '#streamBrowseDropbox *', function (e) {
            $('#streamBrowseDropbox').addClass('StreamAttachmentHelperDragOver');
            e.stopPropgation();
        });
        $(document).on('drop', '#streamBrowseDropbox', function (e) {
            $(e.target).removeClass('StreamAttachmentHelperDragOver');
        });
        $(document).on('dragover', function (e) {
            $('#streamBrowseDropbox').removeClass('StreamAttachmentHelperDragOver');
        });
        $(document).on('change', '#streamAttachmentFilter', function (e) {
            $('#streamAttachmentList li')
                .removeClass('Hidden')
                .filter(':not(".'+e.target.value+'")').addClass('Hidden');
        });
    }
};

Number.prototype.toReadableSize = function () {
    var fileSizeInBytes = this;
    var i = -1;
    var byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes/1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + ' ' + byteUnits[i];
};
