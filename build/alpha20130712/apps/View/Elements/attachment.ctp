<?php
    echo $this->element('stream_dialog_tab', array(
        'active' => 'Attachment',
        'sid' => $sid,
        'countComment' => count($stream['Scomment']),
        'countAttachment' => count($uploadFiles)
    ));
?>
<div class="StreamContentWrapper">
    <div class="StreamContentInside StreamAttachmentBox">
        <div class="StreamFixedContent">
            <form id="streamAttachmentForm" method="post" action="<?php echo Configure::read('root_url').'/app/uploadFile/'.$sid; ?>" enctype="multipart/form-data">
                <div class="StreamAttachmentHelper" id="streamBrowseDropbox">
                    <strong>Drop file here to upload</strong><br />
                    <small>(Max.&nbsp;<strong>25MB</strong> per file upload)</small><br />
                    <strong>or</strong><br />
                    <span id="streamBrowseFileBtn" class="CommonButtonLnk StreamUploadBrowse">Browse files</span>
                </div>
            </form>
        </div>
        <div class="StreamFixedContent StreamAttachmentFilterBox">
            <label>Filter: view by file type</label>
            <select id="streamAttachmentFilter">
                <option value="">All</option>
                <?php
                    $fileCate = Configure::read('fileCate');
                    foreach ( $fileCate as $key => $name ) {
                        echo '<option value="'.$key.'">'.$name.'</option>';
                    }
                ?>
            </select>
        </div>

        <ul class="StreamScrollContent StreamAttachmentList" id="streamAttachmentList">
            <?php
                foreach ( $uploadFiles as $_index => $_file ) {
                    $ext = Configure::read('ext');
                    $ext = array_key_exists($_file['Attachment']['ext'], $ext)
                        ? $ext[$_file['Attachment']['ext']]
                        : '';
                    print_r(
                        '<li class="'.$ext.'">'.
                        '    <a class="StreamCommonLnk StreamAttachmentDownloadLnk ZWPreview" target="_blank" title="Download" data-source="'.Configure::read('root_url').'/'.Configure::read('upload_path').'/'.$_file['Attachment']['filename'].'" href="'.Configure::read('root_url').'/app/download/'.$_file['Attachment']['filename'].'/'.$_file['Attachment']['name'].'"><strong>'.$_file['Attachment']['name'].'</strong>&nbsp;('.$this->Number->toReadableSize($_file['Attachment']['size']).')</a><br />'.
                        '    <small><strong>'.$_file['User']['username'].'</strong>&nbsp;added&nbsp;<em class="StreamAttachmentTime">'.$this->Time->timeAgoInWords($_file['Attachment']['since']).'</em></small>'.
                        ( $_file['Attachment']['uploader'] == $this->Session->read('Auth.User.id')
                            ? '<a class="StreamDialogRemoveBtn StreamAttachmentRemoveBtn" title="Remove" href="'.Configure::read('root_url').'/app/removeFile/'.$_file['Attachment']['id'].'">Remove</a>'
                            : ''
                        ).
                        '</li>'
                    );
                }
            ?>
        </ul>
    </div>
</div>