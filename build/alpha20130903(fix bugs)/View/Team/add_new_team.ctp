<h3 id="streamDialogTitle"><span class="StreamDetailsTitle"><?php if ( isset($team) ) : ?>Edit selected team<?php else : ?>Create new team<?php endif; ?></span></h3>

<div class="StreamContentWrapper">
    <div class="StreamContentInside">
        <?php if ( isset($team) ) : ?>

        <?php if ( !$isCreator ) : ?>
        <div class="MsgBoxWrapper ErrorBox">
            <div class="MsgBox">
                <p>You are not authorized to edit this plan</p>
            </div>
        </div>
        <?php endif; ?>

        <div class="StreamBlock">
            <?php echo $this->element('avatar', array('user'=>$team['Creator'])); ?>
            <p class="StreamAuthor">Created by <?php echo $team['Creator']['username']; ?><br />
            <small><?php echo $this->Time->timeAgoInWords($team['Team']['createdOn']); ?></small>
            </p>
        </div>
        <?php endif; ?>

        <form action="" method="post">
            <fieldset>
                <legend><?php if ( isset($team) ) : ?>Edit selected team<?php else : ?>Create a new team<?php endif; ?></legend>

                <div class="StreamBlock">
                    <label for="newTeamName">Team name</label>
                    <input <?php echo (!$isCreator ? 'readonly="readonly"' : ''); ?> type="text" class="TextInput" placeholder="Team name" id="newTeamName" value="<?php if ( isset($team) ) { echo htmlspecialchars($team['Team']['name']); } ?>" />
                    <div class="MsgBoxWrapper ErrorBox Hidden">
                        <div class="MsgBox">
                            <p>Team name can not be blank</p>
                        </div>
                    </div>
                </div>

                <div class="StreamBlock">
                    <label for="newTeamDescription">Description</label>
                    <textarea <?php echo (!$isCreator ? 'readonly="readonly"' : ''); ?> class="Textarea AutoResizeTextbox" placeholder="Description" id="newTeamDescription"><?php if ( isset($team) ) { echo htmlspecialchars($team['Team']['description']); } ?></textarea>
                </div>

                <?php if ( $isCreator ) : ?>
                <div class="StreamBlock ButtonRow">
                    <input type="submit" class="CommonBtn" id="submitTeamFormBtn" value="Do it !" />
                    <?php if ( isset($team) ) : ?>
                    <button class="CommonBtn CommonDeleteBtn" id="deleteTeamFormBtn">Delete this team</button>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </fieldset>
        </form>
    </div>
</div>