<?php
    $sharedUrl = Configure::read('root_url').'/delivery/index/'.$data['year'].'/'.$data['month'].'/all?tid='.$data['tid'].'&did='.$data['did'].'&positionId='.$data['positionId'].'&startWeekTime='.$data['startWeekTime'].'&endWeekTime='.$data['endWeekTime'];

    $sharedDetailsUrl = $sharedUrl.'&action=details';
?>
<form id="" method="post" action="">
    <h3 id="streamDialogTitle"><span class="StreamDetailsTitle">Share deliverable: <?php echo $deliverable['Stream']['name']; ?></span></h3>
    <div class="StreamContentInside StreamScrollContent">
        <div class="StreamBlock">
            <input type="text" class="TextInput" placeholder="Share to people, seperate multiple emails by commas" id="sharedEmails" />
            <div id="invalidEmailsError" class="MsgBoxWrapper ErrorBox Hidden">
                <div class="MsgBox">
                    <p></p>
                </div>
            </div>
            <textarea id="sharedMessage" class="Textarea AutoResizeTextbox" placeholder="Tell something to them(optional)"></textarea>
        </div>
        <div class="StreamBlock">
            <a href="<?php echo Configure::read('root_url').'/delivery/shareByEmail/'.$data['did']; ?>" class="CommonButtonLnk" title="Share" id="shareToBtn">Share</a>
        </div>
        <div class="StreamBlock">
            <label>or manually copy URL and share this<em class="Notice01">(click on textbox below to copy share link)</em></label>
            <input type="text" readonly="readonly" class="TextInput" value="<?php echo $sharedDetailsUrl; ?>" data-clipboard-text="<?php echo $sharedDetailsUrl; ?>" id="sharedUrl" />
        </div>
    </div>
</form>