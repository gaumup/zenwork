<?php
    $attachFiles = '<ul class="StreamCommentAttachmentList">';
    foreach ( $comment['Attachment'] as $_index => $_file ) {
        $ext = Configure::read('ext');
        $ext = array_key_exists($_file['ext'], $ext)
            ? $ext[$_file['ext']]
            : '';
        $attachFiles .= (
            '<li class="'.$ext.'">'.
            '    <a class="StreamCommonLnk StreamAttachmentDownloadLnk ZWPreview" target="_blank" title="Download" data-source="'.Configure::read('root_url').'/'.Configure::read('upload_path').'/'.$_file['filename'].'" href="'.Configure::read('root_url').'/app/download/'.$_file['filename'].'/'.$_file['name'].'">'.$_file['name'].'&nbsp;('.$this->Number->toReadableSize($_file['size']).')</a>'.
            ($_file['uploader'] == $this->Session->read('Auth.User.id')
                ? '<a class="StreamDialogRemoveBtn StreamAttachmentRemoveBtn" title="Remove" href="'.Configure::read('root_url').'/app/removeFile/'.$_file['id'].'">Remove</a>'
                : ''
            ).
            '</li>'
        );
    }
    $attachFiles .= '</ul>';

    $maxlength = 100;
    $commentMsg = $comment['Scomment']['comment'];
    $commentMsgShort = (mb_strlen($commentMsg) < $maxlength ? $commentMsg : mb_substr($commentMsg, 0, $maxlength).'...');
    print_r(
        '<li id="comment'.$comment['Scomment']['id'].'">'.
        $this->element('avatar', array('user'=>$comment['User'])).
        '    <p>'.
        '        <strong>'.$comment['User']['username'].'</strong>'.
        '        <span class="StreamCommentTime">'.$this->Time->timeAgoInWords($comment['Scomment']['when']).'</span>'.
        '    </p>'.
        '    <p class="StreamCommentMsg" data-id="'.$comment['Scomment']['id'].'">'.nl2br(htmlspecialchars($commentMsgShort), true).(mb_strlen($commentMsg) > $maxlength ? '<a href="#" title="See more" class="SCommentViewFull">See more <span class="SCommentFullMsg Hidden">'.htmlspecialchars(htmlspecialchars($commentMsg)).'</span></a>' : '').'</p>'.
        '<div class="StreamCommentTextboxWrapper Hidden" data-id="'.$comment['Scomment']['id'].'"><textarea class="StreamCommentTextbox" data-id="'.$comment['Scomment']['id'].'">'.htmlspecialchars(htmlspecialchars($commentMsg)).'</textarea><span>Press Esc or <a href="'.$comment['Scomment']['id'].'" title="Cancel" class="StreamCommentCancelEdit">click here</a> to cancel</span></div>'.
        ( $comment['User']['id'] == $this->Session->read('Auth.User.id')
            ? (
                '<a rel="#comment'.$comment['Scomment']['id'].'" href="'.Configure::read('root_url').'/app/removeComment/'.$comment['Scomment']['id'].'" title="Remove" class="StreamDialogRemoveBtn StreamCommentRemove">Remove</a>'.
                '<a data-id="'.$comment['Scomment']['id'].'" rel="#comment'.$comment['Scomment']['id'].'" href="'.$comment['Scomment']['id'].'" title="Edit" class="StreamCommentEdit" data-text-toggle="Update">Edit</a>'
            )
            : ''
        ).
        $attachFiles.
        '</li>'
    );
?>