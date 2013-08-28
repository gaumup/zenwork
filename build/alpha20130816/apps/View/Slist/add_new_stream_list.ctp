<h3 id="streamDialogTitle"><span class="StreamDetailsTitle"><?php if ( isset($streamList) ) : ?>Edit selected plan<?php else : ?>Create new plan<?php endif; ?></span></h3>

<div class="StreamContentWrapper">
    <div class="StreamContentInside">
        <?php if ( isset($streamList) ) : ?>

        <?php if ( !$isCreator ) : ?>
        <div class="MsgBoxWrapper ErrorBox">
            <div class="MsgBox">
                <p>You are not authorized to edit this plan</p>
            </div>
        </div>
        <?php endif; ?>

        <div class="StreamBlock">
            <?php echo $this->element('avatar', array('user'=>$streamList['Creator'])); ?>
            <p class="StreamAuthor">Created by <?php echo $streamList['Creator']['username']; ?><br />
            <small><?php echo $this->Time->timeAgoInWords($streamList['Stream_list']['createdOn']); ?></small>
            </p>
        </div>
        <?php endif; ?>

        <form action="" method="post">
            <fieldset>
                <legend><?php if ( isset($streamList) ) : ?>Edit selected plan<?php else : ?>Create a new plan<?php endif; ?></legend>

                <div class="StreamBlock">
                    <label for="newPlanName">Name</label>
                    <input <?php echo (!$isCreator ? 'readonly="readonly"' : ''); ?> type="text" class="TextInput" placeholder="Plan name" id="newPlanName" value="<?php if ( isset($streamList) ) { echo htmlspecialchars($streamList['Stream_list']['name']); } ?>" />
                    <div class="MsgBoxWrapper ErrorBox Hidden">
                        <div class="MsgBox">
                            <p>Plan name can not be blank</p>
                        </div>
                    </div>
                </div>

                <div class="StreamBlock">
                    <label for="newPlanDescription">Description</label>
                    <textarea <?php echo (!$isCreator ? 'readonly="readonly"' : ''); ?> class="Textarea AutoResizeTextbox" placeholder="Description" id="newPlanDescription"><?php if ( isset($streamList) ) { echo htmlspecialchars($streamList['Stream_list']['description']); } ?></textarea>
                </div>

                <!--
                <div class="StreamBlock">
                    <label for="newPlanOwner">Owner</label>
                    <input type="text" class="TextInput SelectInput" placeholder="Choose [people, project or team] which this plan belongs to" value="" id="newPlanOwner" />
                </div>
                -->

                <?php if ( $isCreator ) : ?>
                <div class="StreamBlock ButtonRow">
                    <input type="submit" class="CommonBtn" id="submitPlanFormBtn" value="Do it !" />
                    <?php if ( isset($streamList) ) : ?>
                    <button class="CommonBtn CommonDeleteBtn" id="deletePlanFormBtn">Delete this plan</button>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </fieldset>
        </form>
    </div>
</div>