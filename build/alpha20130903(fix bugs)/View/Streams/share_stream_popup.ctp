<h3 id="streamDialogTitle"><span class="StreamDetailsTitle">Share this task to other people</h3>

<div class="StreamContentWrapper">
    <div class="StreamContentInside">
        <form id="" method="post" action="">
            <div class="StreamBlock">
                <input type="text" class="TextInput" placeholder="Share to people, seperate multiple emails by commas" id="sharedEmails" />
                <div id="invalidEmailsError" class="MsgBoxWrapper ErrorBox Hidden">
                    <div class="MsgBox">
                        <p></p>
                    </div>
                </div>
            </div>

            <div class="StreamBlock">
                <textarea id="sharedMessage" class="Textarea AutoResizeTextbox" placeholder="Tell something to them(optional)"></textarea>
            </div>

            <div class="StreamBlock ButtonRow">
                <a href="<?php echo Configure::read('root_url').'/streams/shareByEmail/'.$sid; ?>" class="CommonButtonLnk" title="Share" id="shareToBtn">Share</a>
            </div>

            <div class="StreamBlock">
                <label>or manually copy URL and share this<em class="Notice01">(click on textbox below to copy share link)</em></label>
                <input type="text" readonly="readonly" class="TextInput" value="<?php echo $url; ?>" data-clipboard-text="<?php echo $url; ?>" id="sharedUrl" />
            </div>
        </form>
    </div>
</div>
