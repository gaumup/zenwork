<?php
    $followed = false;
    foreach ( $stream['Stream_follower'] as $_follower ) {
        if ( $this->Session->read('Auth.User.id') == $_follower['uid'] ) {
            $followed = true;
            break;
        }
    }
    echo $this->element('stream_dialog_tab', array(
        'active' => 'Comment',
        'sid' => $sid,
        'countComment' => count($commentList),
        'countAttachment' => count($stream['Attachment']),
        'countFollower' => count($stream['Stream_follower']),
        'followed' => $followed
    ));
?>
<div class="StreamContentWrapper StreamScrollContent">
    <div class="StreamContentInside StreamCommentBox">
        <div class="StreamCommentInputBox">
            <form action="/" method="post">
                <div id="streamCommentInputBoxWrapper" class="StreamCommentInputBoxWrapper">
                    <textarea rel="#postCommentBtn" id="streamCommentInputBox" class="Textarea AutoResizeTextbox" placeholder="Write your message here" spellcheck="false"></textarea>
                    <ul class="CommentBoxAttachment" id="commentBoxAttachment"></ul>
                    <div class="CommentAttachmentBox">
                        <span id="streamBrowseFileBtn" title="Attach file in comment<br />(max file size is 10MB)" class="CommentAttachmentBtn QTip">Attach file in comment</span>

                        <a href="<?php echo Configure::read('root_url').'/app/addComment/'.$sid; ?>" class="CommonButtonLnk CommonButtonLnkSmall StreamCommentDialogBtn" title="Post message" id="postCommentBtn">Post message</a>
                    </div>
                </div>
                <span class="StreamTip"><strong>TIP:</strong>&nbsp;Press&nbsp;<strong>Tab+Enter</strong>&nbsp;to send comment</span>
            </form>
        </div>

        <ul class="StreamCommentList" id="streamCommentList">
        <?php
            foreach ( $commentList as $comment ) {
                echo $this->element('comment_item', array('comment'=>$comment));
            }
        ?>
        </ul>
    </div>
</div>