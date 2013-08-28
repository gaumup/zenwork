<h3 id="streamDialogTitle"><span class="StreamDetailsTitle">Invite people to join this plan</h3>

<div class="StreamContentWrapper">
    <div class="StreamContentInside">
        <div class="StreamBlock">
            <label>People already joined this plan</label>
            <div class="ListInvitedPeopleWrapper">
                <ul class="ListInvitedPeople" id="listInvitedPeople">
                    <li class="ListCreator QTip" title="Creator of this plan" data-qtip-my="right center" data-qtip-at="left center">
                        <?php
                            echo $this->element('avatar', array(
                                'user' => $list['Creator'],
                                'title' => ''
                            ));
                        ?>
                        <span><?php echo $list['Creator']['username']; ?></span>
                    </li>
                    <?php foreach ( $usersList as $user ) : ?>
                    <li id="invited<?php echo $user['User']['id']; ?>">
                        <?php 
                            echo $this->element('avatar', array(
                                'user'=> $user['User'],
                                'class' => 'QTip',
                                'title' => 'Participant'
                            ));
                        ?>
                        <span><?php echo $user['User']['username']; ?></span>
                        <a class="QTip RemoveUserList" href="<?php echo $user['User']['id']; ?>" rel="#invited<?php echo $user['User']['id']; ?>" title="Remove <?php echo $user['User']['username']; ?> from this plan">Remove <?php echo $user['User']['username']; ?> from this plan</a>
                    </li>
                    <?php endforeach ?>
                </ul>
            </div>
        </div>
        <div class="StreamBlock">
            <input type="text" class="TextInput" placeholder="Invite people by emails seperate emails by commas" id="invitedEmails" />
            <div id="invalidInvitedEmailsError" class="MsgBoxWrapper ErrorBox Hidden">
                <div class="MsgBox">
                    <p></p>
                </div>
            </div>
        </div>

        <div class="StreamBlock">
            <textarea id="invitedMessage" class="Textarea AutoResizeTextbox" placeholder="Tell something to them(optional)"></textarea>
        </div>

        <div class="StreamBlock ButtonRow">
            <a href="<?php echo Configure::read('root_url').'/slist/invite/'.$lid; ?>" class="CommonButtonLnk" title="Invite" id="sendListInvitation">Invite</a>
        </div>
    </div>
</div>
