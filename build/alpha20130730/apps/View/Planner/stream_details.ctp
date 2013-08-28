<h3 id="streamDialogTitle"><span class="StreamDetailsTitle"><input type="text" <?php echo $isCreator ? '' : 'readonly="readonly"'; ?> class="TextInput TextInputAlt01 <?php if ($isCreator) : ?>QTip<?php endif; ?>" <?php if ($isCreator) : ?>title="Click to edit"<?php endif; ?> value="<?php echo $stream['Stream']['name']; ?>" <?php if ($isCreator) : ?>data-qtip-my="right center" data-qtip-at="left center"<?php endif; ?> /></span></h3>

<div class="StreamContentWrapper StreamScrollContent">
    <div class="StreamContentInside">
        <div class="StreamBlock">
            <?php echo $this->element('avatar', array('user'=>$stream['Creator'])); ?>
            <p class="StreamAuthor">Created by <?php echo $stream['Creator']['username']; ?><br />
            <small><?php echo $this->Time->timeAgoInWords($stream['Stream']['createdOn']); ?></small>
            </p>
        </div>

        <?php if ( $isCreator && !empty($stream['Stream_list']) && $stream['Stream_list'][0]['id'] == 1 ) : ?>
        <div class="StreamBlock">
            <label class="ListSelectionLabel">Belongs to plan <span class="QTip QTipPermanent" title="<?php echo $stream['Stream_list'][0]['name']; ?>" id="belongsToList" data-lid="<?php if ( !empty($stream['Stream_list']) ) { echo $stream['Stream_list'][0]['id']; } else { echo 0; } ?>"><?php echo $stream['Stream_list'][0]['name']; ?></span></label>
            <input type="text" id="listSelection" name="" value="" placeholder="move to plan" class="ReassignBox ReassignBoxAlt01" spellcheck="false" />
        </div>
        <?php endif; ?>

        <div class="StreamBlock">
            <label for="sDescription">Description</label>
            <?php if ($isCreator || !empty($stream['Stream']['description']) ) : ?>
            <textarea spellcheck="false" placeholder="[no description]" id="sDescription" <?php echo $isCreator ? '' : 'readonly="readonly"'; ?> class="<?php if ($isCreator) : ?>QTip<?php endif; ?> Textarea TextareaAlt01 AutoResizeTextbox AutoSync NoLimitResizable" <?php if ($isCreator) : ?>title="Click to edit"<?php endif; ?> <?php if ($isCreator) : ?>data-qtip-my="right center" data-qtip-at="left center"<?php endif; ?>><?php echo urldecode($stream['Stream']['description']); ?></textarea>
            <?php else: ?>
            &nbsp;<span>&nbsp;&ndash;&nbsp; </span>
            <?php endif; ?>
        </div>

        <div class="StreamBlock">
            <label for="sTag<?php echo $stream['Stream']['id']; ?>">Tags</label>
            <span class="ZWHelpPopup ZWHelpPopupAlt01 QTip QTipPermanent" title="Tagging help you <strong>filter task</strong> and <strong>report base on its name</strong> easily">help</span>
            <input type="text" class="TagInput" id="sTag<?php echo $stream['Stream']['id']; ?>" placeholder="enter tag name" value="<?php echo $stream['Stream']['tag']; ?>" />
        </div>

        <?php 
            foreach ( $stream['Timeline'] as $key => $timeline ) {
                echo $this->element('stream_timeline_block', array(
                    'timeline' => $timeline,
                    'isCreator' => $isCreator,
                    'hasChild' => $hasChild,
                    'showDeleteTimelineBtn' => count($stream['Timeline']) > 1 ? true : false
                ));
            }
        ?>

        <?php if (!$hasChild && $isCreator) : ?>
        <a id="addStreamTimelineBlockBtn" href="#" title="+ Add new timeline split" class="QTip StreamAddMoreTimelineBtn">+</a>
        <?php endif; ?>

        <?php
            echo $this->element('stream_activity', array('streamLog'=>$streamLog));
        ?>
    </div>
</div>
